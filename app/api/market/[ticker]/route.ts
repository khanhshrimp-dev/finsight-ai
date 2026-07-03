import { NextRequest, NextResponse } from "next/server";
import { getMockMarketDataByTicker } from "@/lib/market";
import type { MarketTickerResponse } from "@/types/api";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const data = getMockMarketDataByTicker(ticker);

  if (!data) {
    return NextResponse.json(
      { error: `No mock market data found for ticker ${ticker.toUpperCase()}.` },
      { status: 404 }
    );
  }

  const response: MarketTickerResponse = {
    data,
    limitations: [
      "Mock provider only; no real-time or paid market data is called.",
      "Historical prices, volume, volatility, market cap, and moving averages are demo fixtures.",
      "Market Momentum Score is a research signal, not an investment recommendation.",
    ],
  };

  return NextResponse.json(response);
}
