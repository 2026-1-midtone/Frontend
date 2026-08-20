import './NutritionContentCard.scss'

const DEFAULT_DISCLAIMER =
  '이 정보는 일반적인 참고용이며, 개인 체질이나 건강 상태에 따라 다를 수 있습니다.'

/**
 * 영양 정보 / 레시피 공용 카드.
 *
 * 목록 API 는 title·summary 까지만 주고 본문은 상세 API 에 있어서,
 * 펼쳤을 때 받아온 body 를 부모가 내려주는 구조다.
 *
 * @param {string[]} tags 상단 배지 (타이밍, 분류 등)
 * @param {string} body 상세 API 로 받아온 본문. 아직 없으면 로딩 문구를 보여준다.
 */
function NutritionContentCard({
  title,
  summary,
  tags = [],
  body,
  disclaimer,
  isExpanded = false,
  onToggleExpand,
  isFavorited = false,
  onToggleFavorite,
}) {
  return (
    <article className="nutrition-card">
      <div className="nutrition-card__head">
        <h3 className="nutrition-card__title">{title}</h3>
        <button
          type="button"
          className={`nutrition-card__favorite${isFavorited ? ' nutrition-card__favorite--active' : ''}`}
          onClick={onToggleFavorite}
          aria-pressed={isFavorited}
        >
          {isFavorited ? '즐겨찾기 해제' : '즐겨찾기'}
        </button>
      </div>

      {tags.length > 0 && (
        <ul className="nutrition-card__tags">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}

      <p className="nutrition-card__summary">{summary}</p>

      <button
        type="button"
        className="nutrition-card__more"
        onClick={onToggleExpand}
        aria-expanded={isExpanded}
      >
        {isExpanded ? '접기' : '자세히 보기'}
      </button>

      {isExpanded && (
        <div className="nutrition-card__body">
          {body
            ? body
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line) => <p key={line}>{line}</p>)
            : <p>내용을 불러오는 중이에요.</p>}
        </div>
      )}

      <p className="nutrition-card__disclaimer">
        ※ {disclaimer || DEFAULT_DISCLAIMER}
      </p>
    </article>
  )
}

export default NutritionContentCard
