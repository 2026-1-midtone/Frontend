const SHIFT_TYPE_LABEL_BY_CODE = {
  DAY: '데이',
  EVENING: '이브닝',
  NIGHT: '나이트',
  OFF: '오프',
}

const SHIFT_TYPE_CODE_BY_LABEL = Object.fromEntries(
  Object.entries(SHIFT_TYPE_LABEL_BY_CODE).map(([code, label]) => [label, code]),
)

/** 서버 근무 유형 코드(DAY 등)를 화면에 쓰는 한글 라벨로 변환한다. */
export function shiftTypeLabel(code) {
  return SHIFT_TYPE_LABEL_BY_CODE[code] ?? code
}

/** 한글 라벨을 서버 근무 유형 코드로 변환한다. */
export function shiftTypeCode(label) {
  return SHIFT_TYPE_CODE_BY_LABEL[label] ?? label
}

/** "2026-08-01" -> "8월 1일 (토)" */
export function formatWorkDate(workDate) {
  const date = new Date(`${workDate}T00:00:00`)
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`
}
