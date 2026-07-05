"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Database,
  CloudUpload,
  FileSpreadsheet,
  FileImage,
  File,
  ClipboardCheck,
  Sparkles,
  TableProperties,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { AnalystMemoCard, DemoDataNotice, MetricDeltaCard } from "@/components/ui/premium-dashboard";
import { PremiumPanel } from "@/components/ui/premium-panel";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  error?: string;
}

interface ManualFinancialInput {
  companyName: string;
  ticker: string;
  revenue: string;
  netIncome: string;
  currentRatio: string;
  debtToEquity: string;
}

const acceptedFileTypes = {
  "text/csv": [".csv"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.ms-excel": [".xls"],
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
};

const sampleDatasets = [
  {
    id: "healthy-tech",
    name: "Healthy SaaS company",
    rows: 4,
    status: "Valid",
    preview: ["FY2024", "$13.1B revenue", "17.0% net margin", "3.71x current ratio"],
  },
  {
    id: "distressed-retail",
    name: "Distressed retail company",
    rows: 4,
    status: "Warnings",
    preview: ["FY2024", "$3.2B revenue", "-13.0% net margin", "0.50x current ratio"],
  },
  {
    id: "real-estate-watchlist",
    name: "Real estate refinancing watchlist",
    rows: 4,
    status: "Warnings",
    preview: ["FY2024", "$2.1B revenue", "-4.0% net margin", "3.25x debt/equity"],
  },
];

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.includes("spreadsheet") || type.includes("excel")) return FileSpreadsheet;
  if (type.includes("pdf")) return FileText;
  if (type.includes("image")) return FileImage;
  return File;
};

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState(sampleDatasets[0].id);
  const [manualInput, setManualInput] = useState<ManualFinancialInput>({
    companyName: "Demo Manufacturing Co.",
    ticker: "DMFG",
    revenue: "1250",
    netIncome: "84",
    currentRatio: "1.45",
    debtToEquity: "0.82",
  });
  const [analysisState, setAnalysisState] = useState<"idle" | "validating" | "ready">("idle");
  const selectedSample = sampleDatasets.find((sample) => sample.id === selectedSampleId) ?? sampleDatasets[0];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateFile = (file: File): string | null => {
    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return "File size must be less than 50MB";
    }

    // Check file type
    const isValidType = Object.keys(acceptedFileTypes).includes(file.type) ||
                       Object.values(acceptedFileTypes).flat().some(ext =>
                         file.name.toLowerCase().endsWith(ext)
                       );

    if (!isValidType) {
      return "Unsupported file type. Please upload CSV, Excel, PDF, or text files";
    }

    return null;
  };

  const processFile = async (file: File): Promise<UploadedFile> => {
    const id = Math.random().toString(36).slice(2, 10);
    const uploadedFile: UploadedFile = {
      id,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    };

    setFiles(prev => [...prev, uploadedFile]);

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setFiles(prev => prev.map(f =>
        f.id === id ? { ...f, progress } : f
      ));
    }

    // Simulate processing
    setFiles(prev => prev.map(f =>
      f.id === id ? { ...f, status: "processing" as const } : f
    ));

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Complete
    setFiles(prev => prev.map(f =>
      f.id === id ? { ...f, status: "completed" as const } : f
    ));

    return uploadedFile;
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => !validateFile(file));

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      await Promise.all(validFiles.map(processFile));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      const error = validateFile(file);
      if (error) {
        // In real app, show error toast
        console.error(error);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      await Promise.all(validFiles.map(processFile));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }

    // Reset input
    e.target.value = "";
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateManualInput = (key: keyof ManualFinancialInput, value: string) => {
    setManualInput((current) => ({ ...current, [key]: value }));
    setAnalysisState("idle");
  };

  const runMockAnalysis = () => {
    setAnalysisState("validating");
    window.setTimeout(() => setAnalysisState("ready"), 900);
  };

  const getStatusColor = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <DashboardPageShell maxWidth="wide">
      <PageHeader
        eyebrow="Mock Intake"
        title="Data Upload"
        description="Preview file validation, sample datasets, and manual financial inputs without real parsing or persistence."
        icon={CloudUpload}
        iconClassName="text-sky-600 dark:text-sky-400"
      />

      <DemoDataNotice
        title="Upload functionality is currently mocked"
        description="This page validates formats, simulates upload progress, and previews rows in local UI state only. It does not parse documents, persist files, call provider APIs, or enrich company records."
        icon={ClipboardCheck}
      />

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricDeltaCard
          label="Accepted formats"
          value="CSV/XLS/PDF"
          detail="The UI accepts spreadsheet, PDF, text, and CSV extensions for the mock flow."
          tone="info"
        />
        <MetricDeltaCard
          label="Max upload"
          value="50MB"
          detail="Client-side size checks prevent oversized mock files from entering progress state."
        />
        <MetricDeltaCard
          label="Sample sets"
          value={`${sampleDatasets.length}`}
          detail="Seeded datasets cover healthy, distressed, and refinancing-watchlist cases."
          tone="good"
        />
        <MetricDeltaCard
          label="Persistence"
          value="Off"
          delta="Mock"
          detail="No file contents leave this browser session in the current prototype."
          tone="watch"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Upload Area */}
        <div className="min-w-0">
          <PremiumPanel className="p-5">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
                  <CloudUpload className="h-5 w-5 text-primary" aria-hidden="true" />
                  File Intake
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Stage documents for validation and preview the intended parser flow before any real ingestion exists.
                </p>
              </div>
              <Badge variant="outline" className="w-fit">Local simulation</Badge>
            </div>
            <div className="space-y-4">
              {/* Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200",
                  isDragOver
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-background/60",
                  "hover:border-primary/45"
                )}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg border bg-card text-primary">
                  <Upload className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {isDragOver ? "Drop files here" : "Drag & drop files here"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse local files to preview validation, progress, and parser-ready rows.
                </p>
                <input
                  type="file"
                  multiple
                  accept={Object.keys(acceptedFileTypes).join(",")}
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />
                <Button
                  variant="outline"
                  disabled={isUploading}
                  className="cursor-pointer"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Choose Files
                    </>
                  )}
                </Button>
              </div>

              {/* Supported Formats */}
              <div className="rounded-lg border bg-background/60 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-2">Supported formats</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">CSV</Badge>
                  <Badge variant="secondary">Excel (.xlsx, .xls)</Badge>
                  <Badge variant="secondary">PDF</Badge>
                  <Badge variant="secondary">Text files</Badge>
                </div>
                <p className="mt-2">Maximum file size: 50MB</p>
              </div>
            </div>
          </PremiumPanel>

          <div className="mt-6 grid gap-6 2xl:grid-cols-2">
            <PremiumPanel className="p-5">
              <div className="mb-4">
                <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
                  <Database className="h-5 w-5 text-primary" aria-hidden="true" />
                  Sample Dataset
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Load representative cases for demo-only upload and scoring previews.
                </p>
              </div>
              <div className="space-y-4">
                <select
                  value={selectedSampleId}
                  onChange={(event) => {
                    setSelectedSampleId(event.target.value);
                    setAnalysisState("idle");
                  }}
                  className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30"
                >
                  {sampleDatasets.map((sample) => (
                    <option key={sample.id} value={sample.id} className="bg-background">
                      {sample.name}
                    </option>
                  ))}
                </select>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{selectedSample.name}</p>
                    <Badge variant={selectedSample.status === "Valid" ? "secondary" : "outline"}>
                      {selectedSample.status}
                    </Badge>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {selectedSample.preview.map((item) => (
                      <div key={item} className="rounded-md bg-background px-3 py-2 text-xs">
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {selectedSample.rows} fiscal periods will be loaded into the mock parser preview.
                  </p>
                </div>
              </div>
            </PremiumPanel>

            <PremiumPanel className="p-5">
              <div className="mb-4">
                <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
                  <FileSpreadsheet className="h-5 w-5 text-primary" aria-hidden="true" />
                  Manual Financial Input
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Enter a minimal statement snapshot to compare against sample rows.
                </p>
              </div>
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {([
                    ["companyName", "Company Name"],
                    ["ticker", "Ticker"],
                    ["revenue", "Revenue ($M)"],
                    ["netIncome", "Net Income ($M)"],
                    ["currentRatio", "Current Ratio"],
                    ["debtToEquity", "Debt / Equity"],
                  ] as const).map(([key, label]) => (
                    <label key={key} className="space-y-1.5">
                      <span className="text-xs font-medium text-muted-foreground">{label}</span>
                      <input
                        value={manualInput[key]}
                        onChange={(event) => updateManualInput(key, event.target.value)}
                        className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </PremiumPanel>
          </div>

          <PremiumPanel className="mt-6 p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
                  <TableProperties className="h-5 w-5 text-primary" aria-hidden="true" />
                  Parsing Preview & Validation
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Compare sample and manual rows before sending the data into the mock analysis state.
                </p>
              </div>
              <Badge variant={analysisState === "ready" ? "secondary" : "outline"} className="w-fit">
                {analysisState === "ready" ? "Ready for review" : "Awaiting validation"}
              </Badge>
            </div>
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-3 py-2 text-left">Source</th>
                      <th className="px-3 py-2 text-left">Company</th>
                      <th className="px-3 py-2 text-right">Revenue</th>
                      <th className="px-3 py-2 text-right">Net Income</th>
                      <th className="px-3 py-2 text-right">Current Ratio</th>
                      <th className="px-3 py-2 text-right">Debt / Equity</th>
                      <th className="px-3 py-2 text-left">Validation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-3 py-2">Sample</td>
                      <td className="px-3 py-2">{selectedSample.name}</td>
                      <td className="px-3 py-2 text-right">{selectedSample.preview[1]}</td>
                      <td className="px-3 py-2 text-right">{selectedSample.preview[2]}</td>
                      <td className="px-3 py-2 text-right">{selectedSample.preview[3]}</td>
                      <td className="px-3 py-2 text-right">Mock</td>
                      <td className="px-3 py-2">
                        <Badge variant="outline">{selectedSample.status}</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">Manual</td>
                      <td className="px-3 py-2">{manualInput.companyName} ({manualInput.ticker})</td>
                      <td className="px-3 py-2 text-right">${manualInput.revenue}M</td>
                      <td className="px-3 py-2 text-right">${manualInput.netIncome}M</td>
                      <td className="px-3 py-2 text-right">{manualInput.currentRatio}x</td>
                      <td className="px-3 py-2 text-right">{manualInput.debtToEquity}x</td>
                      <td className="px-3 py-2">
                        <Badge variant="secondary">Ready</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background/70 p-4">
                <div>
                  <p className="text-sm font-semibold">Mock validation state</p>
                  <p className="text-xs text-muted-foreground">
                    Required columns are present. Real parsing and persistence are not implemented in this sprint.
                  </p>
                </div>
                <Button onClick={runMockAnalysis} disabled={analysisState === "validating"}>
                  {analysisState === "validating" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Validating
                    </>
                  ) : analysisState === "ready" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Analysis Ready
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Analyze Mock Data
                    </>
                  )}
                </Button>
              </div>
            </div>
          </PremiumPanel>

          {/* Upload Progress */}
          {files.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Upload Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {files.map((file) => {
                    const FileIcon = getFileIcon(file.type);
                    return (
                      <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <FileIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <div className="flex items-center gap-2">
                              <span className={cn("text-sm", getStatusColor(file.status))}>
                                {file.status}
                              </span>
                              {getStatusIcon(file.status)}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {formatFileSize(file.size)}
                          </p>
                          {(file.status === "uploading" || file.status === "processing") && (
                            <Progress value={file.progress} className="h-2" />
                          )}
                          {file.error && (
                            <Alert variant="destructive" className="mt-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{file.error}</AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="min-w-0 space-y-6">
          <AnalystMemoCard
            eyebrow="Intake guidance"
            title="What should happen before real ingestion?"
            summary="The current screen should teach the future upload workflow without implying that files are parsed, persisted, or enriched today."
            bullets={[
              "Accepted formats, size limits, and validation status are visible before analysis.",
              "Sample and manual entries show the shape of the target financial dataset.",
              "Mock progress helps test loading, error, and ready states without backend dependencies.",
            ]}
            disclaimer="Real upload parsing, storage, provider mapping, and audit trails remain future implementation work."
            icon={Sparkles}
          />

          {/* Quick Actions */}
          <PremiumPanel className="p-5">
            <h2 className="text-base font-semibold tracking-tight">Quick Actions</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Preview intended next steps without triggering external calls.
            </p>
            <div className="mt-4 space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                Preview Database Mapping
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CloudUpload className="h-4 w-4 mr-2" />
                Preview API Import
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Load Sample Data
              </Button>
            </div>
          </PremiumPanel>

          {/* Upload History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Q4_2023_financials.xlsx</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">company_list.csv</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Processing Info */}
          <Card>
            <CardHeader>
              <CardTitle>Data Processing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">What happens next?</p>
                <ol className="mt-2 space-y-1 text-muted-foreground list-decimal list-inside">
                  <li>Files are validated in local UI state</li>
                  <li>Sample fields are shown in the preview table</li>
                  <li>Mock analysis status is updated on screen</li>
                  <li>No records are persisted or sent to a provider</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageShell>
  );
}
