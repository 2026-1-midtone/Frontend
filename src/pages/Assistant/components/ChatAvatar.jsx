import characterImage from '../../../assets/character.svg'
import './ChatAvatar.scss'

/**
 * 대화 화면에서 쓰는 작은 캐릭터 아바타.
 */
function ChatAvatar() {
  return (
    <div className="chat-avatar">
      <img src={characterImage} alt="" width={32} height={27} />
    </div>
  )
}

export default ChatAvatar
