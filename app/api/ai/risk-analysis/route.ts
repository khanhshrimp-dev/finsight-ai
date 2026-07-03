import { NextRequest, NextResponse } from "next/server";
import { getCompanyById } from "@/lib/mock";
import { analyzeRisk, classifyRisk } from "@/lib/risk";
import {
  generateMockRiskAnalystResponse,
  profileFromCompany,
} from "@/lib/ai/risk-analyst";
import { getMockMarketDataByTicker } from "@/lib/market";
import { getMockNewsDataByTicker } from "@/lib/news";
import { calculateInvestmentHealthScore } from "@/lib/investment";
import type { AiRiskAnalysisRequest, AiRiskAnalysisResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AiRiskAnalysisRequest;
    const company = body.companyId ? getCompanyById(body.companyId) : undefined;
    const currentPeriod = company?.periods[company.periods.length - 1];
    const previousPeriod =
      company && company.periods.length > 1
        ? company.periods[company.periods.length - 2]
        : null;
    const metrics = body.metrics ?? currentPeriod?.metrics;

    if (!metrics) {
      return NextResponse.json(
        { error: "Provide either companyId or metrics." },
        { status: 400 }
      );
    }

    const risk = analyzeRisk(metrics, { currentPeriod, previousPeriod });
    const riskScore = company ? Math.max(risk.riskScore, company.riskScore) : risk.riskScore;
    const riskLabel = classifyRisk(riskScore);
    const market = company ? getMockMarketDataByTicker(company.ticker) : undefined;
    const news = company ? getMockNewsDataByTicker(company.ticker) : undefined;
    const financialHealthScore = Math.round(Math.max(0, Math.min(100, 100 - risk.riskScore)));
    const investmentHealth = calculateInvestmentHealthScore({
      financialHealthScore,
      riskScore,
      marketMomentumScore: market?.marketMomentum.score ?? 50,
      newsSentimentScore: news?.sentiment.score ?? 55,
      valuationScore: 50,
    });

    // TODO: Swap this mock provider for a real LLM provider implementation.
    // The numerical score must continue to come from the risk model layer.
    const analyst = generateMockRiskAnalystResponse({
      companyProfile: company ? profileFromCompany(company) : undefined,
      financialMetrics: metrics,
      riskScore,
      riskLabel,
      riskDrivers: risk.drivers,
      fraudSignals: risk.fraudSignals,
      benchmarkData: company?.benchmarkData,
      scenarioSummary: body.scenarioSummary,
      financialHealthScore,
      marketMomentumScore: market?.marketMomentum.score,
      newsSentimentScore: news?.sentiment.score,
      investmentHealthScore: investmentHealth.score,
      investmentHealthLabel: investmentHealth.label,
      recentEvents: news?.items.map((item) => ({
        title: item.title,
        eventType: item.eventType,
        sentiment: item.sentiment,
        severity: item.severity,
        riskImpact: item.riskImpact,
      })),
    });

    const response: AiRiskAnalysisResponse = {
      companyId: company?.id ?? body.companyId,
      companyName: company?.name,
      riskScore,
      riskLabel,
      analyst,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI risk analysis API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
