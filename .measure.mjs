import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = process.env.SHOT_OUT ?? ".";
const PORT = process.env.PORT ?? "3200";
const URL = `http://localhost:${PORT}/fr/appartements/ss140-a`;

const browser = await chromium.launch({ executablePath: CHROME });

/* Mean relative luminance of a 5x3 grid over a PNG buffer, plus the same grid
   over the RAW source image scaled into the same box. The ratio is how much
   light the overlay + filter actually removes, per region. */
async function grid(page, pngB64, w, h) {
  return page.evaluate(
    async ({ b64, w, h }) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const g = c.getContext("2d");
      g.drawImage(img, 0, 0, w, h);
      const cells = [];
      for (let ry = 0; ry < 3; ry++) {
        const row = [];
        for (let cx = 0; cx < 5; cx++) {
          const x = Math.floor((cx * w) / 5);
          const y = Math.floor((ry * h) / 3);
          const bw = Math.floor(w / 5);
          const bh = Math.floor(h / 3);
          const d = g.getImageData(x, y, bw, bh).data;
          let sum = 0;
          for (let i = 0; i < d.length; i += 4) {
            sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
          }
          row.push(Math.round(sum / (d.length / 4)));
        }
        cells.push(row);
      }
      return cells;
    },
    { b64: pngB64, w, h }
  );
}

/**
 * Ask the server for every image width this viewport will use, and throw the
 * result away. Next optimises images on demand, so the FIRST request for a
 * given width pays for an encode — which looks exactly like a lazy-loading bug
 * when you are timing arrivals. This separates the two.
 */
async function warmOptimiser(w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(async () => {
    const srcs = [...document.querySelectorAll("[class*=StudioGallery_slide__] img")].map(
      (im) => im.currentSrc || im.src
    );
    await Promise.all(
      srcs.map((s) => fetch(s, { cache: "reload" }).catch(() => {}))
    );
  });
  await ctx.close();
}

