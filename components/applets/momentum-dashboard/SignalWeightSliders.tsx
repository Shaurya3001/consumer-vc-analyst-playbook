"use client";
import { useCallback } from "react";
import type { SignalWeights } from "@/lib/data/taxonomy";

interface SignalWeightSlidersProps {
  weights: SignalWeights;
  onChange: (weights: SignalWeights) => void;
}

const SIGNAL_META: {
  key: keyof SignalWeights;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    key: "brandedSearchScore",
    label: "Branded Search",
    description: "Google Trends slope - organic pull",
    color: "bg-indigo-500",
  },
  {
    key: "qcDistributionScore",
    label: "QC Distribution",
    description: "Blinkit / Zepto / Instamart coverage",
    color: "bg-emerald-500",
  },
  {
    key: "earnedAffinityScore",
    label: "Earned Affinity",
    description: "Organic UGC from sub-10k accounts",
    color: "bg-amber-500",
  },
  {
    key: "operatorQualityScore",
    label: "Operator Quality",
    description: "Founder pedigree + ops hiring velocity",
    color: "bg-rose-500",
  },
];

const KEYS = SIGNAL_META.map((s) => s.key);
const MIN_WEIGHT = 5;

export default function SignalWeightSliders({ weights, onChange }: SignalWeightSlidersProps) {
  // When slider i changes to newVal, redistribute the delta proportionally among others
  const handleChange = useCallback(
    (changedKey: keyof SignalWeights, rawVal: number) => {
      const newVal = Math.max(MIN_WEIGHT, Math.min(rawVal, 100 - (KEYS.length - 1) * MIN_WEIGHT));
      const oldVal = weights[changedKey];
      const delta = newVal - oldVal;

      if (delta === 0) return;

      const otherKeys = KEYS.filter((k) => k !== changedKey);
      const otherTotal = otherKeys.reduce((s, k) => s + weights[k], 0);

      const updated = { ...weights, [changedKey]: newVal };

      // Distribute delta proportionally; clamp each to MIN_WEIGHT
      let remaining = -delta;
      const sorted = [...otherKeys].sort((a, b) => weights[b] - weights[a]);

      for (let i = 0; i < sorted.length; i++) {
        const k = sorted[i];
        const share = otherTotal > 0 ? (weights[k] / otherTotal) * (-delta) : (-delta) / otherKeys.length;
        const clamped = Math.max(MIN_WEIGHT, Math.round(updated[k] + share));
        remaining -= clamped - updated[k];
        updated[k] = clamped;
      }

      // Fix rounding - last slider absorbs remainder
      for (const k of sorted) {
        const adjusted = updated[k] + remaining;
        if (adjusted >= MIN_WEIGHT) {
          updated[k] = adjusted;
          break;
        }
      }

      // Final guard: clamp and renormalise to exactly 100
      const total = KEYS.reduce((s, k) => s + updated[k], 0);
      if (total !== 100) {
        const diff = 100 - total;
        // Add diff to largest non-changed slider
        const target = sorted.find((k) => updated[k] + diff >= MIN_WEIGHT);
        if (target) updated[target] += diff;
      }

      onChange(updated);
    },
    [weights, onChange],
  );

  const total = KEYS.reduce((s, k) => s + weights[k], 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-zinc-500 uppercase tracking-wider">Signal weights</p>
        <span
          className={`text-xs font-mono tabular-nums ${total === 100 ? "text-zinc-500" : "text-rose-400"}`}
          aria-live="polite"
        >
          {total}/100
        </span>
      </div>

      {SIGNAL_META.map(({ key, label, description, color }) => (
        <div key={key} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor={`slider-${key}`}
                className="text-sm font-medium text-zinc-200 cursor-pointer"
              >
                {label}
              </label>
              <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
            </div>
            <span className="text-sm font-mono tabular-nums text-zinc-300 ml-4 w-8 text-right">
              {weights[key]}%
            </span>
          </div>

          {/* Track */}
          <div className="relative h-2 rounded-full bg-zinc-800">
            {/* Fill */}
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-150 ${color}`}
              style={{ width: `${weights[key]}%` }}
              aria-hidden="true"
            />
            <input
              id={`slider-${key}`}
              type="range"
              min={MIN_WEIGHT}
              max={100 - (KEYS.length - 1) * MIN_WEIGHT}
              step={1}
              value={weights[key]}
              onChange={(e) => handleChange(key, Number(e.target.value))}
              aria-label={`${label} weight: ${weights[key]}%`}
              aria-valuemin={MIN_WEIGHT}
              aria-valuemax={100 - (KEYS.length - 1) * MIN_WEIGHT}
              aria-valuenow={weights[key]}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ touchAction: "manipulation" }}
            />
          </div>
        </div>
      ))}

      <p className="text-xs text-zinc-600 pt-1">
        Adjusting one slider redistributes weight proportionally across the others.
      </p>
    </div>
  );
}
