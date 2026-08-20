import { useState } from 'react'
import { createPortal } from 'react-dom'
import Select from '../../../components/common/Select.jsx'
import { IconClose } from '../../../components/common/icons/index.jsx'
import { SHIFT_VALUES, formatDate, formatShiftType } from '../../../lib/formatApiData.js'
import './ShiftEditSheet.scss'

const SHIFT_OPTIONS = SHIFT_VALUES.map((value) => ({
  value,
  label: formatShiftType(value),
}))

/**
 * 근무 하루치를 추가·수정·삭제하는 시트.
 *
 * 시각을 비워 두면 요청에서 빼서 보내므로, 새로 만들 때는 백엔드가 근무 유형별
 * 기본 시각으로 채우고 수정할 때는 기존 시각이 그대로 유지된다.
 *
 * @param {object} props
 * @param {string} props.date 수정할 날짜 (YYYY-MM-DD)
 * @param {{ shiftId: number, shiftType: string, startTime?: string, endTime?: string }} [props.shift]
 *   해당 날짜에 이미 등록된 근무. 없으면 추가 모드로 동작한다.
 * @param {(form: { shiftType: string, startTime: string, endTime: string }) => void} props.onSave
 * @param {() => void} props.onDelete
 * @param {() => void} props.onClose
 * @param {boolean} [props.isSaving]
 * @param {string} [props.errorMessage]
 */
function ShiftEditSheet({
  date,
  shift,
  onSave,
  onDelete,
  onClose,
  isSaving = false,
  errorMessage = '',
}) {
  const [shiftType, setShiftType] = useState(shift?.shiftType ?? 'DAY')
  const [startTime, setStartTime] = useState(shift?.startTime?.slice(0, 5) ?? '')
  const [endTime, setEndTime] = useState(shift?.endTime?.slice(0, 5) ?? '')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave({ shiftType, startTime, endTime })
  }

  // 근무표 화면은 isolation: isolate 로 쌓임 문맥을 만들기 때문에, 그 안에서 렌더하면
  // z-index 를 아무리 올려도 하단 탭 네비게이션보다 위로 올라가지 못한다. body 로 포털한다.
  return createPortal(
    <div className="shift-edit-sheet" role="dialog" aria-modal="true" aria-labelledby="shift-edit-title">
      <button
        type="button"
        className="shift-edit-sheet__backdrop"
        onClick={onClose}
        aria-label="닫기"
      />

      <form className="shift-edit-sheet__panel" onSubmit={handleSubmit}>
        <div className="shift-edit-sheet__heading">
          <div>
            <h2 id="shift-edit-title">{formatDate(date)}</h2>
            <p>{shift ? '근무를 수정합니다.' : '근무를 새로 추가합니다.'}</p>
          </div>
          <button
            type="button"
            className="shift-edit-sheet__close"
            onClick={onClose}
            aria-label="닫기"
          >
            <IconClose size={16} />
          </button>
        </div>

        <label className="shift-edit-sheet__field">
          <span>근무 유형</span>
          <Select value={shiftType} onChange={setShiftType} options={SHIFT_OPTIONS} />
        </label>

        <div className="shift-edit-sheet__field-row">
          <label className="shift-edit-sheet__field">
            <span>시작 시각</span>
            <input
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
            />
          </label>
          <label className="shift-edit-sheet__field">
            <span>종료 시각</span>
            <input
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
            />
          </label>
        </div>

        <p className="shift-edit-sheet__hint">
          시각을 비워 두면 {shift ? '기존 시각을 그대로 둡니다.' : '근무 유형별 기본 시각으로 채워집니다.'}
        </p>

        {errorMessage && (
          <p className="shift-edit-sheet__message" role="alert">{errorMessage}</p>
        )}

        <div className="shift-edit-sheet__actions">
          <button
            type="submit"
            className="shift-edit-sheet__submit"
            disabled={isSaving}
          >
            {isSaving ? '저장 중' : '저장'}
          </button>

          {shift && (
            <button
              type="button"
              className="shift-edit-sheet__delete"
              onClick={onDelete}
              disabled={isSaving}
            >
              이 날 근무 삭제
            </button>
          )}
        </div>
      </form>
    </div>,
    document.body,
  )
}

export default ShiftEditSheet
