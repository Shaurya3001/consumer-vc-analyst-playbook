import { INVESTORS } from "@/lib/data/investors";

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
  const lower = leadInvestorName.toLowerCase();
  const match = INVESTORS.find(
    (inv) =>
      inv.name.toLowerCase().includes(lower) ||
      lower.includes(inv.name.toLowerCase().split(" ")[0])
  );

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
