import site from '../config/site.js'
import { Link } from '../lib/router.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import Hero from '../components/Hero.jsx'
import Reveal from '../components/Reveal.jsx'
import BookLink from '../components/BookLink.jsx'
import Stars from '../components/Stars.jsx'
import GalleryWall from '../components/GalleryWall.jsx'
import BarberCard from '../components/BarberCard.jsx'

export default function Home({ animateIn, settleDelay }) {
  usePageMeta('', site.seo.description)
  const r = site.reviews
  return (
    <>
      <Hero animateIn={animateIn} settleDelay={settleDelay} />

      {/* Statement */}
      <Reveal as="section" className="band band--statement" id="services">
        <p className="kicker">{site.address.replace(', Canada', '')}</p>
        <h2 className="statement display">{site.copy.homeStatement}</h2>
        <div className="statement__links">
          <Link to="about" className="textlink">
            About the shop
          </Link>
          <Link to="contact" className="textlink">
            Hours &amp; directions
          </Link>
        </div>
      </Reveal>

      {/* Marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track display">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              {site.services.map((s) => (
                <span key={s.name} className="marquee__item">
                  {s.name} <em>{s.price}</em>
                </span>
              ))}
              <span className="marquee__item">
                Walk-ins welcome <em>7 days</em>
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Services */}
      <Reveal as="section" className="band band--services">
        <div className="band__head">
          <p className="kicker">Services</p>
          <h2 className="h2 display">The menu</h2>
        </div>
        <ol className="menu-list">
          {site.services.map((s, i) => (
            <li key={s.name} className="menu-list__row">
              <span className="menu-list__num display">0{i + 1}</span>
              <span className="menu-list__name display">{s.name}</span>
              <span className="menu-list__price display">{s.price}</span>
            </li>
          ))}
        </ol>
        <div className="band__actions">
          <BookLink className="btn btn--primary btn--big" />
          <Link to="services" className="btn btn--secondary btn--big">
            Full service list
          </Link>
        </div>
      </Reveal>

      {/* Work */}
      <section className="band band--work" id="gallery">
        <Reveal className="band__head band__head--row">
          <div>
            <p className="kicker">The work</p>
            <h2 className="h2 display">Fresh out of the chair</h2>
          </div>
          <Link to="gallery" className="textlink">
            See the whole gallery
          </Link>
        </Reveal>
        <GalleryWall limit={3} className="wall--preview" />
      </section>

      {/* Barbers */}
      <Reveal as="section" className="band band--barbers" id="barbers">
        <div className="band__head band__head--row">
          <div>
            <p className="kicker">The barbers</p>
            <h2 className="h2 display">Pick your chair</h2>
          </div>
          <Link to="barbers" className="textlink">
            Meet the team
          </Link>
        </div>
        <ul className="barber-grid">
          {site.barbers.map((b, i) => (
            <BarberCard key={b.id} barber={b} index={i} />
          ))}
        </ul>
      </Reveal>

      {/* Reviews */}
      <Reveal as="section" className="band band--reviews" id="reviews">
        <div className="reviews">
          <div className="reviews__score">
            <span className="reviews__num display">{r.rating}</span>
            <Stars rating={r.rating} size={22} />
            <p className="reviews__count">
              {r.countLabel} reviews on {r.sources.map((s) => s.label).join(' and ')}
            </p>
            <div className="reviews__links">
              {r.sources.map((s) => (
                <a key={s.id} className="textlink" href={s.url} target="_blank" rel="noopener noreferrer">
                  Read on {s.label}
                </a>
              ))}
            </div>
          </div>
          <ul className="reviews__quotes">
            {r.quotes.map((q) => (
              <li key={q.text} className="quote">
                <blockquote>
                  <p>“{q.text}”</p>
                </blockquote>
                <cite>{q.author}</cite>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Visit */}
      <Reveal as="section" className="band band--visit" id="visit">
        <div className="visit">
          <div className="visit__where">
            <p className="kicker">Find us</p>
            <h2 className="h2 display">{site.address.split(',')[0]}</h2>
            <p className="visit__hint">Downtown Oakville, north side of Lakeshore. Walk-ins welcome.</p>
            <div className="band__actions">
              <a className="btn btn--primary" href={site.directionsUrl} target="_blank" rel="noopener noreferrer">
                Get Directions
              </a>
              <a className="btn btn--secondary" href={site.phoneHref}>
                Call {site.phone}
              </a>
            </div>
          </div>
          <div className="visit__hours">
            <p className="kicker">Hours</p>
            <ul className="hours">
              {site.hours.map((h) => (
                <li key={h.days}>
                  <span>{h.days}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </>
  )
}
