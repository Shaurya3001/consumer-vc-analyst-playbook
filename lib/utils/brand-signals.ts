import { INVESTORS } from "@/lib/data/investors";
import type { Stage } from "@/lib/data/taxonomy";
import { FUNDING_ROUNDS } from "@/lib/data/funding-rounds";
import { roundCadence } from "@/lib/utils/funding-analytics";
import { rankCounterparts } from "@/lib/utils/investor-affinity";
import type { Investor } from "@/lib/data/investors";
import {
  REFERENCE_MONTH,
  RECENCY_DECAY_PER_MONTH,
  RECENCY_BOOTSTRAPPED_NEUTRAL,
  STAGE_VELOCITY_NEUTRAL,
  SEED_FUND_THESIS_BONUS,
  INVESTOR_UNKNOWN_DEFAULT,
  CENTRALITY_UNKNOWN_DEFAULT,
  STAGE_LADDER,
  AUM_QUALITY_TIERS,
  NULL_AUM_BASE_BY_TYPE,
  expectedStagesPerYear,
} from "@/lib/data/scoring-spec";

export interface ComputedSignal {
  score: number;   // 0-100
  derivation: string;
}

function monthsDiff(earlier: string, later: string): number {
  const [ey, em] = earlier.split("-").map(Number);
  const [ly, lm] = later.split("-").map(Number);
  return (ly - ey) * 12 + (lm - em);
}

/**
 * Normalise an investor name for matching: lowercase, drop parentheticals like
 * "(India fund)", strip punctuation, collapse whitespace.
 */
