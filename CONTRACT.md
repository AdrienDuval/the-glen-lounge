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
| **Bilingual, French first** — `app/[lang]/`, symmetric `/fr` + `/en` URLs, `/` → `/fr` (307), hreflang alternates with `x-default` → `/fr` | 2026-08-07 | Client confirmed FR + EN with French primary. Symmetric URLs keep canonical/alternate generation mechanical; a temporary redirect keeps the default-locale choice reversible. |
| **Design around the photography we already hold** — no shoot assumed | 2026-08-07 | Client's call. Drives the hero grade (the room is shot lights-on; the site darkens it) and `interior-lounge-04` as the hero frame. |
| **Palette sampled, not invented** — ground `#06090c`, gold `#e8bc3e` / `#ffcc03` / ember `#f16b2e`, marble `#23282e`–`#81817f` | 2026-08-07 | Every value read off the venue's own assets: the logo's near-black field and yellow→ember gradient, the lounge floor in `interior-lounge-04`. See the header comment in `app/globals.css`. |
| **Type**: Bodoni Moda (display) · Archivo (body) · IBM Plex Mono (labels) | 2026-08-07 | A Didone in caps over dark marble is the right register for the room, and it echoes the serif caps of the venue's own wordmark. Three families ≈ 78 KB — a budget item to revisit, not a free choice. |
| **Preloader: yes**, monogram-led, with a published signal contract (`glen:loaded` + `documentElement.dataset.loaded`) | 2026-08-07 | Client asked for it explicitly. The contract is what lets the hero entrance start underneath the exit slide instead of after it. |
| **Still-image hero, no video above the fold** | 2026-08-07 | The audience is on Cameroonian mobile data. The 20 MB of autoplaying video on `shandup-luan` is the one pattern from that build we deliberately do NOT inherit. Measured result: 150 KB on a 390 px viewport. |
| **Consent recorded per photograph** in `lib/photos.ts`, with `shippable()` filtering renders | 2026-08-07 | CONTRACT already made clearance a launch blocker; a field in the manifest enforces it instead of relying on memory. |
| **ESLint wired from day one** | 2026-08-07 | On `shandup-luan` the `eslint-disable` comments were decorative because ESLint was never installed. |
| **Embla (`embla-carousel-react` 8.6, ~8 KB headless) drives the Écrans flyer carousel** | 2026-08-07 | Client asked for a scroll library for the gallery. Embla is the smallest serious option, imposes no styles (the house CSS stays in charge), and owns only horizontal drag so it cannot fight Lenis for the wheel. Deliberately a different vocabulary from « Le lieu » — that band is pinned and scrubbed by page scroll (the signature move); the flyer archive is hand-driven: free drag with momentum, snap-aligned prev/next, progress hairline. No autoplay, so the carousel needs no reduced-motion branch; the hover lift and reveals are gated as usual. |

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
The tokens in `app/globals.css` are no longer placeholders — each carries the
asset it was sampled from in a comment.

## Phase 0 — built (2026-08-07)

The foundations, verified end to end (`tsc` clean, `eslint` clean, `next build`
clean, screenshots at 390 px and 1440 px in FR and EN).

| Piece | Where |
| --- | --- |
| Bilingual routing, hreflang, per-locale metadata | `app/[lang]/layout.tsx`, `lib/i18n/`, `lib/routes.ts` |
| Dictionaries — `en.ts satisfies Dict`, so a missing key fails the build | `lib/i18n/fr.ts`, `lib/i18n/en.ts` |
| Design tokens + primitives (`.rule`, `.frame`, `.label`, `.skip`) | `app/globals.css` |
| Preloader + the `glen:loaded` signal contract | `components/Preloader.tsx` |
| « G » monogram — stand-in until the vector lands | `components/Monogram.tsx` |
| Scroll bridge — Lenis on the GSAP ticker | `components/SmoothScroll.tsx` |
| Nav, language switcher, footer | `components/{Nav,LangSwitch,Footer}.tsx` |
| Hero + photo band (the system proof) | `components/{Hero,Lieu}.tsx` |
| Photo manifest with the consent gate | `lib/photos.ts` |
| 404 — locale-scoped and global, both in French with an English gloss | `app/[lang]/not-found.tsx`, `app/global-not-found.tsx` |
| AVIF pipeline, mobile-first `deviceSizes`, explicit `qualities` | `next.config.ts` |

