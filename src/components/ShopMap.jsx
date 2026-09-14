import { useEffect, useRef, useState } from 'react'
import site from '../config/site.js'

const TILE_URL =
  import.meta.env.VITE_TILE_URL ||
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'

/**
 * Small, non-interactive satellite map of the block for the Contact page.
 * Same Esri imagery as the intro so the two feel like one thing. The whole
 * map is a link to Google directions.
 */
export default function ShopMap() {
  const ref = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let map
    let cancelled = false
    ;(async () => {
      try {
        const L = (await import('leaflet')).default
        await import('leaflet/dist/leaflet.css')
        if (cancelled || !ref.current) return
        map = L.map(ref.current, {
          center: [site.shopCoords.lat, site.shopCoords.lng],
          zoom: 17,
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
          touchZoom: false,
        })
        L.tileLayer(TILE_URL, { maxZoom: 19 }).addTo(map)
        const el = document.createElement('div')
        el.className = 'shop-marker'
        el.innerHTML = '<div class="shop-marker__dot"></div><div class="shop-marker__pulse"></div>'
        L.marker([site.shopCoords.lat, site.shopCoords.lng], {
          icon: L.divIcon({ html: el, className: 'shop-marker-anchor', iconSize: [22, 22] }),
          interactive: false,
        }).addTo(map)
      } catch (err) {
        console.warn('Contact map unavailable:', err)
        if (!cancelled) setFailed(true)
      }
    })()
    return () => {
      cancelled = true
      map?.remove()
    }
  }, [])

  return (
    <a
      className={`shopmap${failed ? ' shopmap--failed' : ''}`}
      href={site.directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open directions in Google Maps"
    >
      <div className="shopmap__canvas" ref={ref} aria-hidden="true" />
      <span className="shopmap__label">Open in Google Maps ↗</span>
    </a>
  )
}
