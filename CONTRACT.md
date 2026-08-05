# CONTRACT — The Glen Lounge

**Design spec.** Decisions land here before they land in code; if the code and
this file disagree, this file is the bug report.

## Decided

| Decision | Date | Why |
| --- | --- | --- |
| **Stack**: Next.js 15 App Router, React 19, TypeScript, GSAP + `@gsap/react`, Lenis, plain CSS custom-property tokens. No Tailwind. | 2026-08-05 | Client asked for the same technologies, design sophistication and animation as `shandup-luan`. Matching it exactly means the dev workflow, screenshot tooling and motion vocabulary all carry over. |
| **Dark-first design** | 2026-08-05 | Same reason, and it matches the venue: glossy black marble, low light, neon signage. A light theme would fight the room. |
| **French** as the site language | 2026-08-05 | Every published word from the venue is French. ⚠️ Still open whether we add EN. |
| **Marketing/landing site**, not a booking engine | 2026-08-05 | Client's brief: expose services and events, grow SEO. Reservations go to phone/WhatsApp until they say otherwise. |

## Direction — drawn from the venue itself

The photography in `public/photos/` is the moodboard; the site should echo the
actual room rather than impose a look on it. Observed:

- **Glossy dark marble** floors and cladding, white coffered ceilings with
  marble inlay.
- **Black + white + gold** — gold stanchions and black rope, brass fittings,
  a backlit « G » monogram behind the bar.
- **Maximalist glam, not minimalism** — zebra print, Versace cushions,
  marble-top tables. The restraint should come from *our* layout and typography,
  letting the room supply the opulence.
- **Neon-white signage on black** — a strong, reusable motif for headings or
  section markers.

Working palette hypothesis (⚠️ not yet agreed): near-black ground, warm gold
accent from the logo, white for type, with photography carrying the colour.
The placeholder tokens in `app/globals.css` are a neutral stand-in only.

## To decide

### Brand
- [ ] Vector logo — blocked on the client (best copy is 439×439)
- [ ] Final palette, incl. exact gold
- [ ] Display and body typefaces, and their licences
- [ ] How to treat the logo on dark — it is already dark-ground, so it may drop
      in cleanly, unlike the Stand'Up mark

### Structure
- [ ] Page list. Working assumption, demand-led from what performs on TikTok:
      home · la carte / restaurant · **les soirées** (weekly programme) ·
      **appartements** · **événements & privatisation** · contact
- [ ] Home section order
- [ ] Navigation pattern
- [ ] Menu presentation — inline, PDF, or its own page (blocked on the document)
- [ ] Reservation CTA — phone, WhatsApp, or a form

### Motion
- [ ] Intro / preloader — yes or no
- [ ] Scroll choreography (Lenis is wired; GSAP installed, unused so far)
- [ ] How video is used — 75 harvested clips exist, but they are vertical 9:16
      social cuts. Decide whether they earn a place or whether we wait for
      proper footage.
- [ ] Reduced-motion fallback for every effect

### SEO — a first-class requirement on this project
- [ ] `LocalBusiness` + `Hotel` (or `Restaurant`) structured data
- [ ] Per-night event pages or a single programme page? Recurring events can
      carry `Event` schema either way
- [ ] French keyword targets — « restaurant Omnisport Yaoundé »,
      « appartement meublé Yaoundé », « karaoké Yaoundé », « soirée Yaoundé »
- [ ] Open Graph imagery
- [ ] Canonical hub for the Google Business Profile and socials to point at

## Non-negotiables

- **No invented facts about the venue in shipped copy** — see `FACTS.md`. Where
  a fact is missing, ship a TODO or omit the section; do not write plausible
  filler. This matters more than usual here: several published details
  (hours, distance, phone numbers) genuinely contradict each other.
- Every animation degrades under `prefers-reduced-motion: reduce`.
- Real content or an explicit TODO. No lorem ipsum in committed markup.
- Photography of identifiable customers came from public social posts. Before
  any of it ships, confirm the venue has the right to use it. ⚠️
