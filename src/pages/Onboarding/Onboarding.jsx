import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AssistantMascot from '@/components/common/AssistantMascot'
import { loginWithGoogle } from '../../lib/authApi.js'
import { requestGoogleIdToken } from '../../lib/googleAuth.js'
import { saveSession } from '../../lib/session.js'
import { PATH } from '../../routes/paths.js'
import sparkleIcon from '../../assets/sparkle.svg'
import './Onboarding.scss'

function Onboarding() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleGoogleLogin = async () => {
    setErrorMessage('')
    setIsLoading(true)

    try {
      const idToken = await requestGoogleIdToken()
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const { accessToken, refreshToken, user } = await loginWithGoogle(idToken, timezone)

      saveSession({ accessToken, refreshToken, user })
      const redirectPath = typeof location.state?.from === 'string'
        && location.state.from.startsWith('/')
        ? location.state.from
        : PATH.HOME

      navigate(redirectPath, { replace: true })
    } catch (error) {
      setErrorMessage(error.message || '로그인에 실패했습니다. 다시 시도해 주세요.')
      setIsLoading(false)
    }
  }

  return (
    <div className="onboarding">
      <div className="onboarding__brand">
        <AssistantMascot
          className="onboarding__character"
          variant="onboarding"
        />

        <p className="onboarding__tagline">뒤바뀐 근무시간에도, 나만의 루틴을</p>

        <h1 className="onboarding__title">
          <span className="onboarding__title-text">시프트메이트</span>
          <img
            className="onboarding__sparkle"
            src={sparkleIcon}
            alt=""
            width={28}
            height={28}
          />
        </h1>
      </div>

      <div className="onboarding__actions">
        {errorMessage && <p className="onboarding__error">{errorMessage}</p>}

        <button
          type="button"
          className="onboarding__login"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '구글 로그인으로 시작하기'}
        </button>
      </div>
    </div>
  )
}

export default Onboarding
