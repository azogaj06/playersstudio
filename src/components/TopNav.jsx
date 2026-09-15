import { useEffect, useState } from 'react'
import site from '../config/site.js'
import { routes } from '../routes.js'
import { Link, useRoute } from '../lib/router.jsx'
import Logo from './Logo.jsx'
import Ticker from './Ticker.jsx'

const PAGES = routes.filter((r) => r.path !== '')

/**
 * Fixed top bar: wordmark, page links (desktop), BOOK pill, and a menu
 * button that opens a full-screen page list on phones.
 */
export default function TopNav() {
  const hasUrl = Boolean(site.bookingUrl)
  const { route } = useRoute()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Close the menu on navigation and lock page scroll while it's open.
  useEffect(() => setOpen(false), [route])
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav className={`topnav${scrolled ? ' topnav--solid' : ''}`} aria-label="Main">
        <div className="topnav__row">
        <Link to="" className="topnav__brand" aria-label={`${site.name} — home`}>
          <Logo size="small" />
        </Link>
        <a
          className="topnav__ig"
          href={site.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Players Studio on Instagram"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
            <circle cx="12" cy="12" r="4.2" />
            <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
        <div className="topnav__links">
          {PAGES.map((p) => (
            <Link key={p.path} to={p.path}>
              {p.label}
            </Link>
          ))}
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
        <button
          type="button"
          className={`topnav__menu${open ? ' is-open' : ''}`}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
        </div>
        {/* Slim price ticker: tucked under the bar, slides in on scroll */}
        <Ticker className="topnav__ticker" />
      </nav>

      <div id="site-menu" className={`menu${open ? ' menu--open' : ''}`} aria-hidden={!open}>
        <ul className="menu__list">
          {routes.map((p, i) => (
            <li key={p.path} style={{ '--i': i }}>
              <Link to={p.path} className="menu__link display" tabIndex={open ? 0 : -1}>
                <span className="menu__num" aria-hidden="true">—</span>
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="menu__foot">
          <a
            className="btn btn--primary btn--big"
            href={hasUrl ? site.bookingUrl : '#'}
            target={hasUrl ? '_blank' : undefined}
            rel={hasUrl ? 'noopener noreferrer' : undefined}
            tabIndex={open ? 0 : -1}
          >
            Book on Booksy
          </a>
          <p>
            <a href={site.phoneHref} tabIndex={open ? 0 : -1}>{site.phone}</a>
            <br />
            {site.address.replace(', Canada', '')}
          </p>
        </div>
      </div>
    </>
  )
}
