import Logo from './Logo.jsx'

/**
 * Solid near-black loading screen. The progress bar is tied to real
 * readiness (map init + starting tiles + interior decode) — App feeds the
 * 0..1 value in. `fading` triggers the 400ms fade-out that reveals the
 * satellite view underneath.
 */
export default function LoadingScreen({ progress, fading }) {
  return (
    <div
      className={`loading${fading ? ' loading--fading' : ''}`}
      role="status"
      aria-label="Loading Players Studio"
    >
      <Logo size="large" />
      <div className="loading__bar" aria-hidden="true">
        <div
          className="loading__fill"
          style={{ transform: `scaleX(${Math.min(1, Math.max(0, progress))})` }}
        />
      </div>
    </div>
  )
}
