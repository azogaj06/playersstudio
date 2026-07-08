# Players Studio — cinematic single-page site

A one-scene website for **Players Studio**, 295 Lakeshore Rd E, Oakville, ON
L6J 1J3 · 905-844-4443 · [@playersstudiooakville](https://www.instagram.com/playersstudiooakville).

The experience: logo loading screen → real satellite bird's-eye over Oakville →
one continuous dive down to the shop's roof on Lakeshore Rd E → cut to black →
fade up inside the shop → three glowing buttons on the reception desk, the
barber chair and the canvas → Booking / Barbers / Gallery panels. Mobile is the
primary platform: from the settled interior, the Booksy button is two taps away
and calling the shop is one.

## Run it

```bash
cd players-studio
npm install
npm run dev            # local dev server
npm run dev -- --host  # expose on LAN for real-phone testing
npm run build          # production build to dist/
npm run preview        # serve the production build
```

The core assets are now REAL: the interior photo, the wordmark logo (extracted
from the client's logo sheet) and the three object-cutout button images
(processed from the client's composite — white backgrounds keyed to
transparency). Still pending as drop-ins: barber portraits and gallery photos.
Every slot keeps its defined fallback, so replacing or upgrading any file is
still a pure drop-in — zero code changes. The raw client uploads live on the
`main` branch root ("Mid point.png", "Players Studio logo.png", "desk chairs
barber chair.png").

## The drop-in asset contract

All business data, asset paths and hotspot positions live in **one file**:
[`src/config/site.js`](src/config/site.js). Nothing else needs touching.

| Drop-in | Where it goes | Guidance | Until it arrives |
| --- | --- | --- | --- |
| `public/assets/logo.png` | Loading screen, header, blackout ghost, map marker | ~600px wide, transparent PNG | Styled "PLAYERS STUDIO" text fallback (auto-swaps the moment the file exists) |
| `public/assets/interior.jpg` | The full-screen interior scene | ≥2400px wide, landscape | Dark placeholder room with dashed DESK / CHAIR / CANVAS zones |
| `public/assets/interior-1600.jpg` | *Optional* phone-optimized copy served via srcset | ~1600px wide, same crop | Falls back silently to `interior.jpg` |
| `public/assets/barbers/rafael.jpg`, `edward.jpg` | Barber cards | square-ish portraits | Dark avatar circle with initial |
| `public/gallery/cut-01.jpg` … `cut-06.jpg` | Gallery grid + lightbox | any size, they lazy-load | Six "PHOTO" tiles |

> Note: until the remaining pending files (barber portraits, gallery photos)
> are dropped in, the browser console will show 404s for them — that's
> inherent to the onError-based auto-detection and disappears as assets land.

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

- The **Reviews panel** (rating hero + quote cards + "Read all on
  Booksy/Google" links) opens from the ★4.9 chip in the header and from the
  rating strip at the top of the Booking panel.
- The **Booking panel** shows the rating strip, the services/prices list and
  the weekly hours under the Book/Call buttons.
- The quote cards are **lightly paraphrased** from review snippets on the
  public listing — replace them with verbatim favourites from the Booksy
  dashboard when convenient (each quote is one config entry).
- Keep prices/hours in sync with Booksy by editing the arrays; an empty array
  hides its section entirely.
- A `schema.org/Barbershop` JSON-LD block (address, geo, phone, hours,
  aggregate rating) is generated from config at boot for the site's own SEO.
- Reviewers also praise a barber named **Aziz** — if he's on the roster, add
  him to `config.barbers` (one line + photo).

### Adjust hotspot regions

The three clickable areas are **invisible regions** laid over the photo's own
objects (reception desk, barber chair, waiting seats) — no overlay artwork.
Hovering with a mouse, touching on a phone, or keyboard-focusing reveals the
label pill with the white glow; clicking opens the panel. Each region is four
numbers in `config.hotspots`:

```js
// x,y = region center as % of the interior image; w,h = region size as % of the image
{ id: 'book', label: 'Book an Appointment', x: 80.5, y: 72, w: 38, h: 54 },
```

Because regions are positioned in percentages **of the image stage** (not the
viewport), a region placed on the desk stays glued to the desk at every screen
size, crop and swipe position.

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

- **Active provider (no key needed):** MapLibre GL rendering Esri World
  Imagery raster tiles, with Esri attribution in the corner. The dive is one
  `map.flyTo({ zoom: 19.2 → clamped to imagery max 19, duration: 4200 (3200 on
  ≤820px), curve: 1.6 })`.
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

**Verify the pin**: `shopCoords` in `site.js` is a best guess
(43.4444, -79.6649). Check on Google Maps satellite view that the marker sits
on the shop's building on the **north side of Lakeshore Rd E** and nudge if
needed.

## Behaviour flags (in `site.js`)

- `parallax` — subtle desktop mouse parallax on the interior (off under
  reduced motion).
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

- The repo is an Expo app; this site lives self-contained in
  `players-studio/` with its own `package.json`.
- A local `tsconfig.json` exists only to stop Vite's dependency scanner from
  walking up into the Expo tsconfig; the project is plain JSX.
- Mobile bottom sheets are full-screen per spec, so on phones they close via
  ✕ / Escape; backdrop-click close applies to the desktop card (where a
  backdrop is actually visible).
- The interior `srcset` cascade: phones try `interior-1600.jpg`; if only
  `interior.jpg` exists the onError handler retries with it, and if neither
  exists the placeholder room renders. Dropping only `interior.jpg` works.
- The desktop tile failsafe (10s) was added beyond the spec's 4s phone
  failsafe so the loader can never hang anyone, on any device.
