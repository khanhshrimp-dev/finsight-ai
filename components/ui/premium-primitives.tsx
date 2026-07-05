import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, CheckCircle2, CircleAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "default" | "accent" | "info" | "good" | "watch" | "bad" | "neutral";

const toneClasses: Record<Tone, string> = {
  default: "border-white/10 bg-white/[0.035] text-foreground",
  accent: "border-primary/35 bg-primary/[0.12] text-primary",
  info: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  good: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  watch: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  bad: "border-rose-400/30 bg-rose-400/10 text-rose-300",
  neutral: "border-white/10 bg-white/[0.045] text-muted-foreground",
};

const toneBars: Record<Tone, string> = {
  default: "from-slate-400 to-slate-200",
  accent: "from-primary via-cyan-300 to-violet-300",
  info: "from-cyan-400 to-blue-300",
  good: "from-emerald-400 to-teal-300",
  watch: "from-amber-300 to-orange-400",
  bad: "from-rose-400 to-red-400",
  neutral: "from-slate-500 to-slate-300",
};

export function BackgroundGrid({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(80,132,255,0.16),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(28,213,192,0.1),transparent_28%),linear-gradient(180deg,rgba(7,10,18,0.16),rgba(7,10,18,0.94))]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute left-1/2 top-0 h-80 w-[80rem] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(84,132,255,0.18),transparent_62%)]" />
    </div>
  );
}

export function AmbientGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute h-72 w-72 rounded-full bg-primary/[0.12] blur-3xl",
        className
      )}
    />
  );
}

export function AnimatedReveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("animate-in fade-in-0 slide-in-from-bottom-2 duration-500 motion-reduce:animate-none", className)}>
      {children}
    </div>
  );
}

export function StaggeredList({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("[&>*]:animate-in [&>*]:fade-in-0 [&>*]:slide-in-from-bottom-1 [&>*]:duration-300", className)}>{children}</div>;
}

export function GradientDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent", className)}
    />
  );
}

export function PremiumCard({
  children,
  className,
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.026))] shadow-[0_18px_60px_rgba(0,0,0,0.22)]",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
        glow && "shadow-[0_24px_100px_rgba(80,119,255,0.22)]",
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function GlassPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-background/58 shadow-2xl backdrop-blur-xl", className)}>
      {children}
    </div>
  );
}

export function SoftPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-white/[0.08] bg-white/[0.025]", className)}>{children}</div>;
}

export function HoverLiftCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <PremiumCard
      className={cn("transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white/[0.06]", className)}
    >
      {children}
    </PremiumCard>
  );
}

export function ResponsiveGrid({
  children,
  className,
  min = "minmax(220px,1fr)",
}: {
  children: ReactNode;
  className?: string;
  min?: string;
}) {
  return (
    <div className={cn("grid gap-4", className)} style={{ gridTemplateColumns: `repeat(auto-fit, ${min})` }}>
      {children}
    </div>
  );
}

export function SplitPanelLayout({
  left,
  center,
  right,
  className,
}: {
  left?: ReactNode;
  center: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid min-w-0 gap-4 2xl:grid-cols-[300px_minmax(0,1fr)_320px]", className)}>
      {left && <aside className="min-w-0 space-y-4 2xl:sticky 2xl:top-20 2xl:self-start">{left}</aside>}
      <section className="min-w-0 space-y-4">{center}</section>
      {right && <aside className="min-w-0 space-y-4 2xl:sticky 2xl:top-20 2xl:self-start">{right}</aside>}
    </div>
  );
}

