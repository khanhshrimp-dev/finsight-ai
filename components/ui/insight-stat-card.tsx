import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type InsightStatTone = "default" | "good" | "watch" | "bad" | "info" | "accent";

interface InsightStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  tone?: InsightStatTone;
  trend?: string;
  className?: string;
}

const toneClass: Record<InsightStatTone, { icon: string; value: string; bg: string }> = {
  default: {
    icon: "text-muted-foreground",
    value: "text-foreground",
    bg: "bg-muted/60",
  },
  good: {
    icon: "text-emerald-600 dark:text-emerald-400",
    value: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  watch: {
    icon: "text-amber-600 dark:text-amber-400",
    value: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  bad: {
    icon: "text-red-600 dark:text-red-400",
    value: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
  },
  info: {
    icon: "text-sky-600 dark:text-sky-400",
    value: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10",
  },
  accent: {
    icon: "text-violet-600 dark:text-violet-400",
    value: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
};

export function InsightStatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "default",
  trend,
  className,
}: InsightStatCardProps) {
  const toneStyles = toneClass[tone];

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.024))] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.18)] transition hover:border-primary/30", className)}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {title}
            </p>
            <p className={cn("mt-2 font-mono text-3xl font-semibold tracking-tight tabular-nums", toneStyles.value)}>
              {value}
            </p>
          </div>
          {Icon && (
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10", toneStyles.bg)}>
              <Icon className={cn("h-5 w-5", toneStyles.icon)} aria-hidden="true" />
            </div>
          )}
        </div>
        {(description || trend) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            {description && <span>{description}</span>}
            {trend && (
              <span className="rounded-md border border-white/10 bg-background/70 px-1.5 py-0.5 font-medium text-foreground">
                {trend}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
