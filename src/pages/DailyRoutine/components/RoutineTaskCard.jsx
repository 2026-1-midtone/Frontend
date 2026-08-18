import checkIcon from '@/assets/daily-routine/check.svg'

function RoutineTaskCard({ task, onToggle, onTip, onSkip }) {
  const isSkipped = task.status === 'skipped'

  return (
    <li className={`routine-task${isSkipped ? ' routine-task--skipped' : ''}`}>
      <button
        className={`routine-task__check${task.completed ? ' routine-task__check--completed' : ''}`}
        type="button"
        aria-label={`${task.title} ${task.completed ? '완료 취소' : '완료'}`}
        aria-pressed={task.completed}
        onClick={() => onToggle(task.id)}
      >
        {task.completed && <img src={checkIcon} alt="" />}
      </button>

      <div className="routine-task__copy">
        <h3>{task.title}</h3>
        <p>{task.time}</p>
      </div>

      {task.tip && !isSkipped && (
        <button className="routine-task__action" type="button" onClick={() => onTip(task.tip)}>
          팁보기
        </button>
      )}

      {task.skippable && (
        <button className="routine-task__action" type="button" onClick={() => onSkip(task.id)}>
          {isSkipped ? '되돌리기' : '건너뛰기'}
        </button>
      )}
    </li>
  )
}

export default RoutineTaskCard
