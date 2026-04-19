"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Target,
  Lightbulb,
  ShieldAlert,
  Activity,
  DollarSign,
  BarChart3,
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { formatMetric } from "@/lib/utils/risk";
import type {
  Company,
  FinancialPeriod,
  FinancialMetrics,
  FraudSignal,
  Recommendation,
  TimelineEvent,
  BenchmarkMetric,
} from "@/types";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric-card";
import { TrendChart } from "@/components/charts/trend-chart";
import { RiskDriversChart } from "@/components/charts/risk-drivers-chart";
import { BenchmarkChart } from "@/components/charts/benchmark-chart";

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

function TimelineItem({ event }: { event: TimelineEvent }) {
  const impactConfig = {
    positive: {
      dot: "bg-emerald-500",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/5",
      text: "text-emerald-600 dark:text-emerald-400",
      icon: TrendingUp,
    },
    negative: {
      dot: "bg-red-500",
      border: "border-red-500/30",
      bg: "bg-red-500/5",
      text: "text-red-600 dark:text-red-400",
      icon: TrendingDown,
    },
    neutral: {
      dot: "bg-muted-foreground/50",
      border: "border-border",
      bg: "bg-muted/30",
      text: "text-muted-foreground",
      icon: Minus,
    },
  };

  const config = impactConfig[event.impact];
  const Icon = config.icon;

  return (
    <div className="flex gap-4 group">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
            config.border,
            config.bg
          )}
        >
          <Icon className={cn("h-3.5 w-3.5", config.text)} />
        </div>
        <div className="w-px flex-1 bg-border/60 mt-2 mb-1 group-last:hidden" />
      </div>

      {/* Content */}
      <div className="pb-6 min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2 mb-1">
          <span className="text-sm font-semibold text-foreground">{event.title}</span>
          <span className="text-xs text-muted-foreground">{event.date}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {event.description}
        </p>
      </div>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const priorityConfig = {
    high: {
      badge: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
      border: "border-l-red-500",
    },
    medium: {
      badge: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
      border: "border-l-amber-500",
    },
    low: {
      badge: "bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400",
      border: "border-l-sky-500",
    },
  };
  const pc = priorityConfig[rec.priority];

  return (
    <Card className={cn("border-l-4", pc.border)}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="text-sm font-semibold text-foreground leading-snug">
            {rec.title}
          </h4>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shrink-0",
              pc.badge
            )}
          >
            {rec.priority}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {rec.description}
        </p>
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
          <Target className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
          <span>
            <span className="font-medium text-foreground">Expected impact: </span>
            {rec.expectedImpact}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

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
  metrics,
}: CompanyTabsProps) {
  const m = latestPeriod.metrics;

  const tabTriggerClass = cn(
    "relative px-4 py-2.5 text-sm font-medium text-muted-foreground",
    "transition-colors rounded-lg",
    "hover:text-foreground hover:bg-muted/60",
    "data-[state=active]:text-foreground data-[state=active]:bg-background",
    "data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-border/60",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring"
  );

  return (
    <Tabs.Root defaultValue="overview" className="space-y-6">
      <div className="overflow-x-auto">
        <Tabs.List className="inline-flex items-center gap-1 rounded-xl bg-muted/50 p-1 border border-border/50">
          <Tabs.Trigger value="overview" className={tabTriggerClass}>
            Overview
          </Tabs.Trigger>
          <Tabs.Trigger value="financials" className={tabTriggerClass}>
            Financials
          </Tabs.Trigger>
          <Tabs.Trigger value="risk" className={tabTriggerClass}>
            Risk Analysis
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
        </Tabs.List>
      </div>

      {/* ── Overview Tab ──────────────────────────────────────────── */}
      <Tabs.Content value="overview" className="space-y-6 outline-none">
        {/* AI Executive Summary */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle>AI Executive Summary</CardTitle>
                <CardDescription>
                  Generated by FinSight AI · {company.lastUpdated}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground leading-relaxed">
              {company.aiSummary}
            </p>
          </CardContent>
        </Card>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <MetricCard
            title="Current Ratio"
            value={formatMetric(m.currentRatio, "ratio")}
            status={metrics.currentRatio.status}
            tooltip="Ability to meet short-term obligations (>1.5 = healthy)"
            trend={
              prevPeriod
                ? m.currentRatio > prevPeriod.metrics.currentRatio
                  ? "up"
                  : m.currentRatio < prevPeriod.metrics.currentRatio
                  ? "down"
                  : "neutral"
                : undefined
            }
            trendValue={
              prevPeriod
                ? Math.abs(m.currentRatio - prevPeriod.metrics.currentRatio).toFixed(2)
                : undefined
            }
            trendLabel="vs prior year"
          />
          <MetricCard
            title="Debt / Equity"
            value={formatMetric(m.debtToEquity, "ratio")}
            status={metrics.debtToEquity.status}
            tooltip="Total debt relative to equity (<1.0 = conservative)"
            trend={
              prevPeriod
                ? m.debtToEquity < prevPeriod.metrics.debtToEquity
                  ? "up"
                  : m.debtToEquity > prevPeriod.metrics.debtToEquity
                  ? "down"
                  : "neutral"
                : undefined
            }
            trendValue={
              prevPeriod
                ? Math.abs(m.debtToEquity - prevPeriod.metrics.debtToEquity).toFixed(2)
                : undefined
            }
            trendLabel="vs prior year"
          />
          <MetricCard
            title="Net Margin"
            value={formatMetric(m.netMargin, "percent")}
            status={metrics.netMargin.status}
            tooltip="Net income as % of revenue (>5% = healthy)"
            trend={
              prevPeriod
                ? m.netMargin > prevPeriod.metrics.netMargin
                  ? "up"
                  : m.netMargin < prevPeriod.metrics.netMargin
                  ? "down"
                  : "neutral"
                : undefined
            }
            trendValue={
              prevPeriod
                ? Math.abs((m.netMargin - prevPeriod.metrics.netMargin) * 100).toFixed(1) + "pp"
                : undefined
            }
            trendLabel="vs prior year"
          />
          <MetricCard
            title="Interest Coverage"
            value={formatMetric(m.interestCoverage, "ratio")}
            status={metrics.interestCoverage.status}
            tooltip="Operating income / interest expense (>3x = healthy)"
            trend={
              prevPeriod
                ? m.interestCoverage > prevPeriod.metrics.interestCoverage
                  ? "up"
                  : m.interestCoverage < prevPeriod.metrics.interestCoverage
                  ? "down"
                  : "neutral"
                : undefined
            }
            trendValue={
              prevPeriod
                ? Math.abs(m.interestCoverage - prevPeriod.metrics.interestCoverage).toFixed(2)
                : undefined
            }
            trendLabel="vs prior year"
          />
          <MetricCard
            title="Return on Assets"
            value={formatMetric(m.roa, "percent")}
            status={metrics.roa.status}
            tooltip="Net income / total assets (>5% = strong)"
            trend={
              prevPeriod
                ? m.roa > prevPeriod.metrics.roa
                  ? "up"
                  : m.roa < prevPeriod.metrics.roa
                  ? "down"
                  : "neutral"
                : undefined
            }
            trendValue={
              prevPeriod
                ? Math.abs((m.roa - prevPeriod.metrics.roa) * 100).toFixed(1) + "pp"
                : undefined
            }
            trendLabel="vs prior year"
          />
          <MetricCard
            title="Revenue Growth"
            value={
              m.revenueGrowth != null
                ? formatMetric(m.revenueGrowth, "percent")
                : "N/A"
            }
            status={metrics.revenueGrowth.status}
            tooltip="Year-over-year revenue growth rate"
            trend={metrics.revenueGrowth.trend}
            trendValue={
              m.revenueGrowth != null
                ? `$${(latestPeriod.revenue / 1000).toFixed(1)}B revenue`
                : undefined
            }
          />
        </div>

        {/* Revenue trend chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Earnings Trend</CardTitle>
            <CardDescription>
              Revenue, net income, and EBITDA across fiscal periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart periods={company.periods} />
          </CardContent>
        </Card>

        {/* Timeline + Recommendations: 2-col on large */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Risk Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Risk Timeline</CardTitle>
              </div>
              <CardDescription>
                Key events and financial developments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {company.timeline.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No timeline events recorded.
                </p>
              ) : (
                <div className="pt-1">
                  {company.timeline.map((event) => (
                    <TimelineItem key={event.id} event={event} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-base font-semibold text-foreground">
                Recommendations
              </h3>
            </div>
            {company.recommendations.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  No recommendations at this time.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {company.recommendations.map((rec) => (
                  <RecommendationCard key={rec.id} rec={rec} />
                ))}
              </div>
            )}
          </div>
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

      {/* ── Fraud Signals Tab ─────────────────────────────────────── */}
      <Tabs.Content value="fraud" className="outline-none">
        <FraudSignalsTab company={company} />
      </Tabs.Content>
    </Tabs.Root>
  );
}
