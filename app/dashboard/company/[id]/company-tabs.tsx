"use client";

import { useState } from "react";
import {
  TrendingUp,
  Minus,
  CheckCircle2,
  XCircle,
  Target,
  ShieldAlert,
  Activity,
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { formatMetric } from "@/lib/utils/risk";
import type {
  Company,
  FinancialPeriod,
  FinancialMetrics,
  FraudSignal,
} from "@/types";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RiskDriversChart } from "@/components/charts/risk-drivers-chart";
import { BenchmarkChart } from "@/components/charts/benchmark-chart";
import { analyzeRisk, classifyRisk } from "@/lib/risk";
import { generateMockRiskAnalystResponse, profileFromCompany } from "@/lib/ai/risk-analyst";
import { getMockMarketDataByTicker } from "@/lib/market";
import { getMockNewsDataByTicker } from "@/lib/news";
import { calculateInvestmentHealthScore } from "@/lib/investment";
import { InvestmentHealthPanel } from "@/components/investment/investment-health-panel";
import { MarketIntelligenceCard } from "@/components/market/market-intelligence-card";
import { NewsIntelligenceCard } from "@/components/news/news-intelligence-card";
import {
  CommandPanel,
  MetricTile,
  PremiumCard,
  ResponsiveGrid,
  SignalList,
  StatusBadge,
} from "@/components/ui/premium-primitives";
import {
  DetailDrawer,
  ExpandableSection,
  MethodologyPopover,
  NewsEventDrawer,
  ReportPreviewDrawer,
} from "@/components/ui/progressive-disclosure";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MetricStatuses {
  currentRatio: { status: "good" | "warning" | "bad" | "neutral" };
  debtToEquity: { status: "good" | "warning" | "bad" | "neutral" };
  netMargin: { status: "good" | "warning" | "bad" | "neutral" };
  interestCoverage: { status: "good" | "warning" | "bad" | "neutral" };
  roa: { status: "good" | "warning" | "bad" | "neutral" };
  revenueGrowth: {
    status: "good" | "warning" | "bad" | "neutral";
    trend: "up" | "down" | "neutral";
  };
}

