"use client";
import { useState, useMemo } from "react";
import { INVESTORS } from "@/lib/data/investors";
import { buildAffinityMatrix } from "@/lib/utils/investor-affinity";

interface AffinityMatrixProps {
  anchorId: string;
  onSelectInvestor: (id: string) => void;
}

// 2-channel encoding (council recommendation):
//   FILL  = realized score (0-1) → emerald hue strength
//   ALPHA = structural overlap → background tone visibility
// This visually separates "have co-invested" from "would plausibly".
function cellStyle(realized: number, structural: number, isDiagonal: boolean): React.CSSProperties {
  if (isDiagonal) {
    return { backgroundColor: "#3f3f46" };
  }
  // Realized = green channel, opacity from structural
  const r = Math.round(16 + (1 - realized) * 0);
  const g = Math.round(60 + realized * 195);
  const b = Math.round(50 + (1 - realized) * 30);
  const a = Math.max(0.08, structural);
  return { backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})` };
}

export default function AffinityMatrix({ anchorId, onSelectInvestor }: AffinityMatrixProps) {
  const matrix = useMemo(() => buildAffinityMatrix(), []);
  const [hover, setHover] = useState<{ i: number; j: number } | null>(null);

  const anchorIdx = INVESTORS.findIndex((i) => i.id === anchorId);

  return (
    <div className="relative">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-zinc-200">Co-investment matrix</h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Fill intensity = realized co-investment · opacity = structural overlap.
          Click a row or column to select that investor as anchor. Hover for evidence.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div
            className="grid gap-px text-[9px]"
            style={{
              gridTemplateColumns: `120px repeat(${INVESTORS.length}, 18px)`,
              gridAutoRows: "18px",
            }}
            role="grid"
            aria-label="Investor co-investment affinity matrix"
          >
            {/* Top-left empty cell */}
            <div className="bg-zinc-950" />

            {/* Column headers - clickable */}
            {INVESTORS.map((inv, j) => (
              <button
                key={`ch-${inv.id}`}
                role="columnheader"
                onClick={() => onSelectInvestor(inv.id)}
                aria-label={`Select ${inv.name}`}
                className={`text-zinc-500 hover:text-indigo-300 transition-colors flex items-end justify-center pb-1 ${
                  j === anchorIdx ? "bg-indigo-900/40 text-indigo-300" : "bg-zinc-950"
                }`}
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                title={inv.name}
              >
                <span className="truncate" style={{ maxHeight: "60px" }}>
                  {inv.name.split(" ")[0]}
                </span>
              </button>
            ))}

            {/* Rows */}
            {INVESTORS.map((rowInv, i) =>
              [
                <button
                  key={`rh-${rowInv.id}`}
                  role="rowheader"
                  onClick={() => onSelectInvestor(rowInv.id)}
                  aria-label={`Select ${rowInv.name}`}
                  className={`text-right pr-2 truncate text-zinc-400 hover:text-indigo-300 transition-colors text-xs ${
                    i === anchorIdx ? "bg-indigo-900/40 text-indigo-300 font-medium" : "bg-zinc-950"
                  }`}
                  title={rowInv.name}
                >
                  {rowInv.name.length > 16 ? rowInv.name.slice(0, 15) + "…" : rowInv.name}
                </button>,
                ...INVESTORS.map((_, j) => {
                  const cell = matrix[i][j];
                  const isDiagonal = i === j;
                  const isHovered = hover?.i === i && hover?.j === j;
                  const inAnchorRow = i === anchorIdx || j === anchorIdx;

                  return (
                    <div
                      key={`${i}-${j}`}
                      role="gridcell"
                      onMouseEnter={() => !isDiagonal && setHover({ i, j })}
                      onMouseLeave={() => setHover(null)}
                      className={`relative cursor-pointer transition-all ${
                        isHovered ? "ring-2 ring-indigo-400 z-10" : ""
                      } ${inAnchorRow && !isDiagonal ? "ring-1 ring-indigo-800" : ""}`}
                      style={cellStyle(cell.realizedScore, cell.structuralOverlap, isDiagonal)}
                      aria-label={
                        isDiagonal
                          ? rowInv.name
                          : `${rowInv.name} × ${INVESTORS[j].name}: realized ${(cell.realizedScore * 100).toFixed(0)}, structural ${(cell.structuralOverlap * 100).toFixed(0)}, ${cell.sharedPortfolio.length} shared`
                      }
                    />
                  );
                }),
              ],
            )}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hover && (() => {
        const cell = matrix[hover.i][hover.j];
        const rowInv = INVESTORS[hover.i];
        const colInv = INVESTORS[hover.j];
        return (
          <div className="mt-4 border border-zinc-700 rounded-xl p-4 bg-zinc-900">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-sm font-semibold text-zinc-100">{rowInv.name}</span>
              <span className="text-zinc-500">×</span>
              <span className="text-sm font-semibold text-zinc-100">{colInv.name}</span>
              {cell.band !== "unrelated" && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ml-auto ${
                  cell.band === "ally" ? "bg-emerald-900 text-emerald-300 border-emerald-700" :
                  cell.band === "untapped" ? "bg-amber-900 text-amber-300 border-amber-700" :
                  "bg-rose-900 text-rose-300 border-rose-700"
                }`}>
                  {cell.band === "ally" ? "🤝 ally" : cell.band === "untapped" ? "🌱 untapped" : "🔀 parallel"}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-zinc-500 mb-1">Realized signal</p>
                <p className="text-emerald-400 font-bold text-lg tabular-nums">{(cell.realizedScore * 100).toFixed(0)}<span className="text-xs text-zinc-500 ml-0.5">/100</span></p>
                {cell.sharedPortfolio.length > 0 ? (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {cell.sharedPortfolio.map((n) => (
                      <span key={n} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">{n}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-600 mt-1">No shared portfolio companies in our dataset</p>
                )}
                {cell.reciprocallyNamed && (
                  <p className="text-emerald-400 text-[10px] mt-1">↔ each lists the other as frequent co-investor</p>
                )}
              </div>
              <div>
                <p className="text-zinc-500 mb-1">Structural overlap</p>
                <p className="text-indigo-400 font-bold text-lg tabular-nums">{(cell.structuralOverlap * 100).toFixed(0)}<span className="text-xs text-zinc-500 ml-0.5">/100</span></p>
                <p className="text-[10px] text-zinc-500 mt-1.5">
                  Stage <span className="text-zinc-300 font-mono">{(cell.stageJaccard * 100).toFixed(0)}%</span> ·
                  Sector <span className="text-zinc-300 font-mono">{(cell.sectorJaccard * 100).toFixed(0)}%</span>
                </p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 flex-wrap text-xs">
        <span className="text-zinc-500">Bands:</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-emerald-700" />
          <span className="text-zinc-400">Ally</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-amber-700" />
          <span className="text-zinc-400">Untapped</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-rose-700" />
          <span className="text-zinc-400">Parallel</span>
        </span>
      </div>
    </div>
  );
}