**Measured**: 150 KB on a 390 px viewport (78 KB fonts, 71 KB AVIF), 507 KB at
1440 px. First Load JS 165 KB — GSAP + ScrollTrigger + SplitText + Lenis. Both
the font stack and that JS figure are Phase 1 budget items.

## Phase 1 — built (2026-08-07)

The home page, nine sections, in the demand-led order below. `tsc`, `eslint` and
`next build` clean; captured at 1440 px and 390 px, FR and EN, with no console
or page errors.

| # | Section | Component | Notes |
| --- | --- | --- | --- |
| 01 | Hero **= the banner** | `Hero.tsx` + `lib/banner.ts` | slide 0 is the brand; the rest are nights, events and dated promotions |
| 02 | Trois adresses en une | `Trois.tsx` | their best-performing pitch |
| 03 | La semaine | `Semaine.tsx` | 7 nights; Jeudi carries the accent |
| 04 | Le lieu | `Lieu.tsx` | pinned horizontal gallery (desktop only) |
| 05 | Événements | `Evenements.tsx` | routes to a call — no packages published |
| 06 | Appartements | `Appartements.tsx` | teaser; the real page is Phase 4 |
| 07 | Écrans géants | `Ecrans.tsx` | type + fixture board + Embla drag carousel of the venue's own match flyers (client decision — see below) |
| 08 | Suivre le Glen | `Social.tsx` | outbound platform cards; live feeds are a planned integration, the seam is documented in the component |
| 09 | Venir & réserver | `Contact.tsx` | the site's single conversion point; phone-first with the entrance photo as wayfinding |

### The hero banner (revised 2026-08-07, at the client's request)

The banner was first built as its own section below the hero. The client asked
for the hero itself to be the scrolling banner, so the two were merged and the
standalone `Affiche.tsx` was removed.

| Decision | Why |
| --- | --- |
| **Slide 0 is the brand**, slides 1..n are events/promos | Keeps the venue's own line as the first thing a visitor reads, without giving the banner a separate section to compete with. |
| **Persistent visually-hidden `<h1>`** on the section; the visible brand line is a `<p>` | A heading inside a rotating panel is `aria-hidden` for most of the page's life. The `<h1>` never rotates, so it is always exposed — and it says what the venue *is*, which the mood line does not. |
| **Only slide 0 is `priority`; the rest mount on demand** | Every panel is `position: absolute; inset: 0`, so `loading="lazy"` defers nothing — the browser fetches all of them at first paint. Slides mount as they are approached (current + next + visited). Measured: 229 KB → **181 KB** on mobile, and now flat however many slides get added. This matters because this is the section the venue will keep growing. |
| **Three-layer legibility**: base darkening, a left-weighted scrim, text-shadow | The frames are shot lights-on and the banquet ones are nearly white on the right. Copy that survived on slide 0 washed out on those. The left-weighted gradient guarantees the caption column is dark whatever the photograph does. |
| **A dated slide is shipped, expired, as the worked example** | `saint-valentin-2026` is a real campaign with its real window (2026-02-01→15). It does not render, which proves expiry works and gives the next promo a template to copy. |

Decisions taken while building it:

