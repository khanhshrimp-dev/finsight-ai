import type { BenchmarkData, FinancialMetrics, FinancialPeriod } from "@/types";

export type RiskLabel = "Low Risk" | "Moderate Risk" | "High Risk" | "Critical Risk";
export type RiskDirection = "increases_risk" | "decreases_risk";
export type RiskSeverity = "Low" | "Medium" | "High";
export type RiskDriverCategory =
  | "liquidity"
  | "leverage"
  | "profitability"
  | "cash_flow"
  | "growth"
  | "fraud";

export interface RiskScoreBreakdown {
  liquidityRisk: number;
  leverageRisk: number;
  profitabilityRisk: number;
  cashFlowRisk: number;
  growthRisk: number;
}

export interface DeterministicRiskDriver {
  name: string;
  impact: number;
  direction: RiskDirection;
  category: RiskDriverCategory;
  explanation: string;
  relatedMetrics: (keyof FinancialMetrics | string)[];
}

export interface AccountingFraudSignal {
  name: string;
  severity: RiskSeverity;
  explanation: string;
  relatedMetrics: (keyof FinancialMetrics | string)[];
  recommendedReviewAction: string;
}

export interface FraudSignalContext {
  currentPeriod?: FinancialPeriod;
  previousPeriod?: FinancialPeriod | null;
}

export interface RiskAnalysisResult {
  riskScore: number;
  riskLabel: RiskLabel;
  breakdown: RiskScoreBreakdown;
  drivers: DeterministicRiskDriver[];
  fraudSignals: AccountingFraudSignal[];
  recommendations: string[];
  benchmarkData?: BenchmarkData;
  methodology: string;
}

export type ScenarioMetricKey =
  | "currentRatio"
  | "quickRatio"
  | "debtToEquity"
  | "interestCoverage"
  | "grossMargin"
  | "netMargin"
  | "roa"
  | "roe"
  | "operatingCashFlowRatio"
  | "revenueGrowth";

export interface ScenarioMetricChange {
  key: ScenarioMetricKey;
  label: string;
  before: number;
  after: number;
  delta: number;
  riskImpact: number;
  direction: RiskDirection;
  explanation: string;
}

export interface ScenarioDeltaResult {
  baseScore: number;
  scenarioScore: number;
  delta: number;
  baseLabel: RiskLabel;
  scenarioLabel: RiskLabel;
  changedDrivers: ScenarioMetricChange[];
  topDrivers: ScenarioMetricChange[];
  mostSensitiveMetric: ScenarioSensitivityResult;
  explanation: string;
  aiReadyExplanation: string;
  recommendations: string[];
}

export interface ScenarioSensitivityResult {
  key: ScenarioMetricKey;
  label: string;
  riskImpact: number;
  stressDirection: "increase" | "decrease";
  explanation: string;
}
