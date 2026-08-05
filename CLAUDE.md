# The Glen Lounge — working notes

Client website. Next.js 15 App Router, React 19, TypeScript, GSAP + Lenis,
plain CSS with custom-property tokens (no Tailwind, no CSS-in-JS library).

## Ground rules

- `FACTS.md` is the content truth. Never write copy about the venue that isn't
  recorded there with a source — placeholder TODOs are correct, invented
  plausible detail is not.
- `CONTRACT.md` holds design decisions. Agree there, then implement.
- Every animation needs a `prefers-reduced-motion: reduce` fallback.
- Site-wide strings go in `lib/site.ts`, not inline in components.

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
- Screenshots: no Playwright browsers installed, but system Chrome is at
  `C:\Program Files\Google\Chrome\Application\chrome.exe`. Use `playwright-core`
  with `chromium.launch({ executablePath: CHROME })`, and scroll via
  `window.__lenis.scrollTo(y, { immediate: true })` (exposed by
  `components/SmoothScroll.tsx`).
