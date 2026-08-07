# Asset harvesting — what works, what doesn't

Findings from **2026-08-05**. Re-test before assuming any of this still holds;
the platforms change their walls often.

## Summary

| Source | Public access | Verdict |
| --- | --- | --- |
| **TikTok** `@the.glen.lounge` | ✅ Open, no login | **Harvested** — 114+ posts, video + images + captions |
| **Instagram** `@the_glen_lounge` | ❌ Login wall | Needs a session cookie, or manual download |
| **Facebook** page | ✅ **Open again as of 2026-08-07** | **Harvested** — 43 photos, no login. See below |
| Google Maps / TripAdvisor / Booking | ❌ Not listed at all | Nothing to harvest — see SEO note below |

## TikTok — works, no credentials

The tooling is already installed (`pip install gallery-dl yt-dlp`). Re-run the
harvest at any time:

```powershell
$py = "C:\Users\nricher\AppData\Local\Programs\Python\Python312\python.exe"
& $py -m gallery_dl --write-metadata -d .\harvest "https://www.tiktok.com/@the.glen.lounge"
```

Each post yields the media plus a JSON sidecar containing the full caption
(`desc`), `createTime`, and `stats` (plays, likes, comments, shares). Those
captions are the single best source of truth we have — they carry the opening
hours, the weekly programme and the marketing voice.

## Facebook — OPEN as of 2026-08-07 (re-test paid off)

The 2026-08-05 finding that Facebook served a login wall **no longer holds**.
The photos tab enumerates and downloads anonymously — no cookies, no
authenticated session, so none of the ToS/rate-limit caveats below apply.

```powershell
$py = "C:\Users\nricher\AppData\Local\Programs\Python\Python312\python.exe"
& $py -m gallery_dl --write-metadata --sleep 1-2 -d .\assets-raw\facebook `
     "https://www.facebook.com/people/The-Glen-Lounge/61580468213620/?sk=photos"
```

**43 photos, 7.1 MB, 43 JSON sidecars** in `assets-raw/facebook/` (git-ignored).
21 are ≥1400 px on a side. Sidecars carry `caption`, `date`, `id` and the CDN
`url`; 36 of the 43 have captions.

Why this was worth doing — it is a materially better haul than the TikTok run:

- **Date range 2025-09-05 → 2026-08-06.** That starts a month *before* the first
  TikTok post (2025-10-03) and ends a day *after* the TikTok harvest.
- **The menu, in full.** Four pages with a complete FCFA price grid — the item
  FACTS.md ranked as the highest-value missing document. Posted 2026-02-01.
- **A live dated event**, with a flyer: Bal des Vétérans, 23 août.
- **A much better logo copy.** The Bal des Vétérans flyer carries the mark
  cleanly on white at usable size — still raster, but far better than the
  439×439 avatar for anyone retracing it. The vector is still the real ask.

Direct anonymous `curl` of the page HTML returns **400**; only `gallery-dl`'s
extractor works. Re-test both before assuming either result still holds.

## Instagram — blocked

Verified with two independent tools:

- `gallery-dl` on the profile → `NotFoundError: Requested user could not be found`
- `gallery-dl` on a single public post → `HTTP redirect to login page`
- Plain HTTP fetch of either profile → JS shell only, no content

Both platforms now serve a login wall to anonymous clients, including for
public posts. There is no way around this without an authenticated session.

### Option A — export a cookies.txt yourself (recommended)

I deliberately did **not** read cookies out of your browser profile; that is
credential material and the permission layer blocked it, correctly. Export it
yourself instead and hand me the file:

1. Install a cookie-export extension — *Get cookies.txt LOCALLY* is the usual
   choice (open source, does not transmit anything).
2. Log into Instagram, click the extension, **Export** → save as `instagram.txt`.
3. Repeat on Facebook → `facebook.txt`.
4. Drop them somewhere outside this repo (they are live credentials — **never
   commit them**; `.gitignore` already excludes `*.txt`? it does not, so keep
   them out of the project folder entirely).

Then:

```powershell
& $py -m gallery_dl --cookies C:\path\to\instagram.txt --write-metadata `
     -d .\harvest "https://www.instagram.com/the_glen_lounge/"
```

⚠️ Two caveats worth knowing before you do this. Scraping while authenticated is
against both platforms' terms of service, and heavy automated access from a
logged-in session can get that account rate-limited or restricted. If you go
this route, use the **venue's own account** rather than your personal one, and
keep the request rate low (`--sleep 3-6`).

