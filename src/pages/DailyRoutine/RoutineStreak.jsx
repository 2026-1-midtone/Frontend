import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRoutineReport } from '@/api/routineApi.js'
import glowBottom from '@/assets/routine-summary/glow-bottom.svg'
import glowLeft from '@/assets/routine-summary/glow-left.svg'
import glowRight from '@/assets/routine-summary/glow-right.svg'
import routineHero from '@/assets/routine-summary/routine-hero.png'
import settingsIcon from '@/assets/routine-summary/settings.svg'
import sparkleIcon from '@/assets/routine-summary/sparkle.svg'
import { PATH } from '@/routes/paths.js'
import { toCategoryRates, toPercent, toWeeklyPoints } from '@/lib/routineReport.js'
import './DailyRoutine.scss'

const LABEL_BY_CATEGORY = {
  NAP: '낮잠',
  CAFFEINE_CUTOFF: '카페인 컷오프',
  LIGHT: '빛 노출',
  LIGHT_EXPOSURE: '빛 노출',
  MEAL: '식사 타이밍',
  SLEEP: '수면',
  WAKE: '기상',
}

function RoutineStreak() {
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    getRoutineReport('7d', { signal: controller.signal })
      .then(setReport)
      .catch((error) => {
        if (error.name !== 'AbortError') setLoadFailed(true)
      })

    return () => controller.abort()
  }, [])

  const completionRates = toCategoryRates(report?.byCategory, LABEL_BY_CATEGORY)
  const weeklyPoints = toWeeklyPoints(report?.byDay)
  const weakestLabel = completionRates.find((rate) => rate.id === report?.weakestCategory)?.label

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
          <p>{toDays(report?.streak.currentStreak)}째 함께하고 있어요🔥</p>
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
              <strong>{toDays(report?.streak.currentStreak)} 연속</strong>
            </div>
            <div>
              <span>최장 기록</span>
              <strong>{toDays(report?.streak.longestStreak)}</strong>
            </div>
          </section>

          <section className="routine-streak__weekly" aria-labelledby="weekly-completion-title">
            <h2 id="weekly-completion-title">최근 7일 완료율</h2>
            <div className="routine-streak__chart">
              <div className="routine-streak__chart-heading">
                <strong>전체 완료율</strong>
                <span>{toPercent(report?.overallCompletionRate)}%</span>
              </div>
              <div className="routine-streak__plot" aria-label="최근 7일 완료율 변화">
                {weeklyPoints.map((point) => (
                  <div
                    className="routine-streak__bar"
                    key={point.date}
                    role="img"
                    aria-label={`${point.label}요일 ${point.hasTasks ? `${point.percent}% 완료` : '루틴 없음'}`}
                  >
                    <span
                      className={`routine-streak__bar-fill${point.isLast ? ' routine-streak__bar-fill--today' : ''}`}
                      style={{ height: `${point.percent}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="routine-streak__days" aria-hidden="true">
                {weeklyPoints.map((point) => <span key={point.date}>{point.label}</span>)}
              </div>
            </div>
          </section>

          <section className="routine-streak__rates" aria-labelledby="completion-rate-title">
            <h2 id="completion-rate-title">항목별 완료율</h2>
            <div className="routine-streak__rate-list">
              {completionRates.map((rate) => (
                <article className="routine-streak__rate" key={rate.id}>
                  <p>{rate.label} - <strong>{rate.value}% 완료</strong></p>
                  <div
                    role="progressbar"
                    aria-label={`${rate.label} 완료율`}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={rate.value}
                  >
                    <span style={{ width: `${rate.value}%` }} />
                  </div>
                </article>
              ))}
            </div>
          </section>

          {weakestLabel && (
            <p className="routine-streak__warning">
              ⚠ {weakestLabel} 항목의 완료율이 낮습니다.
            </p>
          )}
          {completionRates.length === 0 && (
            <p className="routine-streak__warning">
              {loadFailed
                ? '⚠ 기록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
                : '아직 쌓인 기록이 없어요. 루틴을 실행하면 여기에 모아 드려요.'}
            </p>
          )}
          <p className="routine-streak__disclaimer">
            이 리포트는 참고용이며 임상적 해석을 포함하지 않습니다.
          </p>
        </div>
      </div>

      <span className="daily-routine__home-indicator" aria-hidden="true" />
    </main>
  )
}

function toDays(count) {
  return `${count ?? 0}일`
}

export default RoutineStreak
