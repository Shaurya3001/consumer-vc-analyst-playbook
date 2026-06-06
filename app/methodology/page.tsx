import Link from "next/link";
import { DEFAULT_SIGNAL_WEIGHTS } from "@/lib/data/taxonomy";
import { SIGNALS, SCORE_BANDS } from "@/lib/data/scoring-spec";
import SignalSpecCard from "@/components/methodology/SignalSpecCard";
import ScoringTables from "@/components/methodology/ScoringTables";

function Section({ title, kicker, children }: { title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-zinc-800 pt-6">
      {kicker ? <p className="text-xs uppercase tracking-wider text-indigo-400 mb-1">{kicker}</p> : null}
      <h2 className="text-lg font-bold text-zinc-100 mb-4">{title}</h2>
      {children}
    </section>
  );
}

export default function MethodologyPage() {
  const computedCount = SIGNALS.filter((s) => s.kind === "computed").length;
  const estimatedCount = SIGNALS.length - computedCount;
  const totalWeight = Object.values(DEFAULT_SIGNAL_WEIGHTS).reduce((a, b) => a + b, 0);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <header>
          <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm block mb-1">← Home</Link>
          <h1 className="text-2xl font-bold">Scoring Methodology</h1>
          <p className="text-zinc-400 text-sm mt-2 max-w-3xl">
            Every score on this site traces to a number you can inspect - no black boxes. This page
            documents the Momentum Score end to end: its {SIGNALS.length} signals ({computedCount} computed
            live from sourced data, {estimatedCount} estimated from public signals and labelled as such),
            how they are weighted, and how to read the result. It is a discovery and sourcing signal, not
            a quality verdict or investment advice.
          </p>
        </header>

        {/* Legend */}
        <Section title="The score legend" kicker="Read the headline">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SCORE_BANDS.map((b, i) => {
              const upper = i === 0 ? 100 : SCORE_BANDS[i - 1].min - 1;
              return (
                <div key={b.label} className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/40">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${b.dot}`} aria-hidden="true" />
                    <span className={`text-lg font-bold tabular-nums ${b.tone}`}>{b.min}-{upper}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{b.label}</p>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-zinc-500 mt-3">
            The headline is a sourcing cue, not a verdict. Always read the signal mix beneath it: a brand
            high on paid-ad velocity but low on branded search is buying growth, not earning it.
          </p>
        </Section>

        {/* Weighting */}
        <Section title="How the signals combine" kicker="The weighting model">
          <p className="text-xs text-zinc-400 mb-3 max-w-3xl">
            Score = the weighted average of the {SIGNALS.length} signal values (each 0-100), using your
            slider weights. Defaults below sum to {totalWeight}. Adjusting one slider redistributes weight
            proportionally across the others; weights always re-normalise to 100, with a floor of 5 each.
          </p>
          <div className="border border-zinc-800 rounded-lg overflow-hidden">
            {SIGNALS.map((s) => (
              <div key={s.key} className="flex items-center gap-3 px-4 py-2 border-b border-zinc-900 last:border-0">
                <span className={`w-2 h-2 rounded-sm shrink-0 ${s.bar}`} aria-hidden="true" />
                <span className="text-sm text-zinc-200 flex-1">{s.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${s.kind === "computed" ? "bg-emerald-950 border-emerald-800 text-emerald-400" : "bg-zinc-800 border-zinc-700 text-zinc-500"}`}>
                  {s.kind}
                </span>
                <span className="text-sm font-mono tabular-nums text-zinc-300 w-12 text-right">
                  {DEFAULT_SIGNAL_WEIGHTS[s.weightKey]}%
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* The six signals */}
        <Section title="The six signals" kicker="What each one means">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {SIGNALS.map((s) => (
              <SignalSpecCard key={s.key} spec={s} weight={DEFAULT_SIGNAL_WEIGHTS[s.weightKey]} />
            ))}
          </div>
        </Section>

        {/* Detail tables */}
        <Section title="Investor & velocity scoring, in detail" kicker="The exact tiers">
          <ScoringTables />
        </Section>

        {/* Principles */}
        <Section title="Computed vs estimated, and the honesty rules" kicker="Why you can trust it">
          <ul className="space-y-2 text-xs text-zinc-400 max-w-3xl list-disc pl-4">
            <li>
              <span className="text-emerald-400 font-medium">Computed</span> signals trace to a real number
              with a visible derivation in each brand row - expand any brand to see the exact inputs.
            </li>
            <li>
              <span className="text-zinc-300 font-medium">Estimated</span> signals are compiled from public
              sources, snapshot-dated, and tagged - never passed off as measured.
            </li>
            <li>All brand data is shown &quot;as of&quot; a snapshot date. There are no fake-live tickers and no external API calls.</li>
            <li>
              Bootstrapped brands score 0 on investor signals and neutral on funding signals by design -
              they surface as early scouting candidates, not as proven bets.
            </li>
          </ul>
        </Section>
      </div>
    </main>
  );
}
