import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PremiumPanel } from "@/components/ui/premium-panel";
import { cn } from "@/lib/utils";

type PremiumTone = "default" | "accent" | "good" | "watch" | "bad" | "info";

const toneClasses: Record<PremiumTone, string> = {
  default: "text-foreground bg-muted/40 border-border/70",
  accent: "text-primary bg-primary/10 border-primary/20",
  good: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  watch: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
  bad: "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20",
  info: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20",
};

interface DemoDataNoticeProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  className?: string;
}

export function DemoDataNotice({
  title = "Mock data workspace",
  description = "This surface uses local demonstration data only. It does not call live providers, train models, persist changes, or produce financial advice.",
  icon: Icon,
  actions,
  className,
}: DemoDataNoticeProps) {
  return (
    <PremiumPanel className={cn("p-4 sm:p-5", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/[0.12] text-primary">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0 max-w-full">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 max-w-full break-words text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">{description}</p>
          </div>
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </PremiumPanel>
  );
}

interface CommandCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  metric?: string;
  meta?: string;
  tone?: PremiumTone;
  action?: ReactNode;
  className?: string;
}

export function CommandCard({
  title,
  description,
  icon: Icon,
  metric,
  meta,
  tone = "default",
  action,
  className,
}: CommandCardProps) {
  return (
    <PremiumPanel className={cn("h-full p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30", className)}>
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border", toneClasses[tone])}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          {metric && <p className="font-mono text-2xl font-semibold tabular-nums">{metric}</p>}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {meta && <span className="text-xs text-muted-foreground">{meta}</span>}
          {action}
        </div>
      </div>
    </PremiumPanel>
  );
}

interface MetricDeltaCardProps {
  label: string;
  value: string;
  delta?: string;
  detail: string;
  tone?: PremiumTone;
  className?: string;
}

export function MetricDeltaCard({
  label,
  value,
  delta,
  detail,
  tone = "default",
  className,
}: MetricDeltaCardProps) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/[0.035] p-4 shadow-[0_14px_46px_rgba(0,0,0,0.12)]", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 max-w-full">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        </div>
        {delta && (
          <Badge variant="outline" className={cn("border", toneClasses[tone])}>
            {delta}
          </Badge>
        )}
      </div>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}

interface AnalystMemoCardProps {
  title?: string;
  eyebrow?: string;
  summary: string;
  bullets?: string[];
  disclaimer?: string;
  icon?: LucideIcon;
  className?: string;
}

export function AnalystMemoCard({
  title = "Analyst memo",
  eyebrow,
  summary,
  bullets = [],
  disclaimer,
  icon: Icon,
  className,
}: AnalystMemoCardProps) {
  return (
    <PremiumPanel className={cn("p-5", className)}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/[0.12] text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          <p className="mt-2 max-w-full break-words text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">{summary}</p>
        </div>
      </div>
      {bullets.length > 0 && (
        <div className="mt-5 grid gap-2">
          {bullets.map((bullet) => (
            <div key={bullet} className="flex min-w-0 items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
              <span className="min-w-0 break-words [overflow-wrap:anywhere]">{bullet}</span>
            </div>
          ))}
        </div>
      )}
      {disclaimer && (
        <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-200">
          {disclaimer}
        </div>
      )}
    </PremiumPanel>
  );
}

interface FilterToolbarProps {
  children: ReactNode;
  resultCount?: string;
  className?: string;
}

export function FilterToolbar({ children, resultCount, className }: FilterToolbarProps) {
  return (
    <PremiumPanel className={cn("p-4 sm:p-5", className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {children}
        </div>
        {resultCount && (
          <div className="shrink-0 rounded-xl border border-white/10 bg-background/70 px-3 py-2 text-xs font-medium text-muted-foreground">
            {resultCount}
          </div>
        )}
      </div>
    </PremiumPanel>
  );
}

interface SplitWorkspaceLayoutProps {
  left: ReactNode;
  center: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function SplitWorkspaceLayout({
  left,
  center,
  right,
  className,
}: SplitWorkspaceLayoutProps) {
  return (
    <div className={cn("grid min-w-0 gap-4 2xl:grid-cols-[300px_minmax(0,1fr)_320px]", className)}>
      <aside className="min-w-0 space-y-4">{left}</aside>
      <section className="min-w-0">{center}</section>
      {right && <aside className="min-w-0 space-y-4">{right}</aside>}
    </div>
  );
}

export function MockActionButton({ children }: { children: ReactNode }) {
  return (
    <Button variant="outline" size="sm" className="gap-1.5">
      {children}
    </Button>
  );
}
