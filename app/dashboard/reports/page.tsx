"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Download,
  Eye,
  FileText,
  LineChart,
  Newspaper,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart";
import { RiskTrendChart } from "@/components/charts/risk-trend-chart";
import { mockRiskTrend } from "@/lib/mock";
import {
  companyIntelligence,
  portfolioIntelligenceStats,
} from "@/lib/mock/company-intelligence";
import { cn } from "@/lib/utils";

type ReportType =
  | "company_snapshot"
  | "financial_health"
  | "risk_assessment"
  | "investment_health"
  | "news_market"
  | "scenario_analysis";

interface ReportTemplate {
  type: ReportType;
  title: string;
  description: string;
  icon: typeof FileText;
  sections: string[];
}

const reportTemplates: ReportTemplate[] = [
  {
    type: "company_snapshot",
    title: "Company Snapshot",
    description: "One-page company profile with financials, risk, market, news, and alerts.",
    icon: FileText,
    sections: ["Business profile", "Latest financials", "Key risks", "Recent alerts"],
  },
  {
    type: "financial_health",
    title: "Financial Health Report",
    description: "Detailed liquidity, leverage, profitability, cash-flow, and growth review.",
    icon: BarChart3,
    sections: ["Financial health score", "Ratio trend", "Benchmark context", "Watch items"],
  },
  {
    type: "risk_assessment",
    title: "Risk Assessment Memo",
    description: "Deterministic risk score, drivers, fraud screens, and monitoring actions.",
    icon: ShieldAlert,
    sections: ["Risk score", "Top drivers", "Fraud signals", "Recommended reviews"],
  },
  {
    type: "investment_health",
    title: "Investment Health Brief",
    description: "Composite research signal across financial, risk, market, news, and valuation placeholder inputs.",
    icon: Sparkles,
    sections: ["Composite score", "Component weights", "Drivers", "Research limitations"],
  },
  {
    type: "news_market",
    title: "News & Market Intelligence Report",
    description: "Mock price momentum, volume, volatility, news sentiment, severity, and event timeline.",
    icon: Newspaper,
    sections: ["Market momentum", "News sentiment", "Recent events", "Signal conflicts"],
  },
  {
    type: "scenario_analysis",
    title: "Scenario Analysis Report",
    description: "Before/after deterministic risk, health, and investment-health scenario memo.",
    icon: LineChart,
    sections: ["Scenario assumptions", "Risk delta", "Driver impact", "Management actions"],
  },
];

