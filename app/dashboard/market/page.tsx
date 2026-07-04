"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Building2,
  LineChart,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { InsightStatCard } from "@/components/ui/insight-stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  companyIntelligence,
  marketIntelligenceUniverse,
} from "@/lib/mock/company-intelligence";
import { cn } from "@/lib/utils";

type MomentumFilter = "all" | "strong" | "stable" | "volatile" | "weak";

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function formatMarketCap(value: number) {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  return `$${value.toLocaleString()}`;
}

function scoreColor(score: number) {
  if (score >= 70) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function changeColor(value: number) {
  return value >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400";
}

function momentumMatches(label: string, filter: MomentumFilter) {
  if (filter === "all") return true;
  if (filter === "strong") return label === "Strong Momentum";
  if (filter === "stable") return label === "Stable";
  if (filter === "volatile") return label === "Volatile";
  return label === "Weak Momentum";
}

export default function MarketDashboardPage() {
  const [query, setQuery] = useState("");
  const [momentumFilter, setMomentumFilter] = useState<MomentumFilter>("all");

  const enriched = useMemo(
    () =>
      marketIntelligenceUniverse.map((market) => ({
        market,
        company: companyIntelligence.find((item) => item.company.id === market.companyId)?.company,
      })),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched
      .filter(({ market, company }) => {
        const matchesQuery =
          q.length === 0 ||
          market.companyName.toLowerCase().includes(q) ||
          market.ticker.toLowerCase().includes(q) ||
          company?.sector.toLowerCase().includes(q);
        return matchesQuery && momentumMatches(market.marketMomentum.label, momentumFilter);
      })
      .sort((a, b) => b.market.marketMomentum.score - a.market.marketMomentum.score);
  }, [enriched, momentumFilter, query]);

  const averageMomentum = Math.round(
    marketIntelligenceUniverse.reduce((sum, item) => sum + item.marketMomentum.score, 0) /
      marketIntelligenceUniverse.length
  );
  const positiveOneYear = marketIntelligenceUniverse.filter((item) => item.metrics.performance.oneYear >= 0).length;
  const weakMomentum = marketIntelligenceUniverse.filter((item) => item.marketMomentum.score < 45).length;
  const volumeSpikes = marketIntelligenceUniverse.filter((item) => item.metrics.volumeChangePercent >= 25).length;

  return (
    <DashboardPageShell maxWidth="wide">
      <PageHeader
        eyebrow="Market Module"
        title="Market Intelligence"
        description="Mock price, volume, volatility, trend, and momentum signals for the demo universe."
        icon={LineChart}
        iconClassName="text-sky-600 dark:text-sky-400"
        actions={
        <Link
          href="/dashboard/companies"
          className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
        >
          Company universe
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InsightStatCard
          title="Average Momentum"
          value={averageMomentum}
          description={`Across ${marketIntelligenceUniverse.length} mock tickers`}
          icon={Activity}
          tone={averageMomentum >= 70 ? "good" : averageMomentum >= 50 ? "watch" : "bad"}
        />
        <InsightStatCard
          title="Positive 1Y Moves"
          value={positiveOneYear}
          description="Companies above starting mock price"
          icon={TrendingUp}
          tone="good"
        />
        <InsightStatCard
          title="Weak Momentum"
          value={weakMomentum}
          description="Below 45/100 momentum score"
          icon={TrendingDown}
          tone={weakMomentum > 0 ? "bad" : "good"}
        />
        <InsightStatCard
          title="Volume Spikes"
          value={volumeSpikes}
          description="Latest volume at least 25% above average"
          icon={BarChart3}
          tone={volumeSpikes > 0 ? "watch" : "default"}
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search company, ticker, or sector"
              className="h-8 pl-8"
              aria-label="Search market intelligence"
            />
          </div>
          <select
            value={momentumFilter}
            onChange={(event) => setMomentumFilter(event.target.value as MomentumFilter)}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30"
            aria-label="Filter by momentum"
          >
            <option value="all">All Momentum</option>
            <option value="strong" className="bg-background">Strong Momentum</option>
            <option value="stable" className="bg-background">Stable</option>
            <option value="volatile" className="bg-background">Volatile</option>
            <option value="weak" className="bg-background">Weak Momentum</option>
          </select>
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} of {marketIntelligenceUniverse.length} tickers
          </span>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <Card>
          <CardHeader className="border-b pb-3">
            <CardTitle>Market Universe</CardTitle>
            <CardDescription>Latest mock prices, performance, drawdown, and liquidity signals.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <EmptyState
                icon={LineChart}
                title="No tickers match your filters"
                description="Adjust the search or momentum filter to return to the mock market universe."
              />
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 text-left">Company</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">1D</th>
                    <th className="px-4 py-3 text-right">1M</th>
                    <th className="px-4 py-3 text-right">1Y</th>
                    <th className="px-4 py-3 text-right">Drawdown</th>
                    <th className="px-4 py-3 text-right">Market Cap</th>
                    <th className="px-4 py-3 text-right">Momentum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filtered.map(({ market, company }) => (
                    <tr key={market.ticker} className="hover:bg-muted/30">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted text-xs font-bold text-muted-foreground">
                            {market.ticker.slice(0, 2)}
                          </div>
                          <div>
                            <Link
                              href={`/dashboard/company/${market.companyId}`}
                              className="font-semibold hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              {market.companyName}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {market.exchange} · {company?.sector ?? "Company"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-medium tabular-nums">
                        {formatCurrency(market.metrics.latestPrice)}
                      </td>
                      <td className={cn("px-4 py-3.5 text-right font-medium tabular-nums", changeColor(market.metrics.changePercent))}>
                        {formatPercent(market.metrics.changePercent)}
                      </td>
                      <td className={cn("px-4 py-3.5 text-right font-medium tabular-nums", changeColor(market.metrics.performance.oneMonth))}>
                        {formatPercent(market.metrics.performance.oneMonth)}
                      </td>
                      <td className={cn("px-4 py-3.5 text-right font-medium tabular-nums", changeColor(market.metrics.performance.oneYear))}>
                        {formatPercent(market.metrics.performance.oneYear)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-medium tabular-nums text-muted-foreground">
                        {formatPercent(market.metrics.drawdown)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-medium tabular-nums">
                        {formatMarketCap(market.metrics.marketCap)}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className={cn("font-bold tabular-nums", scoreColor(market.marketMomentum.score))}>
                          {market.marketMomentum.score}
                        </span>
                        <p className="text-[11px] text-muted-foreground">{market.marketMomentum.label}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Momentum Drivers</CardTitle>
              <CardDescription>Top mock reasons generated by deterministic market rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filtered.slice(0, 4).map(({ market }) => (
                <div key={market.ticker} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <p className="font-semibold">{market.ticker}</p>
                    </div>
                    <Badge variant="outline">{market.marketMomentum.label}</Badge>
                  </div>
                  <div className="mt-3 space-y-2">
                    {market.marketMomentum.drivers.slice(0, 2).map((driver) => (
                      <div key={driver.name} className="flex items-start gap-2 text-xs leading-relaxed">
                        {driver.direction === "positive" ? (
                          <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        ) : driver.direction === "negative" ? (
                          <TrendingDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
                        ) : (
                          <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        )}
                        <span className="text-muted-foreground">{driver.explanation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Market Data Limits</CardTitle>
              <CardDescription>Provider-ready mock scaffold only.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>No real-time, delayed, paid, scraped, or provider data is used.</p>
              <p>Momentum scores are monitoring signals, not valuation opinions or investment recommendations.</p>
              <div className="flex items-center gap-2 pt-2 text-xs">
                <BarChart3 className="h-3.5 w-3.5" />
                Mock as of 2026-07-03 21:00 UTC
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageShell>
  );
}
