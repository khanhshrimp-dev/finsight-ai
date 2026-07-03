export type MarketProvider = "mock" | "finnhub" | "alpha_vantage" | "polygon" | "financial_modeling_prep";

export type MarketTimeRange = "1W" | "1M" | "6M" | "1Y";

export type MovingAverageStatus =
  | "above_50_and_200"
  | "above_50_below_200"
  | "below_50_above_200"
  | "below_50_and_200";

export type MarketMomentumLabel =
  | "Strong Momentum"
  | "Stable"
  | "Volatile"
  | "Weak Momentum";

export interface MarketPricePoint {
  date: string;
  close: number;
  volume: number;
  indexClose?: number;
}

export interface MarketPerformance {
  oneWeek: number;
  oneMonth: number;
  sixMonth: number;
  oneYear: number;
  relativeToIndex: number;
}

export interface MarketMetrics {
  latestPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  marketCap: number;
  volume: number;
  averageVolume: number;
  volumeChangePercent: number;
  volatility: number;
  movingAverage50: number;
  movingAverage200: number;
  movingAverageStatus: MovingAverageStatus;
  drawdown: number;
  performance: MarketPerformance;
}

export interface MarketMomentumDriver {
  name: string;
  impact: number;
  direction: "positive" | "negative" | "neutral";
  explanation: string;
}

export interface MarketMomentumScoreResult {
  score: number;
  label: MarketMomentumLabel;
  drivers: MarketMomentumDriver[];
}

export interface CompanyMarketData {
  ticker: string;
  companyId: string;
  companyName: string;
  currency: "USD";
  exchange: string;
  asOf: string;
  provider: MarketProvider;
  metrics: MarketMetrics;
  historicalPrices: MarketPricePoint[];
  marketMomentum: MarketMomentumScoreResult;
}
