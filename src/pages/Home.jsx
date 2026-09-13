import site from '../config/site.js'
import { Link } from '../lib/router.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import Hero from '../components/Hero.jsx'
import Reveal from '../components/Reveal.jsx'
import BookLink from '../components/BookLink.jsx'
import Stars from '../components/Stars.jsx'
import GalleryWall from '../components/GalleryWall.jsx'

export default function Home({ animateIn, settleDelay }) {
  usePageMeta('', site.seo.description)
  const r = site.reviews
  return (
    <>
      <Hero animateIn={animateIn} settleDelay={settleDelay} />

      {/* Statement */}
      <Reveal as="section" className="band band--statement" id="services">
        <div className="statement__text">
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
        </div>
        {/* One shot from the chair beside the statement; links to the gallery */}
        <Link to="gallery" className="statement__photo" aria-label="See the gallery">
          <img
            src={site.gallery[3].src}
            alt={site.gallery[3].alt}
            width="1069"
            height="1600"
            loading="lazy"
            decoding="async"
          />
        </Link>
      </Reveal>

      {/* Services */}
      <Reveal as="section" className="band band--services">
        <div className="band__head">
          <p className="kicker">Services</p>
          <h2 className="h2 display">Cuts &amp; prices</h2>
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
            All services
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

      {/* Barbers: one row pointing at the Barbers page (cards live there) */}
      <Reveal as="section" className="band band--teamrow" id="barbers">
        <div className="teamrow">
          <div>
            <p className="kicker">The barbers</p>
            <h2 className="h2 display">Pick your barber</h2>
          </div>
          <Link to="barbers" className="btn btn--secondary btn--big">
            Meet the team
          </Link>
        </div>
      </Reveal>

      {/* Reviews */}
      <Reveal as="section" className="band band--reviews" id="reviews">
        <div className="reviews">
          <div className="reviews__score">
            <span className="reviews__num display">{r.ratingLabel}</span>
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
