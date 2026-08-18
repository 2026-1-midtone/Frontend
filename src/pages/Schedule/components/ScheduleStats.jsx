import './ScheduleStats.scss'

/**
 * 인식 통계 3항목 (확인완료 / 수정필요 / 총 근무일).
 * @param {{ confirmed: number, needsReview: number, total: number }} stats
 * @param {string} caption 통계 아래 안내 문구
 */
function ScheduleStats({ stats, caption }) {
  const { confirmed, needsReview, total } = stats

  return (
    <div className="schedule-stats">
      <ul className="schedule-stats__list">
        <li className="schedule-stats__item">
          <span className="schedule-stats__label">확인완료</span>
          <span className="schedule-stats__value">{confirmed}일</span>
        </li>
        <li className="schedule-stats__item">
          <span className="schedule-stats__label">수정필요</span>
          <span className="schedule-stats__value">{needsReview}일</span>
        </li>
        <li className="schedule-stats__item">
          <span className="schedule-stats__label">총 근무일</span>
          <span className="schedule-stats__value is-accent">{total}일</span>
        </li>
      </ul>

      {caption && <p className="schedule-stats__caption">{caption}</p>}
    </div>
  )
}

export default ScheduleStats
