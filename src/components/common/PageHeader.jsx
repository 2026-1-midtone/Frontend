import sparkleIcon from '../../assets/sparkle.svg'
import SettingsButton from './SettingsButton.jsx'
import './PageHeader.scss'

/**
 * 타이틀 + 설정 버튼 + 부제로 구성된 화면 상단 헤더.
 * 근무표 관리 화면에서 처음 쓰였고, 코칭·루틴 등 하단 탭 화면 전반에서
 * 재사용할 수 있도록 공용 컴포넌트로 둔다.
 *
 * @param {string} title
 * @param {string} subtitle
 * @param {() => void} onSettingsClick
 */
function PageHeader({ title, subtitle, onSettingsClick }) {
  return (
    <header className="page-header">
      <div className="page-header__row">
        <h1 className="page-header__title">
          <span>{title}</span>
          <img
            className="page-header__sparkle"
            src={sparkleIcon}
            alt=""
            width={18}
            height={18}
          />
        </h1>
        <SettingsButton onClick={onSettingsClick} />
      </div>

      {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
    </header>
  )
}

export default PageHeader
