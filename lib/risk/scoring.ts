import type { FinancialMetrics } from "@/types";
import type {
  DeterministicRiskDriver,
  FraudSignalContext,
  RiskAnalysisResult,
  RiskLabel,
  RiskScoreBreakdown,
} from "./types";
import { detectFraudSignals } from "./fraud-signals";

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : max));

function scoreByThresholds(
  value: number | null,
  thresholds: Array<{ when: (value: number) => boolean; score: number }>,
  fallback = 60
) {
  if (value == null || !Number.isFinite(value)) return fallback;
  return thresholds.find((t) => t.when(value))?.score ?? fallback;
}

function weightedAverage(items: Array<{ score: number; weight: number }>) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight === 0) return 0;
  return clamp(items.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight);
}

export function calculateLiquidityRisk(metrics: FinancialMetrics): number {
  const currentRatioRisk = scoreByThresholds(metrics.currentRatio, [
    { when: (v) => v >= 2.25, score: 6 },
    { when: (v) => v >= 1.5, score: 18 },
    { when: (v) => v >= 1.0, score: 46 },
    { when: (v) => v >= 0.75, score: 72 },
    { when: () => true, score: 92 },
  ]);

  const quickRatioRisk = scoreByThresholds(metrics.quickRatio, [
    { when: (v) => v >= 1.25, score: 8 },
    { when: (v) => v >= 1.0, score: 24 },
    { when: (v) => v >= 0.65, score: 58 },
    { when: (v) => v >= 0.4, score: 78 },
    { when: () => true, score: 94 },
  ]);

  return Math.round(
    weightedAverage([
      { score: currentRatioRisk, weight: 0.6 },
      { score: quickRatioRisk, weight: 0.4 },
    ])
  );
}

export function calculateLeverageRisk(metrics: FinancialMetrics): number {
  const debtToEquityRisk = scoreByThresholds(metrics.debtToEquity, [
    { when: (v) => v <= 0.5, score: 10 },
    { when: (v) => v <= 1.0, score: 26 },
    { when: (v) => v <= 2.0, score: 52 },
    { when: (v) => v <= 3.5, score: 76 },
    { when: () => true, score: 96 },
  ]);

  const interestCoverageRisk = scoreByThresholds(metrics.interestCoverage, [
    { when: (v) => v >= 6.0, score: 8 },
    { when: (v) => v >= 3.0, score: 24 },
    { when: (v) => v >= 1.5, score: 56 },
    { when: (v) => v >= 0, score: 86 },
    { when: () => true, score: 96 },
  ]);

  const debtToAssetsRisk = scoreByThresholds(metrics.debtToAssets, [
    { when: (v) => v <= 0.25, score: 14 },
    { when: (v) => v <= 0.4, score: 34 },
    { when: (v) => v <= 0.6, score: 66 },
    { when: () => true, score: 86 },
  ]);

  return Math.round(
    weightedAverage([
      { score: debtToEquityRisk, weight: 0.45 },
      { score: interestCoverageRisk, weight: 0.4 },
      { score: debtToAssetsRisk, weight: 0.15 },
    ])
  );
}

export function calculateProfitabilityRisk(metrics: FinancialMetrics): number {
  const grossMarginRisk = scoreByThresholds(metrics.grossMargin, [
    { when: (v) => v >= 0.45, score: 12 },
    { when: (v) => v >= 0.3, score: 26 },
    { when: (v) => v >= 0.18, score: 54 },
    { when: (v) => v >= 0.05, score: 76 },
    { when: () => true, score: 92 },
  ]);

  const netMarginRisk = scoreByThresholds(metrics.netMargin, [
    { when: (v) => v >= 0.15, score: 10 },
    { when: (v) => v >= 0.05, score: 28 },
    { when: (v) => v >= 0.0, score: 58 },
    { when: (v) => v >= -0.08, score: 82 },
    { when: () => true, score: 96 },
  ]);

  const roaRisk = scoreByThresholds(metrics.roa, [
    { when: (v) => v >= 0.08, score: 12 },
    { when: (v) => v >= 0.03, score: 30 },
    { when: (v) => v >= 0.0, score: 58 },
    { when: () => true, score: 88 },
  ]);

  const roeRisk = scoreByThresholds(metrics.roe, [
    { when: (v) => v >= 0.15, score: 12 },
    { when: (v) => v >= 0.06, score: 32 },
    { when: (v) => v >= 0.0, score: 60 },
    { when: () => true, score: 90 },
  ]);

  return Math.round(
    weightedAverage([
      { score: grossMarginRisk, weight: 0.25 },
      { score: netMarginRisk, weight: 0.35 },
      { score: roaRisk, weight: 0.25 },
      { score: roeRisk, weight: 0.15 },
    ])
  );
}

