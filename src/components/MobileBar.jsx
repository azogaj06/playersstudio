import { useEffect, useState } from 'react'
import site from '../config/site.js'
import { Link } from '../lib/router.jsx'

/**
 * Mobile-only (≤820px) sticky bottom bar. Hidden on the first screen so the
 * hero carries a single booking button; slides in once the visitor starts
 * scrolling and stays put — Call, BOOK (straight to Booksy) and Hours are
 * then always one thumb-tap away.
 */
export default function MobileBar() {
  const hasUrl = Boolean(site.bookingUrl)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setShown(window.scrollY > window.innerHeight * 0.55)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`mbar${shown ? ' mbar--shown' : ''}`}
      aria-label="Quick actions"
      aria-hidden={!shown}
    >
      <a className="mbar__btn" href={site.phoneHref} tabIndex={shown ? 0 : -1}>
        Call
      </a>
      <a
        className="mbar__btn mbar__btn--book"
        href={hasUrl ? site.bookingUrl : '#'}
        target={hasUrl ? '_blank' : undefined}
        rel={hasUrl ? 'noopener noreferrer' : undefined}
        onClick={hasUrl ? undefined : (e) => e.preventDefault()}
        tabIndex={shown ? 0 : -1}
      >
        Book
      </a>
      <Link to="contact" className="mbar__btn" tabIndex={shown ? 0 : -1}>
        Hours
      </Link>
    </nav>
  )
}
