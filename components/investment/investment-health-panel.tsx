import { BrainCircuit, Gauge, Info, ShieldAlert, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { InvestmentHealthResult } from "@/types/investment";

interface ScoreTileProps {
  label: string;
  score: number;
  detail: string;
  tone?: "good" | "warning" | "bad" | "neutral";
}

function toneClass(tone: ScoreTileProps["tone"]) {
  if (tone === "good") return "text-emerald-600 dark:text-emerald-400";
  if (tone === "warning") return "text-amber-600 dark:text-amber-400";
  if (tone === "bad") return "text-red-600 dark:text-red-400";
  return "text-foreground";
}

function scoreTone(score: number) {
  if (score >= 70) return "good";
  if (score >= 45) return "warning";
  return "bad";
}

function ScoreTile({ label, score, detail, tone = scoreTone(score) }: ScoreTileProps) {
  return (
    <div className="rounded-lg border bg-background/60 p-3">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-2 text-2xl font-bold tabular-nums", toneClass(tone))}>{score}</p>
      <p className="mt-1 text-xs leading-snug text-muted-foreground">{detail}</p>
    </div>
  );
}

export function InvestmentHealthPanel({
  financialHealthScore,
  riskScore,
  marketMomentumScore,
  newsSentimentScore,
  investmentHealth,
}: {
  financialHealthScore: number;
  riskScore: number;
  marketMomentumScore: number;
  newsSentimentScore: number;
  investmentHealth: InvestmentHealthResult;
}) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="pt-4">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Investment Health Overview</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Composite research signal from financial health, risk, market, news, and valuation inputs
            </p>
          </div>
          <div className="rounded-lg border bg-background/70 px-3 py-2 text-right">
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Composite
            </p>
            <p className="text-2xl font-bold tabular-nums text-foreground">{investmentHealth.score}</p>
            <p className="text-xs text-muted-foreground">{investmentHealth.label}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <ScoreTile
            label="Financial Health"
            score={financialHealthScore}
            detail="Current proxy from deterministic financial model"
          />
          <ScoreTile
            label="Risk Score"
            score={riskScore}
            detail="Lower is better"
            tone={riskScore <= 30 ? "good" : riskScore <= 60 ? "warning" : "bad"}
          />
          <ScoreTile
            label="Investment Health"
            score={investmentHealth.score}
            detail={investmentHealth.label}
          />
          <ScoreTile
            label="Market Momentum"
            score={marketMomentumScore}
            detail="Mock price and volume signal"
          />
          <ScoreTile
            label="News Sentiment"
            score={newsSentimentScore}
            detail="Mock event and sentiment signal"
          />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-lg border bg-background/60 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">Summary</p>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{investmentHealth.summary}</p>
          </div>
          <div className="rounded-lg border bg-background/60 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">Key drivers</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {investmentHealth.drivers.slice(0, 4).map((driver) => {
                const Icon =
                  driver.direction === "positive"
                    ? TrendingUp
                    : driver.direction === "negative"
                    ? ShieldAlert
                    : Info;

                return (
                  <div key={driver.name} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
                    <Icon
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
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
