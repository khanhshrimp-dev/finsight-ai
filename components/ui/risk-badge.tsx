"use client";

import { cn } from "@/lib/utils";
import type { RiskTier, FraudRisk } from "@/types";
import { getRiskLabel, getFraudLabel } from "@/lib/utils/risk";
import { ShieldAlert, ShieldCheck, ShieldX, AlertTriangle } from "lucide-react";

interface RiskBadgeProps {
  tier: RiskTier;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function RiskBadge({ tier, size = "md", showIcon = true, className }: RiskBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3 py-1.5 gap-2",
  };

  const tierClasses = {
    healthy: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400",
    medium: "bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400",
    high: "bg-orange-500/10 text-orange-600 border border-orange-500/20 dark:text-orange-400",
    critical: "bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400",
  };

  const Icon = {
    healthy: ShieldCheck,
    medium: ShieldAlert,
    high: AlertTriangle,
    critical: ShieldX,
  }[tier];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        sizeClasses[size],
        tierClasses[tier],
        className
      )}
    >
      {showIcon && <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />}
      {getRiskLabel(tier)}
    </span>
  );
}

interface FraudBadgeProps {
  risk: FraudRisk;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FraudBadge({ risk, size = "md", className }: FraudBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  const riskClasses = {
    none: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400",
    low: "bg-sky-500/10 text-sky-600 border border-sky-500/20 dark:text-sky-400",
    medium: "bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400",
    high: "bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        sizeClasses[size],
        riskClasses[risk],
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-emerald-500": risk === "none",
        "bg-sky-500": risk === "low",
        "bg-amber-500": risk === "medium",
        "bg-red-500": risk === "high",
      })} />
      Fraud: {getFraudLabel(risk)}
    </span>
  );
}
