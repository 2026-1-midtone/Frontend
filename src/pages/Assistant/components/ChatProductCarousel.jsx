import './ChatProductCarousel.scss'

/**
 * 가로 스크롤 제품 추천 카드 목록.
 * @param {{ id: string, image: string, name: string, ctaLabel: string }[]} items
 * @param {(id: string) => void} onSelect
 */
function ChatProductCarousel({ items, onSelect }) {
  return (
    <ul className="chat-product-carousel">
      {items.map(({ id, image, name, ctaLabel }) => (
        <li key={id} className="chat-product-carousel__item">
          <img className="chat-product-carousel__image" src={image} alt={name} />
          <button
            type="button"
            className="chat-product-carousel__cta"
            onClick={() => onSelect?.(id)}
          >
            {ctaLabel}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default ChatProductCarousel
