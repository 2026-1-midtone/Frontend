import ChatAvatar from './ChatAvatar.jsx'
import './ChatRow.scss'

/**
 * 대화 한 줄의 정렬·아바타를 담당하는 래퍼.
 * AI 쪽 연속 메시지는 그룹의 첫 번째에만 아바타를 보여주고,
 * 나머지는 정렬을 맞추기 위한 빈 자리만 차지한다.
 *
 * @param {'ai'|'user'} sender
 * @param {boolean} showAvatar sender가 'ai'일 때만 의미가 있다
 * @param {React.ReactNode} children 말풍선 또는 제품 캐러셀 등 실제 콘텐츠
 */
function ChatRow({ sender, showAvatar, children }) {
  const isAi = sender === 'ai'

  return (
    <div className={isAi ? 'chat-row is-ai' : 'chat-row is-user'}>
      {isAi && (showAvatar ? <ChatAvatar /> : <span className="chat-row__avatar-spacer" />)}
      <div className="chat-row__content">{children}</div>
    </div>
  )
}

export default ChatRow
