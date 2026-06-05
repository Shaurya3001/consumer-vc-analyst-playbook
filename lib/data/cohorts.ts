import type { Sector } from "./taxonomy";

export interface CohortYear {
  year: number;
  seedCount: number;       // brands that raised Seed in this year
  reachedSeriesA: number;  // of those, how many reached Series A
  reachedSeriesB: number;  // of those, how many reached Series B+
  acquired: number;        // exited via acquisition (any stage)
  shutdown: number;        // wound down / inactive
}

export interface SectorCohort {
  sector: Sector;
  cohorts: CohortYear[];
}

// Graduation funnel: of brands that raised Seed in year N, how many graduated?
// MODELED / INDICATIVE figures, triangulated from public base rates:
//  - Inc42 & Bain report ~10-20% of seed-funded Indian D2C reach Series A
//  - Series A → Series B conversion is materially thinner post-2022 funding winter
//  - 2022 cohorts are still maturing (lower realized graduation by mid-2026)
// NOT a precise audited dataset - labelled as such throughout the UI.
export const SECTOR_COHORTS: SectorCohort[] = [
  {
    sector: "Beauty & Personal Care",
    cohorts: [
      { year: 2019, seedCount: 18, reachedSeriesA: 7, reachedSeriesB: 3, acquired: 3, shutdown: 4 },
      { year: 2020, seedCount: 14, reachedSeriesA: 5, reachedSeriesB: 2, acquired: 2, shutdown: 3 },
      { year: 2021, seedCount: 24, reachedSeriesA: 9, reachedSeriesB: 2, acquired: 1, shutdown: 5 },
      { year: 2022, seedCount: 20, reachedSeriesA: 6, reachedSeriesB: 1, acquired: 1, shutdown: 4 },
      { year: 2023, seedCount: 17, reachedSeriesA: 4, reachedSeriesB: 0, acquired: 0, shutdown: 3 },
      { year: 2024, seedCount: 19, reachedSeriesA: 3, reachedSeriesB: 0, acquired: 0, shutdown: 2 },
    ],
  },
  {
    sector: "F&B Packaged",
    cohorts: [
      { year: 2019, seedCount: 22, reachedSeriesA: 8, reachedSeriesB: 4, acquired: 3, shutdown: 5 },
      { year: 2020, seedCount: 16, reachedSeriesA: 5, reachedSeriesB: 2, acquired: 2, shutdown: 4 },
      { year: 2021, seedCount: 28, reachedSeriesA: 8, reachedSeriesB: 1, acquired: 1, shutdown: 6 },
      { year: 2022, seedCount: 22, reachedSeriesA: 5, reachedSeriesB: 1, acquired: 0, shutdown: 5 },
      { year: 2023, seedCount: 19, reachedSeriesA: 3, reachedSeriesB: 0, acquired: 0, shutdown: 4 },
      { year: 2024, seedCount: 21, reachedSeriesA: 3, reachedSeriesB: 0, acquired: 0, shutdown: 3 },
    ],
  },
  {
    sector: "Health & Wellness",
    cohorts: [
      { year: 2019, seedCount: 15, reachedSeriesA: 6, reachedSeriesB: 2, acquired: 2, shutdown: 3 },
      { year: 2020, seedCount: 20, reachedSeriesA: 8, reachedSeriesB: 3, acquired: 1, shutdown: 3 },
      { year: 2021, seedCount: 30, reachedSeriesA: 10, reachedSeriesB: 2, acquired: 0, shutdown: 6 },
      { year: 2022, seedCount: 25, reachedSeriesA: 7, reachedSeriesB: 1, acquired: 0, shutdown: 5 },
      { year: 2023, seedCount: 22, reachedSeriesA: 5, reachedSeriesB: 0, acquired: 0, shutdown: 4 },
      { year: 2024, seedCount: 24, reachedSeriesA: 4, reachedSeriesB: 0, acquired: 0, shutdown: 3 },
    ],
  },
  {
    sector: "Fashion & Accessories",
    cohorts: [
      { year: 2019, seedCount: 16, reachedSeriesA: 5, reachedSeriesB: 2, acquired: 1, shutdown: 5 },
      { year: 2020, seedCount: 12, reachedSeriesA: 4, reachedSeriesB: 1, acquired: 1, shutdown: 4 },
      { year: 2021, seedCount: 21, reachedSeriesA: 6, reachedSeriesB: 1, acquired: 0, shutdown: 6 },
      { year: 2022, seedCount: 18, reachedSeriesA: 4, reachedSeriesB: 0, acquired: 0, shutdown: 5 },
      { year: 2023, seedCount: 15, reachedSeriesA: 2, reachedSeriesB: 0, acquired: 0, shutdown: 3 },
      { year: 2024, seedCount: 16, reachedSeriesA: 2, reachedSeriesB: 0, acquired: 0, shutdown: 2 },
    ],
  },
  {
    sector: "Home & Living",
    cohorts: [
      { year: 2019, seedCount: 11, reachedSeriesA: 4, reachedSeriesB: 2, acquired: 1, shutdown: 3 },
      { year: 2020, seedCount: 9, reachedSeriesA: 3, reachedSeriesB: 1, acquired: 0, shutdown: 2 },
      { year: 2021, seedCount: 15, reachedSeriesA: 5, reachedSeriesB: 1, acquired: 0, shutdown: 4 },
      { year: 2022, seedCount: 13, reachedSeriesA: 3, reachedSeriesB: 1, acquired: 0, shutdown: 3 },
      { year: 2023, seedCount: 10, reachedSeriesA: 2, reachedSeriesB: 0, acquired: 0, shutdown: 2 },
      { year: 2024, seedCount: 12, reachedSeriesA: 2, reachedSeriesB: 0, acquired: 0, shutdown: 2 },
    ],
  },
  {
    sector: "Baby, Kids & Pets",
    cohorts: [
      { year: 2019, seedCount: 8, reachedSeriesA: 3, reachedSeriesB: 1, acquired: 1, shutdown: 2 },
      { year: 2020, seedCount: 10, reachedSeriesA: 4, reachedSeriesB: 2, acquired: 0, shutdown: 2 },
      { year: 2021, seedCount: 14, reachedSeriesA: 4, reachedSeriesB: 1, acquired: 0, shutdown: 3 },
      { year: 2022, seedCount: 12, reachedSeriesA: 3, reachedSeriesB: 1, acquired: 0, shutdown: 3 },
      { year: 2023, seedCount: 11, reachedSeriesA: 2, reachedSeriesB: 0, acquired: 0, shutdown: 2 },
      { year: 2024, seedCount: 13, reachedSeriesA: 2, reachedSeriesB: 0, acquired: 0, shutdown: 2 },
    ],
  },
];

