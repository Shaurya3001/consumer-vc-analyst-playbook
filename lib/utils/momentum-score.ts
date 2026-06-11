import type { Brand } from "@/lib/data/brands";
import type { SignalWeights } from "@/lib/data/taxonomy";
import { DEFAULT_SIGNAL_WEIGHTS } from "@/lib/data/taxonomy";
import {
  computeFundingRecencyScore,
  computeInvestorQualityScore,
  computeStageVelocityScore,
} from "./brand-signals";

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
    stageVelocity: SignalDetail;
  };
  confidence: "high" | "medium" | "low";
}

export function computeMomentumScore(
  brand: Brand,
  weights: SignalWeights = DEFAULT_SIGNAL_WEIGHTS,
): MomentumResult {
  const recency = computeFundingRecencyScore(brand.lastRound?.date);
  const investorQ = computeInvestorQualityScore(brand.lastRound?.leadInvestor);
  const velocity = computeStageVelocityScore(brand.founded, brand.stage, brand.lastRound?.date);

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
    stageVelocity: {
      value: velocity.score,
      type: "computed",
      derivation: velocity.derivation,
    },
  };

  const totalWeight =
    weights.brandedSearchScore +
    weights.earnedAffinityScore +
    weights.fundingRecencyScore +
    weights.investorQualityScore +
    weights.stageVelocityScore;

  const weighted =
    (components.brandedSearch.value * weights.brandedSearchScore +
      components.earnedAffinity.value * weights.earnedAffinityScore +
      components.fundingRecency.value * weights.fundingRecencyScore +
      components.investorQuality.value * weights.investorQualityScore +
      components.stageVelocity.value * weights.stageVelocityScore) /
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

// NOTE: the unit-economics LTV/CAC model lives in lib/utils/unit-economics.ts
// (computeUnitEconomics), which the sandbox uses. An earlier computeLtvCac helper
// here was removed: it was unused and had a lifespan bug (divided by 12 instead of
// by order frequency), so its LTV was wrong unless frequency happened to be 12.
