# Asset harvesting — what works, what doesn't

Findings from **2026-08-05**. Re-test before assuming any of this still holds;
the platforms change their walls often.

## Summary

| Source | Public access | Verdict |
| --- | --- | --- |
| **TikTok** `@the.glen.lounge` | ✅ Open, no login | **Harvested** — 114+ posts, video + images + captions |
| **Instagram** `@the_glen_lounge` | ❌ Login wall | Needs a session cookie, or manual download |
| **Facebook** page | ✅ **Open again as of 2026-08-07** | **Harvested** — 43 photos, no login. See below |
| **The client, over WhatsApp** | ✅ Best source we have | The apartment media. See below |
| Google Maps / TripAdvisor / Booking | ❌ Not listed at all | Nothing to harvest — see SEO note below |

## The client's own apartment media (WhatsApp)

Not harvested — sent to us, and the only imagery of the actual units. It does not
go through any of the tooling below.

**Raw drops live in `assets-raw/whatsapp/<unit>/` under their original
`WhatsApp Image …` filenames** (`assets-raw/` is gitignored — see `.gitignore`).
Curated copies go to `public/photos/studios/<slug>/` under semantic names
(`salon.jpg`, `chambre-1.jpg`, `douche.jpg`, `visite.mp4` …) and are registered
in `lib/photos.ts` with measured dimensions.

⚠️ **Keep the shipped folder lowercase.** The raw drop arrives named for the unit
in caps (`B35`, `A10`) and the curated folder is the slug; on Windows those are
the SAME directory, so the raw drop must be moved out to `assets-raw/` first
rather than left beside it. A10 was the last one sitting in `public/` from before
this rule — moved to `assets-raw/whatsapp/a10/` on 2026-08-13 when it was listed,
and its curated set went to `public/photos/studios/a10-appartement/`.

⚠️ **`a10-appartement/` and `a10-chambres/` are two different lets at one
address** — the whole apartment, and the two bedrooms rented individually inside
it. Their `lib/photos.ts` ids are prefixed apart for the same reason: `a10_appt_*`
is the whole unit, `a10_*` the rooms. Do not merge them.

⚠️ **WhatsApp drops are capped at 1080px on the long edge** — it re-encodes on
send. Fine at current gallery sizes, but see the next note: it is no longer the
only channel, and it is now visibly the worse one.

## ST005 — the first set sent as originals (2026-08-24)

✅ **This is the answer to the « originals are still worth asking for » note
above, and it should become the standard ask.** The client sent ST005 as nine
**iPhone HEIC files at 4032×3024** — not through WhatsApp — so they arrived
un-re-encoded. Shipped at **2000px** on the long edge, which makes
`public/photos/studios/st005/` the sharpest gallery on the site by a wide
margin. Every other unit is ≤1080px.

**Raw originals live in `assets-raw/iphone/st005/`** — a second raw channel
beside `assets-raw/whatsapp/<unit>/`, kept apart because the provenance and the
quality ceiling differ. Same gitignore rule.

⚠️ **HEIC needs decoding before sharp can touch it.** Neither this machine's
libvips nor its WIC has an HEVC decoder — `sharp` reads HEIC *metadata* fine
and then fails on decode with « Support for this compression format has not
been built in », and the WPF/WIC route fails with `0xC00D5212`. What worked: a
WASM libheif (`heic-convert`), installed **outside the project** so
`package.json` stays clean, decode to full-size JPEG, then resize with the
project's own sharp.

⚠️ **EXIF is dropped on re-encode**, which also strips the phone's GPS tags —
worth keeping true of any future original-quality drop, since these come
straight off a handset rather than through an app that already stripped them.

⚠️ **Only 6 of the 9 rooms are covered.** Five frames are the one bedroom from
different angles, and there is **no douche and no balcon frame** although the
sheet claims 2 douches and a balcon. See FACTS.md.
**A10 came in at half that** (540×960 stills, 360×640 clips), so its shipped set
is the softest on the site — see FACTS.md.

**Decoding a still from a clip.** Where a unit sent no photograph of a room
(A10's bedroom, shower, kitchen and terrace; B35's kitchen), frames are decoded
out of the walkthrough with `playwright-core` driving system Chrome. `file://`
video taints the canvas, so `canvas.toDataURL()` throws `SecurityError`; there
are two ways round it and the second is better:

- Stage the clip beside a one-line HTML host and **screenshot the element**.
  Works, but you get the *displayed* pixels — already scaled, and re-encoded.
- **Serve the folder from a throwaway `http.createServer` on localhost** (honour
  `Range`, or seeking stalls) and load the video from `http://`. Same-origin, no
  taint, so `drawImage` + `toDataURL("image/png")` gives the **full-resolution
  frame losslessly**, ready for sharp. This is how A10's five frames were cut.

These are real footage of the real room, so they carry no illustration caption,
but they are 356–642px and visibly soft.

⚠️ **Sideways media is common in these drops, in two different ways.**
- *Clips.* B35's 47s one carries a 90° rotation matrix; **all four of A10's**
  report portrait dimensions with the picture lying on its side. Either way a
  browser plays them sideways, so they are **held, not served**. Check by
  screenshotting a real `<video>` rather than reading the container — Chromium
  already folds rotation into `videoWidth`/`videoHeight`.
- *Stills.* A10's three JPEGs are 540×960 with the pixels on their side and **no
  EXIF orientation tag at all**, so nothing downstream can correct them
  automatically. `sharp().rotate()` with no argument only obeys EXIF and would
  have shipped them sideways — pass the angle explicitly.

