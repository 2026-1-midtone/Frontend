import { useState } from 'react'
import aiAssistantImage from '@/assets/routine-summary/ai-assistant.png'
import assistantBubble from '@/assets/routine-summary/assistant-bubble.svg'

function AssistantPrompt() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <aside className="coaching-assistant" aria-label="AI 비서 안내">
      <div className="coaching-assistant__message">
        <img src={assistantBubble} alt="" aria-hidden="true" />
        <span>AI비서한테 물어보세요!</span>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          aria-label="AI 비서 닫기"
        >
          ×
        </button>
      </div>
      <img
        className="coaching-assistant__character"
        src={aiAssistantImage}
        alt="AI 비서 캐릭터"
      />
    </aside>
  )
}

export default AssistantPrompt
