import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createShiftsFromPattern,
  deleteShiftPattern,
  getShiftCompleteness,
  getShiftPatterns,
} from '@/api/scheduleApi.js'
import SubPageHeader from '@/components/common/SubPageHeader.jsx'
import { IconClose, IconWarningTriangle } from '@/components/common/icons/index.jsx'
import { SHIFT_VALUES, formatShiftType, toDateString } from '@/lib/formatApiData.js'
import { PATH } from '../../routes/paths.js'
import ShiftTag from './components/ShiftTag.jsx'
import './ShiftPattern.scss'

const WEEK_OPTIONS = [4, 6, 8, 12]
const MAX_PATTERN_LENGTH = 28
const MAX_PATTERN_NAME = 50

function ShiftPattern() {
  const navigate = useNavigate()
  const [pattern, setPattern] = useState([])
  const [startDate, setStartDate] = useState(toDateString())
  const [weeks, setWeeks] = useState(4)
  const [patternName, setPatternName] = useState('')
  const [savedPatterns, setSavedPatterns] = useState([])
  const [completeness, setCompleteness] = useState(null)
  const [result, setResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const options = { signal: controller.signal }

    getShiftPatterns(options)
      .then((data) => setSavedPatterns(data.patterns ?? []))
      .catch(() => {})

    getShiftCompleteness(4, options)
      .then(setCompleteness)
      .catch(() => {})

    return () => controller.abort()
  }, [])

  const handleAppend = (shiftType) => {
    if (pattern.length >= MAX_PATTERN_LENGTH) return

    setPattern((current) => [...current, shiftType])
  }

  const handleRemoveAt = (index) => {
    setPattern((current) => current.filter((_, position) => position !== index))
  }

  const handleLoadSaved = (saved) => {
    setPattern(saved.pattern)
    setPatternName(saved.name)
  }

  const handleDeleteSaved = async (patternId) => {
    const previous = savedPatterns
    setSavedPatterns((current) => current.filter((item) => item.patternId !== patternId))

    try {
      await deleteShiftPattern(patternId)
    } catch (error) {
      setSavedPatterns(previous)
      setErrorMessage(error.message)
    }
  }

  const handleApply = async () => {
    setIsSubmitting(true)
    setErrorMessage('')
    setResult(null)

    const trimmedName = patternName.trim()

    try {
      const response = await createShiftsFromPattern({
        startDate,
        weeks,
        pattern,
        saveAsPattern: Boolean(trimmedName),
        patternName: trimmedName || undefined,
      })

      setResult(response)
      setCompleteness(response.completeness)

      // 방금 저장한 패턴이 목록에 바로 보이도록 다시 읽는다.
      if (trimmedName) {
        getShiftPatterns()
          .then((data) => setSavedPatterns(data.patterns ?? []))
          .catch(() => {})
      }
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const canApply = pattern.length > 0 && Boolean(startDate) && !isSubmitting

  return (
    <div className="shift-pattern">
      <SubPageHeader title="근무 패턴 직접 입력" />

      <div className="shift-pattern__card">
        <div className="shift-pattern__intro">
          <h2 className="shift-pattern__title">반복되는 근무 순서를 만들어 주세요</h2>
          <p className="shift-pattern__subtitle">
            사진 인식 없이도 근무표를 채울 수 있어요.
            만든 순서가 시작일부터 반복해서 적용됩니다.
          </p>
        </div>

        {completeness && completeness.remainingDays > 0 && (
          <p className="shift-pattern__alert">
            <IconWarningTriangle size={16} />
            앞으로 4주 중 {completeness.remainingDays}일이 비어 있어요.
          </p>
        )}

        <section className="shift-pattern__section">
          <h3 className="shift-pattern__section-title">패턴 순서</h3>
          {pattern.length === 0
            ? <p className="shift-pattern__empty">아래에서 근무 유형을 눌러 순서를 추가하세요.</p>
            : (
              <ol className="shift-pattern__sequence">
                {pattern.map((shiftType, index) => (
                  // 같은 근무가 반복될 수 있어 위치를 키로 쓴다.
                  <li key={`${shiftType}-${index}`}>
                    <span className="shift-pattern__day">{index + 1}일</span>
                    <ShiftTag shiftType={formatShiftType(shiftType)} />
                    <button
                      type="button"
                      className="shift-pattern__remove"
                      onClick={() => handleRemoveAt(index)}
                      aria-label={`${index + 1}일차 ${formatShiftType(shiftType)} 제거`}
                    >
                      <IconClose size={14} />
                    </button>
                  </li>
                ))}
              </ol>
            )}

          <ul className="shift-pattern__adders">
            {SHIFT_VALUES.map((shiftType) => (
              <li key={shiftType}>
                <button
                  type="button"
                  className="shift-pattern__adder"
                  onClick={() => handleAppend(shiftType)}
                  disabled={pattern.length >= MAX_PATTERN_LENGTH}
                >
                  + {formatShiftType(shiftType)}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="shift-pattern__section">
          <h3 className="shift-pattern__section-title">적용 범위</h3>
          <label className="shift-pattern__field">
            <span>시작일</span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </label>
          <label className="shift-pattern__field">
            <span>생성 기간</span>
            <select value={weeks} onChange={(event) => setWeeks(Number(event.target.value))}>
              {WEEK_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}주</option>
              ))}
            </select>
          </label>
          <label className="shift-pattern__field">
            <span>패턴 이름</span>
            <input
              type="text"
              value={patternName}
              maxLength={MAX_PATTERN_NAME}
              placeholder="비워두면 저장하지 않아요"
              onChange={(event) => setPatternName(event.target.value)}
            />
          </label>
        </section>

        {savedPatterns.length > 0 && (
          <section className="shift-pattern__section">
            <h3 className="shift-pattern__section-title">저장한 패턴</h3>
            <ul className="shift-pattern__saved">
              {savedPatterns.map((saved) => (
                <li key={saved.patternId}>
                  <button
                    type="button"
                    className="shift-pattern__saved-load"
                    onClick={() => handleLoadSaved(saved)}
                  >
                    <strong>{saved.name}</strong>
                    <span>{saved.pattern.map(formatShiftType).join(' · ')}</span>
                  </button>
                  <button
                    type="button"
                    className="shift-pattern__remove"
                    onClick={() => handleDeleteSaved(saved.patternId)}
                    aria-label={`${saved.name} 삭제`}
                  >
                    <IconClose size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {result && (
          <div className="shift-pattern__result" role="status">
            <p>
              근무 {result.createdCount}일을 새로 만들고 {result.updatedCount}일을 바꿨어요.
            </p>
            <button
              type="button"
              className="shift-pattern__link"
              onClick={() => navigate(PATH.SCHEDULE_CALENDAR)}
            >
              근무표에서 확인하기 →
            </button>
          </div>
        )}

        {errorMessage && (
          <p className="shift-pattern__error" role="alert">{errorMessage}</p>
        )}

        <button
          type="button"
          className="shift-pattern__submit"
          onClick={handleApply}
          disabled={!canApply}
        >
          {isSubmitting ? '적용하는 중…' : '근무표에 적용하기'}
        </button>
      </div>
    </div>
  )
}

export default ShiftPattern
