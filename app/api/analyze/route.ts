import { NextRequest, NextResponse } from "next/server";
import { mockCompanies } from "@/lib/mock";
import type { Company } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, analysisType } = body;

    if (!companyId || typeof companyId !== "string") {
      return NextResponse.json(
        { error: "Company ID is required and must be a string" },
        { status: 400 }
      );
    }

    const company = mockCompanies.find((c) => c.id === companyId);

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    // Simulate analysis processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const analysis = generateAnalysis(company, analysisType);

    return NextResponse.json({
      companyId,
      analysisType: analysisType || "comprehensive",
      analysis,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analyze API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateAnalysis(company: Company, analysisType?: string) {
  const latestPeriod = company.periods[company.periods.length - 1];
  const latestMetrics = latestPeriod?.metrics;

  switch (analysisType) {
    case "risk":
      return {
        riskScore: company.riskScore,
        riskTier: company.riskTier,
        confidenceScore: company.confidenceScore,
        riskDrivers: company.riskDrivers,
        recommendations: company.recommendations,
        aiSummary: company.aiSummary,
      };

    case "fraud":
      return {
        fraudRisk: company.fraudRisk,
        fraudSignals: company.fraudSignals,
        detectedSignals: company.fraudSignals.filter(s => s.detected),
        signalCount: company.fraudSignals.filter(s => s.detected).length,
      };

    case "benchmark":
      return {
        benchmarkData: company.benchmarkData,
        peerGroup: company.benchmarkData?.peerGroup,
        sector: company.benchmarkData?.sector,
        metrics: company.benchmarkData?.metrics,
      };

    case "financial":
      return {
        periods: company.periods,
        latestPeriod,
        latestMetrics,
        trends: calculateTrends(company.periods),
      };

    default: // comprehensive
      return {
        company: {
          id: company.id,
          name: company.name,
          ticker: company.ticker,
          sector: company.sector,
          industry: company.industry,
          description: company.description,
          headquarters: company.headquarters,
          employees: company.employees,
          founded: company.founded,
        },
        riskAnalysis: {
          riskScore: company.riskScore,
          riskTier: company.riskTier,
          confidenceScore: company.confidenceScore,
          riskDrivers: company.riskDrivers,
          recommendations: company.recommendations,
          aiSummary: company.aiSummary,
        },
        fraudAnalysis: {
          fraudRisk: company.fraudRisk,
          fraudSignals: company.fraudSignals,
          detectedSignals: company.fraudSignals.filter(s => s.detected),
        },
        benchmarkAnalysis: company.benchmarkData,
        financialAnalysis: {
          periods: company.periods,
          latestPeriod,
          latestMetrics,
          trends: calculateTrends(company.periods),
        },
        alerts: company.alerts,
        timeline: company.timeline,
      };
  }
}

function calculateTrends(periods: Company["periods"]) {
  if (periods.length < 2) return null;

  const latest = periods[periods.length - 1];
  const previous = periods[periods.length - 2];

  return {
    revenueGrowth: ((latest.revenue - previous.revenue) / previous.revenue) * 100,
    netIncomeGrowth: latest.netIncome && previous.netIncome
      ? ((latest.netIncome - previous.netIncome) / Math.abs(previous.netIncome)) * 100
      : null,
    grossMarginChange: latest.metrics && previous.metrics
      ? latest.metrics.grossMargin - previous.metrics.grossMargin
      : null,
    currentRatioChange: latest.metrics && previous.metrics
      ? latest.metrics.currentRatio - previous.metrics.currentRatio
      : null,
  };
}