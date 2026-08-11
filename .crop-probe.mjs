import sharp from "sharp";

const SRC = "./public/photos/exterior-day.jpg";
const meta = await sharp(SRC).metadata();
console.log("intrinsic:", meta.width, "x", meta.height, "aspect", (meta.width / meta.height).toFixed(4));

// Mobile stage: viewport 390x844, .stage { height: 56svh; min-height: 21rem }
const VW = 390;
const boxW = 390;
const boxH = Math.max(0.56 * 844, 21 * 16); // svh vs min-height
console.log("mobile stage box:", boxW, "x", boxH.toFixed(1));

// object-fit: cover, object-position: 50% 50%
const scale = Math.max(boxW / meta.width, boxH / meta.height);
const drawW = meta.width * scale;
const drawH = meta.height * scale;
console.log("scale", scale.toFixed(4), "drawn", drawW.toFixed(1), "x", drawH.toFixed(1));

const overflowX = drawW - boxW;
const overflowY = drawH - boxH;
console.log("overflow x", overflowX.toFixed(1), "y", overflowY.toFixed(1));

const srcX0 = (overflowX / 2) / scale;
const srcX1 = (drawW - overflowX / 2) / scale;
const srcY0 = (overflowY / 2) / scale;
const srcY1 = (drawH - overflowY / 2) / scale;
console.log(`VISIBLE source x: [${srcX0.toFixed(1)}, ${srcX1.toFixed(1)}] of ${meta.width}`);
console.log(`VISIBLE source y: [${srcY0.toFixed(1)}, ${srcY1.toFixed(1)}] of ${meta.height}`);
console.log(`cropped each side: ${(srcX0 / meta.width * 100).toFixed(1)}%`);

// Render exactly what the phone shows.
await sharp(SRC)
  .extract({
    left: Math.round(srcX0),
    top: Math.round(srcY0),
    width: Math.round(srcX1 - srcX0),
    height: Math.round(srcY1 - srcY0),
  })
  .resize(Math.round(boxW * 2), Math.round(boxH * 2))
  .toFile("./.probe-mobile-visible.png");

// And the full frame at same scale for comparison.
await sharp(SRC).resize(1100, 825).toFile("./.probe-full.png");

// Zoom hard on the signage band to read the letters in the cropped view.
await sharp("./.probe-mobile-visible.png")
  .extract({ left: 0, top: Math.round(boxH * 2 * 0.78), width: Math.round(boxW * 2 * 0.62), height: Math.round(boxH * 2 * 0.20) })
  .resize({ width: 1400 })
  .toFile("./.probe-sign-cropped.png");

// Same band from the uncropped original, for the before/after.
await sharp(SRC)
  .extract({ left: 120, top: Math.round(825 * 0.79), width: 460, height: Math.round(825 * 0.16) })
  .resize({ width: 1400 })
  .toFile("./.probe-sign-original.png");

console.log("done");
