import AssistantMascot from '@/components/common/AssistantMascot.jsx'

function PersonalizationGuideModal({ onClose }) {
  return (
    <div className="personalization-guide">
      <section
        className="personalization-guide__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="personalization-guide-title"
      >
        <AssistantMascot className="personalization-guide__mascot" />
        <h2 id="personalization-guide-title">개인 설정 필요</h2>
        <p className="personalization-guide__body">
          시프트메이트가 근로자님을 돕기위해
          <br />
          좀더 알아가고 싶은 정보가 있어요
        </p>
        <p className="personalization-guide__note">
          약물 복용·질환 진단·응급 증상 관련 질문은
          <br />
          답변을 드리지 않습니다.
          <br />
          의료 전문가 또는 긴급 서비스에 문의해 주세요.
        </p>
        <button type="button" onClick={onClose}>알겠습니다</button>
      </section>
      <p className="personalization-guide__disclaimer">※ 참고용 정보입니다.</p>
    </div>
  )
}

export default PersonalizationGuideModal
