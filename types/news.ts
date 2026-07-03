export type NewsProvider =
  | "mock"
  | "finnhub"
  | "alpha_vantage"
  | "newsapi"
  | "gdelt"
  | "compliant_scraper";

export type NewsSentiment = "positive" | "neutral" | "negative";

export type NewsEventType =
  | "earnings"
  | "guidance"
  | "lawsuit"
  | "regulatory"
  | "management_change"
  | "m_and_a"
  | "product"
  | "restructuring"
  | "debt"
  | "analyst_rating"
  | "macro"
  | "accounting_issue"
  | "fraud_investigation"
  | "other";

export type NewsSeverity = "low" | "medium" | "high" | "critical";

export type NewsRiskImpact = "positive" | "neutral" | "negative";

export type NewsSentimentLabel =
  | "Positive"
  | "Constructive"
  | "Mixed"
  | "Caution"
  | "High Risk Events";

export interface CompanyNewsItem {
  id: string;
  ticker: string;
  companyId: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  sentiment: NewsSentiment;
  eventType: NewsEventType;
  severity: NewsSeverity;
  relevanceScore: number;
  confidenceScore: number;
  riskImpact: NewsRiskImpact;
}

export interface NewsScoreDriver {
  name: string;
  impact: number;
  direction: "positive" | "negative" | "neutral";
  explanation: string;
}

export interface NewsSentimentScoreResult {
  ticker: string;
  score: number;
  label: NewsSentimentLabel;
  provider: NewsProvider;
  generatedAt: string;
  sentimentCounts: Record<NewsSentiment, number>;
  highSeverityEvents: number;
  recentNegativeEvents: number;
  averageRelevance: number;
  averageConfidence: number;
  drivers: NewsScoreDriver[];
  aiSummary: string;
}

export interface CompanyNewsData {
  ticker: string;
  companyId: string;
  companyName: string;
  provider: NewsProvider;
  asOf: string;
  items: CompanyNewsItem[];
  sentiment: NewsSentimentScoreResult;
}
