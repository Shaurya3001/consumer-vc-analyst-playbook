"use client";
import { useState, Fragment } from "react";
import type { WhitespaceCell } from "@/lib/data/whitespace";
import { SECTORS, INCOME_TIERS } from "@/lib/data/taxonomy";
import type { Sector, IncomeTier } from "@/lib/data/taxonomy";

interface WhitespaceHeatmapProps {
  cells: WhitespaceCell[];
}

// Gap score → background color (low gap = crowded/indigo, high gap = open/amber-to-red)
function gapColor(gap: number, roundCount: number): string {
  if (roundCount === 0 && gap >= 75) return "bg-rose-950 border-rose-800";       // clear white space
  if (gap >= 75) return "bg-rose-900 border-rose-700";
  if (gap >= 55) return "bg-amber-900 border-amber-700";
  if (gap >= 35) return "bg-zinc-800 border-zinc-700";
  if (gap >= 20) return "bg-indigo-950 border-indigo-800";
  return "bg-indigo-900 border-indigo-700";                                       // crowded
}

function gapLabel(gap: number): string {
  if (gap >= 75) return "Open";
  if (gap >= 55) return "Thin";
  if (gap >= 35) return "Active";
  return "Crowded";
}

function gapTextColor(gap: number): string {
  if (gap >= 75) return "text-rose-400";
  if (gap >= 55) return "text-amber-400";
  if (gap >= 35) return "text-zinc-400";
  return "text-indigo-400";
}

interface TooltipState {
  cell: WhitespaceCell;
  x: number;
  y: number;
}

const TIER_SHORT: Record<IncomeTier, string> = {
  "Value": "Value",
  "Mass": "Mass",
  "Mass-premium": "Mass+",
  "Premium": "Prem.",
  "Bharat/Tier-2+": "Bharat",
};

const SECTOR_SHORT: Record<Sector, string> = {
  "F&B Packaged": "F&B Pack.",
  "F&B Foodservice": "F&B Food.",
  "Beauty & Personal Care": "BPC",
  "Fashion & Accessories": "Fashion",
  "Health & Wellness": "Health",
  "Home & Living": "Home",
  "Consumer Electronics": "Elec.",
  "Baby, Kids & Pets": "Baby/Pets",
  "Consumer Services": "Services",
  "Consumer FinTech": "FinTech",
  "Consumer Internet": "Internet",
};

