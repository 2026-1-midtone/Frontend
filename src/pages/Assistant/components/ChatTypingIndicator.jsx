import './ChatTypingIndicator.scss'

/**
 * AI가 응답을 준비 중임을 보여주는 점 3개 애니메이션 말풍선.
 */
function ChatTypingIndicator() {
  return (
    <div className="chat-typing" role="status" aria-label="AI가 응답을 준비 중입니다">
      <span className="chat-typing__dot" />
      <span className="chat-typing__dot" />
      <span className="chat-typing__dot" />
    </div>
  )
}

export default ChatTypingIndicator
