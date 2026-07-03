export type InvestmentHealthLabel =
  | "Strong"
  | "Watchlist"
  | "Mixed"
  | "Weak"
  | "High Uncertainty";

export interface InvestmentHealthInput {
  financialHealthScore: number;
  riskScore: number;
  marketMomentumScore: number;
  newsSentimentScore: number;
  valuationScore?: number;
}

export interface InvestmentHealthComponent {
  name: string;
  score: number;
  weight: number;
  contribution: number;
}

export interface InvestmentHealthDriver {
  name: string;
  direction: "positive" | "negative" | "neutral";
  explanation: string;
}

export interface InvestmentHealthResult {
  score: number;
  label: InvestmentHealthLabel;
  components: InvestmentHealthComponent[];
  drivers: InvestmentHealthDriver[];
  summary: string;
  disclaimer: string;
}
