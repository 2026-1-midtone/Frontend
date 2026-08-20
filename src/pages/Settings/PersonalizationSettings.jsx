import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSleepLog } from '@/api/healthRecordApi.js'
import {
  getNotificationSettings,
  getPersonalizationSettings,
  saveNotificationSettings,
  savePersonalizationSettings,
} from '@/api/settingsApi.js'
import { toLocalDateTimeInput, toOffsetDateTime } from '@/lib/formatApiData.js'
import PageHeader from '../../components/common/PageHeader.jsx'
import { PATH } from '../../routes/paths.js'
import SettingsField from './components/SettingsField.jsx'
import ToggleRow from './components/ToggleRow.jsx'
import './PersonalizationSettings.scss'

// 실제 옵션 값은 정책이 확정되면 교체한다.
const SENSITIVITY_OPTIONS = [
  { value: 'LOW', label: '낮음' },
  { value: 'MEDIUM', label: '보통' },
  { value: 'HIGH', label: '높음' },
]

function getInitialSleepTimes() {
  const wokeAt = new Date()
  const sleptAt = new Date(wokeAt.getTime() - 8 * 60 * 60 * 1000)

  return {
    sleptAt: toLocalDateTimeInput(sleptAt),
    wokeAt: toLocalDateTimeInput(wokeAt),
  }
}

