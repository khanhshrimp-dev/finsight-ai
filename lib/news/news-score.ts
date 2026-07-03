import type {
  CompanyNewsItem,
  NewsScoreDriver,
  NewsSentiment,
  NewsSentimentLabel,
  NewsSentimentScoreResult,
  NewsSeverity,
} from "@/types/news";

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

const sentimentBase: Record<NewsSentiment, number> = {
  positive: 78,
  neutral: 55,
  negative: 26,
};

const severityPenalty: Record<NewsSeverity, number> = {
  low: 0,
  medium: -6,
  high: -14,
  critical: -24,
};

function daysBetween(referenceDate: string, publishedAt: string) {
  const reference = new Date(referenceDate).getTime();
  const published = new Date(publishedAt).getTime();
  if (!Number.isFinite(reference) || !Number.isFinite(published)) return 90;
  return Math.max(0, (reference - published) / (1000 * 60 * 60 * 24));
}

function recencyWeight(daysOld: number) {
  if (daysOld <= 7) return 1.35;
  if (daysOld <= 30) return 1.15;
  if (daysOld <= 90) return 1;
  return 0.75;
}

function itemScore(item: CompanyNewsItem) {
  const riskImpactAdjustment =
    item.riskImpact === "positive" ? 8 : item.riskImpact === "negative" ? -8 : 0;
  const positiveSeverityOffset =
    item.sentiment === "positive" && item.riskImpact === "positive"
      ? Math.abs(severityPenalty[item.severity]) * 0.35
      : 0;

  return clamp(
    sentimentBase[item.sentiment] +
      severityPenalty[item.severity] +
      positiveSeverityOffset +
      riskImpactAdjustment
  );
}

function classifyNewsScore(score: number): NewsSentimentLabel {
  if (score >= 75) return "Positive";
  if (score >= 60) return "Constructive";
  if (score >= 45) return "Mixed";
  if (score >= 30) return "Caution";
  return "High Risk Events";
}

function buildNewsDrivers(items: CompanyNewsItem[], score: number): NewsScoreDriver[] {
  const drivers: NewsScoreDriver[] = [];
  const negativeItems = items.filter((item) => item.sentiment === "negative");
  const positiveItems = items.filter((item) => item.sentiment === "positive");
  const severeItems = items.filter((item) => item.severity === "high" || item.severity === "critical");
  const accountingItems = items.filter(
    (item) => item.eventType === "accounting_issue" || item.eventType === "fraud_investigation"
  );

  if (positiveItems.length > negativeItems.length) {
    drivers.push({
      name: "Positive news balance",
      impact: 10,
      direction: "positive",
      explanation: `${positiveItems.length} positive mock news item${positiveItems.length === 1 ? "" : "s"} outnumber negative items.`,
    });
  }

  if (negativeItems.length > 0) {
    drivers.push({
      name: "Negative event flow",
      impact: 12,
      direction: "negative",
      explanation: `${negativeItems.length} negative mock event${negativeItems.length === 1 ? "" : "s"} are included in the current news set.`,
    });
  }

  if (severeItems.length > 0) {
    drivers.push({
      name: "High-severity events",
      impact: 14,
      direction: "negative",
      explanation: `${severeItems.length} high or critical severity event${severeItems.length === 1 ? "" : "s"} require analyst review.`,
    });
  }

  if (accountingItems.length > 0) {
    drivers.push({
      name: "Accounting or fraud event",
      impact: 18,
      direction: "negative",
      explanation: "At least one mock event is classified as accounting or fraud-related, increasing event risk.",
    });
  }

  if (drivers.length === 0) {
    drivers.push({
      name: "Balanced event flow",
      impact: 0,
      direction: score >= 50 ? "neutral" : "negative",
      explanation: "No dominant mock news event type is driving the score.",
    });
  }

  return drivers;
}

function buildMockAiSummary(items: CompanyNewsItem[], score: number, label: NewsSentimentLabel) {
  const latest = items[0];
  const severeItems = items.filter((item) => item.severity === "high" || item.severity === "critical");
  const severeClause =
    severeItems.length > 0
      ? ` ${severeItems.length} high-severity event${severeItems.length === 1 ? "" : "s"} should be reviewed before relying on the signal.`
      : " No high-severity event is present in the current mock feed.";

  if (!latest) {
    return "No company news is available in the mock feed, so the news intelligence signal is neutral by default.";
  }

  return `Mock news intelligence is ${label.toLowerCase()} at ${score}/100. The latest event is "${latest.title}" from ${latest.source}, classified as ${latest.eventType.replace("_", " ")} with ${latest.riskImpact} risk impact.${severeClause}`;
}

export function calculateNewsSentimentScore(
  ticker: string,
  items: CompanyNewsItem[],
  referenceDate = "2026-07-03T21:00:00.000Z"
): NewsSentimentScoreResult {
  if (items.length === 0) {
    return {
      ticker: ticker.toUpperCase(),
      score: 55,
      label: "Mixed",
      provider: "mock",
      generatedAt: referenceDate,
      sentimentCounts: { positive: 0, neutral: 0, negative: 0 },
      highSeverityEvents: 0,
      recentNegativeEvents: 0,
      averageRelevance: 0,
      averageConfidence: 0,
      drivers: [
        {
          name: "No news available",
          impact: 0,
          direction: "neutral",
          explanation: "The mock provider has no current company news for this ticker.",
        },
      ],
      aiSummary: "No company news is available in the mock feed, so the news intelligence signal is neutral by default.",
    };
  }

  let weightedScore = 0;
  let totalWeight = 0;
  const sentimentCounts: Record<NewsSentiment, number> = { positive: 0, neutral: 0, negative: 0 };

  for (const item of items) {
    const daysOld = daysBetween(referenceDate, item.publishedAt);
    const weight = recencyWeight(daysOld) * item.relevanceScore * item.confidenceScore;
    weightedScore += itemScore(item) * weight;
    totalWeight += weight;
    sentimentCounts[item.sentiment] += 1;
  }

  const score = Math.round(clamp(weightedScore / totalWeight));
  const label = classifyNewsScore(score);
  const highSeverityEvents = items.filter(
    (item) => item.severity === "high" || item.severity === "critical"
  ).length;
  const recentNegativeEvents = items.filter(
    (item) => item.sentiment === "negative" && daysBetween(referenceDate, item.publishedAt) <= 30
  ).length;

  return {
    ticker: ticker.toUpperCase(),
    score,
    label,
    provider: "mock",
    generatedAt: referenceDate,
    sentimentCounts,
    highSeverityEvents,
    recentNegativeEvents,
    averageRelevance: items.reduce((sum, item) => sum + item.relevanceScore, 0) / items.length,
    averageConfidence: items.reduce((sum, item) => sum + item.confidenceScore, 0) / items.length,
    drivers: buildNewsDrivers(items, score),
    aiSummary: buildMockAiSummary(items, score, label),
  };
}
