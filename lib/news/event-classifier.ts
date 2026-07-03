import type { NewsEventType, NewsRiskImpact, NewsSeverity, NewsSentiment } from "@/types/news";

const matchAny = (value: string, keywords: string[]) =>
  keywords.some((keyword) => value.includes(keyword));

export function classifyNewsEvent(title: string, summary = ""): NewsEventType {
  const text = `${title} ${summary}`.toLowerCase();

  if (matchAny(text, ["earnings", "quarter", "revenue", "margin"])) return "earnings";
  if (matchAny(text, ["guidance", "outlook", "forecast"])) return "guidance";
  if (matchAny(text, ["lawsuit", "litigation", "class action"])) return "lawsuit";
  if (matchAny(text, ["sec", "doj", "regulator", "regulatory", "subpoena"])) return "regulatory";
  if (matchAny(text, ["ceo", "cfo", "management", "resigns", "appoints"])) return "management_change";
  if (matchAny(text, ["acquisition", "merger", "m&a", "takeover"])) return "m_and_a";
  if (matchAny(text, ["product", "launch", "platform", "approval"])) return "product";
  if (matchAny(text, ["restructuring", "layoffs", "store closures", "cost reduction"])) return "restructuring";
  if (matchAny(text, ["debt", "covenant", "refinancing", "bond", "credit facility"])) return "debt";
  if (matchAny(text, ["upgrade", "downgrade", "rating", "analyst"])) return "analyst_rating";
  if (matchAny(text, ["macro", "rates", "inflation", "recession"])) return "macro";
  if (matchAny(text, ["accounting", "restatement", "revenue recognition", "audit"])) return "accounting_issue";
  if (matchAny(text, ["fraud", "investigation", "whistleblower"])) return "fraud_investigation";

  return "other";
}

export function inferNewsSeverity(
  eventType: NewsEventType,
  sentiment: NewsSentiment,
  riskImpact: NewsRiskImpact
): NewsSeverity {
  if (eventType === "fraud_investigation" || eventType === "accounting_issue") return "critical";
  if (eventType === "lawsuit" || eventType === "regulatory") return "high";
  if (riskImpact === "negative" && sentiment === "negative") return "medium";
  if (riskImpact === "positive" && sentiment === "positive") return "low";
  return "low";
}
