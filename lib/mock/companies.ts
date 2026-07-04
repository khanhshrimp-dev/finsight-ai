import type { Company, FinancialPeriod, FinancialMetrics } from "@/types";

function calcMetrics(p: Omit<FinancialPeriod, "metrics">, prevRevenue?: number): FinancialMetrics {
  return {
    currentRatio: p.currentAssets / p.currentLiabilities,
    quickRatio: (p.currentAssets - p.inventory) / p.currentLiabilities,
    debtToEquity: (p.shortTermDebt + p.longTermDebt) / p.totalEquity,
    interestCoverage: p.operatingIncome / (p.interestExpense || 1),
    grossMargin: p.grossProfit / p.revenue,
    netMargin: p.netIncome / p.revenue,
    ebitdaMargin: p.ebitda / p.revenue,
    roa: p.netIncome / p.totalAssets,
    roe: p.netIncome / p.totalEquity,
    operatingCashFlowRatio: p.operatingCashFlow / p.currentLiabilities,
    revenueGrowth: prevRevenue ? (p.revenue - prevRevenue) / prevRevenue : null,
    assetTurnover: p.revenue / p.totalAssets,
    altmanZScore:
      1.2 * ((p.currentAssets - p.currentLiabilities) / p.totalAssets) +
      1.4 * (p.netIncome / p.totalAssets) +
      3.3 * (p.operatingIncome / p.totalAssets) +
      0.6 * (p.totalEquity / (p.shortTermDebt + p.longTermDebt)) +
      1.0 * (p.revenue / p.totalAssets),
    workingCapital: p.currentAssets - p.currentLiabilities,
    debtToAssets: (p.shortTermDebt + p.longTermDebt) / p.totalAssets,
  };
}

// ─── Company 1: Apex Technologies — Healthy Large-Cap ──────────────────────
const apexPeriods: FinancialPeriod[] = (() => {
  const raw = [
    { period: "FY2021", year: 2021, revenue: 8200, grossProfit: 4510, operatingIncome: 1804, netIncome: 1394, ebitda: 2050, totalAssets: 12400, totalLiabilities: 5200, totalEquity: 7200, currentAssets: 4800, currentLiabilities: 1600, cash: 2200, accountsReceivable: 1100, inventory: 480, shortTermDebt: 300, longTermDebt: 2100, interestExpense: 112, operatingCashFlow: 1950, capex: 420, freeCashFlow: 1530, riskScore: 18 },
    { period: "FY2022", year: 2022, revenue: 9600, grossProfit: 5280, operatingIncome: 2112, netIncome: 1680, ebitda: 2400, totalAssets: 14200, totalLiabilities: 5800, totalEquity: 8400, currentAssets: 5500, currentLiabilities: 1750, cash: 2800, accountsReceivable: 1250, inventory: 530, shortTermDebt: 300, longTermDebt: 2200, interestExpense: 120, operatingCashFlow: 2300, capex: 490, freeCashFlow: 1810, riskScore: 16 },
    { period: "FY2023", year: 2023, revenue: 11200, grossProfit: 6160, operatingIncome: 2464, netIncome: 1960, ebitda: 2800, totalAssets: 16500, totalLiabilities: 6200, totalEquity: 10300, currentAssets: 6400, currentLiabilities: 1900, cash: 3500, accountsReceivable: 1400, inventory: 580, shortTermDebt: 250, longTermDebt: 2300, interestExpense: 128, operatingCashFlow: 2700, capex: 560, freeCashFlow: 2140, riskScore: 14 },
    { period: "FY2024", year: 2024, revenue: 13100, grossProfit: 7205, operatingIncome: 2882, netIncome: 2227, ebitda: 3275, totalAssets: 18900, totalLiabilities: 6500, totalEquity: 12400, currentAssets: 7600, currentLiabilities: 2050, cash: 4200, accountsReceivable: 1600, inventory: 620, shortTermDebt: 200, longTermDebt: 2400, interestExpense: 134, operatingCashFlow: 3100, capex: 650, freeCashFlow: 2450, riskScore: 12 },
  ];
  return raw.map((r, i) => {
    const base = { ...r, quarter: undefined };
    const metrics = calcMetrics(base, i > 0 ? raw[i - 1].revenue : undefined);
    return { ...base, metrics };
  });
})();

export const apexTech: Company = {
  id: "apex-technologies",
  name: "Apex Technologies",
  ticker: "APXT",
  sector: "Technology",
  industry: "Enterprise Software",
  description: "Leading provider of cloud-based enterprise resource planning and analytics solutions serving Fortune 500 clients globally.",
  headquarters: "San Jose, CA",
  country: "United States",
  exchange: "NASDAQ",
  employees: 18400,
  founded: 2003,
  riskScore: 12,
  riskTier: "healthy",
  fraudRisk: "none",
  confidenceScore: 94,
  lastUpdated: "2024-12-31",
  periods: apexPeriods,
  riskDrivers: [
    { factor: "Liquidity Position", impact: 0.85, direction: "positive", description: "Current ratio of 3.7x well above industry median, substantial cash reserves", category: "liquidity" },
    { factor: "Revenue Growth", impact: 0.78, direction: "positive", description: "17% YoY growth driven by expanding cloud ARR and new enterprise wins", category: "growth" },
    { factor: "Profitability", impact: 0.72, direction: "positive", description: "Net margin of 17% consistently above sector average of 12%", category: "profitability" },
    { factor: "Debt Management", impact: 0.65, direction: "positive", description: "Debt-to-equity of 0.21x, well within safe thresholds", category: "leverage" },
    { factor: "Cash Flow Quality", impact: 0.60, direction: "positive", description: "Strong FCF conversion rate of 78%, operating CF exceeds net income", category: "efficiency" },
    { factor: "Interest Coverage", impact: -0.12, direction: "negative", description: "Slight compression in interest coverage due to capex financing", category: "leverage" },
  ],
  fraudSignals: [
    { id: "fs-a1", name: "Revenue-Cash Flow Alignment", severity: "low", detected: false, description: "Revenue growth is well-supported by proportional operating cash flow increases", category: "cashflow" },
    { id: "fs-a2", name: "Receivables Growth Anomaly", severity: "low", detected: false, description: "Accounts receivable growing in line with revenue, no unusual DSO expansion", category: "receivables" },
    { id: "fs-a3", name: "Margin Stability", severity: "low", detected: false, description: "Gross and net margins stable across periods with expected operational leverage", category: "margin" },
  ],
  benchmarkData: {
    sector: "Technology",
    peerGroup: "Enterprise Software (>$5B Revenue)",
    metrics: [
      { name: "Current Ratio", company: 3.71, industryAverage: 2.4, topQuartile: 3.2, peerMedian: 2.1, percentileRank: 82 },
      { name: "Net Margin", company: 0.17, industryAverage: 0.12, topQuartile: 0.22, peerMedian: 0.10, percentileRank: 74 },
      { name: "Revenue Growth", company: 0.17, industryAverage: 0.11, topQuartile: 0.21, peerMedian: 0.09, percentileRank: 71 },
      { name: "Debt-to-Equity", company: 0.21, industryAverage: 0.55, topQuartile: 0.18, peerMedian: 0.48, percentileRank: 88 },
      { name: "ROE", company: 0.18, industryAverage: 0.14, topQuartile: 0.24, peerMedian: 0.12, percentileRank: 69 },
      { name: "FCF Margin", company: 0.19, industryAverage: 0.10, topQuartile: 0.22, peerMedian: 0.08, percentileRank: 79 },
    ],
  },
  aiSummary: "Apex Technologies presents a strong financial profile with robust liquidity, consistent revenue growth, and disciplined capital management. The company's Altman Z-Score of 4.8 places it firmly in the 'safe zone', well above the distress threshold. Cloud transition momentum is accelerating free cash flow conversion, and debt levels remain conservative relative to peers. No material fraud risk indicators are present. This company exemplifies financial health in the enterprise software sector.",
  recommendations: [
    { id: "r-a1", priority: "low", category: "operations", title: "Monitor capex allocation efficiency", description: "As R&D and infrastructure spend scales, ensure capital is deployed to highest-ROI projects", expectedImpact: "Preserve FCF margin above 18%" },
    { id: "r-a2", priority: "low", category: "leverage", title: "Consider strategic debt for buybacks", description: "Low leverage profile offers capacity to optimize capital structure with share repurchases", expectedImpact: "Potential 3-5% EPS accretion" },
  ],
  alerts: [
    { id: "al-a1", companyId: "apex-technologies", companyName: "Apex Technologies", type: "general", severity: "info", title: "Q4 earnings beat consensus by 4%", description: "Strong cloud ARR growth of 23% drove revenue upside", date: "2025-01-15", read: true },
  ],
  timeline: [
    { id: "tl-a1", date: "2024-10-15", type: "positive", title: "Record Q3 Free Cash Flow", description: "FCF reached $780M in Q3, 28% above prior year", impact: "positive" },
    { id: "tl-a2", date: "2024-06-01", type: "revenue", title: "Enterprise contract win", description: "Secured $450M multi-year ERP deployment contract with global manufacturer", impact: "positive" },
    { id: "tl-a3", date: "2023-11-20", type: "positive", title: "Credit rating upgrade", description: "S&P upgraded from BBB+ to A- citing strong FCF and conservative leverage", impact: "positive" },
    { id: "tl-a4", date: "2023-03-10", type: "neutral", title: "Completed cloud migration initiative", description: "Transitioned remaining on-premise customers to cloud platform, improving ARR visibility", impact: "neutral" },
  ],
};

