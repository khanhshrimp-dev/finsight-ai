import type { FinancialMetrics } from "@/types";
import type {
  AccountingFraudSignal,
  DeterministicRiskDriver,
  RiskAnalysisResult,
  RiskLabel,
  RiskScoreBreakdown,
  ScenarioDeltaResult,
} from "@/lib/risk";
import type { RiskAnalystOutput } from "@/lib/ai/risk-analyst";
import type { CompanyMarketData } from "@/types/market";
import type { CompanyNewsData } from "@/types/news";
import type {
  InvestmentHealthInput,
  InvestmentHealthResult,
} from "@/types/investment";

export interface RiskAnalyzeRequest {
  companyId?: string;
  metrics?: FinancialMetrics;
}

export interface RiskAnalyzeResponse {
  companyId?: string;
  companyName?: string;
  riskScore: number;
  riskLabel: RiskLabel;
  breakdown: RiskScoreBreakdown;
  drivers: DeterministicRiskDriver[];
  fraudSignals: AccountingFraudSignal[];
  recommendations: string[];
  methodology: string;
  generatedAt: string;
  analysis: RiskAnalysisResult;
}

export interface RiskSimulateRequest {
  companyId?: string;
  baseMetrics?: FinancialMetrics;
  scenarioMetrics?: FinancialMetrics;
}

export interface RiskSimulateResponse {
  companyId?: string;
  companyName?: string;
  result: ScenarioDeltaResult;
  generatedAt: string;
}

export interface AiRiskAnalysisRequest {
  companyId?: string;
  metrics?: FinancialMetrics;
  scenarioSummary?: string;
}

export interface AiRiskAnalysisResponse {
  companyId?: string;
  companyName?: string;
  riskScore: number;
  riskLabel: RiskLabel;
  analyst: RiskAnalystOutput;
  generatedAt: string;
}

export type ReportGenerateType =
  | "risk-summary"
  | "fraud-analysis"
  | "benchmark"
  | "trend-analysis"
  | "scenario";

export interface ReportGenerateRequest {
  type: ReportGenerateType;
  companyIds?: string[];
  format?: "json" | "pdf";
}

export interface ReportGenerateResponse {
  reportId: string;
  type: ReportGenerateType;
  format: "json" | "pdf";
  status: "ready" | "mock_ready";
  generatedAt: string;
  companyCount: number;
  data: unknown;
  limitations: string[];
}

export interface MarketTickerResponse {
  data: CompanyMarketData;
  limitations: string[];
}

export interface NewsTickerResponse {
  data: CompanyNewsData;
  limitations: string[];
}

export interface InvestmentAnalyzeRequest {
  companyId?: string;
  ticker?: string;
  scores?: Partial<InvestmentHealthInput>;
  valuationScore?: number;
}

export interface InvestmentAnalyzeResponse {
  companyId?: string;
  companyName?: string;
  ticker: string;
  financialHealthScore: number;
  riskScore: number;
  marketMomentumScore: number;
  newsSentimentScore: number;
  valuationScore: number;
  investmentHealth: InvestmentHealthResult;
  market?: CompanyMarketData;
  news?: CompanyNewsData;
  generatedAt: string;
  limitations: string[];
}