### What the TikTok images actually turned out to be

Better than expected, and worth correcting an early assumption: **TikTok photo
posts keep full resolution.** Of the 59 harvested images, 17 are 1440–2160 px
wide (up to **2160×2880**) — genuinely usable for web heroes. The lower-res
files (720–1280 px) are *video cover thumbnails*, not photographs.

So the flyer-and-photo archive is real, usable material. The gaps are about
**coverage**, not quality: no daytime exterior, no bar or cocktail close-ups, no
undressed apartment interiors, no team shots.

### Derived crops (2026-08-07)

Three photographs were blocked because identifiable people appear in them.
Rather than lose the sections that needed them, two were cropped down to the
region that contains no people. Originals are untouched and still marked
`guests` in `lib/photos.ts`; the crops are separate entries marked `clear`.

| Crop | From | What was removed |
| --- | --- | --- |
| `events-04-crop.jpg` | `events-04.jpg` | the buffet line and the lounge area behind it |
| `food-02-crop.jpg` | `food-02.jpg` | the window band with diners visible through the glass |
| `exterior-day-entrance.jpg` | FB `122122525719015607.jpg` (2048×1152 original, not the derived `exterior-day.jpg`) | everything but the entrance tower — 4:5 portrait at (360,120)–(1160,1120), signage legible, seated man far outside the frame. Wayfinding image for the Contact section |

Not croppable: **`events-03.jpg`** — two guests sit mid-frame. Frustrating,
because it is the only usable photograph showing the giant screen with a live
match on it, which is exactly what the « écrans géants » section wants. That
section currently carries itself on typography instead. Clearing this one image
would visibly improve the page.

`events-01.jpg` was also cropped and then discarded: what survived was mostly
tablecloth, and a figure remained at the edge.

### Option B — ask the client for the originals (still worth it)

The things genuinely worth requesting from the client:

1. **Vector logo** (AI / EPS / SVG). The single highest-value item — the best
   copy we have is the 439×439 TikTok avatar, and a mark cannot be faithfully
   recreated from a raster that small.
2. **Apartment photography**, undressed and in daylight. This is the biggest
   coverage gap and the highest-value page on the site.
3. **The menu document** with its price grid — it exists, we have only seen it
   flicker past in a video.
4. **Flyer source files**, if the designer will share them, so recurring event
   art can be reproduced at web resolution.
5. A **daytime exterior** and **bar/cocktail** shots.

## Correction — the daytime exterior already exists (2026-08-07)

Item 5 above is **stale**, and so is the FACTS.md line claiming we hold no
daytime exterior. The Facebook harvest contains one, posted 2026-01-31:

| File | Where | Size |
| --- | --- | --- |
| `122122525719015607.jpg` | `assets-raw/facebook/…/` | **2048×1152** |
| `624764336_122122525725015607_8388170643410023232_n.jpg` | already in `public/photos/` | 960×540 |

The `public/` copy is the smaller one, it kept its raw harvest filename, it is
absent from `lib/photos.ts`, and nothing references it. Use the 2048×1152 one.

It shows the **whole building**: the black marble tower carrying the
« THE GLEN · LOUNGE-RESTO » signage at street level, and above it three floors
of apartment balconies — glass balustrades, split AC units, curtained windows.
The venue's "Restaurant Appartement" pitch in a single honest frame.

A crop of `(500, 120)–(1600, 945)` gives **1100×825**, exactly the 4:3 that the
`Split.module.css` media slot wants, keeps the wordmark legible, and excludes
the seated man at the right edge — so it clears the consent gate as `clear`
rather than `guests`. Verified against a coordinate grid, not estimated.

Caveats: overcast sky, power lines across the frame, phone snapshot rather than
architectural photography.

### Match flyers — rejection SUPERSEDED by client decision (2026-08-07)

First evaluation, same day: the venue's football flyers (Champions League,
El Clásico, Coupe du Monde) were **rejected** for the site because they are
collages of **third-party player photographs** (Mbappé, Vinícius, Raphinha…)
and **official league marks** (UEFA, LaLiga) — imagery the `promo` consent
class does not cover, since footballers are not billed performers the way
K-Tino is on the Bal des Vétérans flyer. That concern was put to the client,
**who decided to publish them anyway**. Their call, recorded here and in
`lib/photos.ts` so the provenance of the decision is never in doubt.

