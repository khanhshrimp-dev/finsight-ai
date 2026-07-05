"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BrainCircuit,
  RefreshCw,
  Save,
  SlidersHorizontal,
  Sparkles,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { PremiumPanel } from "@/components/ui/premium-panel";
import {
  AnalystMemoCard,
  DemoDataNotice,
  MetricDeltaCard,
} from "@/components/ui/premium-dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiskScoreGauge } from "@/components/ui/risk-score-gauge";
import { mockCompanies } from "@/lib/mock";
import { companyIntelligence } from "@/lib/mock/company-intelligence";
import { calculateInvestmentHealthScore } from "@/lib/investment/investment-health";
import {
  analyzeRisk,
  calculateScenarioDelta,
  scenarioMetricLabels,
  type ScenarioMetricChange,
  type ScenarioMetricKey,
} from "@/lib/risk";
import { generateMockRiskAnalystResponse, profileFromCompany } from "@/lib/ai/risk-analyst";
import type { FinancialMetrics } from "@/types";
import { cn } from "@/lib/utils";

interface SavedScenario {
  id: string;
  name: string;
  companyName: string;
  baseScore: number;
  scenarioScore: number;
  delta: number;
  createdAt: string;
}

interface MetricControlConfig {
  key: ScenarioMetricKey;
  min: number;
  max: number;
  step: number;
  format: "ratio" | "percent";
}

const metricControls: MetricControlConfig[] = [
  { key: "currentRatio", min: 0.2, max: 5, step: 0.05, format: "ratio" },
  { key: "quickRatio", min: 0, max: 5, step: 0.05, format: "ratio" },
  { key: "debtToEquity", min: 0, max: 18, step: 0.05, format: "ratio" },
  { key: "interestCoverage", min: -2, max: 30, step: 0.1, format: "ratio" },
  { key: "grossMargin", min: -0.2, max: 1, step: 0.01, format: "percent" },
  { key: "netMargin", min: -0.5, max: 0.6, step: 0.01, format: "percent" },
  { key: "roa", min: -0.5, max: 0.5, step: 0.01, format: "percent" },
  { key: "roe", min: -2, max: 1.5, step: 0.01, format: "percent" },
  { key: "operatingCashFlowRatio", min: -0.5, max: 2, step: 0.05, format: "ratio" },
  { key: "revenueGrowth", min: -0.5, max: 1.2, step: 0.01, format: "percent" },
];

const metricControlGroups: Array<{ title: string; description: string; keys: ScenarioMetricKey[] }> = [
  {
    title: "Liquidity",
    description: "Stress short-term coverage and liquid asset cushion.",
    keys: ["currentRatio", "quickRatio"],
  },
  {
    title: "Leverage",
    description: "Change debt load and interest-service capacity.",
    keys: ["debtToEquity", "interestCoverage"],
  },
  {
    title: "Profitability",
    description: "Model margin, asset-return, and equity-return pressure.",
    keys: ["grossMargin", "netMargin", "roa", "roe"],
  },
  {
    title: "Cash flow",
    description: "Move operating cash generation relative to obligations.",
    keys: ["operatingCashFlowRatio"],
  },
  {
    title: "Growth",
    description: "Adjust revenue momentum without changing original data.",
    keys: ["revenueGrowth"],
  },
];

function latestMetrics(companyId: string): FinancialMetrics {
  const company = mockCompanies.find((item) => item.id === companyId) ?? mockCompanies[0];
  const latestPeriod = company.periods[company.periods.length - 1];

  return {
    ...latestPeriod.metrics,
    revenueGrowth: latestPeriod.metrics.revenueGrowth ?? 0,
  };
}

function formatValue(value: number, format: "ratio" | "percent") {
  return format === "percent" ? `${(value * 100).toFixed(1)}%` : `${value.toFixed(2)}x`;
}

function scoreDeltaClass(delta: number) {
  if (delta > 0) return "text-red-600 dark:text-red-400";
  if (delta < 0) return "text-emerald-600 dark:text-emerald-400";
  return "text-muted-foreground";
}

