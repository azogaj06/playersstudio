/** Inner-page masthead: small kicker, huge title, optional lead paragraph. */
export default function PageHead({ kicker, title, lead, children, compact = false }) {
  return (
    <header className={`pagehead${compact ? ' pagehead--compact' : ''}`}>
      <p className="kicker">{kicker}</p>
      <h1 className="pagehead__title display">{title}</h1>
      {lead && <p className="pagehead__lead">{lead}</p>}
      {children}
    </header>
  )
}
