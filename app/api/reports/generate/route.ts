import { NextRequest, NextResponse } from "next/server";
import { mockCompanies } from "@/lib/mock";
import { analyzeRisk, classifyRisk } from "@/lib/risk";
import { generateMockRiskAnalystResponse, profileFromCompany } from "@/lib/ai/risk-analyst";
import { getMockMarketDataByTicker } from "@/lib/market";
import { getMockNewsDataByTicker } from "@/lib/news";
import { calculateInvestmentHealthScore } from "@/lib/investment";
import type { ReportGenerateRequest, ReportGenerateResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ReportGenerateRequest;

    if (
      !body.type ||
      !["risk-summary", "fraud-analysis", "benchmark", "trend-analysis", "scenario"].includes(body.type)
    ) {
      return NextResponse.json({ error: "Valid report type is required." }, { status: 400 });
    }

    const companies =
      body.companyIds && body.companyIds.length > 0
        ? mockCompanies.filter((company) => body.companyIds?.includes(company.id))
        : mockCompanies;

    if (companies.length === 0) {
      return NextResponse.json({ error: "No companies matched the request." }, { status: 404 });
    }

    // TODO: Generate real PDF artifacts and persist report metadata in Phase 8.
    const data = companies.map((company) => {
      const currentPeriod = company.periods[company.periods.length - 1];
      const previousPeriod =
        company.periods.length > 1 ? company.periods[company.periods.length - 2] : null;
      const risk = analyzeRisk(currentPeriod.metrics, { currentPeriod, previousPeriod });
      const riskScore = Math.max(risk.riskScore, company.riskScore);
      const riskLabel = classifyRisk(riskScore);
      const market = getMockMarketDataByTicker(company.ticker);
      const news = getMockNewsDataByTicker(company.ticker);
      const financialHealthScore = Math.round(Math.max(0, Math.min(100, 100 - risk.riskScore)));
      const investmentHealth = calculateInvestmentHealthScore({
        financialHealthScore,
        riskScore,
        marketMomentumScore: market?.marketMomentum.score ?? 50,
        newsSentimentScore: news?.sentiment.score ?? 55,
        valuationScore: 50,
      });
      const analyst = generateMockRiskAnalystResponse({
        companyProfile: profileFromCompany(company),
        financialMetrics: currentPeriod.metrics,
        riskScore,
        riskLabel,
        riskDrivers: risk.drivers,
        fraudSignals: risk.fraudSignals,
        benchmarkData: company.benchmarkData,
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

      return {
        company: {
          id: company.id,
          name: company.name,
          ticker: company.ticker,
          sector: company.sector,
        },
        risk,
        financialHealthScore,
        market,
        news,
        investmentHealth,
        analyst,
      };
    });

    const response: ReportGenerateResponse = {
      reportId: `mock_report_${Date.now()}`,
      type: body.type,
      format: body.format ?? "json",
      status: "mock_ready",
      generatedAt: new Date().toISOString(),
      companyCount: companies.length,
      data,
      limitations: [
        "Report content is generated from mock data.",
        "No PDF file is generated yet.",
        "Risk scores use deterministic demo scoring, not a validated ML model.",
        "Market and news sections use mock provider fixtures only.",
        "Investment Health Score is a research signal, not a recommendation.",
      ],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Report generate API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
