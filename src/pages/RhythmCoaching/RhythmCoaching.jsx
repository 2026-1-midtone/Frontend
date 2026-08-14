import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import summaryCaffeineIcon from '@/assets/rhythm-coaching/summary-caffeine.svg'
import summaryLightIcon from '@/assets/rhythm-coaching/summary-light.svg'
import summaryNapIcon from '@/assets/rhythm-coaching/summary-nap.svg'
import glowBottom from '@/assets/routine-summary/glow-bottom.svg'
import glowLeft from '@/assets/routine-summary/glow-left.svg'
import glowRight from '@/assets/routine-summary/glow-right.svg'
import routineHero from '@/assets/routine-summary/routine-hero.png'
import settingsIcon from '@/assets/routine-summary/settings.svg'
import sparkleIcon from '@/assets/routine-summary/sparkle.svg'
import { PATH } from '@/routes/paths.js'
import AssistantPrompt from './components/AssistantPrompt.jsx'
import CoachingBottomNavigation from './components/CoachingBottomNavigation.jsx'
import CoachingCard from './components/CoachingCard.jsx'
import CoachingStatusBar from './components/CoachingStatusBar.jsx'
import './RhythmCoaching.scss'

const coachingCards = [
  {
    id: 'light',
    icon: summaryLightIcon,
    title: '빛 노출',
    timing: '06:00 – 08:00',
    description: '일어나자마자 햇빛이나 밝은 조명을 쬐면 수면 리듬을 맞추는 데 도움이 돼요.',
  },
  {
    id: 'caffeine',
    icon: summaryCaffeineIcon,
    title: '카페인 컷오프',
    timing: '14:00 이후 중단',
    description: '다음 나이트 근무 8시간 전부터는 카페인을 줄여보세요. 카페인에 따라 효과는 다를 수 있어요.',
  },
  {
    id: 'nap',
    icon: summaryNapIcon,
    title: '권장 낮잠',
    timing: '13:00 – 14:30',
    description: '20–30분 짧은 낮잠이 피로 회복에 도움이 될 수 있습니다. 너무 길면 수면 관성이 생길 수 있으니 주의하세요.',
  },
]

function getNextShiftTime() {
  const now = new Date()
  const nextShift = new Date(now)
  nextShift.setHours(21, 0, 0, 0)

  if (nextShift <= now) nextShift.setDate(nextShift.getDate() + 1)

  return nextShift
}

function getRemainingTime(target) {
  const remainingMinutes = Math.max(0, Math.ceil((target.getTime() - Date.now()) / 60000))
  const hours = Math.floor(remainingMinutes / 60)
  const minutes = remainingMinutes % 60

  return `${hours}시간 ${minutes}분`
}

function RhythmCoaching() {
  const navigate = useNavigate()
  const nextShift = useMemo(getNextShiftTime, [])
  const [remainingTime, setRemainingTime] = useState(() => getRemainingTime(nextShift))

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRemainingTime(getRemainingTime(nextShift))
    }, 60000)

    return () => window.clearInterval(intervalId)
  }, [nextShift])

  return (
    <main className="rhythm-coaching rhythm-coaching--summary">
      <img className="rhythm-coaching__hero" src={routineHero} alt="" aria-hidden="true" />
      <div className="rhythm-coaching__hero-shade" />
      <CoachingStatusBar />

      <header className="rhythm-coaching__header">
        <div>
          <h1>
            오늘의 리듬 코칭
            <img src={sparkleIcon} alt="" aria-hidden="true" />
          </h1>
          <p>나이트 근무 D+2</p>
        </div>
        <button type="button" aria-label="설정">
          <img src={settingsIcon} alt="" />
        </button>
      </header>

      <section className="rhythm-coaching__countdown" aria-label="다음 근무까지 남은 시간">
        <p>
          다음 근무까지 - <strong>{remainingTime}</strong>
        </p>
        <div role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
          <span />
        </div>
      </section>

      <div className="rhythm-coaching__scroll">
        <img className="rhythm-coaching__glow rhythm-coaching__glow--left" src={glowLeft} alt="" />
        <img className="rhythm-coaching__glow rhythm-coaching__glow--bottom" src={glowBottom} alt="" />
        <img className="rhythm-coaching__glow rhythm-coaching__glow--right" src={glowRight} alt="" />

        <div className="rhythm-coaching__body">
          <p className="rhythm-coaching__notice">
            ⚠ 나이트 근무 후 오프 구간으로 전환됩니다.
            <br />
            수면·빛 노출·식사 타이밍을 조정할 시간입니다.
          </p>

          <button
            className="rhythm-coaching__transition-button"
            type="button"
            onClick={() => navigate(PATH.TRANSITION_GUIDE)}
          >
            전환일 안내 보기
          </button>

          <section className="rhythm-coaching__section" aria-labelledby="coaching-card-title">
            <h2 id="coaching-card-title">코칭카드</h2>
            <div className="rhythm-coaching__cards">
              {coachingCards.map((card) => (
                <CoachingCard key={card.id} {...card} />
              ))}
            </div>
          </section>

          <section className="rhythm-coaching__preview" aria-labelledby="tomorrow-preview-title">
            <h2 id="tomorrow-preview-title">내일 미리보기</h2>
            <div className="rhythm-coaching__preview-card">
              <p><span>내일 (오프)</span><strong>D+1</strong></p>
              <dl>
                <div><dt>빛 노출</dt><dd>08:00 – 10:00</dd></div>
                <div><dt>카페인 컷오프</dt><dd>해당 없음</dd></div>
                <div><dt>권장 낮잠</dt><dd>14:00 – 15:30</dd></div>
              </dl>
            </div>
          </section>

          <p className="rhythm-coaching__disclaimer">
            참고용 정보이며 개인 상황에 따라 다를 수 있습니다.
            <br />
            의료적 판단을 대체하지 않습니다.
          </p>
        </div>
      </div>

      <AssistantPrompt />
      <CoachingBottomNavigation />
      <span className="rhythm-coaching__home-indicator" aria-hidden="true" />
    </main>
  )
}

export default RhythmCoaching
