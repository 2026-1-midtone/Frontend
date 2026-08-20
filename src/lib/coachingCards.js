import { formatDateTimeRange } from './formatApiData.js'

/**
 * 코칭 시간대가 이미 지났는지. 지난 카드는 목록에서 빼지 않고 흐리게 보여준다.
 * 종료 시각을 모르면(구버전 응답) 판단하지 않고 그대로 보여준다.
 */
export function isPastWindow(windowEnd, now = new Date()) {
  if (!windowEnd) return false

  const end = new Date(windowEnd)

  return !Number.isNaN(end.getTime()) && end <= now
}

/**
 * GET /api/v1/coachings 의 cards[] 한 건을 화면 모델로 옮긴다.
 * 상세 근거를 펼쳤다 접을 수 있도록 요약 설명을 따로 들고 있는다.
 */
export function toCoachingCardView(card, icon) {
  return {
    id: card.cardId,
    icon,
    title: card.title,
    timing: formatDateTimeRange(card.windowStart, card.windowEnd),
    description: card.description,
    summaryDescription: card.description,
    detailDescription: null,
    isDetailVisible: false,
  }
}

/** 상세 조회로 받아온 근거를 카드에 붙인다. 다음부터는 다시 부르지 않고 접었다 펼 수 있다. */
export function applyCardDetail(cards, cardId, rationale) {
  return cards.map((card) => (card.id === cardId
    ? {
        ...card,
        description: rationale ?? card.summaryDescription,
        detailDescription: rationale ?? card.detailDescription,
        isDetailVisible: true,
      }
    : card))
}

/** 이미 받아 둔 근거를 펼치거나 접는다. */
export function toggleCardDetail(cards, cardId) {
  return cards.map((card) => (card.id === cardId
    ? {
        ...card,
        description: card.isDetailVisible ? card.summaryDescription : card.detailDescription,
        isDetailVisible: !card.isDetailVisible,
      }
    : card))
}
