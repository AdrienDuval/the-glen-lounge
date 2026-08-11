# The Glen Lounge

Website for The Glen Lounge. Next.js 15 (App Router) · React 19 · TypeScript ·
GSAP + Lenis · plain CSS with custom-property tokens.

## Running it

`npm` is not on PATH on this machine — use the full path:

```powershell
& "C:\Program Files\nodejs\npm.cmd" install
& "C:\Program Files\nodejs\npm.cmd" run dev
```

Dev server runs on **port 3200** (3000 is held by a Docker/WSL relay).

## Layout

The site is bilingual, French first: `/` redirects to `/fr`, English lives at
`/en`. The root layout is `app/[lang]/layout.tsx` — there is no `app/layout.tsx`.

| Path | What lives there |
| --- | --- |
| `app/[lang]/` | Routes and the root layout (owns `<html lang>`) |
| `app/globals.css` | Design tokens and primitives |
| `components/` | UI; `SmoothScroll.tsx` mounts Lenis on the GSAP ticker |
| `lib/site.ts` | Language-independent venue facts and the weekly programme |
| `lib/i18n/` | UI copy — `fr.ts` is the source shape, `en.ts` is type-checked against it |
| `lib/photos.ts` | Photo manifest, with the per-image consent gate |
| `lib/routes.ts` | Route table; drives the language switcher |
| `public/` | Curated imagery and brand assets |
| `content/` | Harvested source material — caption digest, media manifest |
| `assets-raw/` | Full 214 MB social harvest. **Git-ignored** |
| `FACTS.md` | Content truth. Nothing ships that isn't recorded here |
| `CONTRACT.md` | Design spec, decisions taken, decisions outstanding |
| `ASSETS.md` | Where the assets came from and how to get more |

## Status — Phase 1 complete (2026-08-07)

The home page is built: eight sections, bilingual, from the hero banner through
to the booking section. Phase 0's foundations sit underneath it — bilingual
routing with hreflang, design tokens sampled from the venue's own assets, the
preloader and its `glen:loaded` signal contract, the Lenis/GSAP scroll bridge,
both 404s, the AVIF pipeline and ESLint.

**The hero is the banner.** Slide 0 is the brand; the rest are nights, events
and dated promotions from `lib/banner.ts`. Slides take an image or a video and
carry an optional date window, so a promotion expires by itself rather than
sitting there stale. Add one by copying the worked example at the foot of that
file.

`tsc`, `eslint` and `next build` are all clean. Measured page weight: **181 KB
at 390 px**, 457 KB at 1440 px — and flat as banner slides are added, since
panels mount only as they are approached.

**Phase 2** turns the banner into something the client edits themselves
(git-based CMS). **Phase 3** is discovery — `LocalBusiness` + recurring `Event`
structured data, sitemap, robots, Google Business Profile. **Phase 4** is the
apartments page. See `CONTRACT.md`.

### What blocks launch (not the build)

1. **The phone number.** Six variants are published; `652 81 45 49` vs `46 49`
   differ by one digit. The whole site converts to a phone call.
2. **Photo consent** for the images marked `guests` in `lib/photos.ts` —
   including the only exterior shot we hold.
3. **Vector logo** — `components/Monogram.tsx` is a stand-in until it arrives.
4. **A real closing time** — "jusqu'à tard" cannot go into structured data.
5. **The domain** — blocks `metadataBase`, canonical URLs, sitemap and OG.

See the open-questions list at the foot of `FACTS.md`.
