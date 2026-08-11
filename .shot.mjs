import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = process.env.SHOT_OUT;
const browser = await chromium.launch({ executablePath: CHROME });

async function open(w, h, path, touch = false) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    hasTouch: touch,
    isMobile: touch,
  });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 160)));
  page.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 160)));
  await page.goto("http://localhost:3201" + path, { waitUntil: "networkidle", timeout: 60000 });
  await page
    .waitForFunction(() => document.documentElement.dataset.loaded === "1", { timeout: 20000 })
    .catch(() => {});
  await page.waitForTimeout(1700);
  return { ctx, page, errs };
}

/* THE FIX UNDER TEST: does the desktop masthead sit on the frame, not the thumbs? */
for (const [name, w, h] of [
  ["fix-d", 1440, 950],
  ["fix-1280", 1280, 860],
  ["fix-900", 900, 800],
]) {
  const { ctx, page, errs } = await open(w, h, "/fr/appartements/a10-2-a");
  const m = await page.evaluate(() => {
    const hero = document.querySelector("[class*=StudioGallery_hero__]");
    const mast = document.querySelector("[class*=StudioGallery_mast__]");
    const thumbs = document.querySelector("[class*=StudioGallery_thumbsWrap__]");
    const code = document.querySelector("h1");
    const r = (e) => {
      const b = e.getBoundingClientRect();
      return { top: Math.round(b.top), bottom: Math.round(b.bottom) };
    };
    return {
      hero: r(hero),
      mast: r(mast),
      thumbs: r(thumbs),
      code: r(code),
      codeInsideFrame: r(code).bottom <= r(hero).bottom + 2,
      mastOverThumbs: r(mast).bottom > r(thumbs).top + 2,
    };
  });
  console.log(
    `${name}: hero ${m.hero.top}-${m.hero.bottom} · mast ${m.mast.top}-${m.mast.bottom} · ` +
      `thumbs from ${m.thumbs.top} · h1 ${m.code.top}-${m.code.bottom} · ` +
      `h1-in-frame=${m.codeInsideFrame} mast-over-thumbs=${m.mastOverThumbs}` +
      (errs.length ? `  ⚠ ${errs[0]}` : "")
  );
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await ctx.close();
}

/* Active thumbnail must not dim on hover. */
{
  const { ctx, page } = await open(1440, 950, "/fr/appartements/a10-2-a");
  const sel = "ul[class*=thumbs] > li:nth-child(1) button";
  const before = await page.evaluate((s) => getComputedStyle(document.querySelector(s)).opacity, sel);
  await page.hover(sel);
  await page.waitForTimeout(600);
  const after = await page.evaluate((s) => getComputedStyle(document.querySelector(s)).opacity, sel);
  console.log(`active thumb opacity: rest ${before} → hover ${after}`);
  await ctx.close();
}

/* Dot row must not wrap at 360px now there is one more slide. */
{
  const { ctx, page } = await open(360, 780, "/fr", true);
  const dots = await page.evaluate(() => {
    const row = document.querySelector("[class*=Hero_dots__]");
    if (!row) return null;
    const kids = [...row.children].map((c) => Math.round(c.getBoundingClientRect().top));
    return { count: kids.length, rows: new Set(kids).size, scroll: row.scrollWidth, client: row.clientWidth };
  });
  console.log(`360px dots: ${JSON.stringify(dots)}`);
  await ctx.close();
}

/* Copy check: no location claim anywhere user-visible. */
{
  const { ctx, page } = await open(1440, 950, "/fr");
  const hits = await page.evaluate(() =>
    document.body.innerText.match(/au-dessus|à l.étage|upstairs/gi) ?? []
  );
  console.log(`/fr location claims: ${JSON.stringify(hits)}`);
  await ctx.close();
}
{
  const { ctx, page } = await open(1440, 950, "/fr/appartements");
  const hits = await page.evaluate(() =>
    document.body.innerText.match(/au-dessus|à l.étage|upstairs/gi) ?? []
  );
  const h1 = await page.evaluate(() => document.querySelector("h1")?.textContent?.trim());
  console.log(`/fr/appartements h1 "${h1}" · claims ${JSON.stringify(hits)}`);
  await ctx.close();
}

await browser.close();
