import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  applyChecklistStatus,
  nextChecklistStatus,
  toChecklistItems,
  toGuideSections,
} from './transitionGuide.js'

const ICONS = { SLEEP: 'sleep.svg', CAFFEINE_CUTOFF: 'caffeine.svg' }
const FALLBACK = 'light.svg'

describe('toGuideSections', () => {
  const phases = [
    {
      phase: 'D_MINUS_1',
      label: '전날',
      steps: [
        {
          stepId: 1,
          category: 'SLEEP',
          windowStart: '2026-08-21T22:00',
          windowEnd: '2026-08-22T06:00',
          actionText: '평소보다 일찍 자 두세요.',
        },
      ],
    },
  ]

  it('단계 이름과 라벨을 그대로 쓴다', () => {
    const [section] = toGuideSections(phases, ICONS, FALLBACK)

    assert.equal(section.id, 'D_MINUS_1')
    assert.equal(section.title, '전날')
  })

  it('단계 항목을 카드로 옮긴다', () => {
    const [{ cards }] = toGuideSections(phases, ICONS, FALLBACK)

    assert.equal(cards.length, 1)
    assert.equal(cards[0].id, 1)
    assert.equal(cards[0].icon, 'sleep.svg')
    assert.equal(cards[0].title, '수면')
    assert.equal(cards[0].timing, '22:00 – 06:00')
    assert.equal(cards[0].description, '평소보다 일찍 자 두세요.')
  })

  it('모르는 분류는 기본 아이콘으로 보여준다', () => {
    const unknown = [{ phase: 'D_DAY', label: '당일', steps: [{ stepId: 2, category: 'HYDRATION' }] }]
    const [{ cards }] = toGuideSections(unknown, ICONS, FALLBACK)

    assert.equal(cards[0].icon, FALLBACK)
    assert.equal(cards[0].title, 'HYDRATION')
  })

  it('단계가 없어도 빈 배열을 돌려준다', () => {
    assert.deepEqual(toGuideSections(undefined, ICONS, FALLBACK), [])
  })
})

describe('toChecklistItems', () => {
  const tasks = [
    { taskId: 1, sourceType: 'TRANSITION', title: '카페인 중단', status: 'PENDING', windowStart: '2026-08-21T14:00+09:00' },
    { taskId: 2, sourceType: 'COACHING', title: '빛 노출', status: 'PENDING' },
    { taskId: 3, sourceType: 'TRANSITION', title: '일찍 취침', status: 'DONE', windowStart: '2026-08-21T22:00+09:00', windowEnd: '2026-08-22T06:00+09:00' },
  ]

  it('전환일에서 만들어진 항목만 남긴다', () => {
    const items = toChecklistItems(tasks)

    assert.deepEqual(items.map((item) => item.id), [1, 3])
  })

  it('완료한 항목은 체크된 상태로 보여준다', () => {
    const items = toChecklistItems(tasks)

    assert.equal(items[0].checked, false)
    assert.equal(items[1].checked, true)
  })

  it('권장 시간대를 라벨 옆에 함께 보여준다', () => {
    const items = toChecklistItems(tasks)

    assert.equal(items[1].label, '일찍 취침')
    assert.equal(items[1].time, '22:00 – 06:00')
  })

  it('목록이 없으면 빈 배열을 돌려준다', () => {
    assert.deepEqual(toChecklistItems(undefined), [])
  })
})

describe('applyChecklistStatus', () => {
  const items = [
    { id: 1, label: '카페인 중단', checked: false },
    { id: 2, label: '일찍 취침', checked: true },
  ]

  it('해당 항목만 체크 상태를 바꾼다', () => {
    const changed = applyChecklistStatus(items, 1, 'DONE')

    assert.equal(changed[0].checked, true)
    assert.deepEqual(changed[1], items[1])
  })

  it('되돌리면 체크를 해제한다', () => {
    assert.equal(applyChecklistStatus(items, 2, 'PENDING')[1].checked, false)
  })
})

describe('nextChecklistStatus', () => {
  it('체크되지 않은 항목은 완료로 보낸다', () => {
    assert.equal(nextChecklistStatus({ checked: false }), 'DONE')
  })

  it('체크된 항목은 다시 대기로 되돌린다', () => {
    assert.equal(nextChecklistStatus({ checked: true }), 'PENDING')
  })
})
