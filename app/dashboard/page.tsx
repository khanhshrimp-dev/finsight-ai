import Link from "next/link";
import {
  Building2,
  AlertTriangle,
  ShieldX,
  TrendingUp,
  Activity,
  Info,
  ArrowRight,
  Clock,
  BarChart3,
  Newspaper,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
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
import { InsightStatCard } from "@/components/ui/insight-stat-card";

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
        title="Portfolio Overview"
        description={`Financial risk, market, news, and investment-health intelligence as of ${today}.`}
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

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
        <InsightStatCard
          title="Total Companies"
          value={String(stats.totalCompanies)}
          description="Monitored in portfolio"
          icon={Building2}
          tone="info"
        />
        <InsightStatCard
          title="Financial Health"
          value={String(stats.averageFinancialHealthScore)}
          description="Average score"
          icon={BarChart3}
          tone={signalTone(stats.averageFinancialHealthScore)}
        />
        <InsightStatCard
          title="Avg Risk"
          value={String(stats.averageRiskScore)}
          description={`${stats.highRiskCount + stats.criticalCount} elevated`}
          icon={TrendingUp}
          tone={signalTone(stats.averageRiskScore, true)}
        />
        <InsightStatCard
          title="Investment Health"
          value={String(stats.averageInvestmentHealthScore)}
          description="Composite research score"
          icon={Sparkles}
          tone="accent"
        />
        <InsightStatCard
          title="News Risk"
          value={String(stats.negativeNewsCount)}
          description="Negative mock events"
          icon={Newspaper}
          tone={stats.negativeNewsCount > 5 ? "watch" : "info"}
        />
        <InsightStatCard
          title="Fraud Flags"
          value={String(stats.fraudFlagCount)}
          description="Companies with detected flags"
          icon={ShieldX}
          tone="bad"
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk trend — 2/3 */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle>Portfolio Risk Trend</CardTitle>
                <CardDescription className="mt-0.5">
                  Average risk score across all monitored companies — Jan 2024 to Dec 2024
                </CardDescription>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-4 rounded-sm bg-gradient-to-r from-blue-500 to-amber-500 inline-block" />
                Avg score
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <RiskTrendChart data={mockRiskTrend} />
            </div>
          </CardContent>
        </Card>

        {/* Risk distribution — 1/3 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription className="mt-0.5">
              Companies by risk tier classification
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-1">
            <RiskDistributionChart data={stats.riskDistribution} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Market Momentum</CardTitle>
                <CardDescription className="mt-0.5">Top 1Y mock price moves</CardDescription>
              </div>
              <Link
                href="/dashboard/market"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Market <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="divide-y divide-border/60 pt-0">
            {marketMovers.map((item) => (
              <div key={item.ticker} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{item.companyName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{item.ticker}</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-sm font-semibold tabular-nums", signalTextColor(item.marketMomentum.score))}>
                    {item.marketMomentum.score}
                  </p>
                  <p className={cn("text-xs tabular-nums", item.metrics.performance.oneYear >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                    {formatPercent(item.metrics.performance.oneYear)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>News Intelligence</CardTitle>
                <CardDescription className="mt-0.5">Latest classified company events</CardDescription>
              </div>
              <Link
                href="/dashboard/news"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                News <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="divide-y divide-border/60 pt-0">
            {recentNews.map((item) => (
              <div key={item.id} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="line-clamp-1 text-sm font-semibold">{item.title}</p>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                      item.sentiment === "positive" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                      item.sentiment === "negative" && "bg-red-500/10 text-red-600 dark:text-red-400",
                      item.sentiment === "neutral" && "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.sentiment}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {item.companyName}: {item.summary}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b pb-3">
            <CardTitle>Investment Health Leaders</CardTitle>
            <CardDescription className="mt-0.5">Composite mock research signal</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border/60 pt-0">
            {strongestInvestment.map((item) => (
              <div key={item.company.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <Link
                    href={`/dashboard/company/${item.company.id}`}
                    className="truncate text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {item.company.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{item.investmentHealth.label}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${item.investmentHealth.score}%` }}
                    />
                  </div>
                  <span className={cn("w-8 text-right text-sm font-bold tabular-nums", signalTextColor(item.investmentHealth.score))}>
                    {item.investmentHealth.score}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Companies needing attention — 2/3 */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Companies Needing Attention</CardTitle>
                <CardDescription className="mt-0.5">Highest risk scores in the portfolio</CardDescription>
              </div>
              <Link
                href="/dashboard/companies"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                All companies <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0 divide-y divide-border/60">
            {topCompanies.map((item) => {
              const { company, latestPeriod } = item;
              return (
                <div key={company.id} className="flex items-center gap-4 py-3.5 group">
                  {/* Risk score badge */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/60 font-bold text-sm tabular-nums">
                    <span className={cn(
                      item.riskScore >= 75 ? "text-red-600 dark:text-red-400" :
                      item.riskScore >= 50 ? "text-orange-600 dark:text-orange-400" :
                      "text-amber-600 dark:text-amber-400"
                    )}>
                      {item.riskScore}
                    </span>
                  </div>

                  {/* Company info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/dashboard/company/${company.id}`}
                        className="text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {company.name}
                      </Link>
                      <span className="text-xs text-muted-foreground font-mono">{company.ticker}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{company.sector} · {company.industry}</p>
                  </div>

                  {/* Risk badge */}
                  <div className="hidden md:flex flex-col items-end gap-1">
                    <RiskBadge tier={company.riskTier} size="sm" />
                    <span className="text-[11px] text-muted-foreground">
                      IH {item.investmentHealth.score} · {item.negativeNewsCount} neg news
                    </span>
                  </div>

                  {/* Revenue */}
                  <div className="hidden sm:block text-right">
                    <p className="text-xs font-medium tabular-nums">{formatRevenue(latestPeriod.revenue)}</p>
                    <p className="text-[11px] text-muted-foreground">{latestPeriod.period}</p>
                  </div>

                  {/* View button */}
                  <Link
                    href={`/dashboard/company/${company.id}`}
                    className="shrink-0 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    View <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent alerts — 1/3 */}
        <Card>
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription className="mt-0.5">Latest risk events</CardDescription>
              </div>
              <Link
                href="/dashboard/alerts"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-1 pb-2">
            {recentAlerts.map((alert) => (
              <AlertRow key={alert.id} alert={alert} />
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}
