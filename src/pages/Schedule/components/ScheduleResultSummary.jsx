import './ScheduleResultSummary.scss'

/**
 * "인식 완료 n일 중 n일 확인됨" / "수정 필요 항목 n개 남음" 요약.
 * @param {number} total
 * @param {number} confirmed
 * @param {number} needsReview
 */
function ScheduleResultSummary({ total, confirmed, needsReview }) {
  return (
    <dl className="schedule-result-summary">
      <div className="schedule-result-summary__row">
        <dt>인식 완료</dt>
        <dd>
          {total}일 중 {confirmed}일 확인됨
        </dd>
      </div>
      <div className="schedule-result-summary__row">
        <dt>수정 필요 항목</dt>
        {needsReview > 0 ? (
          <dd className="is-accent">{needsReview}개 남음</dd>
        ) : (
          <dd className="is-success">해당사항 없음</dd>
        )}
      </div>
    </dl>
  )
}

export default ScheduleResultSummary
