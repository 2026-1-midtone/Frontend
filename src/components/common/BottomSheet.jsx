import './BottomSheet.scss'

/**
 * 화면 하단에 고정되는 시트형 모달.
 *
 * 이번 범위에서는 드래그 제스처로 높이를 조절하지 않는다.
 * 그랩 핸들은 시각적 어포던스로만 두고, 내용 펼침은 자식 컴포넌트가 담당한다.
 *
 * @param {React.ReactNode} children 시트 내부 콘텐츠
 * @param {string} className 배치용 추가 클래스
 */
function BottomSheet({ children, className = '' }) {
  return (
    <section className={`bottom-sheet ${className}`.trim()}>
      <div className="bottom-sheet__handle" aria-hidden="true" />
      <div className="bottom-sheet__content">{children}</div>
    </section>
  )
}

export default BottomSheet
