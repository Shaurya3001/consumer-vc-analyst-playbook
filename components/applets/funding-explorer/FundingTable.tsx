"use client";
import { useState } from "react";
import type { FundingRound } from "@/lib/data/funding-rounds";

interface FundingTableProps {
  rounds: FundingRound[];
}

const STAGE_COLORS: Record<string, string> = {
  "Pre-seed": "bg-zinc-700 text-zinc-300",
  Seed: "bg-emerald-900 text-emerald-300",
  "Series A": "bg-blue-900 text-blue-300",
  "Series B": "bg-violet-900 text-violet-300",
  "Series C+": "bg-orange-900 text-orange-300",
};

const TIER_COLORS: Record<string, string> = {
  Value: "text-zinc-400",
  Mass: "text-cyan-400",
  "Mass-premium": "text-indigo-400",
  Premium: "text-amber-400",
  "Bharat/Tier-2+": "text-emerald-400",
};

type SortKey = "date" | "amount" | "company";
type SortDir = "asc" | "desc";

export default function FundingTable({ rounds }: FundingTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...rounds].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "date") cmp = a.date.localeCompare(b.date);
    else if (sortKey === "amount") cmp = a.amount - b.amount;
    else if (sortKey === "company") cmp = a.company.localeCompare(b.company);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const SortBtn = ({ col, label }: { col: SortKey; label: string }) => (
    <button
      onClick={() => toggleSort(col)}
      aria-label={`Sort by ${label}`}
      className="flex items-center gap-1 hover:text-zinc-200 transition-colors"
    >
      {label}
      <span className="text-zinc-600">
        {sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </button>
  );

  if (rounds.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500">
        No rounds match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-zinc-500 border-b border-zinc-800">
            <th className="pb-3 pr-4 font-normal"><SortBtn col="company" label="Company" /></th>
            <th className="pb-3 pr-4 font-normal">Sector</th>
            <th className="pb-3 pr-4 font-normal hidden md:table-cell">GTM</th>
            <th className="pb-3 pr-4 font-normal hidden lg:table-cell">Tier</th>
            <th className="pb-3 pr-4 font-normal"><SortBtn col="amount" label="$ M" /></th>
            <th className="pb-3 pr-4 font-normal">Stage</th>
            <th className="pb-3 pr-4 font-normal hidden md:table-cell"><SortBtn col="date" label="Date" /></th>
            <th className="pb-3 pr-4 font-normal hidden lg:table-cell">Lead Investor</th>
            <th className="pb-3 font-normal">Source</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-900">
          {sorted.map((r) => (
            <tr key={r.id} className="hover:bg-zinc-900/50 transition-colors">
              <td className="py-3 pr-4">
                <div className="font-medium text-zinc-100 flex items-center gap-1.5">
                  {r.company}
                  {r.autoDetected && (
                    <span
                      className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800"
                      title="Detected by the daily refresh from public news; classification pending review"
                    >
                      new
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-500">{r.city}</div>
              </td>
              <td className="py-3 pr-4 text-zinc-300 text-xs max-w-[120px]">{r.sector}</td>
              <td className="py-3 pr-4 hidden md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {r.gtmModels.map((g) => (
                    <span key={g} className="text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                      {g}
                    </span>
                  ))}
                </div>
              </td>
              <td className={`py-3 pr-4 text-xs font-medium hidden lg:table-cell ${TIER_COLORS[r.incomeTier] ?? "text-zinc-400"}`}>
                {r.incomeTier}
              </td>
              <td className="py-3 pr-4 text-zinc-100 font-mono">{r.amount}</td>
              <td className="py-3 pr-4">
                <span className={`text-xs px-2 py-0.5 rounded-full ${STAGE_COLORS[r.stage] ?? "bg-zinc-700 text-zinc-300"}`}>
                  {r.stage}
                </span>
              </td>
              <td className="py-3 pr-4 text-zinc-400 hidden md:table-cell whitespace-nowrap">
                {r.date.slice(0, 7)}
              </td>
              <td className="py-3 pr-4 text-zinc-300 hidden lg:table-cell">
                <div>{r.leadInvestor}</div>
                {r.coInvestors.length > 0 && (
                  <div className="text-xs text-zinc-500 mt-0.5">
                    +{r.coInvestors.slice(0, 2).join(", ")}
                    {r.coInvestors.length > 2 && ` +${r.coInvestors.length - 2} more`}
                  </div>
                )}
              </td>
              <td className="py-3">
                <div className="flex flex-col gap-1">
                  {r.sources.slice(0, 2).map((url, i) => {
                    const host = (() => { try { return new URL(url).hostname.replace("www.", ""); } catch { return "source"; } })();
                    return (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Source for ${r.company} round: ${host}`}
                        className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                      >
                        {host}
                      </a>
                    );
                  })}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
