import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import aiAssistantImage from '@/assets/routine-summary/ai-assistant.png'
import assistantBubble from '@/assets/routine-summary/assistant-bubble.svg'
import assistantSparkle from '@/assets/routine-summary/assistant-sparkle.svg'
import calendarIcon from '@/assets/routine-summary/calendar-edit.svg'
import cloverNavIcon from '@/assets/routine-summary/clover-nav.svg'
import cloverSectionIcon from '@/assets/routine-summary/clover-section.svg'
import draftsIcon from '@/assets/routine-summary/drafts.svg'
import glowBottom from '@/assets/routine-summary/glow-bottom.svg'
import glowLeft from '@/assets/routine-summary/glow-left.svg'
import glowRight from '@/assets/routine-summary/glow-right.svg'
import homeIcon from '@/assets/routine-summary/home.svg'
import routineHero from '@/assets/routine-summary/routine-hero.png'
import settingsIcon from '@/assets/routine-summary/settings.svg'
import sparkleIcon from '@/assets/routine-summary/sparkle.svg'
import { PATH } from '@/routes/paths.js'
import './RoutineSummary.scss'

const routines = [
  { id: 1, completed: false },
  { id: 2, completed: false },
  { id: 3, completed: true },
  { id: 4, completed: false },
  { id: 5, completed: false },
]

const navigationItems = [
  { id: 'home', label: 'Home', ariaLabel: '홈', icon: homeIcon },
  { id: 'routine', label: 'Home', ariaLabel: '루틴', icon: calendarIcon },
  { id: 'record', label: 'Home', ariaLabel: '기록', icon: draftsIcon },
  { id: 'more', label: 'Home', ariaLabel: '더보기', icon: cloverNavIcon },
]

function StatusBar() {
  return (
    <div className="routine-summary__status-bar" aria-hidden="true">
      <span className="routine-summary__time">9:30</span>
      <span className="routine-summary__camera" />
      <div className="routine-summary__device-status">
        <span className="routine-summary__signal" />
        <span className="routine-summary__wifi" />
        <span className="routine-summary__battery" />
      </div>
    </div>
  )
}

function RoutineSummary() {
  const navigate = useNavigate()
  const [isAssistantVisible, setIsAssistantVisible] = useState(true)
  const routineListDrag = useRef({
    active: false,
    startY: 0,
    scrollTop: 0,
  })

  const handleListPointerDown = (event) => {
    if (event.pointerType !== 'mouse') return

    routineListDrag.current = {
      active: true,
      startY: event.clientY,
      scrollTop: event.currentTarget.scrollTop,
    }
    event.currentTarget.dataset.dragging = 'true'
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleListPointerMove = (event) => {
    if (!routineListDrag.current.active) return

    const distance = event.clientY - routineListDrag.current.startY
    event.currentTarget.scrollTop = routineListDrag.current.scrollTop - distance
  }

  const stopListDragging = (event) => {
    routineListDrag.current.active = false
    event.currentTarget.dataset.dragging = 'false'

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <main className="routine-summary" aria-labelledby="routine-summary-title">
      <img
        className="routine-summary__hero"
        src={routineHero}
        alt=""
        aria-hidden="true"
      />
      <div className="routine-summary__hero-shade" />
      <StatusBar />

      <header className="routine-summary__header">
        <div>
          <h1 id="routine-summary-title" className="routine-summary__title">
            오늘 루틴을 요약해드릴게요
            <img src={sparkleIcon} alt="" aria-hidden="true" />
          </h1>
          <p className="routine-summary__subtitle">루틴이 마무리 되고 있어요</p>
        </div>
        <button className="routine-summary__settings" type="button" aria-label="설정">
          <img src={settingsIcon} alt="" />
        </button>
      </header>

      <section
        className="routine-summary__progress"
        aria-label="오늘의 루틴 현황"
      >
        <p>
          오늘의 루틴 현황 - <strong>30% 완료</strong>
        </p>
        <div
          className="routine-summary__progress-track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="30"
        >
          <span />
        </div>
      </section>

      <section className="routine-summary__content" aria-labelledby="today-routine-title">
        <img className="routine-summary__glow routine-summary__glow--left" src={glowLeft} alt="" />
        <img className="routine-summary__glow routine-summary__glow--bottom" src={glowBottom} alt="" />
        <img className="routine-summary__glow routine-summary__glow--right" src={glowRight} alt="" />

        <div className="routine-summary__section-heading">
          <h2 id="today-routine-title">
            오늘의 루틴
            <img src={cloverSectionIcon} alt="" aria-hidden="true" />
          </h2>
          <p>놓친 항목은 내일 루틴에 반영됩니다.</p>
        </div>

        <ul
          className="routine-summary__list"
          aria-label="오늘의 루틴 목록"
          tabIndex="0"
          onPointerDown={handleListPointerDown}
          onPointerMove={handleListPointerMove}
          onPointerUp={stopListDragging}
          onPointerCancel={stopListDragging}
        >
          {routines.map((routine) => (
            <li className="routine-summary__routine" key={routine.id}>
              <span className="routine-summary__emoji" aria-hidden="true">☕</span>
              <div className="routine-summary__routine-copy">
                <h3>카페인 컷오프 준수</h3>
                <p>14:00 이전 마지막 카페인 섭취 권장</p>
              </div>
              <span className="routine-summary__routine-status">
                {routine.completed ? '완료' : '미실행'}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="routine-summary__footer-shade" />

      {isAssistantVisible && (
        <aside className="routine-summary__assistant" aria-label="AI 비서 안내">
          <div className="routine-summary__assistant-message">
            <img src={assistantBubble} alt="" aria-hidden="true" />
            <span>AI비서한테 물어보세요!</span>
            <button
              className="routine-summary__assistant-close"
              type="button"
              aria-label="AI 비서 닫기"
              onClick={() => setIsAssistantVisible(false)}
            >
              <img src={assistantSparkle} alt="" />
            </button>
          </div>
          <img
            className="routine-summary__assistant-character"
            src={aiAssistantImage}
            alt="AI 비서 캐릭터"
          />
        </aside>
      )}

      <button
        className="routine-summary__cta"
        type="button"
        onClick={() => navigate(PATH.DAILY_ROUTINE)}
      >
        루틴하러 가기
      </button>

      <nav className="routine-summary__navigation" aria-label="주요 메뉴">
        {navigationItems.map((item, index) => (
          <button
            className={`routine-summary__nav-item${index === 0 ? ' routine-summary__nav-item--active' : ''}`}
            type="button"
            key={item.id}
            aria-label={item.ariaLabel}
            aria-current={index === 0 ? 'page' : undefined}
          >
            <img src={item.icon} alt="" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <span className="routine-summary__home-indicator" aria-hidden="true" />
    </main>
  )
}

export default RoutineSummary
