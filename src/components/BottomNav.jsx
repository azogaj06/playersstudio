/**
 * Mobile-only (≤820px) fixed bottom nav — the booking spine. Book is
 * visually dominant (accent-filled, ≥52px tall) and sits in the thumb zone;
 * the whole bar respects env(safe-area-inset-bottom).
 */
export default function BottomNav({ onOpen, active }) {
  const item = (id, label, cls = '') => (
    <button
      type="button"
      className={`bnav__btn ${cls}${active === id ? ' bnav__btn--active' : ''}`}
      onClick={() => onOpen(id)}
      aria-label={label}
    >
      {label}
    </button>
  )
  return (
    <nav className="bnav" aria-label="Quick navigation">
      {item('barbers', 'Barbers')}
      {item('book', 'Book', 'bnav__btn--book')}
      {item('gallery', 'Gallery')}
    </nav>
  )
}
