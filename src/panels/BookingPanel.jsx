import Panel from '../components/Panel.jsx'
import Stars from '../components/Stars.jsx'
import site from '../config/site.js'

/**
 * Booking (the desk). Every Book button on the site reads config.bookingUrl;
 * if it's ever empty the button stays enabled but points to "#" with a
 * "Booksy link coming soon" note — paste the URL into site.js and this (and
 * every other Book button) is live with zero code changes.
 *
 * Also carries the listing facts (rating strip, services + prices, hours)
 * rendered from config — empty arrays simply hide their sections.
 */
export default function BookingPanel({ onClose, onOpenPanel }) {
  const hasUrl = Boolean(site.bookingUrl)
  return (
    <Panel title="Book an Appointment" onClose={onClose}>
      {site.reviews?.rating && (
        <button
          type="button"
          className="rating-strip"
          onClick={() => onOpenPanel?.('reviews')}
        >
          <Stars rating={site.reviews.rating} size={15} />
          <span className="rating-strip__text">
            <strong>{site.reviews.rating}</strong> · {site.reviews.countLabel}{' '}
            reviews
          </span>
          <span className="rating-strip__cta">Read them ›</span>
        </button>
      )}

      <p className="panel-lede">
        Lock in your chair — booking runs through Booksy.
      </p>
      <a
        className="btn btn--primary btn--big"
        href={hasUrl ? site.bookingUrl : '#'}
        target={hasUrl ? '_blank' : undefined}
        rel={hasUrl ? 'noopener noreferrer' : undefined}
        onClick={hasUrl ? undefined : (e) => e.preventDefault()}
      >
        Book on Booksy
      </a>
      {!hasUrl && <p className="soon-note">Booksy link coming soon</p>}
      <a className="btn btn--secondary btn--big" href={site.phoneHref}>
        Call {site.phone}
      </a>
      <p className="panel-line">Walk-ins welcome.</p>

      {site.services?.length > 0 && (
        <section className="facts">
          <h3 className="facts__title display">Services</h3>
          <ul className="facts__list">
            {site.services.map((s) => (
              <li key={s.name} className="facts__row">
                <span>{s.name}</span>
                <span className="facts__dots" aria-hidden="true" />
                <span className="facts__value">{s.price}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {site.hours?.length > 0 && (
        <section className="facts">
          <h3 className="facts__title display">Hours</h3>
          <ul className="facts__list">
            {site.hours.map((h) => (
              <li key={h.days} className="facts__row">
                <span>{h.days}</span>
                <span className="facts__dots" aria-hidden="true" />
                <span className="facts__value">{h.time}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="panel-line panel-line--dim">{site.address}</p>
    </Panel>
  )
}
