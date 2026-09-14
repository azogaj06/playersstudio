import site from '../config/site.js'

const hasUrl = Boolean(site.bookingUrl)

/** Any Book button on the site. Falls back to an inert '#' if the URL is empty. */
export default function BookLink({ className = 'btn btn--primary', children = 'Book an Appointment', ...rest }) {
  return (
    <a
      className={className}
      href={hasUrl ? site.bookingUrl : '#'}
      target={hasUrl ? '_blank' : undefined}
      rel={hasUrl ? 'noopener noreferrer' : undefined}
      onClick={hasUrl ? undefined : (e) => e.preventDefault()}
      {...rest}
    >
      {children}
    </a>
  )
}
