import { NextResponse } from "next/server";
import { getCompanyIntelligenceById } from "@/lib/mock/company-intelligence";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const company = getCompanyIntelligenceById(id);

  if (!company) {
    return NextResponse.json(
      {
        status: "error",
        mode: "mock",
        message: `No mock company found for id '${id}'.`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    status: "ok",
    mode: "mock",
    generatedAt: new Date().toISOString(),
    disclaimer:
      "Mock company data for product UI only. Scores are research signals, not investment advice, audit opinions, credit ratings, or fraud conclusions.",
    company,
  });
}