export function calculateCashFlowRisk(metrics: FinancialMetrics): number {
  const ocfRisk = scoreByThresholds(metrics.operatingCashFlowRatio, [
    { when: (v) => v >= 0.75, score: 10 },
    { when: (v) => v >= 0.4, score: 24 },
    { when: (v) => v >= 0.15, score: 52 },
    { when: (v) => v >= 0.0, score: 76 },
    { when: () => true, score: 94 },
  ]);

  const earningsQualityPenalty =
    metrics.netMargin > 0.08 && metrics.operatingCashFlowRatio < 0.15 ? 12 : 0;

  return Math.round(clamp(ocfRisk + earningsQualityPenalty));
}

export function calculateGrowthRisk(metrics: FinancialMetrics): number {
  const revenueGrowth = metrics.revenueGrowth ?? 0;
  const baseGrowthRisk = scoreByThresholds(revenueGrowth, [
    { when: (v) => v >= 0.05 && v <= 0.4, score: 18 },
    { when: (v) => v > 0.4, score: 34 },
    { when: (v) => v >= 0, score: 32 },
    { when: (v) => v >= -0.08, score: 58 },
    { when: () => true, score: 84 },
  ]);

  const unsupportedGrowthPenalty =
    revenueGrowth > 0.2 && metrics.operatingCashFlowRatio < 0.15 ? 18 : 0;
  const marginDeclinePenalty =
    revenueGrowth > 0 && metrics.netMargin < 0.02 ? 10 : 0;

  return Math.round(clamp(baseGrowthRisk + unsupportedGrowthPenalty + marginDeclinePenalty));
}

export function calculateRiskBreakdown(metrics: FinancialMetrics): RiskScoreBreakdown {
  return {
    liquidityRisk: calculateLiquidityRisk(metrics),
    leverageRisk: calculateLeverageRisk(metrics),
    profitabilityRisk: calculateProfitabilityRisk(metrics),
    cashFlowRisk: calculateCashFlowRisk(metrics),
    growthRisk: calculateGrowthRisk(metrics),
  };
}

export function calculateRiskScore(metrics: FinancialMetrics): number {
  const breakdown = calculateRiskBreakdown(metrics);
  const score = weightedAverage([
    { score: breakdown.liquidityRisk, weight: 0.22 },
    { score: breakdown.leverageRisk, weight: 0.26 },
    { score: breakdown.profitabilityRisk, weight: 0.18 },
    { score: breakdown.cashFlowRisk, weight: 0.22 },
    { score: breakdown.growthRisk, weight: 0.12 },
  ]);

  return Math.round(clamp(score));
}

export function classifyRisk(score: number): RiskLabel {
  if (score < 25) return "Low Risk";
  if (score < 50) return "Moderate Risk";
  if (score < 75) return "High Risk";
  return "Critical Risk";
}

