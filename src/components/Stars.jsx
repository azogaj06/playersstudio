/** Accent star row for a 0–5 rating (supports halves via width clip). */
export default function Stars({ rating, size = 18 }) {
  const pct = Math.max(0, Math.min(5, rating)) * 20
  const row = '★★★★★'
  return (
    <span
      className="stars"
      style={{ fontSize: size }}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      <span className="stars__base" aria-hidden="true">
        {row}
      </span>
      <span className="stars__fill" style={{ width: `${pct}%` }} aria-hidden="true">
        {row}
      </span>
    </span>
  )
}
