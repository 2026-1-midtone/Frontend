import { apiGet, apiPost } from '@/lib/apiClient.js'

export function getCoachings(date, options) {
  return apiGet('/api/v1/coachings', { date }, options)
}

export function getCoachingCard(cardId, options) {
  return apiGet(`/api/v1/coachings/cards/${cardId}`, undefined, options)
}

export function regenerateCoachings(from, to, options) {
  return apiPost('/api/v1/coachings:regenerate', { from, to }, options)
}

export function getTransitions(from, to, options) {
  return apiGet('/api/v1/transitions', { from, to }, options)
}

export function getTransitionGuide(date, options) {
  return apiGet(`/api/v1/transitions/${date}`, undefined, options)
}