export function generateRiskDrivers(metrics: FinancialMetrics): DeterministicRiskDriver[] {
  const drivers: DeterministicRiskDriver[] = [];

  if (metrics.currentRatio < 1.0) {
    drivers.push({
      name: "Weak current ratio",
      impact: 18,
      direction: "increases_risk",
      category: "liquidity",
      explanation: `Current ratio of ${metrics.currentRatio.toFixed(2)}x indicates current liabilities exceed or nearly match liquid resources.`,
      relatedMetrics: ["currentRatio"],
    });
  } else if (metrics.currentRatio >= 2.0) {
    drivers.push({
      name: "Strong current ratio",
      impact: 8,
      direction: "decreases_risk",
      category: "liquidity",
      explanation: `Current ratio of ${metrics.currentRatio.toFixed(2)}x provides a meaningful short-term liquidity buffer.`,
      relatedMetrics: ["currentRatio"],
    });
  }

  if (metrics.quickRatio < 0.75) {
    drivers.push({
      name: "Low quick ratio",
      impact: 12,
      direction: "increases_risk",
      category: "liquidity",
      explanation: `Quick ratio of ${metrics.quickRatio.toFixed(2)}x shows reliance on inventory or slower assets to meet near-term obligations.`,
      relatedMetrics: ["quickRatio"],
    });
  }

  if (metrics.debtToEquity > 2.0) {
    drivers.push({
      name: "High debt-to-equity",
      impact: Math.min(25, Math.round(metrics.debtToEquity * 4)),
      direction: "increases_risk",
      category: "leverage",
      explanation: `Debt-to-equity of ${metrics.debtToEquity.toFixed(2)}x is above conservative balance sheet thresholds.`,
      relatedMetrics: ["debtToEquity"],
    });
  } else if (metrics.debtToEquity <= 0.5) {
    drivers.push({
      name: "Conservative leverage",
      impact: 8,
      direction: "decreases_risk",
      category: "leverage",
      explanation: `Debt-to-equity of ${metrics.debtToEquity.toFixed(2)}x leaves room for financial flexibility.`,
      relatedMetrics: ["debtToEquity"],
    });
  }

  if (metrics.interestCoverage < 1.5) {
    drivers.push({
      name: "Weak interest coverage",
      impact: 18,
      direction: "increases_risk",
      category: "leverage",
      explanation: `Interest coverage of ${metrics.interestCoverage.toFixed(2)}x suggests limited capacity to service debt from operating income.`,
      relatedMetrics: ["interestCoverage"],
    });
  } else if (metrics.interestCoverage >= 6) {
    drivers.push({
      name: "Strong interest coverage",
      impact: 7,
      direction: "decreases_risk",
      category: "leverage",
      explanation: `Interest coverage of ${metrics.interestCoverage.toFixed(2)}x supports debt service capacity.`,
      relatedMetrics: ["interestCoverage"],
    });
  }

  if (metrics.netMargin < 0) {
    drivers.push({
      name: "Negative net margin",
      impact: 18,
      direction: "increases_risk",
      category: "profitability",
      explanation: `Net margin of ${(metrics.netMargin * 100).toFixed(1)}% indicates losses after expenses.`,
      relatedMetrics: ["netMargin"],
    });
  } else if (metrics.netMargin >= 0.15) {
    drivers.push({
      name: "Healthy net margin",
      impact: 7,
      direction: "decreases_risk",
      category: "profitability",
      explanation: `Net margin of ${(metrics.netMargin * 100).toFixed(1)}% supports internal capital generation.`,
      relatedMetrics: ["netMargin"],
    });
  }

  if (metrics.operatingCashFlowRatio < 0) {
    drivers.push({
      name: "Negative operating cash flow",
      impact: 22,
      direction: "increases_risk",
      category: "cash_flow",
      explanation: "Operating cash flow is negative relative to current liabilities, increasing liquidity and earnings quality risk.",
      relatedMetrics: ["operatingCashFlowRatio"],
    });
  } else if (metrics.operatingCashFlowRatio < 0.15) {
    drivers.push({
      name: "Weak cash conversion",
      impact: 14,
      direction: "increases_risk",
      category: "cash_flow",
      explanation: `Operating cash flow ratio of ${metrics.operatingCashFlowRatio.toFixed(2)}x leaves little cash buffer.`,
      relatedMetrics: ["operatingCashFlowRatio"],
    });
  } else if (metrics.operatingCashFlowRatio >= 0.75) {
    drivers.push({
      name: "Strong operating cash flow",
      impact: 8,
      direction: "decreases_risk",
      category: "cash_flow",
      explanation: `Operating cash flow ratio of ${metrics.operatingCashFlowRatio.toFixed(2)}x supports short-term obligations.`,
      relatedMetrics: ["operatingCashFlowRatio"],
    });
  }

  if ((metrics.revenueGrowth ?? 0) < -0.08) {
    drivers.push({
      name: "Revenue contraction",
      impact: 13,
      direction: "increases_risk",
      category: "growth",
      explanation: `Revenue growth of ${((metrics.revenueGrowth ?? 0) * 100).toFixed(1)}% signals demand or execution pressure.`,
      relatedMetrics: ["revenueGrowth"],
    });
  }

  if ((metrics.revenueGrowth ?? 0) > 0.2 && metrics.operatingCashFlowRatio < 0.15) {
    drivers.push({
      name: "Growth without cash support",
      impact: 16,
      direction: "increases_risk",
      category: "fraud",
      explanation: "Revenue is growing quickly, but operating cash flow does not support the reported growth quality.",
      relatedMetrics: ["revenueGrowth", "operatingCashFlowRatio"],
    });
  }

  return drivers.sort((a, b) => b.impact - a.impact);
}

export function generateRecommendations(metrics: FinancialMetrics): string[] {
  const recommendations: string[] = [];

  if (metrics.currentRatio < 1.2 || metrics.quickRatio < 0.8) {
    recommendations.push("Review short-term liquidity, working capital quality, and near-term debt maturities.");
  }

  if (metrics.debtToEquity > 2 || metrics.interestCoverage < 2) {
    recommendations.push("Assess refinancing risk, covenant headroom, and debt service capacity.");
  }

  if (metrics.netMargin < 0.03 || metrics.roa < 0.02) {
    recommendations.push("Investigate margin compression drivers and identify cost or pricing actions.");
  }

  if (metrics.operatingCashFlowRatio < 0.15) {
    recommendations.push("Reconcile operating cash flow against net income and review cash conversion quality.");
  }

  if ((metrics.revenueGrowth ?? 0) > 0.2 && metrics.operatingCashFlowRatio < 0.15) {
    recommendations.push("Review revenue recognition, customer payment terms, and receivables aging.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Continue quarterly monitoring of liquidity, leverage, profitability, and cash conversion.");
  }

  return recommendations;
}

export function analyzeRisk(metrics: FinancialMetrics, context?: FraudSignalContext): RiskAnalysisResult {
  const riskScore = calculateRiskScore(metrics);

  return {
    riskScore,
    riskLabel: classifyRisk(riskScore),
    breakdown: calculateRiskBreakdown(metrics),
    drivers: generateRiskDrivers(metrics),
    fraudSignals: detectFraudSignals(metrics, context),
    recommendations: generateRecommendations(metrics),
    methodology:
      "Deterministic demo score using weighted liquidity, leverage, profitability, cash flow, and growth subscores. This is explainable scaffolding, not a validated credit model.",
  };
}
