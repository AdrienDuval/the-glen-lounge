/* Probe the two new B35 clips: duration, display dimensions, orientation, and a
   contact sheet. Serves over HTTP because Chromium taints a file:// canvas. */
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import sharp from "sharp";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const DIR = "public/photos/studios/b35";
const OUT = process.argv[2];
const N = Number(process.argv[3] ?? 12);

fs.mkdirSync(OUT, { recursive: true });
const clips = fs.readdirSync(DIR).filter((f) => /\.mp4$/i.test(f)).sort();

const server = http.createServer((req, res) => {
  const name = decodeURIComponent(req.url.slice(1));
  if (!name) {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end("<!doctype html><title>b35</title><body>");
  }
  const p = path.join(DIR, name);
  if (!fs.existsSync(p)) return res.writeHead(404).end();
  const stat = fs.statSync(p);
  const range = req.headers.range;
  if (range) {
    const [s, e] = range.replace("bytes=", "").split("-");
    const start = Number(s);
    const end = e ? Number(e) : stat.size - 1;
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "video/mp4",
    });
    return fs.createReadStream(p, { start, end }).pipe(res);
  }
  res.writeHead(200, { "Content-Length": stat.size, "Content-Type": "video/mp4", "Accept-Ranges": "bytes" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(4602, r));

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage();
await page.goto("http://localhost:4602/", { waitUntil: "domcontentloaded" });

for (let ci = 0; ci < clips.length; ci++) {
  const f = clips[ci];
  const info = await page.evaluate(async (src) => {
    document.querySelectorAll("video").forEach((x) => x.remove());
    const v = document.createElement("video");
    v.src = src;
    v.muted = true;
    document.body.appendChild(v);
    await new Promise((res, rej) => {
      v.onloadedmetadata = res;
      v.onerror = () => rej(new Error("load fail"));
    });
    window.__v = v;
    return { duration: v.duration, w: v.videoWidth, h: v.videoHeight };
  }, "http://localhost:4602/" + encodeURIComponent(f));

  console.log(`c${ci + 1}  ${f}\n     display ${info.w}x${info.h}  ${info.duration.toFixed(1)}s`);

  const tiles = [];
  for (let i = 0; i < N; i++) {
    const t = (info.duration * (i + 0.5)) / N;
    const dataUrl = await page.evaluate(async (t) => {
      const v = window.__v;
      await new Promise((res) => {
        v.onseeked = res;
        v.currentTime = t;
      });
      const c = document.createElement("canvas");
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      c.getContext("2d").drawImage(v, 0, 0);
      return c.toDataURL("image/jpeg", 0.85);
    }, t);
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");
    fs.writeFileSync(path.join(OUT, `c${ci + 1}_${t.toFixed(1)}s.jpg`), buf);
    tiles.push({ buf, t });
  }

  /* Contact sheet, unrotated — so the orientation is visible as shipped. */
  const W = 320, H = 180, COLS = 4;
  const comp = [];
  for (let i = 0; i < tiles.length; i++) {
    comp.push({
      input: await sharp(tiles[i].buf).resize(W, H, { fit: "fill" }).toBuffer(),
      left: (i % COLS) * W,
      top: Math.floor(i / COLS) * H,
    });
  }
  await sharp({
    create: { width: W * COLS, height: H * Math.ceil(tiles.length / COLS), channels: 3, background: "#111" },
  })
    .composite(comp)
    .jpeg({ quality: 80 })
    .toFile(path.join(OUT, `sheet-c${ci + 1}.jpg`));
  console.log(`     times ${tiles.map((x) => x.t.toFixed(1)).join(" ")}`);
}

await browser.close();
server.close();
