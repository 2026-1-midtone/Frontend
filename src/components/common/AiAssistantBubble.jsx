import AssistantMascot from './AssistantMascot.jsx'
import { IconClose } from './icons/index.jsx'
import './AiAssistantBubble.scss'

/**
 * 플로팅 AI 비서 진입점. 하단 탭이 붙는 화면 전반에서 재사용한다.
 * @param {string} message 말풍선 문구
 * @param {boolean} showMessage 말풍선 노출 여부
 * @param {() => void} onDismissMessage 말풍선 닫기
 * @param {() => void} onOpen 비서 열기
 */
function AiAssistantBubble({ message, showMessage, onDismissMessage, onOpen }) {
  return (
    <div className="ai-assistant">
      {showMessage && (
        <div className="ai-assistant__bubble">
          <p className="ai-assistant__message">{message}</p>
          <button
            type="button"
            className="ai-assistant__close"
            onClick={onDismissMessage}
            aria-label="안내 닫기"
          >
            <IconClose size={14} />
          </button>
        </div>
      )}

      <button
        type="button"
        className="ai-assistant__trigger"
        onClick={onOpen}
        aria-label="AI 비서에게 물어보기"
      >
        <AssistantMascot />
      </button>
    </div>
  )
}

export default AiAssistantBubble
