import Logo from './Logo.jsx'
import site from '../config/site.js'

/**
 * Full-screen black transition frame.
 * state: 'off' | 'in' (0→1 over 400ms) | 'hold' (pure black, optional ghost
 * logo at 15%) | 'out' (1→0 over 600ms revealing the interior).
 */
export default function Blackout({ state }) {
  if (state === 'off') return null
  const showGhost = site.ghostLogoDuringBlackout && (state === 'hold' || state === 'out')
  return (
    <div className={`blackout blackout--${state}`} aria-hidden="true">
      {site.ghostLogoDuringBlackout && (
        <div className={`blackout__ghost${showGhost ? ' blackout__ghost--on' : ''}`}>
          <Logo size="medium" />
        </div>
      )}
    </div>
  )
}
