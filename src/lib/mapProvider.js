// ============================================================================
// MAP PROVIDER ABSTRACTION
//
// All map logic goes through exactly three functions:
//
//   createIntroMap(container, config) -> Promise (resolves when the starting
//                                        view's tiles have loaded)
//   flyToShop(onComplete)             -> runs the single continuous dive
//   destroy()                         -> tears the map down, frees WebGL
//
// Today the active provider is MapLibre GL rendering Esri World Imagery
// (keyless). When VITE_GOOGLE_MAPS_KEY is present in the environment, the
// Google Maps JS API provider activates automatically instead. The rest of
// the app never knows which one is running.
// ============================================================================

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID

// Esri World Imagery serves reliable satellite tiles to z19 in urban Ontario.
// VITE_TILE_URL overrides the tile endpoint for offline/dev testing only.
const TILE_URL =
  import.meta.env.VITE_TILE_URL ||
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
const IMAGERY_MAX_ZOOM = 19
// MapLibre's zoom scale is based on 512px tiles, so a 256px raster source
// displays tile level Z+1 at map zoom Z: z19 imagery is NATIVE at map zoom
// 18. Diving to map zoom 19 would render those tiles 2x overscaled (soft).
// 18.2 keeps the final frame essentially crisp (~1.15x) and tight on the roof.
const MAPLIBRE_TARGET_ZOOM = Math.min(19.2, IMAGERY_MAX_ZOOM - 1 + 0.2)
// Google's satellite zoom scale is conventional (z19 ≈ rooftop) and its
// imagery goes deeper, so the spec'd 19.2 applies directly there.
const GOOGLE_TARGET_ZOOM = 19.2

const isPhone = () => window.matchMedia('(max-width: 820px)').matches

/** Branded DOM marker: logo dot if the file exists, white-ringed gold dot otherwise. */
function buildMarkerElement(config) {
  const el = document.createElement('div')
  el.className = 'shop-marker'
  const dot = document.createElement('div')
  dot.className = 'shop-marker__dot'
  const img = document.createElement('img')
  img.src = config.assets.logo
  img.alt = ''
  img.className = 'shop-marker__logo'
  img.onerror = () => img.remove() // fall back to the plain branded dot
  dot.appendChild(img)
  el.appendChild(dot)
  const pulse = document.createElement('div')
  pulse.className = 'shop-marker__pulse'
  el.appendChild(pulse)
  return el
}

// ---------------------------------------------------------------------------
// MapLibre + Esri World Imagery (active, keyless)
// ---------------------------------------------------------------------------

function createMapLibreProvider() {
  let map = null
  let marker = null
  // Generation counter so a createIntroMap superseded by destroy() (or by a
  // newer create, e.g. React StrictMode's dev double-mount) aborts cleanly
  // instead of leaking a second map.
  let gen = 0

  return {
    async createIntroMap(container, config) {
      const myGen = ++gen
      const maplibregl = (await import('maplibre-gl')).default
      await import('maplibre-gl/dist/maplibre-gl.css')
      if (myGen !== gen) return

      map = new maplibregl.Map({
        container,
        style: {
          version: 8,
          sources: {
            esri: {
              type: 'raster',
              tiles: [TILE_URL],
              tileSize: 256,
              maxzoom: IMAGERY_MAX_ZOOM,
              attribution:
                'Esri, Maxar, Earthstar Geographics, and the GIS User Community',
            },
          },
          layers: [{ id: 'esri', type: 'raster', source: 'esri' }],
        },
        center: [config.introStartCenter.lng, config.introStartCenter.lat],
        zoom: config.introStartZoom,
        pitch: 0,
        bearing: 0,
        interactive: false, // this is a movie, not a map
        attributionControl: { compact: true },
      })

      // Tile fetch failures (offline, blocked network) must never break the
      // sequence. Swallow the noisy per-tile errors, warn once — and track
      // whether ANY tile actually rendered: if none did, the caller skips
      // the flight entirely instead of flying over a black void.
      let warned = false
      let tileOk = false
      map.on('data', (e) => {
        if (e.tile) tileOk = true
      })
      map.on('error', (e) => {
        if (!warned) {
          warned = true
          console.warn('Map tile error (continuing without imagery):', e?.error?.message || e)
        }
      })

      marker = new maplibregl.Marker({
        element: buildMarkerElement(config),
        anchor: 'center',
      })
        .setLngLat([config.shopCoords.lng, config.shopCoords.lat])
        .addTo(map)

      // Resolve when the starting view's imagery is actually on screen — or
      // as soon as it's clear it never will be. 'idle' alone is not enough:
      // failing tiles are retried for many seconds, which would stall the
      // loader and then fly the camera over a black void.
      await new Promise((resolve) => {
        let errCount = 0
        let settled = false
        const finish = () => {
          if (!settled) {
            settled = true
            resolve()
          }
        }
        map.on('error', () => {
          errCount++
          // several tile failures and not a single success: give up early
          if (!tileOk && errCount >= 4) finish()
        })
        map.once('idle', finish)
        setTimeout(finish, 8000) // absolute ceiling — never hang the loader
        if (map.loaded() && map.areTilesLoaded()) finish()
      })
      return { tilesVisible: tileOk }
    },

    flyToShop(onComplete, config) {
      if (!map) return onComplete?.()
      const duration = isPhone() ? 3200 : 4200
      map.once('moveend', () => onComplete?.())
      map.flyTo({
        center: [config.shopCoords.lng, config.shopCoords.lat],
        zoom: MAPLIBRE_TARGET_ZOOM,
        pitch: 0, // bird's-eye the whole way down
        bearing: 0,
        duration,
        curve: 1.6,
        essential: true,
      })
    },

    destroy() {
      gen++
      marker?.remove()
      marker = null
      if (map) {
        map.remove() // frees the WebGL context and tile memory
        map = null
      }
    },
  }
}

