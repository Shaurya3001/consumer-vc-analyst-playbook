"use client";
import { useState, useEffect } from "react";

interface EconSliderProps {
  label: string;
  value: number;          // canonical value (e.g. 0.28 for 28%)
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  scale?: number;         // display value = value × scale (use 100 for percent)
  prefix?: string;        // e.g. "₹"
  suffix?: string;        // e.g. "%" or "×"
  decimals?: number;      // decimals shown in the editable input
  hint?: string;
  accent?: string;        // tailwind bg- class for the fill
}

export default function EconSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  scale = 1,
  prefix = "",
  suffix = "",
  decimals = 0,
  hint,
  accent = "bg-indigo-500",
}: EconSliderProps) {
  const display = value * scale;
  const [text, setText] = useState(display.toFixed(decimals));

  // Keep the editable field in sync when value changes externally (e.g. preset load, slider drag)
  useEffect(() => {
    setText(display.toFixed(decimals));
  }, [display, decimals]);

  const commit = (raw: string) => {
    const num = parseFloat(raw);
    if (Number.isNaN(num)) {
      setText(display.toFixed(decimals)); // revert invalid input
      return;
    }
    const canonical = Math.min(max, Math.max(min, num / scale));
    onChange(canonical);
  };

  const pctFilled = ((value - min) / (max - min)) * 100;
  const id = `econ-${label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  const dispMin = +(min * scale).toFixed(decimals);
  const dispMax = +(max * scale).toFixed(decimals);
  const dispStep = +(step * scale).toFixed(Math.max(decimals, 2));

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-sm text-zinc-300">{label}</label>
        <div className="flex items-center gap-0.5">
          {prefix && <span className="text-sm text-zinc-500">{prefix}</span>}
          <input
            type="number"
            value={text}
            min={dispMin}
            max={dispMax}
            step={dispStep}
            onChange={(e) => setText(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commit(e.currentTarget.value);
                e.currentTarget.blur();
              }
            }}
            aria-label={`${label} value`}
            className="w-16 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 text-sm text-right tabular-nums text-zinc-100 focus:outline-none focus:border-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          {suffix && <span className="text-sm text-zinc-500">{suffix}</span>}
        </div>
      </div>
      <div className="relative h-2 rounded-full bg-zinc-800">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${accent} transition-all duration-100`}
          style={{ width: `${Math.min(100, Math.max(0, pctFilled))}%` }}
          aria-hidden="true"
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          aria-valuenow={value}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ touchAction: "manipulation" }}
        />
      </div>
      {hint && <p className="text-xs text-zinc-600 mt-1">{hint}</p>}
    </div>
  );
}
