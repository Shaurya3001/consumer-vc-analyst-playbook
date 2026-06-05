"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { INVESTORS } from "@/lib/data/investors";
import { rankCounterparts, type PairAffinity } from "@/lib/utils/investor-affinity";
import type { Investor } from "@/lib/data/investors";

interface SyndicateShortlistProps {
  anchorId: string;
}

const BAND_META = {
  ally: {
    label: "🤝 Natural Allies",
    description: "Proven partners - high portfolio overlap, frequent co-investment",
    color: "border-emerald-700 bg-emerald-950/30",
    badgeColor: "bg-emerald-900 text-emerald-300 border-emerald-700",
    text: "text-emerald-400",
  },
  untapped: {
    label: "🌱 Untapped Fits",
    description: "Operate in your space, light realized overlap - introduction candidates",
    color: "border-amber-700 bg-amber-950/30",
    badgeColor: "bg-amber-900 text-amber-300 border-amber-700",
    text: "text-amber-400",
  },
  rival: {
    label: "🔀 Parallel Players",
    description: "Operate in the same space but rarely co-invest - parallel, not yet partnered",
    color: "border-rose-700 bg-rose-950/30",
    badgeColor: "bg-rose-900 text-rose-300 border-rose-700",
    text: "text-rose-400",
  },
  unrelated: {
    label: "Unrelated",
    description: "Different thesis - limited stage/sector overlap",
    color: "border-zinc-800 bg-zinc-900/40",
    badgeColor: "bg-zinc-800 text-zinc-400 border-zinc-700",
    text: "text-zinc-500",
  },
} as const;

interface RowProps {
  counterpart: Investor;
  affinity: PairAffinity;
}

function ShortlistRow({ counterpart, affinity }: RowProps) {
  return (
    <div className="border border-zinc-800 bg-zinc-900/40 rounded-lg p-3 hover:bg-zinc-900/70 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-100 truncate">{counterpart.name}</p>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">
            {counterpart.type === "seed-fund" ? "Seed" : counterpart.type === "multi-stage" ? "Multi-stage" : counterpart.type === "growth-equity" ? "Growth" : counterpart.type === "strategic" ? "Strategic" : counterpart.type === "cvc" ? "CVC" : "Family Office"}
            {" · "}
            ${counterpart.checkSizeMin}-{counterpart.checkSizeMax}M
          </p>
        </div>
        {affinity.sharedPortfolio.length > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700 shrink-0 tabular-nums">
            {affinity.sharedPortfolio.length} shared
          </span>
        )}
      </div>

      {/* Two separate bars - Realized + Structural */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 w-16 shrink-0">Realized</span>
          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${affinity.realizedScore * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              aria-label={`Realized co-investment score: ${(affinity.realizedScore * 100).toFixed(0)} of 100`}
            />
          </div>
          <span className="text-[10px] font-mono tabular-nums text-zinc-400 w-7 text-right">
            {(affinity.realizedScore * 100).toFixed(0)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 w-16 shrink-0">Structural</span>
          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${affinity.structuralOverlap * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              aria-label={`Structural overlap: ${(affinity.structuralOverlap * 100).toFixed(0)} of 100`}
            />
          </div>
          <span className="text-[10px] font-mono tabular-nums text-zinc-400 w-7 text-right">
            {(affinity.structuralOverlap * 100).toFixed(0)}
          </span>
        </div>
      </div>

      {/* Evidence - shared companies */}
      {affinity.sharedPortfolio.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {affinity.sharedPortfolio.slice(0, 4).map((name) => (
            <span
              key={name}
              className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700"
            >
              {name}
            </span>
          ))}
          {affinity.sharedPortfolio.length > 4 && (
            <span className="text-[10px] text-zinc-500">+{affinity.sharedPortfolio.length - 4}</span>
          )}
        </div>
      )}

      {/* Stage / sector overlap breakdown - derived label */}
      <div className="mt-2 flex items-center gap-3 text-[10px] text-zinc-600">
        <span>Stage <span className="text-zinc-400 font-mono">{(affinity.stageJaccard * 100).toFixed(0)}%</span></span>
        <span>Sector <span className="text-zinc-400 font-mono">{(affinity.sectorJaccard * 100).toFixed(0)}%</span></span>
        {affinity.reciprocallyNamed && (
          <span className="text-emerald-500 text-[10px]">↔ reciprocally named</span>
        )}
      </div>
    </div>
  );
}

export default function SyndicateShortlist({ anchorId }: SyndicateShortlistProps) {
  const anchor = INVESTORS.find((i) => i.id === anchorId);
  const ranked = useMemo(() => rankCounterparts(anchorId), [anchorId]);

  const grouped = useMemo(() => {
    const out: Record<PairAffinity["band"], { investor: Investor; affinity: PairAffinity }[]> = {
      ally: [],
      untapped: [],
      rival: [],
      unrelated: [],
    };
    for (const r of ranked) out[r.affinity.band].push(r);
    return out;
  }, [ranked]);

  if (!anchor) return null;

  const bands: PairAffinity["band"][] = ["ally", "untapped", "rival"];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Syndicate shortlist for</p>
        <h2 className="text-lg font-bold text-zinc-100">{anchor.name}</h2>
        <p className="text-xs text-zinc-500 mt-1 max-w-xl leading-relaxed">
          Ranked counterparts grouped by relationship type. Each row shows two separate
          signals - never blended into one score.
        </p>
      </div>

      {bands.map((band) => {
        const items = grouped[band];
        const meta = BAND_META[band];
        if (items.length === 0) return null;

        return (
          <section key={band}>
            <div className={`flex items-baseline justify-between mb-2 pb-1 border-b ${meta.color.includes("border") ? meta.color.split(" ").find(c => c.startsWith("border-"))?.replace("border-", "border-") : "border-zinc-800"}`}>
              <div>
                <h3 className={`text-sm font-semibold ${meta.text}`}>{meta.label}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">{meta.description}</p>
              </div>
              <span className="text-xs text-zinc-500 tabular-nums shrink-0">{items.length}</span>
            </div>

            <div className="space-y-2">
              {items.slice(0, 6).map(({ investor, affinity }) => (
                <ShortlistRow key={investor.id} counterpart={investor} affinity={affinity} />
              ))}
              {items.length > 6 && (
                <p className="text-xs text-zinc-600 px-3 py-1">+{items.length - 6} more in this band</p>
              )}
            </div>
          </section>
        );
      })}

      {/* Methodology note */}
      <div className="border border-zinc-800 rounded-lg p-3 bg-zinc-900/40">
        <p className="text-xs text-zinc-400 mb-1 font-medium">How this is computed</p>
        <p className="text-xs text-zinc-500 leading-relaxed">
          <span className="text-emerald-400">Realized</span> score uses Szymkiewicz-Simpson overlap of named portfolio
          companies (robust to truncated lists), boosted if the funds are reciprocally
          named co-investors. <span className="text-indigo-400">Structural</span> score = 50% stage Jaccard + 50% sector Jaccard.
          Bands derived from the two together: high structural + zero realized = parallel player;
          high structural + high realized = ally.{" "}
          <span className="text-zinc-400">Modeled, not disclosed cap-table data.</span>
        </p>
      </div>
    </div>
  );
}
