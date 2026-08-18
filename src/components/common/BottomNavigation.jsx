import { Link, useLocation } from 'react-router-dom'
import './BottomNavigation.scss'

/**
 * 하단 탭 네비게이션.
 *
 * 탭 구성을 props로 받아 화면에 종속되지 않게 한다.
 * @param {{ to: string, label: string, iconSrc: string, activePaths?: string[] }[]} items
 */
function BottomNavigation({ items }) {
  const { pathname } = useLocation()

  const isPathActive = (item) => {
    const paths = item.activePaths ?? [item.to]

    return paths.some((path) => (
      pathname === path || pathname.startsWith(`${path}/`)
    ))
  }

  return (
    <nav className="bottom-navigation" aria-label="주요 메뉴">
      <ul className="bottom-navigation__list">
        {items.map((item) => {
          const isActive = isPathActive(item)

          return (
            <li key={item.to} className="bottom-navigation__item">
              <Link
                to={item.to}
                className={`bottom-navigation__link${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className="bottom-navigation__icon"
                  style={{ '--bottom-navigation-icon': `url("${item.iconSrc}")` }}
                  aria-hidden="true"
                />
                <span className="bottom-navigation__label">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default BottomNavigation
