import { Activity, BarChart3, LineChart, TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CompanyMarketData, MarketPricePoint } from "@/types/market";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
}

function formatLargeNumber(value: number) {
  if (Math.abs(value) >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

function formatVolume(value: number) {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function PriceSparkline({ points }: { points: MarketPricePoint[] }) {
  const width = 640;
  const height = 160;
  const padding = 12;
  const closes = points.map((point) => point.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = Math.max(1, max - min);
  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
  const coordinates = points.map((point, index) => {
    const x = padding + index * step;
    const y = height - padding - ((point.close - min) / range) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <div className="h-[190px] rounded-lg border bg-background/50 p-3">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Mock historical price chart" className="h-full w-full text-primary">
        <polyline
          points={coordinates.join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1={padding}
          x2={width - padding}
          y1={height - padding}
          y2={height - padding}
          className="stroke-border"
          strokeWidth="2"
        />
        <circle
          cx={coordinates[coordinates.length - 1]?.split(",")[0]}
          cy={coordinates[coordinates.length - 1]?.split(",")[1]}
          r="6"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background/50 px-3 py-2.5">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}

export function MarketIntelligenceCard({ data }: { data: CompanyMarketData }) {
  const metrics = data.metrics;
  const isPositive = metrics.change >= 0;
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
  const changeColor = isPositive
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-red-600 dark:text-red-400";

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <LineChart className="h-4 w-4 text-muted-foreground" />
              <CardTitle>Market Intelligence</CardTitle>
            </div>
            <CardDescription>
              Mock share price, trend, volume, volatility, and momentum signal for {data.ticker}
            </CardDescription>
          </div>
          <div className="rounded-lg border bg-muted/40 px-3 py-2 text-right">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Market Momentum
            </p>
            <p className="text-xl font-bold tabular-nums text-foreground">
              {data.marketMomentum.score}
            </p>
            <p className="text-xs text-muted-foreground">{data.marketMomentum.label}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <div className="rounded-lg border bg-background/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Latest price
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
              {formatCurrency(metrics.latestPrice)}
            </p>
            <div className={cn("mt-2 flex items-center gap-1.5 text-sm font-semibold", changeColor)}>
              <ChangeIcon className="h-4 w-4" />
              <span>
                {isPositive ? "+" : ""}
                {formatCurrency(metrics.change)} ({isPositive ? "+" : ""}
                {metrics.changePercent.toFixed(2)}%)
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Mock data as of {new Date(data.asOf).toLocaleDateString("en-US")}
            </p>
          </div>
          <PriceSparkline points={data.historicalPrices} />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <MetricTile label="Market cap" value={formatLargeNumber(metrics.marketCap)} />
          <MetricTile label="Volume" value={formatVolume(metrics.volume)} />
          <MetricTile label="Avg volume" value={formatVolume(metrics.averageVolume)} />
          <MetricTile label="Volatility" value={`${metrics.volatility.toFixed(1)}%`} />
          <MetricTile label="52W high" value={formatCurrency(metrics.fiftyTwoWeekHigh)} />
          <MetricTile label="52W low" value={formatCurrency(metrics.fiftyTwoWeekLow)} />
          <MetricTile label="50D avg" value={formatCurrency(metrics.movingAverage50)} />
          <MetricTile label="Drawdown" value={`${metrics.drawdown.toFixed(1)}%`} />
        </div>

        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">Momentum drivers</p>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {data.marketMomentum.drivers.slice(0, 4).map((driver) => (
              <div key={driver.name} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                <BarChart3
                  className={cn(
                    "mt-0.5 h-3.5 w-3.5 shrink-0",
                    driver.direction === "positive"
                      ? "text-emerald-500"
                      : driver.direction === "negative"
                      ? "text-red-500"
                      : "text-muted-foreground"
                  )}
                />
                <span>
                  <span className="font-medium text-foreground">{driver.name}: </span>
                  {driver.explanation}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
