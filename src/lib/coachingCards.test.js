import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  applyCardDetail,
  isPastWindow,
  toCoachingCardView,
  toggleCardDetail,
} from './coachingCards.js'

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

describe('toCoachingCardView', () => {
  const apiCard = {
    cardId: 11,
    cardType: 'NAP',
    title: '권장 낮잠',
    windowStart: '2026-08-21T13:00+09:00',
    windowEnd: '2026-08-21T13:20+09:00',
    description: '20분 정도 짧게 자 두면 좋아요.',
  }

  it('응답 카드를 화면 모델로 옮긴다', () => {
    const view = toCoachingCardView(apiCard, 'nap.svg')

    assert.equal(view.id, 11)
    assert.equal(view.icon, 'nap.svg')
    assert.equal(view.title, '권장 낮잠')
    assert.equal(view.timing, '13:00 – 13:20')
    assert.equal(view.description, '20분 정도 짧게 자 두면 좋아요.')
  })

  it('요약 설명을 따로 보관해 상세를 닫을 때 되돌릴 수 있게 한다', () => {
    const view = toCoachingCardView(apiCard, 'nap.svg')

    assert.equal(view.summaryDescription, '20분 정도 짧게 자 두면 좋아요.')
    assert.equal(view.detailDescription, null)
    assert.equal(view.isDetailVisible, false)
  })
})

describe('applyCardDetail', () => {
  const cards = [
    { id: 1, description: '요약1', summaryDescription: '요약1', detailDescription: null, isDetailVisible: false },
    { id: 2, description: '요약2', summaryDescription: '요약2', detailDescription: null, isDetailVisible: false },
  ]

  it('받아온 근거를 보여주고 기억해 둔다', () => {
    const [first] = applyCardDetail(cards, 1, '멜라토닌 분비 때문이에요.')

    assert.equal(first.description, '멜라토닌 분비 때문이에요.')
    assert.equal(first.detailDescription, '멜라토닌 분비 때문이에요.')
    assert.equal(first.isDetailVisible, true)
  })

  it('근거가 비어 있으면 요약 설명을 유지한다', () => {
    const [first] = applyCardDetail(cards, 1, null)

    assert.equal(first.description, '요약1')
  })

  it('다른 카드는 건드리지 않는다', () => {
    const [, second] = applyCardDetail(cards, 1, '근거')

    assert.deepEqual(second, cards[1])
  })
})

describe('toggleCardDetail', () => {
  const cards = [
    { id: 1, description: '근거', summaryDescription: '요약', detailDescription: '근거', isDetailVisible: true },
  ]

  it('상세가 보이는 중이면 요약으로 되돌린다', () => {
    const [first] = toggleCardDetail(cards, 1)

    assert.equal(first.description, '요약')
    assert.equal(first.isDetailVisible, false)
  })

  it('요약이 보이는 중이면 상세를 다시 보여준다', () => {
    const closed = toggleCardDetail(cards, 1)
    const [first] = toggleCardDetail(closed, 1)

    assert.equal(first.description, '근거')
    assert.equal(first.isDetailVisible, true)
  })
})
