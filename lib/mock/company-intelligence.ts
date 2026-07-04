import type { Alert, Company, RiskTier } from "@/types";
import type { InvestmentHealthResult } from "@/types/investment";
import type { CompanyMarketData } from "@/types/market";
import type { CompanyNewsData } from "@/types/news";
import { calculateInvestmentHealthScore } from "@/lib/investment/investment-health";
import { getMockMarketDataByTicker, mockMarketData } from "@/lib/market/mock-market-data";
import { getMockNewsDataByTicker, mockNewsData } from "@/lib/news/mock-news-data";
import { analyzeRisk } from "@/lib/risk";
import type { RiskAnalysisResult } from "@/lib/risk/types";
import { allAlerts } from "./alerts";
import { mockCompanies } from "./companies";

type SignalDirection = "positive" | "neutral" | "negative";

export interface CompanyIntelligence {
  company: Company;
  latestPeriod: Company["periods"][number];
  riskAnalysis: RiskAnalysisResult;
  riskScore: number;
  riskLabel: string;
  financialHealthScore: number;
  market: CompanyMarketData | null;
  news: CompanyNewsData | null;
  investmentHealth: InvestmentHealthResult;
  alerts: Alert[];
  unreadAlertCount: number;
  alertCount: number;
  negativeNewsCount: number;
  criticalNewsCount: number;
  latestPrice: number | null;
  priceChangePercent: number | null;
  oneYearPerformance: number | null;
  marketMomentumScore: number;
  newsSentimentScore: number;
  summarySignals: Array<{
    label: string;
    value: string;
    direction: SignalDirection;
  }>;
}

export interface PortfolioIntelligenceStats {
  totalCompanies: number;
  averageRiskScore: number;
  averageFinancialHealthScore: number;
  averageInvestmentHealthScore: number;
  averageMarketMomentumScore: number;
  averageNewsSentimentScore: number;
  highRiskCount: number;
  criticalCount: number;
  fraudFlagCount: number;
  negativeNewsCount: number;
  unreadAlertCount: number;
  totalAlerts: number;
  riskDistribution: Array<{ tier: RiskTier; count: number; percentage: number }>;
  investmentDistribution: Array<{ label: string; count: number; percentage: number }>;
  sectorDistribution: Array<{ sector: string; count: number }>;
}

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

