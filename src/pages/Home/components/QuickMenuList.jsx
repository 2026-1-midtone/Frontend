import './QuickMenuList.scss'

/**
 * 가로 스크롤 퀵메뉴.
 *
 * 시안처럼 마지막 항목이 화면 오른쪽 끝에서 잘려 보이도록,
 * 스크롤 컨테이너가 페이지 좌우 여백 바깥까지 확장된다.
 *
 * @param {{ id: string, label: string, icon: React.ComponentType<{size?: number}> }[]} items
 * @param {(id: string) => void} onSelect
 */
function QuickMenuList({ items, onSelect }) {
  return (
    <nav className="quick-menu" aria-label="바로가기">
      <ul className="quick-menu__list">
        {items.map(({ id, label, icon: Icon }) => (
          <li key={id} className="quick-menu__item">
            <button
              type="button"
              className="quick-menu__button"
              onClick={() => onSelect?.(id)}
            >
              <span className="quick-menu__tile">
                <Icon size={30} />
              </span>
              <span className="quick-menu__label">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default QuickMenuList
