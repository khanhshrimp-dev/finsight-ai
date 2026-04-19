import Link from "next/link";
import {
  TrendingUp,
  ShieldCheck,
  Bot,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  FileSearch,
  GitCompare,
  Upload,
  ChevronRight,
  Star,
  Building2,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: ShieldCheck,
    title: "Distress Risk Scoring",
    description:
      "Altman Z-Score enhanced models quantify financial distress probability across 12 key financial ratios with confidence intervals.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: AlertTriangle,
    title: "Fraud Signal Detection",
    description:
      "Beneish M-Score inspired screening flags unusual revenue-cash divergence, receivables anomalies, and margin irregularities.",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    icon: Bot,
    title: "AI Copilot Explanations",
    description:
      "Plain-English summaries of financial position, risk drivers, and recommended actions — powered by LLM analysis.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: GitCompare,
    title: "Peer Benchmarking",
    description:
      "Compare companies against sector averages, top quartile, and peer medians across all key financial metrics.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: LineChart,
    title: "Trend Analysis",
    description:
      "Multi-period trend visualization for revenue, margins, cash flow, and risk scores with period-over-period change analysis.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: FileSearch,
    title: "Explainable Risk Drivers",
    description:
      "SHAP-ready feature importance visualization shows exactly which metrics are driving each company's risk classification.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

const useCases = [
  {
    icon: Building2,
    title: "Audit & Assurance",
    description: "Risk-based audit planning, fraud risk assessment, and going concern analysis at scale.",
    items: ["Identify high-risk clients early", "Document risk factors systematically", "Going concern red flags"],
  },
  {
    icon: BarChart3,
    title: "Credit Risk",
    description: "Pre-lending due diligence, covenant monitoring, and portfolio-level distress screening.",
    items: ["Creditworthiness scoring", "Covenant breach early warning", "Portfolio stress testing"],
  },
  {
    icon: ShieldCheck,
    title: "Fraud Screening",
    description: "Quantitative fraud indicators surface suspicious patterns before they escalate.",
    items: ["Revenue recognition anomalies", "Receivables irregularities", "Earnings quality concerns"],
  },
  {
    icon: TrendingUp,
    title: "Financial Analysis",
    description: "Deep financial health analysis for equity research, M&A diligence, and investment decisions.",
    items: ["Comprehensive ratio analysis", "Peer comparison dashboards", "AI-generated memos"],
  },
];

const steps = [
  {
    step: "01",
    title: "Upload or select financial data",
    description: "Import from CSV, connect your data pipeline, or select from our sample company database to get started immediately.",
    icon: Upload,
  },
  {
    step: "02",
    title: "AI analyzes 20+ financial metrics",
    description: "Our models compute liquidity, leverage, profitability, efficiency, and fraud indicators — all with explanations.",
    icon: Zap,
  },
  {
    step: "03",
    title: "Review risk scores and insights",
    description: "Explore interactive dashboards, benchmark against peers, query the AI copilot, and export professional reports.",
    icon: BarChart3,
  },
];

const testimonials = [
  {
    quote: "FinSight AI cut our credit analysis time in half. The fraud signals caught a receivables anomaly our traditional model missed entirely.",
    author: "Senior Credit Officer",
    company: "Regional Commercial Bank",
    role: "Credit Risk",
  },
  {
    quote: "The AI-generated memos are remarkably professional. I use them as a starting point for every new audit engagement.",
    author: "Senior Audit Manager",
    company: "Big 4 Accounting Firm",
    role: "External Audit",
  },
  {
    quote: "Benchmarking against sector peers in seconds. This is the kind of tool I wished existed when I was doing FP&A.",
    author: "VP of Finance",
    company: "Private Equity Portfolio Co.",
    role: "FP&A",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-base">
              FinSight <span className="text-primary">AI</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it works</Link>
            <Link href="#use-cases" className="hover:text-foreground transition-colors">Use cases</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Open Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-24">
          <div className="absolute inset-0 gradient-hero pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 text-xs font-medium">
              <Zap className="h-3 w-3 text-primary" />
              AI-Powered Financial Intelligence
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
              Turn Financial Statements Into{" "}
              <span className="text-primary">Explainable Risk Intelligence</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Detect financial distress signals, screen for fraud indicators, benchmark against peers, and get plain-English AI explanations — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 h-12 px-8">
                  Open Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/companies">
                <Button size="lg" variant="outline" className="gap-2 h-12 px-8">
                  View Demo Companies
                </Button>
              </Link>
            </div>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { value: "20+", label: "Financial ratios analyzed" },
                { value: "4", label: "Risk tier classifications" },
                { value: "6", label: "Fraud signal categories" },
                { value: "AI", label: "Copilot explanations" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mock Dashboard Preview */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="rounded-2xl border bg-card shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground font-mono">finsight.ai/dashboard</span>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  {[
                    { name: "Apex Technologies", score: 12, tier: "Healthy" },
                    { name: "Redstone Retail", score: 84, tier: "Critical" },
                    { name: "Novara BioSciences", score: 67, tier: "High Risk" },
                    { name: "Cascade Mfg", score: 41, tier: "Medium" },
                    { name: "Meridian Health", score: 55, tier: "Medium" },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center gap-3 rounded-lg border bg-background/60 p-3">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary/10 text-primary shrink-0">
                        {c.score}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{c.name}</div>
                        <div className="text-[10px] text-muted-foreground">{c.tier}</div>
                      </div>
                      <div className="ml-auto shrink-0">
                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${c.score}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="md:col-span-2 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Avg Risk Score", value: "51.8" },
                      { label: "Critical Companies", value: "1" },
                      { label: "Fraud Flags", value: "1" },
                    ].map((m) => (
                      <div key={m.label} className="rounded-lg border bg-background/60 p-3">
                        <div className="text-[10px] text-muted-foreground">{m.label}</div>
                        <div className="text-xl font-bold">{m.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border bg-background/60 p-4">
                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-3">Risk Distribution</div>
                    <div className="space-y-2">
                      {[
                        { label: "Healthy", pct: 20 },
                        { label: "Medium Risk", pct: 40 },
                        { label: "High Risk", pct: 20 },
                        { label: "Critical", pct: 20 },
                      ].map((t) => (
                        <div key={t.label} className="flex items-center gap-2">
                          <div className="text-[10px] w-20 text-muted-foreground">{t.label}</div>
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${t.pct}%` }} />
                          </div>
                          <div className="text-[10px] text-muted-foreground w-6">{t.pct}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border bg-background/60 p-4">
                    <div className="text-[10px] text-muted-foreground mb-2 font-medium uppercase tracking-wider">AI Copilot</div>
                    <div className="space-y-2">
                      <div className="text-xs rounded-lg bg-muted/60 p-2.5">Why is Redstone Retail flagged critical?</div>
                      <div className="text-xs rounded-lg bg-primary/10 p-2.5 text-primary ml-4">
                        Redstone carries $3.58B in debt against only $220M equity, current ratio 0.50x, negative FCF. Covenant breach risk elevated within 60 days...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 text-xs">Platform Features</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Everything you need for financial risk intelligence
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Professional-grade analytics transforming raw financial statements into actionable risk insights.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <Card key={f.title} className="p-6 hover:shadow-lg transition-all hover:-translate-y-0.5 duration-200">
                    <CardContent className="p-0">
                      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.bg} mb-4`}>
                        <Icon className={`h-5 w-5 ${f.color}`} />
                      </div>
                      <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 text-xs">How It Works</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">From data to intelligence in three steps</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Get actionable financial risk insights without building your own models.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="relative z-10 flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section id="use-cases" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 text-xs">Use Cases</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built for finance professionals</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Purpose-built workflows for the teams that need financial risk intelligence most.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((uc) => {
                const Icon = uc.icon;
                return (
                  <Card key={uc.title} className="p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 duration-200">
                    <CardContent className="p-0">
                      <Icon className="h-7 w-7 text-primary mb-4" />
                      <h3 className="font-semibold text-base mb-2">{uc.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{uc.description}</p>
                      <ul className="space-y-1.5">
                        {uc.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 text-xs">Testimonials</Badge>
              <h2 className="text-3xl font-bold mb-4">Trusted by finance professionals</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <Card key={t.author} className="p-6">
                  <CardContent className="p-0">
                    <div className="flex gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {t.author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold">{t.author}</div>
                        <div className="text-[10px] text-muted-foreground">{t.role} · {t.company}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 border-y bg-primary/5">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Start analyzing financial risk today</h2>
            <p className="text-muted-foreground text-lg mb-10">
              No setup required. Five pre-loaded demo companies with full financial data, risk scores, and AI explanations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 h-12 px-10">
                  Launch Dashboard <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="gap-2 h-12 px-8">Create free account</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm">FinSight AI</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              AI-generated insights should support, not replace, professional judgment. For demonstration purposes only.
            </p>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
