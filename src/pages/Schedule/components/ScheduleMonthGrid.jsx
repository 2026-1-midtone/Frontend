import {
  IconChevronLeft,
  IconChevronRight,
} from '../../../components/common/icons/index.jsx'
import { buildMonthGrid } from '../utils/monthGrid.js'
import ShiftTag from './ShiftTag.jsx'
import './ScheduleMonthGrid.scss'

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

/**
 * 월 단위 캘린더 그리드.
 * @param {number} year
 * @param {number} month 0(1월) ~ 11(12월)
 * @param {() => void} onPrevMonth
 * @param {() => void} onNextMonth
 * @param {Record<string, string[]>} shiftsByDate "YYYY-MM-DD" -> 근무유형 배열
 */
function ScheduleMonthGrid({ year, month, onPrevMonth, onNextMonth, shiftsByDate }) {
  const weeks = buildMonthGrid(year, month)

  return (
    <div className="schedule-month-grid">
      <div className="schedule-month-grid__nav">
        <button
          type="button"
          className="schedule-month-grid__nav-button"
          onClick={onPrevMonth}
          aria-label="이전 달"
        >
          <IconChevronLeft size={20} />
        </button>
        <span className="schedule-month-grid__label">{month + 1}월</span>
        <button
          type="button"
          className="schedule-month-grid__nav-button"
          onClick={onNextMonth}
          aria-label="다음 달"
        >
          <IconChevronRight size={20} />
        </button>
      </div>

      <div className="schedule-month-grid__weekdays">
        {WEEKDAY_LABELS.map((label, index) => (
          <span key={`${label}-${index}`} className="schedule-month-grid__weekday">
            {label}
          </span>
        ))}
      </div>

      <div className="schedule-month-grid__weeks">
        {weeks.map((week) => (
          <div className="schedule-month-grid__week" key={week[0].key}>
            {week.map((cell) => {
              const tags = shiftsByDate[cell.key] ?? []
              return (
                <div
                  key={cell.key}
                  className={
                    cell.inCurrentMonth
                      ? 'schedule-month-grid__cell'
                      : 'schedule-month-grid__cell is-muted'
                  }
                >
                  <span className="schedule-month-grid__date">{cell.day}</span>
                  {tags.length > 0 && (
                    <span className="schedule-month-grid__tags">
                      {tags.map((shiftType, index) => (
                        <ShiftTag key={`${shiftType}-${index}`} shiftType={shiftType} compact />
                      ))}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScheduleMonthGrid
