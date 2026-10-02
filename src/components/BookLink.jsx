import site from '../config/site.js'

/**
 * Any Book button on the site. `href` overrides the shop's Booksy page (a
 * barber's own booking link); falls back to an inert '#' if neither is set.
 */
export default function BookLink({ className = 'btn btn--primary', children = 'Book an Appointment', href, ...rest }) {
  const url = href || site.bookingUrl
  return (
    <a
      className={className}
      href={url || '#'}
      target={url ? '_blank' : undefined}
      rel={url ? 'noopener noreferrer' : undefined}
      onClick={url ? undefined : (e) => e.preventDefault()}
      {...rest}
    >
      {children}
    </a>
  )
}
