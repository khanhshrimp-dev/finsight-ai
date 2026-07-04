"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CalendarDays,
  Newspaper,
  Search,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { InsightStatCard } from "@/components/ui/insight-stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  companyIntelligence,
  newsIntelligenceUniverse,
} from "@/lib/mock/company-intelligence";
import type { NewsEventType, NewsSentiment, NewsSeverity } from "@/types/news";
import { cn } from "@/lib/utils";

type SentimentFilter = "all" | NewsSentiment;
type SeverityFilter = "all" | NewsSeverity;
type EventFilter = "all" | NewsEventType;

const eventTypes: NewsEventType[] = [
  "earnings",
  "guidance",
  "debt",
  "accounting_issue",
  "management_change",
  "product",
  "restructuring",
  "analyst_rating",
  "macro",
  "other",
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function sentimentClass(sentiment: NewsSentiment) {
  if (sentiment === "positive") return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  if (sentiment === "negative") return "bg-red-500/10 text-red-600 dark:text-red-400";
  return "bg-muted text-muted-foreground";
}

function severityClass(severity: NewsSeverity) {
  if (severity === "critical") return "bg-red-500/10 text-red-600 dark:text-red-400";
  if (severity === "high") return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
  if (severity === "medium") return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  return "bg-muted text-muted-foreground";
}

function scoreColor(score: number) {
  if (score >= 65) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 45) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export default function NewsDashboardPage() {
  const [query, setQuery] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>("all");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [eventFilter, setEventFilter] = useState<EventFilter>("all");

  const items = useMemo(
    () =>
      newsIntelligenceUniverse.flatMap((entry) =>
        entry.items.map((item) => ({
          ...item,
          companyName: entry.companyName,
          companyScore: entry.sentiment.score,
          companyLabel: entry.sentiment.label,
          companySector: companyIntelligence.find((company) => company.company.id === entry.companyId)?.company.sector,
        }))
      ),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((item) => {
        const matchesQuery =
          q.length === 0 ||
          item.title.toLowerCase().includes(q) ||
          item.companyName.toLowerCase().includes(q) ||
          item.ticker.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.companySector?.toLowerCase().includes(q);
        const matchesSentiment = sentimentFilter === "all" || item.sentiment === sentimentFilter;
        const matchesSeverity = severityFilter === "all" || item.severity === severityFilter;
        const matchesEvent = eventFilter === "all" || item.eventType === eventFilter;
        return matchesQuery && matchesSentiment && matchesSeverity && matchesEvent;
      })
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [eventFilter, items, query, sentimentFilter, severityFilter]);

  const negativeCount = items.filter((item) => item.sentiment === "negative").length;
  const highSeverityCount = items.filter((item) => item.severity === "high" || item.severity === "critical").length;
  const positiveCount = items.filter((item) => item.sentiment === "positive").length;
  const averageSentiment = Math.round(
    newsIntelligenceUniverse.reduce((sum, entry) => sum + entry.sentiment.score, 0) /
      newsIntelligenceUniverse.length
  );
  const watchlistCompanies = newsIntelligenceUniverse
    .filter((entry) => entry.sentiment.score < 45 || entry.sentiment.highSeverityEvents > 0)
    .sort((a, b) => a.sentiment.score - b.sentiment.score);

  return (
    <DashboardPageShell maxWidth="wide">
      <PageHeader
        eyebrow="News Module"
        title="News Intelligence"
        description="Mock company news, event classification, severity scoring, and sentiment signals."
        icon={Newspaper}
        iconClassName="text-cyan-600 dark:text-cyan-400"
        actions={
        <Link
          href="/dashboard/copilot"
          className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
        >
          Ask Copilot
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InsightStatCard
          title="Average Sentiment"
          value={averageSentiment}
          description="Across mock company streams"
          icon={Sparkles}
          tone={averageSentiment >= 65 ? "good" : averageSentiment >= 45 ? "watch" : "bad"}
        />
        <InsightStatCard
          title="Negative Events"
          value={negativeCount}
          description="Classified adverse items"
          icon={ShieldAlert}
          tone={negativeCount > 0 ? "bad" : "good"}
        />
        <InsightStatCard
          title="High Severity"
          value={highSeverityCount}
          description="High or critical events"
          icon={AlertTriangle}
          tone={highSeverityCount > 0 ? "watch" : "good"}
        />
        <InsightStatCard
          title="Positive Events"
          value={positiveCount}
          description="Constructive mock catalysts"
          icon={Newspaper}
          tone="good"
        />
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 px-4 py-3">
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search news, company, ticker, sector"
              className="h-8 pl-8"
              aria-label="Search news intelligence"
            />
          </div>
          <select
            value={sentimentFilter}
            onChange={(event) => setSentimentFilter(event.target.value as SentimentFilter)}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30"
            aria-label="Filter by sentiment"
          >
            <option value="all">All Sentiment</option>
            <option value="positive" className="bg-background">Positive</option>
            <option value="neutral" className="bg-background">Neutral</option>
            <option value="negative" className="bg-background">Negative</option>
          </select>
          <select
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value as SeverityFilter)}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30"
            aria-label="Filter by severity"
          >
            <option value="all">All Severity</option>
            <option value="critical" className="bg-background">Critical</option>
            <option value="high" className="bg-background">High</option>
            <option value="medium" className="bg-background">Medium</option>
            <option value="low" className="bg-background">Low</option>
          </select>
          <select
            value={eventFilter}
            onChange={(event) => setEventFilter(event.target.value as EventFilter)}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30"
            aria-label="Filter by event type"
          >
            <option value="all">All Events</option>
            {eventTypes.map((eventType) => (
              <option key={eventType} value={eventType} className="bg-background">
                {eventType.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} of {items.length} items
          </span>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
        <Card>
          <CardHeader className="border-b pb-3">
            <CardTitle>Event Feed</CardTitle>
            <CardDescription>Classified mock news events with sentiment and risk impact.</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border/60 p-0">
            {filtered.length === 0 ? (
              <EmptyState
                icon={Newspaper}
                title="No news events match your filters"
                description="Adjust the search, sentiment, severity, or event filter to return to the mock event feed."
              />
            ) : filtered.map((item) => (
              <article key={item.id} className="p-4 hover:bg-muted/30">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge className={sentimentClass(item.sentiment)}>{item.sentiment}</Badge>
                      <Badge className={severityClass(item.severity)}>{item.severity}</Badge>
                      <Badge variant="outline">{item.eventType.replaceAll("_", " ")}</Badge>
                    </div>
                    <h2 className="text-base font-semibold leading-snug">{item.title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <Link
                        href={`/dashboard/company/${item.companyId}`}
                        className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        <Building2 className="h-3.5 w-3.5" />
                        {item.companyName}
                      </Link>
                      <span className="font-mono">{item.ticker}</span>
                      <span>{item.source}</span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-[140px] rounded-lg border bg-card p-3 text-sm">
                    <p className="text-xs text-muted-foreground">Company news score</p>
                    <p className={cn("text-2xl font-bold tabular-nums", scoreColor(item.companyScore))}>
                      {item.companyScore}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.companyLabel}</p>
                  </div>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>News Watchlist</CardTitle>
              <CardDescription>Companies with weak sentiment or severe recent events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {watchlistCompanies.map((entry) => (
                <Link
                  key={entry.ticker}
                  href={`/dashboard/company/${entry.companyId}`}
                  className="block rounded-lg border p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{entry.companyName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{entry.ticker}</p>
                    </div>
                    <p className={cn("text-lg font-bold tabular-nums", scoreColor(entry.sentiment.score))}>
                      {entry.sentiment.score}
                    </p>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {entry.sentiment.aiSummary}
                  </p>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Classification Notes</CardTitle>
              <CardDescription>Mock-only news intelligence rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p>High-severity accounting, debt, or fraud-style events reduce the news sentiment score.</p>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <p>Constructive guidance, product, and cash-flow events can improve the research signal.</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <p>No scraping, live feeds, provider calls, or investment recommendations are used here.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageShell>
  );
}
