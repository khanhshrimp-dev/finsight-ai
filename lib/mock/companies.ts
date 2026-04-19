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

export const mockCompanies: Company[] = [
  apexTech,
  redstoneRetail,
  novaraBio,
  cascadeMfg,
  meridianHealth,
];

export function getCompanyById(id: string): Company | undefined {
  return mockCompanies.find((c) => c.id === id);
}
