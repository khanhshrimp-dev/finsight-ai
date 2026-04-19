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
  mockCompanies,
  mockDashboardStats,
  mockRiskTrend,
  allAlerts,
} from "@/lib/mock";
import type { Alert } from "@/types";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(dateStr: string): string {
  const now = new Date("2025-02-10");
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

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  valueColor?: string;
}

function StatCard({ title, value, subtitle, icon: Icon, iconColor, iconBg, valueColor }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className={cn("text-3xl font-bold tabular-nums tracking-tight", valueColor ?? "text-foreground")}>
              {value}
            </p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconBg)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
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
  const topCompanies = [...mockCompanies]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);

  const recentAlerts = allAlerts.slice(0, 5);

  const today = new Date("2025-02-10").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            Financial risk intelligence as of {today}
          </p>
        </div>
        <Link
          href="/dashboard/companies"
          className="hidden sm:flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          View all companies
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Companies"
          value={String(mockDashboardStats.totalCompanies)}
          subtitle="Monitored in portfolio"
          icon={Building2}
          iconColor="text-blue-500"
          iconBg="bg-blue-500/10"
        />
        <StatCard
          title="Avg Risk Score"
          value={mockDashboardStats.averageRiskScore.toFixed(1)}
          subtitle="Portfolio-weighted average"
          icon={TrendingUp}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
          valueColor="text-amber-600 dark:text-amber-400"
        />
        <StatCard
          title="High Risk"
          value={String(mockDashboardStats.highRiskCount)}
          subtitle="Companies above score 75"
          icon={AlertTriangle}
          iconColor="text-orange-500"
          iconBg="bg-orange-500/10"
          valueColor="text-orange-600 dark:text-orange-400"
        />
        <StatCard
          title="Fraud Flags"
          value={String(mockDashboardStats.fraudFlagCount)}
          subtitle="Active fraud signal alerts"
          icon={ShieldX}
          iconColor="text-red-500"
          iconBg="bg-red-500/10"
          valueColor="text-red-600 dark:text-red-400"
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
            <RiskDistributionChart data={mockDashboardStats.riskDistribution} />
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
            {topCompanies.map((company) => {
              const latestPeriod = company.periods[company.periods.length - 1];
              return (
                <div key={company.id} className="flex items-center gap-4 py-3.5 group">
                  {/* Risk score badge */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/60 font-bold text-sm tabular-nums">
                    <span className={cn(
                      company.riskScore >= 75 ? "text-red-600 dark:text-red-400" :
                      company.riskScore >= 50 ? "text-orange-600 dark:text-orange-400" :
                      "text-amber-600 dark:text-amber-400"
                    )}>
                      {company.riskScore}
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
                  <RiskBadge tier={company.riskTier} size="sm" />

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
    </div>
  );
}
