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
  Search,
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
    label: "Command",
    items: [
      { label: "Command Center", href: "/dashboard", icon: LayoutDashboard },
      { label: "Companies", href: "/dashboard/companies", icon: Building2 },
      { label: "Compare", href: "/dashboard/compare", icon: GitCompare },
      { label: "Simulator", href: "/dashboard/simulator", icon: SlidersHorizontal },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Market", href: "/dashboard/market", icon: LineChart },
      { label: "News", href: "/dashboard/news", icon: Newspaper },
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
        "flex h-16 shrink-0 items-center gap-2.5 border-b border-white/10 px-4",
        collapsed && "justify-center px-0"
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-cyan-400 to-violet-400 text-primary-foreground shadow-[0_0_40px_rgba(99,102,241,0.28)]">
        <TrendingUp className="h-4 w-4" aria-hidden="true" />
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <span className="block text-sm font-semibold tracking-tight">
            FinSight <span className="text-primary">AI</span>
          </span>
          <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Intelligence OS
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
    <nav className="flex-1 overflow-y-auto px-2.5 py-4 scrollbar-thin" aria-label="Dashboard navigation">
      {navGroups.map((group) => (
        <div key={group.label} className="mb-5 last:mb-0">
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
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
                    "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium outline-none transition-all",
                    "focus-visible:ring-2 focus-visible:ring-ring/60",
                    isActive
                      ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(116,146,255,0.18)]"
                      : "text-sidebar-foreground/64 hover:bg-white/[0.045] hover:text-sidebar-accent-foreground",
                    collapsed && "justify-center px-0 py-2.5"
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-opacity",
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
        "relative hidden shrink-0 flex-col border-r border-white/10 bg-sidebar/92 shadow-[20px_0_80px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all duration-300 lg:flex",
        collapsed ? "w-16" : "w-64 xl:w-72"
      )}
    >
      <SidebarBrand collapsed={collapsed} />
      {!collapsed && (
        <div className="px-3 py-3">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2 text-xs text-muted-foreground">
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Command search</span>
            <span className="ml-auto rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[10px]">⌘K</span>
          </div>
        </div>
      )}
      <SidebarNav collapsed={collapsed} />

      <div className="border-t border-white/10 p-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn("w-full h-9 rounded-xl", collapsed && "px-0 justify-center")}
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
          <div className="flex items-center gap-1.5 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-3 py-2.5">
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
        className="lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open dashboard navigation"
        aria-expanded={open}
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close dashboard navigation"
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(92vw,340px)] flex-col border-r border-white/10 bg-sidebar shadow-2xl animate-in slide-in-from-left-2 duration-200">
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
