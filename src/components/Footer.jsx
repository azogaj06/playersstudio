import { useState } from 'react'
import site from '../config/site.js'
import { routes } from '../routes.js'
import { Link } from '../lib/router.jsx'
import Logo from './Logo.jsx'

export default function Footer() {
  const hasUrl = Boolean(site.bookingUrl)
  const [logoMissing, setLogoMissing] = useState(false)
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <Logo size="medium" />
          <p className="footer__tag">{site.tagline}</p>
        </div>
        <div className="footer__cols">
          <div className="footer__col">
            <h3>Pages</h3>
            <ul>
              {routes.map((r) => (
                <li key={r.path}>
                  <Link to={r.path}>{r.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col footer__col--hours">
            <h3>Hours</h3>
            <ul>
              {site.hours.map((h) => (
                <li key={h.days}>
                  <span>{h.days}</span> {h.time}
                </li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h3>Find us</h3>
            <ul>
              <li>{site.address.replace(', Canada', '')}</li>
              <li>
                <a href={site.phoneHref}>{site.phone}</a>
              </li>
              <li>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              {hasUrl && (
                <li>
                  <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer">
                    Book on Booksy
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} {site.name}. Barbershop, downtown Oakville.</p>
        <p className="footer__credit">
          {!logoMissing ? (
            <>
              <span>Made by</span>
              <img
                src={site.assets.creditLogo}
                alt="A² Digital"
                width="400"
                height="400"
                loading="lazy"
                decoding="async"
                onError={() => setLogoMissing(true)}
              />
              <span>©</span>
            </>
          ) : (
            <>
              Made by A<sup>2</sup> Digital ©
            </>
          )}
        </p>
      </div>
    </footer>
  )
}
