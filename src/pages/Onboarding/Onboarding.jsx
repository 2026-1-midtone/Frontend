import characterImage from '../../assets/character.svg'
import sparkleIcon from '../../assets/sparkle.svg'
import './Onboarding.scss'

function Onboarding() {
  const handleGoogleLogin = () => {
    // TODO: 구글 OAuth 연동 (별도 이슈에서 처리)
  }

  return (
    <div className="onboarding">
      <div className="onboarding__brand">
        <img
          className="onboarding__character"
          src={characterImage}
          alt=""
          width={240}
          height={200}
        />

        <p className="onboarding__tagline">뒤바뀐 근무시간에도, 나만의 루틴을</p>

        <h1 className="onboarding__title">
          <span className="onboarding__title-text">시프트메이트</span>
          <img
            className="onboarding__sparkle"
            src={sparkleIcon}
            alt=""
            width={28}
            height={28}
          />
        </h1>
      </div>

      <div className="onboarding__actions">
        <button
          type="button"
          className="onboarding__login"
          onClick={handleGoogleLogin}
        >
          구글 로그인으로 시작하기
        </button>
      </div>
    </div>
  )
}

export default Onboarding
