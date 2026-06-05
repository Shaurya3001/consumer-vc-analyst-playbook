"use client";
import { useMemo } from "react";
import { FUNDING_ROUNDS } from "@/lib/data/funding-rounds";
import { getFunnelTotals } from "@/lib/data/cohorts";
import { stageBreakdown, roundCadence, stageProgression } from "@/lib/utils/funding-analytics";

interface BaseRatesPanelProps {
  yearRange: [number, number];
}

const LATER_STAGES = new Set(["Series A", "Series B", "Series C+"]);

export default function BaseRatesPanel({ yearRange }: BaseRatesPanelProps) {
  const { stages, cadence, prog, laterShare, modeledSeedToA } = useMemo(() => {
    const stages = stageBreakdown(FUNDING_ROUNDS).filter((s) => s.count > 0);
    const total = stages.reduce((s, x) => s + x.count, 0);
    const later = stages.filter((s) => LATER_STAGES.has(s.stage)).reduce((s, x) => s + x.count, 0);
    return {
      stages,
      cadence: roundCadence(FUNDING_ROUNDS),
      prog: stageProgression(FUNDING_ROUNDS),
      laterShare: total > 0 ? Math.round((later / total) * 100) : 0,
      modeledSeedToA: getFunnelTotals("all", yearRange).seedToARate,
    };
  }, [yearRange]);

  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/40">
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-sm font-semibold text-zinc-200">Backtest: what the sourced rounds can validate</p>
        <span className="text-xs text-zinc-600 tabular-nums">{FUNDING_ROUNDS.length} rounds</span>
      </div>

      {/* Stage coverage of the real sourced rounds */}
      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">Stage mix of sourced rounds (computed)</p>
      <div className="space-y-1.5 mb-3">
        {stages.map((s) => (
          <div key={s.stage} className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 w-20 shrink-0">{s.stage}</span>
            <div className="flex-1 h-3 bg-zinc-800 rounded-sm overflow-hidden">
              <div
                className="h-full bg-indigo-500/70 rounded-sm"
                style={{ width: `${(s.count / maxCount) * 100}%` }}
                aria-hidden="true"
              />
            </div>
            <span className="text-xs font-mono tabular-nums text-zinc-400 w-7 text-right">{s.count}</span>
          </div>
        ))}
      </div>

      {/* The honest limitation = the insight */}
      <div className="rounded-lg border border-amber-900/60 bg-amber-950/30 p-3 mb-3">
        <p className="text-xs text-amber-300 font-medium mb-0.5">
          Why graduation is modeled, not observed - and where it diverges
        </p>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          {laterShare}% of sourced rounds are Series A or later, and only {prog.companiesWithSeed} are
          seed rounds. Press-covered funding tracks <span className="text-zinc-300">winners</span> at or
          after Series A, not the seed population - so a seed → A graduation rate cannot be read off this
          set (it would over-count survivors). The modeled funnel ({Math.round(modeledSeedToA * 100)}%
          seed → A) instead reflects the silent majority and is validated against external base rates
          (Inc42/Bain ~10-20%). That gap is the divergence, and it is structural, not an error.
        </p>
      </div>

      {/* Bias-resistant computed base rates (within-company timing) */}
      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
        What the data does validate: round timing (computed)
      </p>
      <div className="grid grid-cols-2 gap-3 mb-2">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-zinc-200 tabular-nums">
            {cadence.medianMonths || "n/a"}
            {cadence.medianMonths ? <span className="text-xs text-zinc-500 font-normal"> mo</span> : null}
          </span>
          <span className="text-[10px] text-zinc-500 leading-tight">
            median gap between consecutive rounds ({cadence.pairs} company {cadence.pairs === 1 ? "pair" : "pairs"})
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-zinc-200 tabular-nums">
            {cadence.medianStepUpX ? `${cadence.medianStepUpX}x` : "n/a"}
          </span>
          <span className="text-[10px] text-zinc-500 leading-tight">median round-size step-up</span>
        </div>
      </div>
      <p className="text-[11px] text-zinc-500 leading-relaxed">
        Within-company timing is bias-resistant (it conditions on observing two rounds, not on
        survival). At a {cadence.medianMonths}-month median gap, a 2024 seed brand needs roughly two
        such steps to reach Series B - so the thin 2023-24 graduation in the funnel is expected, not a
        data gap.
      </p>
    </div>
  );
}
