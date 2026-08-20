import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHomeDashboard } from '@/api/homeApi.js'
import { getRoutineReport, getTodayRoutines, updateRoutineTask } from '@/api/routineApi.js'
import BottomSheet from '../../components/common/BottomSheet.jsx'
import SettingsButton from '../../components/common/SettingsButton.jsx'
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
import {
  formatDateTimeRange,
  formatRemainingMinutes,
  formatShiftType,
} from '../../lib/formatApiData.js'
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
  const [dashboard, setDashboard] = useState(null)
  const [coachItems, setCoachItems] = useState(RHYTHM_COACH_ITEMS)
  const [weeklyPercent, setWeeklyPercent] = useState(60)

  useEffect(() => {
    const controller = new AbortController()
    const options = { signal: controller.signal }

    const loadHome = async () => {
      const [dashboardResult, reportResult] = await Promise.allSettled([
        getHomeDashboard(options),
        getRoutineReport('7d', options),
      ])

      if (dashboardResult.status === 'fulfilled') {
        const dashboardData = dashboardResult.value
        const iconByType = {
          CAFFEINE_CUTOFF: IconCoffee,
          LIGHT_EXPOSURE: IconEyeOff,
          NAP: IconSun,
        }

        setDashboard(dashboardData)
        setCoachItems((dashboardData.topCoachingCards ?? []).slice(0, 3).map((card) => ({
          id: card.cardId,
          icon: iconByType[card.cardType] ?? IconSun,
          tone: card.cardType === 'CAFFEINE_CUTOFF' ? 'danger' : 'default',
          label: card.title,
          detail: formatDateTimeRange(card.windowStart, card.windowEnd),
        })))

        if ((dashboardData.routineProgress?.total ?? 0) > 0) {
          try {
            const routineData = await getTodayRoutines(undefined, options)
            setRoutines(routineData.tasks.slice(0, 4).map((task) => ({
              id: task.taskId,
              title: task.title,
              detail: formatDateTimeRange(task.windowStart, task.windowEnd) || task.tip || '',
              done: task.status === 'DONE',
            })))
          } catch (error) {
            if (error.name !== 'AbortError') setRoutines([])
          }
        } else {
          setRoutines([])
        }
      }

      if (reportResult.status === 'fulfilled') {
        setWeeklyPercent(Math.round(reportResult.value.overallCompletionRate * 100))
      }
    }

    loadHome()

    return () => controller.abort()
  }, [])

  const handleToggleRoutine = async (id) => {
    const previous = routines
    const selected = routines.find((routine) => routine.id === id)

    setRoutines((prev) =>
      prev.map((routine) =>
        routine.id === id ? { ...routine, done: !routine.done } : routine,
      ),
    )

    if (typeof id !== 'number') return

    try {
      await updateRoutineTask(id, selected?.done ? 'PENDING' : 'DONE')
    } catch {
      setRoutines(previous)
    }
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
      <div className="home__backdrop" aria-hidden="true">
        <img className="home__hero" src={routineHero} alt="" />
        <div className="home__hero-shade" />
      </div>

      <div className="home__top">
        <SettingsButton
          className="home__settings"
          onClick={() => navigate(PATH.SETTINGS)}
        />

        <div className="home__summary">
          <HomeGreeting
            message="오늘 근무도 화이팅하세요"
            shiftLabel={dashboard?.todayShift
              ? `${formatShiftType(dashboard.todayShift.shiftType)} 근무`
              : '오늘 근무 일정이 없어요'}
          />
          <NextShiftCard
            remainingLabel={formatRemainingMinutes(dashboard?.nextShift?.startInMinutes)}
            progress={dashboard?.nextShift ? 45 : 0}
          />
          <QuickMenuList items={QUICK_MENU_ITEMS} onSelect={handleSelectQuickMenu} />
        </div>
      </div>

      <div className="home__bottom">
        <BottomSheet className="home__sheet">
          <TodayRoutineList
            routines={routines}
            onToggle={handleToggleRoutine}
            onViewAll={handleViewAllRoutines}
          />
          <RhythmCoachList items={coachItems} />
          <WeeklyProgressArc
            percent={weeklyPercent}
            label="주간 실행 현황"
            to={PATH.ROUTINE_SUMMARY}
          />
        </BottomSheet>
      </div>
    </div>
  )
}

export default Home
