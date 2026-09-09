import { useState } from 'react'
import site from '../config/site.js'
import BookLink from './BookLink.jsx'

/** Tall portrait card. Until a photo is dropped in, a big initial holds the slot. */
export default function BarberCard({ barber, index }) {
  const [imgMissing, setImgMissing] = useState(false)
  const hasPhoto = barber.img && !imgMissing
  return (
    <li className="barber">
      <div className={`barber__photo${hasPhoto ? '' : ' barber__photo--empty'}`}>
        {hasPhoto ? (
          <img
            src={barber.img}
            width="900"
            height="1200"
            alt={`${barber.name}, barber at ${site.name}`}
            loading="lazy"
            decoding="async"
            onError={() => setImgMissing(true)}
          />
        ) : (
          <span className="barber__initial display" aria-hidden="true">
            {barber.name.charAt(0)}
          </span>
        )}
        <span className="barber__num display" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="barber__body">
        <h3 className="barber__name display">{barber.name}</h3>
        <p className="barber__spec">{barber.specialty}</p>
        <BookLink className="btn btn--primary barber__book">Book with {barber.name}</BookLink>
      </div>
    </li>
  )
}