const average = (values: number[]) => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const formatPercent = (value: number | null) =>
  value == null ? "N/A" : `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

function valuationPlaceholder(company: Company) {
  if (company.riskTier === "healthy" && company.fraudRisk === "none") return 58;
  if (company.riskTier === "critical") return 32;
  if (company.fraudRisk === "high") return 35;
  if (company.sector === "Real Estate") return 38;
  if (company.sector === "Energy") return 45;
  return 50;
}

function signalDirection(value: number, positiveThreshold: number, negativeThreshold: number): SignalDirection {
  if (value >= positiveThreshold) return "positive";
  if (value <= negativeThreshold) return "negative";
  return "neutral";
}

export function buildCompanyIntelligence(company: Company): CompanyIntelligence {
  const latestPeriod = company.periods[company.periods.length - 1];
  const previousPeriod = company.periods[company.periods.length - 2];
  const riskAnalysis = analyzeRisk(latestPeriod.metrics, {
    currentPeriod: latestPeriod,
    previousPeriod,
  });
  const riskScore = Math.max(company.riskScore, riskAnalysis.riskScore);
  const financialHealthScore = Math.round(clamp(100 - riskScore));
  const market = getMockMarketDataByTicker(company.ticker) ?? null;
  const news = getMockNewsDataByTicker(company.ticker) ?? null;
  const marketMomentumScore = market?.marketMomentum.score ?? 50;
  const newsSentimentScore = news?.sentiment.score ?? 50;
  const investmentHealth = calculateInvestmentHealthScore({
    financialHealthScore,
    riskScore,
    marketMomentumScore,
    newsSentimentScore,
    valuationScore: valuationPlaceholder(company),
  });
  const alerts = allAlerts.filter((alert) => alert.companyId === company.id);
  const negativeNewsCount = news?.items.filter((item) => item.sentiment === "negative").length ?? 0;
  const criticalNewsCount =
    news?.items.filter((item) => item.severity === "critical" || item.severity === "high").length ?? 0;
  const latestPrice = market?.metrics.latestPrice ?? null;
  const priceChangePercent = market?.metrics.changePercent ?? null;
  const oneYearPerformance = market?.metrics.performance.oneYear ?? null;

  return {
    company,
    latestPeriod,
    riskAnalysis: {
      ...riskAnalysis,
      riskScore,
    },
    riskScore,
    riskLabel: riskAnalysis.riskLabel,
    financialHealthScore,
    market,
    news,
    investmentHealth,
    alerts,
    unreadAlertCount: alerts.filter((alert) => !alert.read).length,
    alertCount: alerts.length,
    negativeNewsCount,
    criticalNewsCount,
    latestPrice,
    priceChangePercent,
    oneYearPerformance,
    marketMomentumScore,
    newsSentimentScore,
    summarySignals: [
      {
        label: "Financial health",
        value: `${financialHealthScore}/100`,
        direction: signalDirection(financialHealthScore, 70, 45),
      },
      {
        label: "Risk score",
        value: `${riskScore}/100`,
        direction: riskScore >= 70 ? "negative" : riskScore <= 30 ? "positive" : "neutral",
      },
      {
        label: "Market momentum",
        value: `${marketMomentumScore}/100`,
        direction: signalDirection(marketMomentumScore, 65, 40),
      },
      {
        label: "News sentiment",
        value: `${newsSentimentScore}/100`,
        direction: signalDirection(newsSentimentScore, 65, 40),
      },
      {
        label: "1Y price performance",
        value: formatPercent(oneYearPerformance),
        direction: oneYearPerformance == null ? "neutral" : oneYearPerformance >= 10 ? "positive" : oneYearPerformance <= -15 ? "negative" : "neutral",
      },
    ],
  };
}

export const companyIntelligence = mockCompanies.map(buildCompanyIntelligence);

export function getCompanyIntelligenceById(id: string) {
  return companyIntelligence.find((item) => item.company.id === id);
}

export function getCompanyIntelligenceByTicker(ticker: string) {
  const normalizedTicker = ticker.trim().toUpperCase();
  return companyIntelligence.find((item) => item.company.ticker === normalizedTicker);
}

function distribution<T extends string>(items: T[]) {
  const total = items.length || 1;
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).map(([label, count]) => ({
    label,
    count,
    percentage: Math.round((count / total) * 100),
  }));
}

export function getPortfolioIntelligenceStats(): PortfolioIntelligenceStats {
  const totalCompanies = companyIntelligence.length;
  const riskTiers: RiskTier[] = ["healthy", "medium", "high", "critical"];
  const riskDistribution = riskTiers.map((tier) => {
    const count = companyIntelligence.filter((item) => item.company.riskTier === tier).length;
    return {
      tier,
      count,
      percentage: totalCompanies === 0 ? 0 : Math.round((count / totalCompanies) * 100),
    };
  });

  const investmentDistribution = distribution(
    companyIntelligence.map((item) => item.investmentHealth.label)
  );
  const sectorDistribution = distribution(companyIntelligence.map((item) => item.company.sector)).map(
    ({ label, count }) => ({ sector: label, count })
  );

  return {
    totalCompanies,
    averageRiskScore: Math.round(average(companyIntelligence.map((item) => item.riskScore))),
    averageFinancialHealthScore: Math.round(
      average(companyIntelligence.map((item) => item.financialHealthScore))
    ),
    averageInvestmentHealthScore: Math.round(
      average(companyIntelligence.map((item) => item.investmentHealth.score))
    ),
    averageMarketMomentumScore: Math.round(
      average(companyIntelligence.map((item) => item.marketMomentumScore))
    ),
    averageNewsSentimentScore: Math.round(
      average(companyIntelligence.map((item) => item.newsSentimentScore))
    ),
    highRiskCount: companyIntelligence.filter((item) => item.company.riskTier === "high").length,
    criticalCount: companyIntelligence.filter((item) => item.company.riskTier === "critical").length,
    fraudFlagCount: companyIntelligence.filter((item) =>
      item.company.fraudSignals.some((signal) => signal.detected)
    ).length,
    negativeNewsCount: mockNewsData.flatMap((item) => item.items).filter((item) => item.sentiment === "negative").length,
    unreadAlertCount: allAlerts.filter((alert) => !alert.read).length,
    totalAlerts: allAlerts.length,
    riskDistribution,
    investmentDistribution,
    sectorDistribution,
  };
}

export const portfolioIntelligenceStats = getPortfolioIntelligenceStats();

export const marketIntelligenceUniverse = mockMarketData;
export const newsIntelligenceUniverse = mockNewsData;
