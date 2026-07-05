import type { ReactNode } from "react";
import { BackgroundGrid, AmbientGlow } from "@/components/ui/premium-primitives";

export function PremiumAppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-dvh overflow-hidden bg-background text-foreground">
      <BackgroundGrid />
      <AmbientGlow className="-left-20 top-10" />
      <AmbientGlow className="right-[-7rem] top-32 bg-cyan-400/10" />
      <div className="relative z-10 flex min-w-0 flex-1">{children}</div>
    </div>
  );
}
