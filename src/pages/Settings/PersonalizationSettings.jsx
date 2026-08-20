import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getNotificationSettings,
  saveNotificationSettings,
} from '@/api/settingsApi.js'
import PageHeader from '../../components/common/PageHeader.jsx'
import { PATH } from '../../routes/paths.js'
import ToggleRow from './components/ToggleRow.jsx'
import './PersonalizationSettings.scss'

// 카페인 관련 입력은 홈 화면의 '오늘 기록 입력' 카드로 합쳤다.
// - 카페인 민감도, 수면 시각: 기록 카드에서 입력받는다.
// - 일일 카페인 섭취량: 백엔드 로직에서 사용하지 않아 입력 자체를 없앴다.
// 그 결과 이 화면은 알림 설정만 다루므로 개인화 설정 API 는 호출하지 않는다.

function PersonalizationSettings() {
  const navigate = useNavigate()

  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [alerts, setAlerts] = useState({
    napAlarm: true,
    caffeineCutoffAlarm: false,
    lightExposureReminder: false,
  })

  useEffect(() => {
    const controller = new AbortController()

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
