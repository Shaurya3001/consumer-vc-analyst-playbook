"use client";
import Link from "next/link";
import { ACQUISITIONS, ACQUISITION_INSIGHTS } from "@/lib/data/acquisitions";

const ACQUIRER_COLORS: Record<string, string> = {
  "Hindustan Unilever (HUL)": "bg-blue-900 text-blue-300 border-blue-700",
  "ITC": "bg-amber-900 text-amber-300 border-amber-700",
  "Marico": "bg-emerald-900 text-emerald-300 border-emerald-700",
  "Emami": "bg-violet-900 text-violet-300 border-violet-700",
};

function acquirerChip(name: string) {
  const cls = ACQUIRER_COLORS[name] ?? "bg-zinc-800 text-zinc-300 border-zinc-700";
  const short = name.replace("Hindustan Unilever (HUL)", "HUL");
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${cls}`}>{short}</span>
  );
}

export default function ExitsTrackerPage() {
  const totalDisclosed = ACQUISITION_INSIGHTS.totalDisclosedUsdMn;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm block mb-1">← Home</Link>
        <h1 className="text-xl font-bold">Exits & Acquisitions Tracker</h1>
        <p className="text-zinc-500 text-xs mt-0.5 max-w-2xl">
          FMCG incumbents acquiring D2C brands is the primary VC exit route in India consumer - not IPO.
          70%+ of FMCG acquisitions since 2020 have been D2C brands.
        </p>
      </div>

      {/* Key insight banner */}
      <div className="mx-6 mt-5 p-4 bg-amber-950/40 border border-amber-800 rounded-xl">
        <p className="text-xs text-amber-300 font-medium mb-1">Key insight</p>
        <p className="text-sm text-amber-100">{ACQUISITION_INSIGHTS.keyInsight}</p>
        <p className="text-xs text-amber-400 mt-2 font-semibold">Biggest exit: {ACQUISITION_INSIGHTS.biggestExit}</p>
      </div>

      {/* Summary stats */}
      <div className="flex gap-4 px-6 mt-5 flex-wrap">
        {[
          { label: "Deals tracked", value: ACQUISITIONS.length.toString() },
          { label: "Total disclosed value", value: `$${totalDisclosed}M+` },
          { label: "Active acquirers", value: ACQUISITION_INSIGHTS.acquirerLeaderboard.length.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-3 text-center">
            <p className="text-xl font-bold text-zinc-100 tabular-nums">{value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Acquirer leaderboard */}
      <div className="px-6 mt-6">
        <h2 className="text-sm font-semibold text-zinc-300 mb-3">Acquirer leaderboard</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {ACQUISITION_INSIGHTS.acquirerLeaderboard.map((a) => (
            <div key={a.name} className="border border-zinc-800 bg-zinc-900 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-200">{a.name.replace("Hindustan Unilever (HUL)", "HUL")}</span>
                <span className="text-lg font-bold text-zinc-100 tabular-nums">{a.deals}</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{a.note}</p>
              {a.totalUsdMn && (
                <p className="text-xs text-indigo-400 mt-1">${a.totalUsdMn}M+ disclosed</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Deals table */}
      <div className="px-6 pb-10">
        <h2 className="text-sm font-semibold text-zinc-300 mb-3">All tracked deals</h2>
        <div className="space-y-3">
          {ACQUISITIONS.sort((a, b) => b.date.localeCompare(a.date)).map((acq) => (
            <div key={acq.id} className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-zinc-100">{acq.target}</span>
                  <span className="text-zinc-600 text-xs">→</span>
                  {acquirerChip(acq.acquirer)}
                  <span className="text-xs text-zinc-500">{acq.date}</span>
                </div>
                <p className="text-xs text-zinc-400 mb-2">{acq.sector} · Founded {acq.targetFoundedYear} · Last VC stage: {acq.targetLastVcStage}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{acq.rationale}</p>
              </div>
              <div className="shrink-0 text-right">
                {acq.dealSizeInrCr ? (
                  <div>
                    <p className="text-lg font-bold text-zinc-100 tabular-nums">₹{acq.dealSizeInrCr}Cr</p>
                    {acq.dealSizeUsdMn && <p className="text-xs text-zinc-500">${acq.dealSizeUsdMn}M</p>}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-600">Undisclosed</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-700 mt-4">
          Sources: Inc42, Business Standard, Livemint, Entrackr. Deal sizes from public press releases where disclosed.
          Strategic rationale is editorial classification.
        </p>
      </div>
    </main>
  );
}
