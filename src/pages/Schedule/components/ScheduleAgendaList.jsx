import ScheduleAgendaItem from './ScheduleAgendaItem.jsx'
import './ScheduleAgendaList.scss'

/**
 * 날짜별 일정 목록 (읽기 전용).
 * @param {{ id: string, date: string, checkInTime: string|null, tags: string[], resolved: boolean }[]} items
 */
function ScheduleAgendaList({ items }) {
  return (
    <section className="schedule-agenda-list">
      <h2 className="schedule-agenda-list__title">날짜별 일정</h2>
      <ul className="schedule-agenda-list__list">
        {items.map((item) => (
          <ScheduleAgendaItem key={item.id} item={item} />
        ))}
      </ul>
    </section>
  )
}

export default ScheduleAgendaList
