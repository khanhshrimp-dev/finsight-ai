import { AlertTriangle, CalendarClock, Newspaper, TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CompanyNewsData, CompanyNewsItem, NewsSeverity, NewsSentiment } from "@/types/news";

const sentimentClass: Record<NewsSentiment, string> = {
  positive: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  neutral: "border-border bg-muted text-muted-foreground",
  negative: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
};

const severityClass: Record<NewsSeverity, string> = {
  low: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  medium: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  high: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
  critical: "border-red-600/30 bg-red-600/15 text-red-800 dark:text-red-300",
};

function BadgeLike({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase", className)}>
      {children}
    </span>
  );
}

function NewsTimelineItem({ item }: { item: CompanyNewsItem }) {
  const ImpactIcon = item.riskImpact === "positive" ? TrendingUp : item.riskImpact === "negative" ? TrendingDown : CalendarClock;

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
            item.riskImpact === "positive"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
              : item.riskImpact === "negative"
              ? "border-red-500/30 bg-red-500/10 text-red-600"
              : "border-border bg-muted text-muted-foreground"
          )}
        >
          <ImpactIcon className="h-3.5 w-3.5" />
        </div>
        <div className="mt-2 w-px flex-1 bg-border/60 last:hidden" />
      </div>
      <div className="min-w-0 pb-5">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold leading-snug text-foreground">{item.title}</p>
          <span className="text-xs text-muted-foreground">
            {new Date(item.publishedAt).toLocaleDateString("en-US")}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{item.summary}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <BadgeLike className={sentimentClass[item.sentiment]}>{item.sentiment}</BadgeLike>
          <BadgeLike className={severityClass[item.severity]}>{item.severity}</BadgeLike>
          <BadgeLike className="border-border bg-background text-muted-foreground">
            {item.eventType.replace("_", " ")}
          </BadgeLike>
          <BadgeLike className="border-border bg-background text-muted-foreground">
            {item.riskImpact} impact
          </BadgeLike>
        </div>
      </div>
    </div>
  );
}

export function NewsIntelligenceCard({ data }: { data: CompanyNewsData }) {
  const sentiment = data.sentiment;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-muted-foreground" />
              <CardTitle>News Intelligence</CardTitle>
            </div>
            <CardDescription>
              Mock company news, event classification, sentiment, severity, and risk impact
            </CardDescription>
          </div>
          <div className="rounded-lg border bg-muted/40 px-3 py-2 text-right">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              News Sentiment
            </p>
            <p className="text-xl font-bold tabular-nums text-foreground">{sentiment.score}</p>
            <p className="text-xs text-muted-foreground">{sentiment.label}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-primary/5 p-4">
          <p className="text-sm leading-relaxed text-foreground">{sentiment.aiSummary}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border bg-background/50 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Positive</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
              {sentiment.sentimentCounts.positive}
            </p>
          </div>
          <div className="rounded-lg border bg-background/50 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Neutral</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-muted-foreground">
              {sentiment.sentimentCounts.neutral}
            </p>
          </div>
          <div className="rounded-lg border bg-background/50 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Negative</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-red-600 dark:text-red-400">
              {sentiment.sentimentCounts.negative}
            </p>
          </div>
          <div className="rounded-lg border bg-background/50 px-3 py-2.5">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">High severity</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-foreground">
              {sentiment.highSeverityEvents}
            </p>
          </div>
        </div>

        {sentiment.highSeverityEvents > 0 && (
          <div className="flex gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-700 dark:text-red-400">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              High-severity mock events are present. Treat the news signal as a review prompt, not a conclusion.
            </span>
          </div>
        )}

        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">Event timeline</p>
          <div>
            {data.items.map((item) => (
              <NewsTimelineItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
