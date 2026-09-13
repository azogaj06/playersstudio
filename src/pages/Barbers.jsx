import site from '../config/site.js'
import usePageMeta from '../lib/usePageMeta.js'
import PageHead from '../components/PageHead.jsx'
import Reveal from '../components/Reveal.jsx'
import BarberCard from '../components/BarberCard.jsx'
import BookLink from '../components/BookLink.jsx'

export default function Barbers() {
  usePageMeta('barbers', site.seo.pages.barbers)
  return (
    <>
      <PageHead
        kicker="The barbers"
        title="Pick your chair"
        lead="Every barber here takes their own bookings on Booksy. Pick who you want, pick a time, and the chair is yours."
      />
      <Reveal as="section" className="band band--team">
        <ul className="barber-grid barber-grid--page">
          {site.barbers.map((b, i) => (
            <BarberCard key={b.id} barber={b} index={i} />
          ))}
        </ul>
      </Reveal>
      <Reveal as="section" className="band band--cta">
        <h2 className="cta__title display">Any barber, any day.</h2>
        <div className="band__actions band__actions--center">
          <BookLink className="btn btn--primary btn--big" />
        </div>
      </Reveal>
    </>
  )
}
