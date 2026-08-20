import { formatCoachingCategory, formatDateTimeRange } from './formatApiData.js'

/**
 * GET /api/v1/transitions/{date} 의 phases[]를 화면 섹션으로 옮긴다.
 * 응답에 단계 제목이 없으므로 분류 이름을 제목으로 쓴다.
 */
export function toGuideSections(phases, iconByCategory, fallbackIcon) {
  return (phases ?? []).map((phase) => ({
    id: phase.phase,
    title: phase.label,
    cards: (phase.steps ?? []).map((step) => ({
      id: step.stepId,
      icon: iconByCategory[step.category] ?? fallbackIcon,
      title: formatCoachingCategory(step.category),
      timing: formatDateTimeRange(step.windowStart, step.windowEnd),
      description: step.actionText ?? '권장 시간에 맞춰 실행해 주세요.',
    })),
  }))
}

/**
 * 전환일 체크리스트. 전환 프로토콜에서 만들어진 루틴 항목만 모아 보여준다.
 * 체크 상태를 서버에 남겨야 하므로 화면에 고정된 문구 대신 실제 루틴을 쓴다.
 */
export function toChecklistItems(tasks) {
  return (tasks ?? [])
    .filter((task) => task.sourceType === 'TRANSITION')
    .map((task) => ({
      id: task.taskId,
      label: task.title,
      time: formatDateTimeRange(task.windowStart, task.windowEnd),
      checked: task.status === 'DONE',
    }))
}

export function applyChecklistStatus(items, taskId, status) {
  return items.map((item) => (item.id === taskId ? { ...item, checked: status === 'DONE' } : item))
}

export function nextChecklistStatus(item) {
  return item.checked ? 'PENDING' : 'DONE'
}