export function PremiumSection({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description || action) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
            {description && <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function CommandPanel({
  title,
  description,
  icon: Icon = Sparkles,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <PremiumCard className={cn("p-5", className)}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/[0.12] text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 max-w-full">
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          {description && <p className="mt-1 max-w-full break-words text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">{description}</p>}
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </PremiumCard>
  );
}

export function IntelligenceCard({
  eyebrow,
  title,
  value,
  detail,
  icon: Icon = ArrowUpRight,
  tone = "default",
  className,
}: {
  eyebrow: string;
  title?: string;
  value?: string;
  detail?: string;
  icon?: LucideIcon;
  tone?: Tone;
  className?: string;
}) {
  return (
    <HoverLiftCard className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{eyebrow}</p>
          {value && <p className="mt-3 font-mono text-3xl font-semibold tabular-nums tracking-tight">{value}</p>}
          {title && <h3 className="mt-2 text-base font-semibold tracking-tight">{title}</h3>}
          {detail && <p className="mt-2 break-words text-sm leading-6 text-muted-foreground [overflow-wrap:anywhere]">{detail}</p>}
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border", toneClasses[tone])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </HoverLiftCard>
  );
}

export function MetricTile({
  label,
  value,
  detail,
  tone = "default",
  className,
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border p-4", toneClasses[tone], className)}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80">{label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {detail && <p className="mt-1 text-xs leading-5 opacity-75">{detail}</p>}
    </div>
  );
}

export function SignalPill({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", toneClasses[tone], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em]", toneClasses[tone], className)}>
      {children}
    </span>
  );
}

export function ScoreOrb({
  label,
  value,
  max = 100,
  tone = "accent",
  detail,
  className,
}: {
  label: string;
  value: number;
  max?: number;
  tone?: Tone;
  detail?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className={cn("flex min-w-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4", className)}>
      <div
        className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full"
        style={{
          background: `conic-gradient(var(--primary) ${pct}%, rgba(148,163,184,0.16) 0)`,
        }}
      >
        <div className="absolute inset-2 rounded-full bg-background" />
        <div className="relative text-center">
          <p className="font-mono text-2xl font-semibold tabular-nums">{value}</p>
          <p className="text-[10px] text-muted-foreground">/{max}</p>
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
        <div className={cn("mt-3 h-1.5 overflow-hidden rounded-full bg-white/10")}>
          <div className={cn("h-full rounded-full bg-gradient-to-r", toneBars[tone])} style={{ width: `${pct}%` }} />
        </div>
        {detail && <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>}
      </div>
    </div>
  );
}

export function ScoreMeter({
  label,
  value,
  tone = "accent",
  detail,
}: {
  label: string;
  value: number;
  tone?: Tone;
  detail?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <p className="font-mono text-lg font-semibold tabular-nums">{value}/100</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div className={cn("h-full rounded-full bg-gradient-to-r", toneBars[tone])} style={{ width: `${value}%` }} />
      </div>
      {detail && <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>}
    </div>
  );
}

export function ScoreStrip({
  items,
  className,
}: {
  items: Array<{ label: string; value: number; detail?: string; tone?: Tone }>;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 2xl:grid-cols-5", className)}>
      {items.map((item) => (
        <ScoreMeter key={item.label} {...item} />
      ))}
    </div>
  );
}

export function SignalList({
  items,
  className,
}: {
  items: Array<{ title: string; detail?: string; tone?: Tone }>;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => (
        <div key={item.title} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3">
          {item.tone === "bad" ? (
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium">{item.title}</p>
            {item.detail && <p className="mt-1 break-words text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">{item.detail}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function InsightTimeline({
  items,
  className,
}: {
  items: Array<{ title: string; meta: string; detail?: string; tone?: Tone }>;
  className?: string;
}) {
  return (
    <div className={cn("relative space-y-3 before:absolute before:left-3 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-white/10", className)}>
      {items.map((item) => (
        <div key={`${item.title}-${item.meta}`} className="relative flex gap-3">
          <span className={cn("mt-1 h-6 w-6 shrink-0 rounded-full border bg-background", toneClasses[item.tone ?? "default"])} />
          <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.025] p-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">{item.title}</p>
              <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{item.meta}</span>
            </div>
            {item.detail && <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ResponsiveDataTable({
  children,
  cards,
  className,
}: {
  children: ReactNode;
  cards?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      {cards && <div className="grid gap-3 lg:hidden">{cards}</div>}
      <div className={cn("hidden overflow-x-auto rounded-2xl border border-white/10 lg:block", cards && "lg:block")}>
        {children}
      </div>
    </div>
  );
}

export function MobileDataCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-white/10 bg-white/[0.035] p-4", className)}>{children}</div>;
}

export function ChartPanel({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <PremiumCard className={cn("p-5", className)}>
      <div className="mb-4">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {description && <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>}
      </div>
      <div className="min-h-64">{children}</div>
    </PremiumCard>
  );
}

export function ResponsiveTabs({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}>{children}</div>;
}

export function MobileFilterSheet({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-white/10 bg-white/[0.035] p-4", className)}>{children}</div>;
}
