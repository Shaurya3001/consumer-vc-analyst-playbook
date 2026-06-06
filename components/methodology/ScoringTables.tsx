import { FUNDING_ROUNDS } from "@/lib/data/funding-rounds";
import { roundCadence } from "@/lib/utils/funding-analytics";
import {
  AUM_QUALITY_TIERS,
  NULL_AUM_BASE_BY_TYPE,
  STAGE_LADDER,
  expectedStagesPerYear,
} from "@/lib/data/scoring-spec";

function TableCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/40">
      <p className="text-sm font-semibold text-zinc-200">{title}</p>
      {sub ? <p className="text-xs text-zinc-500 mt-0.5 mb-3">{sub}</p> : <div className="mb-3" />}
      {children}
    </div>
  );
}

function Rows({ rows }: { rows: { k: string; v: string | number }[] }) {
  return (
    <div className="space-y-1">
      {rows.map(({ k, v }) => (
        <div key={k} className="flex items-center justify-between text-xs border-b border-zinc-900 last:border-0 py-1">
          <span className="text-zinc-400">{k}</span>
          <span className="text-zinc-200 font-mono tabular-nums">{v}</span>
        </div>
      ))}
    </div>
  );
}

export default function ScoringTables() {
  const cadence = roundCadence(FUNDING_ROUNDS);
  const expected = expectedStagesPerYear(cadence.medianMonths);

  const aumRows = AUM_QUALITY_TIERS.map((t) => ({ k: t.label, v: t.score }));
  const typeRows = Object.entries(NULL_AUM_BASE_BY_TYPE)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({ k, v }));
  const ladderRows = Object.entries(STAGE_LADDER).map(([k, v]) => ({ k, v: `rung ${v}` }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TableCard title="Investor Quality - disclosed AUM" sub="First tier the fund's AUM clears sets the base score.">
        <Rows rows={aumRows} />
      </TableCard>

      <TableCard title="Investor Quality - undisclosed AUM" sub="Sovereigns, strategics and angel networks are scored by type instead of penalised to the floor.">
        <Rows rows={typeRows} />
      </TableCard>

      <TableCard title="Stage Velocity - the ladder" sub={`Live base rate: ${cadence.medianMonths}-mo median round cadence = ${expected.toFixed(1)} stages/yr (that pace scores 50).`}>
        <Rows rows={ladderRows} />
      </TableCard>
    </div>
  );
}
