# The Glen Lounge — working notes

Client website. Next.js 15 App Router, React 19, TypeScript, GSAP + Lenis,
plain CSS with custom-property tokens (no Tailwind, no CSS-in-JS library).

## Ground rules

- `FACTS.md` is the content truth. Never write copy about the venue that isn't
  recorded there with a source — placeholder TODOs are correct, invented
  plausible detail is not.
- `CONTRACT.md` holds design decisions. Agree there, then implement.
- Every animation needs a `prefers-reduced-motion: reduce` fallback.
- **Two homes for strings, and the split matters:**
  - `lib/site.ts` — language-*independent* venue facts (phones, address, the
    weekly programme, socials). Traceable to `FACTS.md`.
  - `lib/i18n/{fr,en}.ts` — UI copy. `fr.ts` is the source shape; `en.ts` uses
    `satisfies Dict`, so a missing or misspelled English key fails `tsc`.
    Do **not** add `as const` to `fr.ts` — it would freeze every value to its
    literal type and then demand the English text be character-identical.
- Photography goes through `lib/photos.ts`, never a raw path. Each entry
  carries a `consent` field; render lists through `shippable()` so an
  unconsented image cannot reach a page by accident.
- The site is bilingual, French first. There is deliberately **no
  `app/layout.tsx`** — the root layout is `app/[lang]/layout.tsx` so
  `<html lang>` can vary per locale. That is also why
  `app/global-not-found.tsx` has to bring its own `<html>` and fonts.

## This machine

- `npm` is **not** on PATH. Use `& "C:\Program Files\nodejs\npm.cmd"` in
  PowerShell, or prepend `C:\Program Files\nodejs` to PATH for child processes.
- Port 3000 is permanently taken by a Docker/WSL relay (`wslrelay.exe`).
  `npm run dev` is pinned to **3100**.
- The repo sits in a **OneDrive-synced folder**, which corrupts the `.next` dev
  cache after incremental recompiles. Symptoms: 500s,
  `__webpack_modules__[moduleId] is not a function`, or the page rendering
  unstyled. Fix: kill *all* stale `node` processes (`Get-Process node` — killing
  the port listener alone leaves orphans), `Remove-Item -Recurse -Force .next`,
  restart, then poll until the page serves real content (a 200 is not proof —
  match on actual markup).
- Background dev servers do not survive between turns. Start fresh per
  audit cycle; for casual browsing, run `npm run dev` in your own terminal.
- **Never `next build` while a `next start` is still listening.** The new build
  replaces `.next` underneath the running process and it then serves a page
  with no CSS and 400s on its chunks — which looks exactly like the OneDrive
  cache corruption above, but isn't. Kill the listener first and confirm the
  port is free:
  ```powershell
  Get-NetTCPConnection -LocalPort 3100 -State Listen |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object { Stop-Process -Id $_ -Force }
  ```
  `next start` failing with `EADDRINUSE` is the tell that you are about to
  screenshot a stale server.
- Screenshot/measure scripts must live **inside the project directory** —
  running one from the scratchpad cannot resolve `playwright-core`. Write it to
  `./.shot.mjs`, run, delete. And write it with the Write tool, not a bash
  heredoc: heredocs eat the backslashes in the Chrome path.
- Screenshots: no Playwright browsers installed, but system Chrome is at
  `C:\Program Files\Google\Chrome\Application\chrome.exe`. Use `playwright-core`
  with `chromium.launch({ executablePath: CHROME })`, and scroll via
  `window.__lenis.scrollTo(y, { immediate: true })` (exposed by
  `components/SmoothScroll.tsx`).
