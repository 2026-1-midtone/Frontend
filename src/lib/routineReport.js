const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

/** 완료율(0~1)을 화면에 쓰는 정수 퍼센트로. 아직 기록이 없으면 0에서 시작한다. */
export function toPercent(completionRate) {
  return Math.round((completionRate ?? 0) * 100)
}

/** GET /api/v1/routines/report 의 byCategory[]를 항목별 완료율 막대로 옮긴다. */
export function toCategoryRates(byCategory, labelByCategory) {
  return (byCategory ?? []).map((rate) => ({
    id: rate.category,
    label: labelByCategory[rate.category] ?? rate.category,
    value: toPercent(rate.completionRate),
  }))
}

/**
 * 최근 며칠간의 완료율 그래프. 요일 이름은 응답 날짜에서 뽑는다.
 * 루틴이 아예 없던 날과 있었지만 하나도 안 한 날은 둘 다 0%라서 hasTasks로 구분한다.
 */
export function toWeeklyPoints(byDay) {
  const points = byDay ?? []

  return points.map((day, index) => ({
    date: day.date,
    label: WEEKDAY_LABELS[new Date(`${day.date}T00:00:00`).getDay()],
    percent: toPercent(day.completionRate),
    hasTasks: day.total > 0,
    isLast: index === points.length - 1,
  }))
}
