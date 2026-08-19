import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteMyAccount, getMyProfile } from '@/api/settingsApi.js'
import PageHeader from '../../components/common/PageHeader.jsx'
import avatarPlaceholder from '../../assets/avatar-placeholder.svg'
import { PATH } from '../../routes/paths.js'
import { clearSession } from '../../lib/session.js'
import DangerZoneCard from './components/DangerZoneCard.jsx'
import ProfileCard from './components/ProfileCard.jsx'
import './AccountSettings.scss'

const MOCK_PROFILE = {
  avatarSrc: avatarPlaceholder,
  name: '근로자1',
  nameSuffix: '(님)',
  email: '2453082@hansung.ac.kr',
  joinedAt: '25.12.12',
}

const DELETE_ITEMS = [
  '업로드한 근무표 이미지 및 OCR 인식 결과',
  '근무 일정 및 캘린더',
  '루틴 체크인 기록',
  '챗봇 대화 내역',
  '저장된 레시피 및 선호도',
  '코칭 알림 설정 및 개인 습관 정보',
]

const POLICY_LINKS = ['개인정보 처리방침', '서비스 이용약관']

function AccountSettings() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(MOCK_PROFILE)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    getMyProfile({ signal: controller.signal })
      .then((data) => setProfile({
        avatarSrc: data.profileImageUrl || avatarPlaceholder,
        name: data.nickname,
        nameSuffix: '(님)',
        email: data.email,
        joinedAt: data.createdAt?.slice(0, 10),
      }))
      .catch(() => {})

    return () => controller.abort()
  }, [])

  const handleDeleteAllData = async () => {
    const confirmed = window.confirm('계정과 모든 데이터를 삭제할까요? 이 작업은 되돌릴 수 없습니다.')
    if (!confirmed) return

    try {
      await deleteMyAccount()
      clearSession()
      navigate(PATH.ONBOARDING)
    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return (
    <div className="account-settings">
      <PageHeader
        title="계정 설정"
        subtitle="오늘 하루는 어떤 하루였나요?"
        onSettingsClick={() => navigate(PATH.SETTINGS)}
      />

      <div className="account-settings__card">
        <ProfileCard
          avatarSrc={profile.avatarSrc}
          name={profile.name}
          nameSuffix={profile.nameSuffix}
          email={profile.email}
          joinedAt={profile.joinedAt}
          readOnly
        />

        {errorMessage && <p className="account-settings__error" role="alert">{errorMessage}</p>}

        <div className="account-settings__divider" aria-hidden="true" />

        <section className="account-settings__section">
          <h2 className="account-settings__title">데이터 관리</h2>
          <DangerZoneCard items={DELETE_ITEMS} onDelete={handleDeleteAllData} />
        </section>

        <footer className="account-settings__footer">
          <div className="account-settings__policy-links">
            {POLICY_LINKS.map((label) => (
              // TODO: 실제 정책 문서 화면이 생기면 연결한다.
              <button
                type="button"
                key={label}
                className="account-settings__policy-link"
              >
                {label}
              </button>
            ))}
          </div>

          <p className="account-settings__disclaimer">
            시프트메이트는 참고용 정보이며 개인 상황에 따라 다를 수 있습니다.
            의료적 판단을 대체하지 않습니다.
          </p>
        </footer>
      </div>

    </div>
  )
}

export default AccountSettings
