import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AiAssistantBubble from '../../components/common/AiAssistantBubble.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import avatarPlaceholder from '../../assets/avatar-placeholder.svg'
import { ApiError } from '../../lib/apiClient.js'
import { clearSession } from '../../lib/session.js'
import { deleteMe, getMe } from '../../lib/userApi.js'
import { PATH } from '../../routes/paths.js'
import DangerZoneCard from './components/DangerZoneCard.jsx'
import ProfileCard from './components/ProfileCard.jsx'
import './AccountSettings.scss'

const FALLBACK_PROFILE = {
  avatarSrc: avatarPlaceholder,
  name: '',
  nameSuffix: '(님)',
  email: '',
  joinedAt: '',
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

function formatJoinedAt(createdAt) {
  if (!createdAt) return ''
  const date = new Date(createdAt)
  return `${String(date.getFullYear()).slice(2)}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

function AccountSettings() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(FALLBACK_PROFILE)
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
          joinedAt: formatJoinedAt(user.createdAt),
        })
      })
      .catch((error) => {
        if (!isMounted) return
        setErrorMessage(error instanceof ApiError ? error.message : '내 정보를 불러오지 못했습니다.')
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleDeleteAllData = async () => {
    const confirmed = window.confirm('계정을 탈퇴하면 모든 데이터가 삭제됩니다. 계속할까요?')
    if (!confirmed) return

    try {
      await deleteMe()
      clearSession()
      navigate(PATH.ONBOARDING)
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : '회원 탈퇴에 실패했습니다.')
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
        {errorMessage && <p className="account-settings__error">{errorMessage}</p>}

        <ProfileCard
          avatarSrc={profile.avatarSrc}
          name={profile.name}
          nameSuffix={profile.nameSuffix}
          email={profile.email}
          joinedAt={profile.joinedAt}
          readOnly
        />

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

      <AiAssistantBubble onOpen={() => navigate(PATH.ASSISTANT)} />
    </div>
  )
}

export default AccountSettings
