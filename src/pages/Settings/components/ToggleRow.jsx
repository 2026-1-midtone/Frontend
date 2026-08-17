import ToggleSwitch from '../../../components/common/ToggleSwitch.jsx'
import './ToggleRow.scss'

/**
 * "라벨 (+캡션) — 토글" 형태의 알림 설정 한 줄.
 * @param {string} label
 * @param {string} caption 라벨 아래 보조 설명 (예: 권장 시간)
 * @param {boolean} checked
 * @param {(checked: boolean) => void} onChange
 * @param {React.ReactNode} children 토글 아래에 추가로 넣을 컨트롤 (시간 선택 등)
 */
function ToggleRow({ label, caption, checked, onChange, children }) {
  return (
    <div className="toggle-row">
      <div className="toggle-row__head">
        <span className="toggle-row__label">
          {label}
          {caption && <span className="toggle-row__caption"> {caption}</span>}
        </span>
        <ToggleSwitch checked={checked} onChange={onChange} label={label} />
      </div>
      {children && (
        <div className={checked ? 'toggle-row__body' : 'toggle-row__body is-disabled'}>
          {children}
        </div>
      )}
    </div>
  )
}

export default ToggleRow