// ─── Company 2: Redstone Retail — Leveraged/Distressed ─────────────────────
const redstonePeriods: FinancialPeriod[] = (() => {
  const raw = [
    { period: "FY2021", year: 2021, revenue: 4200, grossProfit: 1134, operatingIncome: 210, netIncome: 126, ebitda: 378, totalAssets: 5800, totalLiabilities: 4640, totalEquity: 1160, currentAssets: 980, currentLiabilities: 1020, cash: 220, accountsReceivable: 280, inventory: 420, shortTermDebt: 380, longTermDebt: 2800, interestExpense: 252, operatingCashFlow: 294, capex: 210, freeCashFlow: 84, riskScore: 58 },
    { period: "FY2022", year: 2022, revenue: 3900, grossProfit: 975, operatingIncome: 117, netIncome: -85, ebitda: 312, totalAssets: 5400, totalLiabilities: 4590, totalEquity: 810, currentAssets: 860, currentLiabilities: 1100, cash: 160, accountsReceivable: 240, inventory: 380, shortTermDebt: 420, longTermDebt: 2900, interestExpense: 261, operatingCashFlow: 195, capex: 156, freeCashFlow: 39, riskScore: 68 },
    { period: "FY2023", year: 2023, revenue: 3600, grossProfit: 828, operatingIncome: 36, netIncome: -216, ebitda: 252, totalAssets: 5000, totalLiabilities: 4500, totalEquity: 500, currentAssets: 760, currentLiabilities: 1180, cash: 130, accountsReceivable: 210, inventory: 350, shortTermDebt: 440, longTermDebt: 3000, interestExpense: 270, operatingCashFlow: 144, capex: 120, freeCashFlow: 24, riskScore: 76 },
    { period: "FY2024", year: 2024, revenue: 3200, grossProfit: 672, operatingIncome: -96, netIncome: -416, ebitda: 128, totalAssets: 4400, totalLiabilities: 4180, totalEquity: 220, currentAssets: 640, currentLiabilities: 1280, cash: 90, accountsReceivable: 180, inventory: 310, shortTermDebt: 480, longTermDebt: 3100, interestExpense: 279, operatingCashFlow: 64, capex: 96, freeCashFlow: -32, riskScore: 84 },
  ];
  return raw.map((r, i) => {
    const base = { ...r, quarter: undefined };
    const metrics = calcMetrics(base, i > 0 ? raw[i - 1].revenue : undefined);
    return { ...base, metrics };
  });
})();

export const redstoneRetail: Company = {
  id: "redstone-retail",
  name: "Redstone Retail Group",
  ticker: "RRGI",
  sector: "Retail",
  industry: "Department Stores",
  description: "Multi-format retail operator with 340 stores across the US, facing structural headwinds from e-commerce disruption and a heavily leveraged balance sheet from a 2018 LBO.",
  headquarters: "Columbus, OH",
  country: "United States",
  exchange: "NYSE",
  employees: 22000,
  founded: 1986,
  riskScore: 84,
  riskTier: "critical",
  fraudRisk: "low",
  confidenceScore: 89,
  lastUpdated: "2024-12-31",
  periods: redstonePeriods,
  riskDrivers: [
    { factor: "Debt Burden", impact: 0.92, direction: "negative", description: "Total debt of $3.58B against equity of $220M creates extreme financial fragility", category: "leverage" },
    { factor: "Liquidity Stress", impact: 0.88, direction: "negative", description: "Current ratio of 0.50x signals inability to meet short-term obligations", category: "liquidity" },
    { factor: "Revenue Decline", impact: 0.82, direction: "negative", description: "Four consecutive years of revenue contraction totaling -24% cumulative decline", category: "growth" },
    { factor: "Profitability Erosion", impact: 0.78, direction: "negative", description: "Operating losses in FY2024 with gross margins compressed to 21%", category: "profitability" },
    { factor: "Negative Free Cash Flow", impact: 0.74, direction: "negative", description: "FCF turned negative in FY2024, limiting debt service capacity", category: "efficiency" },
    { factor: "Interest Coverage", impact: 0.70, direction: "negative", description: "Operating income insufficient to cover interest expense, coverage below 0x", category: "leverage" },
  ],
  fraudSignals: [
    { id: "fs-r1", name: "Revenue-Cash Flow Divergence", severity: "medium", detected: true, description: "Operating cash flow declining faster than revenue, suggesting margin pressure beyond reported figures", metric: "OCF/Revenue", value: 0.020, benchmark: 0.075, category: "cashflow" },
    { id: "fs-r2", name: "Inventory Liquidation Pattern", severity: "medium", detected: true, description: "Inventory levels declining faster than sales, possible channel stuffing reversal", metric: "Inventory Days", value: 35, benchmark: 55, category: "receivables" },
    { id: "fs-r3", name: "Accelerated Receivables", severity: "low", detected: false, description: "Accounts receivable within expected range given revenue decline", category: "receivables" },
  ],
  benchmarkData: {
    sector: "Retail",
    peerGroup: "Department Stores (Public)",
    metrics: [
      { name: "Current Ratio", company: 0.5, industryAverage: 1.3, topQuartile: 1.8, peerMedian: 1.1, percentileRank: 4 },
      { name: "Net Margin", company: -0.13, industryAverage: 0.04, topQuartile: 0.08, peerMedian: 0.03, percentileRank: 2 },
      { name: "Revenue Growth", company: -0.11, industryAverage: 0.03, topQuartile: 0.09, peerMedian: 0.02, percentileRank: 3 },
      { name: "Debt-to-Equity", company: 16.27, industryAverage: 2.8, topQuartile: 1.2, peerMedian: 2.5, percentileRank: 1 },
      { name: "ROE", company: -1.89, industryAverage: 0.09, topQuartile: 0.18, peerMedian: 0.07, percentileRank: 1 },
      { name: "FCF Margin", company: -0.01, industryAverage: 0.03, topQuartile: 0.07, peerMedian: 0.02, percentileRank: 3 },
    ],
  },
  aiSummary: "Redstone Retail Group is in severe financial distress with an Altman Z-Score of 0.92, deep in the 'distress zone'. The company carries $3.58B in debt against only $220M in equity following its 2018 leveraged buyout, while facing secular headwinds from e-commerce competition. Four consecutive years of revenue decline, a sub-1.0x current ratio, and negative free cash flow in FY2024 suggest the company is approaching a critical juncture requiring immediate capital structure intervention. Absent significant operational improvement or debt restructuring, covenant breaches appear probable within 12-18 months.",
  recommendations: [
    { id: "r-r1", priority: "high", category: "leverage", title: "Initiate debt restructuring discussions", description: "Engage creditors immediately to explore debt-for-equity swaps or covenant relief; covenant breach risk is elevated", expectedImpact: "Avoid potential default and preserve going concern" },
    { id: "r-r2", priority: "high", category: "liquidity", title: "Secure revolving credit facility", description: "Draw on available credit lines to build cash buffer above $200M minimum operational threshold", expectedImpact: "3-6 month liquidity runway extension" },
    { id: "r-r3", priority: "high", category: "operations", title: "Accelerate store rationalization", description: "Close 80-100 underperforming locations to reduce fixed cost base and free working capital", expectedImpact: "Potential $150M+ annual cost savings" },
    { id: "r-r4", priority: "medium", category: "operations", title: "Accelerate e-commerce investment", description: "Redirect capex from physical infrastructure to digital fulfillment capabilities", expectedImpact: "Stabilize revenue decline trajectory within 18 months" },
  ],
  alerts: [
    { id: "al-r1", companyId: "redstone-retail", companyName: "Redstone Retail Group", type: "risk_increase", severity: "critical", title: "Risk score increased to 84 (+8 pts)", description: "FY2024 results showed negative FCF and deeper operating losses than projected", date: "2025-02-10", read: false },
    { id: "al-r2", companyId: "redstone-retail", companyName: "Redstone Retail Group", type: "threshold_breach", severity: "critical", title: "Debt covenant breach risk elevated", description: "EBITDA/Interest expense ratio at 0.46x against covenant minimum of 1.25x", date: "2025-01-28", read: false },
    { id: "al-r3", companyId: "redstone-retail", companyName: "Redstone Retail Group", type: "liquidity", severity: "critical", title: "Cash balance dropped to $90M", description: "Minimum operational cash floor estimated at $75M; runway is critically thin", date: "2025-01-15", read: false },
  ],
  timeline: [
    { id: "tl-r1", date: "2025-01-15", type: "debt", title: "Cash falls to $90M", description: "Quarterly cash position at lowest level since 2018 LBO, raising liquidity concerns", impact: "negative" },
    { id: "tl-r2", date: "2024-09-30", type: "risk", title: "Operating loss widens", description: "Q3 operating loss of $31M exceeds analyst consensus by 40%", impact: "negative" },
    { id: "tl-r3", date: "2024-06-15", type: "debt", title: "Debt matures in 14 months", description: "$480M in short-term debt due Q4 2025, refinancing risk elevated", impact: "negative" },
    { id: "tl-r4", date: "2024-03-01", type: "margin", title: "Gross margin falls below 21%", description: "Promotional pricing and inventory clearance drove margin to decade low", impact: "negative" },
    { id: "tl-r5", date: "2023-08-20", type: "revenue", title: "Store closures begin", description: "Announced closure of 45 underperforming stores; transition costs impair near-term earnings", impact: "neutral" },
  ],
};

