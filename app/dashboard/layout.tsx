import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { PremiumAppShell } from "@/components/dashboard/premium-app-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PremiumAppShell>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopNavbar />
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin" id="dashboard-main">
          {children}
        </main>
      </div>
    </PremiumAppShell>
  );
}
