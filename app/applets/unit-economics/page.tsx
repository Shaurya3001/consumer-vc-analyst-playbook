"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UNIT_ECONOMICS_DEFAULTS } from "@/lib/data/unit-economics-defaults";
import { computeUnitEconomics, VERDICT_META, type UnitEconInputs } from "@/lib/utils/unit-economics";
import EconSlider from "@/components/applets/unit-economics/EconSlider";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const pct = (n: number) => `${Math.round(n * 100)}%`;

function presetToInputs(p: (typeof UNIT_ECONOMICS_DEFAULTS)[number]): UnitEconInputs {
  return {
    aov: p.aov,
    returnRate: p.returnRate,
    contributionMargin: p.contributionMargin,
    ordersPerYear: p.avgOrderFrequency,
    retentionRate: p.repeatRate,
    cac: p.cac,
  };
}

export default function UnitEconomicsPage() {
  const [presetSector, setPresetSector] = useState<string>(UNIT_ECONOMICS_DEFAULTS[0].sector);
  const [inputs, setInputs] = useState<UnitEconInputs>(() =>
    presetToInputs(UNIT_ECONOMICS_DEFAULTS[0]),
  );

  const result = useMemo(() => computeUnitEconomics(inputs), [inputs]);
  const verdict = VERDICT_META[result.verdict];

  const loadPreset = (sector: string) => {
    const p = UNIT_ECONOMICS_DEFAULTS.find((d) => d.sector === sector);
    if (p) {
      setPresetSector(sector);
      setInputs(presetToInputs(p));
    }
  };

  const set = <K extends keyof UnitEconInputs>(key: K, v: number) =>
    setInputs((prev) => ({ ...prev, [key]: v }));

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="border-b border-zinc-800 max-w-7xl mx-auto px-6 py-4">
        <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm block mb-1">← Home</Link>
        <h1 className="text-xl font-bold">Unit Economics Sandbox</h1>
        <p className="text-zinc-500 text-xs mt-0.5 max-w-3xl">
          Sanity-check a founder&apos;s numbers in 30 seconds. Load a category benchmark, then drag any
          input to model the scenario. LTV/CAC and payback update live - every intermediate is shown.
        </p>
      </div>

      {/* Preset selector */}
      <div className="border-b border-zinc-800 max-w-7xl mx-auto px-6 py-3 flex items-center gap-3 flex-wrap">
        <span className="text-xs text-zinc-500">Category benchmark:</span>
        <div className="flex gap-1.5 flex-wrap">
          {UNIT_ECONOMICS_DEFAULTS.map((d) => (
            <button
              key={d.sector}
              onClick={() => loadPreset(d.sector)}
              aria-pressed={presetSector === d.sector}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                presetSector === d.sector
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {d.sector}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 max-w-7xl mx-auto">
        {/* Left - inputs */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-200">Inputs</h2>
            <span className="text-xs text-zinc-600">drag or type any value</span>
          </div>
          <EconSlider label="Average order value (AOV)" value={inputs.aov} min={100} max={5000} step={10}
            onChange={(v) => set("aov", v)} prefix="₹" accent="bg-indigo-500"
            hint="Gross order value before returns" />
          <EconSlider label="Return rate" value={inputs.returnRate} min={0} max={0.5} step={0.01}
            onChange={(v) => set("returnRate", v)} suffix="%" scale={100} accent="bg-rose-500"
            hint="Share of orders returned (high in fashion)" />
          <EconSlider label="Contribution margin" value={inputs.contributionMargin} min={0.1} max={0.8} step={0.01}
            onChange={(v) => set("contributionMargin", v)} suffix="%" scale={100} accent="bg-emerald-500"
            hint="After COGS, shipping, payment fees" />
          <EconSlider label="Orders / year per customer" value={inputs.ordersPerYear} min={1} max={24} step={1}
            onChange={(v) => set("ordersPerYear", v)} suffix="×" accent="bg-cyan-500"
            hint="Purchase frequency of an active customer" />
          <EconSlider label="Annual retention rate" value={inputs.retentionRate} min={0} max={0.9} step={0.01}
            onChange={(v) => set("retentionRate", v)} suffix="%" scale={100} accent="bg-violet-500"
            hint="Share who buy again next year → drives lifespan" />
          <EconSlider label="Customer acquisition cost (CAC)" value={inputs.cac} min={50} max={3000} step={10}
            onChange={(v) => set("cac", v)} prefix="₹" accent="bg-amber-500"
            hint="Fully-loaded blended CAC" />
        </section>

        {/* Right - outputs */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-200">Outputs</h2>

          {/* Verdict banner */}
          <div className={`border rounded-xl p-4 ${verdict.bg}`}>
            <div className="flex items-center justify-between">
              <span className={`text-lg font-bold ${verdict.color}`}>{verdict.label}</span>
              <span className={`text-2xl font-bold tabular-nums ${verdict.color}`}>
                {result.ltvCacRatio}× <span className="text-sm text-zinc-500 font-normal">LTV:CAC</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">{verdict.note}</p>
          </div>

          {/* Headline metrics */}
          <div className="grid grid-cols-3 gap-3">
            <Metric label="LTV" value={inr(result.ltv)} sub={`${result.lifespanYears}y lifespan`} />
            <Metric label="Payback" value={result.paybackMonths >= 999 ? "Never" : `${result.paybackMonths} mo`}
              sub="to recover CAC" warn={result.paybackMonths > 18} />
            <Metric label="1st-order margin" value={inr(result.firstOrderMargin)}
              sub={result.firstOrderMargin >= 0 ? "profit on order 1" : "loss on order 1"}
              warn={result.firstOrderMargin < 0} />
          </div>

          {/* The chain - show your work */}
          <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/40">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">How LTV is built</p>
            <div className="space-y-2 text-xs">
              <ChainRow label="AOV" value={inr(inputs.aov)} />
              <ChainRow label={`− returns (${pct(inputs.returnRate)})`} value={`= ${inr(result.effectiveAov)} effective`} muted />
              <ChainRow label={`× contribution margin (${pct(inputs.contributionMargin)})`} value={`= ${inr(result.contribPerOrder)} / order`} muted />
              <ChainRow label={`× ${inputs.ordersPerYear} orders/yr`} value={`= ${inr(result.annualContrib)} / yr`} muted />
              <ChainRow label={`× ${result.lifespanYears}y lifespan`} value={`= ${inr(result.ltv)} LTV`} highlight />
              <div className="h-px bg-zinc-800 my-1" />
              <ChainRow label={`÷ CAC (${inr(inputs.cac)})`} value={`= ${result.ltvCacRatio}× LTV:CAC`} highlight />
            </div>
          </div>

          {/* LTV vs CAC bar */}
          <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/40">
            <p className="text-xs text-zinc-500 mb-2">LTV recovered per ₹1 of CAC</p>
            <div className="h-6 bg-zinc-800 rounded-lg overflow-hidden relative">
              <motion.div
                className={`h-full rounded-lg ${result.ltvCacRatio >= 3 ? "bg-emerald-500" : result.ltvCacRatio >= 2 ? "bg-lime-500" : result.ltvCacRatio >= 1 ? "bg-amber-500" : "bg-rose-500"}`}
                animate={{ width: `${Math.min(result.ltvCacRatio / 5, 1) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
              {/* 3x benchmark marker */}
              <div className="absolute inset-y-0 border-l-2 border-dashed border-zinc-500" style={{ left: `${(3 / 5) * 100}%` }}>
                <span className="absolute -top-0.5 left-1 text-[9px] text-zinc-500">3× target</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-600">
            Presets are <span className="text-zinc-400">category benchmarks modeled from public data</span> - not
            investee-specific. Retention is modeled as annual; lifespan = 1/(1−retention), capped at 5 years.
          </p>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, sub, warn }: { label: string; value: string; sub: string; warn?: boolean }) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`text-lg font-bold tabular-nums ${warn ? "text-rose-400" : "text-zinc-100"}`}>{value}</p>
      <p className="text-[10px] text-zinc-600 mt-0.5">{sub}</p>
    </div>
  );
}

function ChainRow({ label, value, muted, highlight }: { label: string; value: string; muted?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-zinc-500" : highlight ? "text-zinc-300 font-medium" : "text-zinc-400"}>{label}</span>
      <span className={`font-mono tabular-nums ${highlight ? "text-emerald-400" : "text-zinc-400"}`}>{value}</span>
    </div>
  );
}
