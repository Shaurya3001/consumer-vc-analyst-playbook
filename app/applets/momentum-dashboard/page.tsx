"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { BRANDS } from "@/lib/data/brands";
import { SECTORS, STAGES, DEFAULT_SIGNAL_WEIGHTS } from "@/lib/data/taxonomy";
import type { SignalWeights } from "@/lib/data/taxonomy";
import SignalWeightSliders from "@/components/applets/momentum-dashboard/SignalWeightSliders";
import MomentumTable from "@/components/applets/momentum-dashboard/MomentumTable";
import TheRead from "@/components/layout/TheRead";

const INDIA_TIERS = ["India 1", "India 2", "India 3"] as const;

function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-zinc-500 shrink-0">{label}:</span>
      <button
        onClick={() => onChange("")}
        aria-pressed={value === ""}
        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
          value === ""
            ? "bg-indigo-600 border-indigo-500 text-white"
            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
        }`}
      >
        All
      </button>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(value === o ? "" : o)}
          aria-pressed={value === o}
          className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
            value === o
              ? "bg-indigo-600 border-indigo-500 text-white"
              : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function MomentumDashboardPage() {
  const [weights, setWeights] = useState<SignalWeights>(DEFAULT_SIGNAL_WEIGHTS);
  const [sectorFilter, setSectorFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [search, setSearch] = useState("");

  const visibleCount = useMemo(() => {
    return BRANDS.filter((b) => {
      if (sectorFilter && b.sector !== sectorFilter) return false;
      if (tierFilter && b.indiaTier !== tierFilter) return false;
      if (stageFilter && b.stage !== stageFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          b.name.toLowerCase().includes(q) ||
          b.sector.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    }).length;
  }, [sectorFilter, tierFilter, stageFilter, search]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm">← Home</Link>
            </div>
            <h1 className="text-xl font-bold">Momentum Dashboard</h1>
            <p className="text-zinc-500 text-xs mt-0.5">
              73 brands across all 11 consumer sectors - funded and bootstrapped scouting targets.
              2 signals computed from data (funding recency, investor quality); 2 estimated. Re-weight to reflect your thesis.
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold tabular-nums text-zinc-100">{visibleCount}</p>
            <p className="text-xs text-zinc-500">brands shown</p>
          </div>
        </div>
      </div>

      <TheRead>
        Momentum is a sourcing signal, not a quality verdict. Read the mix: a brand high on paid-ad
        velocity but low on branded search is buying growth, not earning it. The bootstrapped brands
        score low on investor quality by design - that is the signal. Durable stories pair organic pull
        with distribution reach; a maiden round at Rs 80 Cr bootstrapped revenue is a different risk
        profile than a Series B at the same number.
      </TheRead>

      {/* Body: two-column on desktop */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">

        {/* Left panel - controls */}
        <aside className="lg:w-72 xl:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-800 p-5 lg:sticky lg:top-0 lg:max-h-screen lg:overflow-y-auto space-y-6">

          {/* Signal weight sliders */}
          <SignalWeightSliders weights={weights} onChange={setWeights} />

          <hr className="border-zinc-800" />

          {/* Search */}
          <div>
            <label htmlFor="brand-search" className="text-xs text-zinc-500 uppercase tracking-wider block mb-2">
              Search
            </label>
            <input
              id="brand-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Brand, sector, city, tag…"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              aria-label="Search brands"
            />
          </div>

          <hr className="border-zinc-800" />

          {/* Tier filter */}
          <FilterChips
            label="Tier"
            options={INDIA_TIERS}
            value={tierFilter}
            onChange={setTierFilter}
          />

          {/* Stage filter */}
          <FilterChips
            label="Stage"
            options={STAGES}
            value={stageFilter}
            onChange={setStageFilter}
          />

          {/* Sector filter */}
          <div>
            <p className="text-xs text-zinc-500 mb-2">Sector</p>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              aria-label="Filter by sector"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">All sectors</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <hr className="border-zinc-800" />

          {/* Legend */}
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">Score legend</p>
            {[
              { range: "75-100", label: "Strong momentum", color: "bg-emerald-500" },
              { range: "55-74", label: "Building", color: "bg-amber-500" },
              { range: "0-54", label: "Early", color: "bg-zinc-600" },
            ].map(({ range, label, color }) => (
              <div key={range} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${color} shrink-0`} aria-hidden="true" />
                <span className="text-xs text-zinc-400">{range}</span>
                <span className="text-xs text-zinc-600">- {label}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-zinc-700 leading-relaxed">
            Score = weighted blend of four signals. Funding recency and investor quality are
            computed from round data. Branded search and earned affinity are estimated from
            public sources. Bootstrapped brands score 0 on investor quality - intentional.
            Data as of May 2026.
          </p>
        </aside>

        {/* Right panel - brand list */}
        <div className="flex-1 overflow-x-hidden">
          <MomentumTable
            brands={BRANDS}
            weights={weights}
            sectorFilter={sectorFilter}
            tierFilter={tierFilter}
            stageFilter={stageFilter}
            search={search}
          />
        </div>
      </div>
    </main>
  );
}
