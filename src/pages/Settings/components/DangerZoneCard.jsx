import { IconWarningTriangle } from '../../../components/common/icons/index.jsx'
import './DangerZoneCard.scss'

/**
 * 삭제될 항목을 안내하고 실행 버튼을 제공하는 위험 영역 카드.
 * @param {string[]} items 삭제될 데이터 항목 목록
 * @param {() => void} onDelete
 */
function DangerZoneCard({ items, onDelete }) {
  return (
    <div className="danger-zone">
      <p className="danger-zone__warning">
        <IconWarningTriangle size={16} />
        주의: 다음 데이터를 삭제하면 복구할 수 없습니다.
      </p>

      <p className="danger-zone__list-title">삭제될 항목:</p>
      <ul className="danger-zone__list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <button type="button" className="danger-zone__button" onClick={onDelete}>
        모든 데이터 삭제
      </button>
    </div>
  )
}

export default DangerZoneCard
