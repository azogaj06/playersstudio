import site from '../config/site.js'
import { Link } from '../lib/router.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import PageHead from '../components/PageHead.jsx'
import Reveal from '../components/Reveal.jsx'
import BookLink from '../components/BookLink.jsx'

export default function About() {
  usePageMeta('about', site.seo.pages.about)
  const c = site.copy
  return (
    <>
      <PageHead kicker="About" title="The shop" lead={c.aboutLead} />

      <Reveal className="bleed">
        <img
          src={site.assets.interior}
          srcSet={`${site.assets.interiorSmall} ${site.assets.interiorSmallWidth}w, ${site.assets.interior} ${site.assets.interiorFullWidth}w`}
          sizes="100vw"
          width={site.assets.interiorFullWidth}
          height={site.assets.interiorHeight}
          alt={`Inside ${site.name} on Lakeshore Road East, Oakville`}
          decoding="async"
        />
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

      <Reveal as="section" className="band band--steps">
        <div className="band__head">
          <p className="kicker">How a visit goes</p>
          <h2 className="h2 display">Four steps, no fuss</h2>
        </div>
        <ol className="steps">
          {c.visitSteps.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step__num display">0{i + 1}</span>
              <h3 className="step__title display">{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
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
