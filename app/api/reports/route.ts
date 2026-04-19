import { NextRequest, NextResponse } from "next/server";
import { mockCompanies } from "@/lib/mock";

type ReportType = "risk-summary" | "fraud-analysis" | "benchmark" | "trend-analysis";

interface ReportRequest {
  type: ReportType;
  companyIds?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  format?: "json" | "pdf" | "xlsx";
}

export async function POST(request: NextRequest) {
  try {
    const body: ReportRequest = await request.json();
    const { type, companyIds, dateRange, format = "json" } = body;

    if (!type || !["risk-summary", "fraud-analysis", "benchmark", "trend-analysis"].includes(type)) {
      return NextResponse.json(
        { error: "Valid report type is required" },
        { status: 400 }
      );
    }

    // Filter companies if specified
    const companies = companyIds && companyIds.length > 0
      ? mockCompanies.filter(c => companyIds.includes(c.id))
      : mockCompanies;

    if (companies.length === 0) {
      return NextResponse.json(
        { error: "No companies found for the specified criteria" },
        { status: 404 }
      );
    }

    // Simulate report generation time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const report = await generateReport(type, companies, dateRange);

    if (format === "json") {
      return NextResponse.json({
        reportId: generateReportId(),
        type,
        generatedAt: new Date().toISOString(),
        companyCount: companies.length,
        dateRange,
        data: report,
      });
    } else {
      // For PDF/XLSX, return a mock download URL
      return NextResponse.json({
        reportId: generateReportId(),
        type,
        generatedAt: new Date().toISOString(),
        companyCount: companies.length,
        dateRange,
        downloadUrl: `/api/reports/download/${generateReportId()}?format=${format}`,
        format,
      });
    }
  } catch (error) {
    console.error("Reports API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateReportId(): string {
  return `report_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function generateReport(type: ReportType, companies: typeof mockCompanies, dateRange?: { start: string; end: string }) {
  switch (type) {
    case "risk-summary":
      return generateRiskSummaryReport(companies);

    case "fraud-analysis":
      return generateFraudAnalysisReport(companies);

    case "benchmark":
      return generateBenchmarkReport(companies);

    case "trend-analysis":
      return generateTrendAnalysisReport(companies, dateRange);

    default:
      throw new Error(`Unsupported report type: ${type}`);
  }
}

function generateRiskSummaryReport(companies: typeof mockCompanies) {
  const summary = {
    totalCompanies: companies.length,
    averageRiskScore: companies.reduce((sum, c) => sum + c.riskScore, 0) / companies.length,
    riskDistribution: {
      healthy: companies.filter(c => c.riskTier === "healthy").length,
      medium: companies.filter(c => c.riskTier === "medium").length,
      high: companies.filter(c => c.riskTier === "high").length,
      critical: companies.filter(c => c.riskTier === "critical").length,
    },
    topRiskCompanies: companies
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        name: c.name,
        riskScore: c.riskScore,
        riskTier: c.riskTier,
        aiSummary: c.aiSummary,
      })),
    recommendations: extractCommonRecommendations(companies),
  };

  return summary;
}

function generateFraudAnalysisReport(companies: typeof mockCompanies) {
  const summary = {
    totalCompanies: companies.length,
    fraudRiskDistribution: {
      none: companies.filter(c => c.fraudRisk === "none").length,
      low: companies.filter(c => c.fraudRisk === "low").length,
      medium: companies.filter(c => c.fraudRisk === "medium").length,
      high: companies.filter(c => c.fraudRisk === "high").length,
    },
    totalFraudSignals: companies.reduce((sum, c) => sum + c.fraudSignals.filter(s => s.detected).length, 0),
    companiesWithSignals: companies.filter(c => c.fraudSignals.some(s => s.detected)).length,
    topFraudConcerns: companies
      .filter(c => c.fraudSignals.some(s => s.detected))
      .sort((a, b) => b.fraudSignals.filter(s => s.detected).length - a.fraudSignals.filter(s => s.detected).length)
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        name: c.name,
        fraudRisk: c.fraudRisk,
        detectedSignals: c.fraudSignals.filter(s => s.detected).map(s => ({
          name: s.name,
          severity: s.severity,
          description: s.description,
        })),
      })),
    signalCategories: aggregateSignalCategories(companies),
  };

  return summary;
}

function generateBenchmarkReport(companies: typeof mockCompanies) {
  const sectors = [...new Set(companies.map(c => c.sector))];

  const benchmark = {
    sectorsAnalyzed: sectors,
    sectorSummaries: sectors.map(sector => {
      const sectorCompanies = companies.filter(c => c.sector === sector);
      return {
        sector,
        companyCount: sectorCompanies.length,
        averageRiskScore: sectorCompanies.reduce((sum, c) => sum + c.riskScore, 0) / sectorCompanies.length,
        averageFraudSignals: sectorCompanies.reduce((sum, c) => sum + c.fraudSignals.filter(s => s.detected).length, 0) / sectorCompanies.length,
        topPerformers: sectorCompanies
          .sort((a, b) => a.riskScore - b.riskScore)
          .slice(0, 3)
          .map(c => ({ id: c.id, name: c.name, riskScore: c.riskScore })),
        concerns: sectorCompanies
          .filter(c => c.riskTier === "critical" || c.fraudRisk === "high")
          .map(c => ({ id: c.id, name: c.name, riskTier: c.riskTier, fraudRisk: c.fraudRisk })),
      };
    }),
    crossSectorComparison: {
      bestPerformingSector: sectors
        .map(sector => ({
          sector,
          avgRiskScore: companies
            .filter(c => c.sector === sector)
            .reduce((sum, c) => sum + c.riskScore, 0) / companies.filter(c => c.sector === sector).length,
        }))
        .sort((a, b) => a.avgRiskScore - b.avgRiskScore)[0],
      mostConcerningSector: sectors
        .map(sector => ({
          sector,
          criticalCount: companies.filter(c => c.sector === sector && c.riskTier === "critical").length,
        }))
        .sort((a, b) => b.criticalCount - a.criticalCount)[0],
    },
  };

  return benchmark;
}

function generateTrendAnalysisReport(companies: typeof mockCompanies, _dateRange?: { start: string; end: string }) {
  // Mock trend data - in real app, this would analyze historical data
  const trends = {
    riskScoreTrend: {
      period: "Last 12 months",
      averageChange: -2.3, // points
      improving: companies.filter(() => {
        // Mock: assume some companies are improving
        return Math.random() > 0.5;
      }).length,
      deteriorating: companies.filter(() => {
        return Math.random() > 0.5;
      }).length,
    },
    fraudSignalTrend: {
      period: "Last 12 months",
      newSignals: 15,
      resolvedSignals: 8,
      netChange: 7,
    },
    sectorTrends: [...new Set(companies.map(c => c.sector))].map(sector => ({
      sector,
      riskScoreChange: (Math.random() - 0.5) * 10, // -5 to +5
      companyCount: companies.filter(c => c.sector === sector).length,
    })),
    topImprovers: companies
      .sort(() => Math.random() - 0.5) // Mock sorting
      .slice(0, 3)
      .map(c => ({
        id: c.id,
        name: c.name,
        riskScoreChange: -(Math.random() * 10 + 5), // -5 to -15 improvement
      })),
    topDecliners: companies
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => ({
        id: c.id,
        name: c.name,
        riskScoreChange: Math.random() * 15 + 5, // +5 to +20 decline
      })),
  };

  return trends;
}

function extractCommonRecommendations(companies: typeof mockCompanies): string[] {
  const allRecommendations = companies.flatMap(c => c.recommendations.map(r => r.title));
  const recommendationCounts = allRecommendations.reduce((acc, rec) => {
    acc[rec] = (acc[rec] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(recommendationCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([rec]) => rec);
}

function aggregateSignalCategories(companies: typeof mockCompanies) {
  const categories = ["revenue", "margin", "debt", "cashflow", "receivables", "accruals"] as const;
  const categoryCounts = categories.map(category => ({
    category,
    totalSignals: companies.reduce((sum, c) =>
      sum + c.fraudSignals.filter(s => s.category === category && s.detected).length, 0
    ),
    affectedCompanies: companies.filter(c =>
      c.fraudSignals.some(s => s.category === category && s.detected)
    ).length,
  }));

  return categoryCounts.sort((a, b) => b.totalSignals - a.totalSignals);
}