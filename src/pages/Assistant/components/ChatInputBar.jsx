import { IconUpload } from '../../../components/common/icons/index.jsx'
import './ChatInputBar.scss'

/**
 * 하단 입력창 + 전송 버튼 + 고정 면책 문구.
 * @param {string} value
 * @param {(value: string) => void} onChange
 * @param {() => void} onSend
 * @param {string} disclaimer
 */
function ChatInputBar({ value, onChange, onSend, disclaimer }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    if (value.trim()) {
      onSend()
    }
  }

  return (
    <div className="chat-input-bar">
      <form className="chat-input-bar__row" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input-bar__input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="궁금한 점을 물어보세요"
          aria-label="AI 비서에게 질문 입력"
        />
        <button
          type="submit"
          className="chat-input-bar__send"
          disabled={!value.trim()}
          aria-label="전송"
        >
          <IconUpload size={18} />
        </button>
      </form>

      <p className="chat-input-bar__disclaimer">{disclaimer}</p>
    </div>
  )
}

export default ChatInputBar
