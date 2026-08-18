import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AiAssistantBubble from '../../components/common/AiAssistantBubble.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import { PATH } from '../../routes/paths.js'
import SettingsField from './components/SettingsField.jsx'
import ToggleRow from './components/ToggleRow.jsx'
import './CoachingAlertSettings.scss'

// 00:00 ~ 23:00 정시 옵션.
const TIME_OPTIONS = Array.from({ length: 24 }, (_, hour) => {
  const label = `${String(hour).padStart(2, '0')}:00`
  return { value: label, label }
})

function CoachingAlertSettings() {
  const navigate = useNavigate()
  const [showAssistantMessage, setShowAssistantMessage] = useState(true)

  const [caffeineCutoffAlarm, setCaffeineCutoffAlarm] = useState(true)
  const [caffeineAlarmTime, setCaffeineAlarmTime] = useState('')

  const [lightReminder, setLightReminder] = useState(false)
  const [lightStart, setLightStart] = useState('')
  const [lightEnd, setLightEnd] = useState('')

  const [napAlarm, setNapAlarm] = useState(false)
  const [napStart, setNapStart] = useState('')
  const [napEnd, setNapEnd] = useState('')

  const [nightShiftGuide, setNightShiftGuide] = useState(true)

  // TODO: 실제 저장 API 연동. 지금은 설정 홈으로 돌아가는 것으로 대신한다.
  const handleSave = () => {
    navigate(PATH.SETTINGS)
  }

  return (
    <div className="coaching-alert-settings">
      <PageHeader title="코칭 알림 설정" subtitle="시간에 맞춰 알림을 받으세요!" />

      <div className="coaching-alert-settings__card">
        <section className="coaching-alert-settings__section">
          <h2 className="coaching-alert-settings__title">카페인 ☕</h2>

          <ToggleRow
            label="카페인 컷오프 알림"
            caption="권장 시간 : 16:00~ 중단"
            checked={caffeineCutoffAlarm}
            onChange={setCaffeineCutoffAlarm}
          >
            <SettingsField
              rowLabel="알림시간"
              type="select"
              value={caffeineAlarmTime}
              onChange={setCaffeineAlarmTime}
              options={TIME_OPTIONS}
            />
          </ToggleRow>

          <ToggleRow
            label="빛 노출 리마인더"
            caption="권장 시간 : 08:00~10:00"
            checked={lightReminder}
            onChange={setLightReminder}
          >
            <SettingsField
              rowLabel="시작 시간"
              type="select"
              value={lightStart}
              onChange={setLightStart}
              options={TIME_OPTIONS}
            />
            <SettingsField
              rowLabel="종료 시간"
              type="select"
              value={lightEnd}
              onChange={setLightEnd}
              options={TIME_OPTIONS}
            />
          </ToggleRow>

          <ToggleRow
            label="낮잠 알림"
            caption="권장 시간 : 14:00~15:00"
            checked={napAlarm}
            onChange={setNapAlarm}
          >
            <SettingsField
              rowLabel="시작 시간"
              type="select"
              value={napStart}
              onChange={setNapStart}
              options={TIME_OPTIONS}
            />
            <SettingsField
              rowLabel="종료 시간"
              type="select"
              value={napEnd}
              onChange={setNapEnd}
              options={TIME_OPTIONS}
            />
          </ToggleRow>
        </section>

        <section className="coaching-alert-settings__section">
          <h2 className="coaching-alert-settings__title">기타 설정</h2>
          <ToggleRow
            label="야간 근무 전환 안내"
            checked={nightShiftGuide}
            onChange={setNightShiftGuide}
          />
          <p className="coaching-alert-settings__caption">
            근무 유형 변경일에 전환 프로토콜 표시
          </p>
        </section>

        <p className="coaching-alert-settings__disclaimer">
          모든 코칭은 참고용이며 개인 건강 상태를 진단하지 않습니다.
          <br />
          시간 제안은 현재 근무 일정을 기반으로 계산됩니다.
          <br />
          알림 시간을 조정해도 기본 코칭 카드는 자동으로 표시됩니다
        </p>

        <button
          type="button"
          className="coaching-alert-settings__save"
          onClick={handleSave}
        >
          저장
        </button>
      </div>

      <AiAssistantBubble
        message="AI비서한테 물어보세요!"
        showMessage={showAssistantMessage}
        onDismissMessage={() => setShowAssistantMessage(false)}
        onOpen={() => navigate(PATH.ASSISTANT)}
      />
    </div>
  )
}

export default CoachingAlertSettings
