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
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Companies", href: "/dashboard/companies", icon: Building2 },
  { label: "Compare", href: "/dashboard/compare", icon: GitCompare },
  { label: "Upload", href: "/dashboard/upload", icon: Upload },
  { label: "Copilot", href: "/dashboard/copilot", icon: Bot, badge: "AI" },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "Alerts", href: "/dashboard/alerts", icon: Bell, badge: "5" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-sidebar transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-2.5 border-b px-4 h-14 shrink-0",
        collapsed && "justify-center px-0"
      )}>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
          <TrendingUp className="h-4 w-4" />
        </div>
        {!collapsed && (
          <span className="font-bold text-sm tracking-tight">
            FinSight <span className="text-primary">AI</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative group",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-0 py-2.5"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  item.badge === "AI"
                    ? "bg-violet-500/15 text-violet-600 dark:text-violet-400"
                    : "bg-red-500/15 text-red-600 dark:text-red-400"
                )}>
                  {item.badge}
                </span>
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 z-50 hidden group-hover:flex items-center">
                  <div className="rounded-md bg-popover border shadow-md px-2.5 py-1.5 text-xs font-medium whitespace-nowrap text-popover-foreground">
                    {item.label}
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn("w-full h-8", collapsed && "px-0 justify-center")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>

      {/* Demo mode badge */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-2">
            <Zap className="h-3 w-3 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400">Demo Mode — Mock Data</span>
          </div>
        </div>
      )}
    </aside>
  );
}
