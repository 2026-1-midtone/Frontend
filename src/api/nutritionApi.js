import { apiDelete, apiGet, apiPost } from '@/lib/apiClient.js'

export function getNutritionContents(filters = {}, options) {
  return apiGet('/api/v1/nutrition-contents', filters, options)
}

export function getNutritionContent(contentId, options) {
  return apiGet(`/api/v1/nutrition-contents/${contentId}`, undefined, options)
}

export function getFavoriteContents(page = 0, options) {
  return apiGet('/api/v1/users/me/favorites', { page }, options)
}

export function addFavoriteContent(contentId, options) {
  return apiPost(`/api/v1/nutrition-contents/${contentId}/favorite`, undefined, options)
}

export function removeFavoriteContent(contentId, options) {
  return apiDelete(`/api/v1/nutrition-contents/${contentId}/favorite`, undefined, options)
}
