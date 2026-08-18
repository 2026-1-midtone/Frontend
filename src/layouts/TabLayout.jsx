import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AiAssistantBubble from '../components/common/AiAssistantBubble.jsx'
import BottomNavigation from '../components/common/BottomNavigation.jsx'
import calendarIcon from '../assets/routine-summary/calendar-edit.svg'
import cloverIcon from '../assets/routine-summary/clover-nav.svg'
import draftsIcon from '../assets/routine-summary/drafts.svg'
import homeIcon from '../assets/routine-summary/home.svg'
import { PATH } from '../routes/paths.js'
import './TabLayout.scss'

// 근무표 화면 시안에서 최종 확정된 탭 구성.
// 온보딩처럼 탭이 없는 화면과 분리하기 위해 별도 레이아웃으로 둔다.
const NAV_ITEMS = [
  {
    to: PATH.HOME,
    label: '홈',
    iconSrc: homeIcon,
    activePaths: [
      PATH.HOME,
      PATH.ROUTINE_SUMMARY,
      PATH.SETTINGS,
      PATH.SETTINGS_PERSONALIZATION,
      PATH.SETTINGS_COACHING_ALERTS,
      PATH.SETTINGS_ACCOUNT,
    ],
  },
  { to: PATH.SCHEDULE, label: '근무표', iconSrc: calendarIcon },
  { to: PATH.COACHING, label: '코칭', iconSrc: draftsIcon },
  {
    to: PATH.ROUTINE,
    label: '루틴',
    iconSrc: cloverIcon,
    activePaths: [PATH.ROUTINE, PATH.DAILY_ROUTINE, PATH.ROUTINE_STREAK],
  },
]

/**
 * 하단 탭 네비게이션이 붙는 화면용 레이아웃.
 */
function TabLayout() {
  const { pathname } = useLocation()
  const [showAssistantMessage, setShowAssistantMessage] = useState(true)
  const isSettingsPage = pathname === PATH.SETTINGS
    || pathname.startsWith(`${PATH.SETTINGS}/`)

  return (
    <div className="tab-layout">
      <div className="tab-layout__content">
        <Outlet />
      </div>
      {!isSettingsPage && (
        <AiAssistantBubble
          message="AI비서한테 물어보세요!"
          showMessage={showAssistantMessage}
          onDismissMessage={() => setShowAssistantMessage(false)}
        />
      )}
      <BottomNavigation items={NAV_ITEMS} />
    </div>
  )
}

export default TabLayout
