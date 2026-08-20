import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getHomeDashboard } from '@/api/homeApi.js'
import { getTodayRoutines, updateRoutineTask } from '@/api/routineApi.js'
import divider from '@/assets/daily-routine/divider.svg'
import glowBottom from '@/assets/routine-summary/glow-bottom.svg'
import glowLeft from '@/assets/routine-summary/glow-left.svg'
import glowRight from '@/assets/routine-summary/glow-right.svg'
import routineHero from '@/assets/routine-summary/routine-hero.png'
import settingsIcon from '@/assets/routine-summary/settings.svg'
import sparkleIcon from '@/assets/routine-summary/sparkle.svg'
import { PATH } from '@/routes/paths.js'
import { formatShiftType } from '@/lib/formatApiData.js'
import {
  applyTaskStatus,
  nextSkipStatus,
  nextToggleStatus,
  toRoutineTask,
} from '@/lib/routineTasks.js'
import RoutineTaskCard from './components/RoutineTaskCard.jsx'
import RoutineTipModal from './components/RoutineTipModal.jsx'
import './DailyRoutine.scss'

const sections = [
  { id: 'suggested', title: '오늘은 이렇게 어때요?' },
  { id: 'remaining', title: '남은 항목' },
  { id: 'completed', title: '완료된 항목' },
]

function DailyRoutine() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [activeTip, setActiveTip] = useState(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [todayShift, setTodayShift] = useState(undefined)

  useEffect(() => {
    const controller = new AbortController()

    getTodayRoutines(undefined, { signal: controller.signal })
      .then((data) => setTasks(data.tasks.map(toRoutineTask)))
      .catch((error) => {
        if (error.name !== 'AbortError') setLoadFailed(true)
      })

    getHomeDashboard({ signal: controller.signal })
      .then((data) => setTodayShift(data.todayShift))
      .catch((error) => {
        if (error.name !== 'AbortError') setTodayShift(null)
      })

    return () => controller.abort()
  }, [])

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0

    const completedCount = tasks.filter((task) => task.completed).length
    return Math.round((completedCount / tasks.length) * 100)
  }, [tasks])

  // 항목이 없는 섹션은 제목과 구분선만 남아 화면이 비어 보인다.
  const visibleSections = useMemo(
    () =>
      sections
        .map((section) => ({ ...section, tasks: tasks.filter((task) => task.group === section.id) }))
        .filter((section) => section.tasks.length > 0),
    [tasks],
  )

  const changeStatus = async (taskId, status) => {
    const previous = tasks

    setTasks((current) => applyTaskStatus(current, taskId, status))

    try {
      await updateRoutineTask(taskId, status)
    } catch {
      setTasks(previous)
    }
  }

  const toggleTask = (taskId) => {
    const selected = tasks.find((task) => task.id === taskId)

    if (selected) changeStatus(taskId, nextToggleStatus(selected))
  }

  const toggleSkip = (taskId) => {
    const selected = tasks.find((task) => task.id === taskId)

    if (selected) changeStatus(taskId, nextSkipStatus(selected))
  }

  return (
    <main className="daily-routine" aria-labelledby="daily-routine-title">
      <img className="daily-routine__hero" src={routineHero} alt="" aria-hidden="true" />
      <div className="daily-routine__hero-shade" />

      <header className="daily-routine__header">
        <div>
          <h1 id="daily-routine-title">
            하루 루틴 실행
            <img src={sparkleIcon} alt="" aria-hidden="true" />
          </h1>
          <p>{shiftLabel(todayShift)}</p>
        </div>
        <button type="button" aria-label="설정" onClick={() => navigate(PATH.SETTINGS)}>
          <img src={settingsIcon} alt="" />
        </button>
      </header>

      <button
        className="daily-routine__progress"
        type="button"
        aria-label={`오늘의 루틴 ${progress}% 완료, 연속 기록 보기`}
        onClick={() => navigate(PATH.ROUTINE_STREAK)}
      >
        <span>오늘의 루틴 현황 - <strong>{progress}% 완료</strong></span>
        <span className="daily-routine__progress-track" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </span>
      </button>

      <div className="daily-routine__scroll">
        <img className="daily-routine__glow daily-routine__glow--left" src={glowLeft} alt="" />
        <img className="daily-routine__glow daily-routine__glow--bottom" src={glowBottom} alt="" />
        <img className="daily-routine__glow daily-routine__glow--right" src={glowRight} alt="" />

        <div className="daily-routine__body">
          {tasks.length === 0 && (
            <p className="daily-routine__empty">
              {loadFailed
                ? '루틴을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
                : '오늘 실행할 루틴이 아직 없어요. 근무표를 등록하면 코칭에 맞춰 만들어 드려요.'}
            </p>
          )}

          {visibleSections.map((section, index) => (
            <section className="daily-routine__section" key={section.id}>
              {index > 0 && <img className="daily-routine__divider" src={divider} alt="" aria-hidden="true" />}
              <h2>{section.title}</h2>
              <ul className="daily-routine__list">
                {section.tasks.map((task) => (
                  <RoutineTaskCard
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onTip={setActiveTip}
                    onSkip={toggleSkip}
                  />
                ))}
              </ul>
            </section>
          ))}

          <p className="daily-routine__disclaimer">
            모든 코칭 정보는 참고용이며
            <br />
            개인 건강 상태에 따라 다를 수 있습니다.
            <br />
            의료적 판단이 필요한 경우 전문가와 상담하세요.
          </p>
        </div>
      </div>

      <span className="daily-routine__home-indicator" aria-hidden="true" />
      <RoutineTipModal tip={activeTip} onClose={() => setActiveTip(null)} />
    </main>
  )
}

/** 아직 확인 전(undefined)과 근무가 없는 날(null)을 구분해서 알려 준다. */
function shiftLabel(todayShift) {
  if (todayShift === undefined) return '오늘 근무를 확인하고 있어요.'
  if (!todayShift) return '오늘은 근무 일정이 없어요.'

  return `오늘은 ${formatShiftType(todayShift.shiftType)} 근무예요.`
}

export default DailyRoutine
