import site from '../config/site.js'
import Logo from './Logo.jsx'

/** Sticky top bar: logo, plain-language section links (desktop), BOOK pill. */
export default function TopNav() {
  const hasUrl = Boolean(site.bookingUrl)
  return (
    <nav className="topnav" aria-label="Main">
      <a className="topnav__brand" href="#top" aria-label={`${site.name} — top of page`}>
        <Logo size="small" />
      </a>
      <div className="topnav__links">
        <a href="#services">Services</a>
        <a href="#barbers">Barbers</a>
        <a href="#gallery">Gallery</a>
        <a href="#reviews">Reviews</a>
        <a href="#visit">Hours &amp; Location</a>
      </div>
      <a
        className="btn btn--primary topnav__book"
        href={hasUrl ? site.bookingUrl : '#'}
        target={hasUrl ? '_blank' : undefined}
        rel={hasUrl ? 'noopener noreferrer' : undefined}
        onClick={hasUrl ? undefined : (e) => e.preventDefault()}
      >
        Book
      </a>
    </nav>
  )
}
