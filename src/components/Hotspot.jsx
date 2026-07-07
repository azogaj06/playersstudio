import { useState } from 'react'

/**
 * One clickable object in the room. Absolutely positioned in PERCENTAGES OF
 * THE STAGE (never the viewport) so it stays glued to its physical object at
 * every screen size and crop.
 *
 * Visual: the supplied PNG when it exists; a dark pill with a thin white
 * border and the label in small caps until then — same size, position and
 * glow behaviour either way. The white-outline glow (stacked drop-shadows,
 * per the client spec) lives on .hotspot__visual in app.css.
 */
export default function Hotspot({ spot, onOpen }) {
  const [imgMissing, setImgMissing] = useState(false)

  return (
    <button
      type="button"
      className="hotspot"
      data-hotspot={spot.id}
      style={{ left: `${spot.x}%`, top: `${spot.y}%`, width: `${spot.w}%` }}
      aria-label={spot.label}
      onClick={() => onOpen(spot.id)}
    >
      <span className="hotspot__anim">
        <span className="hotspot__visual">
          {!imgMissing && spot.img ? (
            <img
              src={spot.img}
              alt=""
              draggable="false"
              decoding="async"
              onError={() => setImgMissing(true)}
            />
          ) : (
            <span className="hotspot__pill">{spot.label}</span>
          )}
        </span>
        <span className="hotspot__chip" aria-hidden="true">
          {spot.label}
        </span>
      </span>
    </button>
  )
}
