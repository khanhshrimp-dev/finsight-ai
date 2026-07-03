import type { BenchmarkData, Company, FinancialMetrics } from "@/types";
import type { AccountingFraudSignal, DeterministicRiskDriver, RiskLabel } from "@/lib/risk";
import type { InvestmentHealthLabel } from "@/types/investment";
import type { NewsEventType, NewsRiskImpact, NewsSentiment, NewsSeverity } from "@/types/news";
import { buildRiskAnalystPrompt, RISK_ANALYST_SYSTEM_PROMPT } from "./prompts";

export interface RiskAnalystCompanyProfile {
  id?: string;
  name: string;
  ticker?: string;
  sector?: string;
  industry?: string;
}

export interface RiskAnalystInput {
  companyProfile?: RiskAnalystCompanyProfile;
  financialMetrics: FinancialMetrics;
  riskScore: number;
  riskLabel: RiskLabel;
  riskDrivers: DeterministicRiskDriver[];
  fraudSignals: AccountingFraudSignal[];
  benchmarkData?: BenchmarkData;
  scenarioSummary?: string;
  financialHealthScore?: number;
  marketMomentumScore?: number;
  newsSentimentScore?: number;
  investmentHealthScore?: number;
  investmentHealthLabel?: InvestmentHealthLabel;
  recentEvents?: Array<{
    title: string;
    eventType: NewsEventType;
    sentiment: NewsSentiment;
    severity: NewsSeverity;
    riskImpact: NewsRiskImpact;
  }>;
}

export interface RiskAnalystOutput {
  executiveSummary: string;
  keyRisks: string[];
  positiveSignals: string[];
  fraudConcerns: string[];
  recommendedActions: string[];
  confidenceNote: string;
  professionalDisclaimer: string;
  modelBasis: string[];
  promptPreview: string;
}

export function profileFromCompany(company: Company): RiskAnalystCompanyProfile {
  return {
    id: company.id,
    name: company.name,
    ticker: company.ticker,
    sector: company.sector,
    industry: company.industry,
  };
}

export function generateMockRiskAnalystResponse(input: RiskAnalystInput): RiskAnalystOutput {
  const companyName = input.companyProfile?.name ?? "The company";
  const topRiskDrivers = input.riskDrivers
    .filter((driver) => driver.direction === "increases_risk")
    .slice(0, 4);
  const positiveDrivers = input.riskDrivers
    .filter((driver) => driver.direction === "decreases_risk")
    .slice(0, 3);
  const highFraudSignals = input.fraudSignals.filter((signal) => signal.severity !== "Low");

  const keyRisks =
    topRiskDrivers.length > 0
      ? topRiskDrivers.map((driver) => `${driver.name}: ${driver.explanation}`)
      : [`No major deterministic risk drivers were flagged for ${companyName}. Continue monitoring trend changes.`];

  const positiveSignals =
    positiveDrivers.length > 0
      ? positiveDrivers.map((driver) => `${driver.name}: ${driver.explanation}`)
      : ["No strong offsetting financial strengths were identified by the deterministic score in this run."];

  const fraudConcerns =
    highFraudSignals.length > 0
      ? highFraudSignals.map((signal) => `${signal.name}: ${signal.explanation}`)
      : ["No medium or high accounting red flags were triggered by the current rules-based screening layer."];

  const benchmarkContext = input.benchmarkData
    ? ` Benchmark context uses ${input.benchmarkData.peerGroup}.`
    : "";
  const scenarioContext = input.scenarioSummary ? ` Scenario context: ${input.scenarioSummary}` : "";
  const marketContext =
    input.marketMomentumScore != null
      ? ` Mock market momentum is ${input.marketMomentumScore}/100.`
      : "";
  const newsContext =
    input.newsSentimentScore != null
      ? ` Mock news sentiment is ${input.newsSentimentScore}/100.`
      : "";
  const investmentHealthContext =
    input.investmentHealthScore != null && input.investmentHealthLabel
      ? ` Composite investment health is ${input.investmentHealthScore}/100 (${input.investmentHealthLabel}); this is a research signal, not a recommendation.`
      : "";
  const recentEventContext =
    input.recentEvents && input.recentEvents.length > 0
      ? ` Recent event focus: ${input.recentEvents
          .slice(0, 2)
          .map((event) => `${event.title} (${event.eventType.replace("_", " ")}, ${event.riskImpact} impact)`)
          .join("; ")}.`
      : "";

  if (input.marketMomentumScore != null && input.marketMomentumScore <= 40) {
    keyRisks.push(`Market momentum: Mock market momentum score of ${input.marketMomentumScore}/100 signals weak or volatile trading behavior.`);
  }

  if (input.newsSentimentScore != null && input.newsSentimentScore <= 40) {
    keyRisks.push(`News intelligence: Mock news sentiment score of ${input.newsSentimentScore}/100 indicates adverse recent event flow.`);
  }

  if (input.marketMomentumScore != null && input.marketMomentumScore >= 70) {
    positiveSignals.push(`Market momentum: Mock market momentum score of ${input.marketMomentumScore}/100 supports the research signal.`);
  }

  if (input.newsSentimentScore != null && input.newsSentimentScore >= 65) {
    positiveSignals.push(`News intelligence: Mock news sentiment score of ${input.newsSentimentScore}/100 indicates constructive recent event flow.`);
  }

  return {
    executiveSummary:
      `${companyName} has a deterministic FinSight risk score of ${input.riskScore}/100, classified as ${input.riskLabel}. The score is based on financial ratios and accounting red flag rules, not an independent AI prediction.${benchmarkContext}${marketContext}${newsContext}${investmentHealthContext}${recentEventContext}${scenarioContext}`,
    keyRisks,
    positiveSignals,
    fraudConcerns,
    recommendedActions: [
      ...input.riskDrivers
        .filter((driver) => driver.direction === "increases_risk")
        .slice(0, 3)
        .map((driver) => `Review ${driver.category.replace("_", " ")} driver: ${driver.name}.`),
      ...highFraudSignals.slice(0, 2).map((signal) => signal.recommendedReviewAction),
      ...(input.recentEvents && input.recentEvents.length > 0
        ? ["Review recent market and news events alongside the financial model before forming any research conclusion."]
        : []),
    ].slice(0, 5),
    confidenceNote:
      "Confidence is demo-level because the current app uses mock data and deterministic scoring. Confidence should improve only after real data ingestion, validation, and model evaluation are added.",
    professionalDisclaimer:
      "This output is for informational and portfolio demonstration purposes only. It is not investment advice, a credit rating, an audit opinion, or a finding of fraud.",
    modelBasis: [
      "Deterministic financial risk score",
      "Financial ratios from the latest company period",
      "Rules-based accounting red flag screening",
      "Benchmark data when available",
      "Mock market intelligence when provided",
      "Mock news intelligence when provided",
      "Investment health composite when provided",
      "Scenario deltas when provided",
    ],
    promptPreview: `${RISK_ANALYST_SYSTEM_PROMPT}\n\n${buildRiskAnalystPrompt(input)}`,
  };
}