function ScoreDeltaIcon({ delta }: { delta: number }) {
  if (delta > 0) return <ArrowUp className="h-4 w-4" />;
  if (delta < 0) return <ArrowDown className="h-4 w-4" />;
  return <ArrowRight className="h-4 w-4" />;
}

function DriverImpactBar({ driver }: { driver: ScenarioMetricChange }) {
  const width = Math.min(100, Math.max(8, Math.abs(driver.riskImpact) * 7));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-medium text-foreground">{driver.label}</span>
        <span className={cn("font-mono", scoreDeltaClass(driver.riskImpact))}>
          {driver.riskImpact >= 0 ? "+" : ""}
          {driver.riskImpact} pts
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            driver.riskImpact > 0 ? "bg-red-500" : "bg-emerald-500"
          )}
          style={{ width: `${width}%` }}
        />
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        {formatValue(driver.before, driver.key === "grossMargin" || driver.key === "netMargin" || driver.key === "roa" || driver.key === "roe" || driver.key === "revenueGrowth" ? "percent" : "ratio")} to{" "}
        {formatValue(driver.after, driver.key === "grossMargin" || driver.key === "netMargin" || driver.key === "roa" || driver.key === "roe" || driver.key === "revenueGrowth" ? "percent" : "ratio")}
      </p>
    </div>
  );
}

