import { NextRequest, NextResponse } from "next/server";
import { getCompanyById } from "@/lib/mock";
import { analyzeRisk } from "@/lib/risk";
import type { RiskAnalyzeRequest, RiskAnalyzeResponse } from "@/types/api";

function latestCompanyMetrics(companyId: string) {
  const company = getCompanyById(companyId);
  if (!company) return null;

  const currentPeriod = company.periods[company.periods.length - 1];
  const previousPeriod =
    company.periods.length > 1 ? company.periods[company.periods.length - 2] : null;

  return {
    company,
    currentPeriod,
    previousPeriod,
    metrics: currentPeriod.metrics,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RiskAnalyzeRequest;
    const source = body.companyId ? latestCompanyMetrics(body.companyId) : null;
    const metrics = body.metrics ?? source?.metrics;

    if (!metrics) {
      return NextResponse.json(
        { error: "Provide either companyId or metrics." },
        { status: 400 }
      );
    }

    const analysis = analyzeRisk(metrics, {
      currentPeriod: source?.currentPeriod,
      previousPeriod: source?.previousPeriod,
    });

    // TODO: Replace this deterministic demo path with persisted model runs after
    // real financial data ingestion and model evaluation are available.
    const response: RiskAnalyzeResponse = {
      companyId: source?.company.id ?? body.companyId,
      companyName: source?.company.name,
      riskScore: analysis.riskScore,
      riskLabel: analysis.riskLabel,
      breakdown: analysis.breakdown,
      drivers: analysis.drivers,
      fraudSignals: analysis.fraudSignals,
      recommendations: analysis.recommendations,
      methodology: analysis.methodology,
      generatedAt: new Date().toISOString(),
      analysis,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Risk analyze API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
