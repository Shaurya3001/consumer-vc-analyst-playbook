import type { FundingRound } from "@/lib/data/funding-rounds";
import type { Sector, Stage } from "@/lib/data/taxonomy";

// ── Pure analytics computed from the real funding-rounds dataset ──────────────
// Everything here is DERIVED from sourced round data (amount, date, stage,
// company, investors) - no modeled inputs. Works on any subset (filtered views).

const STAGE_ORDER: Stage[] = ["Pre-seed", "Seed", "Series A", "Series B", "Series C+"];

function monthsDiff(earlier: string, later: string): number {
  const [ey, em] = earlier.split("-").map(Number);
  const [ly, lm] = later.split("-").map(Number);
  return (ly - ey) * 12 + (lm - em);
}

export interface SectorStat {
  sector: Sector;
  count: number;
  totalUsd: number;
  avgUsd: number;
}

/** Deal count + capital by sector, sorted by count desc. */
export function sectorBreakdown(rounds: FundingRound[]): SectorStat[] {
  const map = new Map<Sector, { count: number; total: number }>();
  for (const r of rounds) {
    const e = map.get(r.sector) ?? { count: 0, total: 0 };
    e.count += 1;
    e.total += r.amount || 0;
    map.set(r.sector, e);
  }
  return Array.from(map.entries())
    .map(([sector, e]) => ({ sector, count: e.count, totalUsd: Math.round(e.total), avgUsd: e.count ? Math.round(e.total / e.count) : 0 }))
    .sort((a, b) => b.count - a.count);
}

export interface YearStat {
  year: number;
  count: number;
  totalUsd: number;
}

/** Deal count + capital by calendar year, ascending. */
export function yearBreakdown(rounds: FundingRound[]): YearStat[] {
  const map = new Map<number, { count: number; total: number }>();
  for (const r of rounds) {
    const y = Number(r.date.slice(0, 4));
    if (!y) continue;
    const e = map.get(y) ?? { count: 0, total: 0 };
    e.count += 1;
    e.total += r.amount || 0;
    map.set(y, e);
  }
  return Array.from(map.entries())
    .map(([year, e]) => ({ year, count: e.count, totalUsd: Math.round(e.total) }))
    .sort((a, b) => a.year - b.year);
}

export interface CadenceStat {
  pairs: number;            // number of consecutive-round intervals observed
  medianMonths: number;
  medianStepUpX: number | null; // median round-size multiple between consecutive rounds
}

/**
 * Time-between-rounds and round-size step-up, computed for companies that appear
 * 2+ times in the dataset. This is the closest thing to a real "graduation speed"
 * base rate the data can support - all from sourced dates and amounts.
 */
export function roundCadence(rounds: FundingRound[]): CadenceStat {
  const byCompany = new Map<string, FundingRound[]>();
  for (const r of rounds) {
    const arr = byCompany.get(r.company) ?? [];
    arr.push(r);
    byCompany.set(r.company, arr);
  }
  const gaps: number[] = [];
  const stepUps: number[] = [];
  for (const arr of Array.from(byCompany.values())) {
    if (arr.length < 2) continue;
    const sorted = [...arr].sort((a, b) => a.date.localeCompare(b.date));
    for (let i = 1; i < sorted.length; i++) {
      const m = monthsDiff(sorted[i - 1].date, sorted[i].date);
      if (m > 0) gaps.push(m);
      const prev = sorted[i - 1].amount;
      const cur = sorted[i].amount;
      if (prev > 0 && cur > 0) stepUps.push(cur / prev);
    }
  }
  return {
    pairs: gaps.length,
    medianMonths: median(gaps),
    medianStepUpX: stepUps.length ? Math.round(median(stepUps) * 10) / 10 : null,
  };
}

function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round(((s[mid - 1] + s[mid]) / 2) * 10) / 10;
}

export interface StageStat {
  stage: Stage;
  count: number;
  totalUsd: number;
}

/** Deal count + capital by stage, in stage order. */
export function stageBreakdown(rounds: FundingRound[]): StageStat[] {
  const map = new Map<Stage, { count: number; total: number }>();
  for (const r of rounds) {
    const e = map.get(r.stage) ?? { count: 0, total: 0 };
    e.count += 1;
    e.total += r.amount || 0;
    map.set(r.stage, e);
  }
  return STAGE_ORDER.map((stage) => {
    const e = map.get(stage) ?? { count: 0, total: 0 };
    return { stage, count: e.count, totalUsd: Math.round(e.total) };
  });
}

/**
 * Live-computed investor takeaway from a (possibly filtered) set of rounds.
 * Names the most- and least-funded sectors so the read tracks the data, not prose.
 */
export function fundingRead(rounds: FundingRound[]): string {
  if (rounds.length < 4) {
    return "Too few rounds in this view to read a pattern - widen the filters to see where capital concentrates vs. thins out.";
  }
  const sectors = sectorBreakdown(rounds);
  const top = sectors.slice(0, 2);
  const thin = sectors.filter((s) => s.count >= 1).slice(-2).reverse();
  const totalUsd = rounds.reduce((s, r) => s + (r.amount || 0), 0);
  const topNames = top.map((s) => s.sector).join(" and ");
  const thinNames = thin.map((s) => s.sector).join(" and ");
  const topCount = top.reduce((s, x) => s + x.count, 0);
  const topShare = Math.round((topCount / rounds.length) * 100);

  return `Capital is concentrated, not spread. ${topNames} alone account for ${topShare}% of the ${rounds.length} rounds in view ($${Math.round(top.reduce((s, x) => s + x.totalUsd, 0)).toLocaleString()}M of $${Math.round(totalUsd).toLocaleString()}M) - the crowded end. ${thinNames} sit at the thin end, where a differentiated entrant still finds room and pricing power.`;
}
