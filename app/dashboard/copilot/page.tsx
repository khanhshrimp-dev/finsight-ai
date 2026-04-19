"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot,
  Send,
  Plus,
  Building2,
  ChevronDown,
  MessageSquare,
  Sparkles,
  ShieldAlert,
  TrendingDown,
  BarChart2,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RiskBadge } from "@/components/ui/risk-badge";
import { mockCompanies } from "@/lib/mock";
import type { CopilotMessage, CopilotResponse, Company } from "@/types";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatSessionDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const riskDotColor: Record<string, string> = {
  healthy: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

// ─── Mock response engine ─────────────────────────────────────────────────────

function getMockResponse(prompt: string, companyId: string | null): CopilotResponse {
  const lower = prompt.toLowerCase();
  const company = companyId ? mockCompanies.find((c) => c.id === companyId) ?? null : null;
  const companyName = company?.name ?? "the selected company";
  const latestPeriod = company?.periods[company.periods.length - 1] ?? null;
  const latestMetrics = latestPeriod?.metrics ?? null;

  // ── Fraud / signals ──────────────────────────────────────────────────────
  if (lower.includes("fraud") || lower.includes("signal")) {
    const detectedSignals = company?.fraudSignals.filter((s) => s.detected) ?? [];
    return {
      summary: company
        ? `Fraud screening analysis for ${companyName} has identified ${detectedSignals.length} active signal(s) across revenue quality, receivables behavior, and margin integrity. The overall fraud risk is rated ${company.fraudRisk.toUpperCase()}, placing ${companyName} in the ${company.fraudRisk === "high" ? "top concern" : "moderate watch"} category within the FinSight surveillance framework.`
        : "Fraud signal analysis examines revenue-cash flow divergence, receivables anomalies, margin irregularities, and accrual quality. FinSight screens for Beneish M-Score components and Bennett-model indicators across all covered companies.",
      key_risks: company
        ? [
            ...detectedSignals.map(
              (s) =>
                `${s.name} (${s.severity.toUpperCase()}): ${s.description}`
            ),
            detectedSignals.length === 0
              ? "No active fraud signals detected — continue monitoring quarterly"
              : `${detectedSignals.length} of ${company.fraudSignals.length} fraud screens triggered`,
          ].filter(Boolean)
        : [
            "Revenue-cash flow divergence: reported earnings materially exceed operating cash flows",
            "Receivables growth anomaly: AR expanding faster than revenue — potential channel stuffing",
            "Margin irregularity: unexplained gross margin expansion without product-mix disclosure",
            "Accruals quality: high accrual ratio suggests earnings may include non-cash components",
          ],
      key_strengths: company
        ? [
            company.fraudRisk === "none" || company.fraudRisk === "low"
              ? "Low fraud signal count — financials appear internally consistent"
              : "Balance sheet leverage remains relatively controlled despite earnings anomalies",
            latestMetrics
              ? `Current ratio of ${latestMetrics.currentRatio.toFixed(2)}x provides some near-term buffer`
              : "Reported equity cushion limits immediate balance-sheet risk",
            company.fraudRisk !== "high"
              ? "Cash balances reported at adequate operating levels"
              : "Management has not yet been subject to regulatory investigation",
          ]
        : [
            "Clean audit opinion reduces risk of material misstatement in aggregate",
            "Moderate leverage limits downside in a restatement scenario",
            "Institutional ownership provides governance oversight incentive",
          ],
      recommended_actions: company
        ? [
            "Request detailed accounts receivable aging schedule from management",
            "Cross-reference operating cash flow against reported net income using indirect method reconciliation",
            `Obtain explanation for ${company.name}'s gross margin trajectory vs. disclosed pricing changes`,
            "Engage independent auditor to perform targeted revenue recognition procedures",
            "Monitor DSO trend quarter-over-quarter; flag if >15% above prior period",
          ]
        : [
            "Run full Beneish M-Score model to quantify earnings manipulation probability",
            "Request auditor-prepared cash flow reconciliation before credit decision",
            "Analyze top-10 customer concentration and payment terms",
            "Review board audit committee composition for independence",
          ],
      confidence: company ? (company.fraudRisk === "high" ? 88 : 76) : 72,
      disclaimer:
        "Fraud signals are quantitative indicators only. A positive flag does not confirm wrongdoing. All findings should be reviewed by qualified forensic accounting professionals before any action.",
    };
  }

  // ── Distress / risk ──────────────────────────────────────────────────────
  if (lower.includes("distress") || lower.includes("risk")) {
    return {
      summary: company
        ? `${companyName} carries a FinSight risk score of ${company.riskScore}/100 (${company.riskTier.toUpperCase()} tier). ${company.aiSummary}`
        : "Financial distress analysis evaluates a company's probability of default, liquidity runway, and covenant compliance trajectory using a multi-factor scoring model incorporating Altman Z-Score, Ohlson O-Score, and proprietary cash flow stress tests.",
      key_risks: company
        ? company.riskDrivers
            .filter((d) => d.direction === "negative")
            .slice(0, 4)
            .map((d) => `${d.factor}: ${d.description}`)
        : [
            "Altman Z-Score below 1.81 indicates distress zone — default probability elevated over 24 months",
            "Current ratio below 1.0x suggests inability to meet near-term obligations from current assets",
            "Interest coverage below 1.5x limits debt service capacity and covenant headroom",
            "Negative free cash flow constrains operational flexibility and debt reduction capacity",
          ],
      key_strengths: company
        ? company.riskDrivers
            .filter((d) => d.direction === "positive")
            .slice(0, 3)
            .map((d) => `${d.factor}: ${d.description}`)
        : [
            "Asset-backed collateral may support secured lending even in distress scenarios",
            "Brand equity and customer relationships retain residual liquidation value",
            "Management has not yet exhausted refinancing options in current rate environment",
          ],
      recommended_actions: company
        ? company.recommendations.slice(0, 4).map((r) => `[${r.priority.toUpperCase()}] ${r.title}: ${r.description}`)
        : [
            "Model three scenarios: base, stress, and recovery — quantify cash burn in each",
            "Engage restructuring advisor to explore pre-negotiated covenant amendment",
            "Review all material debt agreements for cross-default and acceleration provisions",
            "Establish weekly cash flow monitoring cadence until risk score improves by 10+ points",
          ],
      confidence: company ? company.confidenceScore : 74,
      disclaimer:
        "Risk scores are model-derived estimates based on available financial data. They do not constitute credit ratings or investment advice. Consult qualified financial professionals before making credit or investment decisions.",
    };
  }

  // ── Benchmark / peer comparison ──────────────────────────────────────────
  if (lower.includes("compare") || lower.includes("peer") || lower.includes("benchmark")) {
    const benchmark = company?.benchmarkData ?? null;
    return {
      summary: company
        ? `Benchmarking ${companyName} against its ${benchmark?.peerGroup ?? "peer group"} reveals a mixed competitive position. ${
            latestMetrics
              ? `The company's net margin of ${(latestMetrics.netMargin * 100).toFixed(1)}% and current ratio of ${latestMetrics.currentRatio.toFixed(2)}x are being evaluated against sector peers in the ${benchmark?.sector ?? company.sector} space.`
              : ""
          }`
        : "Peer benchmarking compares a company's key financial ratios against industry averages, top-quartile performers, and peer medians. Percentile rankings identify areas of structural advantage or competitive vulnerability.",
      key_risks: company && benchmark
        ? benchmark.metrics
            .filter((m) => m.percentileRank < 35)
            .slice(0, 4)
            .map(
              (m) =>
                `${m.name}: Company at ${m.company.toFixed(2)} vs. industry avg ${m.industryAverage.toFixed(2)} (${m.percentileRank}th percentile)`
            )
        : [
            "Gross margin below industry median suggests cost structure disadvantage or pricing pressure",
            "Asset turnover below top-quartile indicates operational inefficiency vs. best-in-class peers",
            "Revenue growth below sector average risks market share erosion over 3-5 year horizon",
            "Leverage ratios above peer median increase refinancing risk in rising rate environment",
          ],
      key_strengths: company && benchmark
        ? benchmark.metrics
            .filter((m) => m.percentileRank > 60)
            .slice(0, 3)
            .map(
              (m) =>
                `${m.name}: Company at ${m.company.toFixed(2)} outperforms peer median of ${m.peerMedian.toFixed(2)} (${m.percentileRank}th percentile)`
            )
        : [
            "Interest coverage above sector average provides covenant buffer during rate volatility",
            "Cash conversion cycle competitive with top-quartile peers in working capital management",
            "Return on equity above industry median signals efficient capital deployment",
          ],
      recommended_actions: [
        "Focus margin improvement initiatives on the two metrics with lowest percentile rankings",
        "Benchmark capex intensity against top-quartile peers to identify investment efficiency gaps",
        "Monitor peer group M&A activity — consolidation could shift competitive dynamics materially",
        `Review ${company ? companyName + "'s" : "company"} pricing strategy against peer revenue growth trajectory`,
      ],
      confidence: company ? company.confidenceScore - 5 : 70,
      disclaimer:
        "Benchmarks are derived from publicly available data and may not reflect the most recent reporting periods. Industry peer selection is model-based and may not match management-defined competitive sets.",
    };
  }

  // ── Health summary ────────────────────────────────────────────────────────
  if (
    lower.includes("health") ||
    lower.includes("summarize") ||
    lower.includes("summary") ||
    lower.includes("overview")
  ) {
    return {
      summary: company
        ? `${companyName} (${company.ticker}) is classified as ${company.riskTier.toUpperCase()} with a FinSight risk score of ${company.riskScore}/100. ${company.aiSummary}`
        : "A comprehensive financial health summary evaluates liquidity, solvency, profitability, operational efficiency, and growth trajectory. FinSight synthesizes these five dimensions into a unified risk score with confidence-weighted sub-scores.",
      key_risks: company
        ? company.riskDrivers
            .filter((d) => d.direction === "negative")
            .slice(0, 4)
            .map((d) => `${d.factor} (Impact: ${(d.impact * 100).toFixed(0)}%): ${d.description}`)
        : [
            "Liquidity: current ratio trending below 1.2x — watch for working capital compression",
            "Leverage: debt-to-equity above sector median limits financial flexibility",
            "Profitability: net margin compression driven by input cost inflation",
            "Growth: revenue growth decelerating — may signal market saturation or competitive pressure",
          ],
      key_strengths: company
        ? company.riskDrivers
            .filter((d) => d.direction === "positive")
            .slice(0, 3)
            .map((d) => `${d.factor}: ${d.description}`)
        : [
            "Strong operating cash flow generation relative to reported net income",
            "Diversified revenue mix reduces single-customer concentration risk",
            "Conservative debt maturity profile with no near-term refinancing cliff",
          ],
      recommended_actions: company
        ? company.recommendations
            .slice(0, 4)
            .map((r) => `${r.title}: ${r.description}`)
        : [
            "Prioritize working capital optimization — target 10-15% reduction in cash conversion cycle",
            "Evaluate refinancing opportunity for near-term debt maturities at current spreads",
            "Develop cost reduction roadmap targeting 200-300bps margin improvement over 18 months",
            "Establish KPI dashboard tracking weekly liquidity, monthly margin, and quarterly leverage",
          ],
      confidence: company ? company.confidenceScore : 78,
      disclaimer:
        "Financial health assessments are based on reported data and model-derived estimates. They do not constitute investment advice or credit ratings. All summaries should be reviewed by qualified professionals.",
    };
  }

  // ── Altman Z-Score ────────────────────────────────────────────────────────
  if (lower.includes("altman") || lower.includes("z-score") || lower.includes("zscore")) {
    const zScore = latestMetrics?.altmanZScore ?? null;
    return {
      summary: company && zScore !== null
        ? `${companyName}'s Altman Z-Score for the most recent period is ${zScore.toFixed(2)}. ${
            zScore > 2.99
              ? "The company falls in the SAFE zone (Z > 2.99), indicating low near-term default probability."
              : zScore > 1.81
              ? "The company falls in the GREY zone (1.81 < Z < 2.99), indicating moderate uncertainty."
              : "The company falls in the DISTRESS zone (Z < 1.81), indicating elevated default probability."
          }`
        : "The Altman Z-Score is a multi-factor bankruptcy prediction model developed by Edward Altman (1968). It combines five weighted financial ratios: working capital/assets, retained earnings/assets, EBIT/assets, equity/debt, and sales/assets. Scores above 2.99 indicate financial health; below 1.81 indicates distress.",
      key_risks: [
        zScore !== null && zScore < 1.81
          ? `Z-Score of ${zScore.toFixed(2)} places ${companyName} firmly in the statistical distress zone`
          : "Z-Score below 1.81 typically precedes default events by 1-3 years in academic studies",
        "High leverage reduces the equity/debt component, compressing the Z-Score disproportionately",
        "Revenue contraction lowers the sales/assets ratio — a meaningful 1.0x weighted component",
        "Negative working capital inflates the working capital/assets penalty in the model",
      ],
      key_strengths: [
        zScore !== null && zScore > 2.99
          ? `Z-Score of ${zScore.toFixed(2)} comfortably exceeds the 2.99 safe zone threshold`
          : "Z-Score model is a starting point — not all companies below 1.81 ultimately default",
        "Model accuracy is highest for publicly traded manufacturing companies; sector adjustments matter",
        "Trend analysis (improving vs. deteriorating Z-Score) is often more predictive than absolute level",
      ],
      recommended_actions: [
        "Track Z-Score quarterly to identify directional movement — improvement trend is highly informative",
        "Decompose Z-Score into five components to identify which ratio is driving deterioration",
        "Compare against Ohlson O-Score and Zmijewski model for triangulated default probability estimate",
        "Use Z-Score alongside cash runway analysis for a complete liquidity-solvency picture",
      ],
      confidence: company ? 85 : 80,
      disclaimer:
        "The Altman Z-Score model was originally calibrated for US public manufacturing companies. Sector-adjusted variants (Z'-Score for private companies, Z''-Score for non-manufacturers) should be applied as appropriate. This does not constitute a credit opinion.",
    };
  }

  // ── Default: general financial analysis ──────────────────────────────────
  return {
    summary: company
      ? `Analyzing ${companyName} (${company.ticker}, ${company.sector}): The company currently holds a FinSight risk score of ${company.riskScore}/100 with a ${company.riskTier} classification and ${company.fraudRisk} fraud risk. ${company.aiSummary.slice(0, 200)}...`
      : "FinSight Copilot provides AI-assisted financial analysis across risk assessment, fraud detection, peer benchmarking, and distress prediction. To get company-specific insights, select a company from the context panel and ask about financial health, fraud signals, benchmark comparisons, or specific metrics.",
    key_risks: company
      ? company.riskDrivers
          .filter((d) => d.direction === "negative")
          .slice(0, 4)
          .map((d) => `${d.factor}: ${d.description}`)
      : [
          "Conduct thorough liquidity stress test before extending credit or making investment",
          "Review leverage trajectory — debt service coverage trending is often more predictive than point-in-time",
          "Assess management track record on guidance accuracy — credibility matters in high-uncertainty situations",
          "Verify auditor independence and examine any going-concern qualifications or emphasis-of-matter paragraphs",
        ],
    key_strengths: company
      ? company.riskDrivers
          .filter((d) => d.direction === "positive")
          .slice(0, 3)
          .map((d) => `${d.factor}: ${d.description}`)
      : [
          "Structured financial analysis reduces emotional bias in high-stakes decisions",
          "Quantitative screening identifies outliers that qualitative review may miss",
          "Consistent methodology enables apples-to-apples comparison across portfolio companies",
        ],
    recommended_actions: company
      ? company.recommendations.slice(0, 4).map((r) => `${r.title}: ${r.description}`)
      : [
          "Select a company from the context panel for tailored analysis",
          "Ask about fraud signals, distress indicators, or peer benchmarks for specific insights",
          "Use suggested prompts to explore standard financial analysis frameworks",
          "Generate a full report from the Reports page for a downloadable structured analysis",
        ],
    confidence: company ? company.confidenceScore : 70,
    disclaimer:
      "This analysis is generated by an AI model trained on financial data patterns. It does not constitute investment advice, a credit rating, or a professional financial opinion. Always verify findings with qualified professionals.",
  };
}

// ─── Conversation history (mock) ──────────────────────────────────────────────

interface ConversationSession {
  id: string;
  title: string;
  preview: string;
  date: string;
  companyId: string | null;
}

const mockSessions: ConversationSession[] = [
  {
    id: "s1",
    title: "Redstone Retail distress analysis",
    preview: "What is the current distress level and default probability?",
    date: "2025-02-08T14:30:00Z",
    companyId: "redstone-retail",
  },
  {
    id: "s2",
    title: "Novara BioSciences fraud review",
    preview: "Walk me through the fraud signals detected in the latest period",
    date: "2025-02-05T09:15:00Z",
    companyId: "novara-biosciences",
  },
  {
    id: "s3",
    title: "Portfolio risk summary",
    preview: "Give me a high-level risk summary across all covered companies",
    date: "2025-02-01T16:45:00Z",
    companyId: null,
  },
];

// ─── Suggested prompts ────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  { label: "Summarize financial health", icon: Activity },
  { label: "What are the top fraud warning signs?", icon: ShieldAlert },
  { label: "How does this compare to peers?", icon: BarChart2 },
  { label: "What is the Altman Z-Score?", icon: TrendingDown },
  { label: "Explain the key risk drivers", icon: AlertCircle },
  { label: "What should management prioritize?", icon: CheckCircle2 },
];

// ─── Subcomponents ────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-card px-4 py-3 ring-1 ring-foreground/8">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function UserMessageBubble({ message }: { message: CopilotMessage }) {
  return (
    <div className="flex items-end justify-end gap-3 mb-4">
      <div className="max-w-[72%]">
        <div className="rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground leading-relaxed">
          {message.content}
        </div>
        <p className="mt-1 text-right text-[11px] text-muted-foreground">
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-foreground/10">
        <User className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}

function StructuredResponseCard({ response, timestamp }: { response: CopilotResponse; timestamp: string }) {
  const confidenceColor =
    response.confidence >= 85
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : response.confidence >= 70
      ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
      : "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-500/20";

  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 mt-0.5">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0 max-w-[88%]">
        <Card className="gap-0 py-0 overflow-hidden">
          {/* Summary */}
          <div className="border-b border-foreground/8 px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                AI Analysis
              </span>
              <span
                className={cn(
                  "ml-auto inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                  confidenceColor
                )}
              >
                <CheckCircle2 className="h-3 w-3" />
                {response.confidence}% confidence
              </span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">{response.summary}</p>
          </div>

          <div className="grid grid-cols-1 divide-y divide-foreground/8 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
            {/* Key Risks */}
            <div className="px-4 py-3">
              <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                Key Risks
              </p>
              <ul className="space-y-1.5">
                {response.key_risks.map((risk, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/80 leading-snug">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Strengths */}
            <div className="px-4 py-3">
              <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-500">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Key Strengths
              </p>
              <ul className="space-y-1.5">
                {response.key_strengths.map((strength, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground/80 leading-snug">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="border-t border-foreground/8 px-4 py-3">
            <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Activity className="h-3.5 w-3.5" />
              Recommended Actions
            </p>
            <ol className="space-y-1.5 list-none">
              {response.recommended_actions.map((action, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-foreground/80 leading-snug">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  {action}
                </li>
              ))}
            </ol>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-foreground/8 bg-muted/30 px-4 py-2.5">
            <p className="text-[11px] text-muted-foreground leading-snug">
              <span className="font-medium">Disclaimer:</span> {response.disclaimer}
            </p>
          </div>
        </Card>
        <p className="mt-1 text-[11px] text-muted-foreground">{formatTimestamp(timestamp)}</p>
      </div>
    </div>
  );
}

function WelcomeMessage({ onPrompt }: { onPrompt: (p: string) => void }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
        <Bot className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0 max-w-[88%]">
        <Card className="gap-0 py-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-foreground/8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                FinSight Copilot
              </span>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              I&apos;m your AI-powered financial analysis assistant. I can help you with:
            </p>
          </div>
          <div className="px-4 py-3 grid grid-cols-2 gap-2">
            {[
              { icon: Activity, label: "Financial health summaries" },
              { icon: ShieldAlert, label: "Fraud signal detection" },
              { icon: BarChart2, label: "Peer benchmark analysis" },
              { icon: TrendingDown, label: "Distress & default risk" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-foreground/70"
              >
                <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                {label}
              </div>
            ))}
          </div>
          <div className="border-t border-foreground/8 px-4 py-3">
            <p className="text-xs text-muted-foreground mb-2.5 font-medium">Suggested prompts:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map(({ label }) => (
                <button
                  key={label}
                  onClick={() => onPrompt(label)}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground/80 hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CopilotPage() {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedCompany: Company | undefined = mockCompanies.find(
    (c) => c.id === selectedCompanyId
  );

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: CopilotMessage = {
        id: generateId(),
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
        companyContext: selectedCompanyId || undefined,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsLoading(true);

      setTimeout(() => {
        const structured = getMockResponse(trimmed, selectedCompanyId || null);
        const assistantMsg: CopilotMessage = {
          id: generateId(),
          role: "assistant",
          content: structured.summary,
          timestamp: new Date().toISOString(),
          companyContext: selectedCompanyId || undefined,
          structured,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsLoading(false);
      }, 1500);
    },
    [isLoading, selectedCompanyId]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setActiveSessionId(null);
    setInputValue("");
    textareaRef.current?.focus();
  };

  const handleLoadSession = (session: ConversationSession) => {
    setActiveSessionId(session.id);
    if (session.companyId) setSelectedCompanyId(session.companyId);
    setMessages([]);
    // Simulate loading the first message
    const userMsg: CopilotMessage = {
      id: generateId(),
      role: "user",
      content: session.preview,
      timestamp: session.date,
      companyContext: session.companyId ?? undefined,
    };
    const structured = getMockResponse(session.preview, session.companyId);
    const assistantMsg: CopilotMessage = {
      id: generateId(),
      role: "assistant",
      content: structured.summary,
      timestamp: new Date(new Date(session.date).getTime() + 2000).toISOString(),
      companyContext: session.companyId ?? undefined,
      structured,
    };
    setMessages([userMsg, assistantMsg]);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
      <aside className="w-72 shrink-0 flex flex-col border-r border-foreground/8 bg-card/40 overflow-y-auto">
        {/* Title */}
        <div className="flex items-center gap-2.5 border-b border-foreground/8 px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">FinSight Copilot</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">AI financial analyst</p>
          </div>
        </div>

        {/* Company context selector */}
        <div className="border-b border-foreground/8 px-4 py-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Company Context
          </p>
          <div className="relative">
            <button
              onClick={() => setCompanyDropdownOpen((o) => !o)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors hover:bg-muted",
                companyDropdownOpen && "border-ring ring-2 ring-ring/20"
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                {selectedCompany ? (
                  <>
                    <span
                      className={cn(
                        "h-2 w-2 shrink-0 rounded-full",
                        riskDotColor[selectedCompany.riskTier]
                      )}
                    />
                    <span className="truncate text-foreground">{selectedCompany.name}</span>
                  </>
                ) : (
                  <>
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">No company selected</span>
                  </>
                )}
              </div>
              <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform", companyDropdownOpen && "rotate-180")} />
            </button>

            {companyDropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
                <button
                  onClick={() => {
                    setSelectedCompanyId("");
                    setCompanyDropdownOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  No company selected
                </button>
                <div className="my-1 h-px bg-border" />
                {mockCompanies.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCompanyId(c.id);
                      setCompanyDropdownOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted",
                      selectedCompanyId === c.id && "bg-muted"
                    )}
                  >
                    <span
                      className={cn("h-2 w-2 shrink-0 rounded-full", riskDotColor[c.riskTier])}
                    />
                    <span className="truncate">{c.name}</span>
                    <span className="ml-auto text-[11px] text-muted-foreground shrink-0">
                      {c.ticker}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedCompany && (
            <div className="mt-2 flex items-center gap-2">
              <RiskBadge tier={selectedCompany.riskTier} size="sm" />
              <span className="text-[11px] text-muted-foreground">
                Score: {selectedCompany.riskScore}/100
              </span>
            </div>
          )}
        </div>

        {/* New conversation button */}
        <div className="px-4 py-3 border-b border-foreground/8">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={handleNewConversation}
          >
            <Plus className="h-3.5 w-3.5" />
            New conversation
          </Button>
        </div>

        {/* History */}
        <div className="flex-1 px-4 py-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Recent Sessions
          </p>
          <div className="space-y-1">
            {mockSessions.map((session) => {
              const sessionCompany = session.companyId
                ? mockCompanies.find((c) => c.id === session.companyId)
                : null;
              return (
                <button
                  key={session.id}
                  onClick={() => handleLoadSession(session)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted",
                    activeSessionId === session.id && "bg-muted"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground leading-snug truncate">
                        {session.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug line-clamp-2">
                        {session.preview}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-muted-foreground/60" />
                        <span className="text-[10px] text-muted-foreground/60">
                          {formatSessionDate(session.date)}
                        </span>
                        {sessionCompany && (
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full ml-auto",
                              riskDotColor[sessionCompany.riskTier]
                            )}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-foreground/8 bg-card/20 px-5 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">
                {selectedCompany ? selectedCompany.name : "FinSight Copilot"}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {selectedCompany
                  ? `${selectedCompany.sector} · ${selectedCompany.ticker}`
                  : "No company context selected"}
              </p>
            </div>
          </div>
          {selectedCompany && (
            <div className="flex items-center gap-2">
              <RiskBadge tier={selectedCompany.riskTier} size="sm" />
              <span className="text-xs text-muted-foreground">
                Confidence: {selectedCompany.confidenceScore}%
              </span>
            </div>
          )}
        </div>

        {/* Message area */}
        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2 scrollbar-thin">
          <WelcomeMessage onPrompt={(p) => sendMessage(p)} />

          {messages.map((msg) =>
            msg.role === "user" ? (
              <UserMessageBubble key={msg.id} message={msg} />
            ) : msg.structured ? (
              <StructuredResponseCard
                key={msg.id}
                response={msg.structured}
                timestamp={msg.timestamp}
              />
            ) : null
          )}

          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts (floating above input when no messages) */}
        {messages.length === 0 && !isLoading && (
          <div className="shrink-0 border-t border-foreground/8 bg-background/50 px-5 py-2">
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_PROMPTS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => sendMessage(label)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground/80 hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <Icon className="h-3 w-3 text-primary" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="shrink-0 border-t border-foreground/8 bg-background/80 px-5 py-3">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedCompany
                    ? `Ask about ${selectedCompany.name}...`
                    : "Ask about financial health, fraud signals, risk analysis..."
                }
                className="resize-none min-h-[44px] max-h-36 pr-3 py-2.5 text-sm"
                rows={1}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="h-[44px] w-[44px] shrink-0 rounded-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground/60 text-center">
            Press <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">⌘</kbd>
            {" + "}
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">Enter</kbd>
            {" to send"}
          </p>
        </div>
      </div>
    </div>
  );
}
