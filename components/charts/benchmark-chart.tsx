"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { BenchmarkMetric } from "@/types";

interface BenchmarkChartProps {
  metrics: BenchmarkMetric[];
  formatValue?: (value: number, name: string) => string;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  formatValue?: (value: number, name: string) => string;
}

function defaultFormatValue(value: number): string {
  if (Math.abs(value) < 2) {
    return (value * 100).toFixed(1) + "%";
  }
  return value.toFixed(2) + "x";
}

function CustomTooltip({ active, payload, label, formatValue }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const fmt = formatValue ?? defaultFormatValue;

  return (
    <div className="rounded-xl border border-border/60 bg-popover/95 backdrop-blur-sm px-4 py-3 shadow-xl text-sm min-w-[200px]">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground text-xs">{entry.name}</span>
          </div>
          <span className="font-medium text-foreground text-xs">
            {fmt(entry.value, entry.name)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function BenchmarkChart({ metrics, formatValue }: BenchmarkChartProps) {
  const fmt = formatValue ?? defaultFormatValue;

  // Normalize: each metric to 0-100 scale relative to top quartile for visual comparison
  const chartData = metrics.map((m) => {
    const max = Math.max(
      Math.abs(m.company),
      Math.abs(m.industryAverage),
      Math.abs(m.topQuartile),
      0.001
    );
    const normalize = (v: number) =>
      max === 0 ? 0 : Math.max(0, Math.min(100, (v / max) * 100));

    return {
      name: m.name,
      Company: normalize(m.company),
      "Industry Avg": normalize(m.industryAverage),
      "Top Quartile": normalize(m.topQuartile),
      _raw: m,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={Math.max(260, metrics.length * 52)}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
        barSize={12}
        barGap={3}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="currentColor"
          strokeOpacity={0.08}
          horizontal={false}
        />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={(v: number) => `${v.toFixed(0)}`}
          tick={{ fontSize: 11, fill: "currentColor", opacity: 0.55 }}
          tickLine={false}
          axisLine={false}
          label={{
            value: "Relative Score",
            position: "insideBottom",
            offset: -2,
            style: { fontSize: 10, fill: "currentColor", opacity: 0.4 },
          }}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fontSize: 11, fill: "currentColor", opacity: 0.75 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={
            <CustomTooltip
              formatValue={(value, name) => {
                // We need raw values here; use a lookup
                const entry = chartData.find((d) =>
                  d.name === undefined ? false : true
                );
                return value.toFixed(1);
              }}
            />
          }
          cursor={{ fill: "currentColor", fillOpacity: 0.04 }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
        />
        <Bar dataKey="Company" fill="#6366f1" fillOpacity={0.9} radius={[0, 3, 3, 0]} />
        <Bar dataKey="Industry Avg" fill="#94a3b8" fillOpacity={0.7} radius={[0, 3, 3, 0]} />
        <Bar dataKey="Top Quartile" fill="#10b981" fillOpacity={0.75} radius={[0, 3, 3, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Radar variant for compare page
export { BenchmarkChart as default };