| Decision | Why |
| --- | --- |
| **One phone number rendered, not two** | The second published number is disputed by one digit and the evidence is genuinely split (see FACTS.md). `691 24 65 90` appears everywhere including the August 2026 posts. A number that might be wrong is worse than one number. |
| **Address renders « à 300 m »** | Every post from 2026-07-25 to 2026-08-01 says 300 m. FACTS.md's own "later post wins" rule settles it. |
| **Vendredi shows no time; Lundi shows « Nous consulter »** | Neither has a published value. An empty cell is information; an invented one is a liability. |
| **« Écrans géants » is type + fixture board + flyer gallery** (revised twice, 2026-08-07) | The one photograph showing the screen with a live match shows two identifiable guests (`PHOTOS.events_03`) — still blocked. The board carries the evergreen claim: header is the venue's own flyer line « EN LIVE SUR NOS ECRANS », rows are competitions it has verifiably screened, undated so nothing goes stale. The match flyers were first rejected over third-party player imagery and league marks; **the client heard that concern and decided to publish them** — five unique flyers now run as a scroll-snap gallery labelled as the archive of past soirées match, so their dates read as history. See ASSETS.md and `lib/photos.ts`. Clearing `events_03` would still improve the page. |
| **Two derived crops** (`events_table`, `food_pair`) | People-free regions of blocked photographs, so the Événements and Restaurant material could ship. Originals stay marked `guests`. See ASSETS.md. |
| **Shared motion in `useSectionMotion`** | Five sections reveal identically; one hook stops the vocabulary drifting. |
| **Gallery: common height, variable width** | A shared width makes a 2160×2880 portrait tower over a 16:9 landscape. Media height clamps against the viewport so the pinned section never overflows the fold. |

## Added 2026-08-07 (after the Facebook harvest)

The Facebook page turned out to be readable again without a login, and the
harvest contained two things that unblocked work immediately.

### Bal des Vétérans — the first live dated slide

`lib/banner.ts` now carries a real one-off (23 août, doors 18h, free entry,
K-Tino, DJ Christian Denon) with `to: "2026-08-24"`, so it removes itself the
morning after. Everything on it comes off the venue's own flyer.

This also needed a new consent category. `"promo"` = the venue's own
promotional artwork, where the people pictured are billed performers and the
asset exists to be circulated. Reposting it on the venue's own site is its
purpose — a different case from a candid photograph of a customer, and
`isCleared()` treats it as shippable.

> ⚠️ The flyer prints « 23 AOÛT » with no year. 2026 is the only sensible
> reading of a post dated 2026-08-06, and if that is wrong the slide simply
> never appears — the safe failure.

### `/fr/carte` · `/en/menu` — the menu page

| Decision | Why |
| --- | --- |
| **Localised slugs**, driven by `ROUTES` | The route table existed from Phase 0 for exactly this. `swapLocale` maps `/fr/carte` ↔ `/en/menu`, verified; `generateMetadata` builds hreflang from the table rather than swapping a path segment, which would break when the slug differs. |
| **`[slug]` replaced `[...rest]`** | Next cannot have a single dynamic segment and a catch-all at the same level. `dynamicParams = false` + `generateStaticParams` means unknown slugs 404 into the locale-scoped not-found. |
| **Transcribed, not photocopied** | The source artwork has typos («SANWDWICH», «FONDANT AN CHOCOLAT»), lists two dishes twice at different prices, and prints one price as «12 00FCFA». `lib/menu.ts` fixes spelling and carries a `query` on every genuinely ambiguous line. `pendingQueries()` returns the list to send the client. Nothing was silently invented. |
| **Two honesty notes on the page** | The prices are dated février 2026, and the source has no drinks at all. Both are things a visitor would otherwise discover at the table. |
| **Nav links are `/fr#semaine`, not `#semaine`** | They have to work from an inner page. The handler intercepts only when the target exists on the current page, so one handler is correct on every route. |

## Hero banner v2 + event pages (2026-08-07, client feedback)

Feedback was: images too dark, text and key info not prominent enough, the
transition too basic for the register, and a request for per-event pages.

