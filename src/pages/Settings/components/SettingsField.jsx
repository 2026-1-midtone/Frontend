import Select from '../../../components/common/Select.jsx'
import './SettingsField.scss'

/**
 * "행 라벨 — 필드 라벨 + 입력/선택 컨트롤" 두 칸 레이아웃.
 * 개인화 설정·코칭 알림 설정 화면에서 반복되는 패턴을 공유한다.
 *
 * @param {string} rowLabel 왼쪽의 굵은 항목명 (예: "카페인 민감도")
 * @param {string} fieldLabel 컨트롤 위의 작은 설명 (예: "민감도 수준")
 * @param {'text'|'number'|'time'|'datetime-local'|'select'} type
 * @param {string} value
 * @param {(value: string) => void} onChange
 * @param {string} placeholder
 * @param {{ value: string, label: string }[]} options type이 'select'일 때 옵션 목록
 * @param {string} caption 필드 아래 전체 폭 보조 설명
 */
function SettingsField({
  rowLabel,
  fieldLabel,
  type = 'select',
  value,
  onChange,
  placeholder = 'Select...',
  options = [],
  caption,
}) {
  return (
    <div className="settings-field">
      <div className="settings-field__row">
        <span className="settings-field__row-label">{rowLabel}</span>

        <div className="settings-field__control">
          {fieldLabel && <span className="settings-field__field-label">{fieldLabel}</span>}

          {type !== 'select' ? (
            <input
              type={type}
              className="settings-field__input"
              value={value}
              placeholder={placeholder}
              min={type === 'number' ? 0 : undefined}
              inputMode={type === 'number' ? 'numeric' : undefined}
              onChange={(event) => onChange?.(event.target.value)}
            />
          ) : (
            <Select
              value={value ?? ''}
              onChange={onChange}
              options={options}
              placeholder={placeholder}
            />
          )}
        </div>
      </div>

      {caption && <p className="settings-field__caption">{caption}</p>}
    </div>
  )
}

export default SettingsField
