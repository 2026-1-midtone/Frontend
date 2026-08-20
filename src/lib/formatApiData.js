const SHIFT_LABELS = {
  DAY: '데이',
  EVENING: '이브닝',
  NIGHT: '나이트',
  OFF: '오프',
}

const COACHING_CATEGORY_LABELS = {
  SLEEP: '수면',
  WAKE: '기상',
  LIGHT: '빛 노출',
  LIGHT_EXPOSURE: '빛 노출',
  CAFFEINE: '카페인',
  CAFFEINE_CUTOFF: '카페인 컷오프',
  NAP: '낮잠',
  MEAL: '식사',
  HYDRATION: '수분 보충',
}

export const SHIFT_VALUES = Object.keys(SHIFT_LABELS)

export function formatShiftType(shiftType) {
  return SHIFT_LABELS[shiftType] ?? shiftType ?? '근무 미정'
}

export function toShiftType(label) {
  return Object.entries(SHIFT_LABELS).find(([, value]) => value === label)?.[0] ?? label
}

export function formatCoachingCategory(category) {
  return COACHING_CATEGORY_LABELS[category] ?? category ?? '코칭'
}

export function formatTimeRange(start, end) {
  if (!start && !end) return ''
  if (!end) return start
  return `${start} – ${end}`
}

export function formatClock(value) {
  if (!value) return ''
  if (!value.includes('T')) return value.slice(0, 5)

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export function formatDateTimeRange(start, end) {
  return formatTimeRange(formatClock(start), formatClock(end))
}

export function formatDate(dateString, withWeekday = true) {
  if (!dateString) return ''

  const date = new Date(`${dateString}T00:00:00`)

  if (Number.isNaN(date.getTime())) return dateString

  const base = `${date.getMonth() + 1}월 ${date.getDate()}일`
  if (!withWeekday) return base

  return `${base} (${['일', '월', '화', '수', '목', '금', '토'][date.getDay()]})`
}

export function toDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function addDays(dateString, amount) {
  const date = new Date(`${dateString}T00:00:00`)

  if (Number.isNaN(date.getTime())) return dateString

  date.setDate(date.getDate() + amount)
  return toDateString(date)
}

export function getMonthRange(year, month) {
  return {
    from: toDateString(new Date(year, month, 1)),
    to: toDateString(new Date(year, month + 1, 0)),
  }
}

export function toLocalDateTimeInput(date) {
  const pad = (value) => String(value).padStart(2, '0')

  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    'T',
    pad(date.getHours()),
    ':',
    pad(date.getMinutes()),
  ].join('')
}

export function toOffsetDateTime(value) {
  const date = new Date(value)
  const offsetMinutes = -date.getTimezoneOffset()
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absoluteOffset = Math.abs(offsetMinutes)
  const offsetHours = String(Math.floor(absoluteOffset / 60)).padStart(2, '0')
  const offsetRemainder = String(absoluteOffset % 60).padStart(2, '0')

  return `${value}:00${sign}${offsetHours}:${offsetRemainder}`
}

export function getMinutesUntil(dateTime) {
  if (!dateTime) return null

  return Math.max(0, Math.ceil((new Date(dateTime).getTime() - Date.now()) / 60000))
}

export function formatRemainingMinutes(minutes) {
  if (minutes === null || minutes === undefined) return '일정 미정'

  const safeMinutes = Math.max(0, Math.round(minutes))
  return `${Math.floor(safeMinutes / 60)}시간 ${safeMinutes % 60}분`
}