export default function WhitespaceHeatmap({ cells }: WhitespaceHeatmapProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [pinnedSector, setPinnedSector] = useState<Sector | null>(null);
  const [pinnedTier, setPinnedTier] = useState<IncomeTier | null>(null);

  const getCell = (sector: Sector, tier: IncomeTier) =>
    cells.find((c) => c.sector === sector && c.incomeTier === tier)!;

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLButtonElement>,
    cell: WhitespaceCell,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ cell, x: rect.left, y: rect.bottom + 8 });
  };

  return (
    <div className="relative">
      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap mb-6 text-xs">
        <span className="text-zinc-500">Funding density:</span>
        {[
          { label: "Crowded", cls: "bg-indigo-900" },
          { label: "Active", cls: "bg-zinc-800" },
          { label: "Thin", cls: "bg-amber-900" },
          { label: "Open (white space)", cls: "bg-rose-950" },
        ].map(({ label, cls }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${cls} border border-zinc-600`} aria-hidden="true" />
            <span className="text-zinc-400">{label}</span>
          </div>
        ))}
        <span className="text-zinc-600 ml-2">· click a cell to pin details</span>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div
          role="grid"
          aria-label="Funding white-space heatmap - sector by income tier"
          style={{
            display: "grid",
            gridTemplateColumns: `140px repeat(${INCOME_TIERS.length}, minmax(80px, 1fr))`,
            gap: "3px",
          }}
        >
          {/* Header row */}
          <div role="rowheader" className="p-2" aria-hidden="true" />
          {INCOME_TIERS.map((tier) => (
            <div
              key={tier}
              role="columnheader"
              className="text-center text-xs font-medium text-zinc-400 pb-2 px-1"
            >
              {TIER_SHORT[tier]}
            </div>
          ))}

          {/* Data rows */}
          {SECTORS.map((sector) => (
            <Fragment key={sector}>
              {/* Row label */}
              <div
                role="rowheader"
                className="text-xs text-zinc-400 flex items-center pr-2 leading-tight"
              >
                {SECTOR_SHORT[sector]}
              </div>

              {/* Cells */}
              {INCOME_TIERS.map((tier) => {
                const cell = getCell(sector, tier);
                const isPinned =
                  pinnedSector === sector && pinnedTier === tier;
                const isHighlightedRow =
                  pinnedSector === sector && pinnedTier !== tier;
                const isHighlightedCol =
                  pinnedTier === tier && pinnedSector !== sector;

                return (
                  <button
                    key={`${sector}-${tier}`}
                    role="gridcell"
                    aria-label={`${sector} × ${tier}: gap score ${cell.gapScore}, ${cell.roundCount} round${cell.roundCount !== 1 ? "s" : ""}`}
                    onClick={() => {
                      if (isPinned) {
                        setPinnedSector(null);
                        setPinnedTier(null);
                        setTooltip(null);
                      } else {
                        setPinnedSector(sector);
                        setPinnedTier(tier);
                        setTooltip(null);
                      }
                    }}
                    onMouseEnter={(e) => !pinnedSector && handleMouseEnter(e, cell)}
                    onMouseLeave={() => !pinnedSector && setTooltip(null)}
                    className={`
                      relative rounded border h-14 flex flex-col items-center justify-center gap-0.5
                      transition-all duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400
                      ${gapColor(cell.gapScore, cell.roundCount)}
                      ${isPinned ? "ring-2 ring-white scale-105 z-10" : ""}
                      ${isHighlightedRow || isHighlightedCol ? "opacity-50" : ""}
                      ${!pinnedSector ? "hover:scale-105 hover:z-10 cursor-pointer" : "cursor-pointer"}
                    `}
                  >
                    <span className={`text-xs font-bold tabular-nums ${gapTextColor(cell.gapScore)}`}>
                      {cell.roundCount > 0 ? `${cell.roundCount}r` : "-"}
                    </span>
                    <span className={`text-[10px] ${gapTextColor(cell.gapScore)} opacity-80`}>
                      {gapLabel(cell.gapScore)}
                    </span>
                  </button>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Hover tooltip (unpinned) */}
      {tooltip && !pinnedSector && (
        <div
          className="fixed z-50 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4 pointer-events-none"
          style={{ left: Math.min(tooltip.x, window.innerWidth - 280), top: tooltip.y }}
          role="tooltip"
        >
          <CellDetail cell={tooltip.cell} />
        </div>
      )}

      {/* Pinned detail panel */}
      {pinnedSector && pinnedTier && (() => {
        const cell = getCell(pinnedSector, pinnedTier);
        return (
          <div className="mt-6 border border-zinc-700 rounded-xl bg-zinc-900 p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-sm font-semibold text-zinc-100">
                  {cell.sector} × {cell.incomeTier}
                </p>
                <p className={`text-xs font-medium mt-0.5 ${gapTextColor(cell.gapScore)}`}>
                  {gapLabel(cell.gapScore)} - gap score {cell.gapScore}/100
                </p>
              </div>
              <button
                onClick={() => { setPinnedSector(null); setPinnedTier(null); }}
                className="text-zinc-500 hover:text-zinc-300 text-xs"
                aria-label="Close detail"
              >
                ✕ close
              </button>
            </div>
            <CellDetail cell={cell} expanded />
          </div>
        );
      })()}
    </div>
  );
}

function CellDetail({ cell, expanded = false }: { cell: WhitespaceCell; expanded?: boolean }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <div>
          <p className="text-xs text-zinc-500">Rounds tracked</p>
          <p className="text-lg font-bold tabular-nums text-zinc-100">{cell.roundCount}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Total raised</p>
          <p className="text-lg font-bold tabular-nums text-zinc-100">
            {cell.totalUsdMn > 0 ? `$${cell.totalUsdMn.toFixed(0)}M` : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Gap score</p>
          <p className={`text-lg font-bold tabular-nums ${
            cell.gapScore >= 75 ? "text-rose-400" :
            cell.gapScore >= 55 ? "text-amber-400" :
            cell.gapScore >= 35 ? "text-zinc-300" : "text-indigo-400"
          }`}>{cell.gapScore}</p>
        </div>
      </div>

      <p className="text-xs text-zinc-300 leading-relaxed">{cell.narrative}</p>

      {cell.examples.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 mb-1">Tracked companies</p>
          <div className="flex flex-wrap gap-1.5">
            {cell.examples.map((ex) => (
              <span key={ex} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700">
                {ex}
              </span>
            ))}
          </div>
        </div>
      )}

      {expanded && cell.roundCount === 0 && (
        <p className="text-xs text-rose-400 border border-rose-900 rounded-lg px-3 py-2 bg-rose-950/40">
          No funding rounds tracked in this cell - potential white space worth investigating.
        </p>
      )}
    </div>
  );
}
