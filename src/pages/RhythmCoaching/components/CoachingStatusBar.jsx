function CoachingStatusBar() {
  return (
    <div className="coaching-status-bar" aria-hidden="true">
      <span className="coaching-status-bar__time">9:30</span>
      <span className="coaching-status-bar__camera" />
      <div className="coaching-status-bar__device">
        <span className="coaching-status-bar__signal" />
        <span className="coaching-status-bar__wifi" />
        <span className="coaching-status-bar__battery" />
      </div>
    </div>
  )
}

export default CoachingStatusBar
