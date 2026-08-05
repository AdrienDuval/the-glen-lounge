# The Glen Lounge

Website for The Glen Lounge. Next.js 15 (App Router) · React 19 · TypeScript ·
GSAP + Lenis · plain CSS with custom-property tokens.

## Running it

`npm` is not on PATH on this machine — use the full path:

```powershell
& "C:\Program Files\nodejs\npm.cmd" install
& "C:\Program Files\nodejs\npm.cmd" run dev
```

Dev server runs on **port 3100** (3000 is held by a Docker/WSL relay).

## Layout

| Path | What lives there |
| --- | --- |
| `app/` | Routes, layout, global tokens (`globals.css`) |
| `components/` | Reusable UI; `SmoothScroll.tsx` mounts Lenis |
| `lib/site.ts` | Site-wide strings and the weekly programme |
| `public/` | Curated imagery and brand assets |
| `content/` | Harvested source material — caption digest, media manifest |
| `assets-raw/` | Full 214 MB social harvest. **Git-ignored** |
| `FACTS.md` | Content truth. Nothing ships that isn't recorded here |
| `CONTRACT.md` | Design spec and open decisions |
| `ASSETS.md` | Where the assets came from and how to get more |

## Status

Scaffold plus a researched content base. The home page is still a placeholder —
no real page has been designed yet.

What exists: verified facts about the venue in `FACTS.md` (weekly programme,
hours, services, brand), 17 web-grade photographs in `public/photos/`, and 96
harvested TikTok captions in `content/`.

What blocks the build: the apartment details, a vector logo, and the menu
document. See the open-questions list at the foot of `FACTS.md`.
