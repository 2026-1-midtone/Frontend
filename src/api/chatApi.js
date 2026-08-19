import { apiGet, apiPost } from '@/lib/apiClient.js'

export function getChatMessages({ cursor, size = 20 } = {}, options) {
  return apiGet('/api/v1/chat/messages', { cursor, size }, options)
}

export function sendChatMessage(content, options) {
  return apiPost('/api/v1/chat/messages', { content }, options)
}

export function submitChatFeedback(messageId, feedback, options) {
  return apiPost(`/api/v1/chat/messages/${messageId}/feedback`, { feedback }, options)
}
