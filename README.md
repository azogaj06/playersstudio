# Players Studio — cinematic single-page site

A one-scene website for **Players Studio**, 295 Lakeshore Rd E, Oakville, ON
L6J 1J3 · 905-844-4443 · [@playersstudiooakville](https://www.instagram.com/playersstudiooakville).

The experience: logo loading screen → real satellite bird's-eye over Oakville →
one continuous dive down to the shop's roof on Lakeshore Rd E → cut to black →
fade up on the shop-photo hero with clear labelled buttons → a normal
scrollable one-page site: Services & Prices, Meet the Barbers, Gallery,
Reviews, Hours & Location, footer. Mobile is the primary platform: a sticky
bottom bar keeps Call / BOOK / Hours one thumb-tap away at all times.

**SEO:** the full page content is in the DOM from first paint (the intro
plays as an overlay above it), with a keyword h1, per-section h2s, canonical
+ Open Graph/Twitter tags, robots.txt, llms.txt, and schema.org Barbershop
JSON-LD carrying address, geo, structured opening hours, price range, the
service catalog, the 4.9/600+ aggregate rating and a ReserveAction pointing
at Booksy. Lighthouse (mobile): Performance 0.98 · Accessibility 1.0 ·
Best Practices 0.96 · SEO 1.0.

## Run it

```bash
npm install
npm run dev            # local dev server
npm run dev -- --host  # expose on LAN for real-phone testing
npm run build          # production build to dist/
npm run preview        # serve the production build
```

The core assets are REAL: the interior photo, the wordmark logo (extracted
from the client's logo sheet) and six professional gallery photos. Still
pending as drop-ins: barber portraits. Every slot keeps its defined fallback,
so replacing or upgrading any file is still a pure drop-in — zero code
changes. The client's untouched originals are kept in
[`raw-assets/`](raw-assets/), and new gallery photos are uploaded straight
into [`public/gallery/`](public/gallery/).

## The drop-in asset contract

All business data and asset paths live in **one file**:
[`src/config/site.js`](src/config/site.js). Nothing else needs touching.

| Drop-in | Where it goes | Guidance | Until it arrives |
| --- | --- | --- | --- |
| `public/assets/logo.png` | Loading screen, header, blackout ghost, map marker | ~600px wide, transparent PNG | Styled "PLAYERS STUDIO" text fallback (auto-swaps the moment the file exists) |
| `public/assets/interior.jpg` | The full-screen hero photo | ≥2400px wide, landscape | Plain dark fallback |
| `public/assets/interior-1600.jpg` | *Optional* phone-optimized copy served via srcset | ~1600px wide, same crop | Falls back silently to `interior.jpg` |
| `public/assets/barbers/rafael.jpg`, `edward.jpg` | Barber cards | square-ish portraits | Dark avatar circle with initial |
| `public/gallery/cut-0N.jpg` + `cut-0N-thumb.jpg` | Gallery grid + lightbox | LIVE — six real shots; thumb feeds the tile, full feeds the lightbox | A missing file falls back to a "PHOTO" tile |

> Barber photos are still marked pending in config (`img: null`) so nothing
> is requested and the console stays clean. When a portrait is uploaded, set
> the barber's `img` path — still a config-only change.

### The Booksy link

`bookingUrl` in `src/config/site.js` is set to the shop's live Booksy page
(found via the public listing — name, address and phone all match):
`https://booksy.com/en-ca/9047_players-fade-studio_barbershop_773207_oakville`.
Every Book button across the site (booking panel, per-barber buttons, bottom
nav → panel) reads it. If it's ever cleared, Book buttons stay enabled with a
"Booksy link coming soon" note. Standard Booksy web links hand off to the
Booksy app automatically when installed, so they open as plain links in a new
tab.

### Reviews, services & hours (from the Booksy/Google listings)

`config.reviews`, `config.services` and `config.hours` carry the listing
facts, all sourced from the shop's public Booksy page (July 2026: **4.9★,
600+ reviews**; services $24–$50; open 7 days):

- The **Reviews section** (rating hero + quote cards + "Read all on
  Booksy/Google" links) is linked from the ★4.9 chip in the hero.
- The **Services section** carries the services/prices list; the **Visit
  section** carries the weekly hours alongside address/directions/call.
- The quote cards are **lightly paraphrased** from review snippets on the
  public listing — replace them with verbatim favourites from the Booksy
  dashboard when convenient (each quote is one config entry).
- Keep prices/hours in sync with Booksy by editing the arrays; an empty array
  hides its section entirely.
- A `schema.org/Barbershop` JSON-LD block (address, geo, phone, hours,
  aggregate rating) is generated from config at boot for the site's own SEO.
- Reviewers also praise a barber named **Aziz** — if he's on the roster, add
  him to `config.barbers` (one line + photo).

### Add a barber

One line per barber in `config.barbers`, plus their photo in
`public/assets/barbers/`:

```js
{ id: 'newguy', name: 'New Guy', specialty: 'Specialty coming soon', img: '/assets/barbers/newguy.jpg' },
```

### Retint the accent colour

The site is monochrome — black surfaces with white accents, matching the
white gothic wordmark. One line in `src/styles/tokens.css`
(`--accent: #ffffff;`) controls every accent surface (Book buttons, stars,
initials, marker dot); change it there if the palette ever shifts.

## Maps: keyless today, Google later

All map logic goes through [`src/lib/mapProvider.js`](src/lib/mapProvider.js),
which exposes exactly three functions: `createIntroMap(container, config)`,
`flyToShop(onComplete)`, `destroy()`.

- **Active provider (no key needed):** Leaflet rendering Esri World Imagery
  tiles as plain `<img>` elements — no WebGL, no CORS requirements, works
  anywhere a browser can show an image (chosen after a WebGL/fetch-based
  engine failed to load imagery on real-world networks). The dive is one
  `map.flyTo([shop], 19, { duration: 4.2 (3.2 on ≤820px) })` with Esri
  attribution in the corner. If imagery genuinely can't load, the intro
  skips the flight and fades straight into the shop; with `?intro` on the
  URL an on-screen note states the exact reason.
- **Google upgrade path:** set env vars and the Google provider activates
  automatically — no code changes:

  ```bash
  # .env.local
  VITE_GOOGLE_MAPS_KEY=your-api-key
  VITE_GOOGLE_MAPS_MAP_ID=your-vector-map-id   # optional but recommended
  ```

  It loads the Maps JS API (weekly channel), creates a satellite map with all
  UI/gestures disabled, and performs the same dive by interpolating
  `{center, zoom}` into `map.moveCamera()` with ease-in-out-cubic over the same
  duration. With a `mapId` you get vector zooming and the branded
  AdvancedMarkerElement pin; without one the flight still works on the raster
  satellite map. The site never breaks when the key is absent.

**The pin is verified**: `shopCoords` in `site.js` (43.4476, -79.6665) was
anchored against a known neighbouring address and confirmed by the owner —
the dive lands on the shop's building on the north side of Lakeshore Rd E.
Nudge only if the shop ever moves.

## Behaviour flags (in `site.js`)

- `autoSkipIntroOnReturn` — after one completed/skipped intro, returning
  visitors on phones (≤820px) land directly on the interior, one tap from
  booking.
- `ghostLogoDuringBlackout` — logo at 15% opacity during the black hold.

## Replaying the intro

The satellite drop only plays in full on a **fresh visit**. Two things skip
it by design, which can make it look "missing" when testing:

1. **Returning phone visitors** — after one completed or skipped intro, a
   localStorage flag sends phones straight to the interior (a repeat
   customer should land one tap from booking). Clear site data to reset it.
2. **Reduce Motion** — if the device has reduced motion enabled
   (iPhone: Settings → Accessibility → Motion), the flight is skipped for
   accessibility.

To force the full movie any time, open the site with **`?intro`** on the
URL (e.g. `http://localhost:5173/?intro`) — it overrides both.

## Escape hatches

- **SKIP INTRO** (bottom-right, from the very first frame) kills all
  timelines, destroys the map and jumps to the settled interior.
- **prefers-reduced-motion** skips the flight and the settle scale entirely.
- **Slow cellular**: if satellite tiles aren't ready 4s after load on a phone,
  the intro advances with whatever loaded (10s backstop on desktop). If the
  map fails outright (offline/blocked), the loader fades straight into the
  interior.

## Draft decisions (made during the build, revisit freely)

- The site started inside the owner's other repo and was split out here with
  its history intact (`git subtree split`); it is fully self-contained.
- The local `tsconfig.json` only pins Vite's dependency scanner to this
  project; the code is plain JSX.
- The interior `srcset` cascade: phones try `interior-1600.jpg`; if only
  `interior.jpg` exists the onError handler retries with it, and if neither
  exists a plain dark fallback renders. Dropping only `interior.jpg` works.
- The desktop tile failsafe (10s) was added beyond the spec's 4s phone
  failsafe so the loader can never hang anyone, on any device.