function normalizeInvestor(s: string): string {
  return s
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ") // drop "(India fund)", "(Japan)", etc.
    .replace(/[^a-z0-9& ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Lead-investor lookup, shared by quality + centrality.
 *
 * Matches on whole, normalised names only - either name is an exact match or a
 * word-boundary prefix of the other (e.g. lead "Unilever Ventures" matches inv
 * "Unilever Ventures India"; lead "Fireside" matches "Fireside Ventures").
 * The old version fell back to the investor's FIRST WORD, which for "L Catterton"
 * was the single letter "l" - a catch-all that mis-matched any lead containing an
 * "l" (Tiger Global, Accel, ...). Whole-name boundary matching removes that.
 */
function findInvestorByName(name: string): Investor | undefined {
  const lead = normalizeInvestor(name);
  if (!lead) return undefined;
  return INVESTORS.find((inv) => {
    const n = normalizeInvestor(inv.name);
    if (!n) return false;
    return n === lead || n.startsWith(`${lead} `) || lead.startsWith(`${n} `);
  });
}

/**
 * Funding recency score — derived purely from lastRound.date.
 * Newer raise = higher score (recency proxy for momentum, not quality).
 * Decay: ~2pts/month; floor at 5.
 * Returns 50 (neutral) for bootstrapped/unfunded brands.
 */
export function computeFundingRecencyScore(lastRoundDate: string | undefined): ComputedSignal {
  if (!lastRoundDate) {
    return {
      score: RECENCY_BOOTSTRAPPED_NEUTRAL,
      derivation: "No institutional round - bootstrapped / pre-seed (neutral score)",
    };
  }
  const months = Math.max(0, monthsDiff(lastRoundDate, REFERENCE_MONTH));
  const score = Math.max(5, Math.round(100 - months * RECENCY_DECAY_PER_MONTH));
  const yr = lastRoundDate.slice(0, 4);
  const mo = lastRoundDate.slice(5, 7);
  const label = `${yr}-${mo} (${months}mo ago) · -${RECENCY_DECAY_PER_MONTH}pts/mo decay`;
  return { score, derivation: label };
}

/**
 * Investor quality score — derived from INVESTORS AUM + type.
 * Looks up the lead investor by name substring match.
 * Returns 30 (unknown) if not found in our dataset.
 * Returns 0 for bootstrapped/unfunded brands.
 */
export function computeInvestorQualityScore(leadInvestorName: string | undefined): ComputedSignal {
  if (!leadInvestorName) {
    return { score: 0, derivation: "No institutional investor on record - bootstrapped" };
  }
  const match = findInvestorByName(leadInvestorName);

  if (!match) {
    return {
      score: INVESTOR_UNKNOWN_DEFAULT,
      derivation: `${leadInvestorName} · not in investor dataset (default ${INVESTOR_UNKNOWN_DEFAULT})`,
    };
  }

  const aum = match.aumUsdMn;
  let base: number;
  let basis: string;
  if (aum !== null) {
    // Disclosed AUM drives the tier directly (first tier whose min is met).
    base = AUM_QUALITY_TIERS.find((t) => aum >= t.min)?.score ?? 45;
    basis = formatAum(aum);
  } else {
    // No disclosed AUM (sovereigns, strategics, angel networks) - estimate from
    // investor type so a GIC or an HUL is not penalised to the unknown-fund floor.
    base = NULL_AUM_BASE_BY_TYPE[match.type] ?? 45;
    basis = "AUM undisclosed";
  }

  // Dedicated consumer seed fund gets a thesis-fit bonus.
  const bonus = match.type === "seed-fund" ? SEED_FUND_THESIS_BONUS : 0;
  const score = Math.min(100, base + bonus);

  const stages = match.primaryStages.join("/");
  return {
    score,
    derivation: `${match.name} · ${basis} · ${stages} · ${match.type}`,
  };
}

/** Format a USD-millions AUM as $X.YB above 1,000M, else $XM. */
function formatAum(aumUsdMn: number): string {
  if (aumUsdMn >= 1000) {
    const b = aumUsdMn / 1000;
    return `$${b % 1 === 0 ? b : b.toFixed(1)}B AUM`;
  }
  return `$${aumUsdMn}M AUM`;
}

// ── Base rate: median months between consecutive rounds, computed from the
// real funding dataset. Converts to an expected stage-climb velocity. ─────────
const CADENCE = roundCadence(FUNDING_ROUNDS);
const EXPECTED_STAGES_PER_YEAR = expectedStagesPerYear(CADENCE.medianMonths);

/**
 * Stage-progression velocity — how fast a brand climbed the stage ladder,
 * measured against the dataset's observed round cadence.
 *
 * velocity = stages climbed since founding / years elapsed (founding → last round)
 * Scored relative to the base rate: at-base = 50, 2x base = 100.
 * Bootstrapped / unfunded brands have no rounds, so velocity is not measurable → neutral 50.
 */
export function computeStageVelocityScore(
  founded: number,
  stage: Stage,
  lastRoundDate: string | undefined,
): ComputedSignal {
  const stagesClimbed = STAGE_LADDER[stage] ?? 0;
  if (!lastRoundDate || stagesClimbed === 0) {
    return {
      score: STAGE_VELOCITY_NEUTRAL,
      derivation: "No funding rounds - stage velocity not measurable (neutral)",
    };
  }
  const lastYear = Number(lastRoundDate.slice(0, 4));
  const yearsElapsed = Math.max(0.5, lastYear - founded);
  const velocity = stagesClimbed / yearsElapsed;
  const ratio = velocity / EXPECTED_STAGES_PER_YEAR;
  const score = Math.max(5, Math.min(100, Math.round(50 * ratio)));
  const derivation = `${stage} in ${yearsElapsed % 1 === 0 ? yearsElapsed : yearsElapsed.toFixed(1)}y (founded ${founded}) = ${velocity.toFixed(1)} stages/yr vs ${EXPECTED_STAGES_PER_YEAR.toFixed(1)} base (${ratio.toFixed(1)}x · ${CADENCE.medianMonths}mo median cadence)`;
  return { score, derivation };
}

// ── Co-investment centrality: precompute every investor's realized-affinity
// degree once, then normalise so the most-networked investor scores ~100. ─────
const CENTRALITY_BY_ID: Map<string, { raw: number; links: number }> = (() => {
  const map = new Map<string, { raw: number; links: number }>();
  for (const inv of INVESTORS) {
    const counterparts = rankCounterparts(inv.id);
    let raw = 0;
    let links = 0;
    for (const c of counterparts) {
      raw += c.affinity.realizedScore;
      if (c.affinity.realizedScore >= 0.1) links += 1;
    }
    map.set(inv.id, { raw, links });
  }
  return map;
})();

const MAX_CENTRALITY = Math.max(
  1,
  ...Array.from(CENTRALITY_BY_ID.values()).map((v) => v.raw),
);

/**
 * Co-investment centrality — how networked the lead investor's cap table is.
 * Reuses the realized-affinity graph from investor-affinity.ts: a lead that
 * co-invests widely signals strong syndicate access and follow-on optionality.
 * Bootstrapped → 0. Lead not in dataset → neutral 25.
 */
export function computeCoInvestmentCentralityScore(
  leadInvestorName: string | undefined,
): ComputedSignal {
  if (!leadInvestorName) {
    return { score: 0, derivation: "No institutional investor - bootstrapped" };
  }
  const match = findInvestorByName(leadInvestorName);
  if (!match) {
    return {
      score: CENTRALITY_UNKNOWN_DEFAULT,
      derivation: `${leadInvestorName} · not in network dataset (default ${CENTRALITY_UNKNOWN_DEFAULT})`,
    };
  }
  const entry = CENTRALITY_BY_ID.get(match.id) ?? { raw: 0, links: 0 };
  const score = Math.max(5, Math.round((entry.raw / MAX_CENTRALITY) * 100));
  return {
    score,
    derivation: `${match.name} · ${entry.links} realized co-investment link${entry.links === 1 ? "" : "s"} · centrality ${score}/100`,
  };
}
