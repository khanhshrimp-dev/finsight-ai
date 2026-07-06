import Link from "next/link";
import {
  AlertTriangle,
  ShieldX,
  Activity,
  Info,
  ArrowRight,
  Clock,
  LineChart,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { RiskBadge } from "@/components/ui/risk-badge";
import { RiskTrendChart } from "@/components/charts/risk-trend-chart";
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart";
import {
  mockRiskTrend,
  allAlerts,
} from "@/lib/mock";
import {
  companyIntelligence,
  marketIntelligenceUniverse,
  newsIntelligenceUniverse,
  portfolioIntelligenceStats,
} from "@/lib/mock/company-intelligence";
import type { Alert } from "@/types";
import { cn } from "@/lib/utils";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  ChartPanel,
  CommandPanel,
  MetricTile,
  PremiumCard,
  ScoreStrip,
  SignalPill,
  StatusBadge,
} from "@/components/ui/premium-primitives";
import {
  PremiumTabs,
  SectionSummaryCard,
} from "@/components/ui/progressive-disclosure";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(dateStr: string): string {
  const now = new Date("2026-07-04");
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

function formatRevenue(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}B`;
  return `$${value}M`;
}

function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function signalTextColor(value: number, inverted = false) {
  if (inverted) {
    if (value >= 70) return "text-red-600 dark:text-red-400";
    if (value >= 50) return "text-orange-600 dark:text-orange-400";
    return "text-emerald-600 dark:text-emerald-400";
  }
  if (value >= 70) return "text-emerald-600 dark:text-emerald-400";
  if (value >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function signalTone(value: number, inverted = false): "good" | "watch" | "bad" {
  if (inverted) {
    if (value >= 70) return "bad";
    if (value >= 50) return "watch";
    return "good";
  }
  if (value >= 70) return "good";
  if (value >= 50) return "watch";
  return "bad";
}

// ─── Alert severity config ────────────────────────────────────────────────────

const alertSeverityConfig = {
  critical: {
    icon: ShieldX,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
    label: "Critical",
    dot: "bg-red-500",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    label: "Warning",
    dot: "bg-amber-500",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    label: "Info",
    dot: "bg-blue-500",
  },
};

function AlertRow({ alert }: { alert: Alert }) {
  const cfg = alertSeverityConfig[alert.severity];
  const Icon = cfg.icon;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/60 last:border-0 group">
      <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", cfg.iconBg)}>
        <Icon className={cn("h-3.5 w-3.5", cfg.iconColor)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium leading-snug">{alert.title}</p>
          {!alert.read && (
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", cfg.dot)} />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
          {alert.description}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <Link
            href={`/dashboard/company/${alert.companyId}`}
            className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            {alert.companyName}
          </Link>
          <span className="text-muted-foreground/40 text-[11px]">·</span>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(alert.date)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const stats = portfolioIntelligenceStats;
  const topCompanies = [...companyIntelligence]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4);
  const strongestInvestment = [...companyIntelligence]
    .sort((a, b) => b.investmentHealth.score - a.investmentHealth.score)
    .slice(0, 3);
  const marketMovers = [...marketIntelligenceUniverse]
    .sort((a, b) => b.metrics.performance.oneYear - a.metrics.performance.oneYear)
    .slice(0, 4);
  const recentNews = newsIntelligenceUniverse
    .flatMap((item) => item.items.map((news) => ({ ...news, companyName: item.companyName })))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 4);

  const recentAlerts = [...allAlerts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  const today = new Date("2026-07-04").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <DashboardPageShell>
      <PageHeader
        eyebrow="Command Center"
        title="What needs my attention today?"
        description={`Portfolio risk, market, news, and investment-health triage as of ${today}.`}
        icon={Activity}
        actions={
        <Link
          href="/dashboard/companies"
          className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
        >
          View all companies
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        }
      />

      <ScoreStrip
        items={[
          {
            label: "Financial Health",
            value: stats.averageFinancialHealthScore,
            detail: "Average mock score",
            tone: signalTone(stats.averageFinancialHealthScore),
          },
          {
            label: "Avg Risk",
            value: stats.averageRiskScore,
            detail: "Portfolio risk score",
            tone: signalTone(stats.averageRiskScore, true),
          },
          {
            label: "Investment Health",
            value: stats.averageInvestmentHealthScore,
            detail: "Composite signal",
            tone: "accent",
          },
          {
            label: "Market Momentum",
            value: stats.averageMarketMomentumScore,
            detail: "Mock price signal",
            tone: "info",
          },
          {
            label: "News Sentiment",
            value: stats.averageNewsSentimentScore,
            detail: `${stats.negativeNewsCount} negative events`,
            tone: "watch",
          },
        ]}
      />

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.75fr)]">
        <ChartPanel
          title="Portfolio Risk Command Trend"
          description="Average risk score across monitored companies from January 2024 to December 2024."
          className="min-w-0"
        >
          <div className="h-[260px]">
            <RiskTrendChart data={mockRiskTrend} />
          </div>
        </ChartPanel>
        <PremiumCard className="min-w-0 p-5">
          <div className="mb-4">
            <h2 className="text-base font-semibold tracking-tight">Risk Distribution</h2>
            <p className="mt-1 text-sm text-muted-foreground">Companies by deterministic risk tier.</p>
          </div>
          <RiskDistributionChart data={stats.riskDistribution} />
        </PremiumCard>
      </div>

      <PremiumTabs
        defaultValue="attention"
        tabs={[
          {
            value: "attention",
            label: "Attention",
            badge: topCompanies.length + recentAlerts.length,
            content: (
              <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]">
                <PremiumCard className="min-w-0 p-5">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-base font-semibold tracking-tight">Attention stream</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Highest-risk companies with revenue context and latest signal labels.</p>
                    </div>
                    <Link href="/dashboard/companies" className="inline-flex w-fit items-center gap-1 text-sm text-primary">
                      All companies <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {topCompanies.slice(0, 4).map((item) => {
                      const { company, latestPeriod } = item;
                      return (
                        <Link
                          key={company.id}
                          href={`/dashboard/company/${company.id}`}
                          className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-primary/30 md:grid-cols-[72px_minmax(0,1fr)_auto]"
                        >
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-background/70">
                            <span className={cn("font-mono text-xl font-semibold", signalTextColor(item.riskScore, true))}>
                              {item.riskScore}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold">{company.name}</p>
                              <SignalPill tone="neutral">{company.ticker}</SignalPill>
                              <RiskBadge tier={company.riskTier} size="sm" />
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{company.sector} · {company.industry}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 md:justify-end">
                            <MetricTile label="Revenue" value={formatRevenue(latestPeriod.revenue)} detail={latestPeriod.period} />
                            <MetricTile label="IH" value={String(item.investmentHealth.score)} detail={`${item.negativeNewsCount} neg news`} tone="accent" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </PremiumCard>

                <CommandPanel title="Recent alerts" description="Latest risk events across the mock watchlist." icon={AlertTriangle}>
                  <div className="divide-y divide-white/10">
                    {recentAlerts.slice(0, 4).map((alert) => (
                      <AlertRow key={alert.id} alert={alert} />
                    ))}
                  </div>
                  <Link href="/dashboard/alerts" className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                    Open alert center <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CommandPanel>
              </div>
            ),
          },
          {
            value: "signals",
            label: "Signals",
            content: (
              <div className="grid gap-4 2xl:grid-cols-3">
                <CommandPanel title="Market momentum" description="Top one-year mock price moves." icon={LineChart}>
                  <div className="space-y-3">
                    {marketMovers.map((item) => (
                      <div key={item.ticker} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{item.companyName}</p>
                          <p className="font-mono text-xs text-muted-foreground">{item.ticker}</p>
                        </div>
                        <div className="text-right">
                          <p className={cn("font-mono text-sm font-semibold tabular-nums", signalTextColor(item.marketMomentum.score))}>
                            {item.marketMomentum.score}
                          </p>
                          <p className={cn("text-xs tabular-nums", item.metrics.performance.oneYear >= 0 ? "text-emerald-400" : "text-rose-400")}>
                            {formatPercent(item.metrics.performance.oneYear)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CommandPanel>

                <CommandPanel title="News intelligence" description="Latest classified company events." icon={Newspaper}>
                  <div className="space-y-3">
                    {recentNews.map((item) => (
                      <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                        <div className="flex items-start justify-between gap-3">
                          <p className="line-clamp-1 text-sm font-semibold">{item.title}</p>
                          <StatusBadge tone={item.sentiment === "positive" ? "good" : item.sentiment === "negative" ? "bad" : "neutral"}>
                            {item.sentiment}
                          </StatusBadge>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {item.companyName}: {item.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </CommandPanel>

                <CommandPanel title="Investment health leaders" description="Composite mock research signal." icon={Sparkles}>
                  <div className="space-y-3">
                    {strongestInvestment.map((item) => (
                      <Link
                        key={item.company.id}
                        href={`/dashboard/company/${item.company.id}`}
                        className="block rounded-xl border border-white/10 bg-white/[0.025] p-3 transition hover:border-primary/30"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{item.company.name}</p>
                            <p className="text-xs text-muted-foreground">{item.investmentHealth.label}</p>
                          </div>
                          <p className={cn("font-mono text-lg font-semibold tabular-nums", signalTextColor(item.investmentHealth.score))}>
                            {item.investmentHealth.score}
                          </p>
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-300" style={{ width: `${item.investmentHealth.score}%` }} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CommandPanel>
              </div>
            ),
          },
          {
            value: "actions",
            label: "Quick actions",
            content: (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {[
                  ["View company list", "/dashboard/companies"],
                  ["Open market intelligence", "/dashboard/market"],
                  ["Open news intelligence", "/dashboard/news"],
                  ["View all alerts", "/dashboard/alerts"],
                  ["Generate report", "/dashboard/reports"],
                ].map(([label, href]) => (
                  <SectionSummaryCard
                    key={href}
                    title={label}
                    description="Open the dedicated workspace for deeper analysis."
                    action={
                      <Link href={href} className="inline-flex items-center gap-1 text-sm text-primary">
                        Open <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    }
                  />
                ))}
              </div>
            ),
          },
          {
            value: "context",
            label: "Portfolio context",
            content: (
              <div className="grid gap-4 md:grid-cols-3">
                <SectionSummaryCard
                  eyebrow="Triage"
                  title="Elevated companies"
                  description={`${stats.highRiskCount + stats.criticalCount} companies currently screen as elevated risk across ${stats.totalCompanies} monitored companies.`}
                />
                <SectionSummaryCard
                  eyebrow="Events"
                  title="Negative news"
                  description={`${stats.negativeNewsCount} classified adverse events are visible in the current mock news set.`}
                />
                <SectionSummaryCard
                  eyebrow="Coverage"
                  title="Research universe"
                  description={`${stats.totalCompanies} companies with financial, risk, market, news, and investment-health context.`}
                />
              </div>
            ),
          },
        ]}
      />
    </DashboardPageShell>
  );
}
