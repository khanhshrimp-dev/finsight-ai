import { NextRequest, NextResponse } from "next/server";
import { getCompanyById } from "@/lib/mock";
import { analyzeRisk } from "@/lib/risk";
import { getMockMarketDataByTicker } from "@/lib/market";
import { getMockNewsDataByTicker } from "@/lib/news";
import { calculateInvestmentHealthScore } from "@/lib/investment";
import type { InvestmentAnalyzeRequest, InvestmentAnalyzeResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InvestmentAnalyzeRequest;
    const company = body.companyId ? getCompanyById(body.companyId) : undefined;
    const ticker = (body.ticker ?? company?.ticker)?.trim().toUpperCase();

    if (!ticker) {
      return NextResponse.json(
        { error: "Provide either companyId or ticker." },
        { status: 400 }
      );
    }

    const latestPeriod = company?.periods[company.periods.length - 1];
    const previousPeriod =
      company && company.periods.length > 1
        ? company.periods[company.periods.length - 2]
        : null;
    const riskAnalysis = latestPeriod
      ? analyzeRisk(latestPeriod.metrics, {
          currentPeriod: latestPeriod,
          previousPeriod,
        })
      : null;
    const market = getMockMarketDataByTicker(ticker);
    const news = getMockNewsDataByTicker(ticker);

    const contextualRiskScore =
      riskAnalysis && company
        ? Math.max(riskAnalysis.riskScore, company.riskScore)
        : riskAnalysis?.riskScore ?? company?.riskScore;
    const riskScore = body.scores?.riskScore ?? contextualRiskScore ?? 50;
    const financialHealthScore =
      body.scores?.financialHealthScore ??
      Math.round(100 - (riskAnalysis?.riskScore ?? riskScore));
    const marketMomentumScore =
      body.scores?.marketMomentumScore ?? market?.marketMomentum.score ?? 50;
    const newsSentimentScore =
      body.scores?.newsSentimentScore ?? news?.sentiment.score ?? 55;
    const valuationScore = body.valuationScore ?? body.scores?.valuationScore ?? 50;

    const investmentHealth = calculateInvestmentHealthScore({
      financialHealthScore,
      riskScore,
      marketMomentumScore,
      newsSentimentScore,
      valuationScore,
    });

    const response: InvestmentAnalyzeResponse = {
      companyId: company?.id ?? market?.companyId ?? news?.companyId,
      companyName: company?.name ?? market?.companyName ?? news?.companyName,
      ticker,
      financialHealthScore,
      riskScore,
      marketMomentumScore,
      newsSentimentScore,
      valuationScore,
      investmentHealth,
      market,
      news,
      generatedAt: new Date().toISOString(),
      limitations: [
        "Mock market and news providers only.",
        "Valuation score is a placeholder until valuation models and real market multiples are added.",
        "Investment Health Score is not a buy, sell, hold, credit rating, audit opinion, or fraud finding.",
      ],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Investment analyze API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
