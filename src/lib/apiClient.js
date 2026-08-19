import { clearSession, getAccessToken, getRefreshToken, saveSession } from './session.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function parseBody(response) {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

async function rawRequest(path, { method, body, isFormData, accessToken }) {
  const headers = {}
  if (!isFormData && body !== undefined) headers['Content-Type'] = 'application/json'
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await parseBody(response)
  return { response, data }
}

// 인증이 필요한 요청이 401을 받으면 리프레시 토큰으로 한 번만 재발급을 시도한다.
async function reissueAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  const { response, data } = await rawRequest('/api/v1/auth/reissue', {
    method: 'POST',
    body: { refreshToken },
  })

  if (!response.ok) return null

  saveSession({ accessToken: data.accessToken, refreshToken: data.refreshToken })
  return data.accessToken
}

/**
 * @param {string} path
 * @param {{ method?: string, body?: unknown, auth?: boolean, isFormData?: boolean }} [options]
 */
export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, auth = false, isFormData = false } = options
  const accessToken = auth ? getAccessToken() : null

  let { response, data } = await rawRequest(path, { method, body, isFormData, accessToken })

  if (auth && response.status === 401 && accessToken) {
    const reissued = await reissueAccessToken()
    if (reissued) {
      ;({ response, data } = await rawRequest(path, { method, body, isFormData, accessToken: reissued }))
    } else {
      clearSession()
    }
  }

  if (response.status === 204) return null

  if (!response.ok) {
    throw new ApiError(data?.message ?? '요청을 처리하지 못했습니다.', response.status)
  }

  return data
}

export const apiGet = (path, options) => apiRequest(path, { ...options, method: 'GET' })
export const apiPost = (path, body, options) => apiRequest(path, { ...options, method: 'POST', body })
export const apiPut = (path, body, options) => apiRequest(path, { ...options, method: 'PUT', body })
export const apiPatch = (path, body, options) => apiRequest(path, { ...options, method: 'PATCH', body })
export const apiDelete = (path, options) => apiRequest(path, { ...options, method: 'DELETE' })
