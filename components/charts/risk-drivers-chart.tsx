"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { RiskDriver } from "@/types";

interface RiskDriversChartProps {
  drivers: RiskDriver[];
}

interface TooltipPayload {
  value: number;
  payload: RiskDriver & { displayValue: number };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;

  return (
    <div className="rounded-xl border border-border/60 bg-popover/95 backdrop-blur-sm px-4 py-3 shadow-xl text-sm max-w-[280px]">
      <p className="font-semibold text-foreground mb-1">{d.factor}</p>
      <p className="text-muted-foreground text-xs leading-relaxed mb-2">{d.description}</p>
      <div className="flex items-center gap-2">
        <span
          className={
            d.direction === "positive"
              ? "text-emerald-500 font-semibold"
              : "text-red-500 font-semibold"
          }
        >
          {d.direction === "positive" ? "+" : "-"}{(d.impact * 100).toFixed(0)}% impact
        </span>
        <span className="text-muted-foreground text-xs capitalize">({d.category})</span>
      </div>
    </div>
  );
}

export function RiskDriversChart({ drivers }: RiskDriversChartProps) {
  const sorted = [...drivers].sort((a, b) => b.impact - a.impact);

  const data = sorted.map((d) => ({
    ...d,
    displayValue: d.direction === "positive" ? d.impact * 100 : -(d.impact * 100),
    absValue: d.impact * 100,
  }));

  const maxVal = Math.max(...data.map((d) => Math.abs(d.displayValue)));
  const domain: [number, number] = [
    data.some((d) => d.displayValue < 0) ? -Math.ceil(maxVal * 1.1) : 0,
    Math.ceil(maxVal * 1.1),
  ];

  return (
    <ResponsiveContainer width="100%" height={Math.max(240, drivers.length * 52)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
        barSize={20}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="currentColor"
          strokeOpacity={0.08}
          horizontal={false}
        />
        <XAxis
          type="number"
          domain={domain}
          tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v.toFixed(0)}%`}
          tick={{ fontSize: 11, fill: "currentColor", opacity: 0.55 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="factor"
          width={148}
          tick={{ fontSize: 11, fill: "currentColor", opacity: 0.75 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "currentColor", fillOpacity: 0.04 }}
        />
        <Bar dataKey="displayValue" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.direction === "positive"
                  ? "#10b981"
                  : "#ef4444"
              }
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
