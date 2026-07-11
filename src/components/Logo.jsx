import { useState } from 'react'
import site from '../config/site.js'

/**
 * Logo slot with automatic drop-in behaviour: renders /assets/logo.png the
 * moment the file exists; until then (detected via image onError) it renders
 * the styled "PLAYERS STUDIO" text fallback in a heavy condensed italic stack.
 */
export default function Logo({ size = 'large', className = '' }) {
  const [missing, setMissing] = useState(false)

  if (missing) {
    return (
      <span className={`logo logo--text logo--${size} display ${className}`}>
        Players <em>Studio</em>
      </span>
    )
  }
  return (
    <img
      className={`logo logo--img logo--${size} ${className}`}
      src={site.assets.logo}
      width="800"
      height="340"
      alt="Players Studio"
      onError={() => setMissing(true)}
      decoding="async"
    />
  )
}
