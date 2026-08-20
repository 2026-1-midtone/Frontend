import { formatDateTimeRange } from './formatApiData.js'

const TIP_BY_CATEGORY = {
  LIGHT: 'light',
  LIGHT_EXPOSURE: 'light',
  CAFFEINE_CUTOFF: 'caffeine',
  NAP: 'nap',
}

const NO_WINDOW_LABEL = '권장 시간 확인'

/**
 * 항목이 속할 섹션. 완료하면 완료된 항목으로, 되돌리면 원래 출처에 맞는 섹션으로 돌아간다.
 * @param {'PENDING'|'DONE'|'SKIPPED'} status
 * @param {'COACHING'|'TRANSITION'} sourceType
 */
export function toTaskGroup(status, sourceType) {
  if (status === 'DONE') return 'completed'

  return sourceType === 'COACHING' ? 'suggested' : 'remaining'
}

/**
 * GET /api/v1/routines 의 tasks[] 한 건을 화면용 모델로 바꾼다.
 * 상태를 바꿀 때 그룹을 다시 계산해야 하므로 sourceType을 함께 들고 있는다.
 */
export function toRoutineTask(task) {
  return {
    id: task.taskId,
    sourceType: task.sourceType,
    group: toTaskGroup(task.status, task.sourceType),
    title: task.title,
    time: formatDateTimeRange(task.windowStart, task.windowEnd) || NO_WINDOW_LABEL,
    tip: TIP_BY_CATEGORY[task.category],
    skippable: task.status !== 'DONE',
    completed: task.status === 'DONE',
    status: task.status === 'SKIPPED' ? 'skipped' : undefined,
  }
}

/**
 * 한 항목의 상태를 바꾼 새 목록. 그룹·완료 여부·건너뛰기 가능 여부를 함께 맞춰 준다.
 * 이걸 빼먹으면 완료해도 항목이 원래 섹션에 남는다.
 */
export function applyTaskStatus(tasks, taskId, status) {
  return tasks.map((task) => (task.id === taskId ? withStatus(task, status) : task))
}

function withStatus(task, status) {
  return {
    ...task,
    group: toTaskGroup(status, task.sourceType),
    completed: status === 'DONE',
    skippable: status !== 'DONE',
    status: status === 'SKIPPED' ? 'skipped' : undefined,
  }
}

export function nextToggleStatus(task) {
  return task.completed ? 'PENDING' : 'DONE'
}

export function nextSkipStatus(task) {
  return task.status === 'skipped' ? 'PENDING' : 'SKIPPED'
}
