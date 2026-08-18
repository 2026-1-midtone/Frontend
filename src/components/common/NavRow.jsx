import { IconChevronRight } from './icons/index.jsx'
import './NavRow.scss'

/**
 * 라벨 + 설명 + 화살표로 구성된 이동 행. 클릭하면 하위 화면으로 이동한다.
 * @param {string} title
 * @param {string} description
 * @param {() => void} onClick
 */
function NavRow({ title, description, onClick }) {
  return (
    <button type="button" className="nav-row" onClick={onClick}>
      <span className="nav-row__text">
        <span className="nav-row__title">{title}</span>
        {description && <span className="nav-row__description">{description}</span>}
      </span>
      <IconChevronRight size={20} className="nav-row__icon" />
    </button>
  )
}

export default NavRow
