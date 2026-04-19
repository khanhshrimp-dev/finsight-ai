import type { RiskTier, FraudRisk } from "@/types";

export function getRiskColor(tier: RiskTier): string {
  switch (tier) {
    case "healthy": return "risk-low";
    case "medium": return "risk-medium";
    case "high": return "risk-high";
    case "critical": return "risk-critical";
  }
}

export function getRiskLabel(tier: RiskTier): string {
  switch (tier) {
    case "healthy": return "Healthy";
    case "medium": return "Medium Risk";
    case "high": return "High Risk";
    case "critical": return "Critical Risk";
  }
}

export function getFraudLabel(risk: FraudRisk): string {
  switch (risk) {
    case "none": return "No Signals";
    case "low": return "Low Risk";
    case "medium": return "Moderate Risk";
    case "high": return "High Risk";
  }
}

export function getRiskTierFromScore(score: number): RiskTier {
  if (score <= 25) return "healthy";
  if (score <= 50) return "medium";
  if (score <= 75) return "high";
  return "critical";
}

export function getScoreGradient(score: number): string {
  if (score <= 25) return "from-emerald-500 to-green-400";
  if (score <= 50) return "from-amber-500 to-yellow-400";
  if (score <= 75) return "from-orange-500 to-amber-400";
  return "from-red-600 to-rose-500";
}

export function computeMockRiskScore(inputs: {
  currentRatio: number;
  debtToEquity: number;
  netMargin: number;
  revenueGrowth: number;
  operatingCashFlowRatio: number;
  interestCoverage: number;
}): number {
  let score = 50;
  // Liquidity
  if (inputs.currentRatio >= 2.0) score -= 10;
  else if (inputs.currentRatio >= 1.5) score -= 5;
  else if (inputs.currentRatio < 1.0) score += 20;
  else if (inputs.currentRatio < 1.3) score += 10;

  // Leverage
  if (inputs.debtToEquity <= 0.5) score -= 8;
  else if (inputs.debtToEquity <= 1.0) score -= 3;
  else if (inputs.debtToEquity > 3.0) score += 20;
  else if (inputs.debtToEquity > 2.0) score += 10;

  // Profitability
  if (inputs.netMargin >= 0.15) score -= 8;
  else if (inputs.netMargin >= 0.05) score -= 3;
  else if (inputs.netMargin < 0) score += 20;
  else if (inputs.netMargin < 0.02) score += 8;

  // Growth
  if (inputs.revenueGrowth >= 0.1) score -= 5;
  else if (inputs.revenueGrowth < -0.1) score += 12;
  else if (inputs.revenueGrowth < 0) score += 6;

  // CF
  if (inputs.operatingCashFlowRatio >= 0.2) score -= 8;
  else if (inputs.operatingCashFlowRatio < 0) score += 18;
  else if (inputs.operatingCashFlowRatio < 0.1) score += 8;

  // Coverage
  if (inputs.interestCoverage >= 5) score -= 6;
  else if (inputs.interestCoverage < 1.5) score += 15;
  else if (inputs.interestCoverage < 2.5) score += 8;

  return Math.max(1, Math.min(99, Math.round(score)));
}

export function formatMetric(value: number, format: "ratio" | "percent" | "currency" | "multiple"): string {
  switch (format) {
    case "ratio": return value.toFixed(2) + "x";
    case "percent": return (value * 100).toFixed(1) + "%";
    case "currency": return "$" + (value >= 1000 ? (value / 1000).toFixed(1) + "B" : value.toFixed(0) + "M");
    case "multiple": return value.toFixed(1) + "x";
  }
}
