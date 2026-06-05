import { INVESTORS, type Investor } from "@/lib/data/investors";
import type { Sector, Stage } from "@/lib/data/taxonomy";

/**
 * Investor affinity model
 *
 * Council-derived design (LLM Council, June 2026):
 * - First-Principles + Red-teamer: ally vs rival cannot collapse into one score
 * - Domain Rigorist: portfolio sets are truncated → use Szymkiewicz-Simpson
 *   overlap coefficient, NOT Jaccard (Jaccard's union denominator unfairly
 *   penalizes funds with bigger listed portfolios)
 *
 * We compute TWO separable signals, never blend them:
 *   1. REALIZED affinity - direct evidence of co-investment (shared portfolio + named affinity)
 *   2. STRUCTURAL overlap - circumstantial similarity (stage + sector)
 *
 * Band classification is derived from the relationship between the two.
 * (Internal key "rival" surfaces in the UI as the neutral label "Parallel Players".)
 *   - High structural + high realized = ALLY
 *   - High structural + zero realized   = PARALLEL PLAYER (same pond, not yet partnered)
 *   - High structural + low realized    = UNTAPPED FIT (introduction candidate)
 *   - Low structural                    = UNRELATED
 */

export interface PairAffinity {
  a: string;                       // investor id
  b: string;                       // investor id
  sharedPortfolio: string[];       // named companies in both recentBets
  reciprocallyNamed: boolean;      // does each list the other as a frequent co-investor?
  portfolioOverlap: number;        // Szymkiewicz-Simpson [0,1] - robust to truncation
  stageJaccard: number;            // [0,1] - sets are complete
  sectorJaccard: number;           // [0,1] - sets are complete
  structuralOverlap: number;       // 0.5·stage + 0.5·sector - "fish the same pond" score
  realizedScore: number;           // weighted by sharedPortfolio + reciprocal naming
  band: "ally" | "untapped" | "rival" | "unrelated";
}

/**
 * Szymkiewicz-Simpson overlap coefficient.
 * |A ∩ B| / min(|A|, |B|)
 * Use this when sets are truncated subsets - robust to size mismatch.
 */
function overlapCoefficient<T>(a: T[], b: T[]): number {
  if (a.length === 0 || b.length === 0) return 0;
  const setB = new Set(b);
  const intersection = a.filter((x) => setB.has(x)).length;
  return intersection / Math.min(a.length, b.length);
}

/**
 * Jaccard similarity.
 * |A ∩ B| / |A ∪ B|
 * Use this when sets are COMPLETE - e.g. stage list, sector list.
 */
function jaccard<T>(a: T[], b: T[]): number {
  if (a.length === 0 && b.length === 0) return 0;
  const setB = new Set(b);
  const setA = new Set(a);
  let intersection = 0;
  setA.forEach((x) => { if (setB.has(x)) intersection += 1; });
  const unionSet = new Set<T>();
  a.forEach((x) => unionSet.add(x));
  b.forEach((x) => unionSet.add(x));
  return unionSet.size === 0 ? 0 : intersection / unionSet.size;
}

function classifyBand(
  realized: number,
  structural: number,
): PairAffinity["band"] {
  // Council recommendation - preserve ally/rival as opposite signs of the same setup
  if (structural < 0.25) return "unrelated";
  if (realized >= 0.30) return "ally";              // proven partners
  if (realized >= 0.10) return "untapped";          // some signal, room to grow
  return "rival";                                    // same pond, no realized co-investment (displayed as "Parallel Players")
}

