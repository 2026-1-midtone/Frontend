import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTodayRoutines, updateRoutineTask } from '@/api/routineApi.js'
import divider from '@/assets/daily-routine/divider.svg'
import glowBottom from '@/assets/routine-summary/glow-bottom.svg'
import glowLeft from '@/assets/routine-summary/glow-left.svg'
import glowRight from '@/assets/routine-summary/glow-right.svg'
import routineHero from '@/assets/routine-summary/routine-hero.png'
import settingsIcon from '@/assets/routine-summary/settings.svg'
import sparkleIcon from '@/assets/routine-summary/sparkle.svg'
import { PATH } from '@/routes/paths.js'
import { formatDateTimeRange } from '@/lib/formatApiData.js'
import RoutineTaskCard from './components/RoutineTaskCard.jsx'
import RoutineTipModal from './components/RoutineTipModal.jsx'
import './DailyRoutine.scss'

const initialTasks = [
  {
    id: 'morning-light',
    group: 'suggested',
    title: '기상 직후 햇빛 노출',
    time: '07:00 – 07:15',
    tip: 'light',
    completed: false,
  },
  {
    id: 'caffeine-cutoff',
    group: 'suggested',
    title: '카페인 섭취 마감',
    time: '14:00 이전 권장',
    tip: 'caffeine',
    completed: false,
  },
  {
    id: 'power-nap',
    group: 'suggested',
    title: '20분 낮잠',
    time: '13:00 – 14:00 권장',
    tip: 'nap',
    completed: true,
  },
  {
    id: 'light-dinner',
    group: 'remaining',
    title: '저녁 식사 가볍게 마치기',
    time: '18:00 - 19:00 권장',
    skippable: true,
    completed: false,
  },
  {
    id: 'bedtime-stretch',
    group: 'remaining',
    title: '취침 전 스트레칭',
    time: '야간 근무 출발 2시간전',
    skippable: true,
    completed: false,
  },
  {
    id: 'hydration',
    group: 'remaining',
    title: '수분 섭취 확인',
    time: '근무 전 500ml 권장',
    skippable: true,
    completed: false,
  },
  {
    id: 'wake-stretch',
    group: 'completed',
    title: '일어나자마자 스트레칭',
    time: '07:00 – 07:15',
    completed: true,
  },
  {
    id: 'morning-protein',
    group: 'completed',
    title: '아침 단백질 섭취',
    time: '14:00 이전 권장',
    completed: true,
  },
  {
    id: 'blue-light-glasses',
    group: 'completed',
    title: '블루라이트 차단 안경 착용',
    time: '13:00 – 14:00 권장',
    completed: true,
  },
]

const sections = [
  { id: 'suggested', title: '오늘은 이렇게 어때요?' },
  { id: 'remaining', title: '남은 항목' },
  { id: 'completed', title: '완료된 항목' },
]

function DailyRoutine() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState(initialTasks)
  const [activeTip, setActiveTip] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    getTodayRoutines(undefined, { signal: controller.signal })
      .then((data) => {
        const tipByCategory = {
          LIGHT: 'light',
          CAFFEINE_CUTOFF: 'caffeine',
          NAP: 'nap',
        }

        setTasks(data.tasks.map((task) => ({
          id: task.taskId,
          group: task.status === 'DONE'
            ? 'completed'
            : task.sourceType === 'COACHING'
              ? 'suggested'
              : 'remaining',
          title: task.title,
          time: formatDateTimeRange(task.windowStart, task.windowEnd) || '권장 시간 확인',
          tip: tipByCategory[task.category],
          skippable: task.status !== 'DONE',
          completed: task.status === 'DONE',
          status: task.status === 'SKIPPED' ? 'skipped' : undefined,
        })))
      })
      .catch(() => {})

    return () => controller.abort()
  }, [])

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0

    const completedCount = tasks.filter((task) => task.completed).length
    return Math.round((completedCount / tasks.length) * 100)
  }, [tasks])

  const toggleTask = async (taskId) => {
    const previous = tasks
    const selected = tasks.find((task) => task.id === taskId)

    setTasks((current) => current.map((task) => (
      task.id === taskId
        ? { ...task, completed: !task.completed, status: undefined }
        : task
    )))

    try {
      await updateRoutineTask(taskId, selected?.completed ? 'PENDING' : 'DONE')
    } catch {
      setTasks(previous)
    }
  }

  const toggleSkip = async (taskId) => {
    const previous = tasks
    const selected = tasks.find((task) => task.id === taskId)
    const nextStatus = selected?.status === 'skipped' ? 'PENDING' : 'SKIPPED'

    setTasks((current) => current.map((task) => (
      task.id === taskId
        ? { ...task, completed: false, status: task.status === 'skipped' ? undefined : 'skipped' }
        : task
    )))

    try {
      await updateRoutineTask(taskId, nextStatus)
    } catch {
      setTasks(previous)
    }
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
          <p>나이트 근무 전입니다.</p>
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
          {sections.map((section, index) => (
            <section className="daily-routine__section" key={section.id}>
              {index > 0 && <img className="daily-routine__divider" src={divider} alt="" aria-hidden="true" />}
              <h2>{section.title}</h2>
              <ul className="daily-routine__list">
                {tasks
                  .filter((task) => task.group === section.id)
                  .map((task) => (
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

export default DailyRoutine
