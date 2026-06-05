"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { INVESTORS } from "@/lib/data/investors";
import { STAGES, SECTORS } from "@/lib/data/taxonomy";
import type { Stage, Sector } from "@/lib/data/taxonomy";
import InvestorCard from "@/components/applets/investor-map/InvestorCard";
import SyndicateShortlist from "@/components/applets/investor-map/SyndicateShortlist";
import AffinityMatrix from "@/components/applets/investor-map/AffinityMatrix";
import TheRead from "@/components/layout/TheRead";

export default function InvestorMapPage() {
  const [anchorId, setAnchorId] = useState<string>(INVESTORS[0].id);
  const [stageFilter, setStageFilter] = useState<Stage | "">("");
  const [sectorFilter, setSectorFilter] = useState<Sector | "">("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [view, setView] = useState<"shortlist" | "matrix">("shortlist");

  const filtered = useMemo(() => {
    return INVESTORS.filter((inv) => {
      if (stageFilter && !inv.primaryStages.includes(stageFilter)) return false;
      if (sectorFilter && !inv.activeSectors.includes(sectorFilter)) return false;
      if (typeFilter && inv.type !== typeFilter) return false;
      return true;
    });
  }, [stageFilter, sectorFilter, typeFilter]);

  const anchor = INVESTORS.find((i) => i.id === anchorId)!;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm block mb-1">← Home</Link>
        <h1 className="text-xl font-bold">Investor Activity Map</h1>
        <p className="text-zinc-500 text-xs mt-0.5 max-w-3xl">
          29 verified India consumer VCs. Pick an anchor investor below - the syndicate shortlist
          ranks every other fund as a Natural Ally, Untapped Fit, or Parallel Player.
          Same data, different signs.
        </p>
      </div>

      <TheRead>
        Build a syndicate on realised co-investment, not similarity. The funds most like you on stage and
        sector are often your competitors for the deal, not your partners in it - the real allies are the
        ones who have actually written cheques alongside you. Use the bands to separate the two.
      </TheRead>

      {/* Anchor status bar */}
      <div className="border-b border-zinc-800 px-6 py-3 flex items-center gap-3 flex-wrap bg-indigo-950/20">
        <span className="text-xs text-zinc-500 uppercase tracking-wider">Anchor:</span>
        <span className="text-sm font-semibold text-indigo-300">{anchor.name}</span>
        <span className="text-zinc-600 text-xs">·</span>
        <span className="text-xs text-zinc-400">{anchor.type.replace("-", " ")}</span>
        <span className="text-zinc-600 text-xs">·</span>
        <span className="text-xs text-zinc-400">${anchor.checkSizeMin}-{anchor.checkSizeMax}M cheque</span>
        {anchor.aumUsdMn && (
          <>
            <span className="text-zinc-600 text-xs">·</span>
            <span className="text-xs text-zinc-400">${anchor.aumUsdMn}M AUM</span>
          </>
        )}

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-1 bg-zinc-800 rounded-lg p-0.5">
          <button
            onClick={() => setView("shortlist")}
            aria-pressed={view === "shortlist"}
            className={`text-xs px-3 py-1 rounded-md transition-colors ${
              view === "shortlist" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Syndicate Shortlist
          </button>
          <button
            onClick={() => setView("matrix")}
            aria-pressed={view === "matrix"}
            className={`text-xs px-3 py-1 rounded-md transition-colors ${
              view === "matrix" ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Full Matrix
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-140px)]">

        {/* Left - Investor grid + filters */}
        <aside className="lg:w-[420px] xl:w-[480px] shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-800 p-4 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto">
          {/* Filters */}
          <div className="space-y-2 mb-4 pb-4 border-b border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Filter investors</p>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value as Stage | "")}
                aria-label="Filter by stage"
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="">All stages</option>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value as Sector | "")}
                aria-label="Filter by sector"
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="">All sectors</option>
                {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by fund type"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">All fund types</option>
              <option value="seed-fund">Seed funds</option>
              <option value="multi-stage">Multi-stage VCs</option>
              <option value="growth-equity">Growth / PE</option>
              <option value="strategic">Strategic (FMCG CVCs)</option>
              <option value="cvc">CVC</option>
              <option value="family-office">Family offices</option>
            </select>
            <p className="text-xs text-zinc-500 tabular-nums">{filtered.length} of {INVESTORS.length} investors</p>
          </div>

          {/* Investor grid */}
          <div className="space-y-2">
            {filtered.map((inv) => (
              <InvestorCard
                key={inv.id}
                investor={inv}
                isAnchor={inv.id === anchorId}
                onSelect={() => setAnchorId(inv.id)}
              />
            ))}
          </div>
        </aside>

        {/* Right - Hero view: Shortlist or Matrix */}
        <div className="flex-1 p-5 lg:overflow-y-auto lg:max-h-[calc(100vh-140px)]">
          {view === "shortlist" ? (
            <SyndicateShortlist anchorId={anchorId} />
          ) : (
            <AffinityMatrix anchorId={anchorId} onSelectInvestor={setAnchorId} />
          )}
        </div>
      </div>
    </main>
  );
}
