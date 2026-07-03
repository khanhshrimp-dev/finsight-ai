import type {
  CompanyMarketData,
  MarketMetrics,
  MarketMomentumDriver,
  MarketMomentumLabel,
  MarketMomentumScoreResult,
  MarketPerformance,
  MarketPricePoint,
  MovingAverageStatus,
} from "@/types/market";

const clamp = (value: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

const percentChange = (current: number, previous: number) => {
  if (!Number.isFinite(previous) || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

const average = (values: number[]) => {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

function calculateVolatility(prices: MarketPricePoint[]) {
  const returns = prices
    .slice(1)
    .map((point, index) => percentChange(point.close, prices[index].close));

  if (returns.length === 0) return 0;

  const mean = average(returns);
  const variance = average(returns.map((value) => (value - mean) ** 2));
  return Math.sqrt(variance) * Math.sqrt(12);
}

function performanceAt(prices: MarketPricePoint[], offsetFromEnd: number) {
  const latest = prices[prices.length - 1];
  const previous = prices[Math.max(0, prices.length - 1 - offsetFromEnd)];
  return percentChange(latest.close, previous.close);
}

function calculateRelativePerformance(prices: MarketPricePoint[]) {
  const first = prices[0];
  const latest = prices[prices.length - 1];

  if (!first.indexClose || !latest.indexClose) return 0;

  return percentChange(latest.close, first.close) - percentChange(latest.indexClose, first.indexClose);
}

function classifyMovingAverageStatus(
  latestPrice: number,
  movingAverage50: number,
  movingAverage200: number
): MovingAverageStatus {
  const above50 = latestPrice >= movingAverage50;
  const above200 = latestPrice >= movingAverage200;

  if (above50 && above200) return "above_50_and_200";
  if (above50 && !above200) return "above_50_below_200";
  if (!above50 && above200) return "below_50_above_200";
  return "below_50_and_200";
}

export function calculateMarketMetrics(
  prices: MarketPricePoint[],
  previousClose: number,
  averageVolume: number,
  marketCap: number,
  explicitHigh?: number,
  explicitLow?: number
): MarketMetrics {
  const latest = prices[prices.length - 1];
  const closes = prices.map((point) => point.close);
  const latestPrice = latest.close;
  const fiftyTwoWeekHigh = explicitHigh ?? Math.max(...closes);
  const fiftyTwoWeekLow = explicitLow ?? Math.min(...closes);
  const movingAverage50 = average(closes.slice(-3));
  const movingAverage200 = average(closes);
  const change = latestPrice - previousClose;
  const volumeChangePercent = percentChange(latest.volume, averageVolume);

  const performance: MarketPerformance = {
    oneWeek: percentChange(latestPrice, previousClose),
    oneMonth: performanceAt(prices, 1),
    sixMonth: performanceAt(prices, 6),
    oneYear: performanceAt(prices, prices.length - 1),
    relativeToIndex: calculateRelativePerformance(prices),
  };

  return {
    latestPrice,
    previousClose,
    change,
    changePercent: percentChange(latestPrice, previousClose),
    fiftyTwoWeekHigh,
    fiftyTwoWeekLow,
    marketCap,
    volume: latest.volume,
    averageVolume,
    volumeChangePercent,
    volatility: calculateVolatility(prices),
    movingAverage50,
    movingAverage200,
    movingAverageStatus: classifyMovingAverageStatus(latestPrice, movingAverage50, movingAverage200),
    drawdown: percentChange(latestPrice, fiftyTwoWeekHigh),
    performance,
  };
}

function trendScore(metrics: MarketMetrics) {
  const { oneMonth, sixMonth, oneYear, relativeToIndex } = metrics.performance;
  return clamp(
    50 +
      oneMonth * 0.65 +
      sixMonth * 0.25 +
      oneYear * 0.2 +
      relativeToIndex * 0.2
  );
}

function volatilityScore(volatility: number) {
  if (volatility <= 10) return 82;
  if (volatility <= 18) return 68;
  if (volatility <= 30) return 50;
  if (volatility <= 45) return 35;
  return 20;
}

function volumeScore(volumeChangePercent: number) {
  if (volumeChangePercent >= 25) return 45;
  if (volumeChangePercent >= 5) return 68;
  if (volumeChangePercent >= -20) return 56;
  return 35;
}

function movingAverageScore(status: MovingAverageStatus) {
  if (status === "above_50_and_200") return 82;
  if (status === "above_50_below_200") return 60;
  if (status === "below_50_above_200") return 48;
  return 25;
}

function drawdownScore(drawdown: number) {
  if (drawdown >= -8) return 82;
  if (drawdown >= -18) return 66;
  if (drawdown >= -35) return 42;
  return 22;
}

function classifyMarketMomentum(score: number): MarketMomentumLabel {
  if (score >= 75) return "Strong Momentum";
  if (score >= 58) return "Stable";
  if (score >= 40) return "Volatile";
  return "Weak Momentum";
}

function buildMarketDrivers(metrics: MarketMetrics): MarketMomentumDriver[] {
  const drivers: MarketMomentumDriver[] = [];

  if (metrics.performance.oneMonth >= 5) {
    drivers.push({
      name: "Positive 1M trend",
      impact: 12,
      direction: "positive",
      explanation: `Price is up ${metrics.performance.oneMonth.toFixed(1)}% over the last month in the mock series.`,
    });
  } else if (metrics.performance.oneMonth <= -5) {
    drivers.push({
      name: "Negative 1M trend",
      impact: 12,
      direction: "negative",
      explanation: `Price is down ${Math.abs(metrics.performance.oneMonth).toFixed(1)}% over the last month in the mock series.`,
    });
  }

  if (metrics.performance.relativeToIndex >= 5) {
    drivers.push({
      name: "Relative strength",
      impact: 10,
      direction: "positive",
      explanation: `One-year mock performance is ${metrics.performance.relativeToIndex.toFixed(1)} percentage points ahead of the reference index.`,
    });
  } else if (metrics.performance.relativeToIndex <= -5) {
    drivers.push({
      name: "Relative weakness",
      impact: 10,
      direction: "negative",
      explanation: `One-year mock performance is ${Math.abs(metrics.performance.relativeToIndex).toFixed(1)} percentage points behind the reference index.`,
    });
  }

  if (metrics.movingAverageStatus === "above_50_and_200") {
    drivers.push({
      name: "Above moving averages",
      impact: 10,
      direction: "positive",
      explanation: "Latest mock price is above both short- and long-window moving averages.",
    });
  } else if (metrics.movingAverageStatus === "below_50_and_200") {
    drivers.push({
      name: "Below moving averages",
      impact: 10,
      direction: "negative",
      explanation: "Latest mock price is below both short- and long-window moving averages.",
    });
  }

  if (metrics.volatility >= 35) {
    drivers.push({
      name: "Elevated volatility",
      impact: 8,
      direction: "negative",
      explanation: `Mock annualized volatility is ${metrics.volatility.toFixed(1)}%, which reduces momentum quality.`,
    });
  }

  if (metrics.drawdown <= -25) {
    drivers.push({
      name: "Large drawdown",
      impact: 10,
      direction: "negative",
      explanation: `Latest price is ${Math.abs(metrics.drawdown).toFixed(1)}% below the mock 52-week high.`,
    });
  }

  if (drivers.length === 0) {
    drivers.push({
      name: "Balanced market signals",
      impact: 0,
      direction: "neutral",
      explanation: "Mock price trend, volatility, and volume signals are broadly balanced.",
    });
  }

  return drivers;
}

export function calculateMarketMomentumScore(metrics: MarketMetrics): MarketMomentumScoreResult {
  const score = Math.round(
    clamp(
      trendScore(metrics) * 0.35 +
        volatilityScore(metrics.volatility) * 0.2 +
        volumeScore(metrics.volumeChangePercent) * 0.15 +
        movingAverageScore(metrics.movingAverageStatus) * 0.15 +
        drawdownScore(metrics.drawdown) * 0.15
    )
  );

  return {
    score,
    label: classifyMarketMomentum(score),
    drivers: buildMarketDrivers(metrics),
  };
}

export function attachMarketMomentum(data: Omit<CompanyMarketData, "marketMomentum">): CompanyMarketData {
  return {
    ...data,
    marketMomentum: calculateMarketMomentumScore(data.metrics),
  };
}
