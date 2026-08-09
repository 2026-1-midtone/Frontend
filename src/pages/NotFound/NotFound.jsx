import { Link } from 'react-router-dom'
import { PATH } from '../../routes/paths.js'
import './NotFound.scss'

function NotFound() {
  return (
    <div className="not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">페이지를 찾을 수 없습니다</h1>
      <p className="not-found__description">
        주소가 변경되었거나 삭제된 페이지일 수 있습니다.
      </p>
      <Link to={PATH.ONBOARDING} className="not-found__link">
        처음으로 돌아가기
      </Link>
    </div>
  )
}

export default NotFound
