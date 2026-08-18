import { useEffect } from 'react'
import characterImage from '../../assets/character.svg'
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
  // 말풍선이 화면 위치상 다른 콘텐츠(드롭다운, 링크 등)와 겹칠 수 있어
  // 스크롤을 시작하면 자동으로 닫는다. 마스코트 아이콘만 남아 플로팅을 유지한다.
  useEffect(() => {
    if (!showMessage) return undefined

    const scrollContainer = document.querySelector('.app-layout__frame')
    if (!scrollContainer) return undefined

    scrollContainer.addEventListener('scroll', onDismissMessage, {
      once: true,
      passive: true,
    })
    return () => scrollContainer.removeEventListener('scroll', onDismissMessage)
  }, [showMessage, onDismissMessage])

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
