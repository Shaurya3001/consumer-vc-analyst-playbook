import type { Stage, SignalWeights } from "./taxonomy";
import type { Investor } from "./investors";

// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for the Momentum Score.
// Both the scorer (lib/utils/brand-signals.ts) and the methodology page import
// from here, so the documented numbers can never drift from the computed ones.
// ─────────────────────────────────────────────────────────────────────────────

export const REFERENCE_MONTH = "2026-06";
export const RECENCY_DECAY_PER_MONTH = 2;
export const RECENCY_BOOTSTRAPPED_NEUTRAL = 50;
export const STAGE_VELOCITY_NEUTRAL = 50;
export const SEED_FUND_THESIS_BONUS = 5;
export const INVESTOR_UNKNOWN_DEFAULT = 30;
export const CENTRALITY_UNKNOWN_DEFAULT = 25;

/** Stage ladder index - founding is stage 0, each round climbs one rung. */
export const STAGE_LADDER: Record<Stage, number> = {
  Bootstrapped: 0,
  "Pre-seed": 1,
  Seed: 2,
  "Series A": 3,
  "Series B": 4,
  "Series C+": 5,
};

export interface AumTier {
  min: number; // USD millions
  score: number;
  label: string;
}

/** Investor-quality base when AUM is disclosed (first tier whose min is met). */
export const AUM_QUALITY_TIERS: AumTier[] = [
  { min: 1000, score: 95, label: "$1B and up" },
  { min: 500, score: 85, label: "$500M - $1B" },
  { min: 200, score: 75, label: "$200M - $500M" },
  { min: 100, score: 65, label: "$100M - $200M" },
  { min: 50, score: 55, label: "$50M - $100M" },
  { min: 0, score: 45, label: "under $50M" },
];

/** Investor-quality base when AUM is undisclosed - estimated from investor type. */
export const NULL_AUM_BASE_BY_TYPE: Record<Investor["type"], number> = {
  sovereign: 90,
  strategic: 80,
  "growth-equity": 70,
  "family-office": 68,
  "multi-stage": 65,
  cvc: 62,
  "seed-fund": 48,
  "micro-vc": 42,
  accelerator: 40,
  "angel-network": 38,
};

/** Expected stage-climb velocity implied by an observed median round cadence. */
export function expectedStagesPerYear(medianMonths: number): number {
  return medianMonths > 0 ? 12 / medianMonths : 0.7;
}

export interface ScoreBand {
  min: number;
  label: string;
  tone: string; // tailwind text color
  dot: string; // tailwind bg color
}

/** The headline score legend (matches the dashboard ring colors). */
export const SCORE_BANDS: ScoreBand[] = [
  { min: 75, label: "Strong momentum", tone: "text-emerald-400", dot: "bg-emerald-500" },
  { min: 55, label: "Building", tone: "text-amber-400", dot: "bg-amber-500" },
  { min: 0, label: "Early", tone: "text-zinc-400", dot: "bg-zinc-600" },
];

export type SignalKind = "computed" | "estimated";

export interface SignalSpec {
  key: string;
  label: string;
  kind: SignalKind;
  weightKey: keyof SignalWeights;
  accent: string; // tailwind text color
  bar: string; // tailwind bg color (matches dashboard bars)
  measures: string;
  formula: string;
  source: string;
  bootstrapped: string;
}

/** The six components of the Momentum Score, in display order. */
export const SIGNALS: SignalSpec[] = [
  {
    key: "brandedSearch",
    label: "Branded Search",
    kind: "estimated",
    weightKey: "brandedSearchScore",
    accent: "text-indigo-400",
    bar: "bg-indigo-500",
    measures: "Organic search demand for the brand name - a proxy for unpaid pull.",
    formula: "Google Trends India interest slope, scored 0-100. Not live-fetched, so it is a dated estimate, never passed off as measured.",
    source: "Google Trends (India geo), snapshot-dated per brand.",
    bootstrapped: "Estimated from public signals, same as any brand.",
  },
  {
    key: "earnedAffinity",
    label: "Earned Affinity",
    kind: "estimated",
    weightKey: "earnedAffinityScore",
    accent: "text-amber-400",
    bar: "bg-amber-500",
    measures: "Organic community pull - UGC velocity from accounts under ~10k followers.",
    formula: "Growth rate of earned posts/mentions from sub-10k accounts, 0-100. Absolute follower counts are deliberately ignored as noise.",
    source: "Public social signals, snapshot-dated.",
    bootstrapped: "Estimated from public signals, same as any brand.",
  },
  {
    key: "fundingRecency",
    label: "Funding Recency",
    kind: "computed",
    weightKey: "fundingRecencyScore",
    accent: "text-emerald-400",
    bar: "bg-emerald-500",
    measures: "How recently the brand last raised - a momentum proxy, not a quality one.",
    formula: `score = max(5, 100 - months x ${RECENCY_DECAY_PER_MONTH}), where months is the gap from the last round to ${REFERENCE_MONTH}.`,
    source: "Computed from the brand's last round date.",
    bootstrapped: `No institutional round -> neutral ${RECENCY_BOOTSTRAPPED_NEUTRAL}.`,
  },
  {
    key: "investorQuality",
    label: "Investor Quality",
    kind: "computed",
    weightKey: "investorQualityScore",
    accent: "text-rose-400",
    bar: "bg-rose-500",
    measures: "The heft of the lead investor behind the brand's last round.",
    formula: `Disclosed AUM maps to a tier; undisclosed AUM is estimated from investor type. Dedicated seed funds get +${SEED_FUND_THESIS_BONUS} (thesis fit). A lead not in the investor DB -> default ${INVESTOR_UNKNOWN_DEFAULT}.`,
    source: "Computed by matching the lead investor against the investor database.",
    bootstrapped: "No institutional investor -> 0 (intentional - that is the signal).",
  },
  {
    key: "stageVelocity",
    label: "Stage Velocity",
    kind: "computed",
    weightKey: "stageVelocityScore",
    accent: "text-cyan-400",
    bar: "bg-cyan-500",
    measures: "How fast the brand climbed the funding-stage ladder vs the market's observed cadence.",
    formula: "velocity = stages climbed since founding / years elapsed; score = clamp(50 x velocity / base-rate). At the base rate = 50, twice the base rate = 100.",
    source: "Computed from founded year, current stage, and the round-cadence base rate of the real funding dataset.",
    bootstrapped: `No rounds -> velocity not measurable -> neutral ${STAGE_VELOCITY_NEUTRAL}.`,
  },
  {
    key: "coInvestmentCentrality",
    label: "Co-investment Reach",
    kind: "computed",
    weightKey: "coInvestmentCentralityScore",
    accent: "text-fuchsia-400",
    bar: "bg-fuchsia-500",
    measures: "How networked the lead investor's syndicate is - a proxy for follow-on optionality.",
    formula: `The lead investor's realised co-investment affinity summed across all other funds, normalised so the most-networked investor is ~100. A lead not in the DB -> ${CENTRALITY_UNKNOWN_DEFAULT}.`,
    source: "Computed from the investor co-investment (affinity) graph.",
    bootstrapped: "No institutional investor -> 0.",
  },
];
