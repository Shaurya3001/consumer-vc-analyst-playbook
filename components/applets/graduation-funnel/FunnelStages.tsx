"use client";
import { motion } from "framer-motion";
import type { FunnelTotals } from "@/lib/data/cohorts";

interface FunnelStagesProps {
  totals: FunnelTotals;
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

export default function FunnelStages({ totals }: FunnelStagesProps) {
  const { seedCount, reachedSeriesA, reachedSeriesB } = totals;

  // Width of each funnel bar relative to seed cohort
  const stages = [
    { label: "Raised Seed", count: seedCount, color: "bg-indigo-600", width: 100 },
    {
      label: "Reached Series A",
      count: reachedSeriesA,
      color: "bg-emerald-600",
      width: seedCount > 0 ? (reachedSeriesA / seedCount) * 100 : 0,
    },
    {
      label: "Reached Series B+",
      count: reachedSeriesB,
      color: "bg-amber-600",
      width: seedCount > 0 ? (reachedSeriesB / seedCount) * 100 : 0,
    },
  ];

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => (
        <div key={stage.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-zinc-300">{stage.label}</span>
            <span className="text-sm font-mono tabular-nums text-zinc-100">
              {stage.count} <span className="text-zinc-600">brands</span>
            </span>
          </div>
          <div className="h-9 bg-zinc-800/60 rounded-lg overflow-hidden relative">
            <motion.div
              className={`h-full ${stage.color} rounded-lg flex items-center justify-end pr-3`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(stage.width, 4)}%` }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
            >
              <span className="text-xs font-medium text-white/90 tabular-nums">
                {seedCount > 0 ? pct(stage.count / seedCount) : "-"}
              </span>
            </motion.div>
          </div>

          {/* Conversion arrow between stages */}
          {i < stages.length - 1 && (
            <div className="flex items-center gap-2 pl-3 mt-1.5 mb-0.5">
              <span className="text-zinc-600 text-xs">↳</span>
              <span className="text-xs text-zinc-500">
                {i === 0
                  ? `${pct(totals.seedToARate)} of seed cohort converts to Series A`
                  : `${pct(totals.aToBRate)} of Series A companies reach Series B+`}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Outcome breakdown for the non-graduating majority */}
      <div className="mt-5 pt-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Where the rest land</p>
        <div className="grid grid-cols-3 gap-3">
          <Outcome label="Acquired" count={totals.acquired} total={seedCount} color="text-violet-400" />
          <Outcome label="Stuck / inactive" count={totals.stuckAtSeed} total={seedCount} color="text-zinc-400" />
          <Outcome label="Shut down" count={totals.shutdown} total={seedCount} color="text-rose-400" />
        </div>
      </div>
    </div>
  );
}

function Outcome({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3 text-center">
      <p className={`text-xl font-bold tabular-nums ${color}`}>{count}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
      <p className="text-[10px] text-zinc-600 mt-0.5 tabular-nums">
        {total > 0 ? pct(count / total) : "-"}
      </p>
    </div>
  );
}
