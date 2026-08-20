import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from './session.js'

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL
  ?? ''
).replace(/\/$/, '')

let reissueRequest = null

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

function makeUrl(path, query) {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

async function parseResponse(response) {
  if (response.status === 204) return null

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json().catch(() => null)
  }

  const text = await response.text()
  return text || null
}

async function reissueAccessToken() {
  if (reissueRequest) return reissueRequest

  const refreshToken = getRefreshToken()

  if (!refreshToken) return null

  reissueRequest = fetch(`${API_BASE_URL}/api/v1/auth/reissue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
    .then(async (response) => {
      const data = await parseResponse(response)

      if (!response.ok) throw new ApiError(data?.message, response.status, data)

      saveTokens(data)
      return data.accessToken
    })
    .catch(() => {
      clearSession()
      return null
    })
    .finally(() => {
      reissueRequest = null
    })

  return reissueRequest
}

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    query,
    body,
    headers: customHeaders,
    signal,
    auth = true,
    retryOnUnauthorized = true,
  } = options
  const headers = new Headers(customHeaders)
  let accessToken = getAccessToken()
  const isFormData = body instanceof FormData

  if (auth && !accessToken) {
    accessToken = await reissueAccessToken()

    if (!accessToken) {
      throw new ApiError('로그인이 필요합니다.', 401, {
        code: 'AUTH_REQUIRED',
      })
    }
  }

  if (auth && accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  if (body !== undefined && !isFormData) headers.set('Content-Type', 'application/json')

  let response

  try {
    response = await fetch(makeUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error

    throw new ApiError(
      '서버에 연결할 수 없습니다. 네트워크 또는 API 배포 상태를 확인해 주세요.',
      0,
    )
  }

  const data = await parseResponse(response)
  const isHtmlResponse = typeof data === 'string'
    && /^\s*<!doctype html/i.test(data)

  if (isHtmlResponse) {
    throw new ApiError(
      response.ok
        ? 'API 요청이 앱 화면으로 연결되었습니다. 배포 프록시 설정을 확인해 주세요.'
        : '백엔드 API 서버에 연결할 수 없습니다. 서버 배포와 프록시 주소를 확인해 주세요.',
      response.ok ? 502 : response.status,
    )
  }

  if (
    response.status === 401 &&
    auth &&
    retryOnUnauthorized &&
    !path.startsWith('/api/v1/auth/')
  ) {
    const renewedToken = await reissueAccessToken()

    if (renewedToken) {
      return apiRequest(path, { ...options, retryOnUnauthorized: false })
    }

    clearSession()
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message ?? '요청을 처리하지 못했습니다.',
      response.status,
      data,
    )
  }

  return data
}

export function apiGet(path, query, options) {
  return apiRequest(path, { ...options, method: 'GET', query })
}

export function apiPost(path, body, options) {
  return apiRequest(path, { ...options, method: 'POST', body })
}

export function apiPut(path, body, options) {
  return apiRequest(path, { ...options, method: 'PUT', body })
}

export function apiPatch(path, body, options) {
  return apiRequest(path, { ...options, method: 'PATCH', body })
}

export function apiDelete(path, body, options) {
  return apiRequest(path, { ...options, method: 'DELETE', body })
}
