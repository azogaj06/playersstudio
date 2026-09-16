import site from '../config/site.js'
import { Link } from '../lib/router.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import PageHead from '../components/PageHead.jsx'
import Reveal from '../components/Reveal.jsx'
import BookLink from '../components/BookLink.jsx'

export default function About() {
  usePageMeta('about')
  const c = site.copy
  return (
    <>
      <PageHead kicker="About" title="The shop" lead={c.aboutLead} compact />

      {/* Collage: first photo big on the left, the rest stacked on the right */}
      <Reveal as="section" className="band band--collage">
        <ul className="collage">
          {site.shopPhotos.map((ph, i) => (
            <li key={ph.src} className={`collage__item${i === 0 ? ' collage__item--lead' : ''}`}>
              <img src={ph.src} alt={ph.alt} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal as="section" className="band band--prose">
        <div className="prose">
          {c.aboutBody.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <aside className="facts">
          <dl>
            <div>
              <dt>Address</dt>
              <dd>{site.address.replace(', Canada', '')}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={site.phoneHref}>{site.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Since</dt>
              <dd>2023</dd>
            </div>
            <div>
              <dt>Open</dt>
              <dd>7 days a week</dd>
            </div>
            <div>
              <dt>Rated</dt>
              <dd>
                {site.reviews.ratingLabel} · {site.reviews.countLabel} reviews
              </dd>
            </div>
            <div>
              <dt>Instagram</dt>
              <dd>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer">
                  @playersstudiooakville
                </a>
              </dd>
            </div>
          </dl>
        </aside>
      </Reveal>

      <Reveal as="section" className="band band--cta">
        <h2 className="cta__title display">Take a seat.</h2>
        <div className="band__actions band__actions--center">
          <BookLink className="btn btn--primary btn--big" />
          <Link to="barbers" className="btn btn--secondary btn--big">
            Meet the barbers
          </Link>
        </div>
      </Reveal>
    </>
  )
}
