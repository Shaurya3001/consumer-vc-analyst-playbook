import type { Sector } from "./taxonomy";

export interface UnitEconomicsDefaults {
  sector: Sector;
  aov: number;           // average order value, INR
  repeatRate: number;    // monthly repeat purchase rate, 0-1
  cac: number;           // customer acquisition cost, INR
  contributionMargin: number; // contribution margin %, 0-1
  returnRate: number;    // % orders returned, 0-1
  avgOrderFrequency: number;  // orders per year per customer
}

// Representative India-market defaults - modeled on public benchmark data
// Label as "category benchmarks - not investee-specific" on UI
export const UNIT_ECONOMICS_DEFAULTS: UnitEconomicsDefaults[] = [
  {
    sector: "Beauty & Personal Care",
    aov: 850,
    repeatRate: 0.28,
    cac: 650,
    contributionMargin: 0.42,
    returnRate: 0.08,
    avgOrderFrequency: 5,
  },
  {
    sector: "F&B Packaged",
    aov: 650,
    repeatRate: 0.45,
    cac: 420,
    contributionMargin: 0.35,
    returnRate: 0.02,
    avgOrderFrequency: 9,
  },
  {
    sector: "Health & Wellness",
    aov: 1100,
    repeatRate: 0.32,
    cac: 900,
    contributionMargin: 0.48,
    returnRate: 0.05,
    avgOrderFrequency: 6,
  },
  {
    sector: "Fashion & Accessories",
    aov: 1400,
    repeatRate: 0.18,
    cac: 1100,
    contributionMargin: 0.38,
    returnRate: 0.28,
    avgOrderFrequency: 3,
  },
  {
    sector: "Home & Living",
    aov: 2200,
    repeatRate: 0.12,
    cac: 1400,
    contributionMargin: 0.32,
    returnRate: 0.15,
    avgOrderFrequency: 2,
  },
  {
    sector: "Baby, Kids & Pets",
    aov: 900,
    repeatRate: 0.38,
    cac: 700,
    contributionMargin: 0.40,
    returnRate: 0.06,
    avgOrderFrequency: 7,
  },
];