// ---------------------------------------------------------------------------
// Google Maps JS API (activates automatically when VITE_GOOGLE_MAPS_KEY is set)
// ---------------------------------------------------------------------------

let gmapsLoadPromise = null
function loadGoogleMapsApi(key) {
  if (window.google?.maps) return Promise.resolve(window.google.maps)
  // Single-flight: concurrent callers (e.g. StrictMode's dev double-mount)
  // share one script injection and one callback.
  if (!gmapsLoadPromise) {
    gmapsLoadPromise = new Promise((resolve, reject) => {
      const cb = '__playersStudioGmapsReady'
      window[cb] = () => resolve(window.google.maps)
      const s = document.createElement('script')
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        key,
      )}&v=weekly&loading=async&callback=${cb}`
      s.async = true
      s.onerror = (e) => {
        gmapsLoadPromise = null // allow a retry after a network failure
        reject(e)
      }
      document.head.appendChild(s)
    })
  }
  return gmapsLoadPromise
}

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

function createGoogleProvider() {
  let map = null
  let rafId = null
  let container = null
  // Same generation guard as the MapLibre provider: destroy() (or a newer
  // create) during the async script load must not leave a zombie map.
  let gen = 0

  return {
    async createIntroMap(el, config) {
      const myGen = ++gen
      const gmaps = await loadGoogleMapsApi(GOOGLE_KEY)
      if (myGen !== gen) return // destroyed/superseded while loading
      container = el
      map = new gmaps.Map(el, {
        center: config.introStartCenter,
        zoom: config.introStartZoom,
        mapId: GOOGLE_MAP_ID, // vector map — required for the smooth dive
        mapTypeId: 'satellite',
        disableDefaultUI: true,
        gestureHandling: 'none',
        keyboardShortcuts: false,
      })
      // Branded marker via AdvancedMarkerElement (available on vector maps).
      try {
        const { AdvancedMarkerElement } = await gmaps.importLibrary('marker')
        if (myGen !== gen) return
        new AdvancedMarkerElement({
          map,
          position: config.shopCoords,
          content: buildMarkerElement(config),
        })
      } catch {
        /* marker library unavailable — intro still works */
      }
      await new Promise((resolve) => {
        gmaps.event.addListenerOnce(map, 'tilesloaded', resolve)
      })
      return { tilesVisible: true } // tilesloaded fired — imagery is on screen
    },

    flyToShop(onComplete, config) {
      if (!map) return onComplete?.()
      const duration = isPhone() ? 3200 : 4200
      const from = {
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng(),
        zoom: map.getZoom(),
      }
      const to = { ...config.shopCoords, zoom: GOOGLE_TARGET_ZOOM }
      const start = performance.now()
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration)
        const e = easeInOutCubic(t)
        map.moveCamera({
          center: {
            lat: from.lat + (to.lat - from.lat) * e,
            lng: from.lng + (to.lng - from.lng) * e,
          },
          zoom: from.zoom + (to.zoom - from.zoom) * e,
        })
        if (t < 1) rafId = requestAnimationFrame(step)
        else onComplete?.()
      }
      rafId = requestAnimationFrame(step)
    },

    destroy() {
      gen++
      if (rafId) cancelAnimationFrame(rafId)
      rafId = null
      map = null
      if (container) container.innerHTML = ''
      container = null
    },
  }
}

// ---------------------------------------------------------------------------
// Provider selection + public API
// ---------------------------------------------------------------------------

// The Google path needs BOTH a key and a vector mapId: raster Google maps
// snap to integer zooms (the dive would stutter) and can't render the
// AdvancedMarkerElement pin. A key without a mapId falls back to MapLibre so
// the site never degrades silently.
const useGoogle = Boolean(GOOGLE_KEY && GOOGLE_MAP_ID)
if (GOOGLE_KEY && !GOOGLE_MAP_ID) {
  console.warn(
    'VITE_GOOGLE_MAPS_KEY is set but VITE_GOOGLE_MAPS_MAP_ID is missing — ' +
      'using the MapLibre/Esri provider. Add a vector map ID to enable Google Maps.',
  )
}
const provider = useGoogle ? createGoogleProvider() : createMapLibreProvider()

let activeConfig = null

export function createIntroMap(container, config) {
  activeConfig = config
  return provider.createIntroMap(container, config)
}

export function flyToShop(onComplete) {
  return provider.flyToShop(onComplete, activeConfig)
}

export function destroy() {
  return provider.destroy()
}
