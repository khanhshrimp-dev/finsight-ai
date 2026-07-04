import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className={cn("transition-colors hover:bg-card/80", className)}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </p>
            <p className={cn("mt-1 text-3xl font-semibold tracking-tight tabular-nums", toneStyles.value)}>
              {value}
            </p>
          </div>
          {Icon && (
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", toneStyles.bg)}>
              <Icon className={cn("h-5 w-5", toneStyles.icon)} aria-hidden="true" />
            </div>
          )}
        </div>
        {(description || trend) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            {description && <span>{description}</span>}
            {trend && (
              <span className="rounded-md border bg-background px-1.5 py-0.5 font-medium text-foreground">
                {trend}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
