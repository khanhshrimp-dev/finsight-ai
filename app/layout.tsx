import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FinSight AI — Financial Risk Intelligence",
    template: "%s | FinSight AI",
  },
  description:
    "AI-powered financial distress and fraud risk analysis platform. Turn raw financial statements into explainable risk intelligence.",
  keywords: ["financial risk", "distress analysis", "fraud detection", "AI analytics", "fintech"],
  openGraph: {
    title: "FinSight AI — Financial Risk Intelligence",
    description: "Turn financial statements into explainable risk intelligence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
