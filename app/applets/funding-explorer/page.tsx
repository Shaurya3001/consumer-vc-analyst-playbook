"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { FUNDING_ROUNDS } from "@/lib/data/funding-rounds";
import FundingFilters, { type FundingFiltersState } from "@/components/applets/funding-explorer/FundingFilters";
import FundingTable from "@/components/applets/funding-explorer/FundingTable";

const EMPTY_FILTERS: FundingFiltersState = {
  sectors: [],
  gtmModels: [],
  incomeTiers: [],
  stages: [],
  search: "",
};

export default function FundingExplorerPage() {
  const [filters, setFilters] = useState<FundingFiltersState>(EMPTY_FILTERS);

  const filtered = useMemo(() => {
    return FUNDING_ROUNDS.filter((r) => {
      if (filters.sectors.length > 0 && !filters.sectors.includes(r.sector)) return false;
      if (filters.stages.length > 0 && !filters.stages.includes(r.stage)) return false;
      if (filters.incomeTiers.length > 0 && !filters.incomeTiers.includes(r.incomeTier)) return false;
      if (filters.gtmModels.length > 0 && !r.gtmModels.some((g) => filters.gtmModels.includes(g))) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const hit =
          r.company.toLowerCase().includes(q) ||
          r.leadInvestor.toLowerCase().includes(q) ||
          r.coInvestors.some((c) => c.toLowerCase().includes(q)) ||
          r.city.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [filters]);

  const totalUsd = filtered.reduce((s, r) => s + r.amount, 0);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm">← Home</Link>
        <div>
          <h1 className="text-xl font-bold">Funding Rounds Explorer</h1>
          <p className="text-zinc-500 text-xs mt-0.5">
            Real rounds - sector, GTM model, and income tier are the site&apos;s taxonomy classifications.
            All other fields (amount, date, investors) sourced from Inc42, Entrackr, YourStory.
          </p>
        </div>
      </div>

      {/* Summary bar */}
      <div className="border-b border-zinc-800 px-6 py-3 flex gap-6 text-sm">
        <span className="text-zinc-400">
          <span className="text-zinc-100 font-medium">{filtered.length}</span> rounds
        </span>
        <span className="text-zinc-400">
          <span className="text-zinc-100 font-medium">${totalUsd.toFixed(0)}M</span> total raised
        </span>
        <span className="text-zinc-400">
          <span className="text-zinc-100 font-medium">
            {new Set(filtered.map((r) => r.company)).size}
          </span>{" "}
          companies
        </span>
      </div>

      {/* Body */}
      <div className="flex gap-0">
        {/* Filters sidebar */}
        <div className="w-72 shrink-0 border-r border-zinc-800 p-5 sticky top-0 max-h-screen overflow-y-auto">
          <FundingFilters filters={filters} onChange={setFilters} resultCount={filtered.length} />
        </div>

        {/* Table */}
        <div className="flex-1 p-6 overflow-x-auto">
          <FundingTable rounds={filtered} />
        </div>
      </div>
    </main>
  );
}
