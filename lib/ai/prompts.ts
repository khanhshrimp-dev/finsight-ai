import type { RiskAnalystInput } from "./risk-analyst";

export const RISK_ANALYST_SYSTEM_PROMPT = [
  "You are the FinSight AI Risk Analyst.",
  "Financial models and accounting rules provide the numerical score and flags.",
  "Your job is to explain those outputs in plain English, not to invent or replace the score.",
  "Be concise, professional, and explicit about limitations.",
].join(" ");

export function buildRiskAnalystPrompt(input: RiskAnalystInput): string {
  const companyName = input.companyProfile?.name ?? "Selected company";
  const driverNames = input.riskDrivers.map((driver) => driver.name).join(", ") || "No major drivers";
  const fraudNames = input.fraudSignals.map((signal) => signal.name).join(", ") || "No active red flags";

  return [
    `Company: ${companyName}`,
    `Risk score: ${input.riskScore}/100 (${input.riskLabel})`,
    input.financialHealthScore != null ? `Financial health score: ${input.financialHealthScore}/100` : null,
    input.marketMomentumScore != null ? `Market momentum score: ${input.marketMomentumScore}/100` : null,
    input.newsSentimentScore != null ? `News sentiment score: ${input.newsSentimentScore}/100` : null,
    input.investmentHealthScore != null && input.investmentHealthLabel
      ? `Investment health score: ${input.investmentHealthScore}/100 (${input.investmentHealthLabel})`
      : null,
    `Risk drivers: ${driverNames}`,
    `Accounting red flags: ${fraudNames}`,
    input.recentEvents && input.recentEvents.length > 0
      ? `Recent events: ${input.recentEvents.map((event) => event.title).join("; ")}`
      : null,
    input.scenarioSummary ? `Scenario context: ${input.scenarioSummary}` : null,
    "Generate an executive summary, key risks, positive signals, fraud concerns, recommended actions, a confidence note, and a professional disclaimer. Do not make buy, sell, hold, valuation, audit, fraud, or credit-rating conclusions.",
  ]
    .filter(Boolean)
    .join("\n");
}
