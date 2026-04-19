export type RiskTier = "healthy" | "medium" | "high" | "critical";
export type FraudRisk = "none" | "low" | "medium" | "high";
export type Sector =
  | "Technology"
  | "Retail"
  | "Manufacturing"
  | "Healthcare"
  | "Financial Services"
  | "Energy"
  | "Real Estate"
  | "Consumer Staples";

export interface Company {
  id: string;
  name: string;
  ticker: string;
  sector: Sector;
  industry: string;
  description: string;
  headquarters: string;
  employees: number;
  founded: number;
  riskScore: number;
  riskTier: RiskTier;
  fraudRisk: FraudRisk;
  confidenceScore: number;
  lastUpdated: string;
  periods: FinancialPeriod[];
  riskDrivers: RiskDriver[];
  fraudSignals: FraudSignal[];
  benchmarkData: BenchmarkData;
  aiSummary: string;
  recommendations: Recommendation[];
  alerts: Alert[];
  timeline: TimelineEvent[];
}

export interface FinancialPeriod {
  period: string;
  year: number;
  quarter?: number;
  revenue: number;
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  ebitda: number;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  currentAssets: number;
  currentLiabilities: number;
  cash: number;
  accountsReceivable: number;
  inventory: number;
  shortTermDebt: number;
  longTermDebt: number;
  interestExpense: number;
  operatingCashFlow: number;
  capex: number;
  freeCashFlow: number;
  metrics: FinancialMetrics;
  riskScore: number;
}

export interface FinancialMetrics {
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  interestCoverage: number;
  grossMargin: number;
  netMargin: number;
  ebitdaMargin: number;
  roa: number;
  roe: number;
  operatingCashFlowRatio: number;
  revenueGrowth: number | null;
  assetTurnover: number;
  altmanZScore: number;
  workingCapital: number;
  debtToAssets: number;
}

export interface RiskDriver {
  factor: string;
  impact: number;
  direction: "positive" | "negative";
  description: string;
  category: "liquidity" | "leverage" | "profitability" | "efficiency" | "growth" | "fraud";
}

export interface FraudSignal {
  id: string;
  name: string;
  severity: "low" | "medium" | "high";
  detected: boolean;
  description: string;
  metric?: string;
  value?: number;
  benchmark?: number;
  category: "revenue" | "margin" | "debt" | "cashflow" | "receivables" | "accruals";
}

export interface BenchmarkData {
  sector: string;
  peerGroup: string;
  metrics: BenchmarkMetric[];
}

export interface BenchmarkMetric {
  name: string;
  company: number;
  industryAverage: number;
  topQuartile: number;
  peerMedian: number;
  percentileRank: number;
}

export interface Alert {
  id: string;
  companyId: string;
  companyName: string;
  type: "risk_increase" | "threshold_breach" | "fraud_signal" | "liquidity" | "debt" | "general";
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  date: string;
  read: boolean;
}

export interface Recommendation {
  id: string;
  priority: "high" | "medium" | "low";
  category: "liquidity" | "leverage" | "operations" | "governance" | "risk";
  title: string;
  description: string;
  expectedImpact: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: "revenue" | "debt" | "margin" | "fraud" | "liquidity" | "risk" | "positive" | "neutral";
  title: string;
  description: string;
  impact: "positive" | "negative" | "neutral";
}

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  companyContext?: string;
  structured?: CopilotResponse;
  isStreaming?: boolean;
}

export interface CopilotResponse {
  summary: string;
  key_risks: string[];
  key_strengths: string[];
  recommended_actions: string[];
  confidence: number;
  disclaimer: string;
}

export interface Report {
  id: string;
  companyId: string;
  companyName: string;
  type: "executive_summary" | "credit_risk" | "audit_brief" | "distress_watch" | "snapshot";
  title: string;
  description: string;
  createdAt: string;
  status: "ready" | "generating" | "error";
  pages: number;
}

export interface WatchlistItem {
  companyId: string;
  addedAt: string;
  notes: string;
  alertThreshold: number;
}

export interface ScenarioInputs {
  currentRatio: number;
  debtToEquity: number;
  netMargin: number;
  revenueGrowth: number;
  operatingCashFlowRatio: number;
  interestCoverage: number;
}

export interface DashboardStats {
  totalCompanies: number;
  averageRiskScore: number;
  highRiskCount: number;
  fraudFlagCount: number;
  criticalCount: number;
  watchlistCount: number;
  recentAlerts: number;
  riskDistribution: { tier: RiskTier; count: number; percentage: number }[];
}
