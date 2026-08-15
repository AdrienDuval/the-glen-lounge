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
  `SS130-A` · `SS140-A` · `SS101-A` · `SS110-A`. ⚠️ The codes look like they
  encode a building and a floor (`A10-*` reads as one unit split three ways) —
  unconfirmed, so nothing in the UI interprets them.

  ⚠️ **THIS LIST IS THE INVENTORY; `lib/apartments.ts` IS NOT.** That file holds
  only the units we can document. It was cut to **two** on 2026-08-12, because
  the nine others had nothing but a code and were being rendered with invented
  surfaces, couchages and availability under two disclaimers; those nine rows and
  both disclaimers were removed. Four have since come back **properly** — with a
  sheet and their own media, never from git history:

  | | Listed as | Sheet |
  | --- | --- | --- |
  | `SS101-A` | `SS101` | 2026-08-11 |
  | `SS140-A` | `SS140-A` | 2026-08-12, « comme le SS101 » |
  | `A10-2-A` | `A10-2` | 2026-08-12, shared |
  | `A10-3-A` | `A10-3` | 2026-08-12, shared |
  | `B35-A` | `B35` | **2026-08-13** |
  | `A10-A` | `A10` | **2026-08-13** |

  **Five still undocumented:** `ST005-A` · `B15-A` · `A10-1-A` · `SS130-A` ·
  `SS110-A`.

  So the site says « onze studios » in the banner and the studios lede (true of
  the building, sourced here) while the index grid shows **six**
  (« logements présentés »). That gap is deliberate and documented in both files —
  do not "fix" it by re-inventing the five rows. **The codes above are the only
  record of them; restore a row from a client sheet, never from git history.**

  ⚠️ **Six listings, but not six separate spaces.** `A10` is the apartment that
  `A10-2` and `A10-3` are bedrooms inside, so the same floor area is now offered
  twice — whole at 150 000 FCFA, or one bedroom at 30 000 — and all three are
  « libre ». Harmless while enquiries go to a human on WhatsApp; a booking engine
  would have to know these three rows share a space.

  ⚠️ Note the listed codes drop the `-A` suffix, following what the client
  actually writes on each sheet. The mapping above is the only place the two
  spellings are reconciled.
- « Réserve maintenant avant que ce soit complet ! » — implies limited stock.
- **Saint-Valentin packages** with reductions, incl. a room dressed with rose
  petals, candles and balloons (photographed — `public/photos/apartment-valentine-*`).
- ✅ **SS101 — the first unit confirmed end to end** (`CL`, 2026-08-11, filled
  characteristics sheet + five photographs of the actual rooms). Live in
  `lib/apartments.ts` with `confirmed: true`:

  | | |
  | --- | --- |
  | Type | studio entier |
  | Étage | sous-sol **R-2** |
  | Surface | **48,72 m²** (as given — a decimal, not rounded) |
  | Chambres / douches | 1 / **2** |
  | Salon · cuisine · balcon | oui · oui · oui |
  | Couchages | 2, un grand lit |
  | Statut | libre |
  | **Tarif** | **60 000 FCFA la nuit** — the first rate this project has ever held |
  | Équipements | clim, Wi-Fi, TV, Canal+, frigo, micro-ondes, ustensiles, eau chaude, draps et serviettes, balcon, accès 24h/24 |
  | Absent, confirmed « non » | ventilateur, machine à laver |

  ⚠️ Left blank on the sheet and still open: **weekly rate, monthly rate,
  caution.** Nothing multiplies the nightly figure anywhere in the UI because a
  monthly rate probably exists and we have not been told it.

  ⚠️ **No bedroom photograph** was sent, though the sheet says 1 chambre. The
  five frames are salon, cuisine, two salles d'eau, balcon. Worth asking.

  ⚠️ **She wrote « SS101 »; the 2026-08-09 code list says `SS101-A`.** The row
  and its URL now use `SS101` / `/fr/appartements/ss101`, following the newer
  and more specific answer. If the `-A` suffix is real, this is a rename.

