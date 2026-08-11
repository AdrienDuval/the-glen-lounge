/* Verify the three fixes. Temporary. */
import { chromium } from "playwright-core";
import fs from "node:fs";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
fs.mkdirSync("./.shots", { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME });
const line = (s) => process.stdout.write(s + "\n");

async function open(w, h, path = "/fr", touch = false) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch,
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 140)));
  page.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 140)));
  await page.goto("http://localhost:3200" + path, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(() => document.documentElement.dataset.loaded === "1", { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(1500);
  return { ctx, page, errs };
}

/* ---- 1. pinned band fits the fold ---- */
line("\n===== 1. « Le lieu » pinned vs the fold =====");
for (const [w, h] of [[1024, 768], [1366, 768], [1280, 800], [1440, 900], [1440, 700], [1600, 900], [1920, 1080], [1280, 1024], [2560, 1440]]) {
  try {
    const { ctx, page, errs } = await open(w, h);
    await page.evaluate(() => {
      const y = document.getElementById("lieu").getBoundingClientRect().top + window.scrollY;
      if (window.__lenis) window.__lenis.scrollTo(y + 40, { immediate: true }); else window.scrollTo(0, y + 40);
    });
    await page.waitForTimeout(900);
    const m = await page.evaluate(() => {
      const s = document.getElementById("lieu");
      const foot = s.querySelector("[class*=Lieu_footer]").getBoundingClientRect();
      const media = s.querySelector("[class*=Lieu_media]").getBoundingClientRect();
      const head = s.querySelector("[class*=Lieu_head]").getBoundingClientRect();
      return {
        vh: window.innerHeight,
        footBottom: Math.round(foot.bottom),
        mediaH: Math.round(media.height), mediaW: Math.round(media.width),
        headTop: Math.round(head.top),
        pinned: !!document.querySelector(".pin-spacer"),
      };
    });
    const spare = m.vh - m.footBottom;
    line(`  ${String(w).padStart(4)}x${String(h).padEnd(5)} pinned=${m.pinned}  image ${m.mediaW}x${m.mediaH}  ` +
      `foot ends ${m.footBottom}/${m.vh} → ${spare >= 0 ? `FITS (${spare}px spare)` : `OVERFLOWS ${-spare}px`}` +
      `${m.headTop < 0 ? "  ← head above fold!" : ""}${errs.length ? " ERR:" + errs[0] : ""}`);
    if (w === 1440 && h === 900) await page.screenshot({ path: "./.shots/t-lieu-1440.png" });
    if (w === 1024) await page.screenshot({ path: "./.shots/t-lieu-1024.png" });
    await ctx.close();
  } catch (e) { line(`  ${w}x${h} FAILED ${String(e).slice(0, 100)}`); }
}

/* ---- 2. nav ---- */
line("\n===== 2. Nav bar =====");
for (const w of [900, 1024, 1199, 1200, 1280, 1439, 1440, 1600, 1920]) {
  try {
    const { ctx, page } = await open(w, 900);
    const m = await page.evaluate(() => {
      const nav = document.querySelector("header");
      const links = nav.querySelector("[class*=Nav_links]");
      const burger = nav.querySelector("[class*=Nav_burger]");
      const cta = nav.querySelector("[class*=Nav_cta]");
      const phone = nav.querySelector("[class*=Nav_phone]");
      const brand = nav.querySelector("[class*=Nav_brand]");
      const vw = document.documentElement.clientWidth;
      const gut = parseFloat(getComputedStyle(nav).paddingRight);
      const rc = cta.getBoundingClientRect();
      const rl = links.getBoundingClientRect();
      const rb = brand.getBoundingClientRect();
      const shown = getComputedStyle(links).display !== "none";
      return {
        vw, gut: Math.round(gut),
        linksShown: shown,
        burgerShown: getComputedStyle(burger).display !== "none",
        phoneShown: phone ? getComputedStyle(phone).display !== "none" : false,
        ctaRight: Math.round(rc.right),
        over: Math.round(rc.right - (vw - gut)),
        brandGap: shown ? Math.round(rl.left - rb.right) : null,
      };
    });
    line(`  ${String(w).padStart(4)}px  links=${m.linksShown ? "y" : "n"} burger=${m.burgerShown ? "y" : "n"} ` +
      `phone=${m.phoneShown ? "y" : "n"}  CTA→${m.ctaRight}/${m.vw}  ` +
      `${m.over > 0 ? `OVERFLOWS by ${m.over}px` : "fits"}` +
      `${m.brandGap !== null ? `  brand↔links gap ${m.brandGap}px${m.brandGap < 12 ? " ← tight" : ""}` : ""}`);
    if (w === 1200 || w === 1024) await page.screenshot({ path: `./.shots/t-nav-${w}.png`, clip: { x: 0, y: 0, width: w, height: 84 } });
    await ctx.close();
  } catch (e) { line(`  ${w} FAILED ${String(e).slice(0, 100)}`); }
}

/* ---- 3. events index poster ---- */
line("\n===== 3. Events index poster =====");
for (const [w, h] of [[390, 844], [720, 1024], [1440, 900]]) {
  try {
    const { ctx, page } = await open(w, h, "/fr/evenements", w < 1200);
    const m = await page.evaluate(() => {
      const cards = [...document.querySelectorAll("a[class*=EventsIndex_card]")];
      return cards.slice(0, 3).map((c) => {
        const media = c.querySelector("[class*=EventsIndex_media]");
        const img = c.querySelector("img");
        const r = media ? media.getBoundingClientRect() : { width: 0, height: 0 };
        return {
          title: (c.querySelector("[class*=cardTitle]")?.textContent || "?").slice(0, 18),
          fit: img ? getComputedStyle(img).objectFit : "?",
          box: `${Math.round(r.width)}x${Math.round(r.height)}`,
          natAR: img && img.naturalWidth ? (img.naturalWidth / img.naturalHeight).toFixed(2) : "?",
        };
      });
    });
    line(`  ${w}px`);
    m.forEach((c) => line(`     ${c.title.padEnd(20)} frame ${c.box.padEnd(10)} object-fit ${c.fit.padEnd(9)} photo AR ${c.natAR}`));
    if (w === 1440) await page.screenshot({ path: "./.shots/t-events-1440.png" });
    if (w === 390) await page.screenshot({ path: "./.shots/t-events-390.png" });
    await ctx.close();
  } catch (e) { line(`  ${w} FAILED ${String(e).slice(0, 140)}`); }
}

/* ---- 4. mobile regression ---- */
line("\n===== 4. mobile regression =====");
for (const [w, h] of [[390, 844], [430, 932], [768, 1024]]) {
  try {
    const { ctx, page, errs } = await open(w, h, "/fr", true);
    const m = await page.evaluate(() => {
      const r = (s) => document.querySelector(s).getBoundingClientRect();
      const media = r("[class*=Lieu_media]");
      const bar = r("[class*=Hero_bar]");
      return {
        lieuAR: (media.width / media.height).toFixed(2),
        barVisible: bar.bottom <= window.innerHeight,
        burger: getComputedStyle(document.querySelector("[class*=Nav_burger]")).display !== "none",
      };
    });
    line(`  ${w}px — Lieu ratio ${m.lieuAR} (want 1.33) · hero controls visible ${m.barVisible} · burger ${m.burger}` +
      `${errs.length ? " ERR:" + errs[0] : ""}`);
    await ctx.close();
  } catch (e) { line(`  ${w} FAILED ${String(e).slice(0, 100)}`); }
}

await browser.close();
