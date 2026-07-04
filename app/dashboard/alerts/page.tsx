"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Bell,
  BellOff,
  XCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Plus,
  Trash2,
  RefreshCw,
  Activity,
  SlidersHorizontal,
  FlaskConical,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { allAlerts, mockCompanies } from "@/lib/mock";
import { computeMockRiskScore, getRiskTierFromScore, getRiskLabel } from "@/lib/utils/risk";
import { cn } from "@/lib/utils";
import type { Alert, WatchlistItem, Company, ScenarioInputs } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAlertDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getAlertTypeLabel(type: Alert["type"]): string {
  switch (type) {
    case "risk_increase":   return "Risk Increase";
    case "threshold_breach": return "Threshold Breach";
    case "fraud_signal":    return "Fraud Signal";
    case "liquidity":       return "Liquidity";
    case "debt":            return "Debt";
    case "leverage":        return "Leverage";
    case "financial_health_deteriorated": return "Financial Health";
    case "investment_health_drop": return "Investment Health";
    case "negative_news":   return "Negative News";
    case "price_drawdown":  return "Price Drawdown";
    case "volume_spike":    return "Volume Spike";
    case "general":         return "General";
  }
}

function getAlertTypeBadgeClass(type: Alert["type"]): string {
  switch (type) {
    case "risk_increase":    return "bg-orange-500/10 text-orange-600 border border-orange-500/20 dark:text-orange-400";
    case "threshold_breach": return "bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400";
    case "fraud_signal":     return "bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400";
    case "liquidity":        return "bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:text-blue-400";
    case "debt":             return "bg-purple-500/10 text-purple-600 border border-purple-500/20 dark:text-purple-400";
    case "leverage":         return "bg-purple-500/10 text-purple-600 border border-purple-500/20 dark:text-purple-400";
    case "financial_health_deteriorated": return "bg-orange-500/10 text-orange-600 border border-orange-500/20 dark:text-orange-400";
    case "investment_health_drop": return "bg-violet-500/10 text-violet-600 border border-violet-500/20 dark:text-violet-400";
    case "negative_news":    return "bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400";
    case "price_drawdown":   return "bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400";
    case "volume_spike":     return "bg-sky-500/10 text-sky-600 border border-sky-500/20 dark:text-sky-400";
    case "general":          return "bg-muted text-muted-foreground border border-border";
  }
}

function getRiskScoreColor(score: number): string {
  if (score <= 25) return "text-emerald-600 dark:text-emerald-400";
  if (score <= 50) return "text-amber-600 dark:text-amber-400";
  if (score <= 75) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function getRiskScoreBarColor(score: number): string {
  if (score <= 25) return "bg-emerald-500";
  if (score <= 50) return "bg-amber-500";
  if (score <= 75) return "bg-orange-500";
  return "bg-red-500";
}

// ─── Initial watchlist ────────────────────────────────────────────────────────

const INITIAL_WATCHLIST: WatchlistItem[] = [
  {
    companyId: "redstone-retail",
    addedAt: "2025-01-10",
    notes: "Monitor covenant breach and liquidity closely",
    alertThreshold: 80,
  },
  {
    companyId: "novara-biosciences",
    addedAt: "2025-01-22",
    notes: "Fraud signal investigation ongoing",
    alertThreshold: 65,
  },
  {
    companyId: "meridian-health",
    addedAt: "2025-02-01",
    notes: "Tracking margin compression trajectory",
    alertThreshold: 55,
  },
];

// ─── Default scenario inputs per company ─────────────────────────────────────

function getBaselineForCompany(company: Company): ScenarioInputs {
  const latest = company.periods[company.periods.length - 1];
  const m = latest.metrics;
  return {
    currentRatio: parseFloat(m.currentRatio.toFixed(2)),
    debtToEquity: parseFloat(Math.min(m.debtToEquity, 10).toFixed(2)),
    netMargin: parseFloat(m.netMargin.toFixed(4)),
    revenueGrowth: m.revenueGrowth !== null ? parseFloat(m.revenueGrowth.toFixed(4)) : 0,
    operatingCashFlowRatio: parseFloat(m.operatingCashFlowRatio.toFixed(4)),
    interestCoverage: parseFloat(Math.min(m.interestCoverage, 15).toFixed(2)),
  };
}

// ─── Slider component ─────────────────────────────────────────────────────────

interface ScenarioSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  onChange: (v: number) => void;
}

