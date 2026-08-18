import mascotSprite from '@/assets/assistant/assistant-mascot-sprite.png'
import './AssistantMascot.scss'

function AssistantMascot({ className = '', variant = 'default' }) {
  const variantClass =
    variant === 'default' ? '' : ` assistant-mascot--${variant}`

  return (
    <span
      className={`assistant-mascot${variantClass}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <img src={mascotSprite} alt="" />
    </span>
  )
}

export default AssistantMascot
