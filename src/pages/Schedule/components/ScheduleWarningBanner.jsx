import { IconWarningTriangle } from '../../../components/common/icons/index.jsx'
import './ScheduleWarningBanner.scss'

/**
 * 인식 불확실 날짜가 있을 때 노출되는 경고 배너.
 * @param {string} title
 * @param {string} description
 */
function ScheduleWarningBanner({ title, description }) {
  return (
    <div className="schedule-warning">
      <IconWarningTriangle size={22} className="schedule-warning__icon" />
      <p className="schedule-warning__text">
        <strong>{title}</strong>
        <span>{description}</span>
      </p>
    </div>
  )
}

export default ScheduleWarningBanner
