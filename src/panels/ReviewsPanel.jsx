import Panel from '../components/Panel.jsx'
import Stars from '../components/Stars.jsx'
import site from '../config/site.js'

/**
 * Reviews — rating hero + quote cards + links to the full listings.
 * Everything renders from config.reviews; an empty quotes array hides the
 * quote grid, so this panel can never break on missing data.
 */
export default function ReviewsPanel({ onClose }) {
  const r = site.reviews
  return (
    <Panel title="Reviews" onClose={onClose}>
      <div className="rev-hero">
        <span className="rev-hero__score display">{r.rating}</span>
        <div className="rev-hero__meta">
          <Stars rating={r.rating} size={20} />
          <p className="rev-hero__count">
            {r.countLabel} reviews on{' '}
            {r.sources.map((s) => s.label).join(' & ')}
          </p>
        </div>
      </div>

      {r.quotes.length > 0 && (
        <ul className="rev-grid">
          {r.quotes.map((q) => (
            <li key={q.text} className="rev-card">
              <Stars rating={5} size={13} />
              <blockquote className="rev-card__text">“{q.text}”</blockquote>
              <p className="rev-card__author">— {q.author}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="rev-links">
        {r.sources.map((s) => (
          <a
            key={s.id}
            className={`btn ${s.id === 'booksy' ? 'btn--primary' : 'btn--secondary'}`}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read all on {s.label}
          </a>
        ))}
      </div>
    </Panel>
  )
}
