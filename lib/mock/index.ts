export * from "./companies";
export * from "./alerts";

export const mockDashboardStats = {
  totalCompanies: 5,
  averageRiskScore: 51.8,
  highRiskCount: 2,
  fraudFlagCount: 1,
  criticalCount: 1,
  watchlistCount: 3,
  recentAlerts: 5,
  riskDistribution: [
    { tier: "healthy" as const, count: 1, percentage: 20 },
    { tier: "medium" as const, count: 2, percentage: 40 },
    { tier: "high" as const, count: 1, percentage: 20 },
    { tier: "critical" as const, count: 1, percentage: 20 },
  ],
};

export const mockRiskTrend = [
  { month: "Jan 24", avgScore: 43.2 },
  { month: "Feb 24", avgScore: 44.1 },
  { month: "Mar 24", avgScore: 45.8 },
  { month: "Apr 24", avgScore: 44.6 },
  { month: "May 24", avgScore: 46.2 },
  { month: "Jun 24", avgScore: 47.9 },
  { month: "Jul 24", avgScore: 49.1 },
  { month: "Aug 24", avgScore: 48.3 },
  { month: "Sep 24", avgScore: 50.2 },
  { month: "Oct 24", avgScore: 51.4 },
  { month: "Nov 24", avgScore: 50.8 },
  { month: "Dec 24", avgScore: 51.8 },
];
