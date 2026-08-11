import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = "C:\\Users\\ADRIEN~1\\AppData\\Local\\Temp\\claude\\c--Users-Adrien-Duval-Documents-Projects-the-glen-lounge\\1d1e9332-ac89-4866-829c-fb1f204d3e56\\scratchpad";
const BASE = "http://127.0.0.1:3202";

const PAGES = [
  ["home", "/"],
  ["atelier", "/atelier"],
  ["realisations", "/realisations"],
  ["projet", "/realisations/nikon-plaza"],
  ["mentions", "/mentions-legales"],
  ["ebois", "/e-bois"],
];

const browser = await chromium.launch({ executablePath: CHROME });

for (const [vp, size] of [["desk", { width: 1440, height: 900 }], ["mob", { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  page.on("requestfailed", (r) => errors.push("REQFAIL: " + r.url() + " " + (r.failure()?.errorText ?? "")));

  for (const [name, path] of PAGES) {
    await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(2500);
    // scroll through the whole page so scroll-triggered reveals fire
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += size.height * 0.8) {
      await page.evaluate((yy) => {
        if (window.__lenis) window.__lenis.scrollTo(yy, { immediate: true });
        else window.scrollTo(0, yy);
      }, y);
      await page.waitForTimeout(180);
    }
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}\\${vp}-${name}.png`, fullPage: true });
    console.log(`${vp}/${name}: height=${h}px`);
  }
  if (errors.length) console.log(`\n[${vp}] CONSOLE/NETWORK ISSUES:\n` + [...new Set(errors)].slice(0, 25).join("\n"));
  else console.log(`[${vp}] no console errors`);
  await ctx.close();
}

await browser.close();
