"use client";

import Link from "next/link";
import { Bell, Search, Settings, LogOut, User, Moon, Sun, Command, Radio } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { allAlerts } from "@/lib/mock";
import { MobileDashboardNav } from "@/components/dashboard/app-sidebar";

export function TopNavbar() {
  const { theme, setTheme } = useTheme();
  const unreadCount = allAlerts.filter((a) => !a.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-white/10 bg-background/72 px-3 backdrop-blur-xl sm:px-4">
      <MobileDashboardNav />

      <div className="hidden min-w-0 lg:block">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Radio className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
          Live Mock Workspace
        </p>
      </div>

      <div className="relative hidden flex-1 max-w-xl md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search companies, tickers, reports..."
          className="h-10 rounded-2xl border-white/10 bg-white/[0.045] pl-9 pr-16 text-sm shadow-inner focus-visible:ring-1"
          aria-label="Search dashboard"
        />
        <div className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-white/10 bg-background/70 px-2 py-1 text-[10px] text-muted-foreground sm:flex">
          <Command className="h-3 w-3" aria-hidden="true" /> K
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Link href="/dashboard/alerts">
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl" aria-label="Open alerts">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 text-[9px] bg-red-500 hover:bg-red-500 flex items-center justify-center rounded-full">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 rounded-2xl border border-white/10 bg-white/[0.035] pl-1.5 pr-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px] bg-primary/15 text-primary font-bold">
                  JD
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block">Jamie D.</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <User className="h-3.5 w-3.5" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <Settings className="h-3.5 w-3.5" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
