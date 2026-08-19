import { apiDelete, apiGet, apiPatch, apiPut } from '@/lib/apiClient.js'

export function getMyProfile(options) {
  return apiGet('/api/v1/users/me', undefined, options)
}

export function updateMyProfile(body, options) {
  return apiPatch('/api/v1/users/me', body, options)
}

export function deleteMyAccount(options) {
  return apiDelete('/api/v1/users/me', undefined, options)
}

export function getPersonalizationSettings(options) {
  return apiGet('/api/v1/users/me/settings', undefined, options)
}

export function savePersonalizationSettings(settings, options) {
  return apiPut('/api/v1/users/me/settings', settings, options)
}

export function getNotificationSettings(options) {
  return apiGet('/api/v1/users/me/notification-settings', undefined, options)
}

export function saveNotificationSettings(settings, options) {
  return apiPut('/api/v1/users/me/notification-settings', { settings }, options)
}
