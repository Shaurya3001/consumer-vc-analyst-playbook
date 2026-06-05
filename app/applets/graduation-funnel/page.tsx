"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { getFunnelTotals, COHORT_YEARS } from "@/lib/data/cohorts";
import type { Sector } from "@/lib/data/taxonomy";
import FunnelStages from "@/components/applets/graduation-funnel/FunnelStages";
import SectorComparison from "@/components/applets/graduation-funnel/SectorComparison";
import BaseRatesPanel from "@/components/applets/graduation-funnel/BaseRatesPanel";
import TheRead from "@/components/layout/TheRead";

export default function GraduationFunnelPage() {
  const [activeSector, setActiveSector] = useState<string | null>(null);
  const [yearRange, setYearRange] = useState<[number, number]>([2019, 2024]);

  const totals = useMemo(
    () => getFunnelTotals(activeSector ? [activeSector as Sector] : "all", yearRange),
    [activeSector, yearRange],
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 max-w-7xl mx-auto px-6 py-4">
        <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm block mb-1">← Home</Link>
        <h1 className="text-xl font-bold">Graduation Funnel</h1>
        <p className="text-zinc-500 text-xs mt-0.5 max-w-3xl">
          Of Indian consumer brands that raised Seed in a given year, what share graduated to Series A and
          Series B+? Base rates a VC rarely has cleanly - useful for calibrating &quot;is this a normal outcome?&quot;
        </p>
      </div>

      <TheRead>
        Roughly one in three seed-funded consumer brands reaches Series A, and far fewer reach Series B+.
        A brand that has already raised a Series A has cleared most of that cull - its risk is priced
        differently from the seed pool. Thinner 2022-24 cohorts also mean fewer survivors competing for
        the next round of growth capital.
      </TheRead>

      {/* Controls */}
      <div className="border-b border-zinc-800 max-w-7xl mx-auto px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Seed-cohort years:</span>
          <select
            value={yearRange[0]}
            onChange={(e) => setYearRange([Number(e.target.value), Math.max(Number(e.target.value), yearRange[1])])}
            aria-label="Start year"
            className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
          >
            {COHORT_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="text-zinc-600 text-xs">to</span>
          <select
            value={yearRange[1]}
            onChange={(e) => setYearRange([Math.min(yearRange[0], Number(e.target.value)), Number(e.target.value)])}
            aria-label="End year"
            className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
          >
            {COHORT_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {activeSector && (
          <button
            onClick={() => setActiveSector(null)}
            className="text-xs text-indigo-400 hover:text-indigo-300"
          >
            Showing: {activeSector} · clear filter ✕
          </button>
        )}
        {!activeSector && <span className="text-xs text-zinc-600">Showing: all sectors</span>}
      </div>

      {/* Body */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Left - the funnel */}
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-200">
              {activeSector ?? "All sectors"} · {yearRange[0]}-{yearRange[1]} cohorts
            </h2>
            <span className="text-xs text-zinc-500 tabular-nums">{totals.seedCount} seed rounds</span>
          </div>
          <FunnelStages totals={totals} />

          {/* Headline rate callouts */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4">
              <p className="text-2xl font-bold text-emerald-400 tabular-nums">
                {Math.round(totals.seedToARate * 100)}%
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Seed → Series A</p>
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-4">
              <p className="text-2xl font-bold text-amber-400 tabular-nums">
                {Math.round(totals.seedToBRate * 100)}%
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Seed → Series B+ (all the way)</p>
            </div>
          </div>
        </section>

        {/* Right - sector comparison */}
        <section>
          <SectorComparison
            yearRange={yearRange}
            activeSector={activeSector}
            onSelectSector={setActiveSector}
          />

          <div className="mt-6 border border-zinc-800 rounded-lg p-3 bg-zinc-900/40">
            <p className="text-xs text-zinc-400 font-medium mb-1">Reading this</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Later cohorts (2023-24) show lower graduation because those brands are still maturing - a
              2024 seed company has barely had time to reach Series A by mid-2026 - and faced the
              post-2022 funding winter. Compare same-vintage cohorts across sectors for the cleanest signal.
            </p>
          </div>

          <div className="mt-6">
            <BaseRatesPanel yearRange={yearRange} />
          </div>
        </section>
      </div>

      {/* Methodology */}
      <div className="px-6 pb-8 max-w-7xl mx-auto">
        <p className="text-xs text-zinc-600">
          <span className="text-zinc-400">Modeled / indicative data.</span> Cohort counts are triangulated
          from public base rates (Inc42, Bain India VC reports) - Indian consumer seed→Series A conversion
          historically runs ~10-20%. Not an audited per-company dataset; use for calibration, not diligence.
        </p>
      </div>
    </main>
  );
}
