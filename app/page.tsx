import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  FileText,
  GitBranch,
  LineChart,
  Newspaper,
  Radar,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  AmbientGlow,
  AnimatedReveal,
  BackgroundGrid,
  CommandPanel,
  GradientDivider,
  HoverLiftCard,
  IntelligenceCard,
  MetricTile,
  PremiumCard,
  ResponsiveGrid,
  ScoreMeter,
  SignalList,
  SignalPill,
} from "@/components/ui/premium-primitives";
import { cn } from "@/lib/utils";

const featureCards = [
  {
    icon: BarChart3,
    title: "Financial Health",
    description: "Liquidity, leverage, profitability, cash flow, and growth signals grouped into analyst-ready score layers.",
  },
  {
    icon: TriangleAlert,
    title: "Risk Signals",
    description: "Deterministic distress and red-flag rules remain visible, explainable, and separated from AI summaries.",
  },
  {
    icon: Sparkles,
    title: "Investment Health",
    description: "A composite mock research signal combines financial quality, risk, market context, and event sentiment.",
  },
  {
    icon: LineChart,
    title: "Market Intelligence",
    description: "Mock price, volume, volatility, drawdown, range, and momentum context in one company workspace.",
  },
  {
    icon: Newspaper,
    title: "News Intelligence",
    description: "Event classification, severity, sentiment, and recency weighting give headlines analytical structure.",
  },
  {
    icon: SlidersHorizontal,
    title: "Scenario Simulator",
    description: "Stress-test assumptions and watch deterministic score deltas move before committing to a memo.",
  },
  {
    icon: Bot,
    title: "AI Copilot",
    description: "AI-style output explains the model and rule outputs; it does not create the numerical scores.",
  },
  {
    icon: FileText,
    title: "Reports",
    description: "Mock report previews turn model, market, news, and scenario context into structured analyst memos.",
  },
];

const architecture = [
  "Financials",
  "Risk Model",
  "Market Data",
  "News Events",
  "AI Analyst",
  "Reports",
];