// ─── Company 3: Novara BioSciences — Possible Fraud / Suspicious ────────────
const novaraPeriods: FinancialPeriod[] = (() => {
  const raw = [
    { period: "FY2021", year: 2021, revenue: 180, grossProfit: 126, operatingIncome: 27, netIncome: 18, ebitda: 36, totalAssets: 420, totalLiabilities: 168, totalEquity: 252, currentAssets: 195, currentLiabilities: 84, cash: 90, accountsReceivable: 72, inventory: 18, shortTermDebt: 21, longTermDebt: 84, interestExpense: 6, operatingCashFlow: 9, capex: 15, freeCashFlow: -6, riskScore: 45 },
    { period: "FY2022", year: 2022, revenue: 360, grossProfit: 288, operatingIncome: 90, netIncome: 72, ebitda: 108, totalAssets: 720, totalLiabilities: 252, totalEquity: 468, currentAssets: 360, currentLiabilities: 108, cash: 150, accountsReceivable: 162, inventory: 27, shortTermDebt: 30, longTermDebt: 126, interestExpense: 9, operatingCashFlow: 27, capex: 36, freeCashFlow: -9, riskScore: 52 },
    { period: "FY2023", year: 2023, revenue: 720, grossProfit: 612, operatingIncome: 216, netIncome: 180, ebitda: 252, totalAssets: 1260, totalLiabilities: 378, totalEquity: 882, currentAssets: 648, currentLiabilities: 162, cash: 210, accountsReceivable: 378, inventory: 36, shortTermDebt: 45, longTermDebt: 162, interestExpense: 12, operatingCashFlow: 54, capex: 72, freeCashFlow: -18, riskScore: 61 },
    { period: "FY2024", year: 2024, revenue: 1440, grossProfit: 1296, operatingIncome: 576, netIncome: 504, ebitda: 648, totalAssets: 2100, totalLiabilities: 630, totalEquity: 1470, currentAssets: 1050, currentLiabilities: 252, cash: 252, accountsReceivable: 720, inventory: 36, shortTermDebt: 63, longTermDebt: 189, interestExpense: 15, operatingCashFlow: 126, capex: 105, freeCashFlow: 21, riskScore: 67 },
  ];
  return raw.map((r, i) => {
    const base = { ...r, quarter: undefined };
    const metrics = calcMetrics(base, i > 0 ? raw[i - 1].revenue : undefined);
    return { ...base, metrics };
  });
})();

export const novaraBio: Company = {
  id: "novara-biosciences",
  name: "Novara BioSciences",
  ticker: "NVBS",
  sector: "Healthcare",
  industry: "Biotechnology",
  description: "Clinical-stage biotechnology company reporting explosive revenue growth in specialty therapeutics. Several financial anomalies have triggered automated fraud screening flags.",
  headquarters: "Cambridge, MA",
  country: "United States",
  exchange: "NASDAQ",
  employees: 1840,
  founded: 2017,
  riskScore: 67,
  riskTier: "high",
  fraudRisk: "high",
  confidenceScore: 72,
  lastUpdated: "2024-12-31",
  periods: novaraPeriods,
  riskDrivers: [
    { factor: "Revenue-CF Divergence", impact: 0.95, direction: "negative", description: "Revenue grew 700% over 3 years but operating CF grew only 1300% — disproportionate to cash economics", category: "fraud" },
    { factor: "Receivables Explosion", impact: 0.90, direction: "negative", description: "Accounts receivable grew from $72M to $720M (+900%) while revenue grew 700% — DSO expanded from 146 to 182 days", category: "fraud" },
    { factor: "Margin Irregularity", impact: 0.85, direction: "negative", description: "Gross margin jumped from 70% to 90% — extreme for biotech product companies without reported pricing changes", category: "fraud" },
    { factor: "Cash Conversion", impact: 0.80, direction: "negative", description: "Operating CF/Net Income ratio of 0.25x — earnings may include non-cash or prematurely recognized revenue", category: "fraud" },
    { factor: "Rapid Revenue Growth", impact: 0.75, direction: "negative", description: "8x revenue growth in 3 years without equivalent cash flow validation raises recognition concerns", category: "fraud" },
    { factor: "Capital Structure", impact: -0.30, direction: "positive", description: "Low leverage and strong reported equity position provide some financial cushion", category: "leverage" },
  ],
  fraudSignals: [
    { id: "fs-n1", name: "Revenue-Cash Flow Divergence", severity: "high", detected: true, description: "Operating cash flow is only 8.75% of reported revenue — far below biotech peer average of 18-22%", metric: "OCF/Revenue", value: 0.0875, benchmark: 0.20, category: "cashflow" },
    { id: "fs-n2", name: "Receivables Growth Anomaly", severity: "high", detected: true, description: "Receivables as % of revenue increased from 40% to 50% — indicating extended collection terms or channel stuffing", metric: "AR/Revenue", value: 0.50, benchmark: 0.28, category: "receivables" },
    { id: "fs-n3", name: "Gross Margin Spike", severity: "high", detected: true, description: "Gross margin expanded by 20 percentage points in 3 years without disclosed pricing change or product mix shift", metric: "Gross Margin", value: 0.90, benchmark: 0.68, category: "margin" },
    { id: "fs-n4", name: "Accruals Quality", severity: "medium", detected: true, description: "High accrual ratio (change in working capital minus operating CF) suggests earnings quality concerns", metric: "Accrual Ratio", value: 0.31, benchmark: 0.08, category: "accruals" },
    { id: "fs-n5", name: "Debt Stability", severity: "low", detected: false, description: "Debt levels growing modestly in line with business scale", category: "debt" },
  ],
  benchmarkData: {
    sector: "Healthcare",
    peerGroup: "Commercial-Stage Biotech ($500M-$2B Revenue)",
    metrics: [
      { name: "Current Ratio", company: 4.17, industryAverage: 3.2, topQuartile: 5.1, peerMedian: 2.8, percentileRank: 68 },
      { name: "Net Margin", company: 0.35, industryAverage: 0.18, topQuartile: 0.30, peerMedian: 0.15, percentileRank: 82 },
      { name: "Revenue Growth", company: 1.00, industryAverage: 0.22, topQuartile: 0.45, peerMedian: 0.18, percentileRank: 98 },
      { name: "Debt-to-Equity", company: 0.17, industryAverage: 0.68, topQuartile: 0.25, peerMedian: 0.55, percentileRank: 91 },
      { name: "OCF/Revenue", company: 0.09, industryAverage: 0.20, topQuartile: 0.32, peerMedian: 0.18, percentileRank: 8 },
      { name: "AR Days (DSO)", company: 182, industryAverage: 95, topQuartile: 65, peerMedian: 88, percentileRank: 5 },
    ],
  },
  aiSummary: "Novara BioSciences presents a paradox: extraordinary reported growth combined with multiple quantitative fraud indicators. While the company reports 700% revenue growth and 90% gross margins, operating cash flow represents only 8.75% of revenue — a massive divergence from reported earnings. The accounts receivable balance has grown faster than revenue, now representing 50% of annual sales (industry norm: 28%). The gross margin expansion from 70% to 90% without disclosed product-mix or pricing rationale is highly unusual. These patterns collectively score 4 out of 5 on the Beneish M-Score components. Independent auditor verification of revenue recognition practices is strongly recommended before any investment or credit decision.",
  recommendations: [
    { id: "r-n1", priority: "high", category: "governance", title: "Request independent revenue recognition audit", description: "Engage Big 4 auditor to verify channel relationships and revenue timing; AR aging schedule analysis critical", expectedImpact: "Reduce information risk premium on cost of capital" },
    { id: "r-n2", priority: "high", category: "risk", title: "Obtain customer concentration data", description: "High receivables with undefined counterparties warrants top-10 customer analysis", expectedImpact: "Assess concentration and collection risk" },
    { id: "r-n3", priority: "medium", category: "operations", title: "Reconcile cash flow with reported earnings", description: "Management should provide detailed working capital bridge explaining OCF/earnings divergence", expectedImpact: "Improve earnings quality transparency" },
  ],
  alerts: [
    { id: "al-n1", companyId: "novara-biosciences", companyName: "Novara BioSciences", type: "fraud_signal", severity: "critical", title: "3 new fraud signals triggered", description: "Receivables anomaly, margin irregularity, and CF divergence all flagged in FY2024 analysis", date: "2025-02-01", read: false },
    { id: "al-n2", companyId: "novara-biosciences", companyName: "Novara BioSciences", type: "risk_increase", severity: "warning", title: "DSO expanded to 182 days", description: "Days Sales Outstanding significantly above biotech peer median of 88 days", date: "2025-01-20", read: false },
  ],
  timeline: [
    { id: "tl-n1", date: "2025-02-01", type: "fraud", title: "Fraud screening flags triggered", description: "Automated model detected revenue-CF divergence, AR anomaly, and margin irregularity simultaneously", impact: "negative" },
    { id: "tl-n2", date: "2024-12-15", type: "revenue", title: "Q4 Revenue 2x consensus", description: "Revenue of $400M beat $215M consensus by 86% — triggered quantitative review", impact: "negative" },
    { id: "tl-n3", date: "2024-09-01", type: "margin", title: "Gross margin reaches 90%", description: "Gross margin expanded from 82% in prior quarter without disclosed explanation", impact: "negative" },
    { id: "tl-n4", date: "2024-03-15", type: "revenue", title: "Revenue doubles for second consecutive year", description: "YoY growth of 100% — exceptional but now triggering pattern-based fraud screens", impact: "neutral" },
  ],
};

