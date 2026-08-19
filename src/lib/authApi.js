import { apiPost } from './apiClient.js'

/**
 * @param {string} idToken 구글 OAuth ID 토큰
 * @param {string} [timezone] 사용자 타임존 (미전달 시 서버 기본값 Asia/Seoul)
 */
export function loginWithGoogle(idToken, timezone) {
  return apiPost('/api/v1/auth/google', { idToken, timezone })
}

/** @param {string} refreshToken */
export function logout(refreshToken) {
  return apiPost('/api/v1/auth/logout', { refreshToken }, { auth: true })
}

/** @param {string} refreshToken */
export function reissueToken(refreshToken) {
  return apiPost('/api/v1/auth/reissue', { refreshToken })
}
