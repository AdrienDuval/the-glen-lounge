# Asset harvesting — what works, what doesn't

Findings from **2026-08-05**. Re-test before assuming any of this still holds;
the platforms change their walls often.

## Summary

| Source | Public access | Verdict |
| --- | --- | --- |
| **TikTok** `@the.glen.lounge` | ✅ Open, no login | **Harvested** — 114+ posts, video + images + captions |
| **Instagram** `@the_glen_lounge` | ❌ Login wall | Needs a session cookie, or manual download |
| **Facebook** page | ❌ Login wall | Needs a session cookie, or manual download |
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

## Instagram & Facebook — blocked

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