// ─── Company 4: Cascade Manufacturing — Cyclical / Unstable Cash Flow ───────
const cascadePeriods: FinancialPeriod[] = (() => {
  const raw = [
    { period: "FY2021", year: 2021, revenue: 2800, grossProfit: 728, operatingIncome: 252, netIncome: 168, ebitda: 364, totalAssets: 3200, totalLiabilities: 1920, totalEquity: 1280, currentAssets: 840, currentLiabilities: 560, cash: 168, accountsReceivable: 336, inventory: 280, shortTermDebt: 140, longTermDebt: 1120, interestExpense: 84, operatingCashFlow: 84, capex: 196, freeCashFlow: -112, riskScore: 44 },
    { period: "FY2022", year: 2022, revenue: 3500, grossProfit: 1050, operatingIncome: 490, netIncome: 350, ebitda: 630, totalAssets: 3600, totalLiabilities: 1980, totalEquity: 1620, currentAssets: 980, currentLiabilities: 630, cash: 210, accountsReceivable: 392, inventory: 315, shortTermDebt: 140, longTermDebt: 1120, interestExpense: 84, operatingCashFlow: 560, capex: 245, freeCashFlow: 315, riskScore: 33 },
    { period: "FY2023", year: 2023, revenue: 2400, grossProfit: 480, operatingIncome: 72, netIncome: -48, ebitda: 216, totalAssets: 3300, totalLiabilities: 2046, totalEquity: 1254, currentAssets: 720, currentLiabilities: 660, cash: 132, accountsReceivable: 288, inventory: 264, shortTermDebt: 180, longTermDebt: 1140, interestExpense: 90, operatingCashFlow: -96, capex: 168, freeCashFlow: -264, riskScore: 57 },
    { period: "FY2024", year: 2024, revenue: 3100, grossProfit: 868, operatingIncome: 310, netIncome: 186, ebitda: 465, totalAssets: 3500, totalLiabilities: 2030, totalEquity: 1470, currentAssets: 870, currentLiabilities: 600, cash: 186, accountsReceivable: 340, inventory: 280, shortTermDebt: 160, longTermDebt: 1120, interestExpense: 87, operatingCashFlow: 310, capex: 210, freeCashFlow: 100, riskScore: 41 },
  ];
  return raw.map((r, i) => {
    const base = { ...r, quarter: undefined };
    const metrics = calcMetrics(base, i > 0 ? raw[i - 1].revenue : undefined);
    return { ...base, metrics };
  });
})();

export const cascadeMfg: Company = {
  id: "cascade-manufacturing",
  name: "Cascade Manufacturing",
  ticker: "CSCM",
  sector: "Manufacturing",
  industry: "Industrial Equipment",
  description: "Mid-cap industrial equipment manufacturer with significant exposure to construction and mining end-markets, resulting in cyclical revenue patterns tied to commodity cycles.",
  headquarters: "Pittsburgh, PA",
  country: "United States",
  exchange: "NYSE",
  employees: 9200,
  founded: 1974,
  riskScore: 41,
  riskTier: "medium",
  fraudRisk: "none",
  confidenceScore: 87,
  lastUpdated: "2024-12-31",
  periods: cascadePeriods,
  riskDrivers: [
    { factor: "Revenue Cyclicality", impact: 0.75, direction: "negative", description: "Revenue swings of ±30% between cycle peaks and troughs create planning and covenant challenges", category: "growth" },
    { factor: "Cash Flow Volatility", impact: 0.70, direction: "negative", description: "Negative operating cash flow in downcycle years (FY2023: -$96M) strains liquidity management", category: "efficiency" },
    { factor: "Leverage Level", impact: 0.55, direction: "negative", description: "Debt-to-EBITDA of 2.8x is moderate but becomes concerning in trough years", category: "leverage" },
    { factor: "Asset Intensity", impact: 0.45, direction: "negative", description: "High capex requirements limit FCF generation across the cycle", category: "efficiency" },
    { factor: "Recovery Momentum", impact: 0.62, direction: "positive", description: "FY2024 recovery with 29% revenue rebound and restoration of positive FCF", category: "growth" },
    { factor: "Balance Sheet Resilience", impact: 0.50, direction: "positive", description: "Maintained covenant compliance through the FY2023 downcycle", category: "leverage" },
  ],
  fraudSignals: [
    { id: "fs-c1", name: "Revenue-Cash Flow Alignment", severity: "low", detected: false, description: "CF/Revenue ratio tracks closely with cycle patterns, no structural divergence", category: "cashflow" },
    { id: "fs-c2", name: "Inventory Management", severity: "low", detected: false, description: "Inventory build/drawdown consistent with production cycle management", category: "receivables" },
  ],
  benchmarkData: {
    sector: "Manufacturing",
    peerGroup: "Industrial Equipment Manufacturers ($1-5B Revenue)",
    metrics: [
      { name: "Current Ratio", company: 1.45, industryAverage: 1.6, topQuartile: 2.1, peerMedian: 1.5, percentileRank: 42 },
      { name: "Net Margin", company: 0.06, industryAverage: 0.07, topQuartile: 0.12, peerMedian: 0.06, percentileRank: 48 },
      { name: "Revenue Growth", company: 0.29, industryAverage: 0.05, topQuartile: 0.15, peerMedian: 0.04, percentileRank: 85 },
      { name: "Debt-to-Equity", company: 0.87, industryAverage: 0.95, topQuartile: 0.55, peerMedian: 0.88, percentileRank: 52 },
      { name: "EBITDA Margin", company: 0.15, industryAverage: 0.14, topQuartile: 0.22, peerMedian: 0.13, percentileRank: 58 },
      { name: "FCF Margin", company: 0.03, industryAverage: 0.04, topQuartile: 0.09, peerMedian: 0.03, percentileRank: 44 },
    ],
  },
  aiSummary: "Cascade Manufacturing represents a classic cyclical industrial profile — financially sound at cycle peaks but vulnerable at troughs. The FY2023 downcycle resulted in negative operating cash flow and a net loss, but the balance sheet was resilient enough to absorb the stress. The FY2024 recovery with 29% revenue growth and restored FCF demonstrates operational leverage. Key risks include covenant compliance during future downturns and the company's elevated capex needs limiting FCF generation. No fraud indicators are present. Medium risk classification reflects the structural cyclicality rather than any fundamental impairment.",
  recommendations: [
    { id: "r-c1", priority: "medium", category: "risk", title: "Build counter-cyclical liquidity buffer", description: "Increase cash reserves during peak years to minimum 2x annual debt service to weather future troughs", expectedImpact: "Covenant compliance buffer increases to >20%" },
    { id: "r-c2", priority: "medium", category: "leverage", title: "Explore fixed-for-floating debt swap", description: "Lock in current rate environment to reduce interest rate exposure during next downcycle", expectedImpact: "Estimated $8-12M annual interest savings" },
    { id: "r-c3", priority: "low", category: "operations", title: "Diversify end-market exposure", description: "Target 15% revenue from less-cyclical infrastructure/utility markets by 2026", expectedImpact: "Reduce revenue volatility by 20-25%" },
  ],
  alerts: [
    { id: "al-c1", companyId: "cascade-manufacturing", companyName: "Cascade Manufacturing", type: "general", severity: "info", title: "Q4 revenue recovery tracking ahead of plan", description: "Q4 order backlog +18% vs prior year, confirming cyclical recovery thesis", date: "2025-01-08", read: true },
    { id: "al-c2", companyId: "cascade-manufacturing", companyName: "Cascade Manufacturing", type: "threshold_breach", severity: "warning", title: "Debt covenant buffer narrowed in Q2 2023", description: "EBITDA/Interest coverage dipped to 1.38x against covenant minimum of 1.25x", date: "2023-08-15", read: true },
  ],
  timeline: [
    { id: "tl-c1", date: "2024-10-15", type: "positive", title: "Recovery confirmed: FCF positive", description: "Q3 2024 FCF of $62M confirms cyclical recovery; debt service fully covered", impact: "positive" },
    { id: "tl-c2", date: "2023-06-01", type: "revenue", title: "Revenue trough reached", description: "Q2 2023 revenue $540M — lowest since 2019; operating loss reported", impact: "negative" },
    { id: "tl-c3", date: "2023-03-10", type: "liquidity", title: "Revolving credit facility drawn", description: "Drew $120M on revolving credit to maintain liquidity during downcycle", impact: "negative" },
    { id: "tl-c4", date: "2022-09-30", type: "positive", title: "Peak cycle performance", description: "FY2022 EBITDA of $630M — company record; covenant headroom at maximum", impact: "positive" },
  ],
};

