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
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { PremiumPanel } from "@/components/ui/premium-panel";
import {
  AnalystMemoCard,
  DemoDataNotice,
  MetricDeltaCard,
} from "@/components/ui/premium-dashboard";
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
  bestUseCase: string;
  estimatedOutput: string;
  sections: string[];
}

const reportTemplates: ReportTemplate[] = [
  {
    type: "company_snapshot",
    title: "Company Snapshot",
    description: "One-page company profile with financials, risk, market, news, and alerts.",
    icon: FileText,
    bestUseCase: "Board or IC prep when an analyst needs a fast company view.",
    estimatedOutput: "4-page memo preview",
    sections: ["Business profile", "Latest financials", "Key risks", "Recent alerts"],
  },
  {
    type: "financial_health",
    title: "Financial Health Report",
    description: "Detailed liquidity, leverage, profitability, cash-flow, and growth review.",
    icon: BarChart3,
    bestUseCase: "Credit, audit, or diligence review focused on accounting fundamentals.",
    estimatedOutput: "6-page health review",
    sections: ["Financial health score", "Ratio trend", "Benchmark context", "Watch items"],
  },
  {
    type: "risk_assessment",
    title: "Risk Assessment Memo",
    description: "Deterministic risk score, drivers, fraud screens, and monitoring actions.",
    icon: ShieldAlert,
    bestUseCase: "Risk committee review where drivers and required follow-up matter.",
    estimatedOutput: "7-page risk memo",
    sections: ["Risk score", "Top drivers", "Fraud signals", "Recommended reviews"],
  },
  {
    type: "investment_health",
    title: "Investment Health Brief",
    description: "Composite research signal across financial, risk, market, news, and valuation placeholder inputs.",
    icon: Sparkles,
    bestUseCase: "Portfolio monitoring where mixed financial, market, and news signals need synthesis.",
    estimatedOutput: "5-page research brief",
    sections: ["Composite score", "Component weights", "Drivers", "Research limitations"],
  },
  {
    type: "news_market",
    title: "News & Market Intelligence Report",
    description: "Mock price momentum, volume, volatility, news sentiment, severity, and event timeline.",
    icon: Newspaper,
    bestUseCase: "Market/news refresh before a company memo or watchlist meeting.",
    estimatedOutput: "6-page intelligence report",
    sections: ["Market momentum", "News sentiment", "Recent events", "Signal conflicts"],
  },
  {
    type: "scenario_analysis",
    title: "Scenario Analysis Report",
    description: "Before/after deterministic risk, health, and investment-health scenario memo.",
    icon: LineChart,
    bestUseCase: "Stress-case review when assumptions need a traceable before/after memo.",
    estimatedOutput: "5-page scenario memo",
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
  const generatedDate = "July 5, 2026";
  const keyRisks = selectedCompany.riskAnalysis.drivers
    .filter((driver) => driver.direction === "increases_risk")
    .slice(0, 3)
    .map((driver) => driver.explanation);
  const keyStrengths = selectedCompany.company.riskDrivers
    .filter((driver) => driver.direction === "positive")
    .slice(0, 3)
    .map((driver) => driver.description);
  const reviewActions = selectedCompany.riskAnalysis.recommendations.slice(0, 3);

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

      <DemoDataNotice
        icon={FileText}
        title="Mock report generation"
        description="Reports are professional on-screen previews backed by local demo data. PDF/DOCX generation, persistence, and provider-backed export are intentionally not implemented yet."
      />

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricDeltaCard
          label="Report templates"
          value={String(reportTemplates.length)}
          detail="Professional mock deliverable formats"
          tone="accent"
        />
        <MetricDeltaCard
          label="Generated reports"
          value={String(generatedReports.length)}
          detail="Local metadata and preview history"
          tone="info"
        />
        <MetricDeltaCard
          label="Average risk"
          value={String(portfolioIntelligenceStats.averageRiskScore)}
          detail="Portfolio context included in memos"
          tone={portfolioIntelligenceStats.averageRiskScore >= 60 ? "watch" : "good"}
        />
        <MetricDeltaCard
          label="Mock export"
          value="JSON"
          detail="PDF/DOCX belongs to a later reporting phase"
          tone="watch"
        />
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(340px,0.86fr)_minmax(0,1.14fr)]">
        <div className="space-y-4">
          <PremiumPanel className="p-5">
            <div className="mb-5">
              <h2 className="text-base font-semibold">Generate report preview</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a company and report format. Output remains an on-screen mock preview.
              </p>
            </div>
            <div className="space-y-4">
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
              <Button className="w-full gap-2" onClick={handleGenerate} disabled={isGenerating}>
                <FileText className="h-4 w-4" />
                {isGenerating ? "Generating preview..." : "Generate mock preview"}
              </Button>
            </div>
          </PremiumPanel>

          <div className="grid gap-3">
            <div>
              <h2 className="text-base font-semibold">Report type cards</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Each format is framed by purpose, best use case, sections, and estimated output.
              </p>
            </div>
              {reportTemplates.map((template) => {
                const Icon = template.icon;
                const selected = template.type === selectedReportType;
                return (
                  <button
                    key={template.type}
                    type="button"
                    onClick={() => setSelectedReportType(template.type)}
                    className={cn(
                      "w-full rounded-lg border p-4 text-left transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selected ? "border-primary/40 bg-primary/10 shadow-sm" : "border-border/70 bg-card/70 hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{template.title}</p>
                          {selected && <Badge variant="secondary">Selected</Badge>}
                        </div>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">{template.description}</p>
                        <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                          <p><span className="font-medium text-foreground">Best use:</span> {template.bestUseCase}</p>
                          <p><span className="font-medium text-foreground">Output:</span> {template.estimatedOutput}</p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {template.sections.slice(0, 3).map((section) => (
                            <Badge key={section} variant="outline" className="text-[10px]">
                              {section}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        <div className="space-y-6">
          <PremiumPanel className="p-0">
            <div className="border-b border-border/70 px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">Memo preview</Badge>
                  <h2 className="text-xl font-semibold tracking-tight">{selectedTemplate.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedCompany.company.name} · {selectedCompany.company.ticker} · Generated {generatedDate}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                    Mock JSON
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-5 p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <MetricDeltaCard label="Financial Health" value={`${selectedCompany.financialHealthScore}/100`} detail="Latest mock score" tone={selectedCompany.financialHealthScore >= 70 ? "good" : "watch"} />
                <MetricDeltaCard label="Risk Score" value={`${selectedCompany.riskScore}/100`} detail={selectedCompany.riskLabel} tone={selectedCompany.riskScore >= 70 ? "bad" : selectedCompany.riskScore >= 50 ? "watch" : "good"} />
                <MetricDeltaCard label="Investment Health" value={`${selectedCompany.investmentHealth.score}/100`} detail={selectedCompany.investmentHealth.label} tone="accent" />
              </div>

              <div className="rounded-lg border bg-background/70 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold">Executive summary</p>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{selectedCompany.company.aiSummary}</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border bg-background/70 p-4">
                  <p className="mb-3 text-sm font-semibold">Key risks</p>
                  <div className="space-y-2">
                    {(keyRisks.length > 0 ? keyRisks : previewBullets.slice(0, 3)).map((risk) => (
                      <div key={risk} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border bg-background/70 p-4">
                  <p className="mb-3 text-sm font-semibold">Key strengths</p>
                  <div className="space-y-2">
                    {(keyStrengths.length > 0 ? keyStrengths : selectedCompany.summarySignals.slice(0, 3).map((signal) => `${signal.label}: ${signal.value}`)).map((strength) => (
                      <div key={strength} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">Recommended review actions</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {reviewActions.map((action) => (
                    <div key={action} className="rounded-lg border bg-background/70 p-3 text-sm text-muted-foreground">
                      {action}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">Included sections</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.sections.map((section) => (
                    <Badge key={section} variant="outline">{section}</Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs leading-5 text-amber-700 dark:text-amber-300">
                This preview is for research and demonstration purposes only. It is not financial advice, a credit rating, audit opinion, fraud finding, or valuation conclusion.
              </div>
            </div>
          </PremiumPanel>

          <AnalystMemoCard
            icon={Sparkles}
            eyebrow="Report drafting logic"
            title="What the mock generator includes"
            summary="The preview combines local company fundamentals, deterministic risk output, market momentum, news sentiment, investment health, alerts, and analyst-style language."
            bullets={previewBullets.slice(0, 4)}
            disclaimer="Mock export buttons do not create real PDFs or DOCX files."
          />

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
