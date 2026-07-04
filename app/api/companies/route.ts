import { NextResponse } from "next/server";
import {
  companyIntelligence,
  portfolioIntelligenceStats,
} from "@/lib/mock/company-intelligence";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    mode: "mock",
    generatedAt: new Date().toISOString(),
    disclaimer:
      "Mock company data for product UI only. Scores are research signals, not investment advice, audit opinions, credit ratings, or fraud conclusions.",
    stats: portfolioIntelligenceStats,
    companies: companyIntelligence,
  });
}
