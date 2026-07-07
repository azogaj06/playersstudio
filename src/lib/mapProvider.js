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
// The dive's final zoom is clamped here so tiles never overzoom into blur.
const IMAGERY_MAX_ZOOM = 19
const TARGET_ZOOM = Math.min(19.2, IMAGERY_MAX_ZOOM)

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
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
              ],
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
      // sequence — the flight still runs and the failsafe/idle logic advances
      // the intro. Swallow the noisy per-tile errors, warn once.
      let warned = false
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

      // Resolve when the starting view's tiles are actually on screen.
      await new Promise((resolve) => {
        if (map.loaded() && map.areTilesLoaded()) return resolve()
        map.once('idle', resolve)
      })
    },

    flyToShop(onComplete, config) {
      if (!map) return onComplete?.()
      const duration = isPhone() ? 3200 : 4200
      map.once('moveend', () => onComplete?.())
      map.flyTo({
        center: [config.shopCoords.lng, config.shopCoords.lat],
        zoom: TARGET_ZOOM,
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

function loadGoogleMapsApi(key) {
  if (window.google?.maps) return Promise.resolve(window.google.maps)
  return new Promise((resolve, reject) => {
    const cb = '__playersStudioGmapsReady'
    window[cb] = () => resolve(window.google.maps)
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      key,
    )}&v=weekly&loading=async&callback=${cb}`
    s.async = true
    s.onerror = reject
    document.head.appendChild(s)
  })
}

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

function createGoogleProvider() {
  let map = null
  let rafId = null
  let container = null

  return {
    async createIntroMap(el, config) {
      const gmaps = await loadGoogleMapsApi(GOOGLE_KEY)
      container = el
      map = new gmaps.Map(el, {
        center: config.introStartCenter,
        zoom: config.introStartZoom,
        mapId: GOOGLE_MAP_ID || undefined, // vector map when a mapId is provided
        mapTypeId: 'satellite',
        disableDefaultUI: true,
        gestureHandling: 'none',
        keyboardShortcuts: false,
      })
      // Branded marker via AdvancedMarkerElement when available (needs mapId).
      try {
        const { AdvancedMarkerElement } = await gmaps.importLibrary('marker')
        new AdvancedMarkerElement({
          map,
          position: config.shopCoords,
          content: buildMarkerElement(config),
        })
      } catch {
        /* marker library unavailable without a mapId — intro still works */
      }
      await new Promise((resolve) => {
        gmaps.event.addListenerOnce(map, 'tilesloaded', resolve)
      })
    },

    flyToShop(onComplete, config) {
      if (!map) return onComplete?.()
      const duration = isPhone() ? 3200 : 4200
      const from = {
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng(),
        zoom: map.getZoom(),
      }
      const to = { ...config.shopCoords, zoom: TARGET_ZOOM }
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

const provider = GOOGLE_KEY ? createGoogleProvider() : createMapLibreProvider()

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
