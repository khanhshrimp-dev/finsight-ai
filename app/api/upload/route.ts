import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
          errors.push({
            fileName: file.name,
            error: validation.error,
          });
          continue;
        }

        // Process file (mock processing)
        const result = await processFile(file);
        results.push(result);

      } catch {
        errors.push({
          fileName: file.name,
          error: "Processing failed",
        });
      }
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      processed: results.length,
      failed: errors.length,
      results,
      errors,
      message: `Successfully processed ${results.length} file(s)${errors.length > 0 ? `, ${errors.length} error(s)` : ""}`,
    });

  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size (max 50MB)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return { valid: false, error: "File size exceeds 50MB limit" };
  }

  // Check file type
  const allowedTypes = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/pdf",
    "text/plain",
  ];

  const allowedExtensions = [".csv", ".xlsx", ".xls", ".pdf", ".txt"];

  const hasValidType = allowedTypes.includes(file.type);
  const hasValidExtension = allowedExtensions.some(ext =>
    file.name.toLowerCase().endsWith(ext)
  );

  if (!hasValidType && !hasValidExtension) {
    return {
      valid: false,
      error: "Unsupported file type. Please upload CSV, Excel (.xlsx/.xls), PDF, or text files"
    };
  }

  return { valid: true };
}

async function processFile(file: File): Promise<{
  fileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  status: "processed" | "analyzing" | "completed";
  recordsProcessed?: number;
  analysis?: {
    type: string;
    summary: string;
    riskIndicators?: number;
    dataQuality?: "good" | "fair" | "poor";
  };
}> {
  const fileId = generateFileId();

  // Mock processing based on file type
  let analysis;
  let recordsProcessed;

  if (file.type.includes("csv") || file.name.endsWith(".csv")) {
    // Mock CSV processing
    recordsProcessed = Math.floor(Math.random() * 10000) + 1000;
    analysis = {
      type: "Financial Data Import",
      summary: `Processed ${recordsProcessed} financial records from CSV file`,
      riskIndicators: Math.floor(Math.random() * 10),
      dataQuality: ["good", "fair", "poor"][Math.floor(Math.random() * 3)] as "good" | "fair" | "poor",
    };
  } else if (file.type.includes("spreadsheet") || file.name.match(/\.(xlsx?|xls)$/)) {
    // Mock Excel processing
    recordsProcessed = Math.floor(Math.random() * 5000) + 500;
    analysis = {
      type: "Excel Financial Report",
      summary: `Extracted financial data from ${Math.floor(Math.random() * 5) + 1} worksheets`,
      riskIndicators: Math.floor(Math.random() * 8),
      dataQuality: ["good", "fair", "poor"][Math.floor(Math.random() * 3)] as "good" | "fair" | "poor",
    };
  } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    // Mock PDF processing
    analysis = {
      type: "Document Analysis",
      summary: "Extracted financial information from PDF document",
      riskIndicators: Math.floor(Math.random() * 5),
      dataQuality: "fair" as const,
    };
  } else {
    // Mock text processing
    analysis = {
      type: "Text Analysis",
      summary: "Processed text document for financial keywords and patterns",
      riskIndicators: Math.floor(Math.random() * 3),
      dataQuality: "good" as const,
    };
  }

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    fileId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || "unknown",
    status: "completed",
    recordsProcessed,
    analysis,
  };
}

function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// GET endpoint to check upload status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");

  if (!fileId) {
    return NextResponse.json(
      { error: "File ID is required" },
      { status: 400 }
    );
  }

  // Mock status check - in real app, check database
  const mockStatus = {
    fileId,
    status: "completed",
    progress: 100,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(mockStatus);
}