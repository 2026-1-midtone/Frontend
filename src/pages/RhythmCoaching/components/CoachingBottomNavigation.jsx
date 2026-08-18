import { useNavigate } from 'react-router-dom'
import calendarIcon from '@/assets/routine-summary/calendar-edit.svg'
import cloverIcon from '@/assets/routine-summary/clover-nav.svg'
import draftsIcon from '@/assets/routine-summary/drafts.svg'
import homeIcon from '@/assets/routine-summary/home.svg'
import { PATH } from '@/routes/paths.js'

const navigationItems = [
  { id: 'home', label: 'Home', icon: homeIcon },
  { id: 'calendar', label: 'Home', icon: calendarIcon },
  { id: 'drafts', label: 'Home', icon: draftsIcon },
  { id: 'more', label: 'Home', icon: cloverIcon },
]

function CoachingBottomNavigation() {
  const navigate = useNavigate()

  return (
    <nav className="coaching-navigation" aria-label="주요 메뉴">
      {navigationItems.map((item, index) => (
        <button
          className={`coaching-navigation__item${index === 0 ? ' coaching-navigation__item--active' : ''}`}
          type="button"
          key={item.id}
          onClick={index === 0 ? () => navigate(PATH.ROUTINE_SUMMARY) : undefined}
          aria-label={index === 0 ? '홈으로 이동' : `${item.label} 메뉴`}
          aria-current={index === 0 ? 'page' : undefined}
        >
          <img src={item.icon} alt="" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default CoachingBottomNavigation