interface CompanyTabsProps {
  company: Company;
  latestPeriod: FinancialPeriod;
  prevPeriod: FinancialPeriod | null;
  metrics: MetricStatuses;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FraudSignalCard({ signal }: { signal: FraudSignal }) {
  const severityConfig = {
    high: {
      badge: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
      icon: "text-red-500",
      border: "border-red-500/20",
    },
    medium: {
      badge: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
      icon: "text-amber-500",
      border: "border-amber-500/20",
    },
    low: {
      badge: "bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400",
      icon: "text-sky-500",
      border: "border-sky-500/20",
    },
  };
  const sc = severityConfig[signal.severity];
  const DetectedIcon = signal.detected ? XCircle : CheckCircle2;
  const detectedColor = signal.detected
    ? "text-red-500 dark:text-red-400"
    : "text-emerald-500 dark:text-emerald-400";

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-md",
        signal.detected && "ring-1 ring-red-500/20"
      )}
    >
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-start gap-2 min-w-0">
            <DetectedIcon className={cn("h-4 w-4 mt-0.5 shrink-0", detectedColor)} />
            <h4 className="text-sm font-semibold text-foreground leading-snug">
              {signal.name}
            </h4>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shrink-0",
              sc.badge
            )}
          >
            {signal.severity}
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3 ml-6">
          {signal.description}
        </p>

        {signal.metric && signal.value != null && signal.benchmark != null && (
          <div className="ml-6 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-muted/50 px-3 py-2">
              <p className="text-[10px] text-muted-foreground mb-0.5">{signal.metric}</p>
              <p
                className={cn(
                  "text-sm font-bold tabular-nums",
                  signal.detected
                    ? "text-red-600 dark:text-red-400"
                    : "text-foreground"
                )}
              >
                {signal.value < 2
                  ? (signal.value * 100).toFixed(1) + "%"
                  : signal.value.toFixed(1)}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 px-3 py-2">
              <p className="text-[10px] text-muted-foreground mb-0.5">Benchmark</p>
              <p className="text-sm font-bold tabular-nums text-muted-foreground">
                {signal.benchmark < 2
                  ? (signal.benchmark * 100).toFixed(1) + "%"
                  : signal.benchmark.toFixed(1)}
              </p>
            </div>
          </div>
        )}

        <div className="ml-6 mt-2">
          <span
            className={cn(
              "text-[10px] font-medium",
              signal.detected
                ? "text-red-600 dark:text-red-400"
                : "text-emerald-600 dark:text-emerald-400"
            )}
          >
            {signal.detected ? "Signal detected" : "No signal detected"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── All Metrics Table Rows ────────────────────────────────────────────────────

interface MetricRow {
  key: keyof FinancialMetrics;
  label: string;
  format: "ratio" | "percent" | "multiple";
  description: string;
  goodThreshold?: (v: number) => boolean;
}

const ALL_METRIC_ROWS: MetricRow[] = [
  {
    key: "currentRatio" as const,
    label: "Current Ratio",
    format: "ratio",
    description: "Current assets / current liabilities",
    goodThreshold: (v) => v >= 1.5,
  },
  {
    key: "quickRatio" as const,
    label: "Quick Ratio",
    format: "ratio",
    description: "(Current assets - inventory) / current liabilities",
    goodThreshold: (v) => v >= 1.0,
  },
  {
    key: "debtToEquity" as const,
    label: "Debt-to-Equity",
    format: "ratio",
    description: "Total debt / total equity",
    goodThreshold: (v) => v <= 1.5,
  },
  {
    key: "interestCoverage" as const,
    label: "Interest Coverage",
    format: "ratio",
    description: "Operating income / interest expense",
    goodThreshold: (v) => v >= 3,
  },
  {
    key: "grossMargin" as const,
    label: "Gross Margin",
    format: "percent",
    description: "Gross profit / revenue",
    goodThreshold: (v) => v >= 0.3,
  },
  {
    key: "netMargin" as const,
    label: "Net Margin",
    format: "percent",
    description: "Net income / revenue",
    goodThreshold: (v) => v >= 0.05,
  },
  {
    key: "ebitdaMargin" as const,
    label: "EBITDA Margin",
    format: "percent",
    description: "EBITDA / revenue",
    goodThreshold: (v) => v >= 0.15,
  },
  {
    key: "roa" as const,
    label: "Return on Assets",
    format: "percent",
    description: "Net income / total assets",
    goodThreshold: (v) => v >= 0.05,
  },
  {
    key: "roe" as const,
    label: "Return on Equity",
    format: "percent",
    description: "Net income / total equity",
    goodThreshold: (v) => v >= 0.10,
  },
  {
    key: "operatingCashFlowRatio" as const,
    label: "Operating CF Ratio",
    format: "ratio",
    description: "Operating cash flow / current liabilities",
    goodThreshold: (v) => v >= 0.4,
  },
  {
    key: "altmanZScore" as const,
    label: "Altman Z-Score",
    format: "multiple",
    description: "Distress prediction score (>2.99 safe, <1.81 distress)",
    goodThreshold: (v) => v >= 2.99,
  },
  {
    key: "assetTurnover" as const,
    label: "Asset Turnover",
    format: "ratio",
    description: "Revenue / total assets",
    goodThreshold: (v) => v >= 0.5,
  },
  {
    key: "debtToAssets" as const,
    label: "Debt-to-Assets",
    format: "percent",
    description: "Total debt / total assets",
    goodThreshold: (v) => v <= 0.4,
  },
  {
    key: "revenueGrowth" as const,
    label: "Revenue Growth",
    format: "percent",
    description: "YoY revenue change",
    goodThreshold: (v) => v >= 0.05,
  },
];

// ─── Financials Tab Content ───────────────────────────────────────────────────

function FinancialsTab({ company }: { company: Company }) {
  const [selectedYear, setSelectedYear] = useState(
    company.periods[company.periods.length - 1].period
  );
  const selectedPeriod =
    company.periods.find((p) => p.period === selectedYear) ??
    company.periods[company.periods.length - 1];
  const m = selectedPeriod.metrics;

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Financial Metrics</CardTitle>
              <CardDescription>
                All ratios and metrics for the selected period
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Period:</span>
              <div className="flex gap-1">
                {company.periods.map((p) => (
                  <button
                    key={p.period}
                    onClick={() => setSelectedYear(p.period)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                      selectedYear === p.period
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {p.period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Metric
                  </th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Value
                  </th>
                  <th className="text-left py-2.5 pl-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                    Description
                  </th>
                  <th className="text-center py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Signal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {ALL_METRIC_ROWS.map((row) => {
                  const rawValue = m[row.key as keyof typeof m] as number | null;
                  if (rawValue == null) return null;

                  const formattedValue =
                    row.format === "ratio" || row.format === "multiple"
                      ? formatMetric(rawValue, row.format)
                      : formatMetric(rawValue, "percent");

                  const isGood = row.goodThreshold?.(rawValue);
                  const signalColor =
                    isGood == null
                      ? "text-muted-foreground"
                      : isGood
                      ? "text-emerald-500"
                      : "text-red-500";

                  return (
                    <tr
                      key={row.key}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 pr-4 font-medium text-foreground">
                        {row.label}
                      </td>
                      <td className="py-3 px-4 text-right font-bold tabular-nums text-foreground">
                        {formattedValue}
                      </td>
                      <td className="py-3 pl-4 text-xs text-muted-foreground hidden md:table-cell leading-relaxed">
                        {row.description}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isGood == null ? (
                          <Minus className="h-3.5 w-3.5 mx-auto text-muted-foreground/50" />
                        ) : isGood ? (
                          <CheckCircle2 className={cn("h-3.5 w-3.5 mx-auto", signalColor)} />
                        ) : (
                          <XCircle className={cn("h-3.5 w-3.5 mx-auto", signalColor)} />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* P&L Summary across periods */}
      <Card>
        <CardHeader>
          <CardTitle>Income Statement Summary</CardTitle>
          <CardDescription>
            Revenue, gross profit, operating income, and net income across all
            periods (in $M)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Metric ($M)
                  </th>
                  {company.periods.map((p) => (
                    <th
                      key={p.period}
                      className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                    >
                      {p.period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {(
                  [
                    { key: "revenue", label: "Revenue" },
                    { key: "grossProfit", label: "Gross Profit" },
                    { key: "operatingIncome", label: "Operating Income" },
                    { key: "ebitda", label: "EBITDA" },
                    { key: "netIncome", label: "Net Income" },
                    { key: "freeCashFlow", label: "Free Cash Flow" },
                  ] as const
                ).map((row) => (
                  <tr
                    key={row.key}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-3 pr-4 font-medium text-foreground">
                      {row.label}
                    </td>
                    {company.periods.map((p) => {
                      const val = p[row.key];
                      const isNeg = val < 0;
                      return (
                        <td
                          key={p.period}
                          className={cn(
                            "py-3 px-4 text-right font-medium tabular-nums",
                            isNeg
                              ? "text-red-600 dark:text-red-400"
                              : "text-foreground"
                          )}
                        >
                          {isNeg ? "-" : ""}$
                          {Math.abs(val).toLocaleString()}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Balance Sheet Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Balance Sheet Summary</CardTitle>
          <CardDescription>Key balance sheet items across all periods (in $M)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Item ($M)
                  </th>
                  {company.periods.map((p) => (
                    <th
                      key={p.period}
                      className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                    >
                      {p.period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {(
                  [
                    { key: "totalAssets", label: "Total Assets" },
                    { key: "currentAssets", label: "Current Assets" },
                    { key: "cash", label: "Cash & Equivalents" },
                    { key: "accountsReceivable", label: "Accounts Receivable" },
                    { key: "inventory", label: "Inventory" },
                    { key: "totalLiabilities", label: "Total Liabilities" },
                    { key: "currentLiabilities", label: "Current Liabilities" },
                    { key: "shortTermDebt", label: "Short-Term Debt" },
                    { key: "longTermDebt", label: "Long-Term Debt" },
                    { key: "totalEquity", label: "Total Equity" },
                  ] as const
                ).map((row) => (
                  <tr
                    key={row.key}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 pr-4 font-medium text-foreground">
                      {row.label}
                    </td>
                    {company.periods.map((p) => (
                      <td
                        key={p.period}
                        className="py-3 px-4 text-right tabular-nums text-foreground"
                      >
                        ${p[row.key].toLocaleString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Risk Analysis Tab ─────────────────────────────────────────────────────────

function RiskAnalysisTab({ company }: { company: Company }) {
  return (
    <div className="space-y-6">
      {/* Risk Drivers */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Drivers</CardTitle>
          <CardDescription>
            Factors contributing to the overall risk score — green bars are
            positive, red bars are negative
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RiskDriversChart drivers={company.riskDrivers} />
        </CardContent>
      </Card>

      {/* Benchmark Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Benchmark Comparison</CardTitle>
          <CardDescription>
            {company.benchmarkData.peerGroup} · Visual comparison of company vs
            industry average vs top quartile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BenchmarkChart metrics={company.benchmarkData.metrics} />

          {/* Detailed table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Metric
                  </th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Company
                  </th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Ind. Avg
                  </th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Top Quartile
                  </th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Peer Median
                  </th>
                  <th className="text-center py-2.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Percentile
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {company.benchmarkData.metrics.map((bm) => {
                  const fmtBm = (v: number) =>
                    Math.abs(v) < 5
                      ? (v * 100).toFixed(1) + "%"
                      : v.toFixed(2);

                  const pctColor =
                    bm.percentileRank >= 70
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                      : bm.percentileRank >= 40
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                      : "bg-red-500/15 text-red-700 dark:text-red-400";

                  return (
                    <tr
                      key={bm.name}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 pr-4 font-medium text-foreground">
                        {bm.name}
                      </td>
                      <td className="py-3 px-4 text-right font-bold tabular-nums text-foreground">
                        {fmtBm(bm.company)}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">
                        {fmtBm(bm.industryAverage)}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">
                        {fmtBm(bm.topQuartile)}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-muted-foreground">
                        {fmtBm(bm.peerMedian)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold",
                            pctColor
                          )}
                        >
                          {bm.percentileRank}th
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Fraud Signals Tab ────────────────────────────────────────────────────────

function FraudSignalsTab({ company }: { company: Company }) {
  const detected = company.fraudSignals.filter((s) => s.detected);
  const clean = company.fraudSignals.filter((s) => !s.detected);

  const overallColor =
    company.fraudRisk === "high"
      ? "border-red-500/30 bg-red-500/5"
      : company.fraudRisk === "medium"
      ? "border-amber-500/30 bg-amber-500/5"
      : "border-emerald-500/30 bg-emerald-500/5";

  const overallText =
    company.fraudRisk === "high"
      ? "text-red-600 dark:text-red-400"
      : company.fraudRisk === "medium"
      ? "text-amber-600 dark:text-amber-400"
      : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <div className={cn("rounded-xl border p-4 flex flex-wrap items-center gap-4", overallColor)}>
        <div className="flex items-center gap-2">
          <ShieldAlert className={cn("h-5 w-5", overallText)} />
          <span className={cn("font-semibold text-sm", overallText)}>
            Fraud Risk: {company.fraudRisk === "none" ? "None Detected" : company.fraudRisk.charAt(0).toUpperCase() + company.fraudRisk.slice(1)}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground ml-auto">
          <span>
            <span className="font-bold text-red-500">{detected.length}</span>{" "}
            signal{detected.length !== 1 ? "s" : ""} detected
          </span>
          <span>
            <span className="font-bold text-emerald-500">{clean.length}</span>{" "}
            clear
          </span>
          <span>
            {company.fraudSignals.length} total checks
          </span>
        </div>
      </div>

      {/* Detected signals */}
      {detected.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500" />
            Detected Signals ({detected.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {detected.map((s) => (
              <FraudSignalCard key={s.id} signal={s} />
            ))}
          </div>
        </div>
      )}

      {/* Clean signals */}
      {clean.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            No Signal Detected ({clean.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {clean.map((s) => (
              <FraudSignalCard key={s.id} signal={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Tabs Component ───────────────────────────────────────────────────────

export function CompanyTabs({
  company,
  latestPeriod,
  prevPeriod,
}: CompanyTabsProps) {
  const m = latestPeriod.metrics;
  const generatedRisk = analyzeRisk(m, {
    currentPeriod: latestPeriod,
    previousPeriod: prevPeriod,
  });
  const marketData = getMockMarketDataByTicker(company.ticker);
  const newsData = getMockNewsDataByTicker(company.ticker);
  const financialHealthScore = Math.round(Math.max(0, Math.min(100, 100 - generatedRisk.riskScore)));
  const riskScore = Math.max(generatedRisk.riskScore, company.riskScore);
  const riskLabel = classifyRisk(riskScore);
  const marketMomentumScore = marketData?.marketMomentum.score ?? 50;
  const newsSentimentScore = newsData?.sentiment.score ?? 55;
  const valuationScore = 50;
  const investmentHealth = calculateInvestmentHealthScore({
    financialHealthScore,
    riskScore,
    marketMomentumScore,
    newsSentimentScore,
    valuationScore,
  });
  const analyst = generateMockRiskAnalystResponse({
    companyProfile: profileFromCompany(company),
    financialMetrics: m,
    riskScore,
    riskLabel,
    riskDrivers: generatedRisk.drivers,
    fraudSignals: generatedRisk.fraudSignals,
    benchmarkData: company.benchmarkData,
    financialHealthScore,
    marketMomentumScore,
    newsSentimentScore,
    investmentHealthScore: investmentHealth.score,
    investmentHealthLabel: investmentHealth.label,
    recentEvents: newsData?.items.map((item) => ({
      title: item.title,
      eventType: item.eventType,
      sentiment: item.sentiment,
      severity: item.severity,
      riskImpact: item.riskImpact,
    })),
  });
  const latestImportantEvent =
    newsData?.items.find((item) => item.severity === "critical" || item.severity === "high") ??
    newsData?.items[0] ??
    null;

  const tabTriggerClass = cn(
    "relative shrink-0 rounded-2xl px-4 py-2.5 text-sm font-medium text-muted-foreground",
    "transition-colors",
    "hover:bg-white/[0.045] hover:text-foreground",
    "data-[state=active]:bg-primary/15 data-[state=active]:text-primary",
    "data-[state=active]:shadow-[inset_0_0_0_1px_rgba(116,146,255,0.2)]",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring"
  );

  return (
    <Tabs.Root defaultValue="overview" className="space-y-6">
      <div className="safe-scroll-x rounded-3xl border border-white/10 bg-white/[0.035] p-1">
        <Tabs.List className="inline-flex min-w-max items-center gap-1">
          <Tabs.Trigger value="overview" className={tabTriggerClass}>
            Overview
          </Tabs.Trigger>
          <Tabs.Trigger value="financials" className={tabTriggerClass}>
            Financials
          </Tabs.Trigger>
          <Tabs.Trigger value="risk" className={tabTriggerClass}>
            Risk Analysis
          </Tabs.Trigger>
          <Tabs.Trigger value="market" className={tabTriggerClass}>
            Market
          </Tabs.Trigger>
          <Tabs.Trigger value="news" className={tabTriggerClass}>
            News
          </Tabs.Trigger>
          <Tabs.Trigger value="fraud" className={tabTriggerClass}>
            <span className="flex items-center gap-1.5">
              Fraud Signals
              {company.fraudSignals.filter((s) => s.detected).length > 0 && (
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {company.fraudSignals.filter((s) => s.detected).length}
                </span>
              )}
            </span>
          </Tabs.Trigger>
          <Tabs.Trigger value="analyst" className={tabTriggerClass}>
            AI Analyst
          </Tabs.Trigger>
          <Tabs.Trigger value="reports" className={tabTriggerClass}>
            Reports
          </Tabs.Trigger>
        </Tabs.List>
      </div>

      {/* ── Overview Tab ──────────────────────────────────────────── */}
      <Tabs.Content value="overview" className="space-y-6 outline-none">
        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <CommandPanel
            title="Executive summary"
            description={analyst.executiveSummary}
            icon={Activity}
          >
            <div className="mt-1 flex flex-wrap gap-2">
              <StatusBadge tone="accent">Summary only</StatusBadge>
              <MethodologyPopover label="Model basis">
                Scores come from deterministic mock financial/risk rules, plus local mock market and news context. AI text explains those outputs; it does not create the numerical scores.
              </MethodologyPopover>
            </div>
          </CommandPanel>

          <PremiumCard className="p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Latest important event
            </p>
            {latestImportantEvent ? (
              <div className="mt-3 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge tone={latestImportantEvent.severity === "critical" || latestImportantEvent.severity === "high" ? "bad" : "watch"}>
                    {latestImportantEvent.severity}
                  </StatusBadge>
                  <StatusBadge tone={latestImportantEvent.sentiment === "positive" ? "good" : latestImportantEvent.sentiment === "negative" ? "bad" : "neutral"}>
                    {latestImportantEvent.sentiment}
                  </StatusBadge>
                </div>
                <h3 className="text-base font-semibold leading-snug">{latestImportantEvent.title}</h3>
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {latestImportantEvent.summary}
                </p>
                <NewsEventDrawer
                  title={latestImportantEvent.title}
                  description={`${latestImportantEvent.source} · ${new Date(latestImportantEvent.publishedAt).toLocaleDateString("en-US")}`}
                  trigger={
                    <button className="text-sm font-medium text-primary hover:underline">
                      Open event detail
                    </button>
                  }
                >
                  <div className="space-y-4 text-sm">
                    <p className="leading-6 text-muted-foreground">{latestImportantEvent.summary}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <MetricTile label="Event type" value={latestImportantEvent.eventType.replaceAll("_", " ")} />
                      <MetricTile label="Risk impact" value={latestImportantEvent.riskImpact} tone={latestImportantEvent.riskImpact === "negative" ? "bad" : latestImportantEvent.riskImpact === "positive" ? "good" : "neutral"} />
                      <MetricTile label="Relevance" value={`${latestImportantEvent.relevanceScore}/100`} tone="info" />
                      <MetricTile label="Confidence" value={`${latestImportantEvent.confidenceScore}/100`} tone="accent" />
                    </div>
                  </div>
                </NewsEventDrawer>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No recent news event is available for this company.</p>
            )}
          </PremiumCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <PremiumCard className="p-5">
            <p className="mb-3 text-sm font-semibold">Top strengths</p>
            <SignalList
              items={analyst.positiveSignals.slice(0, 3).map((item) => ({
                title: item,
                tone: "good",
              }))}
            />
          </PremiumCard>

          <PremiumCard className="p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">Top risks</p>
              <DetailDrawer
                title="Risk driver detail"
                description="Full current risk list from the deterministic mock model."
                trigger={<button className="text-xs font-medium text-primary hover:underline">View all</button>}
              >
                <SignalList
                  items={analyst.keyRisks.map((item) => ({
                    title: item,
                    tone: "bad",
                  }))}
                />
              </DetailDrawer>
            </div>
            <SignalList
              items={analyst.keyRisks.slice(0, 3).map((item) => ({
                title: item,
                tone: "bad",
              }))}
            />
          </PremiumCard>

          <PremiumCard className="p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">Recommended next actions</p>
              <DetailDrawer
                title="Recommended next actions"
                description="Review actions attached to current financial, risk, market, and news signals."
                trigger={<button className="text-xs font-medium text-primary hover:underline">Open</button>}
              >
                <div className="space-y-3">
                  {analyst.recommendedActions.map((item, index) => (
                    <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <p className="text-xs font-semibold text-muted-foreground">Action {index + 1}</p>
                      <p className="mt-1 text-sm leading-6">{item}</p>
                    </div>
                  ))}
                </div>
              </DetailDrawer>
            </div>
            <SignalList
              items={analyst.recommendedActions.slice(0, 3).map((item) => ({
                title: item,
                tone: "neutral",
              }))}
            />
          </PremiumCard>
        </div>
      </Tabs.Content>

      {/* ── Financials Tab ──────────────────────────────────────────── */}
      <Tabs.Content value="financials" className="outline-none">
        <FinancialsTab company={company} />
      </Tabs.Content>

      {/* ── Risk Analysis Tab ──────────────────────────────────────── */}
      <Tabs.Content value="risk" className="outline-none">
        <RiskAnalysisTab company={company} />
      </Tabs.Content>

      {/* ── Market Tab ─────────────────────────────────────────────── */}
      <Tabs.Content value="market" className="space-y-4 outline-none">
        <ResponsiveGrid min="minmax(220px,1fr)">
          <MetricTile label="Momentum Score" value={`${marketMomentumScore}/100`} detail={marketData?.marketMomentum.label ?? "Mock market context"} tone="info" />
          <MetricTile label="Latest Price" value={marketData ? `$${marketData.metrics.latestPrice.toFixed(2)}` : "N/A"} detail={marketData ? `${marketData.ticker} mock quote` : "No market fixture"} tone="good" />
          <MetricTile label="1Y Move" value={marketData ? `${marketData.metrics.performance.oneYear >= 0 ? "+" : ""}${marketData.metrics.performance.oneYear.toFixed(1)}%` : "N/A"} detail="Mock price performance" tone="accent" />
        </ResponsiveGrid>
        {marketData ? (
          <MarketIntelligenceCard data={marketData} />
        ) : (
          <PremiumCard className="p-6 text-sm text-muted-foreground">No mock market data is available for this ticker.</PremiumCard>
        )}
      </Tabs.Content>

      {/* ── News Tab ──────────────────────────────────────────────── */}
      <Tabs.Content value="news" className="space-y-4 outline-none">
        <ResponsiveGrid min="minmax(220px,1fr)">
          <MetricTile label="Sentiment Score" value={`${newsSentimentScore}/100`} detail={newsData?.sentiment.label ?? "Mock sentiment"} tone="watch" />
          <MetricTile label="Events" value={String(newsData?.items.length ?? 0)} detail="Classified mock news records" tone="info" />
          <MetricTile label="High Severity" value={String(newsData?.items.filter((item) => item.severity === "high" || item.severity === "critical").length ?? 0)} detail="Events needing review" tone="bad" />
        </ResponsiveGrid>
        {newsData ? (
          <NewsIntelligenceCard data={newsData} />
        ) : (
          <PremiumCard className="p-6 text-sm text-muted-foreground">No mock news data is available for this ticker.</PremiumCard>
        )}
      </Tabs.Content>

      {/* ── Fraud Signals Tab ─────────────────────────────────────── */}
      <Tabs.Content value="fraud" className="outline-none">
        <FraudSignalsTab company={company} />
      </Tabs.Content>

      {/* ── AI Analyst Tab ────────────────────────────────────────── */}
      <Tabs.Content value="analyst" className="space-y-4 outline-none">
        <InvestmentHealthPanel
          financialHealthScore={financialHealthScore}
          riskScore={riskScore}
          marketMomentumScore={marketMomentumScore}
          newsSentimentScore={newsSentimentScore}
          investmentHealth={investmentHealth}
        />
        <CommandPanel
          title="Structured AI analyst memo"
          description={analyst.executiveSummary}
          icon={Activity}
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <StatusBadge tone="accent">Mock AI output</StatusBadge>
            <StatusBadge tone="neutral">Explains model/rule outputs</StatusBadge>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <CommandPanel title="Financial signals" description={analyst.executiveSummary} icon={TrendingUp} />
            <CommandPanel title="Risk signals" description={analyst.keyRisks.join(" ")} icon={ShieldAlert} />
            <CommandPanel title="Recommended next steps" description={analyst.recommendedActions.join(" ")} icon={Target} />
          </div>
        </CommandPanel>
        <SignalList
          items={[
            { title: "AI does not calculate the score", detail: "Numerical scores come from deterministic mock model and rule outputs." },
            { title: "Market and news are context", detail: "They help explain the company profile but do not override financial model signals." },
            { title: "Use reports for memo framing", detail: "Generate a mock report preview after reviewing tabs and scenarios." },
          ]}
        />
        <PremiumCard className="p-4 text-xs leading-6 text-muted-foreground">
          {analyst.professionalDisclaimer}
        </PremiumCard>
        <ExpandableSection
          title="Model basis and methodology"
          description="Collapsed by default to keep the analyst tab focused."
        >
          <div className="grid gap-2">
            {analyst.modelBasis.map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-white/[0.025] p-3 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </ExpandableSection>
      </Tabs.Content>

      {/* ── Reports Tab ───────────────────────────────────────────── */}
      <Tabs.Content value="reports" className="space-y-4 outline-none">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <CommandPanel
            title="Company report workflow"
            description="Turn this company review into a mock analyst memo after checking the summary, financials, risk, market, and news tabs."
            icon={Target}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricTile label="Company" value={company.ticker} detail={company.name} tone="accent" />
              <MetricTile label="Risk" value={`${riskScore}/100`} detail={riskLabel} tone={riskScore >= 70 ? "bad" : riskScore >= 50 ? "watch" : "good"} />
              <MetricTile label="Investment" value={`${investmentHealth.score}/100`} detail={investmentHealth.label} tone="info" />
              <MetricTile label="News" value={`${newsSentimentScore}/100`} detail="Sentiment context" tone="watch" />
            </div>
          </CommandPanel>

          <PremiumCard className="p-5">
            <p className="text-sm font-semibold">Available report previews</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Previews are mock on-screen deliverables only. Exports remain intentionally non-persistent.
            </p>
            <div className="mt-4 space-y-2">
              {["Company Snapshot", "Risk Assessment Memo", "News & Market Intelligence"].map((reportTitle) => (
                <ReportPreviewDrawer
                  key={reportTitle}
                  title={reportTitle}
                  description={`${company.name} · mock report preview`}
                  trigger={
                    <button className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-left text-sm transition hover:border-primary/30">
                      <span>{reportTitle}</span>
                      <span className="text-xs text-primary">Preview</span>
                    </button>
                  }
                >
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Executive summary</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{analyst.executiveSummary}</p>
                    </div>
                    <SignalList
                      items={[
                        ...analyst.keyRisks.slice(0, 2).map((item) => ({ title: item, tone: "bad" as const })),
                        ...analyst.positiveSignals.slice(0, 2).map((item) => ({ title: item, tone: "good" as const })),
                      ]}
                    />
                    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs leading-5 text-amber-200">
                      Mock report preview only. No PDF/DOCX export or persisted report artifact is created here.
                    </div>
                  </div>
                </ReportPreviewDrawer>
              ))}
            </div>
          </PremiumCard>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
