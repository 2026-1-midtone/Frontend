import { Outlet } from 'react-router-dom'
import './AppLayout.scss'

/**
 * 앱 기준(393px) 프레임 레이아웃.
 * 데스크톱에서는 프레임만 중앙에 노출되고 양옆은 배경으로 처리된다.
 */
function AppLayout() {
  return (
    <div className="app-layout">
      <div className="app-layout__frame">
        <Outlet />
      </div>
    </div>
  )
}

export default AppLayout
