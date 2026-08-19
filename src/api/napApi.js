import { apiGet, apiPatch, apiPost } from '@/lib/apiClient.js'

export function getActiveNap(options) {
  return apiGet('/api/v1/naps/active', undefined, options)
}

export function startNap(plannedMinutes, options) {
  const body = plannedMinutes ? { plannedMinutes } : {}
  return apiPost('/api/v1/naps', body, options)
}

export function finishNap(napId, status, options) {
  return apiPatch(`/api/v1/naps/${napId}`, { status }, options)
}
