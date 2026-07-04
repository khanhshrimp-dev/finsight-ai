import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DashboardPageShellMaxWidth = "default" | "wide" | "full";

interface DashboardPageShellProps {
  children: ReactNode;
  className?: string;
  maxWidth?: DashboardPageShellMaxWidth;
}

const maxWidthClass: Record<DashboardPageShellMaxWidth, string> = {
  default: "max-w-[1400px]",
  wide: "max-w-[1500px]",
  full: "max-w-none",
};

export function DashboardPageShell({
  children,
  className,
  maxWidth = "default",
}: DashboardPageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-5 sm:px-6 lg:px-8 lg:py-6",
        "space-y-6 animate-in fade-in-0 slide-in-from-bottom-1 duration-300",
        maxWidthClass[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}