Correct either with sharp's `.rotate(-90)`, a lossless transpose; do **not** ship
a clip rotated. `ffmpeg` is not installed here, so re-encoding a clip upright is a
client ask, not a local fix.

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

### Manual dump — 2026-08-11 (partly supersedes the above)

The login wall was routed around by hand rather than by tooling: 43 files were
dumped straight out of the Instagram UI into `assets-raw/instagram-dump/`. That
folder arrived at `public/photos/events-photo-dump/` and was **moved out of
`public/`** — everything under `public/` is served and deployed, and most of
this dump must not be.

Yield, after inspecting every file:

| What | Count | Outcome |
| --- | --- | --- |
| Weekly-night flyers, ~512×640 | 4 | **Shipped** — see below |
| Sport flyers, 360×640 | 3 | Rejected on size |
| Video cover frames (staff, identifiable) | 3 | Not artwork; consent unresolved |
| Instagram grid thumbnails, 150×150 | 10 | Unusable at that size |
| `*_1.jpeg`, 12 bytes, containing the ASCII text `Bad URL hash` | 21 | Failed downloads |
| One blurred frame, one all-black frame | 2 | Junk |

The four that shipped are the venue's own artwork for four weekly nights, and
they replaced generic room photography — until now `jeudi-karaoke` was
illustrated by a picture of the bar and `mardi-casino` by `lounge_hero`, which
is also the frame the banner opens on, so the carousel showed it twice.

| Flyer | → | Was |
| --- | --- | --- |
| `event_jeudi_karaoke` | `jeudi-karaoke` | `bar_monogram` |
| `event_mardi_casino` | `mardi-casino` | `lounge_hero` (duplicated slide 0) |
| `event_mercredi_cocktail` | `mercredi-cocktail` | `lounge_detail` |
| `event_samedi_vip` | `samedi-vip` | `lounge_sofa` |

Two things are still open, both recorded against the entries in `lib/photos.ts`:

- **They are feed renditions, ~512×640, not originals.** Fine for the calendar
  popover (≈368px) and the index card; soft in the hero, which shows a poster at
  42vw. `event_bal_veterans` is 1536×2048 — that is the bar. **Ask the client for
  the source files**; this is the same ask as Option B below.
- **Each prints a door time that contradicts the published 19h** — karaoke 16h,
  casino 20h, cocktail 20h, samedi VIP 18h. FACTS.md set 19h on 2026-08-07 from
  the August posts, and separately logs an 18h → 16h → 19h drift across the year,
  so the flyers may simply predate the posts.

  Rendered, this was not a footnote: the hero shows a poster at 42vw, so
  « DÉBUT 16H » landed beside « Tous les jeudis — dès 19h » at full size, both
  legible. **Resolved 2026-08-11 by removing the site's own claim** for those
  four nights, so the flyer is the only clock on the page — see the ONE TIME
  CLAIM block in `lib/events.ts`. The underlying question is still open; FACTS.md
  carries it. **Do not rewrite the times from the artwork either** — that only
  moves the guess.

The three rejected sport flyers (Champions League final PSG–Arsenal, World Cup
quarter-final France–Maroc, round of 16 Argentine–Égypte) are real fixtures the
`sport_*` set does not cover, but `Ecrans` renders a flyer at ≈352 CSS px, so it
wants ~704px for a sharp 2× and these are 360px wide. The five already shipping
are 859–1280px. Re-request them at full size and they are worth adding.

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

### The studios banner plate (2026-08-11)

`studio_hero` — the opening frame on the studios index and the « Appartements »
slide in the home hero. Supplied by the client as
`huy-nguyen-AB-q9lwCVv8-unsplash.jpg`, **7589×4015, 2.4 MB**.

| | |
| --- | --- |
| Original | `assets-raw/unsplash/huy-nguyen-AB-q9lwCVv8-unsplash.jpg` |
| Shipped | `public/photos/studios/studio-hero.webp`, 2400×1270, **119 KB** |
| Recipe | `sharp(src).resize({ width: 2400 }).webp({ quality: 82 })` |

Three things worth keeping straight about it:

**The original does not ship.** It landed in `public/photos/` and was moved
out. 2.4 MB is roughly twenty times the whole rest of the apartments page, and
`next/image` only spares you that if nobody requests the file directly —
anything under `public/` is a live URL. 2400 px also matches the ceiling
`next.config.ts` sets (`deviceSizes` stops at 2048; nothing renders above
~2048 CSS px), so the extra 5000 px of width was pure transfer.

**It is a placeholder, and the home hero is indexed.** Same standing as the
seven gallery frames — not this building — but the first one to reach a page
search engines see. `lib/banner.ts` grew `Slide.illustrative` for it: one flag
that is both the permission past the placeholder gate and the trigger for the
« Image d'illustration » caption, so the two cannot drift apart. The gate
rejects the inverse too — a slide claiming `illustrative` over a real venue
photograph is a false disclosure and is dropped.

**The real building is still on the homepage.** `Appartements.tsx` renders
`exterior_day` further down the same page. That keeps the "never let it stand
alone" rule below intact: an acknowledged illustration paired with a genuine
photograph of the actual block is defensible; the illustration alone is not.

Licence: the filename is Unsplash's download format (photographer Huy Nguyen,
id `AB-q9lwCVv8`), and the Unsplash Licence allows commercial use without
attribution — better footing than the seven, whose licence is unknown, but
unverified. See FACTS.md open question 8.

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
