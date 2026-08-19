import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import cloverSectionIcon from '@/assets/routine-summary/clover-section.svg'
import glowBottom from '@/assets/routine-summary/glow-bottom.svg'
import glowLeft from '@/assets/routine-summary/glow-left.svg'
import glowRight from '@/assets/routine-summary/glow-right.svg'
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

function RoutineSummary() {
  const navigate = useNavigate()
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

      <header className="routine-summary__header">
        <div>
          <h1 id="routine-summary-title" className="routine-summary__title">
            오늘 루틴을 요약해드릴게요
            <img src={sparkleIcon} alt="" aria-hidden="true" />
          </h1>
          <p className="routine-summary__subtitle">루틴이 마무리 되고 있어요</p>
        </div>
        <button
          className="routine-summary__settings"
          type="button"
          aria-label="설정"
          onClick={() => navigate(PATH.SETTINGS)}
        >
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

      <button
        className="routine-summary__cta"
        type="button"
        onClick={() => navigate(PATH.ROUTINE)}
      >
        루틴하러 가기
      </button>

    </main>
  )
}

export default RoutineSummary
