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

// 카페인 관련 입력은 홈 화면의 '오늘 기록 입력' 카드로 합쳤다.
// - 카페인 민감도, 수면 시각: 기록 카드에서 입력받는다.
// - 일일 카페인 섭취량: 백엔드 로직에서 사용하지 않아 입력 자체를 없앴다.
// 낮잠 선호도는 기록이 아니라 코칭 추천 조건이라 이 화면에 남는다.

const NAP_MINUTES_OPTIONS = [10, 20, 30, 45, 60].map((minutes) => ({
  value: String(minutes),
  label: `${minutes}분`,
}))

const MAX_NAPS_OPTIONS = [1, 2, 3].map((count) => ({
  value: String(count),
  label: `${count}회`,
}))

// 백엔드에서 필수(@NotNull)라 설정을 못 불러왔을 때도 반드시 채워 보낸다.
const DEFAULT_PREFERRED_NAP_MINUTES = 20
const DEFAULT_MAX_NAPS_PER_DAY = 2

function PersonalizationSettings() {
  const navigate = useNavigate()

  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // 설정을 받아오기 전에는 모두 꺼진 상태로 둔다. 켜져 있는 것처럼 보이면 안 된다.
  const [alerts, setAlerts] = useState({
    napAlarm: false,
    caffeineCutoffAlarm: false,
    lightExposureReminder: false,
  })

  // 카페인 민감도 등 이 화면에서 편집하지 않는 값은 PUT 으로 덮어쓰지 않도록 보관한다.
  const [loadedSettings, setLoadedSettings] = useState(null)
  const [preferredNapMinutes, setPreferredNapMinutes] = useState('')
  const [maxNapsPerDay, setMaxNapsPerDay] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    getPersonalizationSettings({ signal: controller.signal })
      .then((data) => {
        setLoadedSettings(data)
        setPreferredNapMinutes(String(data.preferredNapMinutes ?? DEFAULT_PREFERRED_NAP_MINUTES))
        setMaxNapsPerDay(String(data.maxNapsPerDay ?? DEFAULT_MAX_NAPS_PER_DAY))
      })
      .catch(() => {})

    getNotificationSettings({ signal: controller.signal })
      .then((data) => {
        const byType = Object.fromEntries(
          data.settings.map((item) => [item.type, item.enabled]),
        )
        setAlerts({
          napAlarm: Boolean(byType.NAP),
          caffeineCutoffAlarm: Boolean(byType.CAFFEINE_CUTOFF),
          lightExposureReminder: Boolean(byType.LIGHT_EXPOSURE),
        })
      })
      .catch(() => {})

    return () => controller.abort()
  }, [])

  const handleToggleAlert = (key) => (checked) => {
    setAlerts((prev) => ({ ...prev, [key]: checked }))
  }

  const handleSave = async () => {
    setErrorMessage('')
    setIsSaving(true)

    try {
      await savePersonalizationSettings({
        caffeineDailyMg: loadedSettings?.caffeineDailyMg ?? undefined,
        caffeineSensitivity: loadedSettings?.caffeineSensitivity ?? undefined,
        preferredNapMinutes: Number(preferredNapMinutes) || DEFAULT_PREFERRED_NAP_MINUTES,
        maxNapsPerDay: Number(maxNapsPerDay) || DEFAULT_MAX_NAPS_PER_DAY,
      })
      await saveNotificationSettings([
        { type: 'NAP', enabled: alerts.napAlarm, customTime: null },
        { type: 'CAFFEINE_CUTOFF', enabled: alerts.caffeineCutoffAlarm, customTime: null },
        { type: 'LIGHT_EXPOSURE', enabled: alerts.lightExposureReminder, customTime: null },
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

        <section className="personalization-settings__section">
          <h2 className="personalization-settings__title">낮잠 선호도 😪</h2>
          <div className="personalization-settings__field-list">
            <SettingsField
              rowLabel="선호 낮잠 길이"
              fieldLabel="길이 선택"
              type="select"
              value={preferredNapMinutes}
              onChange={setPreferredNapMinutes}
              options={NAP_MINUTES_OPTIONS}
              caption="설정한 길이보다 긴 낮잠은 앱이 추천하지 않습니다."
            />
            <SettingsField
              rowLabel="하루 최대 낮잠 횟수"
              fieldLabel="최대 횟수"
              type="select"
              value={maxNapsPerDay}
              onChange={setMaxNapsPerDay}
              options={MAX_NAPS_OPTIONS}
              caption="설정한 횟수를 초과하는 낮잠은 앱이 추천하지 않습니다."
            />
          </div>
        </section>

        <section className="personalization-settings__section">
          <h2 className="personalization-settings__title">카페인 · 수면 기록 ☕</h2>
          <p className="personalization-settings__caption">
            카페인 민감도와 수면 시각은 홈 화면의 &lsquo;오늘 기록 입력&rsquo; 카드에서 관리합니다.
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
