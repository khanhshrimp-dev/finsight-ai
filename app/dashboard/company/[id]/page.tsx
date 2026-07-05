import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Bot,
  Calendar,
  Users,
  MapPin,
  Clock,
  Activity,
  Building2,
  FileText,
  Sparkles,
  LineChart,
  SlidersHorizontal,
} from "lucide-react";

import { getCompanyById } from "@/lib/mock";
import { companyIntelligence } from "@/lib/mock/company-intelligence";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskBadge, FraudBadge } from "@/components/ui/risk-badge";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  CommandPanel,
  MetricTile,
  PremiumCard,
  ResponsiveGrid,
  ScoreOrb,
  ScoreStrip,
  SignalList,
  SignalPill,
  StatusBadge,
} from "@/components/ui/premium-primitives";
import { cn } from "@/lib/utils";

import { CompanyTabs } from "./company-tabs";

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const company = getCompanyById(id);
  if (!company) return { title: "Company Not Found" };
  return {
    title: `${company.name} (${company.ticker}) — FinSight AI`,
    description: `Financial risk analysis for ${company.name}. Risk score: ${company.riskScore}/100.`,
  };
}

function formatPrice(value: number | null): string {
  if (value == null) return "N/A";
  return `$${value.toFixed(2)}`;
}

function formatPercent(value: number | null): string {
  if (value == null) return "N/A";
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = getCompanyById(id);

  if (!company) {
    notFound();
  }

  const latestPeriod = company.periods[company.periods.length - 1];
  const intelligence = companyIntelligence.find((item) => item.company.id === company.id);
  const m = latestPeriod.metrics;
  const prevPeriod =
    company.periods.length > 1
      ? company.periods[company.periods.length - 2]
      : null;

  // Determine metric statuses
  const currentRatioStatus =
    m.currentRatio >= 2
      ? "good"
      : m.currentRatio >= 1.2
      ? "neutral"
      : "bad";
  const debtToEquityStatus =
    m.debtToEquity <= 1
      ? "good"
      : m.debtToEquity <= 2
      ? "warning"
      : "bad";
  const netMarginStatus =
    m.netMargin >= 0.1
      ? "good"
      : m.netMargin >= 0.02
      ? "neutral"
      : "bad";
  const interestCoverageStatus =
    m.interestCoverage >= 3
      ? "good"
      : m.interestCoverage >= 1.5
      ? "warning"
      : "bad";
  const roaStatus =
    m.roa >= 0.08
      ? "good"
      : m.roa >= 0.02
      ? "neutral"
      : "bad";
  const revenueGrowthStatus =
    m.revenueGrowth == null
      ? "neutral"
      : m.revenueGrowth >= 0.05
      ? "good"
      : m.revenueGrowth >= 0
      ? "neutral"
      : "bad";

  const revenueGrowthTrend =
    m.revenueGrowth == null
      ? "neutral"
      : m.revenueGrowth >= 0
      ? "up"
      : "down";

  const scoreTone = (score: number, inverted = false): "good" | "watch" | "bad" => {
    if (inverted) {
      if (score >= 70) return "bad";
      if (score >= 50) return "watch";
      return "good";
    }
    if (score >= 70) return "good";
    if (score >= 50) return "watch";
    return "bad";
  };

  return (
    <DashboardPageShell maxWidth="wide">
      <PageHeader
        breadcrumbs={[
          { label: "Companies", href: "/dashboard/companies" },
          { label: company.name },
        ]}
        eyebrow={`${company.exchange} · ${company.country}`}
        title={company.name}
        description={company.industry}
        icon={Building2}
        actions={
          <>
            <Link href={`/dashboard/copilot?company=${company.id}`}>
              <Button variant="default" size="sm" className="gap-1.5">
                <Bot className="h-4 w-4" />
                Ask Copilot
              </Button>
            </Link>
            <Link href="/dashboard/simulator">
              <Button variant="outline" size="sm" className="gap-1.5">
                <SlidersHorizontal className="h-4 w-4" />
                Open Simulator
              </Button>
            </Link>
            <Link href="/dashboard/reports">
              <Button variant="outline" size="sm" className="gap-1.5">
                <FileText className="h-4 w-4" />
                Generate Report
              </Button>
            </Link>
          </>
        }
        meta={
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs font-bold">
                {company.ticker}
              </Badge>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium">
                <LineChart className="h-3 w-3 text-primary" />
                <span className="tabular-nums">{formatPrice(intelligence?.latestPrice ?? null)}</span>
                <span
                  className={cn(
                    "tabular-nums",
                    (intelligence?.priceChangePercent ?? 0) >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  )}
                >
                  {formatPercent(intelligence?.priceChangePercent ?? null)}
                </span>
              </span>
              <Badge variant="secondary" className="text-xs">
                {company.sector}
              </Badge>
              <RiskBadge tier={company.riskTier} size="md" />
              <FraudBadge risk={company.fraudRisk} size="md" />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <Activity className="h-3 w-3" />
                {company.confidenceScore}% confidence
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {company.headquarters}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                Founded {company.founded}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 shrink-0" />
                {company.employees.toLocaleString()} employees
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                Updated {company.lastUpdated}
              </span>
            </div>
          </div>
        }
      />

      <PremiumCard glow className="p-4 sm:p-5 lg:p-6">
        <div className="grid gap-5 2xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
          <div className="space-y-4">
            <ScoreOrb
              label="Risk Score"
              value={company.riskScore}
              detail={`${company.riskTier} risk tier · ${company.confidenceScore}% confidence`}
              tone={scoreTone(company.riskScore, true)}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile
                label="Mock Price"
                value={formatPrice(intelligence?.latestPrice ?? null)}
                detail={`${formatPercent(intelligence?.priceChangePercent ?? null)} latest move`}
                tone={(intelligence?.priceChangePercent ?? 0) >= 0 ? "good" : "bad"}
              />
              <MetricTile
                label="Coverage"
                value={company.ticker}
                detail={`${company.exchange} · ${company.country}`}
                tone="info"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <SignalPill tone="neutral">{company.sector}</SignalPill>
              <RiskBadge tier={company.riskTier} size="md" />
              <FraudBadge risk={company.fraudRisk} size="md" />
              <StatusBadge tone="accent">Research terminal</StatusBadge>
            </div>
            <ScoreStrip
              items={[
                {
                  label: "Financial Health",
                  value: intelligence?.financialHealthScore ?? Math.max(0, 100 - company.riskScore),
                  detail: "Latest mock score",
                  tone: scoreTone(intelligence?.financialHealthScore ?? Math.max(0, 100 - company.riskScore)),
                },
                {
                  label: "Investment Health",
                  value: intelligence?.investmentHealth.score ?? 0,
                  detail: intelligence?.investmentHealth.label ?? "Composite signal",
                  tone: intelligence ? scoreTone(intelligence.investmentHealth.score) : "neutral",
                },
                {
                  label: "Market Momentum",
                  value: intelligence?.marketMomentumScore ?? 0,
                  detail: "Mock price signal",
                  tone: intelligence ? scoreTone(intelligence.marketMomentumScore) : "neutral",
                },
                {
                  label: "News Sentiment",
                  value: intelligence?.newsSentimentScore ?? 0,
                  detail: `${intelligence?.negativeNewsCount ?? 0} negative event(s)`,
                  tone: intelligence ? scoreTone(intelligence.newsSentimentScore) : "neutral",
                },
                {
                  label: "Confidence",
                  value: company.confidenceScore,
                  detail: "Mock model coverage",
                  tone: "info",
                },
              ]}
            />
          </div>
        </div>
      </PremiumCard>

      <ResponsiveGrid min="minmax(280px,1fr)">
        <CommandPanel
          title="AI analyst memo"
          description={company.aiSummary}
          icon={Bot}
        >
          <SignalList
            items={[
              { title: "Review financial quality", detail: `Current ratio ${m.currentRatio.toFixed(2)}x and net margin ${(m.netMargin * 100).toFixed(1)}% anchor the latest score.` },
              { title: "Cross-check market/news context", detail: `Market momentum ${intelligence?.marketMomentumScore ?? "N/A"} and news sentiment ${intelligence?.newsSentimentScore ?? "N/A"} remain contextual signals.` },
            ]}
          />
        </CommandPanel>
        <CommandPanel
          title="Attention signals"
          description="Primary watch items before opening the detailed tabs."
          icon={Sparkles}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricTile label="Revenue" value={`$${latestPeriod.revenue.toLocaleString()}M`} detail={latestPeriod.period} />
            <MetricTile label="Debt / Equity" value={`${m.debtToEquity.toFixed(2)}x`} detail={debtToEquityStatus} tone={debtToEquityStatus === "bad" ? "bad" : debtToEquityStatus === "warning" ? "watch" : "good"} />
            <MetricTile label="Interest Coverage" value={`${m.interestCoverage.toFixed(1)}x`} detail={interestCoverageStatus} tone={interestCoverageStatus === "bad" ? "bad" : interestCoverageStatus === "warning" ? "watch" : "good"} />
            <MetricTile label="News Events" value={String(intelligence?.negativeNewsCount ?? 0)} detail="Negative classified events" tone={(intelligence?.negativeNewsCount ?? 0) > 0 ? "watch" : "good"} />
          </div>
        </CommandPanel>
      </ResponsiveGrid>

      <CompanyTabs
        company={company}
        latestPeriod={latestPeriod}
        prevPeriod={prevPeriod}
        metrics={{
          currentRatio: { status: currentRatioStatus },
          debtToEquity: { status: debtToEquityStatus },
          netMargin: { status: netMarginStatus },
          interestCoverage: { status: interestCoverageStatus },
          roa: { status: roaStatus },
          revenueGrowth: {
            status: revenueGrowthStatus,
            trend: revenueGrowthTrend,
          },
        }}
      />
    </DashboardPageShell>
  );
}
