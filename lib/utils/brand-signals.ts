import { INVESTORS, type Investor } from "@/lib/data/investors";
import type { Stage } from "@/lib/data/taxonomy";
import { FUNDING_ROUNDS } from "@/lib/data/funding-rounds";
import { roundCadence } from "@/lib/utils/funding-analytics";
import { rankCounterparts } from "@/lib/utils/investor-affinity";

export interface ComputedSignal {
  score: number;   // 0-100
  derivation: string;
}

const REFERENCE_MONTH = "2026-06";

function monthsDiff(earlier: string, later: string): number {
  const [ey, em] = earlier.split("-").map(Number);
  const [ly, lm] = later.split("-").map(Number);
  return (ly - ey) * 12 + (lm - em);
}

/** Stage ladder index - founding is stage 0, each round climbs one rung. */
const STAGE_LADDER: Record<Stage, number> = {
  Bootstrapped: 0,
  "Pre-seed": 1,
  Seed: 2,
  "Series A": 3,
  "Series B": 4,
  "Series C+": 5,
};

/**
 * Lead-investor lookup by fuzzy name match (shared by quality + centrality).
 * Mirrors the matching the investor dataset already supports.
 */
function findInvestorByName(name: string): Investor | undefined {
  const lower = name.toLowerCase();
  return INVESTORS.find(
    (inv) =>
      inv.name.toLowerCase().includes(lower) ||
      lower.includes(inv.name.toLowerCase().split(" ")[0]),
  );
}

/**
 * Funding recency score — derived purely from lastRound.date.
 * Newer raise = higher score (recency proxy for momentum, not quality).
 * Decay: ~2pts/month; floor at 5.
 * Returns 50 (neutral) for bootstrapped/unfunded brands.
 */
export function computeFundingRecencyScore(lastRoundDate: string | undefined): ComputedSignal {
  if (!lastRoundDate) {
    return { score: 50, derivation: "No institutional round - bootstrapped / pre-seed (neutral score)" };
  }
  const months = Math.max(0, monthsDiff(lastRoundDate, REFERENCE_MONTH));
  const score = Math.max(5, Math.round(100 - months * 2));
  const yr = lastRoundDate.slice(0, 4);
  const mo = lastRoundDate.slice(5, 7);
  const label = `${yr}-${mo} (${months}mo ago) · -2pts/mo decay`;
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
      score: 30,
      derivation: `${leadInvestorName} · not in investor dataset (default 30)`,
    };
  }

  const aum = match.aumUsdMn;
  let base: number;
  if (aum === null) {
    base = 45;
  } else if (aum >= 1000) {
    base = 95;
  } else if (aum >= 500) {
    base = 85;
  } else if (aum >= 200) {
    base = 75;
  } else if (aum >= 100) {
    base = 65;
  } else if (aum >= 50) {
    base = 55;
  } else {
    base = 45;
  }

  // Dedicated consumer fund gets a +5 bonus (thesis fit)
  const bonus = match.type === "seed-fund" ? 5 : 0;
  const score = Math.min(100, base + bonus);

  const aumStr = aum !== null ? `$${aum}M AUM` : "AUM undisclosed";
  const stages = match.primaryStages.join("/");
  return {
    score,
    derivation: `${match.name} · ${aumStr} · ${stages} · ${match.type}`,
  };
}

// ── Base rate: median months between consecutive rounds, computed from the
// real funding dataset. Converts to an expected stage-climb velocity. ─────────
const CADENCE = roundCadence(FUNDING_ROUNDS);
const EXPECTED_STAGES_PER_YEAR = CADENCE.medianMonths > 0 ? 12 / CADENCE.medianMonths : 0.7;

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
    return { score: 50, derivation: "No funding rounds - stage velocity not measurable (neutral)" };
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
    return { score: 25, derivation: `${leadInvestorName} · not in network dataset (default 25)` };
  }
  const entry = CENTRALITY_BY_ID.get(match.id) ?? { raw: 0, links: 0 };
  const score = Math.max(5, Math.round((entry.raw / MAX_CENTRALITY) * 100));
  return {
    score,
    derivation: `${match.name} · ${entry.links} realized co-investment link${entry.links === 1 ? "" : "s"} · centrality ${score}/100`,
  };
}
