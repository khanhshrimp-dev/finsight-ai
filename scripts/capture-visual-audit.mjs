import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const routes = [
  { slug: "home", path: "/" },
  { slug: "dashboard", path: "/dashboard" },
  { slug: "companies", path: "/dashboard/companies" },
  { slug: "company-detail", path: "/dashboard/company/apex-technologies" },
  { slug: "copilot", path: "/dashboard/copilot" },
  { slug: "reports", path: "/dashboard/reports" },
  { slug: "simulator", path: "/dashboard/simulator" },
  { slug: "compare", path: "/dashboard/compare" },
  { slug: "market", path: "/dashboard/market" },
  { slug: "news", path: "/dashboard/news" },
  { slug: "alerts", path: "/dashboard/alerts" },
  { slug: "upload", path: "/dashboard/upload" },
  { slug: "settings", path: "/dashboard/settings" },
];

const breakpoints = [390, 768, 1024, 1440];

const [phase = "baseline", baseUrl = "http://localhost:3001"] = process.argv.slice(2);
const outputDir = path.join(process.cwd(), "visual-audit", phase);

await mkdir(outputDir, { recursive: true });

function capture(route, width) {
  const file = path.join(outputDir, `${route.slug}-${width}.png`);
  const url = new URL(route.path, baseUrl).toString();
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    `--window-size=${width},1200`,
    "--virtual-time-budget=3000",
    `--screenshot=${file}`,
    url,
  ];

  return new Promise((resolve, reject) => {
    const child = spawn(chromePath, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(file);
      } else {
        reject(new Error(`Chrome exited with ${code} for ${url}: ${stderr}`));
      }
    });
  });
}

for (const width of breakpoints) {
  for (const route of routes) {
    const file = await capture(route, width);
    console.log(`${width}px ${route.path} -> ${path.relative(process.cwd(), file)}`);
  }
}
