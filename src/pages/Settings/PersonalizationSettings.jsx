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

// 카페인 민감도와 수면 기록은 홈 화면의 '오늘 기록 입력' 카드로 합쳤다.
// 같은 정보를 두 화면에서 받지 않도록 이 화면에서는 제거한다.

function PersonalizationSettings() {
  const navigate = useNavigate()

  const [caffeineIntake, setCaffeineIntake] = useState('')
  // 이 화면에서 더 이상 다루지 않는 설정값을 저장할 때 지우지 않으려고 원본을 들고 있는다.
  const [loadedSettings, setLoadedSettings] = useState(null)
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
        setLoadedSettings(data)
        setCaffeineIntake(String(data.caffeineDailyMg ?? ''))
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
          // 홈 화면 기록 카드에서 저장한 민감도를 덮어쓰지 않도록 원본 값을 그대로 넘긴다.
          caffeineSensitivity: loadedSettings?.caffeineSensitivity ?? undefined,
          preferredNapMinutes: loadedSettings?.preferredNapMinutes ?? undefined,
          maxNapsPerDay: loadedSettings?.maxNapsPerDay ?? undefined,
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
            caption="카페인 민감도와 수면 시간은 홈 화면의 '오늘 기록 입력'에서 관리합니다."
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
