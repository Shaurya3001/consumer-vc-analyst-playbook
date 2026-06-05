"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { getSectorRates } from "@/lib/data/cohorts";

interface SectorComparisonProps {
  yearRange: [number, number];
  activeSector: string | null;
  onSelectSector: (sector: string | null) => void;
}

const SHORT: Record<string, string> = {
  "Beauty & Personal Care": "BPC",
  "F&B Packaged": "F&B Pack.",
  "Health & Wellness": "Health",
  "Fashion & Accessories": "Fashion",
  "Home & Living": "Home",
  "Baby, Kids & Pets": "Baby/Pets",
  "Consumer FinTech": "FinTech",
  "Consumer Internet": "Internet",
  "Consumer Services": "Services",
  "F&B Foodservice": "F&B Svc",
  "Consumer Electronics": "Elec.",
};

interface TooltipPayloadItem {
  payload: { sector: string; rate: number; seedCount: number };
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-xs">
      <p className="text-zinc-100 font-medium mb-1">{d.sector}</p>
      <p className="text-emerald-400 tabular-nums">{Math.round(d.rate * 100)}% Seed → Series A</p>
      <p className="text-zinc-500 tabular-nums">{d.seedCount} seed-stage brands in cohort</p>
    </div>
  );
}

export default function SectorComparison({ yearRange, activeSector, onSelectSector }: SectorComparisonProps) {
  const data = getSectorRates(yearRange).map((s) => ({
    sector: s.sector,
    short: SHORT[s.sector] ?? s.sector,
    rate: s.seedToARate,
    seedCount: s.seedCount,
  }));

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-200 mb-1">Seed → Series A conversion by sector</h3>
      <p className="text-xs text-zinc-500 mb-4">
        Click a bar to filter the funnel. Higher = better odds of graduating from seed.
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 12, bottom: 8, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis
              dataKey="short"
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              axisLine={{ stroke: "#3f3f46" }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${Math.round(v * 100)}%`}
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, "dataMax"]}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "#27272a40" }} />
            <Bar
              dataKey="rate"
              radius={[4, 4, 0, 0]}
              onClick={(d) => {
                const sector = (d as unknown as { sector?: string }).sector ?? null;
                onSelectSector(activeSector === sector ? null : sector);
              }}
              className="cursor-pointer"
            >
              {data.map((d) => (
                <Cell
                  key={d.sector}
                  fill={
                    activeSector === null
                      ? "#10b981"
                      : activeSector === d.sector
                        ? "#10b981"
                        : "#3f3f46"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
