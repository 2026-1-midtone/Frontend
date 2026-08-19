import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRoutineReport } from '@/api/routineApi.js'
import streakLine from '@/assets/daily-routine/streak-line.svg'
import streakPoint from '@/assets/daily-routine/streak-point.svg'
import streakStart from '@/assets/daily-routine/streak-start.svg'
import glowBottom from '@/assets/routine-summary/glow-bottom.svg'
import glowLeft from '@/assets/routine-summary/glow-left.svg'
import glowRight from '@/assets/routine-summary/glow-right.svg'
import routineHero from '@/assets/routine-summary/routine-hero.png'
import settingsIcon from '@/assets/routine-summary/settings.svg'
import sparkleIcon from '@/assets/routine-summary/sparkle.svg'
import { PATH } from '@/routes/paths.js'
import './DailyRoutine.scss'

const initialCompletionRates = [
  { id: 'nap', label: '낮잠', displayValue: 30, barValue: 30 },
  { id: 'caffeine', label: '카페인 컷오프', displayValue: 30, barValue: 30 },
  { id: 'light', label: '빛 노출', displayValue: 30, barValue: 80 },
  { id: 'meal', label: '식사 타이밍', displayValue: 30, barValue: 30 },
]

const days = ['월', '화', '수', '목', '금', '토', '일']

function RoutineStreak() {
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [completionRates, setCompletionRates] = useState(initialCompletionRates)

  useEffect(() => {
    const controller = new AbortController()

    getRoutineReport('7d', { signal: controller.signal })
      .then((data) => {
        const labelByCategory = {
          NAP: '낮잠',
          CAFFEINE_CUTOFF: '카페인 컷오프',
          LIGHT: '빛 노출',
          LIGHT_EXPOSURE: '빛 노출',
          MEAL: '식사 타이밍',
        }

        setReport(data)
        setCompletionRates(data.byCategory.map((rate) => {
          const value = Math.round(rate.completionRate * 100)
          return {
            id: rate.category,
            label: labelByCategory[rate.category] ?? rate.category,
            displayValue: value,
            barValue: value,
          }
        }))
      })
      .catch(() => {})

    return () => controller.abort()
  }, [])

  return (
    <main className="routine-streak" aria-labelledby="routine-streak-title">
      <img className="routine-streak__hero" src={routineHero} alt="" aria-hidden="true" />
      <div className="routine-streak__hero-shade" />

      <header className="routine-streak__header">
        <div>
          <h1 id="routine-streak-title">
            연속 기록
            <img src={sparkleIcon} alt="" aria-hidden="true" />
          </h1>
          <p>{report?.streak.currentStreak ?? 12}일째 함께하고 있어요🔥</p>
        </div>
        <button type="button" aria-label="설정" onClick={() => navigate(PATH.SETTINGS)}>
          <img src={settingsIcon} alt="" />
        </button>
      </header>

      <div className="routine-streak__scroll">
        <img className="routine-streak__glow routine-streak__glow--left" src={glowLeft} alt="" />
        <img className="routine-streak__glow routine-streak__glow--bottom" src={glowBottom} alt="" />
        <img className="routine-streak__glow routine-streak__glow--right" src={glowRight} alt="" />

        <div className="routine-streak__body">
          <section className="routine-streak__summary" aria-label="연속 기록 요약">
            <div>
              <span>현재 연속기록</span>
              <strong>{report?.streak.currentStreak ?? 12}일 연속</strong>
            </div>
            <div>
              <span>최장 기록</span>
              <strong>{report?.streak.longestStreak ?? 18}일</strong>
            </div>
          </section>

          <section className="routine-streak__weekly" aria-labelledby="weekly-completion-title">
            <h2 id="weekly-completion-title">최근 7일 완료율</h2>
            <div className="routine-streak__chart">
              <div className="routine-streak__chart-heading">
                <strong>전체 완료율</strong>
                <span>{Math.round((report?.overallCompletionRate ?? 0.78) * 100)}%</span>
              </div>
              <div className="routine-streak__plot" aria-label="월요일부터 일요일까지의 완료율 변화">
                <img className="routine-streak__line" src={streakLine} alt="" aria-hidden="true" />
                <img className="routine-streak__start" src={streakStart} alt="" aria-hidden="true" />
                {[0, 1, 2, 3, 4].map((point) => (
                  <img
                    className={`routine-streak__point routine-streak__point--${point + 1}`}
                    src={streakPoint}
                    alt=""
                    aria-hidden="true"
                    key={point}
                  />
                ))}
              </div>
              <div className="routine-streak__days" aria-hidden="true">
                {days.map((day) => <span key={day}>{day}</span>)}
              </div>
            </div>
          </section>

          <section className="routine-streak__rates" aria-labelledby="completion-rate-title">
            <h2 id="completion-rate-title">항목별 완료율</h2>
            <div className="routine-streak__rate-list">
              {completionRates.map((rate) => (
                <article className="routine-streak__rate" key={rate.id}>
                  <p>{rate.label} - <strong>{rate.displayValue}% 완료</strong></p>
                  <div
                    role="progressbar"
                    aria-label={`${rate.label} 완료율`}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={rate.barValue}
                  >
                    <span style={{ width: `${rate.barValue}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <p className="routine-streak__warning">
            ⚠ {completionRates.find((rate) => rate.id === report?.weakestCategory)?.label
              ?? '식사 타이밍'} 항목의 완료율이 낮습니다.
          </p>
          <p className="routine-streak__disclaimer">
            이 리포트는 참고용이며 임상적 해석을 포함하지 않습니다.
          </p>
        </div>
      </div>

      <span className="daily-routine__home-indicator" aria-hidden="true" />
    </main>
  )
}

export default RoutineStreak