| Decision | Why |
| --- | --- |
| **Grade rebalanced, not just lightened** | The previous full-frame darkening killed the photograph. Replaced with three targeted layers — a band under the fixed nav, a bottom fade, and a radial bed at bottom-left where the caption sits. The centre and upper right of every slide now stay bright. |
| **Key facts as chips** | Entry price, doors, age limit were buried in a sentence. They are now pills with their own background and blur, so they read regardless of what the photo is doing behind them. |
| **Directional clip-path wipe, not a crossfade** | The incoming slide is revealed by a wipe whose direction matches the control pressed, while its image settles out of a scale-and-drift. The title splits into masked lines that rise behind it; the rest staggers after. Collapses to an instant swap under reduced motion. |
| **Dwell indicator on the active dot** | The banner now tells you when it will move instead of surprising you. |
| **`layout: "poster"` for event artwork** | A portrait flyer cover-cropped into a landscape hero loses its own typography and then fights the caption laid over it — verified in the browser, it was a mess. Poster slides show the artwork whole on a dark ground, to the right of the copy. Applies to the hero and the event masthead. |
| **Permanent scrim behind the nav** | It only gained a backdrop after 60px of scroll, so it was unreadable on bright slides — at the top of the page, where everyone starts. |
| **Nav trimmed to five links** | Seven links plus switcher, phone and CTA wrapped onto two lines at 1440px. « La semaine » went; the events page covers it properly now. |

### Event pages — `/fr/evenements/<slug>` · `/en/events/<slug>`

`lib/events.ts` is now the single source of truth. One entry produces three
things: a hero banner slide, a card on the events index, and its own page.
Nobody writes a route. 6 events → 12 pages, both languages, at build time.

- **Expired one-offs keep their page.** They drop out of the banner and the
  index, but shared links and search results outlive the night — the page just
  says the event has passed instead of still reading as an invitation.
- **A routing bug the browser check caught:** `swapLocale` matched the whole
  path remainder against the route table, so the language switcher on
  `/fr/evenements/<slug>` produced `/en/evenements/<slug>` — French section
  slug, 404. It now translates the leading segment and keeps the rest. Event
  slugs are language-neutral by design.

## L'agenda v2 + Le lieu polish + exterior (2026-08-07, client feedback)

Feedback: make the calendar full-width, show the information on hover, improve
readability. Plus the ASSETS.md corrections (daytime exterior found; generated
apartment image commissioned but not yet delivered).

