"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Key,
  Save,
  RefreshCw,
  SlidersHorizontal,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { AnalystMemoCard, DemoDataNotice, MetricDeltaCard } from "@/components/ui/premium-dashboard";
import { PremiumPanel } from "@/components/ui/premium-panel";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Profile
    name: "John Doe",
    email: "john.doe@finsight.com",
    company: "FinSight Analytics",
    role: "Risk Analyst",
    workspaceName: "FinSight Demo Workspace",
    defaultCompanyView: "company_snapshot",
    baseCurrency: "USD",

    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    riskAlerts: true,
    reportNotifications: true,
    weeklyDigest: true,
    marketAlerts: true,
    newsAlerts: true,
    investmentHealthAlerts: true,

    // Privacy & Security
    twoFactorAuth: false,
    dataRetention: "1year",
    auditLogging: true,

    // Appearance
    theme: "system",
    language: "en",
    timezone: "UTC",

    // Data & API
    apiKey: "fins_••••••••••••••••",
    webhookUrl: "",
    dataExportFormat: "json",
    marketProvider: "mock",
    newsProvider: "mock",
    financialDataMode: "mock",
    riskThresholdHigh: "70",
    riskThresholdCritical: "85",
    investmentHealthWatchlist: "60",
    aiTone: "analyst",
    aiDetailLevel: "balanced",
    includeDisclaimers: true,
    allowProviderCalls: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate a local mock save.
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const updateSetting = (key: string, value: string | boolean | null) => {
    if (value !== null) {
      setSettings(prev => ({ ...prev, [key]: value }));
    }
  };

  const settingsCoverage = [
    {
      label: "Profile",
      detail: "Analyst identity and role metadata",
      value: settings.role,
    },
    {
      label: "Workspace",
      detail: "Default company view, currency, and workspace name",
      value: settings.baseCurrency,
    },
    {
      label: "Model preferences",
      detail: "Mock data mode and export format choices",
      value: settings.financialDataMode === "mock" ? "Mock" : "Disabled",
    },
    {
      label: "Risk thresholds",
      detail: "High, critical, and investment-health watchlist boundaries",
      value: `${settings.riskThresholdHigh}/${settings.riskThresholdCritical}`,
    },
    {
      label: "AI analyst",
      detail: "Tone, detail level, disclaimers, and no-provider-call guardrail",
      value: settings.aiDetailLevel,
    },
    {
      label: "Market/news providers",
      detail: "Provider selections are placeholders only",
      value: "Mock",
    },
    {
      label: "Notifications",
      detail: "Risk, market, news, report, and digest switches",
      value: settings.emailNotifications ? "Email on" : "Email off",
    },
    {
      label: "Appearance",
      detail: "Theme, language, and timezone controls",
      value: settings.theme,
    },
  ];

  return (
    <DashboardPageShell maxWidth="wide">
      <PageHeader
        eyebrow="Workspace Controls"
        title="Settings"
        description="Manage mock workspace preferences, thresholds, provider placeholders, and analyst output settings."
        icon={SlidersHorizontal}
        actions={
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving Locally...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
        }
      />

      <DemoDataNotice
        title="Settings are local workspace preferences"
        description="Save Changes simulates a local preference save. Authentication, provider credentials, webhook delivery, persistence, and external AI or market/news calls are not implemented in this prototype."
        icon={SlidersHorizontal}
      />

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricDeltaCard
          label="Workspace mode"
          value="Demo"
          detail="Preferences are held in component state and reset with the session."
          tone="info"
        />
        <MetricDeltaCard
          label="Provider calls"
          value="Off"
          delta="Locked"
          detail="Market, news, and LLM providers remain mock placeholders."
          tone="watch"
        />
        <MetricDeltaCard
          label="Risk thresholds"
          value={`${settings.riskThresholdHigh}+`}
          detail={`Critical alerts start at ${settings.riskThresholdCritical}; investment-health watchlist starts below ${settings.investmentHealthWatchlist}.`}
        />
        <MetricDeltaCard
          label="Notifications"
          value="5"
          detail="Risk, market, news, report, and digest preferences are visible in one place."
          tone="good"
        />
      </div>

      <PremiumPanel className="p-5">
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold">Settings Coverage</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Pass-two settings now expose every workspace area needed for the mock analyst flow without implying live integrations.
            </p>
          </div>
          <Badge variant="outline" className="w-fit">Prototype controls</Badge>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          {settingsCoverage.map((section) => (
            <div key={section.label} className="rounded-lg border bg-background/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold">{section.label}</p>
                <Badge variant="secondary" className="shrink-0 capitalize">
                  {section.value}
                </Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{section.detail}</p>
            </div>
          ))}
        </div>
      </PremiumPanel>

      <Tabs defaultValue="profile" className="space-y-6">
        <div className="safe-scroll-x rounded-2xl border border-white/10 bg-white/[0.035] p-1">
          <TabsList className="inline-flex h-auto min-w-max gap-1 bg-transparent p-0">
            <TabsTrigger value="profile" className="rounded-xl px-4">Profile</TabsTrigger>
            <TabsTrigger value="workspace" className="rounded-xl px-4">Workspace</TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl px-4">Notifications</TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl px-4">Security</TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-xl px-4">Appearance</TabsTrigger>
            <TabsTrigger value="intelligence" className="rounded-xl px-4">Intelligence</TabsTrigger>
            <TabsTrigger value="data" className="rounded-xl px-4">Data & API</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" disabled>
                    Avatar Upload Disabled
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Avatar storage is not implemented in this mock sprint.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => updateSetting("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={settings.company}
                    onChange={(e) => updateSetting("company", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={settings.role}
                    onChange={(e) => updateSetting("role", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workspace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Workspace Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workspaceName">Workspace Name</Label>
                  <Input
                    id="workspaceName"
                    value={settings.workspaceName}
                    onChange={(e) => updateSetting("workspaceName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Default Company View</Label>
                  <Select
                    value={settings.defaultCompanyView}
                    onValueChange={(value) => updateSetting("defaultCompanyView", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company_snapshot">Company Snapshot</SelectItem>
                      <SelectItem value="financial_health">Financial Health</SelectItem>
                      <SelectItem value="risk_assessment">Risk Assessment</SelectItem>
                      <SelectItem value="news_market">News & Market</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Base Currency</Label>
                  <Select
                    value={settings.baseCurrency}
                    onValueChange={(value) => updateSetting("baseCurrency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="AUD">AUD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                Workspace settings are local UI state in this mock sprint. Authentication, team roles, and persistence are not implemented.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Risk Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when risk scores change significantly
                    </p>
                  </div>
                  <Switch
                    checked={settings.riskAlerts}
                    onCheckedChange={(checked) => updateSetting("riskAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Market Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify on price drawdowns, volume spikes, and weak market momentum
                    </p>
                  </div>
                  <Switch
                    checked={settings.marketAlerts}
                    onCheckedChange={(checked) => updateSetting("marketAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>News Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify on negative or high-severity company news events
                    </p>
                  </div>
                  <Switch
                    checked={settings.newsAlerts}
                    onCheckedChange={(checked) => updateSetting("newsAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Investment Health Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when the composite research signal falls below watchlist thresholds
                    </p>
                  </div>
                  <Switch
                    checked={settings.investmentHealthAlerts}
                    onCheckedChange={(checked) => updateSetting("investmentHealthAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Report Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when reports are ready
                    </p>
                  </div>
                  <Switch
                    checked={settings.reportNotifications}
                    onCheckedChange={(checked) => updateSetting("reportNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of activity
                    </p>
                  </div>
                  <Switch
                    checked={settings.weeklyDigest}
                    onCheckedChange={(checked) => updateSetting("weeklyDigest", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
                    />
                    {!settings.twoFactorAuth && (
                      <Badge variant="outline" className="text-orange-600">
                        Not Enabled
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention Period</Label>
                  <Select
                    value={settings.dataRetention}
                    onValueChange={(value) => updateSetting("dataRetention", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                      <SelectItem value="2years">2 Years</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    How long to keep your uploaded data and analysis results
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Keep detailed logs of all account activity
                    </p>
                  </div>
                  <Switch
                    checked={settings.auditLogging}
                    onCheckedChange={(checked) => updateSetting("auditLogging", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance & Localization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => updateSetting("theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => updateSetting("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => updateSetting("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intelligence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Risk & Signal Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="riskThresholdHigh">High Risk Threshold</Label>
                  <Input
                    id="riskThresholdHigh"
                    type="number"
                    value={settings.riskThresholdHigh}
                    onChange={(e) => updateSetting("riskThresholdHigh", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskThresholdCritical">Critical Risk Threshold</Label>
                  <Input
                    id="riskThresholdCritical"
                    type="number"
                    value={settings.riskThresholdCritical}
                    onChange={(e) => updateSetting("riskThresholdCritical", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investmentHealthWatchlist">Investment Health Watchlist</Label>
                  <Input
                    id="investmentHealthWatchlist"
                    type="number"
                    value={settings.investmentHealthWatchlist}
                    onChange={(e) => updateSetting("investmentHealthWatchlist", e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                Thresholds only affect future UI behavior in this mock sprint. They are not persisted and do not change the scoring formulas.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Analyst Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Analyst Tone</Label>
                  <Select
                    value={settings.aiTone}
                    onValueChange={(value) => updateSetting("aiTone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="audit">Audit-style</SelectItem>
                      <SelectItem value="executive">Executive Brief</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Detail Level</Label>
                  <Select
                    value={settings.aiDetailLevel}
                    onValueChange={(value) => updateSetting("aiDetailLevel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">Concise</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Always Include Disclaimers</Label>
                  <p className="text-sm text-muted-foreground">
                    Display research-signal and mock-data limitations in analyst output
                  </p>
                </div>
                <Switch
                  checked={settings.includeDisclaimers}
                  onCheckedChange={(checked) => updateSetting("includeDisclaimers", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Provider Calls</Label>
                  <p className="text-sm text-muted-foreground">
                    Disabled for this sprint; no LLM or market/news provider calls are made
                  </p>
                </div>
                <Switch
                  checked={false}
                  disabled
                  onCheckedChange={(checked) => updateSetting("allowProviderCalls", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data & API Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Financial Data Mode</Label>
                    <Select
                      value={settings.financialDataMode}
                      onValueChange={(value) => updateSetting("financialDataMode", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mock">Mock Fixtures</SelectItem>
                        <SelectItem value="upload_disabled">Upload Parser Disabled</SelectItem>
                        <SelectItem value="api_disabled">Provider API Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Market Data Provider</Label>
                    <Select
                      value={settings.marketProvider}
                      onValueChange={(value) => updateSetting("marketProvider", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mock">Mock Provider</SelectItem>
                        <SelectItem value="finnhub_disabled">Finnhub Placeholder</SelectItem>
                        <SelectItem value="polygon_disabled">Polygon Placeholder</SelectItem>
                        <SelectItem value="alpha_vantage_disabled">Alpha Vantage Placeholder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>News Provider</Label>
                    <Select
                      value={settings.newsProvider}
                      onValueChange={(value) => updateSetting("newsProvider", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mock">Mock Provider</SelectItem>
                        <SelectItem value="newsapi_disabled">NewsAPI Placeholder</SelectItem>
                        <SelectItem value="gdelt_disabled">GDELT Placeholder</SelectItem>
                        <SelectItem value="alpha_vantage_disabled">Alpha Vantage Placeholder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                  Provider selections are placeholders only. This sprint uses local TypeScript mock data and makes no external API calls.
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="apiKey"
                      value={settings.apiKey}
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="outline" size="sm" disabled>
                      <Key className="h-4 w-4 mr-2" />
                      Locked
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    API keys are display-only placeholders; programmatic access is not implemented.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://your-app.com/webhook"
                    value={settings.webhookUrl}
                    onChange={(e) => updateSetting("webhookUrl", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Webhook delivery is not active; this field documents the future integration target.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataExportFormat">Default Export Format</Label>
                  <Select
                    value={settings.dataExportFormat}
                    onValueChange={(value) => updateSetting("dataExportFormat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Mock API Usage Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-sm text-muted-foreground">Demo requests today</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">45,678</div>
                  <p className="text-sm text-muted-foreground">Demo requests this month</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">98%</div>
                  <p className="text-sm text-muted-foreground">Sample uptime label</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AnalystMemoCard
        eyebrow="Governance note"
        title="Settings are designed for a future integrated workspace"
        summary="The current route keeps user-facing controls visible and structured, while marking provider calls, credentials, avatar storage, and persistence as unavailable until the backend work exists."
        bullets={[
          "Workspace, profile, thresholds, model, analyst, provider, notification, and appearance settings are all represented.",
          "Provider-related choices remain explicit placeholders so users can understand the roadmap without triggering live systems.",
          "Save Changes only simulates local preference state and does not write to authentication or persistence layers.",
        ]}
        disclaimer="Do not treat these settings as security controls, compliance controls, data-retention rules, or live provider configuration."
        icon={Bot}
      />
    </DashboardPageShell>
  );
}
