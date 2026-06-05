"use client";
import Link from "next/link";
import { WHITESPACE_GRID } from "@/lib/data/whitespace";
import { MACRO_CONSUMPTION } from "@/lib/data/market-context";
import WhitespaceHeatmap from "@/components/applets/whitespace-map/WhitespaceHeatmap";
import TheRead from "@/components/layout/TheRead";

// Report-sourced stats that explain WHY the gaps exist (structural backdrop).
const BACKDROP_LABELS = [
  "Branded retail by 2030",
  "India I concentration",
  "General trade share",
  "Quick commerce GMV by 2030",
];
const BACKDROP = BACKDROP_LABELS
  .map((l) => MACRO_CONSUMPTION.find((s) => s.label === l))
  .filter((s): s is NonNullable<typeof s> => Boolean(s));

// Summary stats derived from grid
const openCells = WHITESPACE_GRID.filter((c) => c.gapScore >= 75).length;
const crowdedCells = WHITESPACE_GRID.filter((c) => c.gapScore < 25).length;
const untracked = WHITESPACE_GRID.filter((c) => c.roundCount === 0).length;

export default function WhitespaceMapPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm">← Home</Link>
            </div>
            <h1 className="text-xl font-bold">Category White-space Map</h1>
            <p className="text-zinc-500 text-xs mt-0.5 max-w-2xl">
              Sector × income-tier funding density, derived from tracked rounds + editorial gap scoring.
              Gap score (0-100): higher = more underfunded relative to market opportunity.
              Hover or click any cell for detail.
            </p>
          </div>

          {/* Summary chips */}
          <div className="flex gap-3 flex-wrap shrink-0">
            <div className="text-center bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2">
              <p className="text-xl font-bold text-rose-400 tabular-nums">{openCells}</p>
              <p className="text-xs text-zinc-500">open cells</p>
            </div>
            <div className="text-center bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2">
              <p className="text-xl font-bold text-indigo-400 tabular-nums">{crowdedCells}</p>
              <p className="text-xs text-zinc-500">crowded cells</p>
            </div>
            <div className="text-center bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2">
              <p className="text-xl font-bold text-zinc-400 tabular-nums">{untracked}</p>
              <p className="text-xs text-zinc-500">no rounds tracked</p>
            </div>
          </div>
        </div>
      </div>

      <TheRead>
        Gaps cluster where branding is shallow and distribution is hard - the Value and Bharat tiers -
        not in the metro-premium cells everyone already contests. The opportunity is rarely a thinner
        slice of a crowded category; it is the category that has not been branded yet.
      </TheRead>

      {/* Heatmap */}
      <div className="p-6">
        <WhitespaceHeatmap cells={WHITESPACE_GRID} />
      </div>

      {/* Market backdrop - report-sourced structural context for the gaps */}
      <div className="px-6 pb-2">
        <div className="border border-indigo-900 bg-indigo-950/20 rounded-xl p-4">
          <p className="text-xs text-indigo-300 font-medium mb-1">Why the gaps exist (report-sourced)</p>
          <p className="text-xs text-indigo-100/80 mb-3 max-w-3xl leading-relaxed">
            Branded penetration is still low and metro-concentrated - the structural reason so many Value
            and Bharat cells read as white space. As branding deepens and channels shift, today&apos;s gaps are
            tomorrow&apos;s categories.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BACKDROP.map((s) => (
              <a
                key={s.label}
                href={s.source}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 hover:border-zinc-600 transition-colors"
              >
                <p className="text-base font-bold text-zinc-100 tabular-nums">{s.value}</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">{s.label}</p>
                <p className="text-[10px] text-indigo-400 mt-1">{s.asOf}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Notable gaps callout */}
      <div className="px-6 pb-8 pt-6">
        <h2 className="text-sm font-semibold text-zinc-300 mb-3">Highest-gap cells worth investigating</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WHITESPACE_GRID
            .filter((c) => c.gapScore >= 82)
            .sort((a, b) => b.gapScore - a.gapScore)
            .slice(0, 6)
            .map((c) => (
              <div
                key={`${c.sector}-${c.incomeTier}`}
                className="border border-rose-900 bg-rose-950/30 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-medium text-zinc-200">{c.sector}</p>
                    <p className="text-xs text-zinc-500">{c.incomeTier}</p>
                  </div>
                  <span className="text-sm font-bold text-rose-400 tabular-nums">{c.gapScore}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{c.narrative}</p>
              </div>
            ))}
        </div>

        <p className="text-xs text-zinc-600 mt-4">
          Gap scores are editorial judgements based on tracked funding rounds vs. estimated TAM.
          They reflect VC activity in public data - not private deals or strategic capital.
          Sources: Inc42, Entrackr, YourStory, Tracxn (2019-2025).
        </p>
      </div>
    </main>
  );
}