| Decision | Why |
| --- | --- |
| **Calendar is full-width; every cell prints its event's name + door time** | Readability should not depend on hovering at all — the month scans at a glance. Below 980px cells stay compact (number + dot) and a tap feeds the panel below the grid. |
| **One popover that GLIDES between days** | Hover/focus raises a card (photo, date, summary, quand/où, chips, link) anchored to the cell; moving across the month it travels as one object rather than re-opening — that, not a tooltip, is the luxurious read. Above the cell when there's room, below on the top rows. |
| **Keyboard contract** | Keyboard "click" (event.detail === 0) moves focus into the popover so its link is reachable; Escape returns focus to the cell. Close-on-leave keeps a grace period and never closes while focus is inside. |
| **Close-on-leave exists only where the popover exists** | Chromium synthesises `mouseleave` on scroll after a tap, which was silently wiping the tapped selection out of the mobile panel. The close path now checks the popover media query first. |
| **Bal des Vétérans is a SUNDAY** | The calendar exposed a copy error: 2026-08-23 falls under DIMANCHE, my hand-written `when` said « Samedi ». The flyer prints no weekday; « Dimanche Vétéran » branding corroborates Sunday. Fixed in `lib/events.ts`. |
| **After Work added (vendredi), with NO time claimed** | The only published Friday time is « dès 16h » from janvier 2026; every other night has since drifted to 19h. Saying nothing is honest; guessing is not. |
| **Lieu: captions + live counter + containerAnimation parallax** | Each card carries an index + short caption; a `01 / 06` counter tracks the pin; images drift ±4% inside their frames via `containerAnimation` on a widened `.para` carrier, so the reveal scale and the parallax never fight over one transform. |
| **Appartements media = the real building by day** | `exterior-day.jpg`, cropped per ASSETS.md from the FB harvest (crop verified by eye: no identifiable people; only figures are printed on the venue's own banner). Signage below, three floors of balconies above — the honest frame for the product. The commissioned illustration, when it arrives, joins it captioned « Image d'illustration » and never replaces it. |
| **`origin?: "photograph" \| "generated"` added to the photo manifest** | Provenance is recorded in the type system before any generated image exists, per ASSETS.md Option C. |
| **`NEXT_DIST_DIR` env override for `distDir`** | Verification builds go to `.next-verify` and serve on 3101, so they can never again swap `.next` out from under the dev server on 3100. |

### Adversarial review of the calendar round (2026-08-07)

A 12-agent review/verify pass ran over the changed files; 9 raw findings, 6
confirmed against the code, all fixed and re-verified in the browser:

1. **Wide touch devices got NEITHER detail surface** (high). The popover needs
   `hover + fine pointer + ≥980px`; the panel was hidden by width alone. An
   iPad in landscape had no way to reach any event detail. The panel-hiding
   query now mirrors the popover's exactly. Verified under emulated
   coarse-pointer at 1180px: panel visible, popover none.
2. **Mobile panel could claim « rien de publié » on a quiet Monday** — today's
   cell short-circuited the fallback chain even with no event on it. Today now
   only counts when it has one.
3. **Escape was a global hijack**: bound to window, armed forever on touch
   (selection never auto-clears there), yanking focus/scroll back to the
   calendar from anywhere on the page. Now gated on the popover environment,
   only restores focus when focus is inside the grid, and suppresses the
   focus-triggered re-open that made Escape a no-op.
4. **Tabbing out of the grid left the popover stranded on screen** — close was
   mouseleave-only. `focusout` now schedules the same close.
5. **`aria-pressed` announced a meaningless constant** on every focused cell.
   The cells are a disclosure: now `aria-expanded` + `aria-controls="cal-pop"`.
6. **The lieu track was keyboard-unreachable wherever the pin is absent**
   (reduced motion, <900px, Safari) — a hidden-scrollbar scroller with no tab
   stop. Now `tabIndex=0`, `role="region"`, labelled, with a focus ring.

The review also confirmed the working-as-intended paths: the consent gate
covers every render, and the SSG/hydration contract holds.

## Responsive pass + mobile nav drawer (2026-08-07)

Mobile is where the traffic is, so it got the priority. Also recorded: **no CMS
— ever.** The client edits the typed data files directly; Phase 2 (Decap/
Sveltia) is cancelled, and the `lib/*.ts` shapes are the permanent editing
surface.

**Audit method**: automated horizontal-overflow sweep (scrollWidth vs viewport,
with offender identification) across all 5 pages × 6 viewports (360→1440), plus
visual spot checks. Mobile and tablet were structurally clean; the failures
were the nav.

| Finding | Fix |
| --- | --- |
| **Phones had NO route to the inner pages** — the link row is display:none <900px, so `/fr/carte` and `/fr/evenements` were unreachable on the very devices most traffic uses | Full mobile drawer: burger → fixed overlay, staggered links, call/WhatsApp buttons, language switcher. |
| Nav overflowed by 7px at 1280 (phone number) and 2px at 360 (gap floor); burger pushed off-screen at 360 by the bar-mounted language switcher | Phone number only ≥1360 (measured: fits at 1440, not 1280). LangSwitch moved into the drawer <900px. Gap floor 0.4rem. Verified: fits at 360/390/1280/1366/1440. |
| Hero dots were a 2px-tall tap target | Visible line unchanged; the button is now 1.5rem tall with the line drawn inside. Arrows to 44px. |

### The drawer's first draft was wrong in an instructive way

The overlay was `position:fixed` INSIDE the header — whose entrance animation
leaves a transform, and whose scrolled state adds a backdrop-filter. Either
makes the header a containing block, so the "fixed" drawer pinned to the BAR,
one strip tall, page grinning through. It is now a sibling of the header, and
the entrance clears its transform on complete.

### Adversarial review of the drawer: 9 raw, 7 confirmed, all fixed

1. **Drawer section links never scrolled** (high). `close()` is batched, so
   `lenis.scrollTo` ran while Lenis was still stopped — silent no-op, verified
   against the installed lenis source. Fix: `start()` before `scrollTo` (NOT
   `force: true`, which the later cleanup would have tween-killed).
2. **No focus trap** (high): Tab walked out of the aria-modal dialog into the
   opaque-hidden page, scroll-locked so focus could not even be scrolled into
   view. Fix: everything behind the overlay is `inert` while open.
3. **Only close control lived outside the dialog** (high): aria-modal excludes
   the header's ✕ from AT reach and iOS VoiceOver has no Escape — the only
   exit was navigating away. Fix: sr-only-until-focused close button as the
   dialog's first child.
4. **Preloader and drawer clobbered each other's scroll locks** — both wrote
   the same globals. Fix: refcounted `lib/scrollLock.ts`, both owners routed
   through it, SmoothScroll honours a lock held before Lenis mounts (which
   also deleted the old delayedCall workaround).
5. **Resize-to-desktop close dropped focus to `<body>`** — the burger it
   restores to is display:none there. Fix: fall back to the brand link.
6. **`visibility` in the drawer's transition made focus-on-open a no-op** —
   at transition progress 0 the computed value is still `hidden`, so the
   first-link focus() silently failed (empirically reproduced in Chrome by
   the review). Fix: opacity + inert only, `pointer-events` as the
   no-inert-support fallback.
7. Two claims were **refuted**: both assumed Nav persists across route
   changes, but it is rendered per-page and unmounts on navigation.

**Verified end-to-end in the browser**: open focuses « La carte », main/footer
inert, 25-Tab walk never lands on hidden content, drawer anchor link scrolls
0 → 5904, inert cleared and scroll unlocked after close, Escape closes with
focus returned. No console errors.

## Mobile hero rebuilt — two compositions, not one squeezed (2026-08-07)

Client feedback on the shipped mobile page: images invisible, hero broken. It
was right, and the cause was a design error rather than a sizing one — the
desktop *overlay* composition had simply been shrunk. On a portrait screen a
caption panel plus chips plus two buttons cannot share space with a landscape
photo: the panel wins and the photograph is reduced to a sliver behind it.

**The rule now, written down so it is not re-litigated: never overlay a caption
on a phone.**

| Viewport | Composition |
| --- | --- |
| **< 900px** | **Stacked.** Photo owns the top 56svh, full bleed, nothing on it but the nav band; its foot melts into `--ink`. Caption sits BELOW on the page's own ground — no glass, no border, no shadow, because there is nothing behind it to defend against. |
| **≥ 900px** | **Overlay.** Unchanged: image is the viewport, caption is the glass panel at bottom-left, contrast handled by `backdrop-filter: brightness()` (measured 13:1 worst case). |

Applied identically to `EventPage`'s masthead, photo and poster variants.

Also: the eyebrow row is desktop-only now — on a phone it was two rows of
letterspaced mono sitting on the photograph, repeating what the nav and the
heading already say. Dot hit-areas shrink to fit 8 slides at 360px.

### Two bugs the measurement caught that the eye did not

1. **The desktop caption panel disappeared entirely** after the restructure —
   yet `getBoundingClientRect` and `opacity` all read correct. `elementFromPoint`
   at the panel's own coordinates returned `IMG`: the slide was painting over
   it. The crossfade assigns per-slide `z-index: 2` so the incoming panel can
   wipe over the outgoing one, and with no stacking context on `.stage` those
   values escaped into the hero's context and beat the panel's `z-index: 1`.
   Fixed with `isolation: isolate` on `.stage` — commented as load-bearing,
   because it looks like decoration and will be deleted otherwise.
2. **A ~175px dead gap** between photo and caption on mobile. All captions
   share one grid cell (so the block never resizes between slides), which
   makes the cell as tall as the *tallest* caption; bottom-aligning them left
   every shorter one floating. Top-aligned on mobile, bottom-aligned in the
   desktop panel where the foot is the anchor. Measured 175px → **4px**.

Verified: hit-test returns the caption's own heading on desktop before and
after a wipe; no horizontal overflow at 360/390; both event-page variants and
the desktop hero clean; no console errors.

### Open after Phase 1

- [ ] **No section nav on mobile.** Below 900 px the links are hidden; the brand,
      FR/EN and RÉSERVER remain. Defensible for a single-scroll page (the primary
      CTA is present and goes to `#contact`), but a drawer is the conventional
      answer. Your call.
- [ ] Banner is populated with evergreen slides only — no dated event is
      currently confirmed. The date-window mechanism is built and unused.
- [ ] First Load JS is 170 KB. GSAP + ScrollTrigger + SplitText + Lenis.

## To decide

### Brand
- [ ] Vector logo — blocked on the client (best copy is 439×439). Until then
      `components/Monogram.tsx` is a deliberate stand-in; swapping it in should
      touch no caller.
- [x] ~~Final palette~~ — sampled, see Decided
- [x] ~~Display and body typefaces~~ — Bodoni Moda / Archivo / IBM Plex Mono,
      all OFL via `next/font/google`

### Structure
- [ ] Page list. Working assumption, demand-led from what performs on TikTok:
      home · la carte / restaurant · **les soirées** (weekly programme) ·
      **appartements** · **événements & privatisation** · contact
- [ ] Home section order. Proposed, ordered by TikTok plays:
      01 hero · 02 **à l'affiche** (the updateable banner) · 03 trois adresses
      en une · 04 la semaine · 05 le lieu · 06 événements · 07 appartements ·
      08 écrans géants · 09 venir & réserver
- [ ] **The « à l'affiche » banner data model** — date-windowed slides
      (`{kind: "image" | "video", src, from?, to?}`) so an event banner expires
      by itself. Shape it as a CMS would deliver it from day one.
- [ ] **How the client updates it** — typed TS files now; Decap or Sveltia CMS
      (git-based, no database) once they want to edit it themselves.
- [ ] Menu presentation — inline, PDF, or its own page (blocked on the document)
- [ ] Reservation CTA — phone, WhatsApp, or a form
- [x] ~~Navigation pattern~~ — fixed bar, backdrop past 60 px, links added as
      each section lands (a nav link to a section that doesn't exist is a dead
      link, not a placeholder)

### Motion
- [x] ~~Intro / preloader~~ — yes, see Decided
- [x] ~~Reduced-motion fallback~~ — every effect branches inside
      `gsap.matchMedia`, plus the CSS kill switch in `globals.css`. Lenis does
      not mount at all under `reduce`.
- [ ] Scroll choreography for the Phase 1 sections. The pinned horizontal
      gallery from `shandup-luan` is the intended treatment for « le lieu » —
      port its keyboard focus-to-scroll bridge with it.
- [ ] How video is used — 75 harvested clips exist, but they are vertical 9:16
      social cuts. Decide whether they earn a place or whether we wait for
      proper footage. **Not above the fold** either way.

### SEO — a first-class requirement on this project
- [ ] `LocalBusiness` + `Hotel` (or `Restaurant`) structured data
- [ ] The seven recurring nights as `Event` schema — no competitor in Yaoundé
      is likely to have this, and the data is already in `lib/site.ts`
- [ ] French keyword targets — « restaurant Omnisport Yaoundé »,
      « appartement meublé Yaoundé », « karaoké Yaoundé », « soirée Yaoundé »
- [ ] `sitemap.ts` + `robots.ts` — both blocked on the domain
- [ ] A real Open Graph image (currently `interior-lounge-04` stands in)
- [ ] Canonical hub for the Google Business Profile and socials to point at
- [x] ~~Per-locale canonical + hreflang~~ — done in `generateMetadata`

## Non-negotiables

- **No invented facts about the venue in shipped copy** — see `FACTS.md`. Where
  a fact is missing, ship a TODO or omit the section; do not write plausible
  filler. This matters more than usual here: several published details
  (hours, distance, phone numbers) genuinely contradict each other.
- Every animation degrades under `prefers-reduced-motion: reduce`.
- Real content or an explicit TODO. No lorem ipsum in committed markup.
- Photography of identifiable customers came from public social posts. Before
  any of it ships, confirm the venue has the right to use it. ⚠️
