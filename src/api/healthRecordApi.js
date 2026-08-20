import { apiGet, apiPost } from '@/lib/apiClient.js'

export function createSleepLog(sleepLog, options) {
  return apiPost('/api/v1/sleep-logs', sleepLog, options)
}

export function getSleepLogs(from, to, options) {
  return apiGet('/api/v1/sleep-logs', { from, to }, options)
}

export function createCaffeineIntake(intake, options) {
  return apiPost('/api/v1/caffeine-intakes', intake, options)
}

export function getCaffeineIntakes(from, to, options) {
  return apiGet('/api/v1/caffeine-intakes', { from, to }, options)
}
