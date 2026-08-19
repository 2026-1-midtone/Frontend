import './ChatMessageBubble.scss'

/**
 * 대화 말풍선. 본문 문단에 이어 아이콘+라벨/값 정보 줄과 각주를
 * 같은 말풍선 안에 함께 넣을 수 있다.
 *
 * @param {'ai'|'user'} sender
 * @param {{ text: string, highlight?: boolean }[]} segments 본문 문단
 * @param {{ icon: string, label: string, value: string }} infoRow
 * @param {string} footnote
 */
function ChatMessageBubble({
  sender,
  segments,
  infoRow,
  footnote,
  emergencyContacts,
  safetyFlag,
}) {
  const isAi = sender === 'ai'

  return (
    <div
      className={isAi ? 'chat-bubble is-ai' : 'chat-bubble is-user'}
      data-safety-flag={safetyFlag || undefined}
    >
      <p className="chat-bubble__text">
        {segments.map((segment, index) => (
          <span
            key={index}
            className={segment.highlight ? 'chat-bubble__highlight' : undefined}
          >
            {segment.text}
          </span>
        ))}
      </p>

      {infoRow && (
        <p className="chat-bubble__info-row">
          {infoRow.icon} {infoRow.label} / {infoRow.value}
        </p>
      )}

      {emergencyContacts?.length > 0 && (
        <p className="chat-bubble__contacts">
          {emergencyContacts.map((contact) => (
            <a key={`${contact.name}-${contact.number}`} href={`tel:${contact.number}`}>
              {contact.name} {contact.number}
            </a>
          ))}
        </p>
      )}

      {footnote && <p className="chat-bubble__footnote">{footnote}</p>}
    </div>
  )
}

export default ChatMessageBubble
