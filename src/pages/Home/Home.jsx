import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCoachings } from '@/api/coachingApi.js'
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
import { isPastWindow } from '../../lib/coachingCards.js'
import {
  formatDateTimeRange,
  formatRemainingMinutes,
  formatShiftType,
  toDateString,
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

function Home() {
  const navigate = useNavigate()
  const [routines, setRoutines] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [coachItems, setCoachItems] = useState([])
  const [weeklyPercent, setWeeklyPercent] = useState(0)

  const refreshWeeklyPercent = async (options) => {
    try {
      const report = await getRoutineReport('7d', options)
      setWeeklyPercent(Math.round(report.overallCompletionRate * 100))
    } catch (error) {
      if (error.name !== 'AbortError') setWeeklyPercent(0)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    const options = { signal: controller.signal }

    const loadHome = async () => {
      const [dashboardResult, coachingsResult] = await Promise.allSettled([
        getHomeDashboard(options),
        // /home/dashboard의 topCoachingCards에는 windowEnd가 없어서 별도로 받아 보강한다.
        getCoachings(toDateString(), options),
      ])

      if (dashboardResult.status === 'fulfilled') {
        const dashboardData = dashboardResult.value
        const iconByType = {
          CAFFEINE_CUTOFF: IconCoffee,
          LIGHT_EXPOSURE: IconEyeOff,
          NAP: IconSun,
        }
        const windowEndByCardId = coachingsResult.status === 'fulfilled'
          ? Object.fromEntries(
            (coachingsResult.value.cards ?? []).map((card) => [card.cardId, card.windowEnd]),
          )
          : {}

        setDashboard(dashboardData)
        setCoachItems((dashboardData.topCoachingCards ?? []).slice(0, 3).map((card) => {
          const windowEnd = card.windowEnd ?? windowEndByCardId[card.cardId]

          return {
            id: card.cardId,
            icon: iconByType[card.cardType] ?? IconSun,
            tone: card.cardType === 'CAFFEINE_CUTOFF' ? 'danger' : 'default',
            label: card.title,
            detail: formatDateTimeRange(card.windowStart, windowEnd),
            past: isPastWindow(windowEnd),
          }
        }))

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

      await refreshWeeklyPercent(options)
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

    try {
      await updateRoutineTask(id, selected?.done ? 'PENDING' : 'DONE')
      // 주간 실행률은 오늘 완료한 항목까지 반영해야 하므로 다시 읽는다.
      await refreshWeeklyPercent()
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
            remainingLabel={formatRemainingMinutes(dashboard?.nextShift?.startsInMinutes)}
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