const generatedReports = [
  {
    id: "report-apxt-snapshot",
    title: "Apex Technologies Company Snapshot",
    type: "company_snapshot" as ReportType,
    companyId: "apex-technologies",
    createdAt: "2026-07-03T15:20:00.000Z",
    status: "ready",
    pages: 4,
  },
  {
    id: "report-rrgi-risk",
    title: "Redstone Retail Risk Assessment Memo",
    type: "risk_assessment" as ReportType,
    companyId: "redstone-retail",
    createdAt: "2026-07-02T18:45:00.000Z",
    status: "ready",
    pages: 7,
  },
  {
    id: "report-nspr-news-market",
    title: "Northstar News & Market Intelligence Report",
    type: "news_market" as ReportType,
    companyId: "northstar-properties",
    createdAt: "2026-07-01T09:10:00.000Z",
    status: "ready",
    pages: 6,
  },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function scoreColor(score: number, inverted = false) {
  if (inverted) {
    if (score >= 70) return "text-red-600 dark:text-red-400";
    if (score >= 50) return "text-orange-600 dark:text-orange-400";
    return "text-emerald-600 dark:text-emerald-400";
  }
  if (score >= 70) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export default function ReportsPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(companyIntelligence[0].company.id);
  const [selectedReportType, setSelectedReportType] = useState<ReportType>("company_snapshot");
  const [isGenerating, setIsGenerating] = useState(false);
  const selectedCompany =
    companyIntelligence.find((item) => item.company.id === selectedCompanyId) ?? companyIntelligence[0];
  const selectedTemplate =
    reportTemplates.find((template) => template.type === selectedReportType) ?? reportTemplates[0];

  const filteredReports = useMemo(
    () =>
      generatedReports.map((report) => ({
        ...report,
        company: companyIntelligence.find((item) => item.company.id === report.companyId)?.company,
        template: reportTemplates.find((template) => template.type === report.type),
      })),
    []
  );

  const handleGenerate = () => {
    setIsGenerating(true);
    window.setTimeout(() => setIsGenerating(false), 1200);
  };

  const previewBullets = [
    `Financial Health Score: ${selectedCompany.financialHealthScore}/100`,
    `Risk Score: ${selectedCompany.riskScore}/100 (${selectedCompany.riskLabel})`,
    `Investment Health: ${selectedCompany.investmentHealth.score}/100 (${selectedCompany.investmentHealth.label})`,
    `Market Momentum: ${selectedCompany.marketMomentumScore}/100`,
    `News Sentiment: ${selectedCompany.newsSentimentScore}/100 with ${selectedCompany.negativeNewsCount} negative event(s)`,
    `Alerts: ${selectedCompany.unreadAlertCount} unread of ${selectedCompany.alertCount} total`,
  ];

  return (
    <DashboardPageShell maxWidth="wide">
      <PageHeader
        eyebrow="Report Workspace"
        title="Reports"
        description="Build mock analyst reports from local financial, risk, market, news, and investment-health data."
        icon={FileText}
        iconClassName="text-indigo-600 dark:text-indigo-400"
        actions={
          <>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleGenerate} disabled={isGenerating}>
            <FileText className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Preview"}
          </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Report Templates</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{reportTemplates.length}</p>
            <p className="text-xs text-muted-foreground">Mock analyst formats</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Generated Reports</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">{generatedReports.length}</p>
            <p className="text-xs text-muted-foreground">Local metadata only</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Avg Risk</p>
            <p className={cn("mt-1 text-3xl font-bold tabular-nums", scoreColor(portfolioIntelligenceStats.averageRiskScore, true))}>
              {portfolioIntelligenceStats.averageRiskScore}
            </p>
            <p className="text-xs text-muted-foreground">Portfolio context</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Mock Exports</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">JSON</p>
            <p className="text-xs text-muted-foreground">PDF/DOCX not implemented</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Builder</CardTitle>
              <CardDescription>Select a company and report type for a mock preview.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Company</p>
                <Select
                  value={selectedCompanyId}
                  onValueChange={(value) => {
                    if (value) setSelectedCompanyId(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyIntelligence.map((item) => (
                      <SelectItem key={item.company.id} value={item.company.id}>
                        {item.company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Report Type</p>
                <Select value={selectedReportType} onValueChange={(value) => setSelectedReportType(value as ReportType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTemplates.map((template) => (
                      <SelectItem key={template.type} value={template.type}>
                        {template.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                Mock generation returns an on-screen preview and JSON-ready content only. Real PDF/DOCX export belongs to a later reporting phase.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Templates</CardTitle>
              <CardDescription>Report formats supported by the demo UI.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reportTemplates.map((template) => {
                const Icon = template.icon;
                const selected = template.type === selectedReportType;
                return (
                  <button
                    key={template.type}
                    onClick={() => setSelectedReportType(template.type)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left transition-colors",
                      selected ? "border-primary/40 bg-primary/5" : "hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{template.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>{selectedTemplate.title} Preview</CardTitle>
                  <CardDescription>
                    {selectedCompany.company.name} · {selectedCompany.company.ticker} · {selectedCompany.company.exchange}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                    JSON
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Financial Health</p>
                  <p className={cn("text-2xl font-bold tabular-nums", scoreColor(selectedCompany.financialHealthScore))}>
                    {selectedCompany.financialHealthScore}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Risk Score</p>
                  <p className={cn("text-2xl font-bold tabular-nums", scoreColor(selectedCompany.riskScore, true))}>
                    {selectedCompany.riskScore}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Investment Health</p>
                  <p className={cn("text-2xl font-bold tabular-nums", scoreColor(selectedCompany.investmentHealth.score))}>
                    {selectedCompany.investmentHealth.score}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">Included Sections</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.sections.map((section) => (
                    <Badge key={section} variant="outline">
                      {section}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">Preview Narrative</p>
                <div className="rounded-lg border bg-muted/25 p-4 text-sm leading-relaxed text-muted-foreground">
                  {selectedCompany.company.aiSummary}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">Preview Signals</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {previewBullets.map((item) => (
                    <div key={item} className="rounded-lg border p-3 text-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Risk Trend</CardTitle>
                <CardDescription>Shared mock trend included in portfolio reports.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <RiskTrendChart data={mockRiskTrend} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Current eight-company mock universe.</CardDescription>
              </CardHeader>
              <CardContent>
                <RiskDistributionChart data={portfolioIntelligenceStats.riskDistribution} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>Mock metadata for previously generated demo reports.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredReports.map((report) => (
            <div key={report.id} className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{report.title}</p>
                  <Badge variant="outline">{report.template?.title ?? report.type}</Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">{report.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {report.company?.name ?? "Company"} · {report.pages} pages · {formatDate(report.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/company/${report.companyId}`}>
                  <Button variant="outline" size="sm">
                    View Company
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                  Mock JSON
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardPageShell>
  );
}
