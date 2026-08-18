import './ShiftTag.scss'

// 근무 유형 → 색상 매핑. 값이 정책으로 확정되면 상수를 공유 파일로 옮긴다.
const TONE_BY_SHIFT_TYPE = {
  오프: 'off',
  나이트: 'night',
  데이: 'day',
  이브닝: 'evening',
}

// 캘린더 셀처럼 좁은 공간에서 쓰는 축약 라벨.
const SHORT_LABEL_BY_SHIFT_TYPE = {
  이브닝: '이브',
}

/**
 * 근무 유형을 색으로 구분해 보여주는 작은 태그.
 * 캘린더 셀과 날짜별 일정 리스트에서 함께 쓴다.
 * @param {string} shiftType
 * @param {boolean} compact true면 좁은 공간용 축약 라벨을 쓴다 (캘린더 셀 전용)
 */
function ShiftTag({ shiftType, compact = false }) {
  const tone = TONE_BY_SHIFT_TYPE[shiftType] ?? 'off'
  const label = (compact && SHORT_LABEL_BY_SHIFT_TYPE[shiftType]) || shiftType

  return <span className={`shift-tag shift-tag--${tone}`}>{label}</span>
}

export default ShiftTag
