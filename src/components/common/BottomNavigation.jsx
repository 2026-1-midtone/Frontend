import { NavLink } from 'react-router-dom'
import './BottomNavigation.scss'

/**
 * 하단 탭 네비게이션.
 *
 * 탭 구성을 props로 받아 화면에 종속되지 않게 한다.
 * @param {{ to: string, label: string, icon: React.ComponentType<{size?: number}>, end?: boolean }[]} items
 */
function BottomNavigation({ items }) {
  return (
    <nav className="bottom-navigation" aria-label="주요 메뉴">
      <ul className="bottom-navigation__list">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="bottom-navigation__item">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive
                  ? 'bottom-navigation__link is-active'
                  : 'bottom-navigation__link'
              }
            >
              <Icon size={22} />
              <span className="bottom-navigation__label">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default BottomNavigation
