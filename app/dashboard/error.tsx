"use client";

import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { ErrorState } from "@/components/ui/error-state";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <DashboardPageShell>
      <ErrorState
        title="Dashboard view could not load"
        description="The mock dashboard route hit an unexpected rendering error. Retry the view or navigate to another dashboard section."
        actionLabel="Retry"
        onAction={reset}
      />
    </DashboardPageShell>
  );
}
