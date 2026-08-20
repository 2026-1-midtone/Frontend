import { useEffect, useRef, useState } from 'react'
import { IconCheck, IconChevronDown } from './icons/index.jsx'
import './Select.scss'

/**
 * 네이티브 select를 대체하는 커스텀 드롭다운.
 *
 * 브라우저 기본 옵션 목록은 OS 테마를 따라가서, 다크 테마 트리거와
 * 옵션 글자색이 겹쳐 안 보이는 문제가 생긴다. 옵션 목록을 직접 그려서
 * 앱 전체에서 동일한 스타일을 쓰도록 한다.
 *
 * @param {string} value
 * @param {(value: string) => void} onChange
 * @param {{ value: string, label: string }[]} options
 * @param {string} placeholder
 * @param {boolean} disabled
 * @param {string} className
 * @param {string} ariaLabel 화면에 라벨이 따로 없을 때 스크린리더용 이름
 */
function Select({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  className = '',
  ariaLabel,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (optionValue) => {
    onChange?.(optionValue)
    setIsOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className={`select${isOpen ? ' is-open' : ''}${className ? ` ${className}` : ''}`}
    >
      <button
        type="button"
        className="select__trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={`select__value${selectedOption ? '' : ' is-placeholder'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <IconChevronDown size={16} className="select__icon" />
      </button>

      {isOpen && (
        <ul className="select__list" role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={`select__option${option.value === value ? ' is-selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              <span>{option.label}</span>
              {option.value === value && <IconCheck size={14} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Select
