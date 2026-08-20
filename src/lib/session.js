const ACCESS_TOKEN_KEY = 'shiftmate.accessToken'
const REFRESH_TOKEN_KEY = 'shiftmate.refreshToken'
const USER_KEY = 'shiftmate.user'
const SESSION_CHANGE_EVENT = 'shiftmate:session-change'

function notifySessionChange() {
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT))
}

function migrateLegacyToken(key) {
  const legacyToken = localStorage.getItem(key)

  if (!sessionStorage.getItem(key) && legacyToken) {
    sessionStorage.setItem(key, legacyToken)
  }

  localStorage.removeItem(key)
}

migrateLegacyToken(ACCESS_TOKEN_KEY)
migrateLegacyToken(REFRESH_TOKEN_KEY)

export function saveSession({ accessToken, refreshToken, user }) {
  saveTokens({ accessToken, refreshToken })

  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY)
}

export function hasSession() {
  return Boolean(getAccessToken() || getRefreshToken())
}

export function subscribeSession(listener) {
  window.addEventListener(SESSION_CHANGE_EVENT, listener)

  return () => window.removeEventListener(SESSION_CHANGE_EVENT, listener)
}

export function getSessionUser() {
  const storedUser = localStorage.getItem(USER_KEY)

  if (!storedUser) return null

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function saveTokens({ accessToken, refreshToken }) {
  if (accessToken) sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)

  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  notifySessionChange()
}

export function saveSessionUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  notifySessionChange()
}
