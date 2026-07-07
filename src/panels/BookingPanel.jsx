import Panel from '../components/Panel.jsx'
import site from '../config/site.js'

/**
 * Booking (the desk). Every Book button on the site reads config.bookingUrl;
 * while it ships empty the button stays enabled but points to "#" with a
 * "Booksy link coming soon" note — paste the URL into site.js and this (and
 * every other Book button) is live with zero code changes.
 */
export default function BookingPanel({ onClose }) {
  const hasUrl = Boolean(site.bookingUrl)
  return (
    <Panel title="Book an Appointment" onClose={onClose}>
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
      <p className="panel-line panel-line--dim">{site.address}</p>
    </Panel>
  )
}
