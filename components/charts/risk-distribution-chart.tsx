"use client";

import { cn } from "@/lib/utils";
import type { RiskTier } from "@/types";

interface DistributionItem {
  tier: RiskTier;
  count: number;
  percentage: number;
}

interface RiskDistributionChartProps {
  data: DistributionItem[];
}

const tierConfig: Record<
  RiskTier,
  { label: string; barColor: string; textColor: string; bgColor: string; dotColor: string }
> = {
  healthy: {
    label: "Healthy",
    barColor: "bg-emerald-500",
    textColor: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    dotColor: "bg-emerald-500",
  },
  medium: {
    label: "Medium Risk",
    barColor: "bg-amber-500",
    textColor: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    dotColor: "bg-amber-500",
  },
  high: {
    label: "High Risk",
    barColor: "bg-orange-500",
    textColor: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500/10",
    dotColor: "bg-orange-500",
  },
  critical: {
    label: "Critical Risk",
    barColor: "bg-red-500",
    textColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500/10",
    dotColor: "bg-red-500",
  },
};

export function RiskDistributionChart({ data }: RiskDistributionChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="space-y-4">
      {/* Segmented bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted/40">
        {data.map((item) => {
          const cfg = tierConfig[item.tier];
          return (
            <div
              key={item.tier}
              className={cn("h-full transition-all", cfg.barColor)}
              style={{ width: `${item.percentage}%` }}
              title={`${cfg.label}: ${item.count} (${item.percentage}%)`}
            />
          );
        })}
      </div>

      {/* Legend rows */}
      <div className="space-y-2.5">
        {data.map((item) => {
          const cfg = tierConfig[item.tier];
          return (
            <div key={item.tier} className="flex items-center gap-3">
              {/* Dot */}
              <div className={cn("h-2.5 w-2.5 shrink-0 rounded-full", cfg.dotColor)} />

              {/* Label */}
              <span className="flex-1 text-sm text-muted-foreground">{cfg.label}</span>

              {/* Bar track */}
              <div className="w-24 flex-shrink-0">
                <div className="h-1.5 w-full rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", cfg.barColor)}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>

              {/* Count + pct */}
              <div className="flex items-center gap-1.5 w-16 justify-end">
                <span className={cn("text-sm font-semibold tabular-nums", cfg.textColor)}>
                  {item.count}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  ({item.percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="border-t border-border pt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Total companies</span>
        <span className="font-semibold text-foreground tabular-nums">{total}</span>
      </div>
    </div>
  );
}
