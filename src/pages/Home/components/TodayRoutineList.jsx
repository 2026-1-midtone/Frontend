import { useState } from 'react'
import { IconClover, IconChevronDown } from '../../../components/common/icons/index.jsx'
import './TodayRoutineList.scss'

const COLLAPSED_COUNT = 3

/**
 * 오늘의 루틴 목록.
 *
 * 완료된 항목은 취소선으로 구분하고, 기본은 3개만 노출한 뒤 더보기로 펼친다.
 * @param {{ id: string, title: string, detail: string, done: boolean }[]} routines
 * @param {(id: string) => void} onToggle
 */
function TodayRoutineList({ routines, onToggle }) {
  const [expanded, setExpanded] = useState(false)

  const visibleRoutines = expanded ? routines : routines.slice(0, COLLAPSED_COUNT)
  const hasMore = routines.length > COLLAPSED_COUNT

  return (
    <section className="today-routine">
      <h2 className="today-routine__title">
        오늘의 루틴
        <IconClover size={16} className="today-routine__title-icon" />
      </h2>

      <ul className="today-routine__list">
        {visibleRoutines.map(({ id, title, detail, done }) => (
          <li key={id} className="today-routine__item">
            <button
              type="button"
              className={
                done
                  ? 'today-routine__button is-done'
                  : 'today-routine__button'
              }
              onClick={() => onToggle?.(id)}
              aria-pressed={done}
            >
              <span className="today-routine__item-title">{title}</span>
              <span className="today-routine__item-detail">{detail}</span>
            </button>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          className="today-routine__more"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          <span className="visually-hidden">
            {expanded ? '루틴 접기' : '루틴 더보기'}
          </span>
          <IconChevronDown
            size={20}
            className={
              expanded
                ? 'today-routine__more-icon is-expanded'
                : 'today-routine__more-icon'
            }
          />
        </button>
      )}
    </section>
  )
}

export default TodayRoutineList
