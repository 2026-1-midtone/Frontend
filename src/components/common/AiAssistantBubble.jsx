import { useRef, useState } from 'react'
import AssistantMascot from './AssistantMascot.jsx'
import './AiAssistantBubble.scss'

// 드래그로 간주하기 위한 최소 이동 거리(px). 이보다 작으면 탭(클릭)으로 처리한다.
const DRAG_THRESHOLD = 6

/**
 * 플로팅 AI 비서 진입점. 하단 탭이 붙는 화면 전반에서 재사용한다.
 * 휴대전화에서 손가락으로 드래그해 위치를 옮길 수 있고, 제자리에서 탭하면 비서 화면으로 이동한다.
 * @param {() => void} onOpen 비서 열기
 */
function AiAssistantBubble({ onOpen }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef(null)
  const draggedRef = useRef(false)

  const handlePointerDown = (event) => {
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    }
    draggedRef.current = false
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    if (!drag) return

    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY

    if (!draggedRef.current) {
      if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return
      draggedRef.current = true
    }

    setOffset({ x: drag.originX + dx, y: drag.originY + dy })
  }

  const handlePointerUp = () => {
    dragRef.current = null
  }

  const handleClick = () => {
    if (draggedRef.current) {
      draggedRef.current = false
      return
    }
    onOpen?.()
  }

  return (
    <button
      type="button"
      className="ai-assistant"
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      aria-label="AI 비서에게 물어보기"
    >
      <AssistantMascot />
    </button>
  )
}

export default AiAssistantBubble
