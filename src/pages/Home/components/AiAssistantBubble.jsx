import characterImage from '../../../assets/character.svg'
import { IconClose } from '../../../components/common/icons/index.jsx'
import './AiAssistantBubble.scss'

/**
 * 플로팅 AI 비서 진입점.
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
        <img src={characterImage} alt="" width={72} height={60} />
      </button>
    </div>
  )
}

export default AiAssistantBubble