export default function ScenarioSimulatorPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(mockCompanies[0].id);
  const [scenarioMetrics, setScenarioMetrics] = useState<FinancialMetrics>(() =>
    latestMetrics(mockCompanies[0].id)
  );
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);

  const selectedCompany =
    mockCompanies.find((company) => company.id === selectedCompanyId) ?? mockCompanies[0];
  const selectedIntelligence =
    companyIntelligence.find((item) => item.company.id === selectedCompanyId) ?? companyIntelligence[0];
  const baseMetrics = useMemo(() => latestMetrics(selectedCompanyId), [selectedCompanyId]);
  const result = useMemo(
    () => calculateScenarioDelta(baseMetrics, scenarioMetrics),
    [baseMetrics, scenarioMetrics]
  );
  const scenarioRisk = useMemo(() => analyzeRisk(scenarioMetrics), [scenarioMetrics]);
  const analyst = useMemo(
    () =>
      generateMockRiskAnalystResponse({
        companyProfile: profileFromCompany(selectedCompany),
        financialMetrics: scenarioMetrics,
        riskScore: scenarioRisk.riskScore,
        riskLabel: scenarioRisk.riskLabel,
        riskDrivers: scenarioRisk.drivers,
        fraudSignals: scenarioRisk.fraudSignals,
        benchmarkData: selectedCompany.benchmarkData,
        scenarioSummary: result.explanation,
      }),
    [result.explanation, scenarioMetrics, scenarioRisk, selectedCompany]
  );
  const baseFinancialHealth = Math.max(0, 100 - result.baseScore);
  const scenarioFinancialHealth = Math.max(0, 100 - result.scenarioScore);
  const scenarioInvestmentHealth = useMemo(
    () =>
      calculateInvestmentHealthScore({
        financialHealthScore: scenarioFinancialHealth,
        riskScore: result.scenarioScore,
        marketMomentumScore: selectedIntelligence.marketMomentumScore,
        newsSentimentScore: selectedIntelligence.newsSentimentScore,
        valuationScore: 50,
      }),
    [
      result.scenarioScore,
      scenarioFinancialHealth,
      selectedIntelligence.marketMomentumScore,
      selectedIntelligence.newsSentimentScore,
    ]
  );
  const investmentHealthDelta =
    scenarioInvestmentHealth.score - selectedIntelligence.investmentHealth.score;

  const updateMetric = (key: ScenarioMetricKey, value: number) => {
    setScenarioMetrics((current) => ({ ...current, [key]: value }));
  };

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setScenarioMetrics(latestMetrics(companyId));
  };

  const resetScenario = () => {
    setScenarioMetrics(baseMetrics);
  };

  const saveScenario = () => {
    setSavedScenarios((current) => [
      {
        id: `${selectedCompany.id}-${Date.now()}`,
        name: `${selectedCompany.ticker} scenario ${current.length + 1}`,
        companyName: selectedCompany.name,
        baseScore: result.baseScore,
        scenarioScore: result.scenarioScore,
        delta: result.delta,
        createdAt: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
      },
      ...current,
    ]);
  };

  return (
    <DashboardPageShell maxWidth="wide">
      <PageHeader
        eyebrow="What-if Analysis"
        title="Scenario Simulator"
        description="Adjust key ratios and compare deterministic risk, financial-health, and investment-health impact in real time."
        icon={SlidersHorizontal}
        actions={
          <>
          <Select value={selectedCompanyId} onValueChange={(value) => value && handleCompanyChange(value)}>
            <SelectTrigger className="w-full sm:w-64" aria-label="Select scenario company">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {mockCompanies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={resetScenario}>
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={saveScenario}>
            <Save className="h-4 w-4" />
            Save Scenario
          </Button>
          </>
        }
      />

      <DemoDataNotice
        icon={SlidersHorizontal}
        title="Stress-test assumptions without changing original company data"
        description="Scenario inputs live in local UI state only. The original mock company record is not edited, persisted, or sent to a real model service."
      />

      <div className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.55fr)]">
        <div className="space-y-6 xl:order-2">
          <PremiumPanel className="p-5">
            <div className="mb-5">
              <h2 className="text-base font-semibold">Before vs After</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Deterministic score based on liquidity, leverage, profitability, cash flow, and growth.
              </p>
            </div>
              <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
                <div className="text-center">
                  <RiskScoreGauge score={result.baseScore} size="lg" />
                  <p className="mt-2 text-sm font-medium">Original</p>
                  <Badge variant="outline" className="mt-1">
                    {result.baseLabel}
                  </Badge>
                </div>
                <div className={cn("flex items-center justify-center gap-2 font-semibold sm:flex-col sm:gap-1", scoreDeltaClass(result.delta))}>
                  <ScoreDeltaIcon delta={result.delta} />
                  <span className="font-mono text-sm">
                    {result.delta >= 0 ? "+" : ""}
                    {result.delta}
                  </span>
                </div>
                <div className="text-center">
                  <RiskScoreGauge score={result.scenarioScore} size="lg" />
                  <p className="mt-2 text-sm font-medium">Scenario</p>
                  <Badge variant="outline" className="mt-1">
                    {result.scenarioLabel}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { label: "Original", value: result.baseScore, color: "bg-muted-foreground" },
                  {
                    label: "Scenario",
                    value: result.scenarioScore,
                    color:
                      result.scenarioScore >= 75
                        ? "bg-red-500"
                        : result.scenarioScore >= 50
                        ? "bg-orange-500"
                        : result.scenarioScore >= 25
                        ? "bg-amber-500"
                        : "bg-emerald-500",
                  },
                ].map((item) => (
                  <div key={item.label} className="grid min-w-0 grid-cols-[72px_minmax(0,1fr)_34px] items-center gap-3 text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }} />
                    </div>
                    <span className="font-mono font-semibold tabular-nums">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <MetricDeltaCard
                  label="Financial Health"
                  value={`${scenarioFinancialHealth}/100`}
                  delta={`${scenarioFinancialHealth - baseFinancialHealth >= 0 ? "+" : ""}${scenarioFinancialHealth - baseFinancialHealth} pts`}
                  detail={`Original ${baseFinancialHealth}/100`}
                  tone={scenarioFinancialHealth - baseFinancialHealth >= 0 ? "good" : "bad"}
                />

                <MetricDeltaCard
                  label="Investment Health"
                  value={`${scenarioInvestmentHealth.score}/100`}
                  delta={`${investmentHealthDelta >= 0 ? "+" : ""}${investmentHealthDelta} pts`}
                  detail={`Original ${selectedIntelligence.investmentHealth.score}/100`}
                  tone={investmentHealthDelta >= 0 ? "good" : "bad"}
                />
              </div>
          </PremiumPanel>

          <Card>
            <CardHeader>
              <CardTitle>Most Sensitive Metric</CardTitle>
              <CardDescription>Single-ratio stress impact from the original company profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 rounded-lg border bg-muted/25 p-3">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{result.mostSensitiveMetric.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    A {result.mostSensitiveMetric.stressDirection} stress changes the score by{" "}
                    <span className={cn("font-mono font-semibold", scoreDeltaClass(result.mostSensitiveMetric.riskImpact))}>
                      {result.mostSensitiveMetric.riskImpact >= 0 ? "+" : ""}
                      {result.mostSensitiveMetric.riskImpact}
                    </span>{" "}
                    points in this deterministic model.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved Scenarios</CardTitle>
              <CardDescription>Local-only saved scenarios for the current session.</CardDescription>
            </CardHeader>
            <CardContent>
              {savedScenarios.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                  No saved scenarios yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {savedScenarios.map((scenario) => (
                    <div key={scenario.id} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{scenario.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {scenario.companyName} - {scenario.createdAt}
                          </p>
                        </div>
                        <span className={cn("font-mono text-sm font-semibold", scoreDeltaClass(scenario.delta))}>
                          {scenario.delta >= 0 ? "+" : ""}
                          {scenario.delta}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 xl:order-1">
          <PremiumPanel className="p-5">
            <div className="mb-5">
              <h2 className="text-base font-semibold">Financial assumptions</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Original values are shown beside editable scenario values. Changed assumptions are highlighted.
              </p>
            </div>
            <div className="space-y-5">
              {metricControlGroups.map((group) => (
                <section key={group.title} className="rounded-lg border border-border/70 bg-background/70 p-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold">{group.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{group.description}</p>
                  </div>
                  <div className="grid gap-4">
                    {group.keys.map((key) => {
                      const control = metricControls.find((item) => item.key === key);
                      if (!control) return null;
                      const baseValue = Number(baseMetrics[control.key] ?? 0);
                      const currentValue = Number(scenarioMetrics[control.key] ?? 0);
                      const changed = Math.abs(currentValue - baseValue) > 0.0001;

                      return (
                        <div
                          key={control.key}
                          className={cn(
                            "rounded-lg border p-3 transition-colors",
                            changed ? "border-primary/35 bg-primary/10" : "border-border/70 bg-card/80"
                          )}
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium">{scenarioMetricLabels[control.key]}</p>
                              <p className="text-[11px] text-muted-foreground">
                                Original: {formatValue(baseValue, control.format)}
                              </p>
                            </div>
                            <Input
                              type="number"
                              value={currentValue}
                              min={control.min}
                              max={control.max}
                              step={control.step}
                              onChange={(event) => updateMetric(control.key, Number(event.target.value))}
                              className="w-24 text-right font-mono"
                              aria-label={`${scenarioMetricLabels[control.key]} scenario value`}
                            />
                          </div>
                          <input
                            type="range"
                            min={control.min}
                            max={control.max}
                            step={control.step}
                            value={currentValue}
                            onChange={(event) => updateMetric(control.key, Number(event.target.value))}
                            className="w-full accent-primary"
                            aria-label={scenarioMetricLabels[control.key]}
                          />
                          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                            <span>{formatValue(control.min, control.format)}</span>
                            <span>{formatValue(control.max, control.format)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </PremiumPanel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Changed Drivers</CardTitle>
                <CardDescription>Isolated impact of the metrics changed in this scenario.</CardDescription>
              </CardHeader>
              <CardContent>
                {result.topDrivers.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                    Move a slider to see driver impact.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {result.topDrivers.slice(0, 5).map((driver) => (
                      <DriverImpactBar key={driver.key} driver={driver} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Generated from the scenario financial ratios.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.recommendations.map((recommendation) => (
                    <div key={recommendation} className="flex gap-2 rounded-lg bg-muted/35 p-3 text-sm">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="leading-relaxed">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <AnalystMemoCard
            icon={BrainCircuit}
            eyebrow="Scenario explanation"
            title="AI-style interpretation for review"
            summary={analyst.executiveSummary}
            bullets={[
              result.explanation,
              `Most sensitive metric: ${result.mostSensitiveMetric.label}`,
              `Scenario risk moved ${result.delta >= 0 ? "+" : ""}${result.delta} points from original.`,
            ]}
            disclaimer="Transparent deterministic scenario output only. No live model, LLM provider, or persisted company data change is used."
          />
        </div>
      </div>
    </DashboardPageShell>
  );
}
