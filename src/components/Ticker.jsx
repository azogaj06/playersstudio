import site from '../config/site.js'

/**
 * One line of services + prices scrolling sideways. Rendered twice so the
 * loop is seamless. Purely decorative — the real list is on the page.
 */
export default function Ticker({ className = '' }) {
  const items = [
    ...site.services.map((s) => ({
      label: s.tag ? `${s.name} · ${s.tag}` : s.name,
      value: s.price,
    })),
    { label: 'Walk-ins welcome', value: '7 days' },
  ]
  return (
    <div className={`ticker ${className}`} aria-hidden="true">
      <div className="ticker__track">
        {[0, 1].map((k) => (
          <span key={k} className="ticker__set">
            {items.map((it) => (
              <span key={it.label} className="ticker__item">
                {it.label} <em>{it.value}</em>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
