import './NutrientGoalChips.scss'

/**
 * 관심 영양소 선택 칩.
 *
 * 여기서 고른 값이 곧 챗봇 제품 추천의 매칭 기준이 된다.
 * 하나도 고르지 않으면 서버는 추천 후보를 빈 목록으로 돌려준다.
 *
 * @param {{ code: string, label: string }[]} options
 * @param {string[]} selected
 * @param {(code: string) => void} onToggle
 */
function NutrientGoalChips({ options, selected, onToggle, disabled = false }) {
  return (
    <ul className="nutrient-goals">
      {options.map(({ code, label }) => {
        const isActive = selected.includes(code)

        return (
          <li key={code}>
            <button
              type="button"
              className={`nutrient-goals__chip${isActive ? ' nutrient-goals__chip--active' : ''}`}
              onClick={() => onToggle(code)}
              disabled={disabled}
              aria-pressed={isActive}
            >
              {label}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default NutrientGoalChips
