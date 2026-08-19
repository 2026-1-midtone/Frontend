const ACCESS_TOKEN_KEY = 'shiftmate.accessToken'
const REFRESH_TOKEN_KEY = 'shiftmate.refreshToken'
const USER_KEY = 'shiftmate.user'

export function saveSession({ accessToken, refreshToken, user }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}
