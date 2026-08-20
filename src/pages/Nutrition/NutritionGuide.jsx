import { useEffect, useState } from 'react'
import { getHomeDashboard } from '@/api/homeApi.js'
import {
  addFavoriteContent,
  getNutrientNeeds,
  getNutritionContent,
  getNutritionContents,
  getNutritionProductRecommendations,
  removeFavoriteContent,
  saveNutrientNeeds,
} from '@/api/nutritionApi.js'
import { IconWarningTriangle } from '@/components/common/icons/index.jsx'
import SubPageHeader from '@/components/common/SubPageHeader.jsx'
import sparkleIcon from '@/assets/routine-summary/sparkle.svg'
import { formatClock, formatShiftType } from '@/lib/formatApiData.js'
import NutrientGoalChips from './components/NutrientGoalChips.jsx'
import NutritionContentCard from './components/NutritionContentCard.jsx'
import ProductRecommendationCard from './components/ProductRecommendationCard.jsx'
import './NutritionGuide.scss'

const TIMING_COPY = {
  BEFORE_NIGHT: {
    title: '야간 근무 전 영양 가이드',
    subtitle: '나이트 근무 시작 전 · 참고용 정보',
    chip: '나이트 근무 전',
    lead: '근무 시작 전 이 시간대에 적합한 식사와 영양 정보를 모았어요.',
  },
  DURING_NIGHT: {
    title: '야간 근무 중 영양 가이드',
    subtitle: '나이트 근무 중 · 참고용 정보',
    chip: '나이트 근무 중',
    lead: '근무 중 각성과 소화 부담 사이의 균형을 잡는 정보를 모았어요.',
  },
  AFTER_NIGHT: {
    title: '야간 근무 후 영양 가이드',
    subtitle: '나이트 근무 후 · 참고용 정보',
    chip: '나이트 근무 후',
    lead: '퇴근 후 수면을 방해하지 않는 식사와 영양 정보를 모았어요.',
  },
  GENERAL: {
    title: '교대근무 영양 가이드',
    subtitle: '평상시 · 참고용 정보',
    chip: '평상시',
    lead: '교대근무 리듬을 지키는 데 도움이 될 수 있는 정보를 모았어요.',
  },
}

const NUTRIENT_OPTIONS = [
  { code: 'MAGNESIUM', label: '마그네슘' },
  { code: 'ZINC', label: '아연' },
  { code: 'SELENIUM', label: '셀레늄' },
  { code: 'VITAMIN_A', label: '비타민 A' },
  { code: 'VITAMIN_C', label: '비타민 C' },
  { code: 'VITAMIN_D', label: '비타민 D' },
  { code: 'VITAMIN_E', label: '비타민 E' },
  { code: 'VITAMIN_B1', label: '비타민 B1' },
  { code: 'VITAMIN_B2', label: '비타민 B2' },
  { code: 'VITAMIN_B6', label: '비타민 B6' },
  { code: 'VITAMIN_B12', label: '비타민 B12' },
  { code: 'NIACIN', label: '나이아신' },
  { code: 'FOLATE', label: '엽산' },
  { code: 'PANTOTHENIC_ACID', label: '판토텐산' },
  { code: 'BIOTIN', label: '비오틴' },
]

const NUTRIENT_LABELS = Object.fromEntries(
  NUTRIENT_OPTIONS.map(({ code, label }) => [code, label]),
)

const NOTICES = [
  '이 화면의 정보는 일반적인 참고용이며 의학적 조언이 아닙니다.',
  '건강기능식품은 질병의 예방 및 치료를 위한 의약품이 아닙니다.',
  '알레르기나 기저질환이 있다면 섭취 전 전문가와 상담해 주세요.',
  '복용 중인 약이 있다면 상호작용 여부를 먼저 확인해 주세요.',
]