async function run(label, w, h) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 200)));
  page.on("requestfailed", (r) => errs.push(`FAILED ${r.url().slice(-60)}`));
  const bad = [];
  page.on("response", (r) => {
    if (r.status() >= 400 && /image|\.webp|\.avif|_next\/image/.test(r.url() + r.headers()["content-type"]))
      bad.push(`${r.status()} ${r.url().slice(-70)}`);
  });

  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2200);

  /* --- 1. Did every frame actually decode? --- */
  const imgs = await page.evaluate(() => {
    const slides = [...document.querySelectorAll("[class*=StudioGallery_slide__] img")];
    return slides.map((im, i) => ({
      i,
      nat: `${im.naturalWidth}x${im.naturalHeight}`,
      complete: im.complete && im.naturalWidth > 0,
      src: (im.currentSrc || im.src).slice(-58),
      box: (() => {
        const b = im.getBoundingClientRect();
        return `${Math.round(b.width)}x${Math.round(b.height)}`;
      })(),
    }));
  });

  /* --- 2. How much of each source survives object-fit: cover? --- */
  const crop = await page.evaluate(() => {
    const im = document.querySelector("[class*=StudioGallery_slide__] img");
    const b = im.getBoundingClientRect();
    const srcAR = im.naturalWidth / im.naturalHeight;
    const boxAR = b.width / b.height;
    const kept =
      boxAR > srcAR
        ? { axis: "height", frac: srcAR / boxAR } // wider box: top+bottom cut
        : { axis: "width", frac: boxAR / srcAR };
    return {
      srcAR: +srcAR.toFixed(3),
      boxAR: +boxAR.toFixed(3),
      axis: kept.axis,
      keptPct: Math.round(kept.frac * 100),
      frameH: Math.round(b.height),
    };
  });

  /* --- 3. Luminance grid of the hero as rendered --- */
  const heroBox = await page.evaluate(() => {
    const b = document.querySelector("[class*=StudioGallery_hero__]").getBoundingClientRect();
    return { x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height) };
  });
  const shotB64 = (await page.screenshot({ clip: heroBox })).toString("base64");
  const rendered = await grid(page, shotB64, heroBox.width, heroBox.height);

  /* --- 4. Same grid over the bare source, for the reference --- */
  const bareB64 = await page.evaluate(async ({ w, h }) => {
    const im = document.querySelector("[class*=StudioGallery_slide__] img");
    const src = im.currentSrc || im.src;
    const raw = new Image();
    raw.src = src;
    await raw.decode();
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d");
    /* replicate object-fit: cover */
    const sAR = raw.naturalWidth / raw.naturalHeight;
    const dAR = w / h;
    let sw = raw.naturalWidth, sh = raw.naturalHeight, sx = 0, sy = 0;
    if (dAR > sAR) { sh = raw.naturalWidth / dAR; sy = (raw.naturalHeight - sh) / 2; }
    else { sw = raw.naturalHeight * dAR; sx = (raw.naturalWidth - sw) / 2; }
    g.drawImage(raw, sx, sy, sw, sh, 0, 0, w, h);
    return c.toDataURL("image/png").split(",")[1];
  }, { w: heroBox.width, h: heroBox.height });
  const bare = await grid(page, bareB64, heroBox.width, heroBox.height);

  /* --- 5. Is the masthead type legible where it lands? --- */
  const mast = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const cs = getComputedStyle(h1);
    const b = h1.getBoundingClientRect();
    return {
      opacity: cs.opacity,
      color: cs.color,
      rect: `${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.width)}x${Math.round(b.height)}`,
    };
  });

  /* The thumb strip is how a visitor sees what the band had to crop, so it is
     the constraint on making the band taller. It has to clear the fold. */
  const fold = await page.evaluate((vh) => {
    const s = document.querySelector("[class*=StudioGallery_thumbsWrap__]").getBoundingClientRect();
    return { top: Math.round(s.top), bottom: Math.round(s.bottom), clears: s.bottom <= vh };
  }, h);

  console.log(`\n===== ${label}  ${w}x${h} =====`);
  console.log(`hero box: ${heroBox.width}x${heroBox.height} at y=${heroBox.y}`);
  console.log(
    `thumb strip: ${fold.top}-${fold.bottom} of ${h} → ${fold.clears ? "clears the fold" : "BELOW THE FOLD"}`
  );
  console.log(`crop: source ${crop.srcAR}:1 into frame ${crop.boxAR}:1 → ${crop.keptPct}% of source ${crop.axis} kept`);
  console.log(`h1: opacity ${mast.opacity} color ${mast.color} at ${mast.rect}`);
  for (const im of imgs) console.log(`  slide ${im.i}: ${im.complete ? "ok" : "NOT LOADED"} nat ${im.nat} box ${im.box} ${im.src}`);
  if (bad.length) console.log(`  image responses >=400: ${bad.join(", ")}`);
  if (errs.length) console.log(`  errors: ${errs.slice(0, 4).join(" | ")}`);

  console.log(`  luminance (0-255), rendered vs bare, 5 cols x 3 rows:`);
  for (let r = 0; r < 3; r++) {
    const line = rendered[r]
      .map((v, c) => {
        const b = bare[r][c] || 1;
        return `${String(v).padStart(3)}/${String(b).padStart(3)} (${String(Math.round((v / b) * 100)).padStart(3)}%)`;
      })
      .join("  ");
    console.log(`    row${r}: ${line}`);
  }

  /* --- 6. Contrast of the white masthead against the pixels actually behind it.
         Screenshot the h1's band with the masthead hidden, take the BRIGHTEST
         patch in it (worst case for white type), and compute the WCAG ratio. --- */
  const h1Box = await page.evaluate(() => {
    const b = document.querySelector("h1").getBoundingClientRect();
    return { x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height) };
  });
  await page.evaluate(() => {
    document.querySelector("[class*=StudioGallery_mast__]").style.visibility = "hidden";
  });
  const behindB64 = (await page.screenshot({ clip: h1Box })).toString("base64");
  await page.evaluate(() => {
    document.querySelector("[class*=StudioGallery_mast__]").style.visibility = "";
  });
  const contrast = await page.evaluate(
    async ({ b64, w, h }) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const g = c.getContext("2d");
      g.drawImage(img, 0, 0, w, h);
      const d = g.getImageData(0, 0, w, h).data;
      const lin = (v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      /* Worst case: brightest 2% of pixels, so a bright window in frame counts. */
      const lums = [];
      for (let i = 0; i < d.length; i += 4) {
        lums.push(0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]));
      }
      lums.sort((a, b) => b - a);
      const worst = lums[Math.floor(lums.length * 0.02)];
      const mean = lums.reduce((a, b) => a + b, 0) / lums.length;
      return {
        worstRatio: +(1.05 / (worst + 0.05)).toFixed(2),
        meanRatio: +(1.05 / (mean + 0.05)).toFixed(2),
      };
    },
    { b64: behindB64, w: h1Box.width, h: h1Box.height }
  );
  console.log(
    `  h1 (white) vs what is behind it: ${contrast.worstRatio}:1 worst case, ` +
      `${contrast.meanRatio}:1 mean  ${contrast.worstRatio >= 4.5 ? "PASS" : "FAIL (needs 4.5)"}`
  );

  /* --- 7. Click through every frame: does each one arrive already decoded?
         A blank is then re-polled for up to 4s, because there are two very
         different reasons a frame can be black on arrival and they need telling
         apart: the warming logic failed to mark it (it would stay blank until
         the observer fired), or the image optimiser is encoding this width for
         the first time (it arrives late once, then never again). The warm-up
         below removes the second cause, so anything still blank is the first. --- */
  if (w >= 900) {
    const next = "[class*=StudioGallery_navBtn__] >> nth=1";
    const late = [];
    const blanks = [];
    for (let k = 1; k < 7; k++) {
      await page.click(next);
      await page.waitForTimeout(280); /* shorter than the snap, on purpose */
      const decoded = (k) =>
        page.evaluate((k) => {
          const im = [...document.querySelectorAll("[class*=StudioGallery_slide__] img")][k];
          return im.complete && im.naturalWidth > 0;
        }, k);
      if (await decoded(k)) continue;
      /* Blank on arrival — how much longer does it actually need? */
      let waited = 280;
      let ok = false;
      while (waited < 4280 && !ok) {
        await page.waitForTimeout(200);
        waited += 200;
        ok = await decoded(k);
      }
      if (ok) late.push(`${k}@${waited}ms`);
      else blanks.push(k);
    }
    console.log(
      `  click-through: ` +
        (blanks.length ? `NEVER decoded: ${blanks.join(",")}  ` : "") +
        (late.length ? `late: ${late.join(" ")}` : blanks.length ? "" : "all 7 decoded before arrival")
    );
  }

  await page.screenshot({ path: `${OUT}/${label}.png` });
  await ctx.close();
}

const VIEWPORTS = [
  ["studio-1365x640", 1365, 640],
  ["studio-1440x900", 1440, 900],
  ["studio-1280x800", 1280, 800],
  ["studio-1920x1080", 1920, 1080],
  /* Worst case for a scrim measured in rem: the shortest frame that still takes
     the desktop overlay composition. */
  ["studio-960x600", 960, 600],
  ["studio-390x844", 390, 844],
  ["studio-360x780", 360, 780],
];

for (const [label, w, h] of VIEWPORTS) {
  await warmOptimiser(w, h);
  await run(label, w, h);
}

await browser.close();