Five unique flyers ship in the Écrans gallery (`public/photos/sport-*.jpg`);
the FB « CL night » copy turned out to be a shorter crop of the TikTok
Newcastle–Barça artwork, so the TikTok copy is the master. The gallery label
frames them as the **archive of past soirées match**, so the hard dates they
carry read as history rather than as upcoming fixtures. The fixture board
stays; it carries the evergreen claim (see CONTRACT.md).

Two lesser finds in the same sweep:

- The **Saint-Valentin flyer** (`122122784865015607.jpg`) carries the logo
  cleanly *and* package pricing — Ndolo 35 000 · Titanique 55 000 · Cupidon
  75 000 · Glen love 100 000 XAF. These are **Valentine's night packages, not
  nightly apartment rates**, so FACTS.md open question #1 stays open.
- The four `apartment-valentine-*` files in `public/` are 1440×1920; Facebook
  holds the same four at **1536×2048**. Re-derive if they are ever reworked.

## Option C — generated imagery ⟶ NOT TAKEN

> **Superseded, 2026-08-07.** Briefly chosen, then reversed the same day in
> favour of shipping the photography already held. **Nothing on the site is
> generated.** The section now runs the real building by day over the three
> Valentine's interiors — see "What actually shipped" below. The prompts are
> kept only as reference in case the question is reopened; do not read them as
> a live plan.

### What actually shipped

- All four `apartment-valentine-*` frames were inspected individually. Every
  one is an empty room — no people — so all four moved from `unverified` to
  `consent: "clear"` and got real bilingual alt text in place of the TODOs.
- `apartment-valentine-01.jpg` and `-02.jpg` were re-derived from the Facebook
  copies at **1536×2048** (byte copy, no re-encode). `-03` and `-04` exist only
  on TikTok and stay at 1440×1920.
- `Appartements.tsx` renders `exterior_day` in the 4:3 slot with a three-up row
  of portrait interiors below it, resolved through `shippable()`. `01` sits out
  as a duplicate angle of `02`.
- `Split.module.css` gained `.stack` / `.thumbs` / `.thumb`, additive so
  Événements keeps the plain `.media` slot. `.reverse` had to learn about
  `.stack` too, since the grid item to order is now the wrapper rather than the
  `.media` frame nested inside it.

Known limitation: all three interiors are the same room on the same Valentine's
night, so the section skews toward the occasion. The copy carries the
year-round claim by itself. Undressed daylight interiors remain the single
highest-value client request.

### The prompts, for reference only

No image model runs in this repo's toolchain. `Pillow` + `numpy` are installed
and handle cropping, tone and white balance (that is how the `*-crop.jpg` files
were made), but a photoreal interior has to come from an external service —
Midjourney, Flux, DALL·E or Firefly. Prompts below; run them yourself and drop
the result in.

### Keep it an illustration, not a claim

The apartments are a real product someone books and sleeps in, and this is the
one page on the site where the gap between picture and reality gets discovered
in person. Three things keep this honest, and they cost nothing:

1. **Caption it** « Image d'illustration » / "Illustrative image". Standard
   practice, and it is the whole difference between illustrating an offer and
   misrepresenting a room.
2. **Record the provenance in `lib/photos.ts`.** The manifest already gates on
   `consent`; it needs a sibling for origin so that in six months nobody reads
   a generated frame as documentary. Suggested: add
   `origin?: "photograph" | "generated"` to the `Photo` type — additive and
   type-safe — and set it on this entry.
3. **Never let it stand alone.** Pair it with the real building exterior above.
   A genuine photo of the actual block plus an acknowledged illustration is
   defensible; an unlabelled generated interior on its own is not.

### Grounding — what the real rooms actually look like

Prompts describe a *tidied, better-lit version of the real room*, not a generic
five-star suite. The smaller the gap, the smaller the problem. From the four
Valentine's frames, the real apartments have:

- Dark stained hardwood bed, tall panelled headboard; matching two-drawer nightstand
- Smooth cream painted plaster walls
- Dark polished tile floor, quite reflective
- Slim flat-screen TV wall-mounted on a bracket
- White split AC unit high on the wall
- Sheer white voile under a heavier taupe drape
- White ceiling crossed by a structural bulkhead
- Modest single-bedroom proportions

The page is near-black (`--ink #06090c`) with gold accents (`--gold #e8bc3e`).
A bright white brochure interior will fight it — every prompt asks for warm,
low-key light so the image sits inside its frame.

### Prompt 1 — the bedroom (the core need)