function NutritionGuide() {
  const [timingTag, setTimingTag] = useState('GENERAL')
  const [contents, setContents] = useState([])
  const [selectedNutrients, setSelectedNutrients] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [isSavingNutrients, setIsSavingNutrients] = useState(false)
  const [shiftChip, setShiftChip] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [detailById, setDetailById] = useState({})
  const [errorMessage, setErrorMessage] = useState('')

  // 관심 영양소를 바꾸면 매칭 결과가 달라지므로 저장 직후에도 다시 읽는다.
  const loadRecommendations = (options) => {
    getNutritionProductRecommendations(options)
      .then((data) => setRecommendations(data.recommendations ?? []))
      .catch(() => {})
  }

  useEffect(() => {
    const controller = new AbortController()
    const options = { signal: controller.signal }

    loadRecommendations(options)

    getNutritionContents({}, options)
      .then((data) => {
        setTimingTag(data.recommendedTimingTag ?? 'GENERAL')
        setContents(data.contents ?? [])
      })
      .catch((error) => {
        if (error.name === 'AbortError') return

        setContents([])
        setErrorMessage(error.message ?? '영양 정보를 불러오지 못했습니다.')
      })

    getNutrientNeeds(options)
      .then((data) => setSelectedNutrients((data.needs ?? []).map((need) => need.nutrientCode)))
      .catch(() => {})

    getHomeDashboard(options)
      .then((data) => {
        const shift = data.todayShift

        if (!shift) return

        const startsAt = formatClock(shift.startTime)
        setShiftChip(startsAt
          ? `${startsAt} 출근`
          : `${formatShiftType(shift.shiftType)} 근무`)
      })
      .catch(() => {})

    return () => controller.abort()
  }, [])

  const copy = TIMING_COPY[timingTag] ?? TIMING_COPY.GENERAL
  const infoContents = contents.filter((item) => item.contentType === 'NUTRITION_INFO')
  const recipeContents = contents.filter((item) => item.contentType === 'RECIPE')

  const handleToggleNutrient = async (code) => {
    const previous = selectedNutrients
    const next = previous.includes(code)
      ? previous.filter((item) => item !== code)
      : [...previous, code]

    setSelectedNutrients(next)
    setIsSavingNutrients(true)
    setErrorMessage('')

    try {
      await saveNutrientNeeds(next)
      loadRecommendations()
    } catch (error) {
      setSelectedNutrients(previous)
      setErrorMessage(error.message ?? '관심 영양소를 저장하지 못했습니다.')
    } finally {
      setIsSavingNutrients(false)
    }
  }

  const handleToggleFavorite = async (content) => {
    const nextFavorited = !content.isFavorited

    setContents((current) => current.map((item) =>
      item.contentId === content.contentId
        ? { ...item, isFavorited: nextFavorited }
        : item))

    try {
      if (nextFavorited) await addFavoriteContent(content.contentId)
      else await removeFavoriteContent(content.contentId)
    } catch {
      setContents((current) => current.map((item) =>
        item.contentId === content.contentId
          ? { ...item, isFavorited: content.isFavorited }
          : item))
    }
  }

  const handleToggleExpand = async (contentId) => {
    if (expandedId === contentId) {
      setExpandedId(null)
      return
    }

    setExpandedId(contentId)

    if (detailById[contentId]) return

    try {
      const detail = await getNutritionContent(contentId)
      setDetailById((current) => ({ ...current, [contentId]: detail }))
    } catch {
      // 본문을 못 받아도 요약은 이미 보이므로 카드의 로딩 문구만 남는다.
    }
  }

  const renderCard = (content) => {
    const detail = detailById[content.contentId]

    return (
      <NutritionContentCard
        key={content.contentId}
        title={content.title}
        summary={content.summary}
        tags={[TIMING_COPY[content.timingTag]?.chip].filter(Boolean)}
        body={detail?.body}
        disclaimer={detail?.disclaimer}
        isExpanded={expandedId === content.contentId}
        onToggleExpand={() => handleToggleExpand(content.contentId)}
        isFavorited={content.isFavorited}
        onToggleFavorite={() => handleToggleFavorite(content)}
      />
    )
  }

  return (
    <div className="nutrition-guide">
      <SubPageHeader title="영양 정보/레시피" />

      <div className="nutrition-guide__card">
        <div className="nutrition-guide__intro">
          <h2 className="nutrition-guide__title">
            {copy.title}
            <img src={sparkleIcon} alt="" aria-hidden="true" />
          </h2>
          <p className="nutrition-guide__subtitle">{copy.subtitle}</p>
        </div>

        <section className="nutrition-guide__highlight">
          <h3>오늘 상황 요약</h3>
          <ul className="nutrition-guide__chips">
            <li>{copy.chip}</li>
            {shiftChip && <li>{shiftChip}</li>}
          </ul>
          <p>{copy.lead}</p>
        </section>

        {errorMessage && (
          <p className="nutrition-guide__error" role="alert">{errorMessage}</p>
        )}

        <section className="nutrition-guide__section">
          <h3 className="nutrition-guide__section-title">관심 영양소</h3>
          <p className="nutrition-guide__section-lead">
            고른 영양소를 기준으로 AI 비서가 제품을 추천해요.
            하나도 고르지 않으면 추천을 받을 수 없어요.
          </p>
          <NutrientGoalChips
            options={NUTRIENT_OPTIONS}
            selected={selectedNutrients}
            onToggle={handleToggleNutrient}
            disabled={isSavingNutrients}
          />
        </section>

        <section className="nutrition-guide__section">
          <h3 className="nutrition-guide__section-title">추천 제품</h3>
          {selectedNutrients.length === 0
            ? (
              <p className="nutrition-guide__empty">
                관심 영양소를 고르면 매칭되는 제품을 보여드려요.
              </p>
            )
            : recommendations.length === 0
              ? (
                <p className="nutrition-guide__empty">
                  고른 영양소와 매칭되는 제품이 아직 없어요.
                </p>
              )
              : (
                <div className="nutrition-guide__list">
                  {recommendations.map((product) => (
                    <ProductRecommendationCard
                      key={product.productId}
                      product={product}
                      nutrientLabels={NUTRIENT_LABELS}
                    />
                  ))}
                </div>
              )}
        </section>

        <section className="nutrition-guide__section">
          <h3 className="nutrition-guide__section-title">추천 영양 성분</h3>
          {infoContents.length === 0
            ? <p className="nutrition-guide__empty">이 시간대에 맞는 영양 정보가 아직 없어요.</p>
            : <div className="nutrition-guide__list">{infoContents.map(renderCard)}</div>}
        </section>

        <section className="nutrition-guide__section">
          <h3 className="nutrition-guide__section-title">야식 대안 레시피</h3>
          {recipeContents.length === 0
            ? <p className="nutrition-guide__empty">이 시간대에 맞는 레시피가 아직 없어요.</p>
            : <div className="nutrition-guide__list">{recipeContents.map(renderCard)}</div>}
        </section>

        <footer className="nutrition-guide__notice">
          <h3>
            <IconWarningTriangle size={16} />
            안내 및 주의사항
          </h3>
          <ul>
            {NOTICES.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </footer>
      </div>
    </div>
  )
}

export default NutritionGuide
