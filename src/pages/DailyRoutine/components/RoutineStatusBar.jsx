function RoutineStatusBar() {
  return (
    <div className="routine-status-bar" aria-hidden="true">
      <span className="routine-status-bar__time">9:30</span>
      <span className="routine-status-bar__camera" />
      <div className="routine-status-bar__device">
        <span className="routine-status-bar__signal" />
        <span className="routine-status-bar__wifi" />
        <span className="routine-status-bar__battery" />
      </div>
    </div>
  )
}

export default RoutineStatusBar
