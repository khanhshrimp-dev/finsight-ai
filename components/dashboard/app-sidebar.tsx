"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  GitCompare,
  Upload,
  Bot,
  FileText,
  Bell,
  Settings,
  SlidersHorizontal,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Zap,
  LineChart,
  Newspaper,
  Menu,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Companies", href: "/dashboard/companies", icon: Building2 },
      { label: "Compare", href: "/dashboard/compare", icon: GitCompare },
      { label: "Scenario Simulator", href: "/dashboard/simulator", icon: SlidersHorizontal },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Market Intelligence", href: "/dashboard/market", icon: LineChart },
      { label: "News Intelligence", href: "/dashboard/news", icon: Newspaper },
      { label: "AI Copilot", href: "/dashboard/copilot", icon: Bot, badge: "AI" },
      { label: "Reports", href: "/dashboard/reports", icon: FileText },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Alerts", href: "/dashboard/alerts", icon: Bell, badge: "10" },
      { label: "Upload", href: "/dashboard/upload", icon: Upload },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

function SidebarBrand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-14 shrink-0 items-center gap-2.5 border-b px-4",
        collapsed && "justify-center px-0"
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <TrendingUp className="h-4 w-4" aria-hidden="true" />
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <span className="block text-sm font-semibold tracking-tight">
            FinSight <span className="text-primary">AI</span>
          </span>
          <span className="block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Mock Intelligence
          </span>
        </div>
      )}
    </div>
  );
}

function SidebarNav({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin" aria-label="Dashboard navigation">
      {navGroups.map((group) => (
        <div key={group.label} className="mb-4 last:mb-0">
          {!collapsed && (
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80">
              {group.label}
            </p>
          )}

          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-all",
                    "focus-visible:ring-2 focus-visible:ring-ring/60",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    collapsed && "justify-center px-0 py-2.5"
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity",
                      isActive && "opacity-100"
                    )}
                  />
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
                        item.badge === "AI"
                          ? "bg-violet-500/15 text-violet-700 dark:text-violet-300"
                          : "bg-red-500/15 text-red-700 dark:text-red-300"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {collapsed && (
                    <div className="absolute left-full z-50 ml-2 hidden items-center group-hover:flex">
                      <div className="whitespace-nowrap rounded-md border bg-popover px-2.5 py-1.5 text-xs font-medium text-popover-foreground shadow-md">
                        {item.label}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative hidden shrink-0 flex-col border-r bg-sidebar/95 transition-all duration-300 md:flex",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarBrand collapsed={collapsed} />
      <SidebarNav collapsed={collapsed} />

      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn("w-full h-8", collapsed && "px-0 justify-center")}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>

      {!collapsed && (
        <div className="px-3 pb-3">
          <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-2">
            <Zap className="h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
              Demo Mode - Mock Data
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}

export function MobileDashboardNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open dashboard navigation"
        aria-expanded={open}
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close dashboard navigation"
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(88vw,320px)] flex-col border-r bg-sidebar shadow-2xl animate-in slide-in-from-left-2 duration-200">
            <div className="flex items-center justify-between border-b pr-3">
              <SidebarBrand />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="Close dashboard navigation"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <SidebarNav onNavigate={() => setOpen(false)} />
            <div className="border-t p-3">
              <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2.5 py-2">
                <Zap className="h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                  Demo Mode - Mock Data
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
