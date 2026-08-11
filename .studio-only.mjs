import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3201";
const ROUTES = ["/fr/appartements/a10-2-a", "/fr/evenements", "/fr/evenements/jeudi-karaoke", "/fr/carte"];

for (const route of ROUTES) {
  for (const w of [320, 390, 719, 720, 900, 1440]) {
    /* One browser per page load — isolates any crash from accumulated state. */
    const browser = await chromium.launch({ executablePath: CHROME });
    const touch = w < 900;
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, hasTouch: touch, isMobile: touch, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errs = new Set();
    page.on("pageerror", (e) => errs.add("pageerror: " + e.message.slice(0, 70)));
    page.on("console", (m) => m.type() === "error" && errs.add("console: " + m.text().slice(0, 70)));
    let line = `${route.padEnd(30)} w=${String(w).padEnd(5)}`;
    try {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForFunction(() => document.documentElement.dataset.loaded === "1", { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(900);
      await page.evaluate(async () => {
        const h = document.body.scrollHeight;
        for (let y = 0; y < h; y += 1400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(300);
      const res = await page.evaluate((vw) => {
        const b = window.scrollX;
        window.scrollTo(9999, 0);
        const s = window.scrollX;
        window.scrollTo(b, 0);
        const off = [];
        if (s > 1) {
          for (const el of document.querySelectorAll("body *")) {
            const st = getComputedStyle(el);
            if (st.display === "none" || st.visibility === "hidden") continue;
            const r = el.getBoundingClientRect();
            if (r.width && r.height && r.right > vw + 1) {
              const c = typeof el.className === "string" ? el.className.split(" ")[0] : "";
              off.push(`${el.tagName}.${c}@${Math.round(r.right)}`);
            }
          }
        }
        return { s, docW: document.documentElement.scrollWidth, off: [...new Set(off)].slice(0, 3) };
      }, w);
      line += ` scrollsX=${String(res.s).padEnd(5)} docW=${String(res.docW).padEnd(5)} ${res.s > 1 ? "SCROLLS! " + res.off.join(" | ") : "ok"}`;
      if (errs.size) line += "  ERRS " + [...errs].join(" ; ");
    } catch (e) {
      line += `  CRASH/FAIL: ${e.message.slice(0, 70)}`;
    }
    console.log(line);
    await browser.close();
  }
}
