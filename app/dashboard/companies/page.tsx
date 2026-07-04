"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Upload,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ArrowRight,
  Filter,
  Bell,
  Newspaper,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RiskBadge, FraudBadge } from "@/components/ui/risk-badge";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { InsightStatCard } from "@/components/ui/insight-stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  companyIntelligence,
  type CompanyIntelligence,
} from "@/lib/mock/company-intelligence";
import type { RiskTier, FraudRisk, Sector } from "@/types";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey =
  | "name"
  | "riskScore"
  | "financialHealth"
  | "investmentHealth"
  | "marketMomentum"
  | "newsSentiment"
  | "riskTier"
  | "fraudRisk"
  | "revenue"
  | "lastUpdated";
type SortDir = "asc" | "desc";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRevenue(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}B`;
  return `$${value}M`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPrice(value: number | null): string {
  if (value == null) return "N/A";
  return `$${value.toFixed(2)}`;
}

function formatPercent(value: number | null): string {
  if (value == null) return "N/A";
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function scoreTextColor(score: number, inverted = false) {
  if (inverted) {
    if (score >= 70) return "text-red-600 dark:text-red-400";
    if (score >= 50) return "text-orange-600 dark:text-orange-400";
    return "text-emerald-600 dark:text-emerald-400";
  }
  if (score >= 70) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function scoreTone(score: number, inverted = false): "good" | "watch" | "bad" {
  if (inverted) {
    if (score >= 70) return "bad";
    if (score >= 50) return "watch";
    return "good";
  }
  if (score >= 70) return "good";
  if (score >= 50) return "watch";
  return "bad";
}

const riskTierOrder: Record<RiskTier, number> = {
  healthy: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const fraudRiskOrder: Record<FraudRisk, number> = {
  none: 1,
  low: 2,
  medium: 3,
  high: 4,
};

function getRiskScoreBarColor(score: number): string {
  if (score <= 25) return "bg-emerald-500";
  if (score <= 50) return "bg-amber-500";
  if (score <= 75) return "bg-orange-500";
  return "bg-red-500";
}

function getRiskScoreTextColor(score: number): string {
  if (score <= 25) return "text-emerald-600 dark:text-emerald-400";
  if (score <= 50) return "text-amber-600 dark:text-amber-400";
  if (score <= 75) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

const allSectors: Sector[] = [
  "Technology",
  "Retail",
  "Manufacturing",
  "Healthcare",
  "Financial Services",
  "Energy",
  "Real Estate",
  "Consumer Staples",
];

// ─── Sortable column header ───────────────────────────────────────────────────

interface SortHeaderProps {
  label: string;
  sortKey: SortKey;
  current: SortKey;
  direction: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}

function SortHeader({ label, sortKey, current, direction, onSort, className }: SortHeaderProps) {
  const isActive = current === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={cn(
        "flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors group",
        isActive && "text-foreground",
        className
      )}
    >
      {label}
      <span className="opacity-50 group-hover:opacity-100 transition-opacity">
        {isActive ? (
          direction === "asc" ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )
        ) : (
          <ChevronsUpDown className="h-3 w-3" />
        )}
      </span>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompaniesPage() {
  const [query, setQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState<"all" | Sector>("all");
  const [tierFilter, setTierFilter] = useState<"all" | RiskTier>("all");
  const [fraudFilter, setFraudFilter] = useState<"all" | "flagged">("all");
  const [investmentFilter, setInvestmentFilter] = useState<"all" | "strong" | "watchlist">("all");
  const [newsFilter, setNewsFilter] = useState<"all" | "negative" | "high_severity">("all");
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const filtered = useMemo(() => {
    let result = [...companyIntelligence];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        ({ company }) =>
          company.name.toLowerCase().includes(q) ||
          company.ticker.toLowerCase().includes(q) ||
          company.exchange.toLowerCase().includes(q) ||
          company.sector.toLowerCase().includes(q) ||
          company.industry.toLowerCase().includes(q)
      );
    }

    // Sector filter
    if (sectorFilter !== "all") {
      result = result.filter(({ company }) => company.sector === sectorFilter);
    }

    // Tier filter
    if (tierFilter !== "all") {
      result = result.filter(({ company }) => company.riskTier === tierFilter);
    }

    // Fraud filter
    if (fraudFilter === "flagged") {
      result = result.filter(({ company }) => company.fraudRisk === "medium" || company.fraudRisk === "high");
    }

    if (investmentFilter === "strong") {
      result = result.filter((item) => item.investmentHealth.score >= 70);
    } else if (investmentFilter === "watchlist") {
      result = result.filter((item) => item.investmentHealth.score < 60);
    }

    if (newsFilter === "negative") {
      result = result.filter((item) => item.negativeNewsCount > 0);
    } else if (newsFilter === "high_severity") {
      result = result.filter((item) => item.criticalNewsCount > 0);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      const companyA = a.company;
      const companyB = b.company;
      switch (sortKey) {
        case "name":
          cmp = companyA.name.localeCompare(companyB.name);
          break;
        case "riskScore":
          cmp = a.riskScore - b.riskScore;
          break;
        case "financialHealth":
          cmp = a.financialHealthScore - b.financialHealthScore;
          break;
        case "investmentHealth":
          cmp = a.investmentHealth.score - b.investmentHealth.score;
          break;
        case "marketMomentum":
          cmp = a.marketMomentumScore - b.marketMomentumScore;
          break;
        case "newsSentiment":
          cmp = a.newsSentimentScore - b.newsSentimentScore;
          break;
        case "riskTier":
          cmp = riskTierOrder[companyA.riskTier] - riskTierOrder[companyB.riskTier];
          break;
        case "fraudRisk":
          cmp = fraudRiskOrder[companyA.fraudRisk] - fraudRiskOrder[companyB.fraudRisk];
          break;
        case "revenue": {
          const aRev = a.latestPeriod.revenue;
          const bRev = b.latestPeriod.revenue;
          cmp = aRev - bRev;
          break;
        }
        case "lastUpdated":
          cmp = new Date(companyA.lastUpdated).getTime() - new Date(companyB.lastUpdated).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [query, sectorFilter, tierFilter, fraudFilter, investmentFilter, newsFilter, sortKey, sortDir]);

  const hasActiveFilters =
    query.trim() !== "" ||
    sectorFilter !== "all" ||
    tierFilter !== "all" ||
    fraudFilter !== "all" ||
    investmentFilter !== "all" ||
    newsFilter !== "all";

  function clearFilters() {
    setQuery("");
    setSectorFilter("all");
    setTierFilter("all");
    setFraudFilter("all");
    setInvestmentFilter("all");
    setNewsFilter("all");
  }

  const highRiskCount = filtered.filter(
    (item) => item.company.riskTier === "high" || item.company.riskTier === "critical"
  ).length;
  const flaggedCount = filtered.filter(
    (item) => item.company.fraudRisk === "medium" || item.company.fraudRisk === "high"
  ).length;
  const avgInvestmentHealth = filtered.length
    ? Math.round(filtered.reduce((sum, item) => sum + item.investmentHealth.score, 0) / filtered.length)
    : 0;

  return (
    <DashboardPageShell>
      <PageHeader
        eyebrow="Company Universe"
        title="Companies"
        description="Search, filter, and triage the mock coverage universe across financial health, investment health, risk, market, news, alerts, and revenue."
        icon={Building2}
        actions={
          <Link href="/dashboard/upload">
          <Button size="sm" className="gap-1.5 h-9">
            <Upload className="h-4 w-4" />
            Add Company
          </Button>
        </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InsightStatCard
          title="Matched Companies"
          value={`${filtered.length}/${companyIntelligence.length}`}
          description="After active filters"
          icon={Building2}
          tone="info"
        />
        <InsightStatCard
          title="Elevated Risk"
          value={highRiskCount}
          description="High or critical tier"
          icon={TrendingUp}
          tone={highRiskCount > 0 ? "watch" : "good"}
        />
        <InsightStatCard
          title="Avg Investment Health"
          value={avgInvestmentHealth || "N/A"}
          description="Filtered composite score"
          icon={Newspaper}
          tone={avgInvestmentHealth ? scoreTone(avgInvestmentHealth) : "default"}
        />
        <InsightStatCard
          title="Fraud Watch"
          value={flaggedCount}
          description="Medium or high fraud risk"
          icon={Bell}
          tone={flaggedCount > 0 ? "bad" : "good"}
        />
      </div>

      {/* ── Filter bar ── */}
      <Card>
        <div className="px-4 py-3 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, ticker, exchange, sector..."
              className="pl-8 h-8 text-sm"
              aria-label="Search companies"
            />
          </div>

          {/* Sector filter */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value as "all" | Sector)}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30 cursor-pointer"
            aria-label="Filter by sector"
          >
            <option value="all">All Sectors</option>
            {allSectors.map((s) => (
              <option key={s} value={s} className="bg-background">
                {s}
              </option>
            ))}
          </select>

          {/* Risk tier filter */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as "all" | RiskTier)}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30 cursor-pointer"
            aria-label="Filter by risk tier"
          >
            <option value="all">All Risk Tiers</option>
            <option value="healthy" className="bg-background">Healthy</option>
            <option value="medium" className="bg-background">Medium Risk</option>
            <option value="high" className="bg-background">High Risk</option>
            <option value="critical" className="bg-background">Critical Risk</option>
          </select>

          {/* Fraud filter */}
          <select
            value={fraudFilter}
            onChange={(e) => setFraudFilter(e.target.value as "all" | "flagged")}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30 cursor-pointer"
            aria-label="Filter by fraud risk"
          >
            <option value="all">All Fraud Risk</option>
            <option value="flagged" className="bg-background">Fraud Flagged</option>
          </select>

          <select
            value={investmentFilter}
            onChange={(e) => setInvestmentFilter(e.target.value as "all" | "strong" | "watchlist")}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30 cursor-pointer"
            aria-label="Filter by investment health"
          >
            <option value="all">All Investment Health</option>
            <option value="strong" className="bg-background">Strong Scores</option>
            <option value="watchlist" className="bg-background">Watchlist Scores</option>
          </select>

          <select
            value={newsFilter}
            onChange={(e) => setNewsFilter(e.target.value as "all" | "negative" | "high_severity")}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30 cursor-pointer"
            aria-label="Filter by news signal"
          >
            <option value="all">All News</option>
            <option value="negative" className="bg-background">Negative News</option>
            <option value="high_severity" className="bg-background">High Severity Events</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Filter className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}

          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} of {companyIntelligence.length} companies
          </span>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="lg:hidden">
          <EmptyState
            icon={Building2}
            title="No companies match your filters"
            description="Adjust the current filters or clear them to return to the full mock company universe."
            action={{ label: "Clear filters", onClick: clearFilters }}
          />
        </Card>
      ) : (
        <div className="grid gap-3 lg:hidden">
          {filtered.map((item) => {
            const { company, latestPeriod } = item;
            return (
              <Link
                key={company.id}
                href={`/dashboard/company/${company.id}`}
                className="rounded-xl border bg-card p-4 text-sm shadow-sm transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        {company.ticker.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{company.name}</p>
                        <p className="text-xs text-muted-foreground">
                          <span className="font-mono">{company.ticker}</span> · {company.sector}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <RiskBadge tier={company.riskTier} size="sm" />
                  <FraudBadge risk={company.fraudRisk} size="sm" />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Risk</p>
                    <p className={cn("text-base font-bold tabular-nums", getRiskScoreTextColor(item.riskScore))}>
                      {item.riskScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Investment</p>
                    <p className={cn("text-base font-bold tabular-nums", scoreTextColor(item.investmentHealth.score))}>
                      {item.investmentHealth.score}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Market</p>
                    <p className="text-sm font-semibold tabular-nums">
                      {formatPrice(item.latestPrice)}
                    </p>
                    <p className={cn("text-xs tabular-nums", (item.priceChangePercent ?? 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                      {formatPercent(item.priceChangePercent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Revenue</p>
                    <p className="text-sm font-semibold tabular-nums">{formatRevenue(latestPeriod.revenue)}</p>
                    <p className="text-xs text-muted-foreground">{latestPeriod.period}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Table ── */}
      <Card className="hidden overflow-hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Head */}
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3">
                  <SortHeader
                    label="Company"
                    sortKey="name"
                    current={sortKey}
                    direction={sortDir}
                    onSort={handleSort}
                  />
                </th>
                <th className="text-left px-4 py-3">
                  <SortHeader
                    label="Financial Health"
                    sortKey="financialHealth"
                    current={sortKey}
                    direction={sortDir}
                    onSort={handleSort}
                  />
                </th>
                <th className="text-left px-4 py-3">
                  <SortHeader
                    label="Investment Health"
                    sortKey="investmentHealth"
                    current={sortKey}
                    direction={sortDir}
                    onSort={handleSort}
                  />
                </th>
                <th className="text-left px-4 py-3">
                  <SortHeader
                    label="Risk"
                    sortKey="riskScore"
                    current={sortKey}
                    direction={sortDir}
                    onSort={handleSort}
                  />
                </th>
                <th className="text-left px-4 py-3">
                  <SortHeader
                    label="Fraud"
                    sortKey="fraudRisk"
                    current={sortKey}
                    direction={sortDir}
                    onSort={handleSort}
                  />
                </th>
                <th className="text-left px-4 py-3">
                  <SortHeader
                    label="Market"
                    sortKey="marketMomentum"
                    current={sortKey}
                    direction={sortDir}
                    onSort={handleSort}
                  />
                </th>
                <th className="text-left px-4 py-3">
                  <SortHeader
                    label="News"
                    sortKey="newsSentiment"
                    current={sortKey}
                    direction={sortDir}
                    onSort={handleSort}
                  />
                </th>
                <th className="text-left px-4 py-3">
                  <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Bell className="h-3 w-3" />
                    Alerts
                  </span>
                </th>
                <th className="text-right px-4 py-3">
                  <SortHeader
                    label="Revenue (Latest)"
                    sortKey="revenue"
                    current={sortKey}
                    direction={sortDir}
                    onSort={handleSort}
                    className="justify-end"
                  />
                </th>
                <th className="text-left px-4 py-3">
                  <SortHeader
                    label="Last Updated"
                    sortKey="lastUpdated"
                    current={sortKey}
                    direction={sortDir}
                    onSort={handleSort}
                  />
                </th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-border/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-16 text-muted-foreground text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="h-8 w-8 opacity-30" />
                      <p className="font-medium">No companies match your filters.</p>
                      <button
                        onClick={clearFilters}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item: CompanyIntelligence) => {
                  const { company, latestPeriod } = item;
                  return (
                    <tr
                      key={company.id}
                      className="group hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => {
                        window.location.href = `/dashboard/company/${company.id}`;
                      }}
                    >
                      {/* Company */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted font-bold text-xs text-muted-foreground uppercase tracking-wider border border-border">
                            {company.ticker.slice(0, 2)}
                          </div>
                          <div>
                            <Link
                              href={`/dashboard/company/${company.id}`}
                              className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {company.name}
                            </Link>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-mono text-muted-foreground">{company.ticker}</span>
                              <span className="text-muted-foreground/40 text-xs">·</span>
                              <span className="text-xs text-muted-foreground">{company.sector}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Risk score */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className={cn("font-bold tabular-nums text-sm w-8", scoreTextColor(item.financialHealthScore))}>
                            {item.financialHealthScore}
                          </span>
                          <div className="w-20 h-1.5 rounded-full bg-muted/60 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all"
                              style={{ width: `${item.financialHealthScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Investment health */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          <span className={cn("text-sm font-bold tabular-nums", scoreTextColor(item.investmentHealth.score))}>
                            {item.investmentHealth.score}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{item.investmentHealth.label}</span>
                        </div>
                      </td>

                      {/* Risk score */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className={cn("font-bold tabular-nums text-sm w-8", getRiskScoreTextColor(item.riskScore))}>
                            {item.riskScore}
                          </span>
                          <div className="w-20 h-1.5 rounded-full bg-muted/60 overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all", getRiskScoreBarColor(item.riskScore))}
                              style={{ width: `${item.riskScore}%` }}
                            />
                          </div>
                        </div>
                        <div className="mt-1">
                          <RiskBadge tier={company.riskTier} size="sm" />
                        </div>
                      </td>

                      {/* Fraud risk */}
                      <td className="px-4 py-3.5">
                        <FraudBadge risk={company.fraudRisk} size="sm" />
                      </td>

                      {/* Market */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium tabular-nums">{formatPrice(item.latestPrice)}</p>
                            <p className={cn("text-[11px] tabular-nums", (item.priceChangePercent ?? 0) >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                              {formatPercent(item.priceChangePercent)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* News */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <Newspaper className="h-3.5 w-3.5 text-muted-foreground" />
                          <div>
                            <p className={cn("text-sm font-bold tabular-nums", scoreTextColor(item.newsSentimentScore))}>
                              {item.newsSentimentScore}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {item.negativeNewsCount} negative
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Alerts */}
                      <td className="px-4 py-3.5">
                        <p className={cn("text-sm font-semibold tabular-nums", item.unreadAlertCount > 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
                          {item.unreadAlertCount}/{item.alertCount}
                        </p>
                        <p className="text-[11px] text-muted-foreground">unread/all</p>
                      </td>

                      {/* Revenue */}
                      <td className="px-4 py-3.5 text-right">
                        <p className="font-medium tabular-nums">{formatRevenue(latestPeriod.revenue)}</p>
                        <p className="text-[11px] text-muted-foreground">{latestPeriod.period}</p>
                      </td>

                      {/* Last updated */}
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-muted-foreground">{formatDate(company.lastUpdated)}</p>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/dashboard/company/${company.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            "inline-flex items-center gap-1 text-xs font-medium rounded-lg border border-border px-2.5 py-1 transition-colors",
                            "hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400",
                            "text-muted-foreground"
                          )}
                        >
                          View
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Footer note */}
      <p className="text-xs text-muted-foreground text-center pb-2">
        Showing {filtered.length} of {companyIntelligence.length} companies · Data as of Dec 31, 2024 · Demo portfolio
      </p>
    </DashboardPageShell>
  );
}
