import type { SignalSpec } from "@/lib/data/scoring-spec";

interface SignalSpecCardProps {
  spec: SignalSpec;
  weight: number;
}

function SpecRow({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-zinc-500 w-24 shrink-0">{term}</dt>
      <dd className="text-zinc-300 flex-1">{desc}</dd>
    </div>
  );
}

export default function SignalSpecCard({ spec, weight }: SignalSpecCardProps) {
  const computed = spec.kind === "computed";
  return (
    <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/40">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-sm shrink-0 ${spec.bar}`} aria-hidden="true" />
          <h3 className={`text-sm font-semibold truncate ${spec.accent}`}>{spec.label}</h3>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded border font-mono shrink-0 ${
              computed
                ? "bg-emerald-950 border-emerald-800 text-emerald-400"
                : "bg-zinc-800 border-zinc-700 text-zinc-500"
            }`}
          >
            {computed ? "computed" : "estimated"}
          </span>
        </div>
        <span className="text-xs text-zinc-500 tabular-nums shrink-0">
          default <span className="text-zinc-300 font-mono">{weight}%</span>
        </span>
      </div>
      <dl className="space-y-1.5 text-xs leading-relaxed">
        <SpecRow term="Measures" desc={spec.measures} />
        <SpecRow term="How" desc={spec.formula} />
        <SpecRow term="Source" desc={spec.source} />
        <SpecRow term="Bootstrapped" desc={spec.bootstrapped} />
      </dl>
    </div>
  );
}
