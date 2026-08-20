import { IconClover } from '../../../components/common/icons/index.jsx'
import './RhythmCoachList.scss'

/**
 * 오늘의 리듬코치 카드 목록.
 * 이미 지난 시간대는 목록에서 빼지 않고 흐리게 보여준다.
 * @param {{ id: string, icon: React.ComponentType<{size?: number}>, tone?: 'default'|'danger', label: string, detail: string, past?: boolean }[]} items
 */
function RhythmCoachList({ items }) {
  return (
    <section className="rhythm-coach">
      <h2 className="rhythm-coach__title">
        오늘의 리듬코치
        <IconClover size={16} className="rhythm-coach__title-icon" />
      </h2>

      {items.length === 0 && (
        <p className="rhythm-coach__empty">
          오늘 코칭이 아직 없어요. 근무표를 등록하면 만들어 드려요.
        </p>
      )}

      <ul className="rhythm-coach__list">
        {items.map(({ id, icon: Icon, tone = 'default', label, detail, past = false }) => (
          <li key={id} className={`rhythm-coach__item${past ? ' rhythm-coach__item--past' : ''}`}>
            <span className={`rhythm-coach__icon rhythm-coach__icon--${tone}`}>
              <Icon size={22} />
            </span>
            <span className="rhythm-coach__label">{label}</span>
            <span className="rhythm-coach__detail">{detail}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RhythmCoachList
