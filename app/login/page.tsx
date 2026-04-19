"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TrendingUp,
  Eye,
  EyeOff,
  ShieldCheck,
  BarChart3,
  Bot,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Risk Scoring",
    description: "AI-powered distress models updated continuously from financial filings.",
  },
  {
    icon: ShieldCheck,
    title: "Fraud Signal Detection",
    description: "Beneish M-Score and multi-factor anomaly screening across 12 indicators.",
  },
  {
    icon: Bot,
    title: "AI Financial Copilot",
    description: "Ask natural-language questions and get structured risk intelligence instantly.",
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* ─── Left Panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 relative overflow-hidden">
        {/* Decorative background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Accent glow */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 shadow-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            FinSight <span className="text-blue-400">AI</span>
          </span>
        </div>

        {/* Headline + features */}
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-white">
              Financial risk intelligence,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                explained by AI.
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              Turn raw financial statements into audit-ready risk reports in seconds—not hours.
            </p>
          </div>

          <div className="space-y-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{f.title}</p>
                    <p className="text-slate-400 text-sm leading-relaxed mt-0.5">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quote */}
        <div className="relative z-10 border-l-2 border-blue-500/40 pl-5">
          <blockquote className="text-slate-300 text-sm italic leading-relaxed">
            &ldquo;Risk comes from not knowing what you&rsquo;re doing. The tools that expose
            hidden financial fragility are the ones that protect capital.&rdquo;
          </blockquote>
          <p className="mt-2 text-xs text-slate-500">— Adapted from Warren Buffett</p>
        </div>
      </div>

      {/* ─── Right Panel ────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            FinSight <span className="text-blue-500">AI</span>
          </span>
        </div>

        <div className="w-full max-w-[400px] space-y-8">
          {/* Header */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your FinSight AI workspace.
            </p>
          </div>

          {/* Demo button */}
          <Link href="/dashboard" className="block">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-medium text-sm h-10 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              Continue with Demo
            </button>
          </Link>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground">or sign in with email</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="analyst@firm.com"
                autoComplete="email"
                className="h-10"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-blue-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
            >
              Sign In
            </Button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign up
            </Link>
          </p>

          {/* Footer note */}
          <p className="text-center text-[11px] text-muted-foreground/60 leading-relaxed">
            By signing in, you agree to FinSight AI&apos;s{" "}
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            {" "}and{" "}
            <span className="hover:underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
