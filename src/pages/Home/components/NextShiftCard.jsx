import './NextShiftCard.scss'

/**
 * 다음 근무까지 남은 시간 카드.
 * @param {string} remainingLabel 남은 시간 표기 (예: "n시간 n분")
 * @param {number} progress 오늘 만들어진 루틴 중 완료한 비율 0~100. 아직 없으면 0에서 시작한다.
 */
function NextShiftCard({ remainingLabel, progress }) {
  const clamped = Math.min(100, Math.max(0, progress))

  return (
    <section className="next-shift-card">
      <p className="next-shift-card__label">
        다음 근무까지 -{' '}
        <strong className="next-shift-card__remaining">{remainingLabel}</strong>
      </p>

      <div
        className="next-shift-card__track"
        role="progressbar"
        aria-label="오늘 루틴 실행률"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="next-shift-card__fill"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </section>
  )
}

export default NextShiftCard
