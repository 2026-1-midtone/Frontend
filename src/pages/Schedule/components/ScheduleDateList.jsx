import ScheduleDateItem from './ScheduleDateItem.jsx'
import './ScheduleDateList.scss'

/**
 * 날짜별 인식 결과 리스트.
 * @param {{ id: string, date: string, shiftType: string, resolved: boolean }[]} items
 * @param {string[]} shiftTypeOptions
 * @param {(id: string, value: string) => void} onChange
 * @param {(id: string) => void} [onToggleExclude]
 * @param {string} title
 */
function ScheduleDateList({
  items, shiftTypeOptions, onChange, onToggleExclude, title = '날짜별 인식 결과',
}) {
  return (
    <section className="schedule-date-list">
      <h2 className="schedule-date-list__title">{title}</h2>
      <ul className="schedule-date-list__list">
        {items.map((item) => (
          <ScheduleDateItem
            key={item.id}
            item={item}
            shiftTypeOptions={shiftTypeOptions}
            onChange={onChange}
            onToggleExclude={onToggleExclude}
          />
        ))}
      </ul>
    </section>
  )
}

export default ScheduleDateList
