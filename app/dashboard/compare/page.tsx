"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Building2,
} from "lucide-react";
import { mockCompanies } from "@/lib/mock";
import { formatMetric } from "@/lib/utils/risk";
import { cn } from "@/lib/utils";
import type { Company } from "@/types";
import { RiskScoreGauge } from "@/components/ui/risk-score-gauge";
import { RiskBadge, FraudBadge } from "@/components/ui/risk-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_A = "apex-technologies";
const DEFAULT_B = "redstone-retail";

interface ComparisonMetric {
  key: string;
  label: string;
  format: "ratio" | "percent" | "multiple";
  higherIsBetter: boolean;
  description: string;
  radarLabel: string;
}

const COMPARISON_METRICS: ComparisonMetric[] = [
  {
    key: "currentRatio",
    label: "Current Ratio",
    format: "ratio",
    higherIsBetter: true,
    description: "Ability to cover short-term obligations",
    radarLabel: "Liquidity",
  },
  {
    key: "quickRatio",
    label: "Quick Ratio",
    format: "ratio",
    higherIsBetter: true,
    description: "Liquid assets vs current liabilities",
    radarLabel: "Quick Ratio",
  },
  {
    key: "debtToEquity",
    label: "Debt / Equity",
    format: "ratio",
    higherIsBetter: false,
    description: "Financial leverage level",
    radarLabel: "Low Leverage",
  },
  {
    key: "interestCoverage",
    label: "Interest Coverage",
    format: "ratio",
    higherIsBetter: true,
    description: "Ability to service interest payments",
    radarLabel: "Debt Service",
  },
  {
    key: "grossMargin",
    label: "Gross Margin",
    format: "percent",
    higherIsBetter: true,
    description: "Profitability after direct costs",
    radarLabel: "Gross Margin",
  },
  {
    key: "netMargin",
    label: "Net Margin",
    format: "percent",
    higherIsBetter: true,
    description: "Bottom-line profitability",
    radarLabel: "Net Margin",
  },
  {
    key: "roa",
    label: "Return on Assets",
    format: "percent",
    higherIsBetter: true,
    description: "Asset utilization efficiency",
    radarLabel: "ROA",
  },
  {
    key: "roe",
    label: "Return on Equity",
    format: "percent",
    higherIsBetter: true,
    description: "Shareholder return generation",
    radarLabel: "ROE",
  },
  {
    key: "altmanZScore",
    label: "Altman Z-Score",
    format: "multiple",
    higherIsBetter: true,
    description: "Bankruptcy prediction (>2.99 safe)",
    radarLabel: "Z-Score",
  },
  {
    key: "revenueGrowth",
    label: "Revenue Growth",
    format: "percent",
    higherIsBetter: true,
    description: "Year-over-year top-line growth",
    radarLabel: "Growth",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMetricValue(company: Company, key: string): number | null {
  const latest = company.periods[company.periods.length - 1];
  const val = latest.metrics[key as keyof typeof latest.metrics];
  return typeof val === "number" ? val : null;
}

function formatValue(value: number | null, format: ComparisonMetric["format"]): string {
  if (value == null) return "N/A";
  if (format === "ratio") return formatMetric(value, "ratio");
  if (format === "percent") return formatMetric(value, "percent");
  return formatMetric(value, "multiple");
}

function getCellWinner(
  valA: number | null,
  valB: number | null,
  higherIsBetter: boolean
): "A" | "B" | "tie" | "none" {
  if (valA == null || valB == null) return "none";
  if (valA === valB) return "tie";
  if (higherIsBetter) return valA > valB ? "A" : "B";
  return valA < valB ? "A" : "B";
}

// Normalize a metric value to 0–100 scale for radar chart
function normalizeForRadar(
  value: number | null,
  allValues: (number | null)[],
  higherIsBetter: boolean
): number {
  const nums = allValues.filter((v): v is number => v != null);
  if (nums.length === 0 || value == null) return 0;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  if (max === min) return 50;
  const ratio = (value - min) / (max - min);
  return Math.round(higherIsBetter ? ratio * 100 : (1 - ratio) * 100);
}

// ─── Company Selector ─────────────────────────────────────────────────────────

interface CompanySelectorProps {
  value: string;
  onChange: (id: string) => void;
  label: string;
  exclude?: string;
}

function CompanySelector({ value, onChange, label, exclude }: CompanySelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = mockCompanies.find((c) => c.id === value);

  return (
    <div className="relative">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        {label}
      </p>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3",
          "text-sm font-medium text-foreground transition-all",
          "hover:border-primary/50 hover:bg-muted/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          open && "border-primary/60 ring-1 ring-primary/20"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 min-w-0">
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
          {selected ? (
            <span className="truncate">{selected.name}</span>
          ) : (
            <span className="text-muted-foreground">Select company…</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 w-full rounded-xl border border-border bg-popover shadow-xl py-1 overflow-hidden">
          {mockCompanies
            .filter((c) => c.id !== exclude)
            .map((company) => (
              <button
                key={company.id}
                onClick={() => {
                  onChange(company.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors",
                  "hover:bg-muted/60",
                  company.id === value && "bg-primary/10 text-primary"
                )}
              >
                <span className="flex-1 min-w-0">
                  <span className="block font-medium truncate">{company.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {company.ticker} · {company.sector}
                  </span>
                </span>
                <span
                  className={cn(
                    "text-xs font-bold tabular-nums",
                    company.riskScore <= 25
                      ? "text-emerald-500"
                      : company.riskScore <= 50
                      ? "text-amber-500"
                      : company.riskScore <= 75
                      ? "text-orange-500"
                      : "text-red-500"
                  )}
                >
                  {company.riskScore}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

// ─── Radar Tooltip ────────────────────────────────────────────────────────────

interface RadarTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function RadarCustomTooltip({ active, payload, label }: RadarTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-popover/95 backdrop-blur-sm px-4 py-3 shadow-xl text-sm">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span
            className="inline-block h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground text-xs">{entry.name}:</span>
          <span className="font-medium text-foreground text-xs">
            {entry.value}/100
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Key Differences ─────────────────────────────────────────────────────────

function KeyDifferences({
  companyA,
  companyB,
}: {
  companyA: Company;
  companyB: Company;
}) {
  const differences = useMemo(() => {
    return COMPARISON_METRICS.map((m) => {
      const vA = getMetricValue(companyA, m.key);
      const vB = getMetricValue(companyB, m.key);
      if (vA == null || vB == null) return null;

      // Compute normalized gap
      const nA = normalizeForRadar(vA, [vA, vB], m.higherIsBetter);
      const nB = normalizeForRadar(vB, [vA, vB], m.higherIsBetter);
      const gap = Math.abs(nA - nB);
      const winner = nA > nB ? "A" : "B";

      return { metric: m, vA, vB, gap, winner, nA, nB };
    })
      .filter((d): d is NonNullable<typeof d> => d != null && d.gap > 10)
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 5);
  }, [companyA, companyB]);

  if (differences.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        The two companies are closely matched across all metrics.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {differences.map(({ metric, vA, vB, gap, winner }) => {
        const winnerCompany = winner === "A" ? companyA : companyB;
        const loserCompany = winner === "A" ? companyB : companyA;
        const winnerVal = winner === "A" ? vA : vB;
        const loserVal = winner === "A" ? vB : vA;

        return (
          <div
            key={metric.key}
            className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-foreground">
                  {metric.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {metric.description}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {winnerCompany.ticker}: {formatValue(winnerVal, metric.format)}
                </span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {loserCompany.ticker}: {formatValue(loserVal, metric.format)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, gap)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">
                {gap.toFixed(0)}pt
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ComparePage() {
  const [idA, setIdA] = useState(DEFAULT_A);
  const [idB, setIdB] = useState(DEFAULT_B);

  const companyA = mockCompanies.find((c) => c.id === idA)!;
  const companyB = mockCompanies.find((c) => c.id === idB)!;

  // Build radar data
  const radarData = useMemo(() => {
    return COMPARISON_METRICS.map((m) => {
      const vA = getMetricValue(companyA, m.key);
      const vB = getMetricValue(companyB, m.key);
      const nA = normalizeForRadar(vA, [vA, vB], m.higherIsBetter);
      const nB = normalizeForRadar(vB, [vA, vB], m.higherIsBetter);
      return {
        metric: m.radarLabel,
        [companyA.ticker]: nA,
        [companyB.ticker]: nB,
      };
    });
  }, [companyA, companyB]);

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="border-b bg-card/60 backdrop-blur-sm">
        <div className="px-6 py-5">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Company Comparison
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Side-by-side financial and risk analysis. Select any two companies
            from the portfolio to compare metrics, scores, and risk profiles.
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* ── Selectors ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl">
          <CompanySelector
            value={idA}
            onChange={setIdA}
            label="Company A"
            exclude={idB}
          />
          <CompanySelector
            value={idB}
            onChange={setIdB}
            label="Company B"
            exclude={idA}
          />
        </div>

        {/* ── Company Headers ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[companyA, companyB].map((company, idx) => (
            <Card
              key={company.id}
              className={cn(
                "border-2 transition-all",
                idx === 0 ? "border-indigo-500/25" : "border-violet-500/25"
              )}
            >
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start gap-4">
                  <RiskScoreGauge score={company.riskScore} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-base font-bold text-foreground leading-tight">
                        {company.name}
                      </h2>
                      <Badge variant="outline" className="font-mono text-xs">
                        {company.ticker}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {company.sector} · {company.industry}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <RiskBadge tier={company.riskTier} size="sm" />
                      <FraudBadge risk={company.fraudRisk} size="sm" />
                    </div>
                    <div className="mt-3">
                      <Link
                        href={`/dashboard/company/${company.id}`}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                      >
                        View full profile
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Comparison Table ───────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle>Metric Comparison</CardTitle>
            <CardDescription>
              Latest period financials — green cell indicates superior value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left py-3 pr-6 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Metric
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide">
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {companyA.ticker}
                      </span>
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide">
                      <span className="text-violet-600 dark:text-violet-400">
                        {companyB.ticker}
                      </span>
                    </th>
                    <th className="text-center py-3 pl-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Edge
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {COMPARISON_METRICS.map((metric) => {
                    const vA = getMetricValue(companyA, metric.key);
                    const vB = getMetricValue(companyB, metric.key);
                    const winner = getCellWinner(vA, vB, metric.higherIsBetter);

                    const cellA = cn(
                      "py-3 px-4 text-right tabular-nums font-semibold transition-colors rounded-lg",
                      winner === "A"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : winner === "B"
                        ? "text-muted-foreground/70"
                        : "text-foreground"
                    );

                    const cellB = cn(
                      "py-3 px-4 text-right tabular-nums font-semibold transition-colors rounded-lg",
                      winner === "B"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : winner === "A"
                        ? "text-muted-foreground/70"
                        : "text-foreground"
                    );

                    return (
                      <tr
                        key={metric.key}
                        className="hover:bg-muted/20 transition-colors group"
                      >
                        <td className="py-3 pr-6">
                          <div className="font-medium text-foreground">
                            {metric.label}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {metric.description}
                          </div>
                        </td>
                        <td className={cellA}>
                          <div className="flex items-center justify-end gap-1.5">
                            {winner === "A" && (
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            )}
                            {formatValue(vA, metric.format)}
                          </div>
                        </td>
                        <td className={cellB}>
                          <div className="flex items-center justify-end gap-1.5">
                            {winner === "B" && (
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            )}
                            {formatValue(vB, metric.format)}
                          </div>
                        </td>
                        <td className="py-3 pl-4 text-center">
                          {winner === "A" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                              {companyA.ticker}
                            </span>
                          ) : winner === "B" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-600 dark:text-violet-400">
                              {companyB.ticker}
                            </span>
                          ) : winner === "tie" ? (
                            <span className="text-[11px] text-muted-foreground">Tie</span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Win count summary */}
            {(() => {
              const results = COMPARISON_METRICS.map((m) =>
                getCellWinner(
                  getMetricValue(companyA, m.key),
                  getMetricValue(companyB, m.key),
                  m.higherIsBetter
                )
              );
              const winsA = results.filter((r) => r === "A").length;
              const winsB = results.filter((r) => r === "B").length;

              return (
                <div className="mt-4 flex flex-wrap items-center gap-3 pt-4 border-t border-border/40">
                  <span className="text-xs text-muted-foreground">Metric wins:</span>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {companyA.ticker}: {winsA}
                  </span>
                  <span className="text-xs text-muted-foreground">vs</span>
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                    {companyB.ticker}: {winsB}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {Math.max(winsA, winsB) > Math.min(winsA, winsB)
                      ? `${winsA > winsB ? companyA.name : companyB.name} leads on ${Math.max(winsA, winsB)} of ${COMPARISON_METRICS.length} metrics`
                      : "Evenly matched"}
                  </span>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* ── Radar Chart + Key Differences: 2-col ───────────────────── */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Normalized Performance Radar</CardTitle>
              <CardDescription>
                Each axis is normalized 0–100 relative to the pair — higher is
                always better
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={360}>
                <RadarChart
                  data={radarData}
                  margin={{ top: 16, right: 24, bottom: 16, left: 24 }}
                >
                  <PolarGrid
                    stroke="currentColor"
                    strokeOpacity={0.12}
                    gridType="polygon"
                  />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{
                      fontSize: 11,
                      fill: "currentColor",
                      opacity: 0.65,
                    }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 9, fill: "currentColor", opacity: 0.4 }}
                    tickCount={4}
                  />
                  <Radar
                    name={companyA.ticker}
                    dataKey={companyA.ticker}
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.18}
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
                  />
                  <Radar
                    name={companyB.ticker}
                    dataKey={companyB.ticker}
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.18}
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#8b5cf6", strokeWidth: 0 }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                  <Tooltip content={<RadarCustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Key Differences */}
          <Card>
            <CardHeader>
              <CardTitle>Key Differences</CardTitle>
              <CardDescription>
                Largest performance gaps between the two companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KeyDifferences companyA={companyA} companyB={companyB} />
            </CardContent>
          </Card>
        </div>

        {/* ── Risk Score Comparison ───────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Score Overview</CardTitle>
            <CardDescription>
              Overall risk scores, fraud flags, and period risk trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[companyA, companyB].map((company, idx) => {
                const color = idx === 0 ? "#6366f1" : "#8b5cf6";
                return (
                  <div key={company.id} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-semibold text-sm text-foreground">
                        {company.name}
                      </span>
                      <Badge variant="outline" className="font-mono text-xs ml-auto">
                        {company.ticker}
                      </Badge>
                    </div>

                    {/* Period risk scores */}
                    <div className="space-y-2">
                      {company.periods.map((period) => {
                        const pctWidth = Math.min(100, period.riskScore);
                        const barColor =
                          period.riskScore <= 25
                            ? "bg-emerald-500"
                            : period.riskScore <= 50
                            ? "bg-amber-500"
                            : period.riskScore <= 75
                            ? "bg-orange-500"
                            : "bg-red-500";

                        return (
                          <div
                            key={period.period}
                            className="flex items-center gap-3"
                          >
                            <span className="text-xs text-muted-foreground w-16 shrink-0">
                              {period.period}
                            </span>
                            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                              <div
                                className={cn("h-full rounded-full", barColor)}
                                style={{ width: `${pctWidth}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold tabular-nums w-8 text-right text-foreground">
                              {period.riskScore}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Alerts summary */}
                    {company.alerts.length > 0 && (
                      <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          <span className="text-xs font-semibold text-foreground">
                            {company.alerts.length} Active Alert
                            {company.alerts.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {company.alerts.slice(0, 3).map((alert) => (
                            <div
                              key={alert.id}
                              className="flex items-start gap-2"
                            >
                              <span
                                className={cn(
                                  "inline-block h-1.5 w-1.5 rounded-full mt-1.5 shrink-0",
                                  alert.severity === "critical"
                                    ? "bg-red-500"
                                    : alert.severity === "warning"
                                    ? "bg-amber-500"
                                    : "bg-sky-500"
                                )}
                              />
                              <span className="text-xs text-muted-foreground leading-relaxed">
                                {alert.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
