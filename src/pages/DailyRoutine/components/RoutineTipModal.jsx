import routineTipMascot from '@/assets/daily-routine/routine-tip-mascot.png'

const tipContent = {
  light: {
    title: '햇빛 노출 실행 TIP',
    body: (
      <>
        기상 직후 30분 이내에 밝은 자연광을
        <br />
        10~15분 쬐면 <strong>체내 시계 조정</strong>에
        <br />
        도움이 됩니다.
      </>
    ),
    note: (
      <>
        흐린 날에는 실내 밝은 조명 앞에
        <br />
        앉는 것도 효과가 있을 수 있습니다.
      </>
    ),
  },
  caffeine: {
    title: '카페인 마감 실행 TIP',
    body: (
      <>
        야간 근무 전날 오후 2시 이후 카페인
        <br />
        섭취를 줄이면 <strong>수면 진입</strong>에
        <br />
        도움이 될 수 있습니다.
      </>
    ),
    note: (
      <>
        디카페인 음료나 허브차를
        <br />
        대안으로 활용해 보세요.
      </>
    ),
  },
  nap: {
    title: '낮잠 실행 TIP',
    body: (
      <>
        20분 이내의 짧은 낮잠은 오후 피로
        <br />
        회복에 도움이 될 수 있습니다.
        <br />
        너무 길면 오히려 야간 수면에
        <br />
        영향을 줄 수 있습니다.
      </>
    ),
    note: (
      <>
        · 흐린 날에는 실내 밝은 조명 앞에
        <br />
        앉는 것도 효과가 있을 수 있습니다.
      </>
    ),
  },
}

function RoutineTipModal({ tip, onClose }) {
  const content = tipContent[tip]

  if (!content) return null

  return (
    <div className="routine-tip">
      <section
        className={`routine-tip__dialog routine-tip__dialog--${tip}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="routine-tip-title"
      >
        <img
          className="routine-tip__character"
          src={routineTipMascot}
          alt=""
          aria-hidden="true"
        />
        <h2 id="routine-tip-title">{content.title}</h2>
        <p className="routine-tip__body">{content.body}</p>
        <p className="routine-tip__note">{content.note}</p>
        <button type="button" onClick={onClose}>알겠습니다</button>
      </section>
      <p className="routine-tip__disclaimer">※ 참고용 정보입니다.</p>
    </div>
  )
}

export default RoutineTipModal
