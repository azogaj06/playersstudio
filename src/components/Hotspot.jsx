/**
 * An invisible click/tap region over one of the photo's own objects (the
 * desk, the barber chair, the waiting seats). Positioned and sized in
 * PERCENTAGES OF THE STAGE so it stays glued to its object at every screen
 * size. Nothing renders until the visitor hovers it (mouse), touches it
 * (finger), or keyboard-focuses it — then the label pill with the white
 * glow fades in. Clicking/tapping opens the panel.
 */
export default function Hotspot({ spot, onOpen }) {
  return (
    <button
      type="button"
      className="hotspot"
      data-hotspot={spot.id}
      style={{
        left: `${spot.x}%`,
        top: `${spot.y}%`,
        width: `${spot.w}%`,
        height: `${spot.h}%`,
      }}
      aria-label={spot.label}
      onClick={() => onOpen(spot.id)}
    >
      <span className="hotspot__reveal" aria-hidden="true">
        {spot.label}
      </span>
    </button>
  )
}
