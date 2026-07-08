// ============================================================================
// MAP PROVIDER ABSTRACTION
//
// All map logic goes through exactly three functions:
//
//   createIntroMap(container, config) -> Promise (resolves when the starting
//                                        view's tiles have loaded)
//   flyToShop(onComplete)             -> runs the single continuous dive
//   destroy()                         -> tears the map down
//
// Today the active provider is Leaflet rendering Esri World Imagery
// (keyless). Leaflet loads tiles as plain <img> elements, which need neither
// CORS permission nor WebGL — it works anywhere a browser can show an image
// (chosen after a WebGL/fetch-based engine failed on real-world networks).
// When VITE_GOOGLE_MAPS_KEY + VITE_GOOGLE_MAPS_MAP_ID are present in the
// environment, the Google Maps JS API provider activates automatically
// instead. The rest of the app never knows which one is running.
// ============================================================================

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY
const GOOGLE_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID

// Esri World Imagery serves reliable satellite tiles to z19 in urban Ontario.
// VITE_TILE_URL overrides the tile endpoint for offline/dev testing only.
const TILE_URL =
  import.meta.env.VITE_TILE_URL ||
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
const ESRI_ATTRIBUTION =
  'Esri, Maxar, Earthstar Geographics, and the GIS User Community'
// Leaflet zoom == tile zoom, so z19 imagery is native at map zoom 19.
const LEAFLET_TARGET_ZOOM = 19
// Google's satellite imagery goes deeper, so the spec'd 19.2 applies there.
const GOOGLE_TARGET_ZOOM = 19.2

const isPhone = () => window.matchMedia('(max-width: 820px)').matches

/** Branded marker: small pulsing dot on the shop + the Players Studio
 *  wordmark floating above it, riding along as the camera dives. */
function buildMarkerElement(config) {
  const el = document.createElement('div')
  el.className = 'shop-marker'
  const wordmark = document.createElement('img')
  wordmark.src = config.assets.logo
  wordmark.alt = ''
  wordmark.className = 'shop-marker__wordmark'
  wordmark.onerror = () => wordmark.remove() // dot-only until the logo exists
  el.appendChild(wordmark)
  const dot = document.createElement('div')
  dot.className = 'shop-marker__dot'
  el.appendChild(dot)
  const pulse = document.createElement('div')
  pulse.className = 'shop-marker__pulse'
  el.appendChild(pulse)
  return el
}

// ---------------------------------------------------------------------------
// Leaflet + Esri World Imagery (active, keyless, <img>-based tiles)
// ---------------------------------------------------------------------------

function createLeafletProvider() {
  let map = null
  // Generation counter so a createIntroMap superseded by destroy() (or by a
  // newer create, e.g. React StrictMode's dev double-mount) aborts cleanly
  // instead of leaking a second map.
  let gen = 0

  return {
    async createIntroMap(container, config) {
      const myGen = ++gen
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      if (myGen !== gen) return

      map = L.map(container, {
        center: [config.introStartCenter.lat, config.introStartCenter.lng],
        zoom: config.introStartZoom,
        zoomSnap: 0, // allow fractional zooms (9.5 start, smooth dive)
        zoomControl: false,
        attributionControl: true,
        // this is a movie, not a map — all interaction off
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
        inertia: false,
      })

      // Track whether ANY tile actually rendered: if none did, the caller
      // skips the flight instead of flying over a black void.
      let tileOk = false
      let errCount = 0
      let warned = false
      const layer = L.tileLayer(TILE_URL, {
        maxZoom: LEAFLET_TARGET_ZOOM,
        maxNativeZoom: 19,
        attribution: ESRI_ATTRIBUTION,
        // NOTE: no crossOrigin option — tiles load as plain <img> elements,
        // which do not require CORS headers from the tile server.
      })
      layer.on('tileload', () => {
        tileOk = true
      })
      layer.on('tileerror', (e) => {
        errCount++
        if (!warned) {
          warned = true
          console.warn('Map tile error (continuing):', e?.error || e)
        }
      })
      layer.addTo(map)

      L.marker([config.shopCoords.lat, config.shopCoords.lng], {
        icon: L.divIcon({
          html: buildMarkerElement(config),
          className: 'shop-marker-anchor', // no default Leaflet icon styles
          iconSize: [22, 22],
        }),
        interactive: false,
        keyboard: false,
      }).addTo(map)

      // Resolve when the starting view's imagery is actually on screen — or
      // as soon as it's clear it never will be. Never hang the loader.
      await new Promise((resolve) => {
        let settled = false
        const finish = () => {
          if (!settled) {
            settled = true
            resolve()
          }
        }
        layer.once('load', finish) // all visible tiles loaded
        const failPoll = setInterval(() => {
          // several tile failures and not a single success: give up early
          if (!tileOk && errCount >= 4) {
            clearInterval(failPoll)
            finish()
          }
          if (settled) clearInterval(failPoll)
        }, 150)
        setTimeout(finish, 8000) // absolute ceiling
      })
      return { tilesVisible: tileOk }
    },

    flyToShop(onComplete, config) {
      if (!map) return onComplete?.()
      const duration = isPhone() ? 3.2 : 4.2 // Leaflet durations are seconds
      map.once('moveend', () => onComplete?.())
      map.flyTo(
        [config.shopCoords.lat, config.shopCoords.lng],
        LEAFLET_TARGET_ZOOM,
        { duration, animate: true },
      )
    },

    destroy() {
      gen++
      if (map) {
        map.remove()
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
const provider = useGoogle ? createGoogleProvider() : createLeafletProvider()

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
