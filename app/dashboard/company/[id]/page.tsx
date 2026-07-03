import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Bot,
  Calendar,
  Users,
  MapPin,
  ChevronRight,
  BarChart3,
  Clock,
  Activity,
} from "lucide-react";

import { getCompanyById } from "@/lib/mock";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskBadge, FraudBadge } from "@/components/ui/risk-badge";
import { RiskScoreGauge } from "@/components/ui/risk-score-gauge";

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

  return (
    <div className="min-h-full">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="border-b bg-card/60 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-6 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Link
              href="/dashboard/companies"
              className="hover:text-foreground transition-colors"
            >
              Companies
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{company.name}</span>
          </nav>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: Identity */}
            <div className="flex items-start gap-5">
              {/* Gauge */}
              <div className="shrink-0 hidden sm:block">
                <RiskScoreGauge score={company.riskScore} size="xl" />
                <p className="text-center text-[10px] text-muted-foreground mt-1 font-medium">
                  Risk Score
                </p>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {company.name}
                  </h1>
                  <Badge variant="outline" className="font-mono text-xs font-bold">
                    {company.ticker}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {company.sector}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3 max-w-xl leading-relaxed">
                  {company.industry}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-3">
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

                {/* Risk badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <RiskBadge tier={company.riskTier} size="md" />
                  <FraudBadge risk={company.fraudRisk} size="md" />
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    <Activity className="h-3 w-3" />
                    {company.confidenceScore}% confidence
                  </span>
                </div>

                {/* Mobile gauge */}
                <div className="mt-3 sm:hidden">
                  <RiskScoreGauge score={company.riskScore} size="lg" />
                </div>
              </div>
            </div>

            {/* Right: CTA */}
            <div className="flex items-center gap-2 shrink-0">
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
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      <div className="px-6 py-6">
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
      </div>
    </div>
  );
}
