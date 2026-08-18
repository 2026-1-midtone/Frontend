import {
  IconCheck,
  IconWarningTriangle,
} from '../../../components/common/icons/index.jsx'
import ShiftTag from './ShiftTag.jsx'
import './ScheduleAgendaItem.scss'

/**
 * 날짜별 일정 한 줄 (읽기 전용). 수정은 캘린더 일정 편집 화면에서 한다.
 * @param {{ id: string, date: string, checkInTime: string|null, tags: string[], resolved: boolean }} item
 */
function ScheduleAgendaItem({ item }) {
  const { date, checkInTime, tags, resolved } = item

  return (
    <li className="schedule-agenda-item">
      <div className="schedule-agenda-item__row">
        <span className="schedule-agenda-item__date">{date}</span>
        <span className="schedule-agenda-item__tags">
          {tags.map((shiftType, index) => (
            <ShiftTag key={`${shiftType}-${index}`} shiftType={shiftType} />
          ))}
        </span>
      </div>

      {resolved ? (
        <p className="schedule-agenda-item__status">
          {checkInTime && <span>{checkInTime}</span>}
          <span className="schedule-agenda-item__badge is-done">
            <IconCheck size={11} />
            인식 완료
          </span>
        </p>
      ) : (
        <p className="schedule-agenda-item__status">
          <span className="schedule-agenda-item__badge is-warning">
            <IconWarningTriangle size={11} />
            수정 필요
          </span>
        </p>
      )}
    </li>
  )
}

export default ScheduleAgendaItem
