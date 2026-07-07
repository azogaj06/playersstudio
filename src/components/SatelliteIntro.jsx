import { useEffect, useRef } from 'react'
import { createIntroMap, destroy } from '../lib/mapProvider.js'
import site from '../config/site.js'

/**
 * Hosts the intro map. Initializes the provider on mount (hidden under the
 * loader) and reports readiness/failure up to App, which owns the flight
 * choreography via mapProvider.flyToShop()/destroy().
 */
export default function SatelliteIntro({ onReady, onFail }) {
  const containerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    createIntroMap(containerRef.current, site)
      .then(() => !cancelled && onReady?.())
      .catch((err) => {
        console.warn('Intro map failed to initialize:', err)
        if (!cancelled) onFail?.()
      })
    return () => {
      cancelled = true
      // Tear down so a remount (StrictMode dev double-mount, or a real
      // unmount mid-intro) always starts from a clean map.
      destroy()
    }
  }, [onReady, onFail])

  return <div className="satellite" ref={containerRef} aria-hidden="true" />
}
