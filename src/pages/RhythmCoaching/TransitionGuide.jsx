import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getTransitionGuide } from '@/api/coachingApi.js'
import { getTodayRoutines, updateRoutineTask } from '@/api/routineApi.js'
import introDivider from '@/assets/rhythm-coaching/transition-intro-divider.svg'
import caffeineIcon from '@/assets/rhythm-coaching/transition-caffeine.svg'
import lightIcon from '@/assets/rhythm-coaching/transition-light.svg'
import mealIcon from '@/assets/rhythm-coaching/transition-meal.svg'
import napIcon from '@/assets/rhythm-coaching/transition-nap.svg'
import sectionDivider from '@/assets/rhythm-coaching/transition-section-divider.svg'
import sleepIcon from '@/assets/rhythm-coaching/transition-sleep.svg'
import wakeIcon from '@/assets/rhythm-coaching/transition-wake.svg'
import routineHero from '@/assets/routine-summary/routine-hero.png'
import settingsIcon from '@/assets/routine-summary/settings.svg'
import sparkleIcon from '@/assets/routine-summary/sparkle.svg'
import { PATH } from '@/routes/paths.js'
import { formatShiftType, toDateString } from '@/lib/formatApiData.js'
import {
  applyChecklistStatus,
  nextChecklistStatus,
  toChecklistItems,
  toGuideSections,
} from '@/lib/transitionGuide.js'
import CoachingCard from './components/CoachingCard.jsx'
import './RhythmCoaching.scss'

const ICON_BY_CATEGORY = {
  SLEEP: sleepIcon,
  CAFFEINE: caffeineIcon,
  CAFFEINE_CUTOFF: caffeineIcon,
  LIGHT: lightIcon,
  LIGHT_EXPOSURE: lightIcon,
  MEAL: mealIcon,
  NAP: napIcon,
  WAKE: wakeIcon,
}

function TransitionGuide() {
  const navigate = useNavigate()
  const location = useLocation()
  const [checklist, setChecklist] = useState([])
  const [guide, setGuide] = useState(null)
  const [guideSections, setGuideSections] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const options = { signal: controller.signal }
    const date = new URLSearchParams(location.search).get('date') ?? toDateString()
    setIsLoading(true)
    setErrorMessage('')

    getTransitionGuide(date, options)
      .then((data) => {
        setGuide(data)
        setGuideSections(toGuideSections(data.phases, ICON_BY_CATEGORY, lightIcon))
        setIsLoading(false)
      })
      .catch((error) => {
        if (error.name === 'AbortError') return

        setGuide(null)
        setGuideSections([])
        setIsLoading(false)
        setErrorMessage(error.message ?? '전환일 가이드를 불러오지 못했습니다.')
      })

    // 체크리스트는 전환일 루틴 항목이다. 체크 상태를 서버에 남겨야 다시 들어와도 유지된다.
    getTodayRoutines(date, options)
      .then((data) => setChecklist(toChecklistItems(data.tasks)))
      .catch((error) => {
        if (error.name !== 'AbortError') setChecklist([])
      })

    return () => controller.abort()
  }, [location.search])

  const toggleItem = async (itemId) => {
    const previous = checklist
    const selected = checklist.find((item) => item.id === itemId)

    if (!selected) return

    const status = nextChecklistStatus(selected)
    setChecklist((current) => applyChecklistStatus(current, itemId, status))

    try {
      await updateRoutineTask(itemId, status)
    } catch {
      setChecklist(previous)
    }
  }

  return (
    <main className="rhythm-coaching rhythm-coaching--transition">
      <img className="rhythm-coaching__hero" src={routineHero} alt="" aria-hidden="true" />
      <div className="rhythm-coaching__hero-shade" />

      <header className="rhythm-coaching__header">
        <div>
          <h1>
            전환일 안내
            <img src={sparkleIcon} alt="" aria-hidden="true" />
          </h1>
          <p>{guide
            ? `${formatShiftType(guide.fromShiftType)} → ${formatShiftType(guide.toShiftType)} 전환`
            : '전환 정보를 확인하고 있어요'}</p>
        </div>
        <button type="button" aria-label="설정" onClick={() => navigate(PATH.SETTINGS)}>
          <img src={settingsIcon} alt="" />
        </button>
      </header>

      <div className="rhythm-coaching__scroll">
        <div className="rhythm-coaching__body">
          <section className="transition-guide__checklist" aria-labelledby="transition-checklist-title">
            <h2 id="transition-checklist-title">오늘은 이렇게 어때요?</h2>
            {checklist.length === 0 && (
              <p className="rhythm-coaching__empty">
                이 날짜에 실행할 전환 루틴이 아직 없어요.
              </p>
            )}
            <div>
              {checklist.map((item) => (
                <label key={item.id}>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                  />
                  <span aria-hidden="true" />
                  <strong>{item.label}{item.time && ` · ${item.time}`}</strong>
                </label>
              ))}
            </div>
          </section>

          <img className="transition-guide__divider" src={introDivider} alt="" aria-hidden="true" />

          <p className="rhythm-coaching__notice transition-guide__notice">
            {errorMessage || guide?.description || '나이트 근무 종료 후 데이 근무 복귀까지'}
            <br />
            {errorMessage
              ? '전환일 날짜를 확인한 뒤 다시 시도해 주세요.'
              : '각 단계를 순서대로 따라 주세요.'}
          </p>

          {guideSections.length === 0 && (
            <p className="rhythm-coaching__empty">
              {isLoading
                ? '전환일 안내를 불러오는 중이에요.'
                : '이 날짜는 근무 전환일이 아니에요.'}
            </p>
          )}

          <div className="transition-guide__sections">
            {guideSections.map((section, index) => (
              <section className="transition-guide__section" key={section.id}>
                <h2>{section.title}</h2>
                <div className="rhythm-coaching__cards">
                  {section.cards.map((card, cardIndex) => (
                    <CoachingCard
                      key={`${section.id}-${card.id ?? cardIndex}`}
                      {...card}
                    />
                  ))}
                </div>
                {index < guideSections.length - 1 && (
                  <img src={sectionDivider} alt="" aria-hidden="true" />
                )}
              </section>
            ))}
          </div>

          <p className="rhythm-coaching__disclaimer">
            {guide?.disclaimer ?? '이 가이드는 일반적인 참고 정보입니다. 개인 건강 상태에 따라 다를 수 있으며,'}
            <br />
            이상 증상 발생 시 전문가 상담을 권장합니다.
          </p>
        </div>
      </div>

      <span className="rhythm-coaching__home-indicator" aria-hidden="true" />
    </main>
  )
}

export default TransitionGuide
