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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RiskBadge, FraudBadge } from "@/components/ui/risk-badge";
import { mockCompanies } from "@/lib/mock";
import type { Company, RiskTier, FraudRisk, Sector } from "@/types";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = "name" | "riskScore" | "riskTier" | "fraudRisk" | "revenue" | "lastUpdated";
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
    let result = [...mockCompanies];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.ticker.toLowerCase().includes(q) ||
          c.sector.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q)
      );
    }

    // Sector filter
    if (sectorFilter !== "all") {
      result = result.filter((c) => c.sector === sectorFilter);
    }

    // Tier filter
    if (tierFilter !== "all") {
      result = result.filter((c) => c.riskTier === tierFilter);
    }

    // Fraud filter
    if (fraudFilter === "flagged") {
      result = result.filter((c) => c.fraudRisk === "medium" || c.fraudRisk === "high");
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "riskScore":
          cmp = a.riskScore - b.riskScore;
          break;
        case "riskTier":
          cmp = riskTierOrder[a.riskTier] - riskTierOrder[b.riskTier];
          break;
        case "fraudRisk":
          cmp = fraudRiskOrder[a.fraudRisk] - fraudRiskOrder[b.fraudRisk];
          break;
        case "revenue": {
          const aRev = a.periods[a.periods.length - 1]?.revenue ?? 0;
          const bRev = b.periods[b.periods.length - 1]?.revenue ?? 0;
          cmp = aRev - bRev;
          break;
        }
        case "lastUpdated":
          cmp = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [query, sectorFilter, tierFilter, fraudFilter, sortKey, sortDir]);

  const hasActiveFilters =
    query.trim() !== "" ||
    sectorFilter !== "all" ||
    tierFilter !== "all" ||
    fraudFilter !== "all";

  function clearFilters() {
    setQuery("");
    setSectorFilter("all");
    setTierFilter("all");
    setFraudFilter("all");
  }

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground border border-border">
            {mockCompanies.length}
          </span>
        </div>
        <Link href="/dashboard/upload">
          <Button size="sm" className="gap-1.5 h-9">
            <Upload className="h-4 w-4" />
            Add Company
          </Button>
        </Link>
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
              placeholder="Search by name, ticker, sector…"
              className="pl-8 h-8 text-sm"
            />
          </div>

          {/* Sector filter */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value as "all" | Sector)}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30 cursor-pointer"
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
          >
            <option value="all">All Fraud Risk</option>
            <option value="flagged" className="bg-background">Fraud Flagged</option>
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
            {filtered.length} of {mockCompanies.length} companies
          </span>
        </div>
      </Card>

      {/* ── Table ── */}
      <Card className="overflow-hidden">
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
                    label="Risk Score"
                    sortKey="riskScore"
                    current={sortKey}
                    direction={sortDir}
                    onSort={handleSort}
                  />
                </th>
                <th className="text-left px-4 py-3">
                  <SortHeader
                    label="Risk Tier"
                    sortKey="riskTier"
                    current={sortKey}
                    direction={sortDir}
                    onSort={handleSort}
                  />
                </th>
                <th className="text-left px-4 py-3">
                  <SortHeader
                    label="Fraud Risk"
                    sortKey="fraudRisk"
                    current={sortKey}
                    direction={sortDir}
                    onSort={handleSort}
                  />
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
                  <td colSpan={7} className="text-center py-16 text-muted-foreground text-sm">
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
                filtered.map((company: Company) => {
                  const latestPeriod = company.periods[company.periods.length - 1];
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
                          <span className={cn("font-bold tabular-nums text-sm w-8", getRiskScoreTextColor(company.riskScore))}>
                            {company.riskScore}
                          </span>
                          <div className="w-20 h-1.5 rounded-full bg-muted/60 overflow-hidden">
                            <div
                              className={cn("h-full rounded-full transition-all", getRiskScoreBarColor(company.riskScore))}
                              style={{ width: `${company.riskScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Risk tier */}
                      <td className="px-4 py-3.5">
                        <RiskBadge tier={company.riskTier} size="sm" />
                      </td>

                      {/* Fraud risk */}
                      <td className="px-4 py-3.5">
                        <FraudBadge risk={company.fraudRisk} size="sm" />
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
        Showing {filtered.length} of {mockCompanies.length} companies · Data as of Dec 31, 2024 · Demo portfolio
      </p>
    </div>
  );
}