// ─── Company 5: Meridian Health Systems — Medium Risk / Declining Margins ───
const meridianPeriods: FinancialPeriod[] = (() => {
  const raw = [
    { period: "FY2021", year: 2021, revenue: 5600, grossProfit: 1232, operatingIncome: 392, netIncome: 280, ebitda: 560, totalAssets: 7200, totalLiabilities: 4320, totalEquity: 2880, currentAssets: 1680, currentLiabilities: 1120, cash: 392, accountsReceivable: 840, inventory: 168, shortTermDebt: 280, longTermDebt: 2800, interestExpense: 140, operatingCashFlow: 504, capex: 280, freeCashFlow: 224, riskScore: 35 },
    { period: "FY2022", year: 2022, revenue: 5900, grossProfit: 1180, operatingIncome: 354, netIncome: 236, ebitda: 531, totalAssets: 7500, totalLiabilities: 4575, totalEquity: 2925, currentAssets: 1710, currentLiabilities: 1180, cash: 354, accountsReceivable: 885, inventory: 177, shortTermDebt: 295, longTermDebt: 2950, interestExpense: 148, operatingCashFlow: 443, capex: 295, freeCashFlow: 148, riskScore: 40 },
    { period: "FY2023", year: 2023, revenue: 6100, grossProfit: 1098, operatingIncome: 244, netIncome: 122, ebitda: 427, totalAssets: 7600, totalLiabilities: 4788, totalEquity: 2812, currentAssets: 1708, currentLiabilities: 1220, cash: 305, accountsReceivable: 915, inventory: 183, shortTermDebt: 305, longTermDebt: 3100, interestExpense: 155, operatingCashFlow: 305, capex: 305, freeCashFlow: 0, riskScore: 48 },
    { period: "FY2024", year: 2024, revenue: 6300, grossProfit: 1008, operatingIncome: 189, netIncome: 63, ebitda: 378, totalAssets: 7700, totalLiabilities: 5005, totalEquity: 2695, currentAssets: 1701, currentLiabilities: 1260, cash: 252, accountsReceivable: 945, inventory: 189, shortTermDebt: 315, longTermDebt: 3150, interestExpense: 158, operatingCashFlow: 252, capex: 315, freeCashFlow: -63, riskScore: 55 },
  ];
  return raw.map((r, i) => {
    const base = { ...r, quarter: undefined };
    const metrics = calcMetrics(base, i > 0 ? raw[i - 1].revenue : undefined);
    return { ...base, metrics };
  });
})();

export const meridianHealth: Company = {
  id: "meridian-health",
  name: "Meridian Health Systems",
  ticker: "MDHS",
  sector: "Healthcare",
  industry: "Hospital & Health Systems",
  description: "Regional hospital network operating 28 facilities across the Southeast US, experiencing margin compression from labor cost inflation, Medicare reimbursement changes, and integration costs from recent acquisitions.",
  headquarters: "Nashville, TN",
  country: "United States",
  exchange: "NYSE",
  employees: 34000,
  founded: 1991,
  riskScore: 55,
  riskTier: "medium",
  fraudRisk: "none",
  confidenceScore: 91,
  lastUpdated: "2024-12-31",
  periods: meridianPeriods,
  riskDrivers: [
    { factor: "Margin Compression", impact: 0.82, direction: "negative", description: "Gross margin declined from 22% to 16% over 4 years — labor inflation and reimbursement pressure", category: "profitability" },
    { factor: "Leverage Creep", impact: 0.68, direction: "negative", description: "Total debt increased from $3.08B to $3.47B while EBITDA declined, raising D/EBITDA to 9.2x", category: "leverage" },
    { factor: "FCF Deterioration", impact: 0.65, direction: "negative", description: "FCF went from $224M to -$63M over 4 years; capex investment constraining cash generation", category: "efficiency" },
    { factor: "Revenue Stability", impact: 0.55, direction: "positive", description: "Revenue growing steadily at 3-5% annually, supported by aging demographics and service expansion", category: "growth" },
    { factor: "Asset Base", impact: 0.45, direction: "positive", description: "Strong asset base with essential healthcare infrastructure providing credit support", category: "leverage" },
    { factor: "Liquidity Adequacy", impact: 0.38, direction: "positive", description: "Current ratio of 1.35x above minimum threshold, though trending down", category: "liquidity" },
  ],
  fraudSignals: [
    { id: "fs-m1", name: "Margin Decline Pattern", severity: "low", detected: false, description: "Margin compression attributable to documented industry-wide labor cost increases, not anomalous", category: "margin" },
    { id: "fs-m2", name: "Receivables Growth", severity: "low", detected: false, description: "AR growth consistent with revenue growth; DSO stable at 55 days", category: "receivables" },
  ],
  benchmarkData: {
    sector: "Healthcare",
    peerGroup: "Regional Hospital Systems (20-40 Facilities)",
    metrics: [
      { name: "Current Ratio", company: 1.35, industryAverage: 1.55, topQuartile: 2.1, peerMedian: 1.45, percentileRank: 31 },
      { name: "Net Margin", company: 0.01, industryAverage: 0.04, topQuartile: 0.08, peerMedian: 0.035, percentileRank: 18 },
      { name: "Revenue Growth", company: 0.033, industryAverage: 0.045, topQuartile: 0.09, peerMedian: 0.04, percentileRank: 38 },
      { name: "EBITDA Margin", company: 0.06, industryAverage: 0.10, topQuartile: 0.15, peerMedian: 0.09, percentileRank: 22 },
      { name: "Debt-to-EBITDA", company: 9.2, industryAverage: 5.5, topQuartile: 3.8, peerMedian: 5.2, percentileRank: 12 },
      { name: "FCF Yield", company: -0.01, industryAverage: 0.03, topQuartile: 0.07, peerMedian: 0.025, percentileRank: 14 },
    ],
  },
  aiSummary: "Meridian Health Systems faces a clear margin compression trend that has eroded EBITDA margins from 10% to 6% over four years, with FCF turning negative in FY2024. The primary drivers — labor cost inflation (travel nurses averaging 2.3x base costs) and reduced CMS reimbursement rates — are structural and well-documented, suggesting this is not a fraud scenario but a genuine operational challenge. Debt-to-EBITDA at 9.2x is elevated for the healthcare sector and limits financial flexibility. However, the essential nature of hospital services provides baseline revenue stability. The company needs to accelerate cost transformation and negotiate improved payer contracts to reverse the margin trajectory.",
  recommendations: [
    { id: "r-m1", priority: "high", category: "operations", title: "Implement labor cost reduction program", description: "Reduce reliance on premium contract nursing through permanent staff recruitment and retention incentives", expectedImpact: "Potential 200-300bps gross margin recovery" },
    { id: "r-m2", priority: "high", category: "operations", title: "Renegotiate payer contracts", description: "Priority renegotiation of commercial insurance contracts to offset CMS reimbursement compression", expectedImpact: "1-2% revenue yield improvement" },
    { id: "r-m3", priority: "medium", category: "leverage", title: "Defer non-critical capex", description: "Prioritize only regulatory-required and highest-ROI capital projects to restore FCF positivity", expectedImpact: "Return to FCF positive within 18 months" },
  ],
  alerts: [
    { id: "al-m1", companyId: "meridian-health", companyName: "Meridian Health Systems", type: "risk_increase", severity: "warning", title: "Risk score increased to 55 (+7 pts)", description: "FY2024 results confirmed FCF turned negative and net margin fell to 1%", date: "2025-02-05", read: false },
    { id: "al-m2", companyId: "meridian-health", companyName: "Meridian Health Systems", type: "threshold_breach", severity: "warning", title: "EBITDA margin fell below 7% threshold", description: "EBITDA margin of 6.0% triggers internal monitoring threshold", date: "2025-01-25", read: true },
  ],
  timeline: [
    { id: "tl-m1", date: "2025-01-20", type: "margin", title: "FCF turns negative", description: "FY2024 FCF of -$63M marks first negative FCF year in company history", impact: "negative" },
    { id: "tl-m2", date: "2024-07-01", type: "revenue", title: "CMS reimbursement reduction", description: "Medicare reimbursement rates reduced 3.2% effective July 2024 — exceeding 2% expected reduction", impact: "negative" },
    { id: "tl-m3", date: "2024-03-15", type: "margin", title: "Labor cost inflation persists", description: "Contract nursing staff as % of workforce reaches 28% — highest level on record", impact: "negative" },
    { id: "tl-m4", date: "2023-01-10", type: "debt", title: "Acquisition of Valley Health completed", description: "$380M acquisition of 4-facility regional system added scale but increased leverage", impact: "negative" },
    { id: "tl-m5", date: "2022-05-01", type: "positive", title: "Expanded ambulatory care network", description: "Opened 8 new outpatient clinics; captures lower-cost care migration trend", impact: "positive" },
  ],
};

