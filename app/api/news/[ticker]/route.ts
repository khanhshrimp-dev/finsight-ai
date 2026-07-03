import { NextRequest, NextResponse } from "next/server";
import { getMockNewsDataByTicker } from "@/lib/news";
import type { NewsTickerResponse } from "@/types/api";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const data = getMockNewsDataByTicker(ticker);

  if (!data) {
    return NextResponse.json(
      { error: `No mock news data found for ticker ${ticker.toUpperCase()}.` },
      { status: 404 }
    );
  }

  const response: NewsTickerResponse = {
    data,
    limitations: [
      "Mock provider only; no real news API or scraping is called.",
      "Sentiment, event type, severity, relevance, and confidence are demo fixtures.",
      "News Sentiment Score is a research signal, not an investment recommendation.",
    ],
  };

  return NextResponse.json(response);
}
