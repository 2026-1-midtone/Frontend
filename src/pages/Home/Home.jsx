import './Home.scss'

const FEATURES = [
  {
    title: '근무표 자동 생성',
    description: '팀원의 근무 가능 시간을 모아 한 번에 근무표를 만듭니다.',
  },
  {
    title: '교대 요청 관리',
    description: '교대 요청과 승인 과정을 한 화면에서 처리합니다.',
  },
  {
    title: '알림과 공유',
    description: '변경 사항을 팀원에게 즉시 알리고 일정을 공유합니다.',
  },
]

function Home() {
  return (
    <div className="home">
      <section className="home__hero">
        <p className="home__eyebrow">근무표 관리 서비스</p>
        <h1 className="home__title">
          팀의 근무 일정,
          <br />
          시프트메이트에서 한 번에
        </h1>
        <p className="home__description">
          흩어진 근무표와 교대 요청을 하나로 모아 관리하세요.
        </p>
        <button type="button" className="home__cta">
          시작하기
        </button>
      </section>

      <section className="home__features">
        <h2 className="home__features-title">주요 기능</h2>
        <ul className="home__feature-list">
          {FEATURES.map(({ title, description }) => (
            <li key={title} className="home__feature-card">
              <h3 className="home__feature-title">{title}</h3>
              <p className="home__feature-description">{description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Home
