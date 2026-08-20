import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getNotificationSettings,
  getPersonalizationSettings,
  saveNotificationSettings,
  savePersonalizationSettings,
} from '@/api/settingsApi.js'
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
const NAP_LENGTH_OPTIONS = [
  { value: '10', label: '10분' },
  { value: '15', label: '15분' },
  { value: '20', label: '20분' },
  { value: '30', label: '30분' },
]
const NAP_COUNT_OPTIONS = [
  { value: '1', label: '1회' },
  { value: '2', label: '2회' },
  { value: '3', label: '3회' },
]

function PersonalizationSettings() {
  const navigate = useNavigate()

  const [caffeineIntake, setCaffeineIntake] = useState('')
  const [sensitivity, setSensitivity] = useState('')
  const [napLength, setNapLength] = useState('')
  const [napCount, setNapCount] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

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
        setNapLength(String(data.preferredNapMinutes ?? ''))
        setNapCount(String(data.maxNapsPerDay ?? ''))
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
          preferredNapMinutes: Number(napLength),
          maxNapsPerDay: Number(napCount),
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
          <h2 className="personalization-settings__title">낮잠 선호도 😴</h2>

          <SettingsField
            rowLabel="선호 낮잠 길이"
            fieldLabel="길이 선택"
            type="select"
            value={napLength}
            onChange={setNapLength}
            options={NAP_LENGTH_OPTIONS}
            caption="설정한 길이 이외의 낮잠은 앱이 추천하지 않습니다."
          />

          <SettingsField
            rowLabel="하루 최대 낮잠 횟수"
            fieldLabel="최대 횟수"
            type="select"
            value={napCount}
            onChange={setNapCount}
            options={NAP_COUNT_OPTIONS}
            caption="설정한 횟수를 초과하는 낮잠은 앱이 추천하지 않습니다."
          />
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
            disabled={isSaving || !napLength || !napCount}
          >
            {isSaving ? '저장 중' : '저장'}
          </button>
        </div>
      </div>

    </div>
  )
}

export default PersonalizationSettings
