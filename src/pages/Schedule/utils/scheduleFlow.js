const OCR_JOB_STORAGE_KEY = 'shiftmate.ocrJobId'
const OCR_MONTH_STORAGE_KEY = 'shiftmate.ocrMonth'
const CALENDAR_MONTH_STORAGE_KEY = 'shiftmate.scheduleCalendarMonth'

export function getCurrentYearMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function parseYearMonth(value) {
  const match = /^(\d{4})-(\d{2})$/.exec(value ?? '')
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  if (month < 1 || month > 12) return null

  return { year, month: month - 1 }
}

export function getStoredOcrJobId() {
  return sessionStorage.getItem(OCR_JOB_STORAGE_KEY)
}

export function getStoredOcrMonth() {
  return sessionStorage.getItem(OCR_MONTH_STORAGE_KEY)
}

export function saveOcrContext(jobId, targetMonth) {
  sessionStorage.setItem(OCR_JOB_STORAGE_KEY, String(jobId))
  sessionStorage.setItem(OCR_MONTH_STORAGE_KEY, targetMonth)
}

export function clearOcrContext() {
  sessionStorage.removeItem(OCR_JOB_STORAGE_KEY)
  sessionStorage.removeItem(OCR_MONTH_STORAGE_KEY)
}

export function rememberCalendarMonth(targetMonth) {
  if (parseYearMonth(targetMonth)) {
    sessionStorage.setItem(CALENDAR_MONTH_STORAGE_KEY, targetMonth)
  }
}

export function getRememberedCalendarMonth() {
  return sessionStorage.getItem(CALENDAR_MONTH_STORAGE_KEY)
}

export function resolveScheduleMonth(dates, fallbackMonth) {
  const workDate = dates.find((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.workDate ?? ''))
    ?.workDate

  return workDate?.slice(0, 7) ?? fallbackMonth ?? getCurrentYearMonth()
}
