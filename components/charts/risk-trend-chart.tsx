"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RiskTrendDataPoint {
  month: string;
  avgScore: number;
}

interface RiskTrendChartProps {
  data: RiskTrendDataPoint[];
  height?: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="rounded-lg border border-border bg-card/95 backdrop-blur px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold text-foreground">{label}</p>
      <p className="mt-0.5 text-amber-500 font-medium">
        Avg Risk Score:{" "}
        <span className="text-foreground">{value.toFixed(1)}</span>
      </p>
    </div>
  );
}

export function RiskTrendChart({ data, height = 220 }: RiskTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height} minWidth={0}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="riskGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.06)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          dy={6}
        />
        <YAxis
          domain={[35, 60]}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />
        <Line
          type="monotone"
          dataKey="avgScore"
          stroke="url(#riskGradient)"
          strokeWidth={2.5}
          dot={false}
          activeDot={{
            r: 5,
            fill: "#f59e0b",
            stroke: "hsl(var(--background))",
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
