"use client";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Brand } from "@/lib/data/brands";
import type { SignalWeights } from "@/lib/data/taxonomy";
import { computeMomentumScore } from "@/lib/utils/momentum-score";
import MomentumRow from "./MomentumRow";

interface MomentumTableProps {
  brands: Brand[];
  weights: SignalWeights;
  sectorFilter: string;
  tierFilter: string;
  stageFilter: string;
  search: string;
}

export default function MomentumTable({
  brands,
  weights,
  sectorFilter,
  tierFilter,
  stageFilter,
  search,
}: MomentumTableProps) {
  const scored = useMemo(() => {
    return brands
      .filter((b) => {
        if (sectorFilter && b.sector !== sectorFilter) return false;
        if (tierFilter && b.indiaTier !== tierFilter) return false;
        if (stageFilter && b.stage !== stageFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          if (
            !b.name.toLowerCase().includes(q) &&
            !b.sector.toLowerCase().includes(q) &&
            !b.city.toLowerCase().includes(q) &&
            !b.tags.some((t) => t.toLowerCase().includes(q))
          )
            return false;
        }
        return true;
      })
      .map((b) => ({ brand: b, result: computeMomentumScore(b, weights) }))
      .sort((a, b) => b.result.total - a.result.total);
  }, [brands, weights, sectorFilter, tierFilter, stageFilter, search]);

  if (scored.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-zinc-500 text-sm">No brands match the current filters.</p>
        <p className="text-zinc-600 text-xs mt-1">Try clearing a filter above.</p>
      </div>
    );
  }

  return (
    <ul role="list" aria-label="Momentum-ranked brand list">
      <AnimatePresence mode="popLayout">
        {scored.map(({ brand, result }, i) => (
          <motion.div
            key={brand.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              layout: { duration: 0.25, ease: "easeOut" },
              opacity: { duration: 0.15 },
              delay: Math.min(i * 0.02, 0.2), // stagger up to 200ms, cap after 10 items
            }}
          >
            <MomentumRow brand={brand} rank={i + 1} result={result} />
          </motion.div>
        ))}
      </AnimatePresence>
    </ul>
  );
}
