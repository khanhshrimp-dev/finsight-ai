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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { PageHeader } from "@/components/dashboard/page-header";

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

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4 xl:grid-cols-7">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="data">Data & API</TabsTrigger>
        </TabsList>

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
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
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
                  checked={settings.allowProviderCalls}
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
                    <Button variant="outline" size="sm">
                      <Key className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use this key to access the FinSight API programmatically
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
                    Receive real-time notifications about risk changes
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
              <CardTitle>API Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-sm text-muted-foreground">Requests Today</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">45,678</div>
                  <p className="text-sm text-muted-foreground">Requests This Month</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">98%</div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardPageShell>
  );
}
