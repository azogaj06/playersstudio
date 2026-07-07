import { useState } from 'react'
import Panel from '../components/Panel.jsx'
import site from '../config/site.js'

function BarberCard({ barber }) {
  const [imgMissing, setImgMissing] = useState(false)
  const hasUrl = Boolean(site.bookingUrl)
  return (
    <li className="barber-card">
      <div className="barber-card__photo">
        {!imgMissing ? (
          <img
            src={barber.img}
            alt={`${barber.name}, barber at ${site.name}`}
            loading="lazy"
            decoding="async"
            onError={() => setImgMissing(true)}
          />
        ) : (
          <span className="barber-card__initial display" aria-hidden="true">
            {barber.name.charAt(0)}
          </span>
        )}
      </div>
      <h3 className="barber-card__name">{barber.name}</h3>
      <p className="barber-card__spec">{barber.specialty}</p>
      <a
        className="btn btn--primary"
        href={hasUrl ? site.bookingUrl : '#'}
        target={hasUrl ? '_blank' : undefined}
        rel={hasUrl ? 'noopener noreferrer' : undefined}
        onClick={hasUrl ? undefined : (e) => e.preventDefault()}
      >
        Book with {barber.name}
      </a>
    </li>
  )
}

/** Meet the Barbers (the chair). Roster renders from config.barbers —
 *  adding a barber later is a one-line config edit. */
export default function BarbersPanel({ onClose }) {
  return (
    <Panel title="Meet the Barbers" onClose={onClose}>
      <ul className="barber-grid">
        {site.barbers.map((b) => (
          <BarberCard key={b.id} barber={b} />
        ))}
      </ul>
      {!site.bookingUrl && <p className="soon-note">Booksy link coming soon</p>}
    </Panel>
  )
}
