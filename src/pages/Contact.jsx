import site from '../config/site.js'
import usePageMeta from '../lib/usePageMeta.js'
import PageHead from '../components/PageHead.jsx'
import Reveal from '../components/Reveal.jsx'
import BookLink from '../components/BookLink.jsx'
import ShopMap from '../components/ShopMap.jsx'

export default function Contact() {
  usePageMeta('contact')
  const [street, city] = site.address.split(',').map((s) => s.trim())
  return (
    <>
      <PageHead kicker="Contact" title="Hours & location" lead={site.copy.contactLead} />

      <Reveal as="section" className="band band--contact">
        <div className="contact">
          <div className="contact__info">
            <p className="kicker">Address</p>
            <p className="contact__address display">
              {street}
              <br />
              {city}, ON
            </p>
            <div className="band__actions">
              <a className="btn btn--primary" href={site.directionsUrl} target="_blank" rel="noopener noreferrer">
                Get Directions
              </a>
              <a className="btn btn--secondary" href={site.phoneHref}>
                Call {site.phone}
              </a>
            </div>

            <p className="kicker">Hours</p>
            <ul className="hours hours--big">
              {site.hours.map((h) => (
                <li key={h.days}>
                  <span>{h.days}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
            <p className="contact__note">Walk-ins welcome · booking recommended for a specific barber</p>

            <p className="kicker">Elsewhere</p>
            <ul className="contact__links">
              <li>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram · @playersstudiooakville
                </a>
              </li>
              {site.bookingUrl && (
                <li>
                  <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer">
                    Booksy · book online
                  </a>
                </li>
              )}
            </ul>
          </div>
          <ShopMap />
        </div>
      </Reveal>

      <Reveal as="section" className="band band--cta">
        <h2 className="cta__title display">See you on Lakeshore.</h2>
        <div className="band__actions band__actions--center">
          <BookLink className="btn btn--primary btn--big" />
        </div>
      </Reveal>
    </>
  )
}
