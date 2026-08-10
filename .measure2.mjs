import { chromium } from "playwright-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await chromium.launch({ executablePath: CHROME });

for (const width of [1280, 1100, 900, 800, 760]) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } });
  await page.goto("http://localhost:3200/fr", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);

  const probe = () =>
    page.evaluate(() => {
      const h2 = [...document.querySelectorAll("h2")].find((n) =>
        n.textContent.includes("Restaurant, lounge, appartements")
      );
      const grid = [...h2.closest("section").querySelectorAll("div")].find((d) =>
        /Trois_grid/.test(d.className.toString())
      );
      return [...grid.children].map((el) => {
        const r = el.getBoundingClientRect();
        const kids = [...el.children];
        const last = kids[kids.length - 1].getBoundingClientRect();
        const para = kids.find((k) => k.tagName === "P");
        return {
          title: el.querySelector("h3").textContent,
          boxH: +r.height.toFixed(1),
          paraLines: Math.round(
            para.getBoundingClientRect().height /
              parseFloat(getComputedStyle(para).lineHeight)
          ),
          slack: +(r.bottom - last.bottom).toFixed(1),
        };
      });
    });

  const withChips = await probe();

  // Simulate the pre-diff markup: no .more chip on any card.
  await page.evaluate(() => {
    document
      .querySelectorAll('[class*="Trois_more"]')
      .forEach((n) => n.remove());
  });
  await page.waitForTimeout(300);
  const withoutChips = await probe();

  console.log("\n============ viewport " + width + "px ============");
  console.log("            SHIPPED (with .more)      PRE-DIFF (chips removed)");
  for (let i = 0; i < withChips.length; i++) {
    const a = withChips[i];
    const b = withoutChips[i];
    console.log(
      `${a.title.padEnd(13)} slack=${String(a.slack).padStart(6)}px lines=${a.paraLines}` +
        `   |   slack=${String(b.slack).padStart(6)}px lines=${b.paraLines}` +
        `   -> added by diff: ${(a.slack - b.slack).toFixed(1)}px`
    );
  }
  await page.close();
}

await browser.close();
