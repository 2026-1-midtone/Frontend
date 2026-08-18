import { IconSettings } from './icons/index.jsx'
import './SettingsButton.scss'

/**
 * 설정 진입 버튼.
 * @param {() => void} onClick 클릭 핸들러
 * @param {string} className 배치용 추가 클래스
 */
function SettingsButton({ onClick, className = '' }) {
  return (
    <button
      type="button"
      className={`settings-button ${className}`.trim()}
      onClick={onClick}
      aria-label="설정"
    >
      <IconSettings size={26} />
    </button>
  )
}

export default SettingsButton
