"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { FinancialPeriod } from "@/types";

interface TrendChartProps {
  periods: FinancialPeriod[];
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
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-popover/95 backdrop-blur-sm px-4 py-3 shadow-xl text-sm">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">
            ${(entry.value / 1000).toFixed(1)}B
          </span>
        </div>
      ))}
    </div>
  );
}

export function TrendChart({ periods }: TrendChartProps) {
  const data = periods.map((p) => ({
    period: p.period,
    Revenue: p.revenue,
    "Net Income": p.netIncome,
    EBITDA: p.ebitda,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="currentColor"
          strokeOpacity={0.08}
          vertical={false}
        />
        <XAxis
          dataKey="period"
          tick={{ fontSize: 11, fill: "currentColor", opacity: 0.55 }}
          tickLine={false}
          axisLine={false}
          dy={8}
        />
        <YAxis
          tickFormatter={(v: number) =>
            v >= 1000 ? `$${(v / 1000).toFixed(0)}B` : `$${v}M`
          }
          tick={{ fontSize: 11, fill: "currentColor", opacity: 0.55 }}
          tickLine={false}
          axisLine={false}
          width={56}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "currentColor", strokeOpacity: 0.12, strokeWidth: 1 }} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
        />
        <Line
          type="monotone"
          dataKey="Revenue"
          stroke="#6366f1"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
          activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
        />
        <Line
          type="monotone"
          dataKey="Net Income"
          stroke="#10b981"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
          activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
        />
        <Line
          type="monotone"
          dataKey="EBITDA"
          stroke="#f59e0b"
          strokeWidth={2}
          strokeDasharray="5 3"
          dot={{ r: 3, fill: "#f59e0b", strokeWidth: 0 }}
          activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
