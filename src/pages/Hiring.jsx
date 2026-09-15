import site from '../config/site.js'
import usePageMeta from '../lib/usePageMeta.js'
import PageHead from '../components/PageHead.jsx'
import Reveal from '../components/Reveal.jsx'

export default function Hiring() {
  usePageMeta('hiring', site.seo.pages.hiring)
  const c = site.copy
  return (
    <>
      <PageHead kicker="Join the team" title="We're hiring" lead={c.hiringLead} />

      <Reveal as="section" className="band band--prose">
        <div className="prose">
          {c.hiringBody.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <aside className="facts">
          <p className="kicker">What we're looking for</p>
          <ul className="notes">
            {c.hiringWant.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </aside>
      </Reveal>

      <Reveal as="section" className="band band--apply">
        <p className="kicker">How to apply</p>
        <h2 className="h2 display">Show us your work</h2>
        <p className="apply__text">{c.hiringApply}</p>
        <div className="band__actions">
          <a className="btn btn--primary btn--big" href={site.instagram} target="_blank" rel="noopener noreferrer">
            Message us on Instagram
          </a>
          <a className="btn btn--secondary btn--big" href={site.phoneHref}>
            Call {site.phone}
          </a>
        </div>
        <p className="apply__meta">{site.address.replace(', Canada', '')} · Open 7 days</p>
      </Reveal>
    </>
  )
}
