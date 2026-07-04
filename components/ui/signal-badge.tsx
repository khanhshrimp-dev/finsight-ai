import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SignalBadgeTone =
  | "neutral"
  | "good"
  | "watch"
  | "bad"
  | "critical"
  | "info"
  | "accent";

interface SignalBadgeProps {
  children: ReactNode;
  tone?: SignalBadgeTone;
  className?: string;
}

const toneClass: Record<SignalBadgeTone, string> = {
  neutral: "border-border bg-muted text-muted-foreground",
  good: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  watch: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  bad: "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400",
  critical: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
  info: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  accent: "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-400",
};

export function SignalBadge({ children, tone = "neutral", className }: SignalBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
        toneClass[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
