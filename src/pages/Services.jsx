import site from '../config/site.js'
import usePageMeta from '../lib/usePageMeta.js'
import PageHead from '../components/PageHead.jsx'
import Reveal from '../components/Reveal.jsx'
import BookLink from '../components/BookLink.jsx'

export default function Services() {
  usePageMeta('services', site.seo.pages.services)
  return (
    <>
      <PageHead kicker="Services" title="Cuts & prices" lead={site.copy.servicesLead} />

      <Reveal as="section" className="band band--menu">
        <ol className="svc">
          {site.services.map((s, i) => (
            <li key={s.name} className="svc__row">
              <span className="svc__num display">0{i + 1}</span>
              <div className="svc__main">
                <h2 className="svc__name display">
                  {s.name}
                  {s.tag && <span className="tag">{s.tag}</span>}
                </h2>
                <p className="svc__blurb">{s.blurb}</p>
              </div>
              <span className="svc__price display">{s.price}</span>
            </li>
          ))}
        </ol>
        <div className="band__actions">
          <BookLink className="btn btn--primary btn--big" />
          <a className="btn btn--secondary btn--big" href={site.phoneHref}>
            Call {site.phone}
          </a>
        </div>
      </Reveal>

      <Reveal as="section" className="band band--notes">
        <p className="kicker">Good to know</p>
        <ul className="notes">
          {site.copy.servicesNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </Reveal>
    </>
  )
}
