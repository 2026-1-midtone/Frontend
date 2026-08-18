function CoachingCard({ icon, title, timing, description }) {
  return (
    <article className="coaching-card">
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
