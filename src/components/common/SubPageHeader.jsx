import { useNavigate } from 'react-router-dom'
import { IconChevronLeft } from './icons/index.jsx'
import './SubPageHeader.scss'

/**
 * 뒤로가기 + 제목으로 구성된 하위 페이지 헤더.
 * 탭이 아닌 상세 화면(영양·낮잠·기록·근무 패턴)에서 공통으로 쓴다.
 *
 * @param {string} title
 * @param {() => void} [onBack] 생략하면 브라우저 히스토리를 한 칸 되돌린다.
 */
function SubPageHeader({ title, onBack }) {
  const navigate = useNavigate()

  return (
    <header className="sub-page-header">
      <button
        type="button"
        className="sub-page-header__back"
        onClick={onBack ?? (() => navigate(-1))}
        aria-label="이전 화면으로"
      >
        <IconChevronLeft size={22} />
      </button>
      <h1 className="sub-page-header__title">{title}</h1>
    </header>
  )
}

export default SubPageHeader
