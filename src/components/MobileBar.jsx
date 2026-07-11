import site from '../config/site.js'

/**
 * Mobile-only (≤820px) sticky bottom bar — the booking spine. Three plain
 * labelled buttons anyone can understand: Call, BOOK (dominant, straight to
 * Booksy), Hours. Safe-area padded.
 */
export default function MobileBar() {
  const hasUrl = Boolean(site.bookingUrl)
  return (
    <nav className="mbar" aria-label="Quick actions">
      <a className="mbar__btn" href={site.phoneHref}>
        Call
      </a>
      <a
        className="mbar__btn mbar__btn--book"
        href={hasUrl ? site.bookingUrl : '#'}
        target={hasUrl ? '_blank' : undefined}
        rel={hasUrl ? 'noopener noreferrer' : undefined}
        onClick={hasUrl ? undefined : (e) => e.preventDefault()}
      >
        Book
      </a>
      <a className="mbar__btn" href="#visit">
        Hours
      </a>
    </nav>
  )
}
