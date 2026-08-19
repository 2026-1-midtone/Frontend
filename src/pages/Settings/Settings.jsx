import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getMyProfile,
  getNotificationSettings,
  saveNotificationSettings,
  updateMyProfile,
} from '@/api/settingsApi.js'
import NavRow from '../../components/common/NavRow.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import avatarPlaceholder from '../../assets/avatar-placeholder.svg'
import { PATH } from '../../routes/paths.js'
import ProfileCard from './components/ProfileCard.jsx'
import ToggleRow from './components/ToggleRow.jsx'
import './Settings.scss'

// 로그인 연동 전까지 사용하는 목업 프로필.
const MOCK_PROFILE = {
  avatarSrc: avatarPlaceholder,
  name: '근로자1',
  nameSuffix: '(님)',
  email: '2453082@hansung.ac.kr',
}

const POLICY_LINKS = ['개인정보 처리방침', '서비스 이용약관', '데이터 삭제 요청']

function Settings() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(MOCK_PROFILE)
  const [errorMessage, setErrorMessage] = useState('')
  const [alerts, setAlerts] = useState({
    napAlarm: true,
    caffeineCutoffAlarm: false,
    lightExposureReminder: false,
  })

  useEffect(() => {
    const controller = new AbortController()
    const options = { signal: controller.signal }

    Promise.allSettled([
      getMyProfile(options),
      getNotificationSettings(options),
    ]).then(([profileResult, notificationResult]) => {
      if (profileResult.status === 'fulfilled') {
        setProfile({
          avatarSrc: profileResult.value.profileImageUrl || avatarPlaceholder,
          name: profileResult.value.nickname,
          nameSuffix: '(님)',
          email: profileResult.value.email,
        })
      }

      if (notificationResult.status === 'fulfilled') {
        const byType = Object.fromEntries(
          notificationResult.value.settings.map((item) => [item.type, item.enabled]),
        )
        setAlerts({
          napAlarm: Boolean(byType.NAP),
          caffeineCutoffAlarm: Boolean(byType.CAFFEINE_CUTOFF),
          lightExposureReminder: Boolean(byType.LIGHT_EXPOSURE),
        })
      }
    })

    return () => controller.abort()
  }, [])

  const handleToggleAlert = (key) => (checked) => {
    const next = { ...alerts, [key]: checked }
    setAlerts(next)
    setErrorMessage('')

    saveNotificationSettings([
      { type: 'NAP', enabled: next.napAlarm, customTime: null },
      { type: 'CAFFEINE_CUTOFF', enabled: next.caffeineCutoffAlarm, customTime: null },
      { type: 'LIGHT_EXPOSURE', enabled: next.lightExposureReminder, customTime: null },
    ]).catch((error) => {
      setAlerts(alerts)
      setErrorMessage(error.message)
    })
  }

  const handleSaveProfile = async (nickname) => {
    try {
      await updateMyProfile({ nickname })
      setProfile((current) => ({ ...current, name: nickname }))
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <div className="settings">
      <PageHeader title="설정" subtitle="오늘 하루는 어떤 하루였나요?" />

      <div className="settings__card">
        <ProfileCard
          avatarSrc={profile.avatarSrc}
          name={profile.name}
          nameSuffix={profile.nameSuffix}
          email={profile.email}
          onSave={handleSaveProfile}
        />

        {errorMessage && <p className="settings__error" role="alert">{errorMessage}</p>}

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

    </div>
  )
}

export default Settings