// ─── Company 6: Solara Energy Networks - Growth with Cash-Flow Risk ─────────
const solaraPeriods: FinancialPeriod[] = (() => {
  const raw = [
    { period: "FY2021", year: 2021, revenue: 980, grossProfit: 255, operatingIncome: 39, netIncome: 20, ebitda: 98, totalAssets: 2100, totalLiabilities: 1155, totalEquity: 945, currentAssets: 520, currentLiabilities: 390, cash: 210, accountsReceivable: 180, inventory: 90, shortTermDebt: 85, longTermDebt: 720, interestExpense: 42, operatingCashFlow: 35, capex: 310, freeCashFlow: -275, riskScore: 48 },
    { period: "FY2022", year: 2022, revenue: 1350, grossProfit: 378, operatingIncome: 68, netIncome: 34, ebitda: 149, totalAssets: 2950, totalLiabilities: 1682, totalEquity: 1268, currentAssets: 690, currentLiabilities: 520, cash: 240, accountsReceivable: 250, inventory: 130, shortTermDebt: 115, longTermDebt: 1040, interestExpense: 58, operatingCashFlow: 41, capex: 470, freeCashFlow: -429, riskScore: 53 },
    { period: "FY2023", year: 2023, revenue: 1880, grossProfit: 526, operatingIncome: 75, netIncome: 19, ebitda: 207, totalAssets: 4100, totalLiabilities: 2583, totalEquity: 1517, currentAssets: 850, currentLiabilities: 690, cash: 205, accountsReceivable: 390, inventory: 160, shortTermDebt: 160, longTermDebt: 1660, interestExpense: 86, operatingCashFlow: 28, capex: 650, freeCashFlow: -622, riskScore: 59 },
    { period: "FY2024", year: 2024, revenue: 2440, grossProfit: 622, operatingIncome: 49, netIncome: -37, ebitda: 244, totalAssets: 5200, totalLiabilities: 3536, totalEquity: 1664, currentAssets: 920, currentLiabilities: 820, cash: 160, accountsReceivable: 540, inventory: 170, shortTermDebt: 240, longTermDebt: 2260, interestExpense: 118, operatingCashFlow: -12, capex: 720, freeCashFlow: -732, riskScore: 64 },
  ];
  return raw.map((r, i) => {
    const base = { ...r, quarter: undefined };
    const metrics = calcMetrics(base, i > 0 ? raw[i - 1].revenue : undefined);
    return { ...base, metrics };
  });
})();

export const solaraEnergy: Company = {
  id: "solara-energy",
  name: "Solara Energy Networks",
  ticker: "SLEN",
  sector: "Energy",
  industry: "Renewable Power Infrastructure",
  description: "Utility-scale solar and storage developer expanding rapidly across grid-constrained markets, with heavy project capex and rising refinancing needs.",
  headquarters: "Austin, TX",
  country: "United States",
  exchange: "NASDAQ",
  employees: 4200,
  founded: 2012,
  riskScore: 64,
  riskTier: "high",
  fraudRisk: "low",
  confidenceScore: 83,
  lastUpdated: "2024-12-31",
  periods: solaraPeriods,
  riskDrivers: [
    { factor: "Capex Intensity", impact: 0.84, direction: "negative", description: "Growth requires large project capex, keeping free cash flow deeply negative despite revenue expansion", category: "efficiency" },
    { factor: "Debt-Funded Growth", impact: 0.78, direction: "negative", description: "Debt-to-equity increased to 1.50x as new project financing outpaced retained earnings", category: "leverage" },
    { factor: "Revenue Momentum", impact: 0.66, direction: "positive", description: "Revenue grew 30% in FY2024 on new interconnection and storage contracts", category: "growth" },
    { factor: "Liquidity Cushion", impact: 0.58, direction: "negative", description: "Current ratio of 1.12x and falling cash reduce flexibility if project timelines slip", category: "liquidity" },
    { factor: "Interest Coverage", impact: 0.52, direction: "negative", description: "Interest coverage fell below 1.0x as rate-sensitive project debt expanded", category: "leverage" },
  ],
  fraudSignals: [
    { id: "fs-s1", name: "Revenue-Cash Flow Divergence", severity: "medium", detected: true, description: "Revenue growth is not yet converting to operating cash flow because projects remain in construction and receivables expanded.", metric: "OCF/Revenue", value: -0.005, benchmark: 0.07, category: "cashflow" },
    { id: "fs-s2", name: "Margin Pressure", severity: "low", detected: false, description: "Gross margin compression is consistent with battery input costs and tax-credit timing.", category: "margin" },
    { id: "fs-s3", name: "Receivables Monitoring", severity: "medium", detected: true, description: "Accounts receivable increased to 22% of revenue as milestone billing stretched.", metric: "AR/Revenue", value: 0.22, benchmark: 0.16, category: "receivables" },
  ],
  benchmarkData: {
    sector: "Energy",
    peerGroup: "Renewable Infrastructure Developers",
    metrics: [
      { name: "Current Ratio", company: 1.12, industryAverage: 1.45, topQuartile: 2.0, peerMedian: 1.35, percentileRank: 24 },
      { name: "Net Margin", company: -0.015, industryAverage: 0.045, topQuartile: 0.11, peerMedian: 0.035, percentileRank: 18 },
      { name: "Revenue Growth", company: 0.30, industryAverage: 0.16, topQuartile: 0.31, peerMedian: 0.13, percentileRank: 76 },
      { name: "Debt-to-Equity", company: 1.50, industryAverage: 1.05, topQuartile: 0.65, peerMedian: 0.98, percentileRank: 22 },
      { name: "Interest Coverage", company: 0.42, industryAverage: 2.1, topQuartile: 4.2, peerMedian: 1.8, percentileRank: 11 },
      { name: "FCF Margin", company: -0.30, industryAverage: -0.08, topQuartile: 0.04, peerMedian: -0.06, percentileRank: 9 },
    ],
  },
  aiSummary: "Solara Energy Networks has strong top-line growth but a fragile funding profile. Project capex and milestone billing timing have kept free cash flow negative, while interest coverage fell below 1.0x in FY2024. The profile is not a fraud conclusion; it is a project-finance execution and liquidity risk story. The key question is whether contracted projects reach cash generation before refinancing pressure intensifies.",
  recommendations: [
    { id: "r-s1", priority: "high", category: "liquidity", title: "Build project-level liquidity buffer", description: "Reserve cash against delayed interconnection milestones and battery procurement timing.", expectedImpact: "Reduce near-term funding gap risk" },
    { id: "r-s2", priority: "high", category: "leverage", title: "Refinance construction debt ladder", description: "Extend project debt maturities before additional rate pressure or covenant tightening.", expectedImpact: "Improve interest coverage runway" },
    { id: "r-s3", priority: "medium", category: "operations", title: "Prioritize projects with signed offtake", description: "Sequence capex toward contracted assets with shorter cash conversion cycles.", expectedImpact: "Improve FCF visibility" },
  ],
  alerts: [
    { id: "al-s1", companyId: "solara-energy", companyName: "Solara Energy Networks", type: "investment_health_drop", severity: "warning", title: "Investment health dropped on cash-flow pressure", description: "Negative FCF and weaker interest coverage reduced the composite mock research score.", date: "2026-06-28", read: false },
    { id: "al-s2", companyId: "solara-energy", companyName: "Solara Energy Networks", type: "volume_spike", severity: "warning", title: "Volume spike after financing update", description: "Mock volume rose above average after management discussed project refinancing.", date: "2026-06-18", read: false },
  ],
  timeline: [
    { id: "tl-s1", date: "2026-06-18", type: "debt", title: "Project financing update", description: "Management disclosed refinancing workstream for FY2027 construction debt maturities.", impact: "negative" },
    { id: "tl-s2", date: "2026-05-30", type: "positive", title: "Grid storage contract awarded", description: "Signed 400 MWh storage contract with investment-grade utility counterparty.", impact: "positive" },
    { id: "tl-s3", date: "2025-12-31", type: "liquidity", title: "FCF remains negative", description: "FY2024 free cash flow of -$732M reflects heavy project build-out.", impact: "negative" },
  ],
};

