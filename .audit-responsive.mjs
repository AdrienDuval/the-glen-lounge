import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3201";
const OUT = process.argv[2];

/* Widths chosen around this codebase's own switch points (720, 900) plus the
   real-world floor (320) and ceiling. */
const WIDTHS = [320, 360, 390, 414, 480, 600, 719, 720, 768, 899, 900, 1024, 1280, 1440, 1920];
const ROUTES = [
  ["home", "/fr"],
  ["studios", "/fr/appartements"],
  ["studio", "/fr/appartements/a10-2-a"],
  ["events", "/fr/evenements"],
  ["event", "/fr/evenements/jeudi-karaoke"],
  ["menu", "/fr/carte"],
  ["home-en", "/en"],
];

const browser = await chromium.launch({ executablePath: CHROME });
const findings = [];

for (const [rname, route] of ROUTES) {
  for (const w of WIDTHS) {
    const touch = w < 900;
    const ctx = await browser.newContext({
      viewport: { width: w, height: 900 },
      hasTouch: touch,
      isMobile: touch,
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push("pageerror: " + e.message.slice(0, 110)));
    page.on("console", (m) => m.type() === "error" && errs.push("console: " + m.text().slice(0, 110)));

    /* NOT networkidle: GSAP/Lenis keep the page busy and it never settles —
       a first attempt sat at 90s per load. The site raises its own flag. */
    let status = 0;
    try {
      const r = await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 45000 });
      status = r?.status() ?? 0;
    } catch (e) {
      findings.push({ route: rname, w, kind: "NAV FAIL", detail: e.message.slice(0, 90) });
      await ctx.close();
      continue;
    }
    await page
      .waitForFunction(() => document.documentElement.dataset.loaded === "1", { timeout: 12000 })
      .catch(() => {});
    await page.waitForLoadState("load", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(500);

    /* Scroll the whole page so lazy/scroll-triggered sections lay out, then
       come back: a section that only overflows once revealed still overflows. */
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 900) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 45));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(350);

    const res = await page.evaluate((vw) => {
      const de = document.documentElement;
      const overflow = de.scrollWidth - vw;
      const offenders = [];
      if (overflow > 1) {
        for (const el of document.querySelectorAll("body *")) {
          const s = getComputedStyle(el);
          if (s.display === "none" || s.visibility === "hidden" || s.opacity === "0") continue;
          if (s.position === "fixed") continue;
          const b = el.getBoundingClientRect();
          if (b.width === 0 || b.height === 0) continue;
          if (b.right > vw + 1) {
            /* Only blame it if no ancestor is already clipping it. */
            let clipped = false;
            for (let p = el.parentElement; p; p = p.parentElement) {
              const ps = getComputedStyle(p);
              if (ps.overflowX === "hidden" || ps.overflowX === "auto" || ps.overflowX === "scroll") {
                clipped = true;
                break;
              }
            }
            if (clipped) continue;
            const cls = typeof el.className === "string" ? el.className.split(" ")[0] : "";
            offenders.push(`${el.tagName}.${cls} right=${Math.round(b.right)}`);
          }
        }
      }

      /* Anything whose text is being cut off by a fixed height. */
      const clippedText = [];
      for (const el of document.querySelectorAll("h1,h2,h3,p,a,span,li,dd,dt,button")) {
        if (!el.textContent?.trim()) continue;
        const s = getComputedStyle(el);
        if (s.display === "none" || s.visibility === "hidden") continue;
        if (s.overflow === "hidden" && el.scrollHeight > el.clientHeight + 3 && el.clientHeight > 0) {
          const cls = typeof el.className === "string" ? el.className.split(" ")[0] : "";
          clippedText.push(`${el.tagName}.${cls} "${el.textContent.trim().slice(0, 28)}"`);
        }
      }

      /* Tap-target floor for interactive things (24px is the WCAG 2.2 AA min). */
      const smallTargets = [];
      for (const el of document.querySelectorAll("a,button,[role=button],input,select")) {
        const s = getComputedStyle(el);
        if (s.display === "none" || s.visibility === "hidden" || s.opacity === "0") continue;
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;
        if (b.width < 24 || b.height < 24) {
          const cls = typeof el.className === "string" ? el.className.split(" ")[0] : "";
          smallTargets.push(
            `${el.tagName}.${cls} ${Math.round(b.width)}x${Math.round(b.height)} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 20)}"`
          );
        }
      }

      return {
        overflow,
        scrollWidth: de.scrollWidth,
        offenders: [...new Set(offenders)].slice(0, 6),
        clippedText: [...new Set(clippedText)].slice(0, 5),
        smallTargets: [...new Set(smallTargets)].slice(0, 5),
      };
    }, w);

    if (status !== 200) findings.push({ route: rname, w, kind: "HTTP", detail: String(status) });
    if (res.overflow > 1)
      findings.push({
        route: rname,
        w,
        kind: "H-OVERFLOW",
        detail: `+${res.overflow}px (scrollWidth ${res.scrollWidth}) ${res.offenders.join(" | ") || "no unclipped offender"}`,
      });
    if (res.clippedText.length)
      findings.push({ route: rname, w, kind: "CLIPPED", detail: res.clippedText.join(" | ") });
    if (res.smallTargets.length)
      findings.push({ route: rname, w, kind: "SMALL-TAP", detail: res.smallTargets.join(" | ") });
    for (const e of [...new Set(errs)])
      findings.push({ route: rname, w, kind: "JS", detail: e });

    await ctx.close();
  }
  console.log("done:", rname);
}

console.log("\n================ FINDINGS ================");
if (!findings.length) console.log("none — no overflow, clipping, small targets or JS errors");
else console.table(findings);

await browser.close();
