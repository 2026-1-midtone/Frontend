const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

let scriptPromise = null

function loadGoogleScript() {
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = GSI_SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('구글 로그인 스크립트를 불러오지 못했습니다.'))
    document.head.appendChild(script)
  })

  return scriptPromise
}

/**
 * 구글 계정 선택 화면을 띄워 ID 토큰(credential)을 받아온다.
 * 커스텀 디자인 버튼에서 호출할 수 있도록, 화면 밖에 감춘 구글 공식 버튼을
 * 렌더링해두고 클릭을 대신 전달하는 방식을 사용한다.
 */
export function requestGoogleIdToken() {
  return loadGoogleScript().then(
    () =>
      new Promise((resolve, reject) => {
        const google = window.google

        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            if (response?.credential) {
              resolve(response.credential)
            } else {
              reject(new Error('구글 로그인이 취소되었습니다.'))
            }
          },
        })

        const host = document.createElement('div')
        host.style.cssText = 'position:fixed; top:-9999px; left:-9999px;'
        document.body.appendChild(host)
        google.accounts.id.renderButton(host, { type: 'standard' })

        window.requestAnimationFrame(() => {
          const trigger = host.querySelector('div[role="button"]')
          if (!trigger) {
            host.remove()
            reject(new Error('구글 로그인 버튼을 열지 못했습니다.'))
            return
          }
          trigger.click()
          window.setTimeout(() => host.remove(), 5000)
        })
      }),
  )
}
