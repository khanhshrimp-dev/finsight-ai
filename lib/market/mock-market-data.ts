import type { CompanyMarketData, MarketPricePoint } from "@/types/market";
import { attachMarketMomentum, calculateMarketMetrics } from "./market-score";

interface MockMarketSeed {
  ticker: string;
  companyId: string;
  companyName: string;
  exchange: string;
  previousClose: number;
  averageVolume: number;
  marketCap: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  prices: MarketPricePoint[];
}

const asOf = "2026-07-03T21:00:00.000Z";

const dates = [
  "2025-07-03",
  "2025-08-01",
  "2025-09-02",
  "2025-10-01",
  "2025-11-03",
  "2025-12-01",
  "2026-01-02",
  "2026-02-02",
  "2026-03-02",
  "2026-04-01",
  "2026-05-01",
  "2026-06-01",
  "2026-07-03",
];

function series(closes: number[], volumes: number[], indexStart = 5200): MarketPricePoint[] {
  return closes.map((close, index) => ({
    date: dates[index],
    close,
    volume: volumes[index],
    indexClose: indexStart + index * 34,
  }));
}

const seeds: MockMarketSeed[] = [
  {
    ticker: "APXT",
    companyId: "apex-technologies",
    companyName: "Apex Technologies",
    exchange: "NASDAQ",
    previousClose: 151.62,
    averageVolume: 2_150_000,
    marketCap: 68_400_000_000,
    fiftyTwoWeekHigh: 155.2,
    fiftyTwoWeekLow: 108.4,
    prices: series(
      [112.4, 116.9, 121.2, 126.8, 130.5, 134.9, 138.6, 142.1, 145.8, 148.4, 150.2, 151.9, 153.74],
      [1_820_000, 1_940_000, 2_020_000, 2_110_000, 1_980_000, 2_060_000, 2_220_000, 2_180_000, 2_280_000, 2_360_000, 2_420_000, 2_310_000, 2_680_000]
    ),
  },
  {
    ticker: "RRGI",
    companyId: "redstone-retail",
    companyName: "Redstone Retail Group",
    exchange: "NYSE",
    previousClose: 6.31,
    averageVolume: 4_200_000,
    marketCap: 420_000_000,
    fiftyTwoWeekHigh: 22.4,
    fiftyTwoWeekLow: 5.42,
    prices: series(
      [19.8, 17.4, 15.2, 13.1, 11.9, 10.2, 8.7, 7.4, 6.9, 6.2, 6.6, 6.3, 5.88],
      [2_100_000, 2_420_000, 2_880_000, 3_200_000, 3_650_000, 4_100_000, 4_920_000, 5_380_000, 6_120_000, 7_400_000, 6_900_000, 7_850_000, 8_700_000]
    ),
  },
  {
    ticker: "NVBS",
    companyId: "novara-biosciences",
    companyName: "Novara BioSciences",
    exchange: "NASDAQ",
    previousClose: 34.82,
    averageVolume: 3_600_000,
    marketCap: 5_900_000_000,
    fiftyTwoWeekHigh: 68.15,
    fiftyTwoWeekLow: 28.4,
    prices: series(
      [41.2, 46.8, 52.1, 61.7, 66.4, 58.3, 49.6, 43.2, 38.4, 36.9, 33.6, 34.8, 31.54],
      [1_880_000, 2_240_000, 2_900_000, 4_200_000, 5_600_000, 4_850_000, 4_500_000, 4_240_000, 3_920_000, 4_600_000, 5_100_000, 4_800_000, 6_300_000]
    ),
  },
  {
    ticker: "CSCM",
    companyId: "cascade-manufacturing",
    companyName: "Cascade Manufacturing",
    exchange: "NYSE",
    previousClose: 28.96,
    averageVolume: 1_120_000,
    marketCap: 3_200_000_000,
    fiftyTwoWeekHigh: 31.3,
    fiftyTwoWeekLow: 20.8,
    prices: series(
      [21.6, 22.4, 23.2, 24.1, 24.8, 25.6, 26.4, 27.1, 27.9, 28.7, 29.4, 28.9, 29.26],
      [880_000, 940_000, 970_000, 1_040_000, 1_060_000, 1_100_000, 1_150_000, 1_210_000, 1_250_000, 1_180_000, 1_240_000, 1_120_000, 1_190_000]
    ),
  },
  {
    ticker: "MDHS",
    companyId: "meridian-health",
    companyName: "Meridian Health Systems",
    exchange: "NYSE",
    previousClose: 37.91,
    averageVolume: 1_650_000,
    marketCap: 4_700_000_000,
    fiftyTwoWeekHigh: 50.6,
    fiftyTwoWeekLow: 35.7,
    prices: series(
      [48.2, 47.6, 45.9, 44.8, 43.2, 41.7, 40.6, 39.8, 38.5, 36.9, 37.6, 37.9, 37.22],
      [1_240_000, 1_260_000, 1_310_000, 1_420_000, 1_500_000, 1_620_000, 1_680_000, 1_740_000, 1_820_000, 1_930_000, 1_760_000, 1_690_000, 1_880_000]
    ),
  },
  {
    ticker: "SLEN",
    companyId: "solara-energy",
    companyName: "Solara Energy Networks",
    exchange: "NASDAQ",
    previousClose: 18.92,
    averageVolume: 3_250_000,
    marketCap: 2_850_000_000,
    fiftyTwoWeekHigh: 34.2,
    fiftyTwoWeekLow: 15.8,
    prices: series(
      [25.4, 28.2, 31.8, 33.6, 29.7, 27.1, 24.5, 22.2, 20.4, 18.8, 16.9, 18.9, 17.64],
      [2_180_000, 2_420_000, 2_960_000, 3_880_000, 4_200_000, 3_700_000, 3_540_000, 3_680_000, 3_920_000, 4_350_000, 4_760_000, 4_180_000, 5_050_000]
    ),
  },
  {
    ticker: "HRBF",
    companyId: "harbor-foods",
    companyName: "Harbor Foods",
    exchange: "NYSE",
    previousClose: 62.55,
    averageVolume: 980_000,
    marketCap: 9_600_000_000,
    fiftyTwoWeekHigh: 64.1,
    fiftyTwoWeekLow: 51.2,
    prices: series(
      [52.8, 53.6, 54.7, 55.4, 56.8, 57.9, 58.5, 59.2, 60.1, 61.3, 62.0, 62.5, 63.12],
      [760_000, 800_000, 820_000, 870_000, 910_000, 930_000, 950_000, 990_000, 1_010_000, 1_040_000, 1_020_000, 970_000, 1_080_000]
    ),
  },
  {
    ticker: "NSPR",
    companyId: "northstar-properties",
    companyName: "Northstar Property Trust",
    exchange: "NYSE",
    previousClose: 9.15,
    averageVolume: 2_750_000,
    marketCap: 780_000_000,
    fiftyTwoWeekHigh: 19.8,
    fiftyTwoWeekLow: 7.9,
    prices: series(
      [18.6, 17.9, 16.8, 15.2, 13.4, 12.1, 10.9, 10.2, 9.7, 8.9, 8.1, 9.1, 8.42],
      [1_420_000, 1_560_000, 1_780_000, 2_020_000, 2_480_000, 2_820_000, 3_140_000, 3_600_000, 4_050_000, 4_620_000, 5_200_000, 4_760_000, 5_540_000]
    ),
  },
];

function buildMarketData(seed: MockMarketSeed): CompanyMarketData {
  const metrics = calculateMarketMetrics(
    seed.prices,
    seed.previousClose,
    seed.averageVolume,
    seed.marketCap,
    seed.fiftyTwoWeekHigh,
    seed.fiftyTwoWeekLow
  );

  return attachMarketMomentum({
    ticker: seed.ticker,
    companyId: seed.companyId,
    companyName: seed.companyName,
    currency: "USD",
    exchange: seed.exchange,
    asOf,
    provider: "mock",
    metrics,
    historicalPrices: seed.prices,
  });
}

export const mockMarketData = seeds.map(buildMarketData);

export function getMockMarketDataByTicker(ticker: string): CompanyMarketData | undefined {
  const normalizedTicker = ticker.trim().toUpperCase();
  return mockMarketData.find((item) => item.ticker === normalizedTicker);
}
