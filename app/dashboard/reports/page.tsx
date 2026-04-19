"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Filter,
  RefreshCw,
  Eye,
  Share,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RiskBadge } from "@/components/ui/risk-badge";
import { RiskTrendChart } from "@/components/charts/risk-trend-chart";
import { RiskDistributionChart } from "@/components/charts/risk-distribution-chart";
import { mockCompanies, mockRiskTrend, mockDashboardStats } from "@/lib/mock";

type ReportType = "risk-summary" | "fraud-analysis" | "benchmark" | "trend-analysis";

interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  generatedAt: string;
  status: "ready" | "generating" | "failed";
  downloadUrl?: string;
}

const mockReports: Report[] = [
  {
    id: "1",
    title: "Portfolio Risk Summary - Q1 2024",
    description: "Comprehensive risk assessment across all monitored companies",
    type: "risk-summary",
    generatedAt: "2024-03-31T10:00:00Z",
    status: "ready",
    downloadUrl: "/reports/risk-summary-q1-2024.pdf",
  },
  {
    id: "2",
    title: "Fraud Signal Analysis Report",
    description: "Detailed analysis of fraud indicators and red flags",
    type: "fraud-analysis",
    generatedAt: "2024-03-28T14:30:00Z",
    status: "ready",
    downloadUrl: "/reports/fraud-analysis-mar-2024.pdf",
  },
  {
    id: "3",
    title: "Industry Benchmark Report",
    description: "Peer comparison analysis across sectors",
    type: "benchmark",
    generatedAt: "2024-03-25T09:15:00Z",
    status: "ready",
    downloadUrl: "/reports/benchmark-mar-2024.pdf",
  },
  {
    id: "4",
    title: "Risk Trend Analysis - 12 Months",
    description: "Historical risk score trends and projections",
    type: "trend-analysis",
    generatedAt: "2024-03-20T16:45:00Z",
    status: "ready",
    downloadUrl: "/reports/trend-analysis-12m.pdf",
  },
];

export default function ReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState<ReportType | "all">("all");
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredReports = selectedReportType === "all"
    ? mockReports
    : mockReports.filter(r => r.type === selectedReportType);

  const handleGenerateReport = async (type: ReportType) => {
    setIsGenerating(true);
    // Simulate API call - in real app, would call API with type
    console.log(`Generating ${type} report`);
    setTimeout(() => {
      setIsGenerating(false);
      // In real app, would add new report to list
    }, 3000);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download comprehensive financial analysis reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate New Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="generated">Generated Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockReports.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Reports</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockReports.filter(r => r.type === "risk-summary").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Most requested
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fraud Analysis</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockReports.filter(r => r.type === "fraud-analysis").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Critical insights
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Generation Time</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3m</div>
                <p className="text-xs text-muted-foreground">
                  -15% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Report Types */}
          <Card>
            <CardHeader>
              <CardTitle>Available Report Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Risk Summary Report</h3>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive risk assessment with key metrics
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleGenerateReport("risk-summary")}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Report"
                    )}
                  </Button>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Fraud Analysis Report</h3>
                      <p className="text-sm text-muted-foreground">
                        Detailed fraud signal detection and analysis
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleGenerateReport("fraud-analysis")}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Report"
                    )}
                  </Button>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <PieChart className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Benchmark Report</h3>
                      <p className="text-sm text-muted-foreground">
                        Peer comparison and industry benchmarking
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleGenerateReport("benchmark")}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Report"
                    )}
                  </Button>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Trend Analysis Report</h3>
                      <p className="text-sm text-muted-foreground">
                        Historical trends and future projections
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleGenerateReport("trend-analysis")}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Report"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generated" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <Select value={selectedReportType} onValueChange={(value) => value && setSelectedReportType(value as ReportType | "all")}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="risk-summary">Risk Summary</SelectItem>
                <SelectItem value="fraud-analysis">Fraud Analysis</SelectItem>
                <SelectItem value="benchmark">Benchmark</SelectItem>
                <SelectItem value="trend-analysis">Trend Analysis</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {report.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {report.type.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(report.generatedAt)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={report.status === "ready" ? "default" : report.status === "generating" ? "secondary" : "destructive"}
                          className="capitalize"
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share className="h-4 w-4" />
                          </Button>
                          {report.downloadUrl && (
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Score Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <RiskTrendChart data={mockRiskTrend} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <RiskDistributionChart data={mockDashboardStats.riskDistribution} />
              </CardContent>
            </Card>
          </div>

          {/* Top Risk Companies */}
          <Card>
            <CardHeader>
              <CardTitle>Companies by Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Fraud Risk</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCompanies
                    .sort((a, b) => b.riskScore - a.riskScore)
                    .slice(0, 5)
                    .map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-muted-foreground">{company.ticker}</div>
                        </TableCell>
                        <TableCell>{company.sector}</TableCell>
                        <TableCell>
                          <RiskBadge tier={company.riskTier} />
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={company.fraudRisk === "high" ? "destructive" : company.fraudRisk === "medium" ? "secondary" : "outline"}
                            className="capitalize"
                          >
                            {company.fraudRisk}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(company.lastUpdated).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}