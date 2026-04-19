"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  trendLabel?: string;
  status?: "good" | "warning" | "bad" | "neutral";
  tooltip?: string;
  className?: string;
  compact?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  trendLabel,
  status = "neutral",
  tooltip,
  className,
  compact = false,
}: MetricCardProps) {
  const statusColors = {
    good: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    bad: "text-red-600 dark:text-red-400",
    neutral: "text-foreground",
  };

  const trendColors = {
    up: "text-emerald-600 dark:text-emerald-400",
    down: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground",
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all hover:shadow-md",
        compact ? "p-3" : "p-4",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className={cn("font-medium text-muted-foreground", compact ? "text-xs" : "text-xs")}>
              {title}
            </p>
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3 w-3 text-muted-foreground/50 cursor-help shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[220px] text-xs">{tooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className={cn("font-bold mt-0.5 tabular-nums", compact ? "text-xl" : "text-2xl", statusColors[status])}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {trend && trendValue && (
        <div className={cn("flex items-center gap-1 mt-2", trendColors[trend])}>
          <TrendIcon className="h-3 w-3 shrink-0" />
          <span className="text-xs font-medium">{trendValue}</span>
          {trendLabel && <span className="text-xs text-muted-foreground">{trendLabel}</span>}
        </div>
      )}
    </Card>
  );
}
