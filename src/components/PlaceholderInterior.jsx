import site from '../config/site.js'

const ZONE_NAMES = { book: 'DESK', barbers: 'CHAIR', gallery: 'WAITING AREA' }

/**
 * Stand-in for the real interior photograph: a dark, moody CSS room
 * (charcoal gradient walls, floor line) with dashed outlined zones labelled
 * DESK / CHAIR / CANVAS at the configured hotspot positions, so layout and
 * interactions are fully testable before interior.jpg arrives. Renders
 * inside the identical stage element, so nothing else changes on swap.
 */
export default function PlaceholderInterior() {
  return (
    <div className="ph-room" aria-hidden="true">
      <div className="ph-room__wall" />
      <div className="ph-room__floorline" />
      <div className="ph-room__floor" />
      <div className="ph-room__glow" />
      {site.hotspots.map((spot) => (
        <div
          key={spot.id}
          className="ph-room__zone"
          style={{
            left: `${spot.x}%`,
            top: `${spot.y}%`,
            width: `${spot.w + 6}%`,
          }}
        >
          <span className="ph-room__zonelabel">
            {ZONE_NAMES[spot.id] || spot.id.toUpperCase()}
          </span>
        </div>
      ))}
      <div className="ph-room__note">interior photo pending — placeholder room</div>
    </div>
  )
}
