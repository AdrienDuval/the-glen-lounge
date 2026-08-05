# CONTRACT — The Glen Lounge

**Design spec.** Decisions land here before they land in code; if the code and
this file disagree, this file is the bug report.

Status: **nothing agreed yet.** The tokens in `app/globals.css` are a neutral
dark placeholder shell, not a chosen direction.

## To decide

### Direction
- [ ] Mood / reference sites
- [ ] Light, dark, or both
- [ ] Photography-led or type-led

### Brand
- [ ] Logo (source files? redraw needed?)
- [ ] Palette — background, foreground, accent
- [ ] Display and body typefaces, and their licences

### Structure
- [ ] Page list (single scrolling page, or multi-page?)
- [ ] Section order on the home page
- [ ] Navigation pattern
- [ ] Menu presentation — inline, PDF, or its own page
- [ ] Booking / contact call to action

### Motion
- [ ] Intro / preloader — yes or no
- [ ] Scroll behaviour (Lenis is wired up; GSAP is installed but unused)
- [ ] Reduced-motion fallback for every effect added

## Decided

_Nothing yet._ Move items up from **To decide** with the date and the reason.

## Non-negotiables

- No invented facts about the venue in shipped copy — see `FACTS.md`.
- Every animation degrades under `prefers-reduced-motion: reduce`.
- Real content or an explicit TODO. No lorem ipsum in committed markup.
