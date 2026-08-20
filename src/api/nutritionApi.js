import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/apiClient.js'

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

// 여기에 등록된 영양소가 비어 있으면 챗봇의 제품 추천이 항상 빈 목록으로 끝난다.
export function getNutrientNeeds(options) {
  return apiGet('/api/v1/users/me/nutrient-needs', undefined, options)
}

// PUT 은 전체 교체라서 남길 항목까지 모두 담아 보내야 한다.
export function saveNutrientNeeds(nutrientCodes, options) {
  return apiPut(
    '/api/v1/users/me/nutrient-needs',
    { needs: nutrientCodes.map((nutrientCode) => ({ nutrientCode })) },
    options,
  )
}

export function getNutritionProductRecommendations(options) {
  return apiGet('/api/v1/users/me/nutrition-product-recommendations', undefined, options)
}
