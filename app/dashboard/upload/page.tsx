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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

const acceptedFileTypes = {
  "text/csv": [".csv"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "application/vnd.ms-excel": [".xls"],
  "application/pdf": [".pdf"],
  "text/plain": [".txt"],
};

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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Upload</h1>
          <p className="text-muted-foreground">
            Upload financial data files to analyze and monitor companies
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudUpload className="h-5 w-5" />
                Upload Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  isDragOver
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    : "border-gray-300 dark:border-gray-600",
                  "hover:border-gray-400 dark:hover:border-gray-500"
                )}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">
                  {isDragOver ? "Drop files here" : "Drag & drop files here"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse files
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
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">Supported formats:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">CSV</Badge>
                  <Badge variant="secondary">Excel (.xlsx, .xls)</Badge>
                  <Badge variant="secondary">PDF</Badge>
                  <Badge variant="secondary">Text files</Badge>
                </div>
                <p className="mt-2">Maximum file size: 50MB</p>
              </div>
            </CardContent>
          </Card>

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
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                Connect Database
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CloudUpload className="h-4 w-4 mr-2" />
                Import from API
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Sample Data
              </Button>
            </CardContent>
          </Card>

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
                  <li>Files are validated and processed</li>
                  <li>Data is extracted and normalized</li>
                  <li>Risk analysis is performed</li>
                  <li>Results are added to your dashboard</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}