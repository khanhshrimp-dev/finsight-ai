import { NextRequest, NextResponse } from "next/server";
import { getCompanyById } from "@/lib/mock";
import { calculateScenarioDelta } from "@/lib/risk";
import type { RiskSimulateRequest, RiskSimulateResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RiskSimulateRequest;
    const company = body.companyId ? getCompanyById(body.companyId) : undefined;
    const latestPeriod = company?.periods[company.periods.length - 1];
    const baseMetrics = body.baseMetrics ?? latestPeriod?.metrics;
    const scenarioMetrics = body.scenarioMetrics;

    if (!baseMetrics || !scenarioMetrics) {
      return NextResponse.json(
        { error: "Provide baseMetrics and scenarioMetrics, or companyId with scenarioMetrics." },
        { status: 400 }
      );
    }

    // TODO: Replace deterministic scoring with the production model service
    // once calibrated model predictions are available.
    const response: RiskSimulateResponse = {
      companyId: company?.id ?? body.companyId,
      companyName: company?.name,
      result: calculateScenarioDelta(baseMetrics, scenarioMetrics),
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Risk simulate API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
