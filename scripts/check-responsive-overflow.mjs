#!/usr/bin/env node
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const baseUrl = process.argv[2] ?? "http://localhost:3000";
const port = Number(process.env.CDP_PORT ?? 9333);
const height = Number(process.env.QA_HEIGHT ?? 1200);

const routes = [
  ["/", "home"],
  ["/dashboard", "dashboard"],
  ["/dashboard/companies", "companies"],
  ["/dashboard/company/apex-technologies", "company-detail"],
  ["/dashboard/copilot", "copilot"],
  ["/dashboard/reports", "reports"],
  ["/dashboard/simulator", "simulator"],
  ["/dashboard/compare", "compare"],
  ["/dashboard/market", "market"],
  ["/dashboard/news", "news"],
  ["/dashboard/alerts", "alerts"],
  ["/dashboard/upload", "upload"],
  ["/dashboard/settings", "settings"],
];

const breakpoints = [390, 768, 1024, 1440];

const profileDir = mkdtempSync(join(tmpdir(), "finsight-overflow-"));
const chrome = spawn(chromePath, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  "about:blank",
], {
  stdio: ["ignore", "ignore", "pipe"],
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForChrome() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {}
    await wait(100);
  }
  throw new Error("Chrome did not expose a debugging endpoint in time.");
}

async function createPage() {
  const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, {
    method: "PUT",
  });
  if (!response.ok) {
    throw new Error(`Failed to create Chrome page: ${response.status}`);
  }
  return response.json();
}

function createCdpSession(webSocketDebuggerUrl) {
  const ws = new WebSocket(webSocketDebuggerUrl);
  let nextId = 1;
  const pending = new Map();
  const events = [];

  ws.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(new Error(data.error.message));
      else resolve(data.result);
      return;
    }
    if (data.method) events.push(data);
  });

  return {
    async open() {
      if (ws.readyState === WebSocket.OPEN) return;
      await new Promise((resolve, reject) => {
        ws.addEventListener("open", resolve, { once: true });
        ws.addEventListener("error", reject, { once: true });
      });
    },
    send(method, params = {}) {
      const id = nextId;
      nextId += 1;
      ws.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
      });
    },
    waitForEvent(method, timeoutMs = 5000) {
      const existingIndex = events.findIndex((event) => event.method === method);
      if (existingIndex >= 0) {
        return Promise.resolve(events.splice(existingIndex, 1)[0]);
      }
      return new Promise((resolve, reject) => {
        const startedAt = Date.now();
        const interval = setInterval(() => {
          const index = events.findIndex((event) => event.method === method);
          if (index >= 0) {
            clearInterval(interval);
            resolve(events.splice(index, 1)[0]);
          } else if (Date.now() - startedAt > timeoutMs) {
            clearInterval(interval);
            reject(new Error(`Timed out waiting for ${method}`));
          }
        }, 25);
      });
    },
    close() {
      ws.close();
    },
  };
}

const evaluateOverflow = `
(() => {
  const viewportWidth = window.innerWidth;
  const rootWidth = Math.max(
    document.documentElement.scrollWidth,
    document.body ? document.body.scrollWidth : 0
  );
  const offenders = [];
  const hasContainedScroller = (element) => {
    let current = element.parentElement;
    while (current && current !== document.body) {
      const style = window.getComputedStyle(current);
      const rect = current.getBoundingClientRect();
      const canScroll = ["auto", "scroll"].includes(style.overflowX);
      if (canScroll && rect.left >= -1 && rect.right <= viewportWidth + 1) return true;
      current = current.parentElement;
    }
    return false;
  };
  for (const element of document.querySelectorAll("body *")) {
    if (element.closest("[aria-hidden='true']")) continue;
    if (hasContainedScroller(element)) continue;
    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;
    const rect = element.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) continue;
    if (rect.right > viewportWidth + 1 || rect.left < -1) {
      offenders.push({
        tag: element.tagName.toLowerCase(),
        className: String(element.className || "").slice(0, 120),
        text: String(element.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 90),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
      });
    }
  }
  offenders.sort((a, b) => (b.right - viewportWidth) - (a.right - viewportWidth));
  return {
    viewportWidth,
    rootWidth,
    rootOverflow: Math.max(0, rootWidth - viewportWidth),
    offenders: offenders.slice(0, 6),
  };
})()
`;

let failures = 0;

try {
  await waitForChrome();
  const page = await createPage();
  const cdp = createCdpSession(page.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  for (const width of breakpoints) {
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });

    for (const [route, label] of routes) {
      const url = new URL(route, baseUrl).toString();
      await cdp.send("Page.navigate", { url });
      try {
        await cdp.waitForEvent("Page.loadEventFired", 7000);
      } catch {}
      await wait(700);

      const result = await cdp.send("Runtime.evaluate", {
        expression: evaluateOverflow,
        returnByValue: true,
      });
      const value = result.result.value;
      const contentOverflow = value.offenders.length;
      if (value.rootOverflow > 1 || contentOverflow > 0) {
        failures += 1;
        console.log(`FAIL ${width}px ${label}: root +${value.rootOverflow}px, offenders ${contentOverflow}`);
        for (const offender of value.offenders.slice(0, 3)) {
          console.log(`  ${offender.tag} right=${offender.right} width=${offender.width} text="${offender.text}"`);
        }
      } else {
        console.log(`PASS ${width}px ${label}`);
      }
    }
  }

  cdp.close();
} finally {
  chrome.kill("SIGTERM");
  await wait(250);
  rmSync(profileDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
}

process.exitCode = failures > 0 ? 1 : 0;