```text
Interior photograph of a furnished rental apartment bedroom in Yaoundé,
Cameroon. Contemporary Central African urban apartment, modest in scale and
well kept. Dark stained hardwood bed with a tall panelled headboard, crisp
white linen, one folded charcoal throw across the foot. Matching dark wood
nightstand with a small brass lamp casting warm amber light. Smooth cream
painted plaster walls. Dark polished tile floor with soft reflections. Tall
window with sheer white voile and a heavier taupe drape drawn to one side,
warm dusk light beyond. Slim flat-screen television wall-mounted on the side
wall. Discreet white split air-conditioning unit high on the wall. Low warm
lighting, pools of amber against deep shadow in the corners. Calm, private,
unfussy. Editorial accommodation photography, 35mm lens, eye level, natural
perspective, no wide-angle distortion.
```

Midjourney v7 suffix:

```text
--ar 4:3 --style raw --stylize 150 --v 7 --no people, faces, text, lettering, watermark, logo, signage, clutter, fisheye, HDR halo, oversaturation, floor-to-ceiling city windows, snow, marble bathroom
```

### Prompt 2 — the balcony at dusk (most defensible)

The real building genuinely has these balconies, so this one starts closest to
the truth.

```text
Photograph from the balcony of a furnished apartment in Yaoundé, Cameroon at
dusk. Glass balustrade with a slim dark metal handrail, white rendered wall
with black trim. Two simple rattan chairs and a small side table. Warm low
light from inside the apartment spilling through an open sliding door behind
the camera. Green tropical city skyline in the middle distance, soft haze,
last warm light in the sky. Quiet, private, residential. Editorial
accommodation photography, 35mm lens, eye level, natural perspective.
```

```text
--ar 4:3 --style raw --stylize 150 --v 7 --no people, faces, text, lettering, watermark, logo, clutter, fisheye, HDR halo, oversaturation
```

### Prompt 3 — bedside detail (lowest risk)

Shows no room layout, so it misrepresents least. If any single frame is going
to ship, this is the safest one.

```text
Close detail photograph in a furnished apartment bedroom at night. A dark wood
nightstand, a small brass lamp lit warm, a folded white towel, a set of keys
on a leather tray, one glass of water. Crisp white bed linen out of focus
behind. Dark polished tile floor edge in frame. Very low warm lighting, deep
shadow, single amber source. Shallow depth of field, 50mm lens, editorial
hospitality photography.
```

```text
--ar 4:3 --style raw --stylize 120 --v 7 --no people, faces, text, lettering, watermark, logo, clutter, oversaturation
```

### Running them

| Service | Aspect ratio | Notes |
| --- | --- | --- |
| **Midjourney v7** | `--ar 4:3` | Use the suffixes above verbatim. `--style raw` matters — the default aesthetic over-stylises interiors. |
| **Flux 1.1 Pro** (Replicate / fal) | `aspect_ratio: "4:3"` | Strongest photorealism of the four. No `--no` syntax; fold the exclusions into the prompt as "no people, no text". |
| **DALL·E 3 / ChatGPT** | ask for landscape | Tends to add signage and lettering — say "no text or signage anywhere" explicitly. |
| **Adobe Firefly** | 4:3 preset | Content type **Photo**. Commercially indemnified, which may matter to the client. |

Deliver at **≥1600×1200** so the 4:3 slot has headroom at 2× DPR. Save as
`public/photos/apartment-illustration-01.jpg`, quality 82.

### Wiring it in when the file arrives

Not done yet — a `photos.ts` entry pointing at a missing file would break the
build. Once the image exists:

1. Add `origin?: "photograph" | "generated"` to the `Photo` type.
2. Register the entry with `consent: "clear"`, `origin: "generated"`, and a
   `note` recording the service and the date.
3. Render it in `Appartements.tsx` with the « Image d'illustration » caption.
4. Add the building exterior alongside it — see the correction section above.

## SEO note

The Glen Lounge appears in **no** mapping or directory service — no Google
Business Profile, no TripAdvisor, no Booking.com, no local listing. For a
venue that rents apartments, that is a bigger discovery gap than the missing
website, and it is free to fix. Worth raising with the client alongside the
site build:

- Claim a **Google Business Profile** (hours, photos, phone, booking link).
- Consider a **Booking.com / Airbnb** listing for the apartment side.
- Consolidate the duplicate Facebook page (see `FACTS.md`).

The website should then be the canonical hub those listings point at, with
`LocalBusiness` + `Hotel` structured data so the two reinforce each other.
