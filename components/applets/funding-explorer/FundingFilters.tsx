"use client";
import { SECTORS, GTM_MODELS, INCOME_TIERS, STAGES } from "@/lib/data/taxonomy";
import type { Sector, GtmModel, IncomeTier, Stage } from "@/lib/data/taxonomy";

export interface FundingFiltersState {
  sectors: Sector[];
  gtmModels: GtmModel[];
  incomeTiers: IncomeTier[];
  stages: Stage[];
  search: string;
}

interface FundingFiltersProps {
  filters: FundingFiltersState;
  onChange: (filters: FundingFiltersState) => void;
  resultCount: number;
}

function MultiSelect<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly T[];
  selected: T[];
  onChange: (v: T[]) => void;
}) {
  const toggle = (v: T) =>
    selected.includes(v)
      ? onChange(selected.filter((s) => s !== v))
      : onChange([...selected, v]);

  return (
    <div>
      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              aria-pressed={active}
              aria-label={`Filter by ${label}: ${opt}`}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                active
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function FundingFilters({ filters, onChange, resultCount }: FundingFiltersProps) {
  const set = <K extends keyof FundingFiltersState>(key: K, value: FundingFiltersState[K]) =>
    onChange({ ...filters, [key]: value });

  const clearAll = () =>
    onChange({ sectors: [], gtmModels: [], incomeTiers: [], stages: [], search: "" });

  const hasFilters =
    filters.sectors.length > 0 ||
    filters.gtmModels.length > 0 ||
    filters.incomeTiers.length > 0 ||
    filters.stages.length > 0 ||
    filters.search.length > 0;

  return (
    <aside className="space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-400">{resultCount} round{resultCount !== 1 ? "s" : ""}</span>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-indigo-400 hover:text-indigo-300">
            Clear all
          </button>
        )}
      </div>

      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Search</p>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          placeholder="Company or investor…"
          aria-label="Search funding rounds"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <MultiSelect
        label="Stage"
        options={STAGES}
        selected={filters.stages}
        onChange={(v) => set("stages", v)}
      />
      <MultiSelect
        label="Sector"
        options={SECTORS}
        selected={filters.sectors}
        onChange={(v) => set("sectors", v)}
      />
      <MultiSelect
        label="GTM model"
        options={GTM_MODELS}
        selected={filters.gtmModels}
        onChange={(v) => set("gtmModels", v)}
      />
      <MultiSelect
        label="Income tier"
        options={INCOME_TIERS}
        selected={filters.incomeTiers}
        onChange={(v) => set("incomeTiers", v)}
      />
    </aside>
  );
}
