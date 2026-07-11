import { useState } from 'react'
import site from '../config/site.js'
import Stars from '../components/Stars.jsx'
import Lightbox from '../components/Lightbox.jsx'

const hasUrl = Boolean(site.bookingUrl)
const bookProps = hasUrl
  ? { href: site.bookingUrl, target: '_blank', rel: 'noopener noreferrer' }
  : { href: '#', onClick: (e) => e.preventDefault() }

/* --- Services & prices ---------------------------------------------------- */

export function ServicesSection() {
  return (
    <section className="section" id="services">
      <h2 className="section__title display">Services &amp; Prices</h2>
      <div className="card">
        <ul className="facts__list">
          {site.services.map((s) => (
            <li key={s.name} className="facts__row">
              <span>{s.name}</span>
              <span className="facts__dots" aria-hidden="true" />
              <span className="facts__value">{s.price}</span>
            </li>
          ))}
        </ul>
        <a className="btn btn--primary btn--big section__cta" {...bookProps}>
          Book an Appointment
        </a>
        {!hasUrl && <p className="soon-note">Booksy link coming soon</p>}
      </div>
    </section>
  )
}

/* --- Barbers ---------------------------------------------------------------- */

function BarberCard({ barber }) {
  const [imgMissing, setImgMissing] = useState(false)
  return (
    <li className="barber-card">
      <div className="barber-card__photo">
        {barber.img && !imgMissing ? (
          <img
            src={barber.img}
            width="400"
            height="400"
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
      <a className="btn btn--primary" {...bookProps}>
        Book with {barber.name}
      </a>
    </li>
  )
}

export function BarbersSection() {
  return (
    <section className="section" id="barbers">
      <h2 className="section__title display">Meet the Barbers</h2>
      <ul className="barber-grid">
        {site.barbers.map((b) => (
          <BarberCard key={b.id} barber={b} />
        ))}
      </ul>
    </section>
  )
}

/* --- Gallery ------------------------------------------------------------------ */

function Tile({ photo, index, onOpen }) {
  const [missing, setMissing] = useState(false)
  const showImg = !photo.pending && !missing
  return (
    <li className="gallery-tile">
      <button
        type="button"
        className="gallery-tile__btn"
        onClick={() => onOpen(index)}
        aria-label={showImg ? `View ${photo.alt}` : `Photo ${index + 1} coming soon`}
      >
        {showImg ? (
          <img
            src={photo.src}
            alt={photo.alt}
            width="600"
            height="600"
            loading="lazy"
            decoding="async"
            onError={() => setMissing(true)}
          />
        ) : (
          <span className="gallery-tile__ph display">PHOTO</span>
        )}
      </button>
    </li>
  )
}

export function GallerySection() {
  const [lightbox, setLightbox] = useState(null)
  const move = (dir) =>
    setLightbox((i) => (i + dir + site.gallery.length) % site.gallery.length)
  return (
    <section className="section" id="gallery">
      <h2 className="section__title display">The Gallery</h2>
      <ul className="gallery-grid">
        {site.gallery.map((photo, i) => (
          <Tile key={photo.src} photo={photo} index={i} onOpen={setLightbox} />
        ))}
      </ul>
      {lightbox != null && (
        <Lightbox
          index={lightbox}
          onClose={() => setLightbox(null)}
          onMove={move}
        />
      )}
    </section>
  )
}

/* --- Reviews --------------------------------------------------------------------- */

export function ReviewsSection() {
  const r = site.reviews
  return (
    <section className="section" id="reviews">
      <h2 className="section__title display">Reviews</h2>
      <div className="rev-hero">
        <span className="rev-hero__score display">{r.rating}</span>
        <div className="rev-hero__meta">
          <Stars rating={r.rating} size={20} />
          <p className="rev-hero__count">
            {r.countLabel} reviews on {r.sources.map((s) => s.label).join(' & ')}
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
    </section>
  )
}

/* --- Hours & location --------------------------------------------------------------- */

export function VisitSection() {
  return (
    <section className="section" id="visit">
      <h2 className="section__title display">Hours &amp; Location</h2>
      <div className="visit">
        <div className="card visit__where">
          <h3 className="card__subtitle">Find us</h3>
          <p className="visit__address">{site.address.replace(', Canada', '')}</p>
          <p className="visit__hint">Downtown Oakville, north side of Lakeshore</p>
          <div className="visit__actions">
            <a
              className="btn btn--primary"
              href={site.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions
            </a>
            <a className="btn btn--secondary" href={site.phoneHref}>
              Call {site.phone}
            </a>
          </div>
          <a
            className="visit__ig"
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram · @playersstudiooakville
          </a>
        </div>
        <div className="card visit__hours">
          <h3 className="card__subtitle">Hours</h3>
          <ul className="facts__list">
            {site.hours.map((h) => (
              <li key={h.days} className="facts__row">
                <span>{h.days}</span>
                <span className="facts__dots" aria-hidden="true" />
                <span className="facts__value">{h.time}</span>
              </li>
            ))}
          </ul>
          <p className="visit__walkins">Walk-ins welcome · booking recommended</p>
        </div>
      </div>
    </section>
  )
}

/* --- Footer ------------------------------------------------------------------------ */

export function Footer() {
  return (
    <footer className="footer">
      <p className="footer__name display">{site.name}</p>
      <p className="footer__line">
        {site.address.replace(', Canada', '')} ·{' '}
        <a href={site.phoneHref}>{site.phone}</a> ·{' '}
        <a href={site.instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
      </p>
      <p className="footer__fine">
        © {new Date().getFullYear()} {site.name}. {site.tagline}.
      </p>
    </footer>
  )
}
