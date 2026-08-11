# FACTS — The Glen Lounge

**Content truth for this site.** Nothing goes into the UI unless it is recorded
here first, with a source. Anything not listed below is unknown — write a TODO,
never a plausible guess.

**Sources**
- `IG` / `FB` — screenshots of the profiles, supplied by the client 2026-08-05.
- `TT` — 96 captions + 460 media files harvested from TikTok
  [@the.glen.lounge](https://www.tiktok.com/@the.glen.lounge) on 2026-08-05
  (public, no login). Digest: `content/tiktok-captions.md`.
  Manifest: `content/harvest-manifest.md`.
- `CL` — stated directly by the client during the build. Dated per line.

Where sources disagree, **the later post wins** and the conflict is flagged.

✅ = verified · ⚠️ = conflict or gap needing the client

---

## Identity

| Field | Value | Source |
| --- | --- | --- |
| Trading name | **The Glen Lounge** — full form « The Glen Lounge Restaurant Appartement ». Also « Glen Lounge », « The Glen », « The Glen Appartement » for the accommodation side | ✅ all |
| Descriptor | « Restaurant - Lounge - appartement » | ✅ IG/FB |
| Signage reads | « THE GLEN · LOUNGE-RESTO » | ✅ photo |
| FB page category | « Complexe hôtelier » | ✅ FB |
| **Opened** | **early October 2025.** First TikTok post 2025-10-03; launch post « Bienvenue au The Glen Lounge » 2025-10-07 | ✅ TT |
| Language | **French** (Cameroon), heavy 237 slang and emoji | ✅ |
| Currency | **FCFA** | ✅ TT |
| Owner / operator | _TODO_ | ⚠️ |

### Social accounts

| Platform | Handle | Reach (2026-08-05) |
| --- | --- | --- |
| **TikTok** | [@the.glen.lounge](https://www.tiktok.com/@the.glen.lounge) | ~114 posts, **125 955 plays** — by far the strongest channel |
| Instagram | [@the_glen_lounge](https://www.instagram.com/the_glen_lounge/) | 82 posts, 90 followers |
| Facebook | [The Glen Lounge](https://www.facebook.com/people/The-Glen-Lounge/61580468213620/) | 923 followers |

> ⚠️ **A second Facebook page exists** — « GLEN Lounge », id `61578489771645`.
> Almost certainly a duplicate; it splits reach and search ranking.

---

## Location & contact

| Field | Value | Source |
| --- | --- | --- |
| Area | Yaoundé — **Omnisport**, derrière le stade | ✅ all |
| Landmark | « à 150 m de l'école publique de Mfandena » — but posts from 2026-07-25 onward say **300 m** | ⚠️ conflict |
| Extra detail | « 2ᵉ entrée à droite » | ✅ TT 2026-06 |

> ⚠️ **150 m or 300 m?** Everything from launch through 2026-05-29 says 150 m;
> every post from 2026-07-25 on says 300 m. This is the line customers navigate
> by — it needs settling.
>
> **Updated 2026-08-07.** Every post checked from 2026-07-25 to 2026-08-01 says
> 300 m, consistently and without exception. Under this file's own rule — the
> later post wins — 300 m is the venue's current published claim, so the site
> renders it (`dict.contact.directions`). Still worth confirming, because it is
> the one line a customer navigates by, but it is no longer a coin toss.

### Phone numbers — ⚠️ six variants published

| Number | Where | Note |
| --- | --- | --- |
| **+237 691 24 65 90** | TT reservations (Nov 2025 → Aug 2026), FB intro | Most consistent — appears across the whole timeline |
| **+237 652 81 46 49** | TT Nov 2025, FB intro | |
| +237 652 81 **45** 49 | TT Jul–Aug 2026 | ⚠️ One digit off the above. Since `46 49` appears in both the oldest TikTok posts *and* the current FB page, `45 49` is **probably a recent typo** — confirm |
| +237 696 81 70 30 | IG bio | |
| +237 699 96 65 65 | FB contact field | |
| +237 691 51 35 16 | FB WhatsApp | |

**Working assumption**: the booking line is **691 24 65 90**.
No email address is published anywhere. ⚠️

> **Updated 2026-08-07.** Re-reading the caption digest weakens the earlier
> inference. The three most recent reservation posts (2026-08-01 « Samedi VIP »,
> 2026-07-29, 2026-07-27) all print **652 81 45 49**, not `46 49`. So the
> evidence is genuinely split — recent TikTok says 45, the Facebook page and the
> oldest posts say 46 — and "the later post wins" now points the *other* way.
>
> **Updated again, same day, after the Facebook harvest.** The Bal des Vétérans
> flyer (their own artwork, posted 2026-08-06) prints
> **+237 691 24 65 90 / +237 652 81 45 49**. That is a third independent recent
> source for `45`, and unlike a caption it is a designed asset someone
> proof-read. The balance has tipped: **`45 49` is now the likelier number**,
> and `46 49` looks like a stale value sitting in the Facebook intro field.
>
> This changes the *recommendation*, not the site. Still one number rendered,
> still `691 24 65 90`. But when you ask the client, ask them to confirm
> `652 81 45 49` and to fix the Facebook intro field — do not lead with `46`.
>
> **What the site does about it**: renders **only +237 691 24 65 90**, the one
> number that appears consistently everywhere including the August 2026 posts.
> The disputed line is kept in `lib/site.ts` but is not rendered anywhere
> (`components/Contact.tsx`, `components/Footer.tsx`). Publishing a number that
> might be one digit wrong is worse than publishing a single correct one.
> **This is still the #1 launch blocker.**

### Opening hours ⚠️

Genuinely contradictory across the timeline:

| Claim | When |
| --- | --- |
| « Ouvert 24h/24 – 7j/7 » | TT 2025-10-07, 2025-11-15 |
| « Ouvert 7j/7 de 10h jusqu'à tard » | TT 2025-10-08, 2026-06-24 |
| « Ouvert tous les jours : 8h - Xh » / « 9h - xh » | TT 2026-05-12 / 2026-05-14 |

> **Likely reconciliation** — the **apartments** are 24h/24 (the accommodation
> posts say so explicitly: « disponibilité 24h/24, tous les jours »), while the
> **restaurant/lounge** runs 10h until late. That is a hypothesis, not a fact.
> Confirm both, and get a real closing time — « jusqu'à tard » cannot go into
> `openingHours` structured data.

---

## The weekly programme

The spine of the site. Note it **changed between the 2025 and 2026 seasons** —
use the current column, and don't resurrect the old names.

| Day | Current (2026) | Was (late 2025) |
| --- | --- | --- |
| Lundi | ⚠️ nothing found since Oct 2025 | **After Work du lundi**, 18h |
| Mardi | **Casino / Game Night Show**, 19h | Mardi Casino |
| Mercredi | **Mercredi Cocktail**, 19h | « détente et bonne vibe », 15h |
| Jeudi | **Jeudi Karaoké** (« des Baddies »), 19h | Karaoké, 18h → 16h in Jan 2026 |
| Vendredi | **After Work** | After Work, 18h → 16h |
| Samedi | **Samedi VIP** | **Grosse Bringue**, 20h |
| Dimanche | **Dimanche Vétéran** (100 % rétro) | **Sunday Brunch**, dès 12h |

- Start times drifted 18h → 16h → 19h across the year. ⚠️ Confirm current times.
  **Updated 2026-08-07** — the August 2026 posts are consistent on **19h** for
  Mardi Casino (2026-08-04, `#OpenDoor19H`), Samedi VIP (2026-08-01) and
  Mercredi Cocktail (2026-07-29). Jeudi and Dimanche are still inferred from
  older posts; Vendredi has no published time at all, so the site renders that
  cell empty rather than guessing.

  **Updated 2026-08-11 — ⚠️ STILL THE BIGGEST OPEN QUESTION ON THE SITE.** The
  Instagram dump (ASSETS.md) brought the venue's own flyers for four nights, and
  every one of them prints a door time that contradicts the 19h above:

  | Night | Flyer prints | August posts said |
  | --- | --- | --- |
  | Jeudi Karaoké | **16H** (« DÉBUT 16H CE JEUDI ») | 19h (inferred) |
  | Mardi Casino | **20H** (« DÉBUT 20H CE MARDI ») | 19h (`#OpenDoor19H`, 08-04) |
  | Mercredi Cocktail | **20H** (« DÉBUT 20H ») | 19h (07-29) |
  | Samedi VIP | **18H** (« OPEN DOORS 18H ») | 19h (08-01) |

  Note the karaoke 16h is exactly the January 2026 value in the "Was" column
  above — the one this table already treats as superseded — so the flyers may
  simply be the older asset. The Mardi row is the sharpest: a post dated
  2026-08-04 tagged `#OpenDoor19H` against artwork printing 20H.

  **Decision (client, 2026-08-11): the site publishes no time of its own for
  those four.** The flyer is the only clock on the page, so there is exactly one
  time claim per night instead of two contradicting ones. `lib/events.ts` carries
  the rule. **The question is not resolved, only made safe** — ask the client for
  the four door times and put them back.

  Dimanche Vétéran keeps 19h (no flyer, so nothing contradicts it), and the
  « Dès 19h » on the lounge card in the Trois section is a general opening claim,
  not a night's door time — both left alone.
- **Jeudi Karaoké is the flagship** — most-posted night, and the single
  best-performing post on the account (25 100 plays).
- ⚠️ **Sunday Brunch** was a named, well-performing product (1 883 plays) that
  seems to have been dropped for Dimanche Vétéran. Worth asking — it is exactly
  the kind of thing a website sells well.
- **Resident DJs: DJ W & DJ Personica** — credited on nearly every flyer. ✅

---

## Services

### Restaurant ✅
- Positioned **affordable-chic**: « Manger bien, à petit prix », « Le chic et le
  glamour à porter de tous », `#apetitprix`.
- **Dishes actually seen**: plated main courses — meat in a cream/mushroom sauce
  with fries and roast carrots (photographed twice); **pizza** (2025-11-10);
  « **Samedi poulet** » — a recurring Saturday chicken plate (2025-12-07, 2026-02-28);
  **Sunday Brunch**; « **Midi express** » lunch service.
- ✅ **THE MENU IS IN HAND** (found 2026-08-07 in the Facebook harvest, posted
  2026-02-01). Four pages, fully legible, complete FCFA price grid, French with
  English glosses. Files: `122122637{709,745,793,817}015607.jpg` in
  `assets-raw/facebook/`. This closes the open question that used to be #3.

  | Page | Sections |
  | --- | --- |
  | `…817` | Viandes & volailles · Pâtes · Plats locaux |
  | `…745` | Entrées froides · Entrées chaudes · Produits de mer |
  | `…793` | Accompagnements & suppléments · Pizzas |
  | `…709` | Petites faims · Desserts |

  Range: suppléments 1 000 FCFA · desserts 2 000–3 000 · pâtes 3 500–6 000 ·
  petites faims 3 500–4 000 · pizzas 6 000–10 000 · viandes 3 500–20 000 ·
  produits de mer 7 000–12 000.

  ⚠️ Two cautions before this ships. The grid is dated **février 2026** — prices
  need confirming as current. And the artwork carries several typos
  (« SANWDWICH », « FONDANT AN CHOCOLAT », « TEXAN BEFE BURGER »); a web menu
  should be set from the *data*, not reproduce the errors.

  ⚠️ **No drinks list.** For a lounge selling cocktails and bottle service, that
  is a conspicuous gap — the four pages are food only. Worth asking for.
- ⚠️ « on livre le bonheur en parts égales » (pizza post) *might* indicate
  delivery, but it reads as wordplay. **Do not claim delivery** without asking.

### Appartements ✅ (more than first thought)
- « **Glen Appartement – meublé haut standing** » — furnished, high-standard.
- « **disponibilité 24h/24, tous les jours** », « Confort, sécurité, intimité ».
- Marketed for **location** (rental) — `#AppartementMeublé` `#LocationYaoundé`.
- ✅ **Eleven studios**, with these unit codes (`CL`, 2026-08-09):
  `ST005-A` · `B35-A` · `B15-A` · `A10-A` · `A10-1-A` · `A10-2-A` · `A10-3-A` ·
  `SS130-A` · `SS140-A` · `SS101-A` · `SS110-A`. Live in `lib/apartments.ts`;
  they are the only confirmed field in that file. ⚠️ The codes look like they
  encode a building and a floor (`A10-*` reads as one unit split three ways) —
  unconfirmed, so nothing in the UI interprets them.
- « Réserve maintenant avant que ce soit complet ! » — implies limited stock.
- **Saint-Valentin packages** with reductions, incl. a room dressed with rose
  petals, candles and balloons (photographed — `public/photos/apartment-valentine-*`).
- ⚠️ Still unknown: **what types, what rates, how to book.**
- ⚠️ **Where the studios are** relative to the restaurant is NOT recorded. Every
  published caption gives the three businesses the same *address*
  (« Omnisport, derrière le stade »), which is co-location, not stacking. The
  facade photo shows balconies above the signage (ASSETS.md) but that is one
  overcast snapshot, and the unit-code prefixes (`ST` / `B` / `A` / `SS`) read
  more like several blocks than one staircase. Copy says « dans la même
  maison » / « sur place » and stops there — « au-dessus du lounge » was drafted
  twice and removed twice.
- ⚠️ Presentation note: the one apartment interior we have looks markedly
  **plainer than the lounge** — painted walls, simple bed frame, visible AC and
  cabling — though it was shot in low light dressed for Valentine's. Don't
  oversell it as luxury; either get better photography or lead with the
  occasion/package angle, which is what they already do well.

### Events & private hire ✅
Second-strongest content on the account.
- Anniversaires, afterworks, shootings, dîners, réunions, **DT**, mariages,
  cérémonies. « Glen, le goût du raffinement à chaque occasion. »
- Bottle service — « assurez-vous d'avoir vos bouteilles pour votre événement ».
- Photographed: full banquet setup, long table, chafing dishes, black/gold
  balloon arch, branded placemats (`public/photos/events-*`).
- ⚠️ No capacity, packages or pricing published.

### Live sport ✅
- **Écrans géants**, all matches live. World Cup 2026, **CAN Maroc 2025**
  (« village de la CAN »), Champions League, El Clásico.
- Reliable traffic driver; « le meilleur spot pour supporter les Éléphants ».

#### ✅ Bal des Vétérans — a real dated event (flyer, FB 2026-08-06)

The first confirmed one-off with full details, and the first genuine candidate
for a dated banner slide:

| Field | Value |
| --- | --- |
| Date | **23 août** (year not printed; the post is dated 2026-08-06, so 2026) |
| Doors | **18h** («OPEN DOOR 18H») |
| Entry | **FREE ENTRY** |
| Artist | **K-Tino** |
| DJs | **DJ Christian Denon**; mix policy **DJ W / DJ Personica** |
| Age | **+18** |
| Address on flyer | « Yaoundé - Omnisport derrière le stade, **300 m de l'école publique** » |
| Reservations on flyer | **+237 691 24 65 90 / +237 652 81 45 49** |

> Two things this flyer settles on its own. It is the venue's **own current
> artwork** and it prints **300 m** — see the distance note above. And it prints
> **652 81 45 49**, which is now the third independent recent source for `45`
> against the Facebook intro field's `46`.

## One-off events seen
« Bal des vétérans » (upcoming, FB 2026-08-05) · 8 mars — tombola **200 000 FCFA**,
from 12h · Saint-Valentin packages · Fête de l'Unité, Fête de la Jeunesse,
Pâques, Ramadan, Noël, Nouvel An greetings · visit from **@MOUSTIK KARISMATIK**.

---

## Brand, look & voice

### The venue's actual design language ✅ (from photography)
This matters more than any moodboard — the site should echo the room:
- **Glossy dark marble floors**, white coffered ceilings with marble inlay panels.
- **Black + white + gold** throughout: gold stanchions with black rope, gold
  table bases, brass fittings.
- **Maximalist glam, not minimalism** — zebra-print tub chairs, Versace cushions,
  marble-top tables, backlit « G » monogram behind the bar.
- Backlit exterior signage in white neon on **black marble cladding** + stone.
- Multiple wall-mounted screens and moving-head stage lighting.

### Logo
Circular badge, near-black ground, gold/amber line art — a chef's toque over a
fork, enclosing a house/roof outline (the "apartment" half). Wordmark
« GLEN LOUNGE » + « RESTAURANT APARTMENT ».
⚠️ **Best copy we have is 439×439 raster** (`public/brand/tiktok-avatar.jpg`).
A vector original is the **single highest-value asset request**.

### Voice
Warm, playful, second-person, emoji-dense, a little cheeky — « Arrête de chanter
dans tes toilettes », « Tu chantes bien ou faux ? On s'en fout ». The site should
be more composed than the captions without going corporate.

**Phrases worth reusing** — « Ambiance, goût et élégance réunis » · « Un espace
chic, une ambiance unique, des moments inoubliables » · « Le chic et le glamour
à porter de tous » · « le goût du raffinement à chaque occasion » · « Confort,
sécurité, intimité ».

**Hashtags they own** — #TheGlenLounge #GlenLounge #YaoundeByNight #NightLife237
#JeudiKaraoke #MardiCasino #MercrediCocktail #SamediVIP #AppartementMeublé
#LocationYaoundé.

### What performs (TikTok plays)

| Plays | Post | Read |
| --- | --- | --- |
| **25 100** | Jeudi Karaoké — « Tu chantes bien ou faux ? » (2025-11-05) | Karaoke is the hook |
| 6 582 | Venue intro — « Ambiance, goût et élégance réunis » (2025-10-08) | Show the space |
| 4 216 | « Bienvenue » launch — resto / lounge / appartements (2025-10-07) | The three-in-one pitch works |
| 3 499 | 8 mars tombola (2026-03-03) | Occasions with a hook |
| 3 317 | Jeudi karaoké (2026-02-19) | again |
| 2 619 | « Ton village de la CAN tu l'as ? » (2025-12-27) | Sport |
| 1 971 | Events / private hire (2026-01-19) | Private hire sells |

→ Homepage should lead with **the space**, give **Jeudi Karaoké** and the weekly
programme real prominence, and give **private hire** and **apartments** their own
routes. That is demand-led, not a guess.

---

## SEO baseline (2026-08-05)

The Glen Lounge appears in **no** mapping or directory service — no Google
Business Profile, no TripAdvisor, no Booking.com, no local directory. Search
returns only their own social accounts. See `ASSETS.md` for the recommended
listings work to run alongside the build.

---

## Assets in hand

| Asset | Stored at | Notes |
| --- | --- | --- |
| Full TikTok harvest — 460 files, 214 MB | `assets-raw/tiktok/` (**git-ignored**) | 75 videos, 59 images, 288 JSON sidecars |
| 17 web-grade images, curated | `public/photos/` | See below |
| Logo (low-res) | `public/brand/tiktok-avatar.jpg` | 439×439 ⚠️ |
| Caption digest | `content/tiktok-captions.md` | 96 captions, dated |
| Media manifest | `content/harvest-manifest.md` | every file → its post |

**Curated photography** — better than expected; TikTok photo posts keep full
resolution (video *covers* are the low-res ones):

| Files | Subject | Size |
| --- | --- | --- |
| `interior-lounge-01..06.jpg` | Main lounge/restaurant floor, bar, seating | 2048×1152 |
| `events-01..04.jpg` | Banquet/event setup, branded table | 2160×2880 |
| `exterior-night-01.jpg` | Facade at night, neon signage on black marble | 2160×2880 |
| `food-01..02.jpg` | Plated main courses | 2160×2880 |
| `apartment-valentine-01..04.jpg` | Apartment room, Valentine's dressing | 1440×1920 |

⚠️ **Gaps in the photography**: ~~no daytime exterior~~ (found 2026-08-07 in the FB harvest — see ASSETS.md, now cropped into public/photos/exterior-day.jpg), no bar/cocktail close-ups,
no undressed apartment interiors, no staff/team, no karaoke or event night
crowd shots at usable resolution.

---

## Open questions for the client

Ordered by how much they block the build.

1. **Appartements** — ✅ **how many is answered**: eleven, with codes (above).
   Still open, and now blocking a page that exists and is running on invented
   data (`PREVIEW` in `lib/apartments.ts`):
   1. **Rates.** Nothing has ever been published. The pages say « tarif sur
      demande » rather than carry a number we made up.
   2. **Types.** Do the units differ — size, sleeps, equipment — or are they
      eleven of the same thing? The preview data pretends they differ.
   3. **Availability.** Is there a list, a book, a spreadsheet? Whatever it is
      is what the status chips have to read from.
   4. **How someone books**, and whether a stay is nightly, monthly or both —
      `#LocationYaoundé` suggests longer lets than "stay the night" implies.
   5. **Photography.** All eleven pages currently show the same seven images of
      a different building. See the licence question below.
2. **Vector logo** — AI/EPS/SVG from the designer.
3. ~~**The menu document**~~ — ✅ **FOUND** and transcribed into `lib/menu.ts`
   (10 sections, ~60 dishes), live at `/fr/carte` · `/en/menu`. What remains:
   1. **Are the février 2026 prices still current?**
   2. **Is there a drinks list?** All four pages are food. For a lounge selling
      cocktails and bottle service this is the conspicuous gap.
   3. Three lines where the artwork contradicts itself — run
      `pendingQueries()` for the current list, or read them here:
      - **Gambas royal** is printed « 12 00FCFA ». Read as 12 000; confirm.
      - « **Penne arrabiata** » appears twice, at 3 500 and at 5 000. The 5 000
        line's description is a choose-your-sauce dish, so it is listed as
        « Pâtes, sauce au choix ». Confirm the name and price.
      - The **Texan burger** appears twice with identical composition, at 3 500
        and 4 000. Listed once at 3 500. Confirm which is right.
4. ~~**150 m or 300 m**~~ — effectively settled at **300 m**: every post since
   2026-07-25 and their own August flyer say so. Confirm in passing.
5. **Which phone number and email** go on the site? The evidence now favours
   `652 81 **45** 49` (their own August flyer plus three recent posts) over
   `46 49` (the Facebook intro field). Ask them to confirm `45 49` **and fix
   the Facebook intro field**, which is probably the stale one.
6. **Closing time** — and confirm whether apartments really are 24h/24 while the
   restaurant is 10h–late.
7. **Current weekly programme and start times** — is Lundi a night? Is Sunday
   Brunch coming back?
8. **Original photography**, especially apartments and the bar. (A daytime exterior now exists — a proper facade shoot would still beat the overcast phone snapshot we cropped.)
   ⚠️ **Where did the eight studio images come from?** All eight are
   `origin: "placeholder"` in `lib/photos.ts` and captioned wherever they
   render, but they arrived from two different places and the licence question
   is not the same for both.

   - **The seven gallery frames** (`studio_living` … `studio_balcony`),
     supplied 2026-08-09 to preview the pages. Professional interiors of a
     modern European apartment — wall radiators, French windows, a suburban
     tower block through the balcony door — so they are not the Glen and the
     licence is **unknown**. The studio pages are `noindex`.
   - **The banner plate** (`studio_hero`), added 2026-08-11 at the client's
     direction. Source file `huy-nguyen-AB-q9lwCVv8-unsplash.jpg`, kept at
     `assets-raw/unsplash/`. The filename is Unsplash's own download format —
     photographer **Huy Nguyen**, photo id `AB-q9lwCVv8` — and the Unsplash
     Licence permits commercial use with no attribution required. So the
     licence here is *probably* fine, which is not the same as checked: nobody
     in this repo saw it downloaded. **Confirm the source**, and credit Huy
     Nguyen anyway if the site gains a colophon — it costs nothing and it is
     what the licence asks for even where it does not require it.

   This one is also the first placeholder to reach an **indexed** page: it is
   the « Appartements » slide in the home hero. That is why `Slide.illustrative`
   exists — it is simultaneously the permission and the caption, so the picture
   cannot appear there without the sentence. See `lib/banner.ts`.

   **Before launch, for all eight**: either a real shoot, or written proof of a
   licence that permits commercial use.
9. Event packages — capacity and pricing for private hire.
10. Is there **delivery**?
11. Site language: French only, or French + English for travellers?
12. Preferred domain name.
13. Merge or delete the duplicate Facebook page?
