import type {
  InvestmentHealthDriver,
  InvestmentHealthInput,
  InvestmentHealthLabel,
  InvestmentHealthResult,
} from "@/types/investment";

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

const weights = {
  financialHealthScore: 0.35,
  marketMomentumScore: 0.2,
  newsSentimentScore: 0.15,
  valuationScore: 0.15,
  inverseRiskScore: 0.15,
} as const;

export function classifyInvestmentHealth(score: number, riskScore?: number): InvestmentHealthLabel {
  if ((riskScore != null && riskScore >= 80) || score < 30) return "High Uncertainty";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Watchlist";
  if (score >= 45) return "Mixed";
  return "Weak";
}

export function generateInvestmentHealthDrivers(input: InvestmentHealthInput): InvestmentHealthDriver[] {
  const valuationScore = input.valuationScore ?? 50;
  const drivers: InvestmentHealthDriver[] = [];

  if (input.financialHealthScore >= 70) {
    drivers.push({
      name: "Financial health support",
      direction: "positive",
      explanation: `Financial health score of ${input.financialHealthScore}/100 supports the composite research signal.`,
    });
  } else if (input.financialHealthScore <= 40) {
    drivers.push({
      name: "Weak financial health",
      direction: "negative",
      explanation: `Financial health score of ${input.financialHealthScore}/100 weighs on the composite research signal.`,
    });
  }

  if (input.riskScore >= 70) {
    drivers.push({
      name: "Elevated risk score",
      direction: "negative",
      explanation: `Risk score of ${input.riskScore}/100 materially reduces investment health.`,
    });
  } else if (input.riskScore <= 25) {
    drivers.push({
      name: "Low modeled risk",
      direction: "positive",
      explanation: `Risk score of ${input.riskScore}/100 improves the risk-adjusted portion of the composite.`,
    });
  }

  if (input.marketMomentumScore >= 70) {
    drivers.push({
      name: "Market momentum support",
      direction: "positive",
      explanation: `Market momentum score of ${input.marketMomentumScore}/100 is a favorable market intelligence input.`,
    });
  } else if (input.marketMomentumScore <= 40) {
    drivers.push({
      name: "Weak market momentum",
      direction: "negative",
      explanation: `Market momentum score of ${input.marketMomentumScore}/100 indicates weak or volatile market behavior.`,
    });
  }

  if (input.newsSentimentScore >= 65) {
    drivers.push({
      name: "Constructive event flow",
      direction: "positive",
      explanation: `News sentiment score of ${input.newsSentimentScore}/100 indicates supportive recent event flow.`,
    });
  } else if (input.newsSentimentScore <= 40) {
    drivers.push({
      name: "Negative event flow",
      direction: "negative",
      explanation: `News sentiment score of ${input.newsSentimentScore}/100 signals adverse or high-severity company events.`,
    });
  }

  drivers.push({
    name: "Valuation placeholder",
    direction: valuationScore >= 60 ? "positive" : valuationScore <= 40 ? "negative" : "neutral",
    explanation: `Valuation score is currently a ${valuationScore}/100 placeholder until real market multiples and valuation models are added.`,
  });

  return drivers;
}

export function generateInvestmentHealthSummary(result: Pick<InvestmentHealthResult, "score" | "label">) {
  return `Investment Health Score is ${result.score}/100 (${result.label}). This is a composite research signal that combines financial health, modeled risk, mock market momentum, mock news sentiment, and a valuation placeholder. It is not a buy, sell, hold, credit rating, or audit opinion.`;
}

export function calculateInvestmentHealthScore(input: InvestmentHealthInput): InvestmentHealthResult {
  const valuationScore = input.valuationScore ?? 50;
  const financialHealthScore = clamp(input.financialHealthScore);
  const riskScore = clamp(input.riskScore);
  const marketMomentumScore = clamp(input.marketMomentumScore);
  const newsSentimentScore = clamp(input.newsSentimentScore);
  const inverseRiskScore = 100 - riskScore;
  const normalizedValuationScore = clamp(valuationScore);

  const components = [
    {
      name: "Financial Health Score",
      score: financialHealthScore,
      weight: weights.financialHealthScore,
      contribution: financialHealthScore * weights.financialHealthScore,
    },
    {
      name: "Market Momentum Score",
      score: marketMomentumScore,
      weight: weights.marketMomentumScore,
      contribution: marketMomentumScore * weights.marketMomentumScore,
    },
    {
      name: "News Sentiment Score",
      score: newsSentimentScore,
      weight: weights.newsSentimentScore,
      contribution: newsSentimentScore * weights.newsSentimentScore,
    },
    {
      name: "Valuation Score",
      score: normalizedValuationScore,
      weight: weights.valuationScore,
      contribution: normalizedValuationScore * weights.valuationScore,
    },
    {
      name: "Inverse Risk Score",
      score: inverseRiskScore,
      weight: weights.inverseRiskScore,
      contribution: inverseRiskScore * weights.inverseRiskScore,
    },
  ];

  const score = Math.round(
    clamp(
      0.35 * financialHealthScore +
        0.2 * marketMomentumScore +
        0.15 * newsSentimentScore +
        0.15 * normalizedValuationScore +
        0.15 * inverseRiskScore
    )
  );
  const label = classifyInvestmentHealth(score, riskScore);

  const result: InvestmentHealthResult = {
    score,
    label,
    components,
    drivers: generateInvestmentHealthDrivers({
      financialHealthScore,
      riskScore,
      marketMomentumScore,
      newsSentimentScore,
      valuationScore: normalizedValuationScore,
    }),
    summary: "",
    disclaimer:
      "This score is a research and monitoring signal only. It is not investment advice, a recommendation, a valuation opinion, an audit opinion, or a credit rating.",
  };

  return {
    ...result,
    summary: generateInvestmentHealthSummary(result),
  };
}
