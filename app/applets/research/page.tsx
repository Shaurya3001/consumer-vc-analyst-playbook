import Link from "next/link";
import { INDUSTRY_REPORTS, AUTHOR_TYPE_LABEL, REPORT_TAKEAWAY, type ReportAuthorType } from "@/lib/data/reports";
import { MACRO_CONSUMPTION, QUICK_COMMERCE, D2C_MARKET, BPC_MARKET, type MarketStat } from "@/lib/data/market-context";
import ReportChat from "@/components/applets/research/ReportChat";

const TYPE_STYLES: Record<ReportAuthorType, string> = {
  consulting: "bg-blue-950 text-blue-300 border-blue-800",
  vc: "bg-violet-950 text-violet-300 border-violet-800",
  research: "bg-emerald-950 text-emerald-300 border-emerald-800",
  "investment-bank": "bg-amber-950 text-amber-300 border-amber-800",
  aggregator: "bg-zinc-800 text-zinc-300 border-zinc-700",
};

function hostOf(url: string): string {
  try { return new URL(url).hostname.replace("www.", ""); } catch { return "source"; }
}

function StatGroup({ title, stats }: { title: string; stats: MarketStat[] }) {
  return (
    <div>
      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{title}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <a
            key={s.label}
            href={s.source}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-zinc-800 bg-zinc-900/60 rounded-xl p-4 hover:border-zinc-600 transition-colors"
          >
            <p className="text-lg font-bold text-zinc-100 tabular-nums">{s.value}</p>
            <p className="text-xs text-zinc-300 mt-0.5">{s.label}</p>
            <p className="text-[11px] text-zinc-500 mt-1 leading-snug line-clamp-3">{s.note}</p>
            <p className="text-[10px] text-indigo-400 mt-1.5">{s.asOf}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function ResearchPage() {
  const reports = [...INDUSTRY_REPORTS].sort((a, b) => b.year - a.year);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-zinc-800 max-w-7xl mx-auto px-6 py-4">
        <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-sm block mb-1">← Home</Link>
        <h1 className="text-xl font-bold">Research &amp; Reports</h1>
        <p className="text-zinc-500 text-xs mt-0.5 max-w-3xl">
          The canonical India consumer + VC reports an analyst should know - Bain, Redseer, Fireside,
          McKinsey, BCG, PwC and more. Headline figures are what each report published; click through to the
          source. Macro stats below are sourced to these reports.
        </p>
      </div>

      <div className="px-6 py-6">
        {/* Synthesis */}
        <div className="border border-indigo-900 bg-indigo-950/30 rounded-xl p-4 mb-8">
          <p className="text-xs text-indigo-300 font-medium mb-1">The through-line</p>
          <p className="text-sm text-indigo-100 leading-relaxed">{REPORT_TAKEAWAY}</p>
        </div>

        {/* Macro stats */}
        <h2 className="text-sm font-semibold text-zinc-200 mb-3">Macro outlook (report-sourced)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
          {MACRO_CONSUMPTION.map((s) => (
            <a
              key={s.label}
              href={s.source}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-zinc-800 bg-zinc-900/60 rounded-xl p-4 hover:border-zinc-600 transition-colors"
            >
              <p className="text-lg font-bold text-zinc-100 tabular-nums">{s.value}</p>
              <p className="text-xs text-zinc-300 mt-0.5">{s.label}</p>
              <p className="text-[11px] text-zinc-500 mt-1 leading-snug line-clamp-3">{s.note}</p>
              <p className="text-[10px] text-indigo-400 mt-1.5">{s.asOf}</p>
            </a>
          ))}
        </div>

        {/* Channel & category snapshot */}
        <h2 className="text-sm font-semibold text-zinc-200 mb-3">Channel &amp; category snapshot</h2>
        <div className="space-y-6 mb-10">
          <StatGroup title="Quick commerce" stats={QUICK_COMMERCE} />
          <StatGroup title="D2C market" stats={D2C_MARKET} />
          <StatGroup title="Beauty & personal care" stats={BPC_MARKET} />
        </div>

        {/* Chat with the reports */}
        <div className="mb-10">
          <ReportChat />
        </div>

        {/* Reports list */}
        <h2 className="text-sm font-semibold text-zinc-200 mb-3">Source reports</h2>
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="border border-zinc-800 bg-zinc-900/40 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-zinc-100">{r.title}</span>
                    <span className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border ${TYPE_STYLES[r.authorType]}`}>
                      {AUTHOR_TYPE_LABEL[r.authorType]}
                    </span>
                    <span className="text-xs text-zinc-500">{r.year}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{r.author} · {r.scope}</p>
                </div>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2 shrink-0"
                  aria-label={`Open ${r.title} on ${hostOf(r.url)}`}
                >
                  {hostOf(r.url)} ↗
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {r.keyStats.map((k, i) => (
                  <div key={i} className="flex gap-2 text-xs">
                    <span className="text-emerald-400 font-medium tabular-nums shrink-0 min-w-[88px]">{k.stat}</span>
                    <span className="text-zinc-400 leading-snug">{k.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-zinc-600 mt-6">
          Gated full PDFs (Bain, Redseer, BCG, Fireside) require sign-up on the publisher&apos;s site - linked above.
          Figures shown are the headline numbers those reports published, verified via the report pages and
          tier-1 coverage. Cite the report directly for any external use.
        </p>
      </div>
    </main>
  );
}
