"use client";

import { cn } from "@/lib/utils";
import { getRiskTierFromScore } from "@/lib/utils/risk";

interface RiskScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  className?: string;
  animated?: boolean;
}

export function RiskScoreGauge({
  score,
  size = "md",
  showLabel = true,
  className,
}: RiskScoreGaugeProps) {
  const tier = getRiskTierFromScore(score);

  const sizes = {
    sm: { outer: 64, stroke: 4, fontSize: "text-lg", labelSize: "text-[9px]" },
    md: { outer: 96, stroke: 6, fontSize: "text-2xl", labelSize: "text-[10px]" },
    lg: { outer: 128, stroke: 7, fontSize: "text-3xl", labelSize: "text-xs" },
    xl: { outer: 180, stroke: 9, fontSize: "text-5xl", labelSize: "text-sm" },
  };

  const { outer, stroke, fontSize, labelSize } = sizes[size];
  const r = (outer - stroke * 2) / 2;
  const cx = outer / 2;
  const cy = outer / 2;

  // Arc spans 240 degrees (from 150° to 30° going clockwise)
  const startAngle = 150;
  const totalAngle = 240;
  const circumference = 2 * Math.PI * r;
  const arcLength = (totalAngle / 360) * circumference;
  const scoreOffset = ((100 - score) / 100) * arcLength;

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: Math.round((cx + r * Math.cos(rad)) * 1000) / 1000,
      y: Math.round((cy + r * Math.sin(rad)) * 1000) / 1000
    };
  }

  function describeArc(startDeg: number, endDeg: number) {
    const start = polarToCartesian(cx, cy, r, startDeg);
    const end = polarToCartesian(cx, cy, r, endDeg);
    const largeArcFlag = endDeg - startDeg <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  }

  const endAngle = startAngle + totalAngle;
  const scoreAngle = startAngle + (score / 100) * totalAngle;

  const scoreColors = {
    healthy: "#10b981",
    medium: "#f59e0b",
    high: "#f97316",
    critical: "#ef4444",
  };

  const color = scoreColors[tier];

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <div className="relative" style={{ width: outer, height: outer }}>
        <svg width={outer} height={outer} className="overflow-visible">
          {/* Background track */}
          <path
            d={describeArc(startAngle, endAngle)}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            className="text-muted/40"
          />
          {/* Score arc */}
          <path
            d={describeArc(startAngle, scoreAngle)}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 ${stroke}px ${color}60)`,
            }}
          />
          {/* Zone markers */}
          {[25, 50, 75].map((mark) => {
            const markAngle = startAngle + (mark / 100) * totalAngle;
            const inner = polarToCartesian(cx, cy, r - stroke - 4, markAngle);
            const outer2 = polarToCartesian(cx, cy, r + stroke + 2, markAngle);
            return (
              <line
                key={mark}
                x1={inner.x}
                y1={inner.y}
                x2={outer2.x}
                y2={outer2.y}
                stroke="currentColor"
                strokeWidth={1}
                className="text-muted-foreground/20"
              />
            );
          })}
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold tabular-nums leading-none", fontSize)} style={{ color }}>
            {score}
          </span>
          {showLabel && (
            <span className={cn("text-muted-foreground font-medium mt-0.5", labelSize)}>
              / 100
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
