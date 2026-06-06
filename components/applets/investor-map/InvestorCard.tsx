"use client";
import type { Investor } from "@/lib/data/investors";
import { STAGES } from "@/lib/data/taxonomy";

interface InvestorCardProps {
  investor: Investor;
  isAnchor: boolean;
  onSelect: () => void;
}

const TYPE_COLORS: Record<Investor["type"], string> = {
  "seed-fund": "bg-emerald-900 text-emerald-300 border-emerald-700",
  "micro-vc": "bg-teal-900 text-teal-300 border-teal-700",
  "angel-network": "bg-lime-900 text-lime-300 border-lime-700",
  "accelerator": "bg-green-900 text-green-300 border-green-700",
  "multi-stage": "bg-blue-900 text-blue-300 border-blue-700",
  "growth-equity": "bg-violet-900 text-violet-300 border-violet-700",
  "strategic": "bg-amber-900 text-amber-300 border-amber-700",
  "family-office": "bg-rose-900 text-rose-300 border-rose-700",
  "cvc": "bg-cyan-900 text-cyan-300 border-cyan-700",
  "sovereign": "bg-indigo-900 text-indigo-300 border-indigo-700",
};

const TYPE_LABELS: Record<Investor["type"], string> = {
  "seed-fund": "Seed",
  "micro-vc": "Micro-VC",
  "angel-network": "Angel Network",
  "accelerator": "Accelerator",
  "multi-stage": "Multi-stage",
  "growth-equity": "Growth/PE",
  "strategic": "Strategic",
  "family-office": "Family Office",
  "cvc": "CVC",
  "sovereign": "Sovereign",
};

export default function InvestorCard({ investor, isAnchor, onSelect }: InvestorCardProps) {
  return (
    <button
      onClick={onSelect}
      aria-label={`Select ${investor.name} as anchor investor`}
      aria-pressed={isAnchor}
      className={`text-left w-full p-4 rounded-xl border transition-all ${
        isAnchor
          ? "border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/40"
          : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-600 hover:bg-zinc-900"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-zinc-100 leading-tight">{investor.name}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${TYPE_COLORS[investor.type]}`}>
          {TYPE_LABELS[investor.type]}
        </span>
      </div>

      {/* AUM + check size */}
      <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3">
        {investor.aumUsdMn ? (
          <span>
            <span className="text-zinc-200 font-medium tabular-nums">${investor.aumUsdMn}M</span> AUM
          </span>
        ) : (
          <span className="text-zinc-600">AUM undisclosed</span>
        )}
        <span className="text-zinc-700">·</span>
        <span className="tabular-nums">
          ${investor.checkSizeMin}-{investor.checkSizeMax}M cheque
        </span>
      </div>

      {/* Stage pills */}
      <div className="flex gap-1 mb-3" aria-label="Active stages">
        {STAGES.map((stage) => {
          const active = investor.primaryStages.includes(stage);
          return (
            <span
              key={stage}
              className={`text-[10px] px-1.5 py-0.5 rounded ${
                active ? "bg-indigo-700/60 text-indigo-200" : "bg-zinc-800/60 text-zinc-600"
              }`}
              title={stage}
            >
              {stage === "Pre-seed" ? "PS" : stage === "Series A" ? "A" : stage === "Series B" ? "B" : stage === "Series C+" ? "C+" : "S"}
            </span>
          );
        })}
      </div>

      {/* Recent bets */}
      {investor.recentBets.length > 0 && (
        <div className="mb-1">
          <p className="text-xs text-zinc-500 mb-1">Recent bets</p>
          <p className="text-xs text-zinc-300 line-clamp-2">
            {investor.recentBets.slice(0, 4).join(" · ")}
            {investor.recentBets.length > 4 && ` · +${investor.recentBets.length - 4} more`}
          </p>
        </div>
      )}
    </button>
  );
}
