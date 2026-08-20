import { useNavigate } from 'react-router-dom'
import AssistantMascot from '@/components/common/AssistantMascot'
import { markAssistantIntroSeen } from '../../lib/assistantIntro.js'
import { PATH } from '../../routes/paths.js'
import './AssistantIntro.scss'

function AssistantIntro() {
  const navigate = useNavigate()

  const handleStart = () => {
    markAssistantIntroSeen()
    navigate(PATH.ASSISTANT, { replace: true })
  }

  return (
    <div className="assistant-intro">
      <div className="assistant-intro__brand">
        <AssistantMascot className="assistant-intro__character" variant="onboarding" />

        <p className="assistant-intro__lead">
          교대근무에 대해 궁금한 걸 물어보세요
          <br />
          근무 일정과 오늘의 코칭을 바탕으로
          <br />
          맞춤 답변을 드려요!
        </p>
      </div>

      <div className="assistant-intro__actions">
        <p className="assistant-intro__disclaimer">
          AI 도우미의 답변은 일반적인 참고 정보이며 의료 전문가의 진단·처방을
          대체하지 않습니다.
          <br />
          영양 정보와 레시피는 효능을 단정하지 않는 참고용 자료입니다.
          <br />
          심각한 증상이나 응급 상황 발생 시 즉시 의료 전문가의 도움을 받으세요.
        </p>

        <button
          type="button"
          className="assistant-intro__start"
          onClick={handleStart}
        >
          AI 비서 시작하기
        </button>
      </div>
    </div>
  )
}

export default AssistantIntro
