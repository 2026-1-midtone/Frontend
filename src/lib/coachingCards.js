/**
 * 코칭 시간대가 이미 지났는지. 지난 카드는 목록에서 빼지 않고 흐리게 보여준다.
 * 종료 시각을 모르면(구버전 응답) 판단하지 않고 그대로 보여준다.
 */
export function isPastWindow(windowEnd, now = new Date()) {
  if (!windowEnd) return false

  const end = new Date(windowEnd)

  return !Number.isNaN(end.getTime()) && end <= now
}