export function computePairAffinity(a: Investor, b: Investor): PairAffinity {
  // Realized signal - evidence of actual co-investment
  const sharedPortfolio = a.recentBets.filter((c) => b.recentBets.includes(c));
  const aNamesB = a.coInvestorAffinity.includes(b.name);
  const bNamesA = b.coInvestorAffinity.includes(a.name);
  const reciprocallyNamed = aNamesB && bNamesA;
  const oneWayNamed = (aNamesB || bNamesA) && !reciprocallyNamed;

  // Portfolio overlap via Szymkiewicz-Simpson (robust to truncated lists)
  const portfolioOverlap = overlapCoefficient(a.recentBets, b.recentBets);

  // Realized score: portfolio overlap is primary; reputed affinity adds context
  // We clamp portfolio overlap influence to 0.8 max so the named-affinity signal can still nudge
  let realizedScore = Math.min(portfolioOverlap, 0.8);
  if (reciprocallyNamed) realizedScore = Math.min(1, realizedScore + 0.25);
  else if (oneWayNamed) realizedScore = Math.min(1, realizedScore + 0.10);

  // Structural overlap - "do they fish the same pond"
  const stageJaccard = jaccard<Stage>(a.primaryStages, b.primaryStages);
  const sectorJaccard = jaccard<Sector>(a.activeSectors, b.activeSectors);
  const structuralOverlap = 0.5 * stageJaccard + 0.5 * sectorJaccard;

  return {
    a: a.id,
    b: b.id,
    sharedPortfolio,
    reciprocallyNamed,
    portfolioOverlap,
    stageJaccard,
    sectorJaccard,
    structuralOverlap,
    realizedScore,
    band: classifyBand(realizedScore, structuralOverlap),
  };
}

/**
 * For a given anchor investor, return ranked list of all other investors
 * with their affinity classification.
 */
export function rankCounterparts(anchorId: string): {
  investor: Investor;
  affinity: PairAffinity;
}[] {
  const anchor = INVESTORS.find((i) => i.id === anchorId);
  if (!anchor) return [];

  return INVESTORS.filter((i) => i.id !== anchorId)
    .map((other) => ({
      investor: other,
      affinity: computePairAffinity(anchor, other),
    }))
    // Sort by structural overlap first (most relevant), then realized within band
    .sort((x, y) => {
      const bandWeight: Record<PairAffinity["band"], number> = {
        ally: 4,
        untapped: 3,
        rival: 2,
        unrelated: 1,
      };
      const wDiff = bandWeight[y.affinity.band] - bandWeight[x.affinity.band];
      if (wDiff !== 0) return wDiff;
      const rDiff = y.affinity.realizedScore - x.affinity.realizedScore;
      if (Math.abs(rDiff) > 0.01) return rDiff;
      return y.affinity.structuralOverlap - x.affinity.structuralOverlap;
    });
}

/**
 * Find warm-intro paths between anchor and target.
 * Returns investors that have non-trivial realized affinity with BOTH.
 */
export function findWarmIntros(
  anchorId: string,
  targetId: string,
): { intermediary: Investor; anchorLink: PairAffinity; targetLink: PairAffinity }[] {
  const anchor = INVESTORS.find((i) => i.id === anchorId);
  const target = INVESTORS.find((i) => i.id === targetId);
  if (!anchor || !target) return [];

  return INVESTORS
    .filter((i) => i.id !== anchorId && i.id !== targetId)
    .map((intermediary) => ({
      intermediary,
      anchorLink: computePairAffinity(anchor, intermediary),
      targetLink: computePairAffinity(target, intermediary),
    }))
    .filter(
      (x) =>
        x.anchorLink.realizedScore > 0.05 && x.targetLink.realizedScore > 0.05,
    )
    .sort(
      (a, b) =>
        (b.anchorLink.realizedScore + b.targetLink.realizedScore) -
        (a.anchorLink.realizedScore + a.targetLink.realizedScore),
    );
}

/**
 * Full N×N matrix for the zoom-out view.
 */
export function buildAffinityMatrix(): PairAffinity[][] {
  const matrix: PairAffinity[][] = [];
  for (let i = 0; i < INVESTORS.length; i++) {
    matrix[i] = [];
    for (let j = 0; j < INVESTORS.length; j++) {
      if (i === j) {
        matrix[i][j] = {
          a: INVESTORS[i].id,
          b: INVESTORS[j].id,
          sharedPortfolio: [],
          reciprocallyNamed: false,
          portfolioOverlap: 1,
          stageJaccard: 1,
          sectorJaccard: 1,
          structuralOverlap: 1,
          realizedScore: 1,
          band: "unrelated",
        };
      } else {
        matrix[i][j] = computePairAffinity(INVESTORS[i], INVESTORS[j]);
      }
    }
  }
  return matrix;
}
