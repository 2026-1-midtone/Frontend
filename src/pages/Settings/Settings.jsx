import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavRow from '../../components/common/NavRow.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import AiAssistantBubble from '../../components/common/AiAssistantBubble.jsx' // AI 비서 컴포넌트 추가
import avatarPlaceholder from '../../assets/avatar-placeholder.svg'
import { ApiError } from '../../lib/apiClient.js'
import { logout } from '../../lib/authApi.js'
import { clearSession, getRefreshToken } from '../../lib/session.js'
import { getMe, getNotificationSettings, saveNotificationSettings, updateMe } from '../../lib/userApi.js'
import { PATH } from '../../routes/paths.js'
import ProfileCard from './components/ProfileCard.jsx'
import ToggleRow from './components/ToggleRow.jsx'
import './Settings.scss'

const FALLBACK_PROFILE = {
  avatarSrc: avatarPlaceholder,
  name: '',
  nameSuffix: '(님)',
  email: '',
}

const POLICY_LINKS = ['개인정보 처리방침', '서비스 이용약관', '데이터 삭제 요청']

function alertsFromSettings(settings) {
  const byType = Object.fromEntries(settings.map((item) => [item.type, item]))
  return {
    napAlarm: byType.NAP?.enabled ?? false,
    caffeineCutoffAlarm: byType.CAFFEINE_CUTOFF?.enabled ?? false,
    lightExposureReminder: byType.LIGHT_EXPOSURE?.enabled ?? false,
  }
}

function settingsFromAlerts(alerts) {
  return [
    { type: 'NAP', enabled: alerts.napAlarm, customTime: null },
    { type: 'CAFFEINE_CUTOFF', enabled: alerts.caffeineCutoffAlarm, customTime: null },
    { type: 'LIGHT_EXPOSURE', enabled: alerts.lightExposureReminder, customTime: null },
  ]
}

function Settings() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(FALLBACK_PROFILE)
  const [alerts, setAlerts] = useState({
    napAlarm: true,
    caffeineCutoffAlarm: false,
    lightExposureReminder: false,
  })
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    getMe()
      .then((user) => {
        if (!isMounted) return
        setProfile({
          avatarSrc: user.profileImageUrl || avatarPlaceholder,
          name: user.nickname,
          nameSuffix: '(님)',
          email: user.email,
        })
      })
      .catch((error) => {
        if (!isMounted) return
        setErrorMessage(error instanceof ApiError ? error.message : '내 정보를 불러오지 못했습니다.')
      })

    getNotificationSettings()
      .then((data) => {
        if (!isMounted) return
        setAlerts(alertsFromSettings(data.settings))
      })
      .catch(() => {
        // 알림 설정은 조회 실패해도 화면 진입 자체를 막지 않는다.
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleSaveProfile = async (name) => {
    try {
      await updateMe({ nickname: name })
      setProfile((prev) => ({ ...prev, name }))
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : '이름을 저장하지 못했습니다.')
    }
  }

  const handleToggleAlert = (key) => async (checked) => {
    const next = { ...alerts, [key]: checked }
    setAlerts(next)

    try {
      await saveNotificationSettings(settingsFromAlerts(next))
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : '알림 설정을 저장하지 못했습니다.')
    }
  }

  const handleLogout = async () => {
    try {
      await logout(getRefreshToken())
    } catch {
      // 로그아웃은 서버 호출이 실패해도 로컬 세션은 정리하고 온보딩으로 보낸다.
    }
    clearSession()
    navigate(PATH.ONBOARDING)
  }

  return (
    <div className="settings">
      <PageHeader title="설정" subtitle="오늘 하루는 어떤 하루였나요?" />

      <div className="settings__card">
        {errorMessage && <p className="settings__error">{errorMessage}</p>}

        <ProfileCard
          avatarSrc={profile.avatarSrc}
          name={profile.name}
          nameSuffix={profile.nameSuffix}
          email={profile.email}
          onSave={handleSaveProfile}
        />

        <div className="settings__divider" aria-hidden="true" />

        <section className="settings__section">
          <h2 className="settings__section-title">개인화 옵션</h2>
          <NavRow
            title="카페인 & 낮잠 설정"
            description="카페인 민감도 · 낮잠 길이 · 최대 횟수"
            onClick={() => navigate(PATH.SETTINGS_PERSONALIZATION)}
          />
        </section>

        <section className="settings__section">
          <h2 className="settings__section-title">알림 설정</h2>
          <div className="settings__toggle-list">
            <ToggleRow
              label="낮잠 알림"
              checked={alerts.napAlarm}
              onChange={handleToggleAlert('napAlarm')}
            />
            <ToggleRow
              label="카페인 컷오프 알림"
              checked={alerts.caffeineCutoffAlarm}
              onChange={handleToggleAlert('caffeineCutoffAlarm')}
            />
            <ToggleRow
              label="빛 노출 리마인더"
              checked={alerts.lightExposureReminder}
              onChange={handleToggleAlert('lightExposureReminder')}
            />
          </div>
        </section>

        <section className="settings__section">
          <h2 className="settings__section-title">계정 설정</h2>
          <NavRow
            title="계정설정"
            description="비밀번호 변경 및 연결 계정"
            onClick={() => navigate(PATH.SETTINGS_ACCOUNT)}
          />
          <NavRow
            title="로그아웃"
            description="이 기기에서 로그아웃합니다"
            onClick={handleLogout}
          />
        </section>

        <footer className="settings__footer">
          <div className="settings__policy-links">
            {POLICY_LINKS.map((label) => (
              // TODO: 실제 정책 문서 화면이 생기면 연결한다.
              <button type="button" key={label} className="settings__policy-link">
                {label}
              </button>
            ))}
          </div>
          <p className="settings__disclaimer">
            참고용 정보이며 개인 상황에 따라 다를 수 있습니다. 의료적 판단을
            대체하지 않습니다.
          </p>
        </footer>
      </div>

      <AiAssistantBubble onOpen={() => navigate(PATH.ASSISTANT)} />
    </div>
  )
}

export default Settings
