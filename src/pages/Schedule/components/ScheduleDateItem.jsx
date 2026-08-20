import {
  IconCheck,
  IconChevronDown,
  IconWarningTriangle,
} from '../../../components/common/icons/index.jsx'
import './ScheduleDateItem.scss'

/**
 * 날짜별 인식 결과 한 줄.
 *
 * `resolved`가 false면 인식 불확실 상태로 드롭다운을 보여주고,
 * true면 확인 완료 상태로 값만 텍스트로 보여준다.
 *
 * @param {{ id: string, date: string, shiftType: string, resolved: boolean }} item
 * @param {string[]} shiftTypeOptions
 * @param {(id: string, value: string) => void} onChange
 */
function ScheduleDateItem({ item, shiftTypeOptions, onChange }) {
  const { id, date, shiftType, resolved } = item

  if (resolved) {
    return (
      <li className="schedule-date-item">
        <div className="schedule-date-item__row">
          <span className="schedule-date-item__date">{date}</span>
          <span className="schedule-date-item__value">{shiftType}</span>
        </div>
        <p className="schedule-date-item__status is-done">
          <IconCheck size={12} />
          인식 완료
        </p>
      </li>
    )
  }

  return (
    <li className="schedule-date-item is-uncertain">
      <div className="schedule-date-item__row">
        <span className="schedule-date-item__date">{date}</span>

        <label className="schedule-date-item__select-wrap">
          <span className="visually-hidden">{date} 근무유형 선택</span>
          <select
            className="schedule-date-item__select"
            value={shiftType}
            onChange={(event) => onChange(id, event.target.value)}
          >
            <option value="" disabled>
              선택...
            </option>
            {shiftTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <IconChevronDown size={16} className="schedule-date-item__select-icon" />
        </label>
      </div>
      <p className="schedule-date-item__status is-warning">
        <IconWarningTriangle size={12} />
        인식 불확실 - 확인 후 수정해주세요
      </p>
    </li>
  )
}

export default ScheduleDateItem
