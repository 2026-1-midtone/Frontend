import { apiGet, apiPatch } from '@/lib/apiClient.js'

export function getTodayRoutines(date, options) {
  return apiGet('/api/v1/routines', { date }, options)
}

export function updateRoutineTask(taskId, status, options) {
  return apiPatch(`/api/v1/routines/tasks/${taskId}`, { status }, options)
}

export function getRoutineReport(period = '7d', options) {
  return apiGet('/api/v1/routines/report', { period }, options)
}

export function getDailyRoutineSummary(date, options) {
  return apiGet('/api/v1/routines/summary', { date }, options)
}
