import { useEffect, useState } from 'react'
import {
  createCaffeineIntake,
  createSleepLog,
} from '@/api/healthRecordApi.js'
import {
  getPersonalizationSettings,
  savePersonalizationSettings,
} from '@/api/settingsApi.js'
import Select from '@/components/common/Select.jsx'
import { IconClose } from '@/components/common/icons/index.jsx'
import { toLocalDateTimeInput, toOffsetDateTime } from '@/lib/formatApiData.js'
import './HealthRecordPanel.scss'

// 음료 종류(커피·에너지 음료 등)는 백엔드 로직에서 쓰지 않아 입력에서 제거했다.
// 대신 개인화 설정에만 있던 카페인 민감도를 이 카드로 합쳐, 카페인 관련 입력을 한곳에서 받는다.
const SENSITIVITY_OPTIONS = [
  { value: 'LOW', label: '낮음' },
  { value: 'MEDIUM', label: '보통' },
  { value: 'HIGH', label: '높음' },
]

// 종류 입력을 없앤 뒤에도 기존 API 스펙(beverageType)을 만족시키기 위한 고정값.
const DEFAULT_BEVERAGE_TYPE = 'OTHER'

function getInitialSleepTimes() {
  const wokeAt = new Date()
  const sleptAt = new Date(wokeAt.getTime() - 8 * 60 * 60 * 1000)

  return {
    sleptAt: toLocalDateTimeInput(sleptAt),
    wokeAt: toLocalDateTimeInput(wokeAt),
  }
}

/**
 * 카페인·수면 기록 입력 패널.
 *
 * @param {object} props
 * @param {() => void} [props.onClose] 넘기면 헤더에 닫기 버튼이 노출된다.
 */
function HealthRecordPanel({ onClose }) {
  const initialSleepTimes = getInitialSleepTimes()
  const [recordType, setRecordType] = useState(null)
  const [consumedAt, setConsumedAt] = useState(() => toLocalDateTimeInput(new Date()))
  const [amountMg, setAmountMg] = useState('100')
  const [servings, setServings] = useState('1')
  const [sensitivity, setSensitivity] = useState('')
  // 민감도만 PUT 하면 나머지 설정이 지워질 수 있어, 저장할 때 합칠 원본 설정을 들고 있는다.
  const [loadedSettings, setLoadedSettings] = useState(null)
  const [sleptAt, setSleptAt] = useState(initialSleepTimes.sleptAt)
  const [wokeAt, setWokeAt] = useState(initialSleepTimes.wokeAt)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    getPersonalizationSettings({ signal: controller.signal })
      .then((data) => {
        setLoadedSettings(data)
        setSensitivity(data.caffeineSensitivity ?? '')
      })
      .catch(() => {})

    return () => controller.abort()
  }, [])

  const selectRecordType = (nextType) => {
    setRecordType((current) => current === nextType ? null : nextType)
    setMessage('')
    setIsError(false)
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
        beverageType: DEFAULT_BEVERAGE_TYPE,
      })
    } catch (error) {
      setMessage(error.message ?? '카페인 기록을 저장하지 못했습니다.')
      setIsError(true)
      setIsSaving(false)
      return
    }

    // 민감도는 기록이 아니라 개인화 설정이라 별도 API로 저장한다.
    // 값이 바뀌지 않았으면 불필요한 요청을 보내지 않는다.
    if (sensitivity && sensitivity !== loadedSettings?.caffeineSensitivity) {
      try {
        await savePersonalizationSettings({
          caffeineDailyMg: loadedSettings?.caffeineDailyMg ?? undefined,
          caffeineSensitivity: sensitivity,
          preferredNapMinutes: loadedSettings?.preferredNapMinutes ?? undefined,
          maxNapsPerDay: loadedSettings?.maxNapsPerDay ?? undefined,
        })
        setLoadedSettings((prev) => ({ ...prev, caffeineSensitivity: sensitivity }))
      } catch (error) {
        setMessage(
          `카페인 섭취는 기록했지만 민감도를 저장하지 못했습니다. ${error.message ?? ''}`.trim(),
        )
        setIsError(true)
        setIsSaving(false)
        return
      }
    }

    setMessage('카페인 섭취를 기록했어요. 질문을 다시 보내면 답변에 반영됩니다.')
    setRecordType(null)
    setIsSaving(false)
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
    <section
      id="assistant-health-record"
      className="health-record-panel"
      aria-labelledby="health-record-title"
    >
      <div className="health-record-panel__heading">
        <div>
          <h2 id="health-record-title">오늘 기록 입력</h2>
          <p>기록할수록 AI 답변이 더 정확해져요.</p>
        </div>
        {onClose
          ? (
            <button
              type="button"
              className="health-record-panel__close"
              onClick={onClose}
              aria-label="기록 입력 닫기"
            >
              <IconClose size={16} />
            </button>
          )
          : <span aria-hidden="true">✦</span>}
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
            <span>카페인 민감도</span>
            <Select
              value={sensitivity}
              onChange={setSensitivity}
              options={SENSITIVITY_OPTIONS}
              placeholder="민감도 수준"
            />
          </label>
          <p className="health-record-panel__hint">
            민감도가 높을수록 더 일찍 카페인 섭취를 중단합니다.
          </p>
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
