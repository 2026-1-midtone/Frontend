import { createPortal } from 'react-dom'
import AssistantMascot from '@/components/common/AssistantMascot.jsx'
import './DeleteAllDataModal.scss'

/**
 * 계정·데이터 전체 삭제 최종 확인 모달.
 *
 * 설정 화면 루트가 isolation:isolate 로 스택 컨텍스트를 만들어, 그 안에서는
 * 어떤 z-index 를 줘도 하단 탭 위로 올라갈 수 없다. 앱 프레임으로 포털을 보낸다.
 *
 * @param {string[]} items 삭제될 데이터 항목 목록
 * @param {() => void} onCancel
 * @param {() => void} onConfirm
 * @param {boolean} isDeleting
 */
function DeleteAllDataModal({ items, onCancel, onConfirm, isDeleting = false }) {
  const frame = document.querySelector('.app-layout__frame') ?? document.body

  return createPortal(
    <div className="delete-all-data" onClick={onCancel}>
      <section
        onClick={(event) => event.stopPropagation()}
        className="delete-all-data__dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-all-data-title"
      >
        <AssistantMascot className="delete-all-data__mascot" />

        <h2 id="delete-all-data-title" className="delete-all-data__title">
          모든 데이터 삭제
        </h2>
        <p className="delete-all-data__lead">정말 모든 데이터를 삭제하겠습니까?</p>
        <p className="delete-all-data__note">이 작업은 되돌릴 수 없습니다.</p>

        <ul className="delete-all-data__list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="delete-all-data__actions">
          <button
            type="button"
            className="delete-all-data__action"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            type="button"
            className="delete-all-data__action delete-all-data__action--danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? '삭제 중' : '삭제'}
          </button>
        </div>
      </section>
    </div>,
    frame,
  )
}

export default DeleteAllDataModal
