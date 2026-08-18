import PageHeader from '../../components/common/PageHeader.jsx'
import avatarPlaceholder from '../../assets/avatar-placeholder.svg'
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
  // TODO: 실제 삭제 확인 모달 + API 연동. 파괴적 동작이라 반드시 확인 단계가 필요하다.
  const handleDeleteAllData = () => {}

  return (
    <div className="account-settings">
      <PageHeader title="계정 설정" subtitle="오늘 하루는 어떤 하루였나요?" />

      <div className="account-settings__card">
        <ProfileCard
          avatarSrc={MOCK_PROFILE.avatarSrc}
          name={MOCK_PROFILE.name}
          nameSuffix={MOCK_PROFILE.nameSuffix}
          email={MOCK_PROFILE.email}
          joinedAt={MOCK_PROFILE.joinedAt}
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
              <button type="button" key={label} className="account-settings__policy-link">
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
