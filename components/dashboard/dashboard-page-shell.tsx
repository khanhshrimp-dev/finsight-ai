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
        "mx-auto w-full min-w-0 px-4 py-5 sm:px-5 md:px-6 xl:px-8 xl:py-7",
        "space-y-5 sm:space-y-6 animate-in fade-in-0 slide-in-from-bottom-1 duration-300 motion-reduce:animate-none",
        maxWidthClass[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}

export const ResponsivePageShell = DashboardPageShell;
