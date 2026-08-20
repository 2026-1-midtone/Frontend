import { useState } from 'react'
import {
  createCaffeineIntake,
  createSleepLog,
} from '@/api/healthRecordApi.js'
import { toLocalDateTimeInput, toOffsetDateTime } from '@/lib/formatApiData.js'
import './HealthRecordPanel.scss'

const CAFFEINE_OPTIONS = [
  { label: '커피', value: 'COFFEE', amountMg: 100 },
  { label: '에너지 음료', value: 'ENERGY_DRINK', amountMg: 80 },
  { label: '차', value: 'TEA', amountMg: 40 },
  { label: '기타', value: 'OTHER', amountMg: 50 },
]

function getInitialSleepTimes() {
  const wokeAt = new Date()
  const sleptAt = new Date(wokeAt.getTime() - 8 * 60 * 60 * 1000)

  return {
    sleptAt: toLocalDateTimeInput(sleptAt),
    wokeAt: toLocalDateTimeInput(wokeAt),
  }
}

function HealthRecordPanel() {
  const initialSleepTimes = getInitialSleepTimes()
  const [recordType, setRecordType] = useState(null)
  const [consumedAt, setConsumedAt] = useState(() => toLocalDateTimeInput(new Date()))
  const [amountMg, setAmountMg] = useState('100')
  const [servings, setServings] = useState('1')
  const [beverageType, setBeverageType] = useState('COFFEE')
  const [sleptAt, setSleptAt] = useState(initialSleepTimes.sleptAt)
  const [wokeAt, setWokeAt] = useState(initialSleepTimes.wokeAt)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const selectRecordType = (nextType) => {
    setRecordType((current) => current === nextType ? null : nextType)
    setMessage('')
    setIsError(false)
  }

  const handleBeverageChange = (event) => {
    const selectedValue = event.target.value
    const selectedOption = CAFFEINE_OPTIONS.find(({ value }) => value === selectedValue)

    setBeverageType(selectedValue)
    if (selectedOption) setAmountMg(String(selectedOption.amountMg))
  }

  const handleCaffeineSubmit = async (event) => {
    event.preventDefault()
    const parsedAmount = Number(amountMg)
    const parsedServings = Number(servings)

    if (!consumedAt || !Number.isInteger(parsedAmount) || parsedAmount < 1) {
      setMessage('섭취 시각과 1mg 이상의 카페인 양을 입력해 주세요.')
      setIsError(true)
      return
    }

    if (!Number.isFinite(parsedServings) || parsedServings <= 0) {
      setMessage('섭취 잔 수는 0보다 크게 입력해 주세요.')
      setIsError(true)
      return
    }

    setIsSaving(true)
    setMessage('')
    setIsError(false)

    try {
      await createCaffeineIntake({
        consumedAt: toOffsetDateTime(consumedAt),
        amountMg: parsedAmount,
        servings: parsedServings,
        beverageType,
      })
      setMessage('카페인 섭취를 기록했어요. 질문을 다시 보내면 답변에 반영됩니다.')
      setRecordType(null)
    } catch (error) {
      setMessage(error.message ?? '카페인 기록을 저장하지 못했습니다.')
      setIsError(true)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSleepSubmit = async (event) => {
    event.preventDefault()
    const sleptDate = new Date(sleptAt)
    const wokeDate = new Date(wokeAt)

    if (!sleptAt || !wokeAt || wokeDate <= sleptDate) {
      setMessage('기상 시각은 취침 시각보다 늦게 입력해 주세요.')
      setIsError(true)
      return
    }

    setIsSaving(true)
    setMessage('')
    setIsError(false)

    try {
      await createSleepLog({
        sleptAt: toOffsetDateTime(sleptAt),
        wokeAt: toOffsetDateTime(wokeAt),
        source: 'MANUAL',
      })
      setMessage('수면 시간을 기록했어요. 질문을 다시 보내면 답변에 반영됩니다.')
      setRecordType(null)
    } catch (error) {
      setMessage(error.message ?? '수면 기록을 저장하지 못했습니다.')
      setIsError(true)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="health-record-panel" aria-labelledby="health-record-title">
      <div className="health-record-panel__heading">
        <div>
          <h2 id="health-record-title">오늘 기록 입력</h2>
          <p>기록할수록 AI 답변이 더 정확해져요.</p>
        </div>
        <span aria-hidden="true">✦</span>
      </div>

      <div className="health-record-panel__tabs">
        <button
          type="button"
          className={`health-record-panel__tab${recordType === 'caffeine' ? ' health-record-panel__tab--active' : ''}`}
          onClick={() => selectRecordType('caffeine')}
          aria-expanded={recordType === 'caffeine'}
        >
          ☕ 카페인
        </button>
        <button
          type="button"
          className={`health-record-panel__tab${recordType === 'sleep' ? ' health-record-panel__tab--active' : ''}`}
          onClick={() => selectRecordType('sleep')}
          aria-expanded={recordType === 'sleep'}
        >
          ☾ 수면
        </button>
      </div>

      {recordType === 'caffeine' && (
        <form className="health-record-panel__form" onSubmit={handleCaffeineSubmit}>
          <label>
            <span>종류</span>
            <select value={beverageType} onChange={handleBeverageChange}>
              {CAFFEINE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label>
            <span>섭취 시각</span>
            <input
              type="datetime-local"
              value={consumedAt}
              onChange={(event) => setConsumedAt(event.target.value)}
              required
            />
          </label>
          <div className="health-record-panel__field-row">
            <label>
              <span>카페인 양 (mg)</span>
              <input
                type="number"
                min="1"
                step="1"
                value={amountMg}
                onChange={(event) => setAmountMg(event.target.value)}
                required
              />
            </label>
            <label>
              <span>섭취량 (잔)</span>
              <input
                type="number"
                min="0.01"
                max="99.99"
                step="0.01"
                value={servings}
                onChange={(event) => setServings(event.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit" disabled={isSaving}>
            {isSaving ? '저장 중' : '카페인 기록 저장'}
          </button>
        </form>
      )}

      {recordType === 'sleep' && (
        <form className="health-record-panel__form" onSubmit={handleSleepSubmit}>
          <label>
            <span>취침 시각</span>
            <input
              type="datetime-local"
              value={sleptAt}
              onChange={(event) => setSleptAt(event.target.value)}
              required
            />
          </label>
          <label>
            <span>기상 시각</span>
            <input
              type="datetime-local"
              value={wokeAt}
              onChange={(event) => setWokeAt(event.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={isSaving}>
            {isSaving ? '저장 중' : '수면 기록 저장'}
          </button>
        </form>
      )}

      {message && (
        <p
          className={`health-record-panel__message${isError ? ' health-record-panel__message--error' : ''}`}
          role={isError ? 'alert' : 'status'}
        >
          {message}
        </p>
      )}
    </section>
  )
}

export default HealthRecordPanel
