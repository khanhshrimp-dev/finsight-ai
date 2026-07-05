"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot,
  BrainCircuit,
  Send,
  Plus,
  Building2,
  MessageSquare,
  Sparkles,
  ShieldAlert,
  TrendingDown,
  BarChart2,
  Activity,
  CheckCircle2,
  AlertCircle,
  User,
  FileText,
  Newspaper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { PremiumPanel } from "@/components/ui/premium-panel";
import {
  AnalystMemoCard,
  DemoDataNotice,
  MetricDeltaCard,
  SplitWorkspaceLayout,
} from "@/components/ui/premium-dashboard";
import { mockCompanies } from "@/lib/mock";
import { companyIntelligence } from "@/lib/mock/company-intelligence";
import { analyzeRisk } from "@/lib/risk";
import { generateMockRiskAnalystResponse, profileFromCompany } from "@/lib/ai/risk-analyst";
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

function getAnalystResponse(company: Company, prompt: string): CopilotResponse {
  const intelligence = companyIntelligence.find((item) => item.company.id === company.id);
  const latestPeriod = company.periods[company.periods.length - 1];
  const previousPeriod =
    company.periods.length > 1 ? company.periods[company.periods.length - 2] : null;
  const risk = analyzeRisk(latestPeriod.metrics, {
    currentPeriod: latestPeriod,
    previousPeriod,
  });
  const analyst = generateMockRiskAnalystResponse({
    companyProfile: profileFromCompany(company),
    financialMetrics: latestPeriod.metrics,
    riskScore: risk.riskScore,
    riskLabel: risk.riskLabel,
    riskDrivers: risk.drivers,
    fraudSignals: risk.fraudSignals,
    benchmarkData: company.benchmarkData,
    financialHealthScore: intelligence?.financialHealthScore,
    marketMomentumScore: intelligence?.marketMomentumScore,
    newsSentimentScore: intelligence?.newsSentimentScore,
    investmentHealthScore: intelligence?.investmentHealth.score,
    investmentHealthLabel: intelligence?.investmentHealth.label,
    recentEvents: intelligence?.news?.items.slice(0, 3).map((event) => ({
      title: event.title,
      eventType: event.eventType,
      sentiment: event.sentiment,
      severity: event.severity,
      riskImpact: event.riskImpact,
    })),
    scenarioSummary: prompt.toLowerCase().includes("scenario")
      ? "Copilot prompt requested scenario-oriented interpretation."
      : undefined,
  });

  return {
    summary: analyst.executiveSummary,
    key_risks: analyst.keyRisks,
    key_strengths: analyst.positiveSignals,
    recommended_actions: analyst.recommendedActions,
    confidence: company.confidenceScore,
    disclaimer: analyst.professionalDisclaimer,
  };
}

// ─── Mock response engine ─────────────────────────────────────────────────────

