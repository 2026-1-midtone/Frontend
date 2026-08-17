import sparkleIcon from '../../../assets/sparkle.svg'
import './HomeGreeting.scss'

/**
 * 홈 상단 인사 영역.
 * @param {string} message 인사 문구
 * @param {string} shiftLabel 현재 근무 상태 (예: "나이트 근무 D+2")
 */
function HomeGreeting({ message, shiftLabel }) {
  return (
    <header className="home-greeting">
      <h1 className="home-greeting__message">
        <span>{message}</span>
        <img
          className="home-greeting__sparkle"
          src={sparkleIcon}
          alt=""
          width={20}
          height={20}
        />
      </h1>
      <p className="home-greeting__shift">{shiftLabel}</p>
    </header>
  )
}

export default HomeGreeting
