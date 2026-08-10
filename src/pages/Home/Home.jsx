import { useState } from 'react'
import BottomSheet from '../../components/common/BottomSheet.jsx'
import SettingsButton from '../../components/common/SettingsButton.jsx'
import { IconSchedule } from '../../components/common/icons/index.jsx'
import AiAssistantBubble from './components/AiAssistantBubble.jsx'
import HomeGreeting from './components/HomeGreeting.jsx'
import NextShiftCard from './components/NextShiftCard.jsx'
import QuickMenuList from './components/QuickMenuList.jsx'
import TodayRoutineList from './components/TodayRoutineList.jsx'
import './Home.scss'

// 데이터 연동 전까지 사용하는 목업. 실제 값은 후속 이슈에서 API로 대체한다.
const QUICK_MENU_ITEMS = [
  { id: 'schedule', label: '근무표', icon: IconSchedule },
  { id: 'routine', label: '근무표', icon: IconSchedule },
  { id: 'record', label: '근무표', icon: IconSchedule },
  { id: 'report', label: '근무표', icon: IconSchedule },
]

const INITIAL_ROUTINES = [
  {
    id: 'morning-light',
    title: '기상 후 밝은 빛 노출',
    detail: '06:00 - 07:00 커튼을 열거나 외출 10분',
    done: true,
  },
  {
    id: 'caffeine-cutoff',
    title: '카페인 컷오프',
    detail: '14:00 이전 마지막 카페인 섭취 권장',
    done: false,
  },
  {
    id: 'power-nap',
    title: '파워냅',
    detail: '15:00 - 15:20 20분 이내 짧은 낮잠',
    done: false,
  },
  {
    id: 'light-block',
    title: '취침 전 빛 차단',
    detail: '22:00 이후 조명을 낮추고 화면 밝기 최소화',
    done: false,
  },
]

function Home() {
  const [routines, setRoutines] = useState(INITIAL_ROUTINES)
  const [showAssistantMessage, setShowAssistantMessage] = useState(true)

  const handleToggleRoutine = (id) => {
    setRoutines((prev) =>
      prev.map((routine) =>
        routine.id === id ? { ...routine, done: !routine.done } : routine,
      ),
    )
  }

  return (
    <div className="home">
      <div className="home__top">
        <SettingsButton className="home__settings" />

        <div className="home__summary">
          <HomeGreeting
            message="오늘 근무도 화이팅하세요"
            shiftLabel="나이트 근무 D+2"
          />
          <NextShiftCard remainingLabel="n시간 n분" progress={45} />
          <QuickMenuList items={QUICK_MENU_ITEMS} />
        </div>
      </div>

      <div className="home__bottom">
        <AiAssistantBubble
          message="AI비서한테 물어보세요!"
          showMessage={showAssistantMessage}
          onDismissMessage={() => setShowAssistantMessage(false)}
        />

        <BottomSheet className="home__sheet">
          <TodayRoutineList
            routines={routines}
            onToggle={handleToggleRoutine}
          />
        </BottomSheet>
      </div>
    </div>
  )
}

export default Home
