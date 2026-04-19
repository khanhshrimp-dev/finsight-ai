"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const roles = [
  { value: "analyst", label: "Analyst" },
  { value: "auditor", label: "Auditor" },
  { value: "risk_manager", label: "Risk Manager" },
  { value: "credit_officer", label: "Credit Officer" },
  { value: "student", label: "Student / Portfolio" },
];

const highlights = [
  {
    icon: BarChart3,
    title: "5-Company Demo Portfolio",
    description: "Pre-loaded with real-world financial scenarios across sectors.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-Ready Exports",
    description: "Generate PDF credit briefs and distress reports in one click.",
  },
  {
    icon: Bot,
    title: "AI Copilot Included",
    description: "Context-aware financial Q&A powered by the latest language models.",
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [role, setRole] = useState("");

  return (
    <div className="flex min-h-screen bg-background">
      {/* ─── Left Panel ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-32 -right-16 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 shadow-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            FinSight <span className="text-blue-400">AI</span>
          </span>
        </div>

        {/* Headline */}
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Free during beta — no credit card required
            </div>
            <h1 className="text-4xl font-bold leading-tight text-white">
              Join the analysts who see{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                risk before it surfaces.
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              Set up your workspace in under 60 seconds. Full access to risk analytics, fraud screening, and AI copilot.
            </p>
          </div>

          <div className="space-y-5">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.title} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                    <Icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{h.title}</p>
                    <p className="text-slate-400 text-sm leading-relaxed mt-0.5">{h.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social proof */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex -space-x-2">
              {["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500"].map((color, i) => (
                <div
                  key={i}
                  className={`h-7 w-7 rounded-full border-2 border-slate-800 ${color} flex items-center justify-center text-white text-[10px] font-bold`}
                >
                  {["A", "R", "C", "M"][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-xs font-semibold">1,200+ analysts onboarded</p>
              <p className="text-slate-400 text-[11px]">across buy-side, audit, and credit teams</p>
            </div>
          </div>
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

        <div className="w-full max-w-[400px] space-y-7">
          {/* Header */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
            <p className="text-sm text-muted-foreground">
              Get started with full access to financial risk intelligence.
            </p>
          </div>

          {/* Demo shortcut */}
          <Link href="/dashboard" className="block">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/15 text-violet-600 dark:text-violet-400 font-medium text-sm h-10 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              Skip to Demo Dashboard
            </button>
          </Link>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground">or create an account</span>
            <div className="flex-1 border-t border-border" />
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); router.push("/dashboard"); }}>
            {/* Full name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Smith"
                autoComplete="name"
                className="h-10"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Work email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="jane@firm.com"
                autoComplete="email"
                className="h-10"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
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
              <p className="text-[11px] text-muted-foreground">
                Use 8+ characters with a mix of letters, numbers, and symbols.
              </p>
            </div>

            {/* Role selector */}
            <div className="space-y-1.5">
              <label htmlFor="role" className="text-sm font-medium">
                Your role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 dark:bg-input/30"
              >
                <option value="" disabled className="text-muted-foreground bg-background">
                  Select your role...
                </option>
                {roles.map((r) => (
                  <option key={r.value} value={r.value} className="bg-background text-foreground">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border accent-blue-500 cursor-pointer shrink-0"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer select-none leading-relaxed">
                I agree to FinSight AI&apos;s{" "}
                <span className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</span>
                {" "}and{" "}
                <span className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</span>.
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
            >
              Create Account
            </Button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
