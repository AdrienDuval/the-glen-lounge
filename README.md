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
| `lib/site.ts` | Site-wide strings — name, contact, socials |
| `public/` | Images, logo, fonts |
| `FACTS.md` | Content truth. Nothing ships that isn't recorded here |
| `CONTRACT.md` | Design spec and open decisions |

## Status

Scaffold only. No brand, copy or photography yet — the home page is a
placeholder. Start by filling in `FACTS.md`.
