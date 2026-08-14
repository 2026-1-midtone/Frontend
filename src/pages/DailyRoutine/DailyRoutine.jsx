import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './DailyRoutine.scss'

const initialRoutines = [
  {
    id: 'caffeine',
    icon: '☕',
    title: '카페인 컷오프 준수',
    recommendation: '14:00 이전에 마지막 카페인 섭취를 마쳐주세요.',
    action: 'choice',
  },
  {
    id: 'stretch',
    icon: '🧘',
    title: '취침 전 스트레칭',
    recommendation: '몸의 긴장을 풀 수 있도록 5분간 천천히 움직여보세요.',
    action: 'timer',
  },
  {
    id: 'screen',
    icon: '📵',
    title: '화면과 잠시 멀어지기',
    recommendation: '잠들기 30분 전에는 휴대폰을 내려놓아 보세요.',
    action: 'choice',
  },
]

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

function DailyRoutine() {
  const navigate = useNavigate()
  const [statuses, setStatuses] = useState({})
  const [timerSeconds, setTimerSeconds] = useState(300)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    if (!isTimerRunning) return undefined

    const timerId = window.setInterval(() => {
      setTimerSeconds((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timerId)
          setIsTimerRunning(false)
          setStatuses((current) => ({ ...current, stretch: 'completed' }))
          return 0
        }

        return seconds - 1
      })
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [isTimerRunning])

  const completedCount = useMemo(
    () => Object.values(statuses).filter((status) => status === 'completed').length,
    [statuses],
  )

  const updateStatus = (id, status) => {
    setStatuses((current) => ({ ...current, [id]: status }))
  }

  return (
    <main className="daily-routine">
      <header className="daily-routine__header">
        <button type="button" onClick={() => navigate(-1)} aria-label="이전 화면으로 돌아가기">‹</button>
        <div>
          <p>오늘의 루틴</p>
          <h1>하루를 편안하게 마무리해요</h1>
        </div>
      </header>

      <section className="daily-routine__progress" aria-label="루틴 실행 현황">
        <span>{completedCount}/{initialRoutines.length} 완료</span>
        <div><span style={{ width: `${(completedCount / initialRoutines.length) * 100}%` }} /></div>
      </section>

      <ul className="daily-routine__list">
        {initialRoutines.map((routine) => {
          const status = statuses[routine.id]

          return (
            <li className="daily-routine__item" key={routine.id}>
              <span className="daily-routine__icon" aria-hidden="true">{routine.icon}</span>
              <div className="daily-routine__copy">
                <h2>{routine.title}</h2>
                <p>{routine.recommendation}</p>
              </div>

              {status ? (
                <button
                  className={`daily-routine__result daily-routine__result--${status}`}
                  type="button"
                  onClick={() => updateStatus(routine.id, undefined)}
                >
                  {status === 'completed' ? '완료' : '건너뜀'}
                </button>
              ) : routine.action === 'timer' ? (
                <button
                  className="daily-routine__timer"
                  type="button"
                  onClick={() => setIsTimerRunning((running) => !running)}
                >
                  {isTimerRunning ? formatTime(timerSeconds) : '5분 타이머'}
                </button>
              ) : (
                <div className="daily-routine__actions">
                  <button type="button" onClick={() => updateStatus(routine.id, 'completed')}>완료</button>
                  <button type="button" onClick={() => updateStatus(routine.id, 'skipped')}>건너뛰기</button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </main>
  )
}

export default DailyRoutine