function ScenarioSlider({ label, value, min, max, step, displayValue, onChange }: ScenarioSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-foreground bg-muted px-2 py-0.5 rounded-md min-w-[60px] text-right">
          {displayValue}
        </span>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="relative w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-5"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary ring-2 ring-background shadow-sm pointer-events-none transition-all"
          style={{ left: `calc(${Math.max(0, Math.min(100, pct))}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

// ─── Tab pill nav ─────────────────────────────────────────────────────────────

type Tab = "alerts" | "watchlist" | "simulator";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("alerts");

  // ── Alerts state ──
  const [alerts, setAlerts] = useState<Alert[]>(() =>
    allAlerts.map((a) => ({ ...a }))
  );
  const [severityFilter, setSeverityFilter] = useState<"all" | Alert["severity"]>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | Alert["type"]>("all");
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all");

  const unreadCount = useMemo(() => alerts.filter((a) => !a.read).length, [alerts]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (severityFilter !== "all" && a.severity !== severityFilter) return false;
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (readFilter === "unread" && a.read) return false;
      if (readFilter === "read" && !a.read) return false;
      return true;
    });
  }, [alerts, severityFilter, typeFilter, readFilter]);

  const toggleRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: !a.read } : a)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }, []);

  // ── Watchlist state ──
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(INITIAL_WATCHLIST);
  const [watchlistSelectId, setWatchlistSelectId] = useState<string>("");

  const availableToAdd = useMemo(
    () => mockCompanies.filter((c) => !watchlist.some((w) => w.companyId === c.id)),
    [watchlist]
  );

  const addToWatchlist = useCallback(() => {
    if (!watchlistSelectId) return;
    const item: WatchlistItem = {
      companyId: watchlistSelectId,
      addedAt: new Date().toISOString().split("T")[0],
      notes: "",
      alertThreshold: 60,
    };
    setWatchlist((prev) => [...prev, item]);
    setWatchlistSelectId("");
  }, [watchlistSelectId]);

  const removeFromWatchlist = useCallback((companyId: string) => {
    setWatchlist((prev) => prev.filter((w) => w.companyId !== companyId));
  }, []);

  const updateWatchlistItem = useCallback(
    (companyId: string, updates: Partial<WatchlistItem>) => {
      setWatchlist((prev) =>
        prev.map((w) => (w.companyId === companyId ? { ...w, ...updates } : w))
      );
    },
    []
  );

  // ── Scenario simulator state ──
  const [scenarioCompanyId, setScenarioCompanyId] = useState<string>(mockCompanies[0].id);
  const [showCompare, setShowCompare] = useState(false);

  const scenarioCompany = useMemo(
    () => mockCompanies.find((c) => c.id === scenarioCompanyId) ?? mockCompanies[0],
    [scenarioCompanyId]
  );
  const baseline = useMemo(() => getBaselineForCompany(scenarioCompany), [scenarioCompany]);

  const [inputs, setInputs] = useState<ScenarioInputs>(() => getBaselineForCompany(mockCompanies[0]));

  const handleCompanyChange = useCallback(
    (id: string) => {
      setScenarioCompanyId(id);
      const company = mockCompanies.find((c) => c.id === id) ?? mockCompanies[0];
      setInputs(getBaselineForCompany(company));
    },
    []
  );

  const resetBaseline = useCallback(() => {
    setInputs(getBaselineForCompany(scenarioCompany));
  }, [scenarioCompany]);

  const simulatedScore = useMemo(() => computeMockRiskScore(inputs), [inputs]);
  const originalScore = useMemo(() => computeMockRiskScore(baseline), [baseline]);
  const simulatedTier = getRiskTierFromScore(simulatedScore);
  const simulatedLabel = getRiskLabel(simulatedTier);

  const tierColorClass: Record<string, string> = {
    healthy: "text-emerald-600 dark:text-emerald-400",
    medium: "text-amber-600 dark:text-amber-400",
    high: "text-orange-600 dark:text-orange-400",
    critical: "text-red-600 dark:text-red-400",
  };
  const tierBgClass: Record<string, string> = {
    healthy: "bg-emerald-500/10 border-emerald-500/20",
    medium: "bg-amber-500/10 border-amber-500/20",
    high: "bg-orange-500/10 border-orange-500/20",
    critical: "bg-red-500/10 border-red-500/20",
  };

  function setInput<K extends keyof ScenarioInputs>(key: K, value: ScenarioInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  const scoreDelta = simulatedScore - originalScore;
  const deltaLabel = scoreDelta === 0 ? "No change" : scoreDelta > 0 ? `+${scoreDelta} pts` : `${scoreDelta} pts`;
  const deltaColor = scoreDelta === 0
    ? "text-muted-foreground"
    : scoreDelta > 0
    ? "text-red-600 dark:text-red-400"
    : "text-emerald-600 dark:text-emerald-400";

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <DashboardPageShell>
      <PageHeader
        eyebrow="Operations"
        title="Alerts & Watchlist"
        description="Monitor risk events, track watched companies, and simulate financial scenarios with local mock data."
        icon={Bell}
        actions={unreadCount > 0 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-3 py-1 text-sm font-medium">
            <Bell className="h-3.5 w-3.5" />
            {unreadCount} unread
          </span>
        ) : null}
      />

      {/* ── Tab nav ── */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border pb-0 scrollbar-thin">
        {(
          [
            { id: "alerts" as Tab, label: "Alerts", icon: Bell },
            { id: "watchlist" as Tab, label: "Watchlist", icon: Activity },
            { id: "simulator" as Tab, label: "Scenario Simulator", icon: FlaskConical },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
            {id === "alerts" && unreadCount > 0 && (
              <span className="inline-flex items-center justify-center h-4 min-w-4 rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════ ALERTS TAB */}
      {activeTab === "alerts" && (
        <div className="space-y-4">
          {/* Filter bar */}
          <Card>
            <div className="px-4 py-3 flex flex-wrap items-center gap-3">
              {/* Severity */}
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as typeof severityFilter)}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30 cursor-pointer"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>

              {/* Type */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30 cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="risk_increase">Risk Increase</option>
                <option value="threshold_breach">Threshold Breach</option>
                <option value="fraud_signal">Fraud Signal</option>
                <option value="liquidity">Liquidity</option>
                <option value="debt">Debt</option>
                <option value="leverage">Leverage</option>
                <option value="financial_health_deteriorated">Financial Health</option>
                <option value="investment_health_drop">Investment Health</option>
                <option value="negative_news">Negative News</option>
                <option value="price_drawdown">Price Drawdown</option>
                <option value="volume_spike">Volume Spike</option>
                <option value="general">General</option>
              </select>

              {/* Read toggle */}
              <select
                value={readFilter}
                onChange={(e) => setReadFilter(e.target.value as typeof readFilter)}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30 cursor-pointer"
              >
                <option value="all">All Alerts</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>

              <span className="ml-auto text-xs text-muted-foreground">
                {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? "s" : ""}
              </span>

              {unreadCount > 0 && (
                <Button size="sm" variant="outline" onClick={markAllAsRead} className="gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Mark all as read
                </Button>
              )}
            </div>
          </Card>

          {/* Alert list */}
          {filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="py-16">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <BellOff className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-foreground">No alerts match your filters</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting the severity, type, or read status filters.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSeverityFilter("all");
                      setTypeFilter("all");
                      setReadFilter("all");
                    }}
                    className="mt-1"
                  >
                    Clear filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredAlerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onToggleRead={toggleRead}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════ WATCHLIST TAB */}
      {activeTab === "watchlist" && (
        <div className="space-y-4">
          {/* Quick add */}
          <Card>
            <CardHeader>
              <CardTitle>Add to Watchlist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <select
                  value={watchlistSelectId}
                  onChange={(e) => setWatchlistSelectId(e.target.value)}
                  className="flex-1 h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30 cursor-pointer"
                >
                  <option value="">Select a company to add…</option>
                  {availableToAdd.map((c) => (
                    <option key={c.id} value={c.id} className="bg-background">
                      {c.name} ({c.ticker})
                    </option>
                  ))}
                </select>
                <Button
                  size="sm"
                  onClick={addToWatchlist}
                  disabled={!watchlistSelectId}
                  className="gap-1.5 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              {availableToAdd.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  All companies are already on your watchlist.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Watchlist table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Company
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Risk Score
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Alert Threshold
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Date Added
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Notes
                    </th>
                    <th className="px-4 py-3 w-16" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {watchlist.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Activity className="h-8 w-8 opacity-30" />
                          <p className="font-medium text-sm">Your watchlist is empty.</p>
                          <p className="text-xs">Add companies above to start monitoring.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    watchlist.map((item) => {
                      const company = mockCompanies.find((c) => c.id === item.companyId);
                      if (!company) return null;
                      return (
                        <WatchlistRow
                          key={item.companyId}
                          item={item}
                          company={company}
                          onRemove={removeFromWatchlist}
                          onUpdate={updateWatchlistItem}
                        />
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ══════════════════════════════════════════════════ SIMULATOR TAB */}
      {activeTab === "simulator" && (
        <div className="space-y-4">
          {/* Description */}
          <Card>
            <CardContent className="py-3">
              <p className="text-sm text-muted-foreground">
                Adjust financial inputs to see how risk score changes. Select a company to load its
                baseline metrics, then manipulate the sliders to simulate different scenarios.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Controls */}
            <div className="lg:col-span-3 space-y-4">
              {/* Company selector */}
              <Card>
                <CardHeader>
                  <CardTitle>Base Company</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <select
                    value={scenarioCompanyId}
                    onChange={(e) => handleCompanyChange(e.target.value)}
                    className="w-full h-9 rounded-lg border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30 cursor-pointer"
                  >
                    {mockCompanies.map((c) => (
                      <option key={c.id} value={c.id} className="bg-background">
                        {c.name} — Current Score: {c.riskScore}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={resetBaseline} className="gap-1.5">
                      <RotateCcw className="h-3.5 w-3.5" />
                      Reset to company baseline
                    </Button>
                    <button
                      onClick={() => setShowCompare((v) => !v)}
                      className={cn(
                        "inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border text-xs font-medium transition-colors",
                        showCompare
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                      )}
                    >
                      <SlidersHorizontal className="h-3 w-3" />
                      Compare to original
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Sliders */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Inputs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ScenarioSlider
                    label="Current Ratio"
                    value={inputs.currentRatio}
                    min={0.1}
                    max={4.0}
                    step={0.1}
                    displayValue={inputs.currentRatio.toFixed(1) + "x"}
                    onChange={(v) => setInput("currentRatio", v)}
                  />
                  <ScenarioSlider
                    label="Debt-to-Equity"
                    value={inputs.debtToEquity}
                    min={0.0}
                    max={10.0}
                    step={0.1}
                    displayValue={inputs.debtToEquity.toFixed(1) + "x"}
                    onChange={(v) => setInput("debtToEquity", v)}
                  />
                  <ScenarioSlider
                    label="Net Margin"
                    value={inputs.netMargin}
                    min={-0.3}
                    max={0.4}
                    step={0.01}
                    displayValue={(inputs.netMargin * 100).toFixed(1) + "%"}
                    onChange={(v) => setInput("netMargin", v)}
                  />
                  <ScenarioSlider
                    label="Revenue Growth"
                    value={inputs.revenueGrowth}
                    min={-0.3}
                    max={0.5}
                    step={0.01}
                    displayValue={(inputs.revenueGrowth * 100).toFixed(1) + "%"}
                    onChange={(v) => setInput("revenueGrowth", v)}
                  />
                  <ScenarioSlider
                    label="Operating Cash Flow Ratio"
                    value={inputs.operatingCashFlowRatio}
                    min={-0.2}
                    max={0.5}
                    step={0.01}
                    displayValue={(inputs.operatingCashFlowRatio * 100).toFixed(1) + "%"}
                    onChange={(v) => setInput("operatingCashFlowRatio", v)}
                  />
                  <ScenarioSlider
                    label="Interest Coverage"
                    value={inputs.interestCoverage}
                    min={0.0}
                    max={15.0}
                    step={0.1}
                    displayValue={inputs.interestCoverage.toFixed(1) + "x"}
                    onChange={(v) => setInput("interestCoverage", v)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Score display */}
            <div className="lg:col-span-2 space-y-4">
              {/* Simulated score */}
              <Card className={cn("border", tierBgClass[simulatedTier])}>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground font-normal">
                    Simulated Risk Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center py-4">
                    <div
                      className={cn(
                        "text-7xl font-black tabular-nums leading-none",
                        tierColorClass[simulatedTier]
                      )}
                    >
                      {simulatedScore}
                    </div>
                    <div
                      className={cn(
                        "mt-3 text-base font-semibold",
                        tierColorClass[simulatedTier]
                      )}
                    >
                      {simulatedLabel}
                    </div>
                    {showCompare && (
                      <div className={cn("mt-1.5 text-sm font-medium", deltaColor)}>
                        {deltaLabel} vs. original
                      </div>
                    )}
                  </div>

                  {/* Score bar */}
                  <div>
                    <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          getRiskScoreBarColor(simulatedScore)
                        )}
                        style={{ width: `${simulatedScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>0 — Healthy</span>
                      <span>100 — Critical</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comparison panel */}
              {showCompare && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Score Comparison</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-xs text-muted-foreground">Original</p>
                        <p className={cn("text-2xl font-black tabular-nums", getRiskScoreColor(originalScore))}>
                          {originalScore}
                        </p>
                        <p className={cn("text-xs font-medium", getRiskScoreColor(originalScore))}>
                          {getRiskLabel(getRiskTierFromScore(originalScore))}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <div className={cn("text-sm font-bold", deltaColor)}>{deltaLabel}</div>
                        <div className="text-[10px] text-muted-foreground">change</div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Simulated</p>
                        <p className={cn("text-2xl font-black tabular-nums", tierColorClass[simulatedTier])}>
                          {simulatedScore}
                        </p>
                        <p className={cn("text-xs font-medium", tierColorClass[simulatedTier])}>
                          {simulatedLabel}
                        </p>
                      </div>
                    </div>
                    {/* Bar comparison */}
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Original</span>
                          <span className={cn("font-medium", getRiskScoreColor(originalScore))}>{originalScore}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", getRiskScoreBarColor(originalScore))}
                            style={{ width: `${originalScore}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Simulated</span>
                          <span className={cn("font-medium", tierColorClass[simulatedTier])}>{simulatedScore}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", getRiskScoreBarColor(simulatedScore))}
                            style={{ width: `${simulatedScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Current inputs summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Input Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1.5 text-xs">
                    {(
                      [
                        ["Current Ratio", inputs.currentRatio.toFixed(2) + "x"],
                        ["Debt / Equity", inputs.debtToEquity.toFixed(2) + "x"],
                        ["Net Margin", (inputs.netMargin * 100).toFixed(1) + "%"],
                        ["Revenue Growth", (inputs.revenueGrowth * 100).toFixed(1) + "%"],
                        ["OCF Ratio", (inputs.operatingCashFlowRatio * 100).toFixed(1) + "%"],
                        ["Interest Coverage", inputs.interestCoverage.toFixed(1) + "x"],
                      ] as [string, string][]
                    ).map(([label, val]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium tabular-nums">{val}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </DashboardPageShell>
  );
}

// ─── AlertCard ────────────────────────────────────────────────────────────────

interface AlertCardProps {
  alert: Alert;
  onToggleRead: (id: string) => void;
}

function AlertCard({ alert, onToggleRead }: AlertCardProps) {
  const SeverityIcon = alert.severity === "critical"
    ? XCircle
    : alert.severity === "warning"
    ? AlertTriangle
    : Info;

  const iconClass =
    alert.severity === "critical"
      ? "text-red-500"
      : alert.severity === "warning"
      ? "text-amber-500"
      : "text-blue-500";

  const leftBorderClass =
    alert.severity === "critical"
      ? "border-l-4 border-l-red-500"
      : alert.severity === "warning"
      ? "border-l-4 border-l-amber-500"
      : "border-l-4 border-l-blue-500";

  return (
    <Card
      className={cn(
        "transition-opacity",
        alert.read && "opacity-60",
        leftBorderClass
      )}
    >
      <CardContent className="py-3">
        <div className="flex items-start gap-3">
          {/* Severity icon */}
          <div className="shrink-0 mt-0.5">
            <SeverityIcon className={cn("h-5 w-5", iconClass)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <Link
                  href={`/dashboard/company/${alert.companyId}`}
                  className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  {alert.companyName}
                </Link>
                <p className="font-semibold text-sm text-foreground mt-0.5 leading-snug">
                  {alert.title}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={cn(
                    "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
                    getAlertTypeBadgeClass(alert.type)
                  )}
                >
                  {getAlertTypeLabel(alert.type)}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {alert.description}
            </p>
            <div className="flex items-center justify-between gap-2 mt-2">
              <span className="text-[11px] text-muted-foreground">
                {formatAlertDate(alert.date)}
              </span>
              <button
                onClick={() => onToggleRead(alert.id)}
                className={cn(
                  "text-[11px] font-medium transition-colors flex items-center gap-1",
                  alert.read
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-primary hover:text-primary/80"
                )}
              >
                {alert.read ? (
                  <>
                    <RefreshCw className="h-3 w-3" />
                    Mark unread
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    Mark as read
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── WatchlistRow ─────────────────────────────────────────────────────────────

interface WatchlistRowProps {
  item: WatchlistItem;
  company: Company;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<WatchlistItem>) => void;
}

function WatchlistRow({ item, company, onRemove, onUpdate }: WatchlistRowProps) {
  return (
    <tr className="hover:bg-muted/20 transition-colors group">
      {/* Company */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted font-bold text-xs text-muted-foreground uppercase tracking-wider border border-border">
            {company.ticker.slice(0, 2)}
          </div>
          <div>
            <Link
              href={`/dashboard/company/${company.id}`}
              className="font-semibold text-sm hover:text-primary transition-colors"
            >
              {company.name}
            </Link>
            <div className="mt-0.5">
              <RiskBadge tier={company.riskTier} size="sm" showIcon={false} />
            </div>
          </div>
        </div>
      </td>

      {/* Risk score */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-bold tabular-nums text-base",
              getRiskScoreColor(company.riskScore)
            )}
          >
            {company.riskScore}
          </span>
          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full rounded-full", getRiskScoreBarColor(company.riskScore))}
              style={{ width: `${company.riskScore}%` }}
            />
          </div>
        </div>
      </td>

      {/* Alert threshold */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={1}
            max={99}
            value={item.alertThreshold}
            onChange={(e) =>
              onUpdate(item.companyId, {
                alertThreshold: Math.max(1, Math.min(99, parseInt(e.target.value) || 0)),
              })
            }
            className="w-16 h-7 rounded-md border border-input bg-transparent px-2 text-sm text-foreground outline-none text-center focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30 tabular-nums"
          />
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </td>

      {/* Date added */}
      <td className="px-4 py-3.5">
        <span className="text-sm text-muted-foreground">
          {new Date(item.addedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </td>

      {/* Notes */}
      <td className="px-4 py-3.5 max-w-[220px]">
        <input
          type="text"
          value={item.notes}
          onChange={(e) => onUpdate(item.companyId, { notes: e.target.value })}
          placeholder="Add notes…"
          className="w-full h-7 rounded-md border border-transparent bg-transparent px-1 text-sm text-foreground outline-none hover:border-input focus:border-ring focus:ring-2 focus:ring-ring/40 transition-colors placeholder:text-muted-foreground/60"
        />
      </td>

      {/* Remove */}
      <td className="px-4 py-3.5">
        <button
          onClick={() => onRemove(item.companyId)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500"
          title="Remove from watchlist"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}