function ProductPreview() {
  return (
    <PremiumCard glow className="relative min-h-[520px] p-4 sm:p-5 lg:p-6">
      <div aria-hidden="true" className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative rounded-2xl border border-white/10 bg-background/70 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <SignalPill tone="good">Mock live</SignalPill>
        </div>
        <div className="grid gap-4 p-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Company intelligence</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">Apex Technologies</h3>
              <p className="mt-1 text-sm text-muted-foreground">NASDAQ · Enterprise Software · APXT</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <ScoreMeter label="Financial Health" value={88} tone="good" />
              <ScoreMeter label="Risk" value={12} tone="good" />
              <ScoreMeter label="Investment" value={79} tone="accent" />
            </div>
            <CommandPanel
              title="Analyst memo"
              description="Strong liquidity and profitable growth support the health signal. Market momentum is constructive, while news sentiment remains positive in the current mock set."
              icon={Bot}
            >
              <SignalList
                items={[
                  { title: "Balance sheet quality is supportive", detail: "Current ratio and cash conversion screen above peer watchlist levels." },
                  { title: "Risk score remains low", detail: "No material fraud or distress rules trigger in the latest mock period." },
                ]}
              />
            </CommandPanel>
          </div>
          <div className="space-y-3">
            <MetricTile label="Price context" value="$153.74" detail="+1.4% mock 1D" tone="good" />
            <MetricTile label="News sentiment" value="77/100" detail="0 negative events" tone="good" />
            <MetricTile label="Market momentum" value="75/100" detail="97% through mock 52-week range" tone="info" />
            <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Signal stream</p>
              <div className="mt-3 space-y-2">
                <SignalPill tone="good">Financials resilient</SignalPill>
                <SignalPill tone="info">Market range high</SignalPill>
                <SignalPill tone="accent">AI memo ready</SignalPill>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-5 left-5 hidden rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm shadow-2xl backdrop-blur md:block">
        <p className="font-mono text-xl font-semibold text-cyan-200">+36.8%</p>
        <p className="text-xs text-cyan-100/75">Mock one-year move</p>
      </div>
      <div className="absolute right-6 top-20 hidden rounded-2xl border border-primary/25 bg-primary/15 px-4 py-3 text-sm shadow-2xl backdrop-blur md:block">
        <p className="font-mono text-xl font-semibold text-primary">12/100</p>
        <p className="text-xs text-primary/75">Low risk score</p>
      </div>
    </PremiumCard>
  );
}

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <BackgroundGrid />
      <AmbientGlow className="left-1/2 top-0 -translate-x-1/2" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="FinSight AI home">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-cyan-400 to-violet-400 text-white shadow-[0_0_40px_rgba(99,102,241,0.28)]">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="font-semibold tracking-tight">FinSight <span className="text-primary">AI</span></span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex" aria-label="Landing navigation">
            <a href="#architecture" className="hover:text-foreground">Architecture</a>
            <a href="#features" className="hover:text-foreground">Platform</a>
            <a href="#simulator" className="hover:text-foreground">Simulator</a>
            <a href="#trust" className="hover:text-foreground">Responsible AI</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/companies" className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex">
              View companies
            </Link>
            <Link href="/dashboard" className={cn(buttonVariants(), "hidden rounded-2xl sm:inline-flex")}>
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-8 lg:py-20">
        <AnimatedReveal className="min-w-0 max-w-3xl">
          <SignalPill tone="accent">
            <Sparkles className="h-3.5 w-3.5" />
            Demo financial intelligence workspace
          </SignalPill>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight [overflow-wrap:anywhere] sm:text-6xl lg:text-7xl">
            AI-powered financial intelligence, grounded in real analysis.
          </h1>
          <p className="mt-6 max-w-[min(42rem,calc(100vw-2rem))] break-words text-base leading-8 text-muted-foreground [overflow-wrap:anywhere] sm:text-lg">
            FinSight AI combines financial models, market signals, news events, and analyst-style AI summaries into one company intelligence workspace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "rounded-2xl")}>
              Launch workspace <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/company/apex-technologies"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-2xl border-white/10 bg-white/[0.035]")}
            >
              View product demo
            </Link>
          </div>
          <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100/85 [overflow-wrap:anywhere]">
            Demo notice: scores and content use local mock data. No investment advice, live market feeds, scraping, persistence, or LLM provider calls are active.
          </div>
        </AnimatedReveal>
        <AnimatedReveal className="min-w-0 lg:pl-6">
          <ProductPreview />
        </AnimatedReveal>
      </section>

      <GradientDivider />

      <section id="architecture" className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Intelligence architecture</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A transparent pipeline from raw signals to analyst output.</h2>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-6">
          {architecture.map((step, index) => (
            <PremiumCard key={step} className="p-4">
              <p className="font-mono text-sm text-primary">0{index + 1}</p>
              <p className="mt-3 text-sm font-semibold">{step}</p>
            </PremiumCard>
          ))}
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Platform modules</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">One system for company research, risk, market, news, AI, and reports.</h2>
          </div>
          <Link
            href="/dashboard/companies"
            className={cn(buttonVariants({ variant: "outline" }), "w-fit rounded-2xl border-white/10 bg-white/[0.035]")}
          >
            Explore universe
          </Link>
        </div>
        <ResponsiveGrid className="mt-10" min="minmax(250px,1fr)">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <HoverLiftCard key={feature.title} className="p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/25 bg-primary/[0.12] text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </HoverLiftCard>
            );
          })}
        </ResponsiveGrid>
      </section>

      <section id="simulator" className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Scenario console</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Stress test assumptions before writing the memo.</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            The simulator shows how deterministic financial assumptions move risk, financial health, and investment-health signals without changing source records.
          </p>
          <div className="mt-6">
            <Link href="/dashboard/simulator" className={cn(buttonVariants(), "rounded-2xl")}>
              Open simulator
            </Link>
          </div>
        </div>
        <PremiumCard className="p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <ScoreMeter label="Original risk" value={12} tone="good" detail="Healthy baseline" />
            <ScoreMeter label="Stressed risk" value={38} tone="watch" detail="+26 downside scenario" />
          </div>
          <div className="mt-5 space-y-3">
            {["Debt / Equity +0.45x", "Net Margin -4.0 pts", "Interest Coverage -2.5x"].map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{item}</span>
                  <span className="h-2 w-32 rounded-full bg-gradient-to-r from-primary to-amber-300" />
                </div>
              </div>
            ))}
          </div>
        </PremiumCard>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <CommandPanel
            title="Structured AI analyst preview"
            description="AI-style output is formatted as an analyst memo with financial, risk, market, news, next-step, and disclaimer sections."
            icon={Bot}
          >
            <SignalList
              items={[
                { title: "Executive summary", detail: "Apex screens healthy in the current mock period." },
                { title: "Risk signals", detail: "No high-severity deterministic red flags trigger." },
                { title: "Next steps", detail: "Review market momentum and scenario sensitivity before report generation." },
              ]}
            />
          </CommandPanel>
          <ResponsiveGrid min="minmax(190px,1fr)">
            <IntelligenceCard eyebrow="Reports" value="3" detail="Mock memo history" icon={FileText} tone="accent" />
            <IntelligenceCard eyebrow="Companies" value="8" detail="Demo universe" icon={Building2} tone="info" />
            <IntelligenceCard eyebrow="Signals" value="5" detail="Research layers" icon={Radar} tone="good" />
          </ResponsiveGrid>
        </div>
      </section>

      <section id="trust" className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <PremiumCard className="p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <ShieldCheck className="h-10 w-10 text-primary" />
              <h2 className="mt-5 text-3xl font-semibold tracking-tight">Responsible by design.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Scores are model/rule-based mock research signals.",
                "AI explains outputs; it does not replace analysis.",
                "The demo platform uses local fixtures only.",
                "No financial advice, valuation, credit, audit, or fraud conclusion is produced.",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </PremiumCard>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <GitBranch className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Build a sharper investment intelligence demo.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Explore the mock workspace, inspect a company, run a scenario, and generate a structured report preview.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "rounded-2xl")}>
            Open Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard/reports"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-2xl border-white/10 bg-white/[0.035]")}
          >
            Preview reports
          </Link>
        </div>
      </section>
    </main>
  );
}
