import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumPanelProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function PremiumPanel({ children, className, glow = false }: PremiumPanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.024))] shadow-[0_18px_70px_rgba(0,0,0,0.2)]",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
        "after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_18%_0%,rgba(102,122,255,0.12),transparent_35%)]",
        glow && "shadow-[0_26px_110px_rgba(80,119,255,0.22)]",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface BentoCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children?: ReactNode;
  className?: string;
}

export function BentoCard({
  title,
  description,
  icon: Icon,
  children,
  className,
}: BentoCardProps) {
  return (
    <PremiumPanel className={cn("p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/[0.055]", className)}>
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/25 bg-primary/[0.12] text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      {children && <div className="mt-5">{children}</div>}
    </PremiumPanel>
  );
}

interface FloatingMetricProps {
  label: string;
  value: string;
  detail: string;
  tone?: "default" | "good" | "watch" | "bad" | "accent";
  className?: string;
}

const metricTone = {
  default: "text-foreground",
  good: "text-emerald-500",
  watch: "text-amber-500",
  bad: "text-red-500",
  accent: "text-primary",
};

export function FloatingMetric({
  label,
  value,
  detail,
  tone = "default",
  className,
}: FloatingMetricProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-background/80 p-3 shadow-xl backdrop-blur-md",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-1 text-xl font-semibold tabular-nums", metricTone[tone])}>
        {value}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">{detail}</p>
    </div>
  );
}
