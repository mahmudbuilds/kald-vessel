import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const CANDIDATE_BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const executablePath = CANDIDATE_BROWSERS.find((p) => fs.existsSync(p));
if (!executablePath) {
  console.error('No Chrome/Edge binary found. Set CHROME_PATH env var.');
  process.exit(1);
}

const targetUrl = process.env.VERIFY_URL || 'http://localhost:5173/';
const saveScreenshots = process.env.SAVE_SCREENSHOTS === '1';
const outDir = path.resolve(process.cwd(), 'screenshots');
if (saveScreenshots) fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ['--enable-webgl', '--ignore-gpu-blocklist', '--no-sandbox'],
});

const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];

const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => pageErrors.push(String(err)));
page.on('requestfailed', (req) => {
  failedRequests.push(`${req.url()} -> ${req.failure()?.errorText}`);
});

await page.goto(targetUrl, { waitUntil: 'load', timeout: 20000 });
await page.waitForTimeout(2300);

const cdp = await context.newCDPSession(page);
async function snap(name) {
  if (!saveScreenshots) return;
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(outDir, name), Buffer.from(data, 'base64'));
}

async function scrollToSection(id, extraOffset = 0) {
  await page.evaluate(
    ({ id, extraOffset }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY + extraOffset;
      window.scrollTo(0, top);
    },
    { id, extraOffset }
  );
  await page.waitForTimeout(850);
}

const desktopMetrics = await page.evaluate(() => {
  const canvas = document.querySelector('canvas');
  const gl = canvas ? canvas.getContext('webgl2') || canvas.getContext('webgl') : null;
  return {
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
    webglContext: Boolean(gl),
    fontsLoaded: document.fonts.size,
  };
});

await snap('01-hero.png');
await page.click('[data-cursor="ED-04"]');
await scrollToSection('anatomy', 1750);
await snap('02-anatomy.png');
await scrollToSection('thermal', 1420);
await snap('03-thermal.png');
await scrollToSection('editions', 80);
await page.fill('input[placeholder="E.G. K.01"]', 'K.99');
await page.click('[data-cursor="1000ML"]');
await page.click('[data-cursor="ADD TO BAG"]');
await page.waitForTimeout(450);
await snap('04-cart.png');
await page.click('button[aria-label="Close bag"]');

await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(700);
const mobileOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth > window.innerWidth
);
await snap('05-mobile.png');

await browser.close();

const summary = {
  targetUrl,
  desktopMetrics,
  mobileOverflow,
  consoleErrors,
  pageErrors,
  failedRequests,
};
console.log(JSON.stringify(summary, null, 2));

if (
  desktopMetrics.horizontalOverflow ||
  mobileOverflow ||
  !desktopMetrics.webglContext ||
  consoleErrors.length > 0 ||
  pageErrors.length > 0 ||
  failedRequests.length > 0
) {
  process.exit(1);
}
