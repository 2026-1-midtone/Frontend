import ScheduleDateItem from './ScheduleDateItem.jsx'
import './ScheduleDateList.scss'

/**
 * 날짜별 인식 결과 리스트.
 * @param {{ id: string, date: string, shiftType: string, resolved: boolean }[]} items
 * @param {string[]} shiftTypeOptions
 * @param {(id: string, value: string) => void} onChange
 */
function ScheduleDateList({ items, shiftTypeOptions, onChange }) {
  return (
    <section className="schedule-date-list">
      <h2 className="schedule-date-list__title">날짜별 인식 결과</h2>
      <ul className="schedule-date-list__list">
        {items.map((item) => (
          <ScheduleDateItem
            key={item.id}
            item={item}
            shiftTypeOptions={shiftTypeOptions}
            onChange={onChange}
          />
        ))}
      </ul>
    </section>
  )
}

export default ScheduleDateList
