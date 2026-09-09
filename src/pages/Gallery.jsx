import site from '../config/site.js'
import usePageMeta from '../lib/usePageMeta.js'
import PageHead from '../components/PageHead.jsx'
import GalleryWall from '../components/GalleryWall.jsx'
import BookLink from '../components/BookLink.jsx'

export default function Gallery() {
  usePageMeta('gallery', site.seo.pages.gallery)
  return (
    <>
      <PageHead
        kicker="Gallery"
        title="The work"
        lead="Fades, tapers, beards and the odd design, straight from the chairs on Lakeshore. Tap any photo to see it full size."
      >
        <a className="textlink" href={site.instagram} target="_blank" rel="noopener noreferrer">
          More every week on Instagram
        </a>
      </PageHead>
      <section className="band band--wall">
        <GalleryWall />
      </section>
      <section className="band band--cta">
        <h2 className="cta__title display">Want one like that?</h2>
        <div className="band__actions band__actions--center">
          <BookLink className="btn btn--primary btn--big" />
        </div>
      </section>
    </>
  )
}
