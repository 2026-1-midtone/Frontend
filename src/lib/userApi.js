import { apiDelete, apiGet, apiPatch, apiPut } from './apiClient.js'

export function getMe() {
  return apiGet('/api/v1/users/me', { auth: true })
}

/** @param {{ nickname?: string, timezone?: string }} patch */
export function updateMe(patch) {
  return apiPatch('/api/v1/users/me', patch, { auth: true })
}

export function deleteMe() {
  return apiDelete('/api/v1/users/me', { auth: true })
}

export function getPersonalizationSettings() {
  return apiGet('/api/v1/users/me/settings', { auth: true })
}

/**
 * @param {{ caffeineDailyMg?: number, caffeineSensitivity?: string, preferredNapMinutes: number, maxNapsPerDay: number }} settings
 */
export function savePersonalizationSettings(settings) {
  return apiPut('/api/v1/users/me/settings', settings, { auth: true })
}

export function getNotificationSettings() {
  return apiGet('/api/v1/users/me/notification-settings', { auth: true })
}

/** @param {{ type: string, enabled: boolean, customTime: string | null }[]} settings */
export function saveNotificationSettings(settings) {
  return apiPut('/api/v1/users/me/notification-settings', { settings }, { auth: true })
}
