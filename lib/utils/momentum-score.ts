import type { Brand } from "@/lib/data/brands";
import type { SignalWeights } from "@/lib/data/taxonomy";
import { DEFAULT_SIGNAL_WEIGHTS } from "@/lib/data/taxonomy";

export interface MomentumResult {
  total: number; // 0-100
  components: {
    brandedSearch: number;
    qcDistribution: number;
    earnedAffinity: number;
    operatorQuality: number;
  };
  confidence: "high" | "medium" | "low"; // how many signals are non-zero
}

export function computeMomentumScore(
  brand: Brand,
  weights: SignalWeights = DEFAULT_SIGNAL_WEIGHTS,
): MomentumResult {
  const totalWeight =
    weights.brandedSearchScore +
    weights.qcDistributionScore +
    weights.earnedAffinityScore +
    weights.operatorQualityScore;

  const weighted =
    (brand.signals.brandedSearchScore * weights.brandedSearchScore +
      brand.signals.qcDistributionScore * weights.qcDistributionScore +
      brand.signals.earnedAffinityScore * weights.earnedAffinityScore +
      brand.signals.operatorQualityScore * weights.operatorQualityScore) /
    totalWeight;

  const nonZeroSignals = [
    brand.signals.brandedSearchScore,
    brand.signals.qcDistributionScore,
    brand.signals.earnedAffinityScore,
    brand.signals.operatorQualityScore,
  ].filter((s) => s > 0).length;

  return {
    total: Math.round(weighted),
    components: {
      brandedSearch: brand.signals.brandedSearchScore,
      qcDistribution: brand.signals.qcDistributionScore,
      earnedAffinity: brand.signals.earnedAffinityScore,
      operatorQuality: brand.signals.operatorQualityScore,
    },
    confidence: nonZeroSignals >= 4 ? "high" : nonZeroSignals >= 2 ? "medium" : "low",
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
  // Simplified LTV: assumes 3-year horizon with repeat-rate-based retention
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
