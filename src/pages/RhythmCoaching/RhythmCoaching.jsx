import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  getCoachingCard,
  getCoachings,
  getTransitions,
} from '@/api/coachingApi.js'
import { getHomeDashboard } from '@/api/homeApi.js'
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
import {
  addDays,
  formatDateTimeRange,
  formatRemainingMinutes,
  formatShiftType,
  getMinutesUntil,
  toDateString,
} from '@/lib/formatApiData.js'
import CoachingCard from './components/CoachingCard.jsx'
import './RhythmCoaching.scss'

const initialCoachingCards = [
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

function getClosestTransitionDate(transitions, requestedDate) {
  const requestedTime = new Date(`${requestedDate}T00:00:00`).getTime()

  return transitions.reduce((closest, transition) => {
    if (!closest) return transition.transitionDate

    const closestDistance = Math.abs(
      new Date(`${closest}T00:00:00`).getTime() - requestedTime,
    )
    const candidateDistance = Math.abs(
      new Date(`${transition.transitionDate}T00:00:00`).getTime() - requestedTime,
    )

    return candidateDistance < closestDistance ? transition.transitionDate : closest
  }, null)
}

function RhythmCoaching() {
  const navigate = useNavigate()
  const location = useLocation()
  const requestedDate = useMemo(
    () => new URLSearchParams(location.search).get('date') ?? toDateString(),
    [location.search],
  )
  const [coaching, setCoaching] = useState(null)
  const [coachingCards, setCoachingCards] = useState(initialCoachingCards)
  const [remainingTime, setRemainingTime] = useState('일정 확인 중')
  const [transitionDate, setTransitionDate] = useState(null)
  const [tomorrowCoaching, setTomorrowCoaching] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    setErrorMessage('')
    setTomorrowCoaching(null)
    setTransitionDate(null)

    const loadCoaching = async () => {
      try {
        if (requestedDate === toDateString()) {
          const dashboard = await getHomeDashboard({ signal: controller.signal })
          const hasNoSchedule = dashboard.scheduleAlert?.type === 'NO_SCHEDULE'
            || (!dashboard.todayShift && !dashboard.nextShift)

          if (hasNoSchedule) {
            setCoaching(null)
            setCoachingCards([])
            setRemainingTime('일정 미정')
            setErrorMessage('근무 일정을 먼저 등록해 주세요.')
            return
          }
        }

        const data = await getCoachings(requestedDate, { signal: controller.signal })
        const iconByType = {
          LIGHT_EXPOSURE: summaryLightIcon,
          CAFFEINE_CUTOFF: summaryCaffeineIcon,
          NAP: summaryNapIcon,
        }

        setCoaching(data)
        setCoachingCards((data.cards ?? []).map((card) => ({
          id: card.cardId,
          icon: iconByType[card.cardType] ?? summaryLightIcon,
          title: card.title,
          timing: formatDateTimeRange(card.windowStart, card.windowEnd),
          description: card.description,
          summaryDescription: card.description,
          detailDescription: null,
          isDetailVisible: false,
        })))
        setRemainingTime(formatRemainingMinutes(getMinutesUntil(data.nextShiftStartAt)))

        const [tomorrowResult, transitionsResult] = await Promise.allSettled([
          getCoachings(addDays(requestedDate, 1), { signal: controller.signal }),
          getTransitions(
            addDays(requestedDate, -30),
            addDays(requestedDate, 30),
            { signal: controller.signal },
          ),
        ])

        if (tomorrowResult.status === 'fulfilled') {
          setTomorrowCoaching(tomorrowResult.value)
        }

        if (transitionsResult.status === 'fulfilled') {
          setTransitionDate(getClosestTransitionDate(
            transitionsResult.value.transitions ?? [],
            requestedDate,
          ))
        } else if (data.isTransitionDay) {
          setTransitionDate(data.coachingDate ?? requestedDate)
        }
      } catch (error) {
        if (error.name === 'AbortError') return

        setCoaching(null)
        setCoachingCards([])
        setRemainingTime('일정 미정')
        setErrorMessage(error.message ?? '코칭 정보를 불러오지 못했습니다.')
      }
    }

    loadCoaching()

    return () => controller.abort()
  }, [requestedDate])

  useEffect(() => {
    if (!coaching?.nextShiftStartAt) return undefined

    const updateRemainingTime = () => {
      setRemainingTime(formatRemainingMinutes(getMinutesUntil(coaching.nextShiftStartAt)))
    }

    updateRemainingTime()
    const intervalId = window.setInterval(() => {
      updateRemainingTime()
    }, 60000)

    return () => window.clearInterval(intervalId)
  }, [coaching?.nextShiftStartAt])

  const handleCardSelect = async (cardId) => {
    const selectedCard = coachingCards.find((card) => card.id === cardId)
    if (!selectedCard) return

    if (selectedCard.detailDescription) {
      setCoachingCards((cards) => cards.map((card) => card.id === cardId
        ? {
            ...card,
            description: card.isDetailVisible
              ? card.summaryDescription
              : card.detailDescription,
            isDetailVisible: !card.isDetailVisible,
          }
        : card))
      return
    }

    try {
      const detail = await getCoachingCard(cardId)
      setCoachingCards((cards) => cards.map((card) => card.id === cardId
        ? {
            ...card,
            description: detail.rationale ?? card.description,
            detailDescription: detail.rationale ?? card.description,
            isDetailVisible: true,
          }
        : card))
    } catch (error) {
      setErrorMessage(error.message ?? '코칭 카드 상세 정보를 불러오지 못했습니다.')
    }
  }

  const handleTransitionClick = () => {
    const targetDate = transitionDate
      ?? (coaching?.isTransitionDay ? coaching.coachingDate : null)

    if (!targetDate) {
      setErrorMessage('조회할 수 있는 전환일이 없습니다.')
      return
    }

    navigate(`${PATH.TRANSITION_GUIDE}?date=${encodeURIComponent(targetDate)}`)
  }

  return (
    <main className="rhythm-coaching rhythm-coaching--summary">
      <img className="rhythm-coaching__hero" src={routineHero} alt="" aria-hidden="true" />
      <div className="rhythm-coaching__hero-shade" />

      <header className="rhythm-coaching__header">
        <div>
          <h1>
            오늘의 리듬 코칭
            <img src={sparkleIcon} alt="" aria-hidden="true" />
          </h1>
          <p>{coaching
            ? `${formatShiftType(coaching.todayShiftType)} 근무`
            : errorMessage ? '근무 일정 미정' : '근무 일정 확인 중'}</p>
        </div>
        <button type="button" aria-label="설정" onClick={() => navigate(PATH.SETTINGS)}>
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
            ⚠ {errorMessage || (coaching?.isTransitionDay
              ? '근무 전환 구간입니다.'
              : '오늘 권장 리듬을 확인해 주세요.')}
            <br />
            {errorMessage
              ? '근무표와 날짜를 확인한 뒤 다시 시도해 주세요.'
              : '수면·빛 노출·식사 타이밍을 조정할 시간입니다.'}
          </p>

          <button
            className="rhythm-coaching__transition-button"
            type="button"
            onClick={handleTransitionClick}
          >
            전환일 안내 보기
          </button>

          <section className="rhythm-coaching__section" aria-labelledby="coaching-card-title">
            <h2 id="coaching-card-title">코칭카드</h2>
            <div className="rhythm-coaching__cards">
              {coachingCards.map((card) => (
                <CoachingCard
                  key={card.id}
                  {...card}
                  onSelect={() => handleCardSelect(card.id)}
                />
              ))}
            </div>
          </section>

          {tomorrowCoaching && (
          <section className="rhythm-coaching__preview" aria-labelledby="tomorrow-preview-title">
            <h2 id="tomorrow-preview-title">내일 미리보기</h2>
            <div className="rhythm-coaching__preview-card">
              <p>
                <span>내일 ({formatShiftType(tomorrowCoaching.todayShiftType)})</span>
                <strong>D+1</strong>
              </p>
              <dl>
                {[
                  ['LIGHT_EXPOSURE', '빛 노출'],
                  ['CAFFEINE_CUTOFF', '카페인 컷오프'],
                  ['NAP', '권장 낮잠'],
                ].map(([cardType, label]) => {
                  const card = tomorrowCoaching.cards?.find(
                    (item) => item.cardType === cardType,
                  )

                  return (
                    <div key={cardType}>
                      <dt>{label}</dt>
                      <dd>{card
                        ? formatDateTimeRange(card.windowStart, card.windowEnd)
                        : '해당 없음'}</dd>
                    </div>
                  )
                })}
              </dl>
            </div>
          </section>
          )}

          <p className="rhythm-coaching__disclaimer">
            참고용 정보이며 개인 상황에 따라 다를 수 있습니다.
            <br />
            의료적 판단을 대체하지 않습니다.
          </p>
        </div>
      </div>

      <span className="rhythm-coaching__home-indicator" aria-hidden="true" />
    </main>
  )
}

export default RhythmCoaching
