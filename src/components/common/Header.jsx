import { NavLink } from 'react-router-dom'
import { PATH } from '../../routes/paths.js'
import './Header.scss'

const NAV_ITEMS = [
  { to: PATH.HOME, label: '홈', end: true },
  { to: PATH.SCHEDULE, label: '근무표' },
  { to: PATH.TEAM, label: '팀' },
]

function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <NavLink to={PATH.HOME} className="header__logo">
          시프트메이트
        </NavLink>

        <nav className="header__nav" aria-label="주요 메뉴">
          <ul className="header__nav-list">
            {NAV_ITEMS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    isActive ? 'header__nav-link is-active' : 'header__nav-link'
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" className="header__login">
          로그인
        </button>
      </div>
    </header>
  )
}

export default Header
