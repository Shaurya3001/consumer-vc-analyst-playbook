import type { Brand } from "@/lib/data/brands";
import type { SignalWeights } from "@/lib/data/taxonomy";
import { DEFAULT_SIGNAL_WEIGHTS } from "@/lib/data/taxonomy";
import { computeFundingRecencyScore, computeInvestorQualityScore } from "./brand-signals";

export interface SignalDetail {
  value: number;        // 0-100
  type: "computed" | "estimated";
  derivation: string;   // shown in UI tooltip/expanded row
}

export interface MomentumResult {
  total: number; // 0-100
  components: {
    brandedSearch: SignalDetail;
    earnedAffinity: SignalDetail;
    fundingRecency: SignalDetail;
    investorQuality: SignalDetail;
  };
  confidence: "high" | "medium" | "low";
}

export function computeMomentumScore(
  brand: Brand,
  weights: SignalWeights = DEFAULT_SIGNAL_WEIGHTS,
): MomentumResult {
  const recency = computeFundingRecencyScore(brand.lastRound.date);
  const investorQ = computeInvestorQualityScore(brand.lastRound.leadInvestor);

  const components: MomentumResult["components"] = {
    brandedSearch: {
      value: brand.signals.brandedSearchScore,
      type: "estimated",
      derivation: "Google Trends India slope proxy - compiled from public data",
    },
    earnedAffinity: {
      value: brand.signals.earnedAffinityScore,
      type: "estimated",
      derivation: "Organic UGC from sub-10k accounts - compiled from public data",
    },
    fundingRecency: {
      value: recency.score,
      type: "computed",
      derivation: recency.derivation,
    },
    investorQuality: {
      value: investorQ.score,
      type: "computed",
      derivation: investorQ.derivation,
    },
  };

  const totalWeight =
    weights.brandedSearchScore +
    weights.earnedAffinityScore +
    weights.fundingRecencyScore +
    weights.investorQualityScore;

  const weighted =
    (components.brandedSearch.value * weights.brandedSearchScore +
      components.earnedAffinity.value * weights.earnedAffinityScore +
      components.fundingRecency.value * weights.fundingRecencyScore +
      components.investorQuality.value * weights.investorQualityScore) /
    totalWeight;

  // Confidence based on estimated signals having meaningful values (computed signals always present)
  const estimatedPopulated = [
    components.brandedSearch.value,
    components.earnedAffinity.value,
  ].filter((v) => v > 0).length;

  return {
    total: Math.round(weighted),
    components,
    confidence: estimatedPopulated === 2 ? "high" : estimatedPopulated === 1 ? "medium" : "low",
  };
}

export function computeLtvCac(params: {
  aov: number;
  repeatRate: number;
  cac: number;
  contributionMargin: number;
  returnRate: number;
  avgOrderFrequency: number;
}): { ltv: number; ltvCacRatio: number; paybackMonths: number } {
  const { aov, repeatRate, cac, contributionMargin, returnRate, avgOrderFrequency } = params;
  const effectiveAov = aov * (1 - returnRate);
  const annualRevenue = effectiveAov * avgOrderFrequency;
  const annualContribution = annualRevenue * contributionMargin;
  const avgLifespanYears = repeatRate > 0 ? Math.min(1 / (1 - repeatRate) / 12, 5) : 1;
  const ltv = annualContribution * avgLifespanYears;
  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  const monthlyContribution = annualContribution / 12;
  const paybackMonths = monthlyContribution > 0 ? Math.ceil(cac / monthlyContribution) : 999;

  return {
    ltv: Math.round(ltv),
    ltvCacRatio: Math.round(ltvCacRatio * 10) / 10,
    paybackMonths,
  };
}
