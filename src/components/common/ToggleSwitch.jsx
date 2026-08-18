import './ToggleSwitch.scss'

/**
 * 온/오프 토글 스위치.
 * @param {boolean} checked
 * @param {(checked: boolean) => void} onChange
 * @param {string} label 스크린리더용 라벨. 시각 라벨은 보통 옆에 따로 둔다.
 * @param {boolean} disabled
 */
function ToggleSwitch({ checked, onChange, label, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={checked ? 'toggle-switch is-on' : 'toggle-switch'}
      onClick={() => onChange?.(!checked)}
    >
      <span className="toggle-switch__thumb" />
    </button>
  )
}

export default ToggleSwitch