function getMockResponse(prompt: string, companyId: string | null): CopilotResponse {
  const lower = prompt.toLowerCase();
  const company = companyId ? mockCompanies.find((c) => c.id === companyId) ?? null : null;
  const companyName = company?.name ?? "the selected company";
  const latestPeriod = company?.periods[company.periods.length - 1] ?? null;
  const latestMetrics = latestPeriod?.metrics ?? null;
  if (
    lower.includes("investment") ||
    lower.includes("market") ||
    lower.includes("news") ||
    lower.includes("price")
  ) {
    if (company) {
      const response = getAnalystResponse(company, prompt);
      return {
        ...response,
        recommended_actions: [
          "Review the Investment Health components before drawing any research conclusion.",
          "Compare market momentum against financial-health and risk-score movement.",
          "Read recent negative and high-severity news items for context.",
          "Use the Compare page to benchmark this company against peers.",
        ],
      };
    }

    return {
      summary:
        "Market, news, and investment-health analysis is available after selecting a company. The mock system combines financial health, deterministic risk, market momentum, news sentiment, and a valuation placeholder into a research signal only.",
      key_risks: [
        "Market momentum can conflict with underlying financial health.",
        "Negative news or high-severity events can reduce the composite research signal.",
        "The valuation component is a placeholder until real valuation data is added.",
      ],
      key_strengths: [
        "Scores are separated by source so users can see whether financials, market data, or news is driving the signal.",
        "Recent events are classified by type, severity, sentiment, and risk impact.",
        "No live provider calls or investment recommendations are made.",
      ],
      recommended_actions: [
        "Select a company context for a score-specific explanation.",
        "Open Market Intelligence to review price trend and volume behavior.",
        "Open News Intelligence to review recent classified events.",
      ],
      confidence: 72,
      disclaimer:
        "Investment Health is a mock research and monitoring signal only. It is not investment advice, a buy/sell/hold recommendation, a valuation opinion, or a credit rating.",
    };
  }

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
    if (company) return getAnalystResponse(company, prompt);

    return {
      summary:
        "Financial distress analysis evaluates liquidity runway, debt service capacity, profitability, cash conversion, and accounting red flags. Select a company to generate an analyst summary from the deterministic model output.",
      key_risks: [
        "Current ratio below 1.0x suggests inability to meet near-term obligations from current assets",
        "Interest coverage below 1.5x limits debt service capacity and covenant headroom",
        "Negative free cash flow constrains operational flexibility and debt reduction capacity",
      ],
      key_strengths: [
        "Asset-backed collateral may support secured lending even in distress scenarios",
        "Trend analysis can identify improving risk before the absolute score fully normalizes",
        "Scenario testing helps separate temporary stress from structural impairment",
      ],
      recommended_actions: [
        "Select a company context for model-backed risk drivers.",
        "Model base, stress, and recovery scenarios to quantify score sensitivity.",
        "Review debt agreements for covenant, maturity, and cross-default risk.",
      ],
      confidence: 74,
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
    if (company) return getAnalystResponse(company, prompt);

    return {
      summary:
        "A comprehensive financial health summary evaluates liquidity, solvency, profitability, cash flow, and growth trajectory. Select a company to generate a model-backed analyst memo.",
      key_risks: [
        "Liquidity: current ratio below monitoring thresholds can signal working capital compression",
        "Leverage: high debt-to-equity limits financial flexibility",
        "Profitability: net margin compression can weaken debt service capacity",
        "Growth: revenue growth without cash conversion can indicate earnings quality risk",
      ],
      key_strengths: [
        "Strong operating cash flow generation relative to reported net income",
        "Conservative leverage and healthy interest coverage",
        "Stable margins and working capital discipline",
      ],
      recommended_actions: [
        "Select a company context for tailored analysis.",
        "Review the latest period metrics and generated accounting red flags.",
        "Use the Scenario Simulator to test management actions.",
      ],
      confidence: 78,
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
  if (company) return getAnalystResponse(company, prompt);

  return {
    summary:
      "FinSight Copilot provides AI-assisted financial analysis across risk assessment, fraud screening, peer benchmarking, and scenario interpretation. Select a company from the context panel for model-backed insights.",
    key_risks: [
      "Conduct liquidity stress testing before extending credit or making an investment decision",
      "Review leverage trajectory and debt service coverage trends",
      "Verify auditor independence and examine any going-concern disclosures",
    ],
    key_strengths: [
      "Structured financial analysis reduces ad hoc judgment in high-stakes decisions",
      "Quantitative screening identifies outliers that qualitative review may miss",
      "Consistent methodology enables comparison across portfolio companies",
    ],
    recommended_actions: [
      "Select a company from the context panel for tailored analysis",
      "Ask about fraud signals, distress indicators, or peer benchmarks for specific insights",
      "Use the Scenario Simulator to test key management actions",
      "Generate a report once the report export layer is connected",
    ],
    confidence: 70,
    disclaimer:
      "This is mock analyst output generated from local deterministic demo data. It does not constitute investment advice, a credit rating, an audit opinion, or a professional financial opinion.",
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
  { label: "How does recent news affect investment health?", icon: Sparkles },
  { label: "Explain market momentum and price drawdown", icon: TrendingDown },
  { label: "How does this compare to peers?", icon: BarChart2 },
  { label: "What is the Altman Z-Score?", icon: TrendingDown },
  { label: "Explain the key risk drivers", icon: AlertCircle },
  { label: "Generate an audit-style risk memo", icon: CheckCircle2 },
];

const PROMPT_GROUPS = [
  {
    label: "Financial health",
    icon: Activity,
    prompts: ["Summarize financial health", "Explain liquidity and margin pressure"],
  },
  {
    label: "Risk analysis",
    icon: ShieldAlert,
    prompts: ["Explain the key risk drivers", "What are the top fraud warning signs?"],
  },
  {
    label: "Market context",
    icon: TrendingDown,
    prompts: ["Explain market momentum and price drawdown", "Where does market signal conflict with financials?"],
  },
  {
    label: "News impact",
    icon: Newspaper,
    prompts: ["How does recent news affect investment health?", "Which events require review?"],
  },
  {
    label: "Investment health",
    icon: Sparkles,
    prompts: ["Break down investment health score", "What weakens the composite research signal?"],
  },
  {
    label: "Scenario explanation",
    icon: BrainCircuit,
    prompts: ["Explain a downside scenario", "Which assumption changes move risk most?"],
  },
  {
    label: "Report drafting",
    icon: FileText,
    prompts: ["Draft an executive risk memo", "Generate an audit-style risk memo"],
  },
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
              I&apos;m your mock AI analyst workspace. I explain financial model and rule outputs; I do not independently create numerical risk scores.
            </p>
          </div>
          <div className="grid gap-2 px-4 py-3 sm:grid-cols-2">
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
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedCompany: Company | undefined = mockCompanies.find(
    (c) => c.id === selectedCompanyId
  );
  const selectedIntelligence = selectedCompany
    ? companyIntelligence.find((item) => item.company.id === selectedCompany.id) ?? null
    : null;

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
    <DashboardPageShell maxWidth="full" className="space-y-5">
      <PageHeader
        eyebrow="AI Analyst Workspace"
        title="FinSight Copilot"
        description="Ask structured questions about financial health, risk, market context, news impact, scenario movement, and report drafting."
        icon={Bot}
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleNewConversation}>
            <Plus className="h-4 w-4" />
            New conversation
          </Button>
        }
      />

      <DemoDataNotice
        icon={Sparkles}
        title="AI explains model and rule outputs"
        description="Copilot uses local mock analyst responses over deterministic financial, risk, market, news, and investment-health signals. It does not independently create numerical scores or provide financial advice."
      />

      <SplitWorkspaceLayout
        left={
          <>
            <PremiumPanel className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Company context</p>
              </div>
              <select
                value={selectedCompanyId}
                onChange={(event) => setSelectedCompanyId(event.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                aria-label="Select company context"
              >
                <option value="">No company selected</option>
                {mockCompanies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              {selectedCompany ? (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{selectedCompany.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{selectedCompany.ticker}</p>
                    </div>
                    <RiskBadge tier={selectedCompany.riskTier} size="sm" />
                  </div>
                  <MetricDeltaCard
                    label="Risk score"
                    value={`${selectedCompany.riskScore}/100`}
                    detail={`${selectedCompany.confidenceScore}% confidence in mock profile`}
                    tone={selectedCompany.riskScore >= 70 ? "bad" : selectedCompany.riskScore >= 50 ? "watch" : "good"}
                  />
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Select a company to anchor answers to financial, market, news, and investment-health context.
                </p>
              )}
            </PremiumPanel>

            <PremiumPanel className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Prompt library</p>
              </div>
              <div className="space-y-4">
                {PROMPT_GROUPS.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.label}>
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        <Icon className="h-3.5 w-3.5" />
                        {group.label}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {group.prompts.map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => sendMessage(prompt)}
                            className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </PremiumPanel>

            <PremiumPanel className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Recent analysis prompts</p>
              </div>
              <div className="space-y-2">
                {mockSessions.map((session) => (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => handleLoadSession(session)}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2.5 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      activeSessionId === session.id ? "border-primary/40 bg-primary/10" : "border-border/70 bg-background/70"
                    )}
                  >
                    <p className="truncate text-xs font-medium">{session.title}</p>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-muted-foreground">
                      {session.preview}
                    </p>
                    <p className="mt-2 text-[10px] text-muted-foreground">
                      {formatSessionDate(session.date)}
                    </p>
                  </button>
                ))}
              </div>
            </PremiumPanel>
          </>
        }
        center={
          <PremiumPanel className="flex min-h-[720px] flex-col overflow-hidden p-0">
            <div className="flex shrink-0 flex-col gap-3 border-b border-border/70 bg-background/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {selectedCompany ? `${selectedCompany.name} analysis` : "General analyst workspace"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Structured response cards with summary, signals, next steps, and disclaimer.
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="w-fit">
                Mock AI output
              </Badge>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin sm:px-5">
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

            {messages.length === 0 && !isLoading && (
              <div className="shrink-0 border-t border-border/70 bg-background/50 px-4 py-3 sm:px-5">
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.slice(0, 5).map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => sendMessage(label)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon className="h-3 w-3 text-primary" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="shrink-0 border-t border-border/70 bg-background/80 px-4 py-3 sm:px-5">
              <div className="flex items-end gap-3">
                <div className="relative flex-1">
                  <Textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      selectedCompany
                        ? `Ask about ${selectedCompany.name}...`
                        : "Ask about financial health, risk signals, market context, or report drafting..."
                    }
                    className="max-h-36 min-h-[48px] resize-none py-3 pr-3 text-sm"
                    rows={1}
                    disabled={isLoading}
                    aria-label="Copilot message"
                  />
                </div>
                <Button
                  onClick={() => sendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="h-12 w-12 shrink-0 rounded-lg"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Press <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">Command</kbd>
                {" + "}
                <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">Enter</kbd>
                {" to send"}
              </p>
            </div>
          </PremiumPanel>
        }
        right={
          selectedCompany && selectedIntelligence ? (
            <>
              <PremiumPanel className="p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Active context</p>
                    <p className="font-mono text-xs text-muted-foreground">{selectedCompany.ticker}</p>
                  </div>
                  <RiskBadge tier={selectedCompany.riskTier} size="sm" />
                </div>
                <div className="grid gap-3">
                  <MetricDeltaCard
                    label="Financial Health"
                    value={`${selectedIntelligence.financialHealthScore}/100`}
                    detail="Model-owned mock score"
                    tone={selectedIntelligence.financialHealthScore >= 70 ? "good" : selectedIntelligence.financialHealthScore >= 50 ? "watch" : "bad"}
                  />
                  <MetricDeltaCard
                    label="Investment Health"
                    value={`${selectedIntelligence.investmentHealth.score}/100`}
                    detail={selectedIntelligence.investmentHealth.label}
                    tone="accent"
                  />
                  <MetricDeltaCard
                    label="Market Momentum"
                    value={`${selectedIntelligence.marketMomentumScore}/100`}
                    detail="Mock market context"
                    tone={selectedIntelligence.marketMomentumScore >= 60 ? "good" : selectedIntelligence.marketMomentumScore >= 45 ? "watch" : "bad"}
                  />
                  <MetricDeltaCard
                    label="News Sentiment"
                    value={`${selectedIntelligence.newsSentimentScore}/100`}
                    detail={`${selectedIntelligence.negativeNewsCount} negative event(s)`}
                    tone={selectedIntelligence.newsSentimentScore >= 60 ? "good" : selectedIntelligence.newsSentimentScore >= 45 ? "watch" : "bad"}
                  />
                </div>
              </PremiumPanel>

              <AnalystMemoCard
                icon={BrainCircuit}
                eyebrow="Context memo"
                title="Signals to review"
                summary={`${selectedCompany.name} combines financial, market, news, and investment-health signals into a mock analyst context for Copilot responses.`}
                bullets={selectedIntelligence.summarySignals.slice(0, 4).map((signal) => `${signal.label}: ${signal.value}`)}
                disclaimer="Research and demonstration purposes only. No buy, sell, hold, audit, credit-rating, or fraud conclusion is produced."
              />
            </>
          ) : (
            <AnalystMemoCard
              icon={BrainCircuit}
              eyebrow="No company selected"
              title="Use general analyst mode"
              summary="Copilot can answer general questions, but company-specific score, market, news, and alert context appears after a company is selected."
              bullets={[
                "Select a company to ground responses in local mock data.",
                "Use prompt groups for financial, risk, market, news, scenario, or report tasks.",
                "Review all generated language before using it in a memo.",
              ]}
              disclaimer="All responses are generated from local mock logic for demonstration only."
            />
          )
        }
      />
    </DashboardPageShell>
  );
}
