import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isPastWindow } from './coachingCards.js'

const NOW = new Date('2026-08-21T22:00:00+09:00')

describe('isPastWindow', () => {
  it('종료 시각이 지났으면 지난 시간대로 본다', () => {
    assert.equal(isPastWindow('2026-08-21T21:00+09:00', NOW), true)
  })

  it('아직 진행 중이면 지난 시간대가 아니다', () => {
    assert.equal(isPastWindow('2026-08-21T23:00+09:00', NOW), false)
  })

  it('종료 시각을 모르면 지난 시간대로 보지 않는다', () => {
    assert.equal(isPastWindow(undefined, NOW), false)
  })

  it('날짜로 읽을 수 없는 값도 지난 시간대로 보지 않는다', () => {
    assert.equal(isPastWindow('언젠가', NOW), false)
  })
})
