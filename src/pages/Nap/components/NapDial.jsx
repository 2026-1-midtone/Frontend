import './NapDial.scss'

const SIZE = 220
const STROKE = 14
const RADIUS = (SIZE - STROKE) / 2
const CENTER = SIZE / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * 낮잠 남은 시간을 보여주는 원형 게이지.
 *
 * @param {number} progress 0~1, 경과 비율
 * @param {string} value 가운데 큰 글씨 (남은 시간 또는 예정 시간)
 * @param {string} caption 값 아래 보조 문구
 * @param {boolean} isDone 예정 시간이 지났는지
 */
function NapDial({ progress, value, caption, isDone = false }) {
  const clamped = Math.min(1, Math.max(0, progress))

  return (
    <div className={`nap-dial${isDone ? ' nap-dial--done' : ''}`}>
      <svg
        className="nap-dial__chart"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`${caption} 중 ${value} 남음`}
      >
        <circle
          className="nap-dial__track"
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          strokeWidth={STROKE}
          fill="none"
        />
        <circle
          className="nap-dial__fill"
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${clamped * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          transform={`rotate(-90 ${CENTER} ${CENTER})`}
        />
      </svg>

      <div className="nap-dial__center">
        <strong className="nap-dial__value">{value}</strong>
        <span className="nap-dial__caption">{caption}</span>
      </div>
    </div>
  )
}

export default NapDial
