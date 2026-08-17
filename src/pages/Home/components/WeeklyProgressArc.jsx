import './WeeklyProgressArc.scss'

const VIEW_WIDTH = 280
const VIEW_HEIGHT = 168
const RADIUS = 120
const STROKE = 16
const CENTER_X = VIEW_WIDTH / 2
const CENTER_Y = 150
const ARC_PATH = `M${CENTER_X - RADIUS} ${CENTER_Y} A${RADIUS} ${RADIUS} 0 0 1 ${CENTER_X + RADIUS} ${CENTER_Y}`
const CIRCUMFERENCE = Math.PI * RADIUS

/**
 * 주간 루틴 실행률을 보여주는 반원형 게이지.
 * @param {number} percent 0~100
 * @param {string} label 게이지 아래 설명 문구
 * @param {() => void} onViewAll "전체 현황 보러가기" 클릭 핸들러
 */
function WeeklyProgressArc({ percent, label, onViewAll }) {
  const clamped = Math.min(100, Math.max(0, percent))
  const dash = (clamped / 100) * CIRCUMFERENCE

  return (
    <section className="weekly-progress">
      <svg
        className="weekly-progress__chart"
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        role="img"
        aria-label={`${label} ${clamped}%`}
      >
        <path
          className="weekly-progress__track"
          d={ARC_PATH}
          strokeWidth={STROKE}
          fill="none"
        />
        <path
          className="weekly-progress__fill"
          d={ARC_PATH}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
        />
        <text
          x={CENTER_X}
          y={CENTER_Y - 20}
          textAnchor="middle"
          className="weekly-progress__percent"
        >
          {clamped}
          <tspan className="weekly-progress__percent-sign">%</tspan>
        </text>
      </svg>

      <p className="weekly-progress__label">{label}</p>

      <button type="button" className="weekly-progress__link" onClick={onViewAll}>
        전체 현황 보러가기 →
      </button>
    </section>
  )
}

export default WeeklyProgressArc
