import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  toCategoryRates,
  toPercent,
  toWeeklyPoints,
} from './routineReport.js'

describe('toPercent', () => {
  it('완료율을 정수 퍼센트로 바꾼다', () => {
    assert.equal(toPercent(0.714), 71)
  })

  it('아직 아무것도 안 했으면 0에서 시작한다', () => {
    assert.equal(toPercent(0), 0)
    assert.equal(toPercent(undefined), 0)
    assert.equal(toPercent(null), 0)
  })

  it('모두 완료하면 100이다', () => {
    assert.equal(toPercent(1), 100)
  })
})

describe('toCategoryRates', () => {
  const labels = { NAP: '낮잠', MEAL: '식사 타이밍' }

  it('분류별 완료율을 화면 모델로 옮긴다', () => {
    const rates = toCategoryRates([{ category: 'NAP', total: 4, done: 1, completionRate: 0.25 }], labels)

    assert.deepEqual(rates, [{ id: 'NAP', label: '낮잠', value: 25 }])
  })

  it('라벨을 모르는 분류는 분류 이름을 그대로 쓴다', () => {
    const [rate] = toCategoryRates([{ category: 'HYDRATION', total: 1, done: 0, completionRate: 0 }], labels)

    assert.equal(rate.label, 'HYDRATION')
  })

  it('기록이 없으면 빈 배열이다', () => {
    assert.deepEqual(toCategoryRates(undefined, labels), [])
  })
})

describe('toWeeklyPoints', () => {
  const byDay = [
    { date: '2026-08-17', total: 2, done: 1, completionRate: 0.5 },
    { date: '2026-08-18', total: 0, done: 0, completionRate: 0 },
    { date: '2026-08-19', total: 2, done: 2, completionRate: 1 },
  ]

  it('날짜에서 요일 이름을 뽑아 쓴다', () => {
    const points = toWeeklyPoints(byDay)

    assert.deepEqual(points.map((point) => point.label), ['월', '화', '수'])
  })

  it('완료율을 퍼센트 높이로 준다', () => {
    const points = toWeeklyPoints(byDay)

    assert.deepEqual(points.map((point) => point.percent), [50, 0, 100])
  })

  it('루틴이 없던 날을 표시해 0%와 구분한다', () => {
    const points = toWeeklyPoints(byDay)

    assert.deepEqual(points.map((point) => point.hasTasks), [true, false, true])
  })

  it('마지막 날을 오늘로 표시한다', () => {
    const points = toWeeklyPoints(byDay)

    assert.deepEqual(points.map((point) => point.isLast), [false, false, true])
  })

  it('기록이 없으면 빈 배열이다', () => {
    assert.deepEqual(toWeeklyPoints(undefined), [])
  })
})