- ✅ **SS140-A — the second unit confirmed end to end.** Five photographs
  (`CL`, 2026-08-11, sent alongside SS101's) at
  `public/photos/studios/ss140/`, then (`CL`, 2026-08-12) the answer that
  settles the specs: **it has the same informations and caractéristiques as
  SS101, including the tarif.**

  So SS140-A carries SS101's whole sheet — sous-sol R-2, **48,72 m²**, 1 chambre,
  **2 douches**, salon · cuisine · balcon, 2 couchages / grand lit, libre,
  **60 000 FCFA la nuit**, and the same équipements including Canal+.

  Implemented as a **shared spec object** (`SS101_SPEC` in `lib/apartments.ts`)
  that both rows spread, rather than two hand-copied rows. The client's answer
  was « the same as SS101 », so the code says that literally: correct the sheet
  once and both pages move together. Two copies would eventually disagree
  silently — both pages would still render, just quoting different rates.

  | | |
  | --- | --- |
  | Frames | salon, chambre, cuisine, salle d'eau, balcon |
  | Shown in the photographs | separate salon **and** separate bedroom; split clim in both; TV murale in both; cuisine équipée with plaque gaz, micro-ondes, cafetière, frigo, égouttoir garni; **one** salle d'eau with chauffe-eau Ariston; balcon with garde-corps vitré; draps et serviettes |
  | Stated by the client, not photographed | the **second douche**, **Canal+**, the **48,72 m²** surface, « libre », the rate |

  ⚠️ **The frames show ONE shower room; the spec says two.** SS101 photographed
  both of its douches; SS140-A's fifth frame went to the bedroom instead. This is
  the one spec on the page a visitor can count and find wanting — if they ask,
  the second is unphotographed, not absent. Worth requesting a sixth frame.

  ⚠️ **48,72 m² is a measurement of SS101** carried across on « mêmes
  caractéristiques ». It reads more precisely than it was probably meant — two
  rooms are rarely identical to the cm². Worth confirming the surface for this
  unit specifically rather than by reference.

  ⚠️ **No walkthrough video.** SS101's `visite.mp4` is a clip *of SS101*, so
  SS140-A deliberately does not reuse it — that would show a different unit's
  rooms under this unit's code. Ask for a clip of this unit.

  ⚠️ `ss140_salon` is also the **banner plate** (`STUDIO_HERO`) on the studios
  index and the « Appartements » home-hero slide, replacing a stock photo. So
  this one frame now fronts the accommodation offer across the site.

  ⚠️ Presentation note: despite the identical spec, SS140's fit-out is **visibly
  newer than SS101's** — green velvet suite, marbled porcelain, gloss kitchen
  units. Same characteristics on paper is not the same room to look at, so
  neither unit's photographs should be used to stand for « the range ».

- ✅ **A10-2 and A10-3 — and the model changes underneath them.** One sheet
  (`CL`, 2026-08-12) headed « Code / Nom : **A10-3 and 2** », answered once for
  both units. Type: « **chambre seule dans un appartement** ».

  | | |
  | --- | --- |
  | Étage | **R+1** |
  | Surface | 10 m² |
  | Douches / salon / cuisine / balcon | 1 / non / non / non |
  | Couchages | 2, un grand lit |
  | Statut | libre |
  | **Tarif** | **30 000 FCFA la nuit** |
  | Équipements | clim, Wi-Fi, TV, frigo, eau chaude, draps et serviettes |
  | Confirmed « non » | ventilateur, micro-ondes, machine à laver, ustensiles |

  **This is what the `A10-*` code pattern meant all along.** The original list
  had `A10-A` plus `A10-1-A`, `A10-2-A`, `A10-3-A`, flagged above as looking
  like « one unit split three ways ». Confirmed: **A10 is one apartment and the
  numbered codes are its bedrooms, let individually.**

  Consequences carried into the site:
  - `Studio.kind` is new — `"whole"` vs `"room"`, with `parentCode` for the
    apartment a room sits in. The site called everything a « studio »; a 10 m²
    bedroom with no kitchen and a shared front door is not one, and a visitor
    misled by the noun alone would only find out on arrival. The type now leads
    the spec table, appears in the masthead, and appears on the index card.
  - The index heading and count moved from « studios » to « **logements** »,
    since the list is now mixed.
  - `floorLabel` learned **`R+N`** — it previously printed « Étage R+1 ».
  - `ReserveStudio` says « Demander cette chambre » for a room.

  ⚠️ **« Creoling : oui »** — the fifth equipment line, which on the fiche we
  sent is the **Canal+** slot. Every other line matches its label exactly, so
  position says Canal+ and the word does not. **Not recorded** as an amenity:
  advertising a subscription package she may not have meant is a claim we
  cannot support. **Ask her.**

  ⚠️ **No photographs — the three stills are frames decoded from the
  walkthrough clip** (Chromium → canvas, at 3.2s / 4.9s / 11.8s). Real footage
  of the real room, so no illustration caption, but **356×640** and visibly soft
  where the gallery shows them large. Interim at the client's request. Ask for
  stills.

  ⚠️ **One clip, two units.** She placed the **same video file** in both the
  A10-2 and A10-3 folders — byte-identical, verified by hash — so both listings
  currently show the same rooms. Whether the two rooms are genuinely
  interchangeable or the clip was simply duplicated when sending is **not
  established**. Ask before anyone treats the rooms as identical.

  ⚠️ Weekly rate, monthly rate and caution left blank **again**. Three sheets in,
  none of the three has ever been answered.

  ✅ *Resolved 2026-08-13:* the media for the **whole** apartment A10 that sat
  unused on disk (3 photos + 4 clips) got its sheet and is now listed — see the
  `A10` entry below. It was in exactly B35's state, and unlocked the same way.

- ✅ **B35 — the biggest unit, and the first with two bedrooms.** Sheet (`CL`,
  2026-08-13), headed « Code / Nom : **B35** ». Type: « **appartement entier** ».
  Media had been sitting on disk unused since 2026-08-11; the sheet is what
  unlocked it. Listed as **`B35`** (slug `b35`) — the sheet's own code, matching
  how `A10-2` / `A10-3` were taken from theirs rather than from the `-A` suffixed
  inventory list, where it appears as `B35-A`.

  | | |
  | --- | --- |
  | Étage | **sous-sol R-1** |
  | Surface | **95,72 m²** |
  | Chambres | **2** |
  | Douches / salon / cuisine / balcon | **3** / oui / oui / oui |
  | Couchages | **4**, un grand lit |
  | Statut | libre |
  | **Tarif** | **120 000 FCFA la nuit** |
  | Équipements | clim, Wi-Fi, TV, **Canal+**, frigo, micro-ondes, eau chaude, ustensiles, draps et serviettes |
  | Confirmed « non » | ventilateur, machine à laver |

  Twice SS101's floor area, double its rate, and the only listing with more than
  one bedroom — the 4 couchages rest on that. Its fit-out is a **third** distinct
  one again (black buttoned leather, cherry-wood bedsteads and wall units, heavily
  veined black-and-white porcelain), which is one more reason no single unit's
  photographs can stand for « the range ».

  ⚠️ **3 douches claimed, 2 now photographed** (was 1). A third clip on
  2026-08-13 supplied `b35_douche_2` — a rounded corner cubicle in ochre-and-blue
  marble, plainly a different room from `b35_douche`'s square black-and-white one.
  One still unphotographed. Narrowed, not closed.

  ⚠️ **AND IT BROUGHT A THIRD BEDROOM, AGAINST A SHEET THAT SAYS « 2 chambres ».**
  The same 6.2s clip shows a bedroom that is **not** either of the two already
  photographed and **not** a re-dressing of one: its bed has a buttoned,
  upholstered headboard and footboard where both others have plain curved wood,
  and the ceiling and window differ again. Furniture does not change between
  shoots.

  So either the sheet is short by one room, or **the clip is of a different unit
  altogether** — the fit-outs in this building are close enough that the
  photographs cannot settle it, and this clip's tiling is the same ochre-and-blue
  range as A10's `a10_appt_douche`. Shipped as `b35_chambre_3` on the owner's
  instruction, 2026-08-13; **`rooms: 2` was NOT changed** — that stays her word.
  **This needs asking before anyone relies on it.**

  ⚠️ **A near miss worth writing down.** The two files dropped into
  `public/photos/studios/b35/` that day arrived *instead of* `visite.mp4`, which
  vanished with them and left B35's gallery pointing at a 404. And one of the two
  (`15.50.07`) was **byte-identical to `a10-chambres/visite.mp4`** — the A10
  bedrooms walkthrough already serving A10-2 and A10-3 — so publishing it under
  B35 would have put another unit's rooms on a 120 000 FCFA listing. Caught by
  hashing before anything was wired up. `visite.mp4` was restored from
  `assets-raw/`, which is exactly why raw drops belong there first: nothing in
  `public/photos/studios/` should ever be the only copy of a file.

  ⚠️ **No kitchen photograph, though the sheet says « cuisine : oui ».** The only
  evidence is a frame decoded from her second clip at 37.2s. It shows the wall
  units, sink, water dispenser and hob, so the answer is corroborated — but at
  **642×360** it is the **softest frame on the site**. **Ask for a kitchen photo.**

  ⚠️ **Her second clip plays sideways.** Of the two she sent, the 15s bathroom
  walkthrough ships as `visite.mp4`; the 47s one (kitchen, corridor, exterior)
  carries a **90° rotation matrix** and renders rotated in a browser, so it is
  **held, not served**. The kitchen still was transposed upright out of it with a
  lossless rotate. **Ask her to re-send it upright** — it is the most complete
  footage of the unit that exists.

  ⚠️ Weekly rate, monthly rate and caution left blank **again**. Four sheets in,
  none of the three has ever been answered.

  ✅ **THE NOUN — FIXED 2026-08-13.** It was wrong at the top end and this unit
  is where it broke: her sheet says « **appartement** entier » and the page
  printed « **Studio** entier », because `kind: "whole"` had exactly one label.
  « Demander ce studio » sat on a 120 000 FCFA enquiry panel, and the WhatsApp
  message *she* received said « réserver le studio B35 ».

  `UnitKind` is now `"apartment" | "studio" | "room"` and the noun is
  **transcribed from each sheet, never derived** — a rule like « 2 chambres →
  appartement » fits today's three sheets and would invent the word for the five
  undocumented codes. B35 and A10 are `apartment` on her own wording; SS101 is
  `studio` on hers. Everywhere the site talks about units *in general* it now
  says « **logement** », which stays true whichever way the two open questions
  below are settled.

- ✅ **A10 — the whole apartment, and now the largest and dearest listing.**
  Sheet (`CL`, 2026-08-13), headed « Code / Nom : **A10** ». Type: « **appartement
  entier** ». Media had been on disk unused since 2026-08-11 (flagged two entries
  above); the sheet unlocked it, exactly as with B35 the same day. Listed as
  **`A10`** (slug `a10`); the inventory list calls it `A10-A`.

  | | |
  | --- | --- |
  | Étage | **sous-sol R-1** |
  | Surface | **130 m²** |
  | Chambres | **2** |
  | Douches / salon / cuisine / balcon | **4** / oui / oui / oui |
  | Couchages | **8**, un grand lit |
  | Statut | libre |
  | **Tarif** | **150 000 FCFA la nuit** |
  | Équipements | clim, Wi-Fi, TV, **Canal+ au salon**, frigo, micro-ondes, eau chaude, ustensiles, draps et serviettes |
  | Confirmed « non » | ventilateur, machine à laver |
  | Not recorded | « **Creoling** dans la chambre : oui » — see below |

  ⚠️ **IT IS THE PARENT OF `A10-2` AND `A10-3`.** Those two rows are bedrooms let
  individually inside this apartment. The site now offers the same floor area
  twice — whole at 150 000, one bedroom at 30 000 — with all three « libre ». Safe
  only because nothing takes a booking; **tell the client the site now lists
  both**, and see the warning in the inventory table above.

  ⚠️ **THE FLOOR CONTRADICTS THE ROOM SHEET.** This sheet says « sous sol R-1 »;
  the A10-2 / A10-3 sheet said « **R+1** » for bedrooms *inside this same
  apartment*. Both cannot be true. Each row carries its own sheet's answer, left
  unreconciled. **Ask her which is right — it is the first question on this unit.**
  ⚠️ The photographs settle nothing: the frames look out over neighbouring roofs,
  which reads as an upper storey, but SS140-A is on **R-2** with the very same
  view, because the building is cut into a slope. Do not "correct" it from the
  pictures.

  ⚠️ **« 2 chambres » sits badly with the code list**, which has `A10-1-A`,
  `A10-2-A` *and* `A10-3-A` — three numbered rooms in an apartment she says has
  two bedrooms. Ask.

  ⚠️ **« 8 personnes » on 2 chambres and one « grand lit ».** Sleeping eight
  implies bedding neither the photographs nor `BedType` can express. `sleeps: 8`
  stands on her word; the literie line reads « Un lit double », which is all she
  told us. Worth asking what the other six sleep on.

  ⚠️ **« Machine à laver : non », but a washing machine is plainly in the kitchen
  clip.** The site follows the sheet — `laundry` is **not** advertised — because
  promising a machine she says is unavailable is the expensive direction to be
  wrong in. **Ask.**

  ⚠️ **« Balcon : oui » is evidenced only by a service terrace.** The one outdoor
  space filmed is a narrow drying terrace in bare render with a folding airer —
  not the marble-and-glass balconies SS101 and B35 photographed. The amenity chip
  stays on her word; the frame ships last so the word is not all a visitor gets.

  ✅ **« Creoling » is NOT her word for Canal+ — question closed.** The A10 room
  sheet had « Creoling » sitting in the Canal+ slot and it could not be read. This
  sheet prints **both** lines — « Canal+ au salon : oui » *and* « Creoling dans la
  chambre : oui » — so they are two different things in her own hand. `canalPlus`
  is recorded here, where she named it, and stays correctly off the room rows,
  which have no salon. **What « Creoling » actually is remains unknown**, so
  nothing advertises it.

  ⚠️ **ALL FOUR CLIPS PLAY SIDEWAYS, so none ships.** B35's second-clip problem,
  four times over — every one reports portrait dimensions with the picture on its
  side (verified by screenshotting a real `<video>`, not inferred from the
  container). Held in `assets-raw/whatsapp/a10/`. Two of the four (16.23.48 and
  16.24.04) are the **same** kitchen-and-terrace walkthrough sent twice — different
  bytes, same footage. **Ask her to re-send them upright**; A10 is the only listing
  with no video at all.

  ⚠️ **THE WEAKEST GALLERY ON THE SITE, ON THE MOST EXPENSIVE UNIT.** Her three
  photographs are **540×960** — half the 1080px long edge every other unit sent —
  and arrived **sideways with no EXIF orientation**, so they ship transposed to
  960×540. The other five frames were decoded out of the clips at **640×360**,
  below even the A10 rooms' 356×640. **Real photographs of A10 are the single
  highest-value asset request outstanding.**

  ⚠️ **1 of 2 bedrooms and 1 of 4 shower rooms photographed** — the same gap as
  SS140-A and B35, now the largest. The page states 2 and 4 on her word.

  ⚠️ Weekly rate, monthly rate and caution left blank **again**. Five sheets in,
  none of the three has ever been answered.

  ✅ **THE NOUN — FIXED 2026-08-13**, on the day this unit made it unignorable:
  A10 is 130 m², two bedrooms, 8 couchages, and the page called it a « Studio
  entier » with « Demander ce studio » over **150 000 FCFA**. It is now
  « **Appartement A10** » throughout, from the `<h1>` to the prefilled WhatsApp
  message. See the B35 entry above for the model.

  ⚠️ **THE FLOOR CONTRADICTION IS NOW GATED IN THE UI.** The related band at the
  foot of a unit page stacks A10 and its two bedrooms in one viewport, which
  would have shown a visitor « Sous-sol 1 » and « Étage 1 » for one flat, side by
  side. `StudioCard` takes `showFloor={false}` for family cards so neither is
  printed there; both remain on their own pages, each from its own sheet.
  **Delete that gate the day she answers** — it is a plaster on an open
  question, not a decision.

- ✅ **The building services**, answered once for the whole property
  (`CL`, 2026-08-11): gardien, vidéosurveillance, groupe électrogène, réserve
  d'eau, parking, ménage compris — all six **oui**. Stored once in
  `BUILDING_SERVICES` and rendered on every studio page.

- ✅ **THE STUDIOS ARE IN THE SAME BUILDING AS THE RESTAURANT** (`CL`,
  2026-08-11). This closes the question flagged below since the first harvest.
  The `SS` prefix on four codes reads as « sous-sol », which corroborates it —
  SS101 is on R-2. Copy may now say so; « au-dessus du lounge » is still not
  sourced, only « même immeuble ».

- ⚠️ Still unknown for the other ten units: **types, rates, availability.**
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

#### ⚠️ Vocabulary: use the client's words, not French-agency words

Recorded 2026-08-14 after **a Cameroonian reader reported the studio
« Caractéristiques » table as confusing** — specifically that they could not tell
what « Salles d'eau » meant. It had been drafted in French property-listing
register, which does not carry in Cameroon.

The audience is Cameroonian French. When the client's sheet has a word for
something, **that word wins** — it is both clearer to the reader and traceable.

| Was | Now | Why |
| --- | --- | --- |
| Salles d'eau | **Douches** | The sheet says « douches ». « Salle d'eau » is an agency term of art (shower room vs. « salle de bain » with a tub). This is the row that prompted the complaint. |
| Salle d'eau privative | **Douche privée** | The amenity chip has to match the spec row, or one screen names the room two ways. |
| Literie | **Lit** | « Literie » is the bedding, not the bed. |
| Un lit double | **Un grand lit** | The sheet's own phrase. |

Also fixed in the same pass: the table had **eleven rows, four of which repeated
the identity line right above it** (chambres · surface · couchages · étage), so
the rows carrying new information were buried. `unitLine` now owns those four and
the table owns only what it cannot say — down to 5–6 rows. ⚠️ This reversed an
explicit « do not thin it out » note in `StudioPage.tsx`; the reversal and its
reasoning are recorded there. **The table is therefore no longer a full
transcript of the sheet — FACTS.md is where that completeness lives.**

The same alt-text noun was corrected across all six units' shower photographs in
`lib/photos.ts`.

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

1. **Appartements** — ✅ eleven units with codes, and **six now documented end to
   end and fully specified** (SS101 from its sheet; SS140-A confirmed identical,
   rate included; A10-2 and A10-3 from one shared sheet; B35 and A10 from their
   own). No invented data remains in `lib/apartments.ts` and all six pages list
   completely — but **five of the eleven units are still invisible to visitors**,
   which is the cost of that honesty and the reason this stays first:
   1. **A10's floor — R-1 or R+1?** Its own sheet says « sous sol R-1 »; the
      sheet for A10-2 / A10-3, bedrooms *inside it*, says « R+1 ». Both cannot be
      true, both are published as given, and the photographs cannot settle it.
      **The cheapest correction on the list, and the only live contradiction
      between two client answers.**
   2. **The characteristics sheet for the other five** (`ST005-A` · `B15-A` ·
      `A10-1-A` · `SS130-A` · `SS110-A`) — the single highest-value thing they
      can send, and a cheap ask: if any of them are « comme le SS101 », saying so
      is enough to publish them, exactly as SS140-A was. One sheet *or* one such
      sentence, plus media, per unit.
   3. **Real photographs of A10.** It is the dearest listing at 150 000 FCFA and
      has the **weakest gallery**: three 960×540 stills that arrived sideways,
      plus five 640×360 video frames. Every other unit sent 1080px.
   4. **A10's four clips, re-sent upright** — all four play sideways, so A10 is
      the only listing with no video at all. (Two of the four are the same
      walkthrough sent twice.)
   5. **Weekly and monthly rates, and the caution.** Left blank on **all five**
      sheets, so they are missing for every live unit. `#LocationYaoundé`
      suggests longer lets, and nothing in the UI multiplies the nightly figure.
   6. **The unphotographed douches.** SS140-A states 2 and shows 1; B35 states 3
      and now shows 2; **A10 states 4 and shows 1**, and 2 chambres showing 1. It
      is the one spec on those pages a visitor can count. Also **Canal+** is
      stated on three and photographed on none.
   7. **⚠️ DOES B35 HAVE A THIRD BEDROOM — OR IS THAT CLIP ANOTHER UNIT?** Her
      sheet says « 2 chambres »; the clip she sent 2026-08-13 shows a third,
      distinct room (buttoned upholstered bedstead, different ceiling and
      window). It is live on the page as `b35_chambre_3` while the spec table
      still reads « Chambres 2 », so the two disagree in one viewport. **The
      highest-priority apartment question on this list.**
   8. **Does A10 have a washing machine?** Its sheet says « non »; one is plainly
      in its kitchen clip. The site follows the sheet.
   9. **Does A10 really sleep 8?** Two bedrooms and « un grand lit » on the sheet.
      Ask what the other six sleep on.
   10. **Is A10's « balcon » the service terrace?** The only outdoor space filmed
      is a narrow drying terrace in bare render, not a balcony like SS101's.
   11. **A kitchen photograph of B35.** « Cuisine : oui » is on the sheet and the
      only evidence is a 642×360 video frame.
   12. **B35's second clip, re-sent upright.** The 47s one (kitchen, corridor,
      exterior) carries a 90° rotation matrix and plays sideways, so it is held
      rather than served. It is the most complete footage of that unit we hold.
   13. **Confirm SS140-A's surface directly.** 48,72 m² is SS101's measurement
      inherited via « mêmes caractéristiques »; two rooms are rarely identical
      to the cm².
   14. **A walkthrough clip of SS140-A.** SS101 and B35 have one; SS140-A
      deliberately does not reuse either.
   15. **Are A10-2 and A10-3 really interchangeable?** She sent one clip for both,
      byte-identical, so both pages currently show the same rooms.
   16. **What « Creoling » is.** ✅ No longer confusable with Canal+ — the A10
      sheet prints both lines separately — but the word itself is still unknown,
      so nothing advertises it.
   17. **Is SS140-A a studio or an apartment?** Its « studio » is inherited from
      SS101's sheet via « les mêmes informations et caractéristiques » — a word
      she wrote about a *different* unit. The site now prints the noun at display
      size (« Studio SS140-A »), so it is worth one line of confirmation.
   18. **And SS101 itself?** 48,72 m² with 1 chambre, salon, cuisine and
      2 douches is a T2 by French convention, but her sheet says « studio
      entier ». We follow her word; confirm before launch.
   19. **Letting A10 whole vs. by the room.** The site now lists the apartment
      *and* two of its bedrooms, all « libre ». Confirm she wants both offered.
   20. **Availability** — is there a list, a book, a spreadsheet? Whatever it is
      is what the status chips have to read from. All six units currently say
      « libre » because the sheets did; that will date.
   21. **How someone books**, and whether a stay is nightly, monthly or both.
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
   ~~⚠️ **Where did the eight studio images come from?**~~ ✅ **MOOT as of
   2026-08-12 — all eight were deleted from `lib/photos.ts`.** They were the
   seven gallery frames (`studio_living` … `studio_balcony`, supplied 2026-08-09,
   a modern European apartment, licence **unknown**) and the banner plate
   (`studio_hero`, an Unsplash file by **Huy Nguyen**, id `AB-q9lwCVv8`, whose
   licence permits commercial use but which nobody in this repo saw downloaded).

   They existed to preview nine units nobody had photographed. Those units are
   now unlisted and the two documented ones carry their own frames, so
   **`lib/photos.ts` contains no `origin: "placeholder"` images at all** and this
   launch blocker is closed — no shoot needed for it, no licence to chase.

   The files still sit in `public/photos/studios/studio-*` and
   `assets-raw/unsplash/`; deleting them is safe housekeeping. ⚠️ Do **not**
   reintroduce them: an unlisted unit is a better answer than a borrowed
   photograph. `Slide.illustrative` and the `isPlaceholder` gate in
   `activeSlides()` are deliberately kept so that if one ever returns it fails
   loudly rather than shipping uncaptioned.
9. Event packages — capacity and pricing for private hire.
10. Is there **delivery**?
11. Site language: French only, or French + English for travellers?
12. Preferred domain name.
13. Merge or delete the duplicate Facebook page?
