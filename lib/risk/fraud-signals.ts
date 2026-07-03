import type { FinancialMetrics } from "@/types";
import type { AccountingFraudSignal, FraudSignalContext, RiskSeverity } from "./types";

function pct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function signal(
  name: string,
  severity: RiskSeverity,
  explanation: string,
  relatedMetrics: AccountingFraudSignal["relatedMetrics"],
  recommendedReviewAction: string
): AccountingFraudSignal {
  return {
    name,
    severity,
    explanation,
    relatedMetrics,
    recommendedReviewAction,
  };
}

export function detectFraudSignals(
  metrics: FinancialMetrics,
  context?: FraudSignalContext
): AccountingFraudSignal[] {
  const signals: AccountingFraudSignal[] = [];
  const revenueGrowth = metrics.revenueGrowth ?? 0;

  if (revenueGrowth > 0.15 && metrics.operatingCashFlowRatio < 0.15) {
    signals.push(
      signal(
        "Revenue growth without operating cash flow support",
        revenueGrowth > 0.4 ? "High" : "Medium",
        `Revenue growth is ${pct(revenueGrowth)}, but operating cash flow ratio is only ${metrics.operatingCashFlowRatio.toFixed(2)}x.`,
        ["revenueGrowth", "operatingCashFlowRatio"],
        "Review cash collections, revenue recognition timing, customer payment terms, and the operating cash flow reconciliation."
      )
    );
  }

  if (metrics.operatingCashFlowRatio < 0) {
    signals.push(
      signal(
        "Negative operating cash flow",
        "High",
        "Operating cash flow is negative, which can indicate poor earnings quality or liquidity stress.",
        ["operatingCashFlowRatio"],
        "Inspect the statement of cash flows, working capital changes, and one-time cash outflows."
      )
    );
  }

  if (metrics.netMargin > 0.08 && metrics.operatingCashFlowRatio < 0.1) {
    signals.push(
      signal(
        "Profitability-cash flow mismatch",
        "Medium",
        `Net margin is ${pct(metrics.netMargin)}, but operating cash flow conversion is weak at ${metrics.operatingCashFlowRatio.toFixed(2)}x.`,
        ["netMargin", "operatingCashFlowRatio"],
        "Reconcile net income to operating cash flow and review non-cash earnings components."
      )
    );
  }

  if (metrics.grossMargin < 0.15 || (metrics.revenueGrowth ?? 0) > 0.1 && metrics.netMargin < 0.02) {
    signals.push(
      signal(
        "Profitability decline despite revenue growth",
        "Medium",
        `Revenue is growing at ${pct(revenueGrowth)}, but margin quality is weak: gross margin ${pct(metrics.grossMargin)}, net margin ${pct(metrics.netMargin)}.`,
        ["revenueGrowth", "grossMargin", "netMargin"],
        "Review pricing, product mix, cost inflation, customer incentives, and acquisition-related adjustments."
      )
    );
  }

  if (metrics.debtToEquity > 3 || metrics.interestCoverage < 1.5) {
    signals.push(
      signal(
        "Debt service pressure",
        metrics.interestCoverage < 1 ? "High" : "Medium",
        `Debt-to-equity is ${metrics.debtToEquity.toFixed(2)}x and interest coverage is ${metrics.interestCoverage.toFixed(2)}x.`,
        ["debtToEquity", "interestCoverage"],
        "Review covenants, refinancing needs, maturity schedule, and management's liquidity plan."
      )
    );
  }

  if (metrics.currentRatio < 1 || metrics.quickRatio < 0.65) {
    signals.push(
      signal(
        "Liquidity deterioration",
        metrics.currentRatio < 0.75 ? "High" : "Medium",
        `Current ratio is ${metrics.currentRatio.toFixed(2)}x and quick ratio is ${metrics.quickRatio.toFixed(2)}x.`,
        ["currentRatio", "quickRatio"],
        "Inspect working capital aging, inventory quality, supplier terms, and upcoming short-term obligations."
      )
    );
  }

  const current = context?.currentPeriod;
  const previous = context?.previousPeriod;

  if (current && current.revenue > 0) {
    const ocfToRevenue = current.operatingCashFlow / current.revenue;
    const receivablesToRevenue = current.accountsReceivable / current.revenue;
    const cashEarningsConversion =
      current.netIncome > 0 ? current.operatingCashFlow / current.netIncome : null;

    if (revenueGrowth > 0.15 && ocfToRevenue < 0.12) {
      signals.push(
        signal(
          "Revenue-cash flow divergence",
          revenueGrowth > 0.4 || ocfToRevenue < 0.08 ? "High" : "Medium",
          `Revenue growth is ${pct(revenueGrowth)}, but operating cash flow is only ${pct(ocfToRevenue)} of revenue.`,
          ["revenueGrowth", "operatingCashFlow", "revenue"],
          "Review revenue recognition, customer cash collections, and the operating cash flow bridge."
        )
      );
    }

    if (receivablesToRevenue > 0.35) {
      signals.push(
        signal(
          "High receivables intensity",
          receivablesToRevenue > 0.45 ? "High" : "Medium",
          `Accounts receivable equals ${pct(receivablesToRevenue)} of revenue, indicating elevated collection or revenue quality risk.`,
          ["accountsReceivable", "revenue"],
          "Request receivables aging, customer concentration, payment terms, and allowance for doubtful accounts movement."
        )
      );
    }

    if (cashEarningsConversion != null && cashEarningsConversion < 0.5) {
      signals.push(
        signal(
          "Low cash earnings conversion",
          cashEarningsConversion < 0.3 ? "High" : "Medium",
          `Operating cash flow is ${cashEarningsConversion.toFixed(2)}x of net income, suggesting reported earnings are not converting into cash.`,
          ["operatingCashFlow", "netIncome"],
          "Reconcile net income to operating cash flow and review working capital adjustments and non-cash earnings components."
        )
      );
    }

    if (metrics.grossMargin > 0.8 && revenueGrowth > 0.2) {
      signals.push(
        signal(
          "Unusually high margin with rapid growth",
          "Medium",
          `Gross margin is ${pct(metrics.grossMargin)} while revenue growth is ${pct(revenueGrowth)}, which warrants support from pricing, mix, or contract evidence.`,
          ["grossMargin", "revenueGrowth"],
          "Review product mix, pricing changes, contract terms, capitalization policy, and segment margin disclosures."
        )
      );
    }
  }

  if (current && previous && previous.accountsReceivable > 0 && previous.revenue > 0) {
    const arGrowth = (current.accountsReceivable - previous.accountsReceivable) / previous.accountsReceivable;
    const reportedRevenueGrowth = (current.revenue - previous.revenue) / previous.revenue;

    if (arGrowth - reportedRevenueGrowth > 0.15) {
      signals.push(
        signal(
          "Receivables growth outpacing revenue",
          arGrowth - reportedRevenueGrowth > 0.35 ? "High" : "Medium",
          `Accounts receivable grew ${pct(arGrowth)} while revenue grew ${pct(reportedRevenueGrowth)}.`,
          ["accountsReceivable", "revenueGrowth"],
          "Request receivables aging, customer concentration, bad debt reserve movement, and extended payment term disclosures."
        )
      );
    }
  }

  if (current && previous) {
    const grossMarginDelta = current.metrics.grossMargin - previous.metrics.grossMargin;
    const netMarginDelta = current.metrics.netMargin - previous.metrics.netMargin;

    if (Math.abs(grossMarginDelta) > 0.12 || Math.abs(netMarginDelta) > 0.1) {
      signals.push(
        signal(
          "Unusual margin volatility",
          Math.abs(grossMarginDelta) > 0.2 || Math.abs(netMarginDelta) > 0.18 ? "High" : "Medium",
          `Gross margin changed by ${pct(grossMarginDelta)} and net margin changed by ${pct(netMarginDelta)} year over year.`,
          ["grossMargin", "netMargin"],
          "Review product mix, pricing changes, one-time items, capitalization policies, and segment disclosures."
        )
      );
    }

    if (previous.metrics.grossMargin - current.metrics.grossMargin > 0.05) {
      signals.push(
        signal(
          "Declining gross margin",
          previous.metrics.grossMargin - current.metrics.grossMargin > 0.1 ? "Medium" : "Low",
          `Gross margin declined from ${pct(previous.metrics.grossMargin)} to ${pct(current.metrics.grossMargin)}.`,
          ["grossMargin"],
          "Review cost of goods sold, supplier pricing, customer discounting, and inventory write-downs."
        )
      );
    }
  }

  return signals;
}
