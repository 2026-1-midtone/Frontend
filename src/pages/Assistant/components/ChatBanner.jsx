import './ChatBanner.scss'

/**
 * 대화 화면 상단에 고정되는 안내 배너.
 * @param {string} title
 * @param {string} description
 */
function ChatBanner({ title, description }) {
  return (
    <div className="chat-banner">
      <p>{title}</p>
      <p>{description}</p>
    </div>
  )
}

export default ChatBanner
