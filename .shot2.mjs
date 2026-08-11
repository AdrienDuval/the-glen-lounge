import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = process.env.SHOT_OUT;
const browser = await chromium.launch({ executablePath: CHROME });

for (const [name, w, h, path] of [
  ["fin-m-studio", 390, 844, "/fr/appartements/a10-2-a"],
  ["fin-m-index", 390, 844, "/fr/appartements"],
  ["fin-m-home", 390, 844, "/fr"],
  ["fin-320", 320, 720, "/fr/appartements/a10-2-a"],
]) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 150)));
  page.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 150)));
  await page.goto("http://localhost:3201" + path, { waitUntil: "networkidle", timeout: 60000 });
  await page
    .waitForFunction(() => document.documentElement.dataset.loaded === "1", { timeout: 20000 })
    .catch(() => {});
  await page.waitForTimeout(1800);

  const geo = await page.evaluate(() => {
    const band =
      document.querySelector("[class*=StudioGallery_hero__]") ??
      document.querySelector("[class*=StudiosIndex_hero__]") ??
      document.querySelector("[class*=Hero_stage__]");
    if (!band) return null;
    const b = band.getBoundingClientRect();
    const img = band.querySelector("img");
    return {
      band: `${Math.round(b.width)}x${Math.round(b.height)}`,
      ratio: (b.width / b.height).toFixed(2),
      natural: img ? `${img.naturalWidth}x${img.naturalHeight}` : "n/a",
      filter: img ? getComputedStyle(img).filter : "n/a",
    };
  });
  console.log(`${name.padEnd(14)} band ${geo?.band} ratio ${geo?.ratio} img ${geo?.natural} filter ${geo?.filter}${errs.length ? "  ⚠ " + errs[0] : ""}`);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await ctx.close();
}

await browser.close();
