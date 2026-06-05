"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Brand } from "@/lib/data/brands";
import type { MomentumResult } from "@/lib/utils/momentum-score";

interface MomentumRowProps {
  brand: Brand;
  rank: number;
  result: MomentumResult;
}

const INDIA_TIER_STYLES: Record<string, string> = {
  "India 1": "bg-violet-900 text-violet-300 border-violet-700",
  "India 2": "bg-cyan-900 text-cyan-300 border-cyan-700",
  "India 3": "bg-amber-900 text-amber-300 border-amber-700",
};

const STAGE_STYLES: Record<string, string> = {
  Bootstrapped: "text-amber-400",
  "Pre-seed": "text-zinc-400",
  Seed: "text-emerald-400",
  "Series A": "text-blue-400",
  "Series B": "text-violet-400",
  "Series C+": "text-orange-400",
};

const SIGNAL_BARS = [
  { key: "brandedSearch" as const, label: "Search", color: "bg-indigo-500", computed: false },
  { key: "earnedAffinity" as const, label: "Affinity", color: "bg-amber-500", computed: false },
  { key: "fundingRecency" as const, label: "Recency", color: "bg-emerald-500", computed: true },
  { key: "investorQuality" as const, label: "Investor", color: "bg-rose-500", computed: true },
  { key: "stageVelocity" as const, label: "Velocity", color: "bg-cyan-500", computed: true },
  { key: "coInvestmentCentrality" as const, label: "Co-invest", color: "bg-fuchsia-500", computed: true },
];

const SCORE_BG = (score: number) => {
  if (score >= 75) return "text-emerald-400";
  if (score >= 55) return "text-amber-400";
  return "text-zinc-400";
};

// No shared variants object - transitions inlined per state to avoid Framer Motion type narrowing issues

export default function MomentumRow({ brand, rank, result }: MomentumRowProps) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => setExpanded((v) => !v);

  return (
    <li className="border-b border-zinc-900 last:border-0">
      {/* Main row - click to expand */}
      <button
        onClick={toggle}
        aria-expanded={expanded}
        aria-controls={`signal-detail-${brand.id}`}
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-zinc-900/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
        style={{ touchAction: "manipulation" }}
      >
        {/* Rank */}
        <span className="text-xs text-zinc-600 w-6 shrink-0 tabular-nums text-right">{rank}</span>

        {/* Score ring */}
        <div className="relative w-10 h-10 shrink-0">
          <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90" aria-hidden="true">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#27272a" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${result.total} ${100 - result.total}`}
              className={SCORE_BG(result.total)}
            />
          </svg>
          <span
            className={`absolute inset-0 flex items-center justify-center text-xs font-mono font-bold tabular-nums ${SCORE_BG(result.total)}`}
          >
            {result.total}
          </span>
        </div>

        {/* Brand info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-zinc-100 text-sm truncate">{brand.name}</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded border ${INDIA_TIER_STYLES[brand.indiaTier] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"}`}
              aria-label={`Consumer tier: ${brand.indiaTier}`}
            >
              {brand.indiaTier}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs ${STAGE_STYLES[brand.stage] ?? "text-zinc-400"}`}>{brand.stage}</span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-zinc-500 truncate">{brand.sector}</span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-zinc-500">{brand.city}</span>
          </div>
        </div>

        {/* Mini signal bars */}
        <div className="hidden sm:flex items-end gap-0.5 h-6 shrink-0" aria-hidden="true">
          {SIGNAL_BARS.map(({ key, color }) => {
            const val = result.components[key].value;
            return (
              <div
                key={key}
                className={`w-2 rounded-sm ${color} opacity-80`}
                style={{ height: `${Math.max(4, (val / 100) * 24)}px` }}
              />
            );
          })}
        </div>

        {/* Expand chevron */}
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-zinc-600 shrink-0 ml-1"
          aria-hidden="true"
        >
          ▾
        </motion.span>
      </button>

      {/* Expanded signal decomposition */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            id={`signal-detail-${brand.id}`}
            role="region"
            aria-label={`Signal breakdown for ${brand.name}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.2 } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.15 } }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 ml-9 space-y-3">
              {/* Signal bars */}
              <div className="space-y-3">
                {SIGNAL_BARS.map(({ key, label, color, computed }) => {
                  const detail = result.components[key];
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 w-20 shrink-0">
                          <span className="text-xs text-zinc-500">{label}</span>
                          <span
                            className={`text-[9px] px-1 py-0.5 rounded border font-mono leading-none ${
                              computed
                                ? "bg-emerald-950 border-emerald-800 text-emerald-400"
                                : "bg-zinc-800 border-zinc-700 text-zinc-600"
                            }`}
                            aria-label={computed ? "computed from data" : "estimated"}
                          >
                            {computed ? "cmp" : "est"}
                          </span>
                        </div>
                        <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${detail.value}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            aria-hidden="true"
                          />
                        </div>
                        <span className="text-xs font-mono tabular-nums text-zinc-400 w-8 text-right">
                          {detail.value}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-600 ml-[5.5rem] leading-tight">
                        {detail.derivation}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 border-t border-zinc-800">
                {brand.lastRound ? (
                  <>
                    <span className="text-xs text-zinc-500">
                      Last round:{" "}
                      <span className="text-zinc-300">
                        ${brand.lastRound.amount}M {brand.lastRound.stage} · {brand.lastRound.date.slice(0, 7)}
                      </span>
                    </span>
                    <span className="text-xs text-zinc-500">
                      Lead: <span className="text-zinc-300">{brand.lastRound.leadInvestor}</span>
                    </span>
                  </>
                ) : (
                  <span className="text-xs px-1.5 py-0.5 rounded border bg-amber-950 border-amber-800 text-amber-400 font-mono">
                    Bootstrapped - no institutional round
                  </span>
                )}
                <span className="text-xs text-zinc-500">
                  GTM:{" "}
                  <span className="text-zinc-300">{brand.gtmModels.slice(0, 2).join(", ")}</span>
                </span>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-zinc-600">
                Signals compiled from public sources · as of {brand.dataAsOf} ·{" "}
                {result.confidence === "high" ? "2/2" : result.confidence === "medium" ? "1/2" : "0/2"} estimated signals populated ·{" "}
                <a
                  href={brand.sources[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
                  aria-label={`Source for ${brand.name}`}
                >
                  source
                </a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
