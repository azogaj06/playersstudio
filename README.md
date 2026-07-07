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

This is a **rough-draft build**: several final assets don't exist yet. The site
is fully functional today using defined fallbacks, and every pending asset is a
pure drop-in — replacing files and editing one config object, zero code changes.

## The drop-in asset contract

All business data, asset paths and hotspot positions live in **one file**:
[`src/config/site.js`](src/config/site.js). Nothing else needs touching.

| Drop-in | Where it goes | Guidance | Until it arrives |
| --- | --- | --- | --- |
| `public/assets/logo.png` | Loading screen, header, blackout ghost, map marker | ~600px wide, transparent PNG | Styled "PLAYERS STUDIO" text fallback (auto-swaps the moment the file exists) |
| `public/assets/interior.jpg` | The full-screen interior scene | ≥2400px wide, landscape | Dark placeholder room with dashed DESK / CHAIR / CANVAS zones |
| `public/assets/interior-1600.jpg` | *Optional* phone-optimized copy served via srcset | ~1600px wide, same crop | Falls back silently to `interior.jpg` |
| `public/assets/buttons/book.png` | Hotspot on the reception desk | transparent background, ~800px wide | Dark pill with white border + label |
| `public/assets/buttons/barbers.png` | Hotspot on the barber chair | transparent background, ~800px wide | Dark pill fallback |
| `public/assets/buttons/gallery.png` | Hotspot on the canvas | transparent background, ~800px wide | Dark pill fallback |
| `public/assets/barbers/rafael.jpg`, `edward.jpg` | Barber cards | square-ish portraits | Dark avatar circle with initial |
| `public/gallery/cut-01.jpg` … `cut-06.jpg` | Gallery grid + lightbox | any size, they lazy-load | Six "PHOTO" tiles |

> Note: until the pending files are dropped in, the browser console will show
> 404s for them — that's inherent to the onError-based auto-detection and
> disappears as assets land.

### Set the Booksy link

In `src/config/site.js` set:

```js
bookingUrl: 'https://booksy.com/…your-shop-page…',
```

While it's empty, every Book button renders enabled with a "Booksy link coming
soon" note. The moment the URL is pasted, **every** Book button across the site
(booking panel, per-barber buttons, bottom nav → panel) points to it. Standard
Booksy web links hand off to the Booksy app automatically when installed, so
they open as plain links in a new tab.

### Adjust hotspot coordinates

When the real interior photo arrives, update `interiorAspect` to the photo's
real width/height ratio, then nudge the `hotspots` array:

```js
// x,y = center of the button as % of the interior image; w = width as % of image width
{ id: 'book', label: 'Book an Appointment', x: 78, y: 56, w: 13, img: '/assets/buttons/book.png' },
```

Because hotspots are positioned in percentages **of the image stage** (not the
viewport), a button placed on the desk stays glued to the desk at every screen
size, crop and swipe position.

### Add a barber

One line per barber in `config.barbers`, plus their photo in
`public/assets/barbers/`:

```js
{ id: 'newguy', name: 'New Guy', specialty: 'Specialty coming soon', img: '/assets/barbers/newguy.jpg' },
```

### Retint the accent colour

One line in `src/styles/tokens.css`: `--accent: #c8a24b;` — controls every
accent surface (Book buttons, initials, marker dot).

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
