import { IconClover } from '../../../components/common/icons/index.jsx'
import './TodayRoutineList.scss'

/**
 * 오늘의 루틴 목록.
 *
 * 완료된 항목은 취소선으로 구분한다. 목록 하단의 "전체 루틴 보러가기"는
 * 전체 루틴 화면으로 이동하는 진입점이며, 대상 라우트는 아직 없다.
 *
 * @param {{ id: string, title: string, detail: string, done: boolean }[]} routines
 * @param {(id: string) => void} onToggle
 * @param {() => void} onViewAll
 */
function TodayRoutineList({ routines, onToggle, onViewAll }) {
  return (
    <section className="today-routine">
      <h2 className="today-routine__title">
        오늘의 루틴
        <IconClover size={16} className="today-routine__title-icon" />
      </h2>

      {routines.length === 0 && (
        <p className="today-routine__empty">
          오늘 실행할 루틴이 아직 없어요. 근무표를 등록하면 만들어 드려요.
        </p>
      )}

      <ul className="today-routine__list">
        {routines.map(({ id, title, detail, done }) => (
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

      <button type="button" className="today-routine__view-all" onClick={onViewAll}>
        전체 루틴 보러가기 →
      </button>
    </section>
  )
}

export default TodayRoutineList
