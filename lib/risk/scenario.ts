import type { FinancialMetrics } from "@/types";
import {
  calculateRiskScore,
  classifyRisk,
  generateRecommendations,
} from "./scoring";
import type {
  RiskDirection,
  ScenarioDeltaResult,
  ScenarioMetricChange,
  ScenarioMetricKey,
  ScenarioSensitivityResult,
} from "./types";

const scenarioMetricLabels: Record<ScenarioMetricKey, string> = {
  currentRatio: "Current Ratio",
  quickRatio: "Quick Ratio",
  debtToEquity: "Debt-to-Equity",
  interestCoverage: "Interest Coverage",
  grossMargin: "Gross Margin",
  netMargin: "Net Margin",
  roa: "ROA",
  roe: "ROE",
  operatingCashFlowRatio: "Operating Cash Flow Ratio",
  revenueGrowth: "Revenue Growth",
};

const higherIsRiskier = new Set<ScenarioMetricKey>(["debtToEquity"]);
const scenarioMetricKeys = Object.keys(scenarioMetricLabels) as ScenarioMetricKey[];

function cloneMetrics(metrics: FinancialMetrics): FinancialMetrics {
  return { ...metrics };
}

function formatMetricChange(key: ScenarioMetricKey, value: number) {
  if (
    key === "grossMargin" ||
    key === "netMargin" ||
    key === "roa" ||
    key === "roe" ||
    key === "revenueGrowth"
  ) {
    return `${(value * 100).toFixed(1)}%`;
  }

  return `${value.toFixed(2)}x`;
}

function isMaterialChange(before: number, after: number) {
  return Math.abs(after - before) > 0.0001;
}

function explainMetricChange(
  key: ScenarioMetricKey,
  before: number,
  after: number,
  riskImpact: number
) {
  const directionWord = after > before ? "increased" : "decreased";
  const riskWord = riskImpact > 0 ? "increases" : "reduces";

  return `${scenarioMetricLabels[key]} ${directionWord} from ${formatMetricChange(
    key,
    before
  )} to ${formatMetricChange(key, after)}, which ${riskWord} risk by ${Math.abs(
    riskImpact
  )} point${Math.abs(riskImpact) === 1 ? "" : "s"}.`;
}

export function getTopScenarioDrivers(
  baseMetrics: FinancialMetrics,
  scenarioMetrics: FinancialMetrics
): ScenarioMetricChange[] {
  const baseScore = calculateRiskScore(baseMetrics);

  return scenarioMetricKeys
    .filter((key) => isMaterialChange(baseMetrics[key] ?? 0, scenarioMetrics[key] ?? 0))
    .map((key) => {
      const isolated = cloneMetrics(baseMetrics);
      isolated[key] = scenarioMetrics[key] as never;
      const isolatedScore = calculateRiskScore(isolated);
      const riskImpact = isolatedScore - baseScore;
      const before = baseMetrics[key] ?? 0;
      const after = scenarioMetrics[key] ?? 0;
      const direction: RiskDirection = riskImpact >= 0 ? "increases_risk" : "decreases_risk";

      return {
        key,
        label: scenarioMetricLabels[key],
        before,
        after,
        delta: after - before,
        riskImpact,
        direction,
        explanation: explainMetricChange(key, before, after, riskImpact),
      };
    })
    .sort((a, b) => Math.abs(b.riskImpact) - Math.abs(a.riskImpact));
}

export function findMostSensitiveMetric(baseMetrics: FinancialMetrics): ScenarioSensitivityResult {
  const baseScore = calculateRiskScore(baseMetrics);
  const sensitivities = scenarioMetricKeys.map((key) => {
    const stressed = cloneMetrics(baseMetrics);
    const original = Number(baseMetrics[key] ?? 0);
    const stressDirection: "increase" | "decrease" = higherIsRiskier.has(key)
      ? "increase"
      : "decrease";

    if (stressDirection === "increase") {
      stressed[key] = Math.max(original * 1.2, original + 0.2) as never;
    } else {
      stressed[key] = Math.max(original * 0.8, original - 0.1) as never;
    }

    const stressedScore = calculateRiskScore(stressed);
    return {
      key,
      label: scenarioMetricLabels[key],
      riskImpact: stressedScore - baseScore,
      stressDirection,
      explanation: `${scenarioMetricLabels[key]} has the largest modeled impact under a 20% stress move.`,
    };
  });

  return sensitivities.sort((a, b) => Math.abs(b.riskImpact) - Math.abs(a.riskImpact))[0];
}

export function generateScenarioExplanation(
  baseMetrics: FinancialMetrics,
  scenarioMetrics: FinancialMetrics,
  result?: Pick<ScenarioDeltaResult, "baseScore" | "scenarioScore" | "delta" | "topDrivers">
) {
  const resolved =
    result ??
    (() => {
      const baseScore = calculateRiskScore(baseMetrics);
      const scenarioScore = calculateRiskScore(scenarioMetrics);
      return {
        baseScore,
        scenarioScore,
        delta: scenarioScore - baseScore,
        topDrivers: getTopScenarioDrivers(baseMetrics, scenarioMetrics).slice(0, 3),
      };
    })();

  const direction =
    resolved.delta > 0 ? "worsens" : resolved.delta < 0 ? "improves" : "does not materially change";
  const driverText =
    resolved.topDrivers.length > 0
      ? ` Main drivers: ${resolved.topDrivers.map((d) => d.label).join(", ")}.`
      : "";

  return `The scenario ${direction} the deterministic risk score from ${resolved.baseScore} to ${resolved.scenarioScore} (${resolved.delta >= 0 ? "+" : ""}${resolved.delta} points).${driverText}`;
}

export function calculateScenarioDelta(
  baseMetrics: FinancialMetrics,
  scenarioMetrics: FinancialMetrics
): ScenarioDeltaResult {
  const baseScore = calculateRiskScore(baseMetrics);
  const scenarioScore = calculateRiskScore(scenarioMetrics);
  const delta = scenarioScore - baseScore;
  const changedDrivers = getTopScenarioDrivers(baseMetrics, scenarioMetrics);
  const topDrivers = changedDrivers.slice(0, 5);
  const mostSensitiveMetric = findMostSensitiveMetric(baseMetrics);
  const explanation = generateScenarioExplanation(baseMetrics, scenarioMetrics, {
    baseScore,
    scenarioScore,
    delta,
    topDrivers,
  });

  return {
    baseScore,
    scenarioScore,
    delta,
    baseLabel: classifyRisk(baseScore),
    scenarioLabel: classifyRisk(scenarioScore),
    changedDrivers,
    topDrivers,
    mostSensitiveMetric,
    explanation,
    aiReadyExplanation:
      `${explanation} This narrative is ready for the AI analyst layer to expand using model drivers, accounting red flags, and benchmark context.`,
    recommendations: generateRecommendations(scenarioMetrics),
  };
}

export { scenarioMetricKeys, scenarioMetricLabels };