function PersonalizationSettings() {
  const navigate = useNavigate()

  const [caffeineIntake, setCaffeineIntake] = useState('')
  const [sensitivity, setSensitivity] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const initialSleepTimes = getInitialSleepTimes()
  const [sleptAt, setSleptAt] = useState(initialSleepTimes.sleptAt)
  const [wokeAt, setWokeAt] = useState(initialSleepTimes.wokeAt)
  const [isSleepSaving, setIsSleepSaving] = useState(false)
  const [sleepMessage, setSleepMessage] = useState('')
  const [isSleepError, setIsSleepError] = useState(false)

  const [alerts, setAlerts] = useState({
    napAlarm: true,
    caffeineCutoffAlarm: false,
    lightExposureReminder: false,
  })

  useEffect(() => {
    const controller = new AbortController()
    const options = { signal: controller.signal }

    Promise.allSettled([
      getPersonalizationSettings(options),
      getNotificationSettings(options),
    ]).then(([settingsResult, notificationResult]) => {
      if (settingsResult.status === 'fulfilled') {
        const data = settingsResult.value
        setCaffeineIntake(String(data.caffeineDailyMg ?? ''))
        setSensitivity(data.caffeineSensitivity ?? '')
      }

      if (notificationResult.status === 'fulfilled') {
        const byType = Object.fromEntries(
          notificationResult.value.settings.map((item) => [item.type, item.enabled]),
        )
        setAlerts({
          napAlarm: Boolean(byType.NAP),
          caffeineCutoffAlarm: Boolean(byType.CAFFEINE_CUTOFF),
          lightExposureReminder: Boolean(byType.LIGHT_EXPOSURE),
        })
      }
    })

    return () => controller.abort()
  }, [])

  const handleToggleAlert = (key) => (checked) => {
    setAlerts((prev) => ({ ...prev, [key]: checked }))
  }

  const handleSave = async () => {
    setErrorMessage('')

    const caffeineDailyMg = caffeineIntake === '' ? undefined : Number(caffeineIntake)
    if (
      caffeineDailyMg !== undefined
      && (!Number.isInteger(caffeineDailyMg) || caffeineDailyMg < 0)
    ) {
      setErrorMessage('일일 카페인 섭취량은 0 이상의 정수로 입력해 주세요.')
      return
    }

    setIsSaving(true)

    try {
      await Promise.all([
        savePersonalizationSettings({
          caffeineDailyMg,
          caffeineSensitivity: sensitivity || undefined,
        }),
        saveNotificationSettings([
          { type: 'NAP', enabled: alerts.napAlarm, customTime: null },
          { type: 'CAFFEINE_CUTOFF', enabled: alerts.caffeineCutoffAlarm, customTime: null },
          { type: 'LIGHT_EXPOSURE', enabled: alerts.lightExposureReminder, customTime: null },
        ]),
      ])
      navigate(PATH.SETTINGS)
    } catch (error) {
      setErrorMessage(error.message)
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    navigate(PATH.SETTINGS)
  }

  const handleSleepSubmit = async (event) => {
    event.preventDefault()
    const sleptDate = new Date(sleptAt)
    const wokeDate = new Date(wokeAt)

    if (!sleptAt || !wokeAt || wokeDate <= sleptDate) {
      setSleepMessage('기상 시각은 취침 시각보다 늦게 입력해 주세요.')
      setIsSleepError(true)
      return
    }

    setIsSleepSaving(true)
    setSleepMessage('')
    setIsSleepError(false)

    try {
      await createSleepLog({
        sleptAt: toOffsetDateTime(sleptAt),
        wokeAt: toOffsetDateTime(wokeAt),
        source: 'MANUAL',
      })
      setSleepMessage('수면 시간을 기록했어요.')
    } catch (error) {
      setSleepMessage(error.message ?? '수면 기록을 저장하지 못했습니다.')
      setIsSleepError(true)
    } finally {
      setIsSleepSaving(false)
    }
  }

  return (
    <div className="personalization-settings">
      <PageHeader title="개인화 설정" subtitle="오늘 하루는 어떤 하루였나요?" />

      <div className="personalization-settings__card">
        <section className="personalization-settings__section">
          <h2 className="personalization-settings__title">카페인 습관 ☕</h2>

          <SettingsField
            rowLabel="일일 카페인 섭취량"
            fieldLabel="섭취량 ( mg )"
            type="number"
            value={caffeineIntake}
            onChange={setCaffeineIntake}
            placeholder="권장 입력 예시 200~400"
          />

          <SettingsField
            rowLabel="카페인 민감도"
            fieldLabel="민감도 수준"
            type="select"
            value={sensitivity}
            onChange={setSensitivity}
            options={SENSITIVITY_OPTIONS}
            caption="민감도가 높을수록 더 일찍 카페인 섭취를 중단합니다."
          />
        </section>

        <section className="personalization-settings__section">
          <h2 className="personalization-settings__title">수면 기록 🌙</h2>

          <form className="personalization-settings__sleep-form" onSubmit={handleSleepSubmit}>
            <SettingsField
              rowLabel="취침 시각"
              type="datetime-local"
              value={sleptAt}
              onChange={setSleptAt}
            />

            <SettingsField
              rowLabel="기상 시각"
              type="datetime-local"
              value={wokeAt}
              onChange={setWokeAt}
              caption="몇 시부터 몇 시까지 잤는지 기록하면 코칭에 반영됩니다."
            />

            {sleepMessage && (
              <p
                className={`personalization-settings__sleep-message${isSleepError ? ' is-error' : ''}`}
                role={isSleepError ? 'alert' : 'status'}
              >
                {sleepMessage}
              </p>
            )}

            <button
              type="submit"
              className="personalization-settings__sleep-submit"
              disabled={isSleepSaving}
            >
              {isSleepSaving ? '기록 저장 중' : '수면 기록 저장'}
            </button>
          </form>
        </section>

        <section className="personalization-settings__section">
          <h2 className="personalization-settings__title">알림 설정</h2>
          <div className="personalization-settings__toggle-list">
            <ToggleRow
              label="낮잠 알림"
              checked={alerts.napAlarm}
              onChange={handleToggleAlert('napAlarm')}
            />
            <ToggleRow
              label="카페인 컷오프 알림"
              checked={alerts.caffeineCutoffAlarm}
              onChange={handleToggleAlert('caffeineCutoffAlarm')}
            />
            <ToggleRow
              label="빛 노출 리마인더"
              checked={alerts.lightExposureReminder}
              onChange={handleToggleAlert('lightExposureReminder')}
            />
          </div>
          <p className="personalization-settings__caption">
            알림 시간대는 오늘 근무 일정에 맞춰 자동으로 설정됩니다
          </p>
        </section>

        <div className="personalization-settings__actions">
          {errorMessage && <p className="personalization-settings__error" role="alert">{errorMessage}</p>}
          <button
            type="button"
            className="personalization-settings__action"
            onClick={handleCancel}
          >
            취소
          </button>
          <button
            type="button"
            className="personalization-settings__action personalization-settings__action--primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? '저장 중' : '저장'}
          </button>
        </div>
      </div>

    </div>
  )
}

export default PersonalizationSettings