// ── Derived helpers ──────────────────────────────────────────────────────────

export interface FunnelTotals {
  seedCount: number;
  reachedSeriesA: number;
  reachedSeriesB: number;
  acquired: number;
  shutdown: number;
  stuckAtSeed: number;        // seed - A - acquired - shutdown (still seed-stage / inactive-ish)
  seedToARate: number;        // 0-1
  aToBRate: number;           // 0-1 (of those that reached A)
  seedToBRate: number;        // 0-1
}

function emptyTotals(): Omit<FunnelTotals, "seedToARate" | "aToBRate" | "seedToBRate" | "stuckAtSeed"> {
  return { seedCount: 0, reachedSeriesA: 0, reachedSeriesB: 0, acquired: 0, shutdown: 0 };
}

function finalize(t: ReturnType<typeof emptyTotals>): FunnelTotals {
  const stuckAtSeed = Math.max(0, t.seedCount - t.reachedSeriesA - t.acquired - t.shutdown);
  return {
    ...t,
    stuckAtSeed,
    seedToARate: t.seedCount > 0 ? t.reachedSeriesA / t.seedCount : 0,
    aToBRate: t.reachedSeriesA > 0 ? t.reachedSeriesB / t.reachedSeriesA : 0,
    seedToBRate: t.seedCount > 0 ? t.reachedSeriesB / t.seedCount : 0,
  };
}

/** Aggregate totals across selected sectors and a year range (inclusive). */
export function getFunnelTotals(
  sectors: Sector[] | "all",
  yearRange: [number, number],
): FunnelTotals {
  const acc = emptyTotals();
  for (const sc of SECTOR_COHORTS) {
    if (sectors !== "all" && !sectors.includes(sc.sector)) continue;
    for (const c of sc.cohorts) {
      if (c.year < yearRange[0] || c.year > yearRange[1]) continue;
      acc.seedCount += c.seedCount;
      acc.reachedSeriesA += c.reachedSeriesA;
      acc.reachedSeriesB += c.reachedSeriesB;
      acc.acquired += c.acquired;
      acc.shutdown += c.shutdown;
    }
  }
  return finalize(acc);
}

/** Per-sector totals for the comparison bar chart. */
export function getSectorRates(yearRange: [number, number]): {
  sector: Sector;
  seedToARate: number;
  aToBRate: number;
  seedCount: number;
}[] {
  return SECTOR_COHORTS.map((sc) => {
    const t = getFunnelTotals([sc.sector], yearRange);
    return {
      sector: sc.sector,
      seedToARate: t.seedToARate,
      aToBRate: t.aToBRate,
      seedCount: t.seedCount,
    };
  }).sort((a, b) => b.seedToARate - a.seedToARate);
}

export const COHORT_YEARS = [2019, 2020, 2021, 2022, 2023, 2024] as const;