// ─── Company 7: Harbor Foods - Stable Quality Compounder ───────────────────
const harborPeriods: FinancialPeriod[] = (() => {
  const raw = [
    { period: "FY2021", year: 2021, revenue: 4200, grossProfit: 1512, operatingIncome: 546, netIncome: 378, ebitda: 714, totalAssets: 5100, totalLiabilities: 2142, totalEquity: 2958, currentAssets: 1680, currentLiabilities: 980, cash: 520, accountsReceivable: 420, inventory: 520, shortTermDebt: 120, longTermDebt: 980, interestExpense: 48, operatingCashFlow: 610, capex: 190, freeCashFlow: 420, riskScore: 27 },
    { period: "FY2022", year: 2022, revenue: 4480, grossProfit: 1635, operatingIncome: 605, netIncome: 430, ebitda: 762, totalAssets: 5350, totalLiabilities: 2194, totalEquity: 3156, currentAssets: 1760, currentLiabilities: 1010, cash: 570, accountsReceivable: 442, inventory: 548, shortTermDebt: 110, longTermDebt: 960, interestExpense: 47, operatingCashFlow: 675, capex: 205, freeCashFlow: 470, riskScore: 25 },
    { period: "FY2023", year: 2023, revenue: 4750, grossProfit: 1758, operatingIncome: 665, netIncome: 480, ebitda: 831, totalAssets: 5680, totalLiabilities: 2243, totalEquity: 3437, currentAssets: 1890, currentLiabilities: 1040, cash: 640, accountsReceivable: 455, inventory: 580, shortTermDebt: 105, longTermDebt: 930, interestExpense: 45, operatingCashFlow: 740, capex: 215, freeCashFlow: 525, riskScore: 23 },
    { period: "FY2024", year: 2024, revenue: 5030, grossProfit: 1871, operatingIncome: 704, netIncome: 513, ebitda: 880, totalAssets: 5960, totalLiabilities: 2265, totalEquity: 3695, currentAssets: 2020, currentLiabilities: 1060, cash: 710, accountsReceivable: 482, inventory: 602, shortTermDebt: 100, longTermDebt: 900, interestExpense: 43, operatingCashFlow: 805, capex: 230, freeCashFlow: 575, riskScore: 21 },
  ];
  return raw.map((r, i) => {
    const base = { ...r, quarter: undefined };
    const metrics = calcMetrics(base, i > 0 ? raw[i - 1].revenue : undefined);
    return { ...base, metrics };
  });
})();

export const harborFoods: Company = {
  id: "harbor-foods",
  name: "Harbor Foods",
  ticker: "HRBF",
  sector: "Consumer Staples",
  industry: "Packaged Foods",
  description: "Branded packaged foods company with steady demand, high cash conversion, and conservative leverage across grocery and foodservice channels.",
  headquarters: "Minneapolis, MN",
  country: "United States",
  exchange: "NYSE",
  employees: 12800,
  founded: 1968,
  riskScore: 21,
  riskTier: "healthy",
  fraudRisk: "none",
  confidenceScore: 93,
  lastUpdated: "2024-12-31",
  periods: harborPeriods,
  riskDrivers: [
    { factor: "Cash Conversion", impact: 0.82, direction: "positive", description: "Operating cash flow exceeded net income in each year and FCF margin expanded to 11%", category: "efficiency" },
    { factor: "Stable Demand", impact: 0.72, direction: "positive", description: "Revenue grew consistently at 6% with low cyclicality and strong grocery shelf presence", category: "growth" },
    { factor: "Conservative Leverage", impact: 0.70, direction: "positive", description: "Debt-to-equity fell to 0.27x and interest coverage remains above 16x", category: "leverage" },
    { factor: "Margin Durability", impact: 0.60, direction: "positive", description: "Gross margin improved despite commodity cost pressure through pricing and mix", category: "profitability" },
    { factor: "Input Cost Exposure", impact: 0.24, direction: "negative", description: "Agricultural commodity volatility remains a monitoring point for future margins", category: "profitability" },
  ],
  fraudSignals: [
    { id: "fs-h1", name: "Revenue-Cash Flow Alignment", severity: "low", detected: false, description: "Cash conversion supports reported earnings quality.", category: "cashflow" },
    { id: "fs-h2", name: "Inventory Build Check", severity: "low", detected: false, description: "Inventory growth is in line with revenue and seasonal stocking levels.", category: "receivables" },
    { id: "fs-h3", name: "Margin Stability", severity: "low", detected: false, description: "Margins are stable with no unexplained step changes.", category: "margin" },
  ],
  benchmarkData: {
    sector: "Consumer Staples",
    peerGroup: "Packaged Food Companies",
    metrics: [
      { name: "Current Ratio", company: 1.91, industryAverage: 1.35, topQuartile: 1.9, peerMedian: 1.25, percentileRank: 76 },
      { name: "Net Margin", company: 0.102, industryAverage: 0.075, topQuartile: 0.12, peerMedian: 0.07, percentileRank: 72 },
      { name: "Revenue Growth", company: 0.059, industryAverage: 0.035, topQuartile: 0.07, peerMedian: 0.03, percentileRank: 68 },
      { name: "Debt-to-Equity", company: 0.27, industryAverage: 0.78, topQuartile: 0.35, peerMedian: 0.7, percentileRank: 83 },
      { name: "ROE", company: 0.139, industryAverage: 0.12, topQuartile: 0.2, peerMedian: 0.11, percentileRank: 61 },
      { name: "FCF Margin", company: 0.114, industryAverage: 0.06, topQuartile: 0.1, peerMedian: 0.055, percentileRank: 81 },
    ],
  },
  aiSummary: "Harbor Foods is the stable-quality profile in the mock universe. Revenue growth is modest but durable, free cash flow conversion is strong, leverage is conservative, and fraud screens are clean. The principal monitoring point is input-cost volatility rather than liquidity, leverage, or accounting quality.",
  recommendations: [
    { id: "r-h1", priority: "low", category: "operations", title: "Maintain pricing discipline", description: "Use measured pricing and product mix to offset commodity cost volatility without disrupting volume.", expectedImpact: "Protect gross margin above 36%" },
    { id: "r-h2", priority: "low", category: "risk", title: "Monitor commodity hedging coverage", description: "Track hedge ratios and supplier concentration for wheat, dairy, and packaging inputs.", expectedImpact: "Reduce margin volatility" },
  ],
  alerts: [
    { id: "al-h1", companyId: "harbor-foods", companyName: "Harbor Foods", type: "general", severity: "info", title: "Financial health score improved", description: "Higher cash conversion and lower leverage improved the mock health profile.", date: "2026-06-21", read: true },
  ],
  timeline: [
    { id: "tl-h1", date: "2026-06-21", type: "positive", title: "FCF conversion expands", description: "Free cash flow margin reached 11% in the latest fiscal year.", impact: "positive" },
    { id: "tl-h2", date: "2026-04-02", type: "neutral", title: "Commodity hedges renewed", description: "Management extended input cost hedges for the next two quarters.", impact: "neutral" },
    { id: "tl-h3", date: "2025-12-31", type: "positive", title: "Debt reduced", description: "Long-term debt declined for the third consecutive year.", impact: "positive" },
  ],
};

