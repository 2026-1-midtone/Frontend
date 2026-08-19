function CoachingCard({ icon, title, timing, description, onSelect }) {
  const handleKeyDown = (event) => {
    if (!onSelect || (event.key !== 'Enter' && event.key !== ' ')) return

    event.preventDefault()
    onSelect()
  }

  return (
    <article
      className="coaching-card"
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-label={onSelect ? `${title} 상세 근거 보기` : undefined}
    >
      <span className="coaching-card__icon" aria-hidden="true">
        <img src={icon} alt="" />
      </span>
      <div className="coaching-card__copy">
        <h3>
          {title}
          {timing && <strong>{timing}</strong>}
        </h3>
        <p>{description}</p>
      </div>
    </article>
  )
}

export default CoachingCard
