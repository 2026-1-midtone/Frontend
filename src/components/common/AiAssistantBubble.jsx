import { useState } from 'react'
import closeIcon from '@/assets/assistant/assistant-close.svg'
import messageBubble from '@/assets/assistant/assistant-message.svg'
import AssistantMascot from './AssistantMascot.jsx'
import './AiAssistantBubble.scss'

/**
 * 플로팅 AI 비서 진입점. 하단 탭이 붙는 화면 전반에서 재사용한다.
 * 말풍선이나 마스코트를 누르면 비서 화면으로 이동하고 X 버튼을 누르면 전체 진입점을 닫는다.
 * @param {() => void} onOpen 비서 열기
 */
function AiAssistantBubble({ onOpen }) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="ai-assistant">
      <button
        type="button"
        className="ai-assistant__message"
        onClick={onOpen}
      >
        <img src={messageBubble} alt="" aria-hidden="true" />
        <span>AI비서한테 물어보세요!</span>
      </button>
      <button
        type="button"
        className="ai-assistant__close"
        onClick={() => setIsVisible(false)}
        aria-label="AI 비서 닫기"
      >
        <img src={closeIcon} alt="" />
      </button>
      <button
        type="button"
        className="ai-assistant__mascot"
        onClick={onOpen}
        aria-label="AI 비서에게 물어보기"
      >
        <AssistantMascot />
      </button>
    </div>
  )
}

export default AiAssistantBubble
