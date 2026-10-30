/**
 * serveur-scrape.mjs — pull product photos from the live `serveur` app.
 *
 * WHY THIS IS A SCRIPT YOU RUN (not something the assistant ran for you):
 * reusing your logged-in session means touching your Chrome profile, which the
 * assistant's safety layer blocks as credential access — correctly, since it
 * cannot tell your own site from someone else's. Running it yourself, on your
 * own machine, against your own app, is the clean path.
 *
 * ── BEFORE YOU RUN ───────────────────────────────────────────────────────────
 *   1. CLOSE Google Chrome completely (Task Manager → end all chrome.exe).
 *      Chrome locks its profile; Playwright cannot open it while it runs.
 *   2. Make sure you are logged into https://theglen.app/serveur in that Chrome
 *      profile (the token lives in the profile).
 *
 * ── RUN ──────────────────────────────────────────────────────────────────────
 *   set PATH=C:\Program Files\nodejs;%PATH%      (cmd)   — or use full node path
 *   node serveur-scrape.mjs
 *
 * Optional env:
 *   SERVEUR_URL        default https://theglen.app/serveur
 *   CHROME_PROFILE     default %LOCALAPPDATA%\Google\Chrome\User Data
 *   CHROME_PROFILE_DIR default "Default" — set to "Profile 1", "Profile 2"…
 *                      if you're logged in under a different Chrome profile.
 *                      (Chrome menu → your avatar shows which; the folder name
 *                      is under the User Data dir.)
 *   HEADFUL=1          watch it work (recommended the first time)
 *
 * ── WHAT IT DOES ─────────────────────────────────────────────────────────────
 *   • Opens your profile (already authenticated), loads the serveur app.
 *   • Auto-scrolls to lazy-load every product.
 *   • Collects each product image + its nearest name/price text.
 *   • Downloads images to public/photos/menu/.
 *   • Writes serveur-products.json (the raw catalogue) and
 *     menuPhotos.suggested.ts (paste-ready entries for lib/menuPhotos.ts).
 *
 * It writes NOTHING to the live app — read-only.
 */

import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = process.env.SERVEUR_URL || "https://theglen.app/serveur";
const PROFILE =
  process.env.CHROME_PROFILE ||
  path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "User Data");
const PROFILE_DIR = process.env.CHROME_PROFILE_DIR || "Default";
const OUT_IMG = path.join(__dirname, "public", "photos", "menu");
const HEADFUL = process.env.HEADFUL === "1";

fs.mkdirSync(OUT_IMG, { recursive: true });

function slugify(s) {
  return (s || "item")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

console.log("Profile :", PROFILE);
console.log("Target  :", URL);
console.log("Opening Chrome (close all Chrome windows first if this hangs)…\n");

const ctx = await chromium.launchPersistentContext(PROFILE, {
  executablePath: CHROME,
  headless: !HEADFUL,
  viewport: { width: 1440, height: 900 },
  // Select which profile inside the User Data dir holds your logged-in session.
  args: [`--profile-directory=${PROFILE_DIR}`],
});

const page = ctx.pages()[0] || (await ctx.newPage());
await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });

if (/\/login/i.test(page.url())) {
  console.error(
    "\n✗ Redirected to /login — the profile is not authenticated.\n" +
      "  Open Chrome, log into the serveur app, close Chrome, and re-run.\n"
  );
  await ctx.close();
  process.exit(1);
}

// Lazy-load everything.
await page.evaluate(async () => {
  await new Promise((res) => {
    let y = 0;
    const t = setInterval(() => {
      window.scrollTo(0, y);
      y += 500;
      if (y > document.body.scrollHeight + 1500) {
        clearInterval(t);
        res();
      }
    }, 120);
  });
});
await page.waitForTimeout(1500);

// Collect product image URLs + nearest text. Heuristic: content images that
// aren't tiny icons/logos, with the closest heading/paragraph and any
// price-looking token in the same card.
const products = await page.evaluate(() => {
  const out = [];
  const seen = new Set();
  const imgs = Array.from(document.querySelectorAll("img"));
  for (const img of imgs) {
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    const src = img.currentSrc || img.src;
    if (!src || src.startsWith("data:")) continue;
    if (w < 90 || h < 90) continue; // skip icons/logos/avatars
    if (/logo|icon|avatar|sprite/i.test(src)) continue;
    if (seen.has(src)) continue;
    seen.add(src);

    // Walk up to a plausible card container and read its text.
    let card = img;
    for (let i = 0; i < 5 && card.parentElement; i++) card = card.parentElement;
    const text = (card.innerText || "").replace(/\s+/g, " ").trim();
    const priceMatch = text.match(/(\d[\d .\u00a0]{2,})\s*(FCFA|CFA|F)\b/i);
    out.push({
      src,
      alt: img.alt || "",
      w,
      h,
      cardText: text.slice(0, 200),
      price: priceMatch ? priceMatch[1].replace(/[ \u00a0]/g, "") : null,
    });
  }
  return out;
});

console.log(`Found ${products.length} candidate product images.\n`);

// Download each image.
const catalogue = [];
for (const p of products) {
  try {
    const resp = await page.request.get(p.src);
    if (!resp.ok()) {
      console.warn("  skip (http", resp.status() + ")", p.src);
      continue;
    }
    const buf = await resp.body();
    const ext = (p.src.split("?")[0].match(/\.(jpe?g|png|webp|avif)$/i) || [
      "",
      "jpg",
    ])[1].toLowerCase();
    const base =
      slugify(p.alt || p.cardText.split(/[·|–—-]/)[0] || "produit") ||
      "produit";
    let file = `${base}.${ext}`;
    let n = 1;
    while (fs.existsSync(path.join(OUT_IMG, file))) file = `${base}-${n++}.${ext}`;
    fs.writeFileSync(path.join(OUT_IMG, file), buf);
    catalogue.push({ ...p, file: `public/photos/menu/${file}`, publicSrc: `/photos/menu/${file}` });
    console.log("  saved", file, `(${p.w}×${p.h})`, p.price ? p.price + " FCFA" : "");
  } catch (e) {
    console.warn("  error", p.src, String(e).slice(0, 80));
  }
}

// Raw catalogue for mapping.
fs.writeFileSync(
  path.join(__dirname, "serveur-products.json"),
  JSON.stringify(catalogue, null, 2)
);

// Paste-ready DISH_PHOTO suggestions (keyed by the app's product name — you
// then align each key to the EXACT dish name in lib/menu.ts).
const entries = catalogue
  .map((c) => {
    const name = (c.alt || c.cardText.split(/[·|–—-]/)[0] || "").trim();
    return `  ${JSON.stringify(name || c.file)}: { src: ${JSON.stringify(
      c.publicSrc
    )}, w: ${c.w}, h: ${c.h}, alt: { fr: ${JSON.stringify(
      name
    )}, en: ${JSON.stringify(name)} } },`;
  })
  .join("\n");
fs.writeFileSync(
  path.join(__dirname, "menuPhotos.suggested.ts"),
  `// Suggested DISH_PHOTO entries — align each key to the exact dish name in\n` +
    `// lib/menu.ts, fill honest bilingual alt text, then move into lib/menuPhotos.ts.\n` +
    `export const SUGGESTED = {\n${entries}\n};\n`
);

console.log(
  `\n✓ Done. ${catalogue.length} images in public/photos/menu/.\n` +
    `  → serveur-products.json  (raw catalogue)\n` +
    `  → menuPhotos.suggested.ts (paste-ready entries)\n`
);
await ctx.close();
