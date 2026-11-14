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

async function verifyViewport(name, width, height, runActions = false) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(`[${name}] ${msg.text()}`);
  });
  page.on('pageerror', (err) => pageErrors.push(`[${name}] ${String(err)}`));
  page.on('requestfailed', (req) => {
    failedRequests.push(`[${name}] ${req.url()} -> ${req.failure()?.errorText}`);
  });

  await page.goto(targetUrl, { waitUntil: 'load', timeout: 20000 });
  await page.waitForFunction(
    () => {
      if (document.querySelector('[data-preloader]')) return false;
      const reveals = Array.from(document.querySelectorAll('#hero .hero-reveal'));
      return reveals.length > 0 && reveals.every((el) => parseFloat(getComputedStyle(el).opacity || '0') > 0.98);
    },
    null,
    { timeout: 8000 }
  );
  await page.waitForTimeout(350);

  const cdp = await context.newCDPSession(page);
  async function snap(label) {
    if (!saveScreenshots) return;
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, `${name}-${label}.png`), Buffer.from(data, 'base64'));
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

  const initialMetrics = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    const gl = canvas ? canvas.getContext('webgl2') || canvas.getContext('webgl') : null;
    return {
      horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      webglContext: Boolean(gl),
      fontsLoaded: document.fonts.size,
    };
  });

  await snap('01-hero');

  if (runActions) {
    await page.click('[data-cursor="ED-04"]');
    await page.waitForTimeout(450);
  }

  await scrollToSection('anatomy', 1650);
  await snap('02-anatomy');

  await scrollToSection('thermal', 1350);
  await snap('03-thermal');

  await scrollToSection('editions', 40);
  await snap('04-editions');

  if (runActions) {
    await page.fill('input[placeholder="E.G. K.01"]', 'K.99');
    await page.click('[data-cursor="1000ML"]');
    await page.click('[data-cursor="ADD TO BAG"]');
    await page.waitForTimeout(450);
    await snap('04b-cart');
    await page.click('button[aria-label="Close bag"]');
  }

  await scrollToSection('lookbook', 500);
  await snap('05-lookbook');

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  await snap('06-footer');

  const finalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth
  );

  await context.close();
  return { ...initialMetrics, finalOverflow };
}

const results = {
  desktop1440: await verifyViewport('desktop-1440', 1440, 900, true),
  tablet768: await verifyViewport('tablet-768', 768, 1024, false),
  mobile390: await verifyViewport('mobile-390', 390, 844, false),
  mobile360: await verifyViewport('mobile-360', 360, 780, false),
};

await browser.close();

const summary = {
  targetUrl,
  results,
  consoleErrors,
  pageErrors,
  failedRequests,
};
console.log(JSON.stringify(summary, null, 2));

const anyOverflow = Object.values(results).some(
  (r) => r.horizontalOverflow || r.finalOverflow || !r.webglContext
);

if (
  anyOverflow ||
  consoleErrors.length > 0 ||
  pageErrors.length > 0 ||
  failedRequests.length > 0
) {
  process.exit(1);
}
