import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import CoachingCard from './components/CoachingCard.jsx'
import CoachingStatusBar from './components/CoachingStatusBar.jsx'
import './RhythmCoaching.scss'

const checklistItems = [
  { id: 'caffeine', label: '오후 2시 이전 카페인 섭취 완료' },
  { id: 'screen', label: '저녁 8시 이후 스크린 밝기 낮추기' },
  { id: 'sleep', label: '22:30 이전 취침 준비 시작' },
  { id: 'snack', label: '야식 대신 가벼운 간식으로 대체' },
]

const guideSections = [
  {
    id: 'before',
    title: '전날',
    cards: [
      { icon: sleepIcon, title: '수면', description: '평소보다 1~2 시간 일찍 취침 (22:00~23:00) 권장' },
      { icon: caffeineIcon, title: '카페인', description: '오후 2시 이후 카페인 섭취 중단' },
      { icon: lightIcon, title: '빛 노출', description: '저녁 8시 이후 밝은 빛·스크린 노출 최소화' },
      { icon: mealIcon, title: '식사', description: '저녁 식사는 가볍게, 야식 자제' },
    ],
  },
  {
    id: 'transition',
    title: '전날',
    cards: [
      { icon: wakeIcon, title: '기상', description: '평소보다 1~2 시간 일찍 취침 (22:00~23:00) 권장' },
      { icon: lightIcon, title: '빛 노출', description: '오후 2시 이후 카페인 섭취 중단' },
      { icon: napIcon, title: '낮잠', description: '저녁 8시 이후 밝은 빛·스크린 노출 최소화' },
      { icon: mealIcon, title: '식사', description: '저녁 식사는 가볍게, 야식 자제' },
    ],
  },
  {
    id: 'after',
    title: '전날',
    cards: [
      { icon: wakeIcon, title: '기상', description: '평소보다 1~2 시간 일찍 취침 (22:00~23:00) 권장' },
      { icon: lightIcon, title: '빛 노출', description: '오후 2시 이후 카페인 섭취 중단' },
      { icon: napIcon, title: '낮잠', description: '저녁 8시 이후 밝은 빛·스크린 노출 최소화' },
      { icon: mealIcon, title: '식사', description: '저녁 식사는 가볍게, 야식 자제' },
    ],
  },
]

function TransitionGuide() {
  const navigate = useNavigate()
  const [checkedItems, setCheckedItems] = useState({})

  const toggleItem = (itemId) => {
    setCheckedItems((current) => ({
      ...current,
      [itemId]: !current[itemId],
    }))
  }

  return (
    <main className="rhythm-coaching rhythm-coaching--transition">
      <img className="rhythm-coaching__hero" src={routineHero} alt="" aria-hidden="true" />
      <div className="rhythm-coaching__hero-shade" />
      <CoachingStatusBar />

      <header className="rhythm-coaching__header">
        <div>
          <h1>
            전환일 안내
            <img src={sparkleIcon} alt="" aria-hidden="true" />
          </h1>
          <p>나이트 → 데이 전환</p>
        </div>
        <button type="button" aria-label="설정" onClick={() => navigate(PATH.SETTINGS)}>
          <img src={settingsIcon} alt="" />
        </button>
      </header>

      <div className="rhythm-coaching__scroll">
        <div className="rhythm-coaching__body">
          <section className="transition-guide__checklist" aria-labelledby="transition-checklist-title">
            <h2 id="transition-checklist-title">오늘은 이렇게 어때요?</h2>
            <div>
              {checklistItems.map((item) => (
                <label key={item.id}>
                  <input
                    type="checkbox"
                    checked={Boolean(checkedItems[item.id])}
                    onChange={() => toggleItem(item.id)}
                  />
                  <span aria-hidden="true" />
                  <strong>{item.label}</strong>
                </label>
              ))}
            </div>
          </section>

          <img className="transition-guide__divider" src={introDivider} alt="" aria-hidden="true" />

          <p className="rhythm-coaching__notice transition-guide__notice">
            나이트 근무 종료 후 데이 근무 복귀까지
            <br />
            72시간 적응 가이드입니다. 각 단계를 순서대로 따라 주세요.
          </p>

          <div className="transition-guide__sections">
            {guideSections.map((section, index) => (
              <section className="transition-guide__section" key={section.id}>
                <h2>{section.title}</h2>
                <div className="rhythm-coaching__cards">
                  {section.cards.map((card) => (
                    <CoachingCard key={`${section.id}-${card.title}`} {...card} />
                  ))}
                </div>
                {index < guideSections.length - 1 && (
                  <img src={sectionDivider} alt="" aria-hidden="true" />
                )}
              </section>
            ))}
          </div>

          <p className="rhythm-coaching__disclaimer">
            이 가이드는 일반적인 참고 정보입니다. 개인 건강 상태에 따라 다를 수 있으며,
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
