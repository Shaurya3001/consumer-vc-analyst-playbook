export const SECTORS = [
  "F&B Packaged",
  "F&B Foodservice",
  "Beauty & Personal Care",
  "Fashion & Accessories",
  "Health & Wellness",
  "Home & Living",
  "Consumer Electronics",
  "Baby, Kids & Pets",
  "Consumer Services",
  "Consumer FinTech",
  "Consumer Internet",
] as const;

export type Sector = (typeof SECTORS)[number];

// QC is a GTM tag, NOT a sector - enforced by type system
export const GTM_MODELS = [
  "D2C-first",
  "Marketplace-led",
  "QC-native",
  "Omnichannel",
  "General Trade",
  "Platform",
] as const;

export type GtmModel = (typeof GTM_MODELS)[number];

export const INCOME_TIERS = [
  "Value",
  "Mass",
  "Mass-premium",
  "Premium",
  "Bharat/Tier-2+",
] as const;

export type IncomeTier = (typeof INCOME_TIERS)[number];

export const STAGES = [
  "Bootstrapped",
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
] as const;

export type Stage = (typeof STAGES)[number];

// India 1/2/3 consumer tier overlay (population-based framing)
export const INDIA_TIERS = {
  "India 1": { label: "India 1", population: "~120M", description: "Credit-card, premium-willing, English/UPI-native" },
  "India 2": { label: "India 2", population: "~300M", description: "Aspirational, price-sensitive, EMI-driven" },
  "India 3": { label: "India 3", population: "~900M+", description: "Value-first, vernacular, cash/UPI-micro" },
} as const;

export type IndiaTier = keyof typeof INDIA_TIERS;

// Momentum signal weights (default - user can re-weight via sliders)
// 3 computed (funding recency, investor quality, stage velocity)
// + 2 estimated (branded search, earned affinity).
// Co-investment centrality was removed (user feedback: network position of the
// lead investor is not a brand-momentum signal).
export const DEFAULT_SIGNAL_WEIGHTS = {
  brandedSearchScore: 20,
  earnedAffinityScore: 15,
  fundingRecencyScore: 25,
  investorQualityScore: 25,
  stageVelocityScore: 15,
} as const;

export type SignalWeights = {
  brandedSearchScore: number;
  earnedAffinityScore: number;
  fundingRecencyScore: number;
  investorQualityScore: number;
  stageVelocityScore: number;
};