// ─── Company 8: Northstar Property Trust - Leveraged Real Estate Watchlist ──
const northstarPeriods: FinancialPeriod[] = (() => {
  const raw = [
    { period: "FY2021", year: 2021, revenue: 2100, grossProfit: 1470, operatingIncome: 735, netIncome: 315, ebitda: 945, totalAssets: 9800, totalLiabilities: 6370, totalEquity: 3430, currentAssets: 780, currentLiabilities: 620, cash: 260, accountsReceivable: 180, inventory: 0, shortTermDebt: 420, longTermDebt: 5100, interestExpense: 260, operatingCashFlow: 620, capex: 740, freeCashFlow: -120, riskScore: 46 },
    { period: "FY2022", year: 2022, revenue: 2260, grossProfit: 1514, operatingIncome: 701, netIncome: 226, ebitda: 927, totalAssets: 10200, totalLiabilities: 7038, totalEquity: 3162, currentAssets: 760, currentLiabilities: 710, cash: 230, accountsReceivable: 210, inventory: 0, shortTermDebt: 620, longTermDebt: 5580, interestExpense: 320, operatingCashFlow: 560, capex: 780, freeCashFlow: -220, riskScore: 55 },
    { period: "FY2023", year: 2023, revenue: 2210, grossProfit: 1392, operatingIncome: 575, netIncome: 66, ebitda: 796, totalAssets: 9900, totalLiabilities: 7227, totalEquity: 2673, currentAssets: 680, currentLiabilities: 860, cash: 190, accountsReceivable: 230, inventory: 0, shortTermDebt: 840, longTermDebt: 5480, interestExpense: 410, operatingCashFlow: 470, capex: 690, freeCashFlow: -220, riskScore: 65 },
    { period: "FY2024", year: 2024, revenue: 2140, grossProfit: 1284, operatingIncome: 449, netIncome: -86, ebitda: 663, totalAssets: 9400, totalLiabilities: 7426, totalEquity: 1974, currentAssets: 610, currentLiabilities: 1040, cash: 150, accountsReceivable: 245, inventory: 0, shortTermDebt: 1120, longTermDebt: 5300, interestExpense: 520, operatingCashFlow: 385, capex: 610, freeCashFlow: -225, riskScore: 73 },
  ];
  return raw.map((r, i) => {
    const base = { ...r, quarter: undefined };
    const metrics = calcMetrics(base, i > 0 ? raw[i - 1].revenue : undefined);
    return { ...base, metrics };
  });
})();

export const northstarProperties: Company = {
  id: "northstar-properties",
  name: "Northstar Property Trust",
  ticker: "NSPR",
  sector: "Real Estate",
  industry: "Office and Mixed-Use REIT",
  description: "Office-heavy property trust managing a refinancing wall, lower occupancy, and valuation pressure across urban mixed-use assets.",
  headquarters: "Chicago, IL",
  country: "United States",
  exchange: "NYSE",
  employees: 3100,
  founded: 2001,
  riskScore: 73,
  riskTier: "high",
  fraudRisk: "medium",
  confidenceScore: 85,
  lastUpdated: "2024-12-31",
  periods: northstarPeriods,
  riskDrivers: [
    { factor: "Refinancing Wall", impact: 0.88, direction: "negative", description: "Short-term debt increased to $1.12B while rates and office lending standards tightened", category: "leverage" },
    { factor: "Occupancy Pressure", impact: 0.76, direction: "negative", description: "Revenue declined as lease expirations and concessions reduced effective rents", category: "growth" },
    { factor: "Interest Coverage", impact: 0.74, direction: "negative", description: "Operating income no longer covers interest expense, limiting refinancing flexibility", category: "leverage" },
    { factor: "Asset Value Decline", impact: 0.68, direction: "negative", description: "Total assets and equity declined as cap rates expanded and appraisals weakened", category: "efficiency" },
    { factor: "Recurring Lease Cash Flow", impact: 0.42, direction: "positive", description: "Operating cash flow remains positive, giving management a restructuring window", category: "liquidity" },
  ],
  fraudSignals: [
    { id: "fs-p1", name: "Debt Maturity Concentration", severity: "high", detected: true, description: "Short-term debt increased materially as refinancing markets tightened.", metric: "Short-term debt", value: 1120, benchmark: 500, category: "debt" },
    { id: "fs-p2", name: "Cash Flow Coverage Weakness", severity: "medium", detected: true, description: "Operating cash flow remains positive but no longer covers capex and refinancing needs.", metric: "FCF", value: -225, benchmark: 75, category: "cashflow" },
    { id: "fs-p3", name: "Revenue Recognition Check", severity: "low", detected: false, description: "Revenue decline and receivables trend are consistent with occupancy pressure, not an accounting spike.", category: "revenue" },
  ],
  benchmarkData: {
    sector: "Real Estate",
    peerGroup: "Office and Mixed-Use REITs",
    metrics: [
      { name: "Current Ratio", company: 0.59, industryAverage: 1.0, topQuartile: 1.4, peerMedian: 0.9, percentileRank: 14 },
      { name: "Net Margin", company: -0.04, industryAverage: 0.12, topQuartile: 0.24, peerMedian: 0.1, percentileRank: 9 },
      { name: "Revenue Growth", company: -0.032, industryAverage: 0.015, topQuartile: 0.05, peerMedian: 0.01, percentileRank: 18 },
      { name: "Debt-to-Equity", company: 3.25, industryAverage: 1.6, topQuartile: 0.9, peerMedian: 1.5, percentileRank: 7 },
      { name: "Interest Coverage", company: 0.86, industryAverage: 2.4, topQuartile: 4.0, peerMedian: 2.1, percentileRank: 10 },
      { name: "FCF Margin", company: -0.105, industryAverage: 0.04, topQuartile: 0.12, peerMedian: 0.035, percentileRank: 12 },
    ],
  },
  aiSummary: "Northstar Property Trust is a refinancing and asset-quality watchlist case. Office-heavy exposure, falling equity value, weak interest coverage, and a near-term maturity wall create high financial risk. Positive operating cash flow gives the company room to negotiate, but the mock profile requires close monitoring of lender actions, asset sales, and occupancy stabilization.",
  recommendations: [
    { id: "r-p1", priority: "high", category: "leverage", title: "Prioritize maturity extension", description: "Negotiate secured extensions or asset-level refinancings for the FY2025 maturity wall.", expectedImpact: "Reduce forced-sale risk" },
    { id: "r-p2", priority: "high", category: "operations", title: "Accelerate asset sale program", description: "Sell non-core mixed-use assets to improve liquidity and reduce secured debt.", expectedImpact: "Lower debt-to-equity and fund capex backlog" },
    { id: "r-p3", priority: "medium", category: "risk", title: "Track occupancy and lease rollover", description: "Monitor monthly lease renewals, concessions, and tenant concentration.", expectedImpact: "Improve early-warning visibility" },
  ],
  alerts: [
    { id: "al-p1", companyId: "northstar-properties", companyName: "Northstar Property Trust", type: "price_drawdown", severity: "critical", title: "Price drawdown exceeds 45%", description: "Mock market data shows a steep drawdown tied to refinancing concerns.", date: "2026-06-24", read: false },
    { id: "al-p2", companyId: "northstar-properties", companyName: "Northstar Property Trust", type: "financial_health_deteriorated", severity: "warning", title: "Financial health deteriorated", description: "Interest coverage, liquidity, and FCF metrics weakened in the latest fiscal year.", date: "2026-06-12", read: false },
  ],
  timeline: [
    { id: "tl-p1", date: "2026-06-24", type: "debt", title: "Refinancing talks extended", description: "Lender group extended negotiations on secured office portfolio debt.", impact: "negative" },
    { id: "tl-p2", date: "2026-05-12", type: "risk", title: "Asset appraisal revised lower", description: "Independent appraisals reduced office portfolio values after cap-rate expansion.", impact: "negative" },
    { id: "tl-p3", date: "2025-12-31", type: "liquidity", title: "Current ratio falls below 0.6x", description: "Short-term debt maturities pushed current liabilities above current assets.", impact: "negative" },
  ],
};

export const mockCompanies: Company[] = [
  apexTech,
  redstoneRetail,
  novaraBio,
  cascadeMfg,
  meridianHealth,
  solaraEnergy,
  harborFoods,
  northstarProperties,
];

export function getCompanyById(id: string): Company | undefined {
  return mockCompanies.find((c) => c.id === id);
}
