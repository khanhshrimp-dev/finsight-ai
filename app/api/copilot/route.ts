import { NextRequest, NextResponse } from "next/server";
import { mockCompanies } from "@/lib/mock";
import type { CopilotResponse } from "@/types";

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

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
            `Obtain explanation for ${company.name}&apos;s gross margin trajectory vs. disclosed pricing changes`,
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
                `${m.name}: Company at ${m.company.toFixed(2)} vs. industry avg ${m.industryAverage.toFixed(2)} (${m.percentileRank}th percentile)`
            )
        : [
            "Return on equity above industry median indicates superior capital efficiency",
            "Working capital management outperforms sector peers",
            "Cost of goods sold ratio below industry average suggests operational leverage",
          ],
      recommended_actions: company
        ? [
            "Analyze top-quartile performers in the peer group for operational best practices",
            "Model sensitivity of key ratios to macroeconomic scenarios",
            `Develop ${company.name} specific KPIs beyond industry benchmarks`,
            "Establish quarterly peer comparison reporting cadence",
          ]
        : [
            "Identify industry-specific KPIs beyond generic financial ratios",
            "Weight peer comparisons by company size and business model similarity",
            "Monitor peer performance dispersion to identify emerging industry trends",
          ],
      confidence: company ? 78 : 75,
      disclaimer:
        "Benchmarking analysis is based on available peer data and may not reflect all relevant competitive factors. Industry classifications and peer groups are subject to change based on evolving business models.",
    };
  }

  // ── Default response ─────────────────────────────────────────────────────
  return {
    summary: company
      ? `${companyName} is a ${company.sector} company with ${company.employees.toLocaleString()} employees, founded in ${company.founded}. The company currently has a risk score of ${company.riskScore}/100 (${company.riskTier} tier) and fraud risk rated as ${company.fraudRisk}.`
      : "FinSight AI provides comprehensive financial risk analysis, fraud detection, and peer benchmarking for companies across various sectors. Ask me about specific companies, risk analysis, fraud signals, or comparative performance.",
    key_risks: company
      ? company.riskDrivers
          .filter((d) => d.direction === "negative")
          .slice(0, 3)
          .map((d) => `${d.factor}: ${d.description}`)
      : [
          "Market volatility may impact revenue stability",
          "Regulatory changes could affect operating costs",
          "Competition intensity varies by industry sector",
        ],
    key_strengths: company
      ? company.riskDrivers
          .filter((d) => d.direction === "positive")
          .slice(0, 3)
          .map((d) => `${d.factor}: ${d.description}`)
      : [
          "Diversified revenue streams reduce concentration risk",
          "Strong balance sheet provides financial flexibility",
          "Experienced management team with industry expertise",
        ],
    recommended_actions: company
      ? company.recommendations.slice(0, 3).map((r) => `[${r.priority.toUpperCase()}] ${r.title}`)
      : [
          "Regular financial statement analysis and trend monitoring",
          "Peer benchmarking against industry competitors",
          "Fraud signal screening and red flag identification",
        ],
    confidence: company ? company.confidenceScore : 70,
    disclaimer:
      "This analysis is for informational purposes only and should not be considered as financial or investment advice. Always consult with qualified financial professionals before making business decisions.",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, companyId, sessionId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Generate mock response
    const response = getMockResponse(message, companyId || null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const copilotResponse = {
      id: generateId(),
      sessionId: sessionId || generateId(),
      message: response,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(copilotResponse);
  } catch (error) {
    console.error("Copilot API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}