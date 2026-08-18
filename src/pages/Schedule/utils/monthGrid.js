const DAY_MS = 24 * 60 * 60 * 1000

/**
 * 날짜를 "YYYY-MM-DD" 키로 변환한다. shiftsByDate의 키와 맞춰 쓴다.
 * @param {Date} date
 */
export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 주어진 연/월(0-indexed)의 달력을 6주 x 7일 그리드로 만든다.
 * 이전/다음 달의 날짜도 채워 항상 완전한 주 단위 그리드가 되게 한다.
 * @param {number} year
 * @param {number} month 0(1월) ~ 11(12월)
 */
export function buildMonthGrid(year, month) {
  const firstDayOfMonth = new Date(year, month, 1)
  const startWeekday = firstDayOfMonth.getDay() // 0(일) ~ 6(토)
  const gridStart = new Date(year, month, 1 - startWeekday)

  const weeks = []
  let cursor = gridStart

  for (let week = 0; week < 6; week += 1) {
    const days = []
    for (let day = 0; day < 7; day += 1) {
      days.push({
        day: cursor.getDate(),
        key: toDateKey(cursor),
        inCurrentMonth: cursor.getMonth() === month,
      })
      cursor = new Date(cursor.getTime() + DAY_MS)
    }
    weeks.push(days)
  }

  return weeks
}
