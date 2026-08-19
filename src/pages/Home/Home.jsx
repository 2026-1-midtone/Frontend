import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomSheet from '../../components/common/BottomSheet.jsx'
import SettingsButton from '../../components/common/SettingsButton.jsx'
import AiAssistantBubble from '../../components/common/AiAssistantBubble.jsx' // 컴포넌트 불러오기 추가
import routineHero from '../../assets/routine-summary/routine-hero.png'
import {
  IconCoffee,
  IconEdit,
  IconEyeOff,
  IconGrid,
  IconPill,
  IconSchedule,
  IconSun,
} from '../../components/common/icons/index.jsx'
import { PATH } from '../../routes/paths.js'
import HomeGreeting from './components/HomeGreeting.jsx'
import NextShiftCard from './components/NextShiftCard.jsx'
import QuickMenuList from './components/QuickMenuList.jsx'
import RhythmCoachList from './components/RhythmCoachList.jsx'
import TodayRoutineList from './components/TodayRoutineList.jsx'
import WeeklyProgressArc from './components/WeeklyProgressArc.jsx'
import './Home.scss'

const QUICK_MENU_ITEMS = [
  { id: 'schedule', label: '근무표', icon: IconSchedule },
  { id: 'rhythm-coaching', label: '리듬 코칭', icon: IconEdit },
  { id: 'nutrition-coaching', label: 'AI 영양코칭', icon: IconPill },
  { id: 'weekly-status', label: '주간 실행 현황', icon: IconGrid },
]

const QUICK_MENU_PATHS = {
  schedule: PATH.SCHEDULE,
  'rhythm-coaching': PATH.COACHING,
  'weekly-status': PATH.ROUTINE_SUMMARY,
}

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

const RHYTHM_COACH_ITEMS = [
  {
    id: 'caffeine-stop',
    icon: IconCoffee,
    tone: 'danger',
    label: '카페인 중단',
    detail: '~2:00',
  },
  {
    id: 'recommended-nap',
    icon: IconSun,
    label: '권장 낮잠',
    detail: '13:00~14:30',
  },
  {
    id: 'light-block',
    icon: IconEyeOff,
    label: '빛 차단',
    detail: '06:00 이후',
  },
]

function Home() {
  const navigate = useNavigate()
  const [routines, setRoutines] = useState(INITIAL_ROUTINES)

  const handleToggleRoutine = (id) => {
    setRoutines((prev) =>
      prev.map((routine) =>
        routine.id === id ? { ...routine, done: !routine.done } : routine,
      ),
    )
  }

  const handleSelectQuickMenu = (id) => {
    const targetPath = QUICK_MENU_PATHS[id]

    if (targetPath) navigate(targetPath)
  }

  const handleViewAllRoutines = () => {
    navigate(PATH.ROUTINE)
  }

  return (
    <div className="home">
      <img className="home__hero" src={routineHero} alt="" aria-hidden="true" />
      <div className="home__hero-shade" aria-hidden="true" />

      <div className="home__top">
        <SettingsButton
          className="home__settings"
          onClick={() => navigate(PATH.SETTINGS)}
        />

        <div className="home__summary">
          <HomeGreeting
            message="오늘 근무도 화이팅하세요"
            shiftLabel="나이트 근무 D+2"
          />
          <NextShiftCard remainingLabel="n시간 n분" progress={45} />
          <QuickMenuList items={QUICK_MENU_ITEMS} onSelect={handleSelectQuickMenu} />
        </div>
      </div>

      <div className="home__bottom">
        <AiAssistantBubble onOpen={() => navigate(PATH.ASSISTANT)} />

        <BottomSheet className="home__sheet">
          <TodayRoutineList
            routines={routines}
            onToggle={handleToggleRoutine}
            onViewAll={handleViewAllRoutines}
          />
          <RhythmCoachList items={RHYTHM_COACH_ITEMS} />
          <WeeklyProgressArc
            percent={60}
            label="주간 실행 현황"
            to={PATH.ROUTINE_SUMMARY}
          />
        </BottomSheet>
      </div>
    </div>
  )
}

export default Home