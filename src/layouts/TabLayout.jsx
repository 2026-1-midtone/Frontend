import { Outlet } from 'react-router-dom'
import BottomNavigation from '../components/common/BottomNavigation.jsx'
import {
  IconEdit,
  IconGrid,
  IconHome,
  IconSchedule,
} from '../components/common/icons/index.jsx'
import { PATH } from '../routes/paths.js'
import './TabLayout.scss'

// 탭 라벨과 대상 화면은 아직 미확정이라 임시값이다.
// 온보딩처럼 탭이 없는 화면과 분리하기 위해 별도 레이아웃으로 둔다.
const NAV_ITEMS = [
  { to: PATH.HOME, label: '홈', icon: IconHome },
  { to: PATH.SCHEDULE, label: '근무표', icon: IconSchedule },
  { to: PATH.RECORD, label: '기록', icon: IconEdit },
  { to: PATH.MORE, label: '전체', icon: IconGrid },
]

/**
 * 하단 탭 네비게이션이 붙는 화면용 레이아웃.
 */
function TabLayout() {
  return (
    <div className="tab-layout">
      <div className="tab-layout__content">
        <Outlet />
      </div>
      <BottomNavigation items={NAV_ITEMS} />
    </div>
  )
}

export default TabLayout
