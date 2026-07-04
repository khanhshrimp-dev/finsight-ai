import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Bot,
  Calendar,
  Users,
  MapPin,
  BarChart3,
  Clock,
  Activity,
  Building2,
  Newspaper,
  Sparkles,
  LineChart,
} from "lucide-react";

import { getCompanyById } from "@/lib/mock";
import { companyIntelligence } from "@/lib/mock/company-intelligence";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RiskBadge, FraudBadge } from "@/components/ui/risk-badge";
import { RiskScoreGauge } from "@/components/ui/risk-score-gauge";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { InsightStatCard } from "@/components/ui/insight-stat-card";

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
            <Link href="/dashboard/compare">
              <Button variant="outline" size="sm" className="gap-1.5">
                <BarChart3 className="h-4 w-4" />
                Compare
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardContent className="flex items-center gap-4 pt-5">
            <RiskScoreGauge score={company.riskScore} size="lg" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Risk Score
              </p>
              <p className="text-2xl font-semibold tabular-nums">{company.riskScore}/100</p>
              <p className="text-xs capitalize text-muted-foreground">{company.riskTier} risk tier</p>
            </div>
          </CardContent>
        </Card>
        <InsightStatCard
          title="Financial Health"
          value={intelligence?.financialHealthScore ?? Math.max(0, 100 - company.riskScore)}
          description="Latest mock score"
          icon={BarChart3}
          tone={scoreTone(intelligence?.financialHealthScore ?? Math.max(0, 100 - company.riskScore))}
        />
        <InsightStatCard
          title="Investment Health"
          value={intelligence?.investmentHealth.score ?? "N/A"}
          description={intelligence?.investmentHealth.label ?? "Composite mock signal"}
          icon={Sparkles}
          tone={intelligence ? scoreTone(intelligence.investmentHealth.score) : "default"}
        />
        <InsightStatCard
          title="Market Momentum"
          value={intelligence?.marketMomentumScore ?? "N/A"}
          description="Mock price signal"
          icon={LineChart}
          tone={intelligence ? scoreTone(intelligence.marketMomentumScore) : "default"}
        />
        <InsightStatCard
          title="News Sentiment"
          value={intelligence?.newsSentimentScore ?? "N/A"}
          description={`${intelligence?.negativeNewsCount ?? 0} negative event(s)`}
          icon={Newspaper}
          tone={intelligence ? scoreTone(intelligence.newsSentimentScore) : "default"}
        />
      </div>

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
