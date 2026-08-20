import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { applyTaskStatus, nextSkipStatus, nextToggleStatus, toRoutineTask } from './routineTasks.js'

const coachingTask = {
  taskId: 1,
  sourceType: 'COACHING',
  category: 'NAP',
  title: '권장 낮잠',
  tip: '근무 전 20분 파워냅',
  windowStart: '2026-08-21T13:00+09:00',
  windowEnd: '2026-08-21T13:20+09:00',
  status: 'PENDING',
}

const transitionTask = { ...coachingTask, taskId: 2, sourceType: 'TRANSITION', category: 'LIGHT' }

describe('toRoutineTask', () => {
  it('시간창을 화면에 쓸 문구로 만든다', () => {
    assert.equal(toRoutineTask(coachingTask).time, '13:00 – 13:20')
  })

  it('시간창이 없으면 자리표시자를 쓴다', () => {
    const task = { ...coachingTask, windowStart: null, windowEnd: null }

    assert.equal(toRoutineTask(task).time, '권장 시간 확인')
  })

  it('그룹을 되계산할 수 있도록 sourceType을 남긴다', () => {
    assert.equal(toRoutineTask(transitionTask).sourceType, 'TRANSITION')
  })
})

describe('applyTaskStatus', () => {
  it('완료하면 완료된 항목 그룹으로 옮긴다', () => {
    const tasks = [toRoutineTask(coachingTask)]

    const [updated] = applyTaskStatus(tasks, 1, 'DONE')

    assert.equal(updated.completed, true)
    assert.equal(updated.group, 'completed')
  })

  it('완료를 취소하면 코칭 항목은 추천 그룹으로 되돌아간다', () => {
    const tasks = applyTaskStatus([toRoutineTask(coachingTask)], 1, 'DONE')

    const [updated] = applyTaskStatus(tasks, 1, 'PENDING')

    assert.equal(updated.completed, false)
    assert.equal(updated.group, 'suggested')
  })

  it('완료를 취소하면 전환 프로토콜 항목은 남은 항목으로 되돌아간다', () => {
    const tasks = applyTaskStatus([toRoutineTask(transitionTask)], 2, 'DONE')

    const [updated] = applyTaskStatus(tasks, 2, 'PENDING')

    assert.equal(updated.group, 'remaining')
  })

  it('건너뛰면 완료로 세지 않는다', () => {
    const [updated] = applyTaskStatus([toRoutineTask(coachingTask)], 1, 'SKIPPED')

    assert.equal(updated.completed, false)
    assert.equal(updated.status, 'skipped')
  })

  it('완료한 항목은 더 이상 건너뛸 수 없다', () => {
    const [updated] = applyTaskStatus([toRoutineTask(coachingTask)], 1, 'DONE')

    assert.equal(updated.skippable, false)
  })

  it('다른 항목은 건드리지 않는다', () => {
    const tasks = [toRoutineTask(coachingTask), toRoutineTask(transitionTask)]

    const [, untouched] = applyTaskStatus(tasks, 1, 'DONE')

    assert.equal(untouched.completed, false)
  })
})

describe('다음 상태', () => {
  it('완료되지 않은 항목을 누르면 완료로 보낸다', () => {
    assert.equal(nextToggleStatus(toRoutineTask(coachingTask)), 'DONE')
  })

  it('완료된 항목을 누르면 대기로 되돌린다', () => {
    const [done] = applyTaskStatus([toRoutineTask(coachingTask)], 1, 'DONE')

    assert.equal(nextToggleStatus(done), 'PENDING')
  })

  it('건너뛴 항목을 다시 누르면 대기로 되돌린다', () => {
    const [skipped] = applyTaskStatus([toRoutineTask(coachingTask)], 1, 'SKIPPED')

    assert.equal(nextSkipStatus(skipped), 'PENDING')
  })
})
