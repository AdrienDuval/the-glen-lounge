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

### Phone numbers — ⚠️ six variants published

| Number | Where | Note |
| --- | --- | --- |
| **+237 691 24 65 90** | TT reservations (Nov 2025 → Aug 2026), FB intro | Most consistent — appears across the whole timeline |
| **+237 652 81 46 49** | TT Nov 2025, FB intro | |
| +237 652 81 **45** 49 | TT Jul–Aug 2026 | ⚠️ One digit off the above. Since `46 49` appears in both the oldest TikTok posts *and* the current FB page, `45 49` is **probably a recent typo** — confirm |
| +237 696 81 70 30 | IG bio | |
| +237 699 96 65 65 | FB contact field | |
| +237 691 51 35 16 | FB WhatsApp | |

**Working assumption**: the booking line is **691 24 65 90 / 652 81 46 49**.
No email address is published anywhere. ⚠️

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
- ⚠️ A **menu with a price grid exists on video** (TT 2026-02-01: « découvre nos
  menus variés et une grille de prix qui fait plaisir »). Ask for the document —
  it is the fastest route to a real menu page.
- ⚠️ « on livre le bonheur en parts égales » (pizza post) *might* indicate
  delivery, but it reads as wordplay. **Do not claim delivery** without asking.

### Appartements ✅ (more than first thought)
- « **Glen Appartement – meublé haut standing** » — furnished, high-standard.
- « **disponibilité 24h/24, tous les jours** », « Confort, sécurité, intimité ».
- Marketed for **location** (rental) — `#AppartementMeublé` `#LocationYaoundé`.
- « Réserve maintenant avant que ce soit complet ! » — implies limited stock.
- **Saint-Valentin packages** with reductions, incl. a room dressed with rose
  petals, candles and balloons (photographed — `public/photos/apartment-valentine-*`).
- ⚠️ Still unknown: **how many units, what types, what rates, how to book.**
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

### One-off events seen
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

⚠️ **Gaps in the photography**: no daytime exterior, no bar/cocktail close-ups,
no undressed apartment interiors, no staff/team, no karaoke or event night
crowd shots at usable resolution.

---

## Open questions for the client

Ordered by how much they block the build.

1. **Appartements** — how many, what types, what rates, how does someone book?
   (Blocks the highest-value page on the site.)
2. **Vector logo** — AI/EPS/SVG from the designer.
3. **The menu document** with the price grid (it exists — it's in a video).
4. **150 m or 300 m** from the école publique de Mfandena?
5. **Which phone number and email** go on the site? Is it `652 81 45 49` or
   `652 81 46 49`?
6. **Closing time** — and confirm whether apartments really are 24h/24 while the
   restaurant is 10h–late.
7. **Current weekly programme and start times** — is Lundi a night? Is Sunday
   Brunch coming back?
8. **Original photography**, especially apartments, the bar, and a daytime exterior.
9. Event packages — capacity and pricing for private hire.
10. Is there **delivery**?
11. Site language: French only, or French + English for travellers?
12. Preferred domain name.
13. Merge or delete the duplicate Facebook page?
