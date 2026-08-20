import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getChatMessages, sendChatMessage } from '@/api/chatApi.js'
import { getPersonalizationSettings } from '@/api/settingsApi.js'
import { PATH } from '@/routes/paths.js'
import {
  IconChevronLeft,
  IconCoffee,
  IconSchedule,
} from '../../components/common/icons/index.jsx'
import ChatBanner from './components/ChatBanner.jsx'
import ChatInputBar from './components/ChatInputBar.jsx'
import ChatMessageBubble from './components/ChatMessageBubble.jsx'
import ChatRow from './components/ChatRow.jsx'
import ChatTypingIndicator from './components/ChatTypingIndicator.jsx'
import ChatProductCarousel from './components/ChatProductCarousel.jsx'
import PersonalizationGuideModal from './components/PersonalizationGuideModal.jsx'
import HealthRecordPanel from '@/components/common/HealthRecordPanel.jsx'
import './Assistant.scss'

function isPersonalizationMissing(settings) {
  return (
    !settings.caffeineDailyMg
    && !settings.caffeineSensitivity
    && !settings.preferredNapMinutes
    && !settings.maxNapsPerDay
  )
}

const DISCLAIMER =
  '의료적 진단은 제공하지 않으며, 응급 상황에는 전문기관 연락처를 안내합니다.\n위급한 경우 즉시 119 또는 안내된 기관에 연락해 주세요.'

// 카페인 중단 창의 시작 시각을 컷오프 시각으로 쓴다.
// context.caffeineCutoffAt 은 응답에 없는 필드라 코칭 카드에서 찾고, 혹시 추가되면 그 값을 쓴다.
function findCaffeineCutoffAt(context) {
  const cutoffCard = context?.coachingCards
    ?.find((card) => card.type === 'CAFFEINE_CUTOFF')

  return context?.caffeineCutoffAt ?? cutoffCard?.windowStart ?? null
}

function toHourMinute(dateTime) {
  return dateTime ? dateTime.slice(11, 16) : null
}

// 추천 제품은 채팅 응답의 context 에 함께 담겨 온다.
// 영양 needs 가 등록되지 않은 사용자는 빈 배열이라 카드 영역을 아예 그리지 않는다.
function toProductItems(context) {
  return (context?.nutritionRecommendations?.recommendations ?? [])
    .filter((item) => item.imageUrl)
    .map((item) => ({
      id: String(item.productId),
      image: item.imageUrl,
      name: item.productName,
      ctaLabel: '스토어 바로가기',
      url: item.productUrl,
    }))
}

function Assistant() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [showPersonalizationGuide, setShowPersonalizationGuide] = useState(false)
  // 기록 입력 패널은 채팅 영역을 좁히지 않도록 버튼으로 펼친다.
  const [isRecordPanelOpen, setIsRecordPanelOpen] = useState(false)

  const nextId = useRef(0)
  const isMounted = useRef(true)
  const scrollAnchorRef = useRef(null)

  const makeId = () => {
    nextId.current += 1
    return `m${nextId.current}`
  }

  useEffect(() => {
    isMounted.current = true
    const controller = new AbortController()

    setIsTyping(true)
    getChatMessages({ size: 50 }, { signal: controller.signal })
      .then((data) => {
        if (!isMounted.current) return

        const history = data.messages.map((message) => ({
          id: message.messageId,
          sender: message.role === 'USER' ? 'user' : 'ai',
          kind: 'text',
          segments: [{ text: message.content }],
          safetyFlag: message.safetyFlag,
        }))

        setMessages(history.length > 0 ? history : [{
          id: makeId(),
          sender: 'ai',
          kind: 'text',
          segments: [{ text: '안녕하세요 시프트메이트입니다\n무엇을 도와드릴까요?' }],
        }])
      })
      .catch(() => {
        if (!isMounted.current) return
        setMessages([{
          id: makeId(),
          sender: 'ai',
          kind: 'text',
          segments: [{ text: '안녕하세요 시프트메이트입니다\n무엇을 도와드릴까요?' }],
        }])
      })
      .finally(() => {
        if (isMounted.current) setIsTyping(false)
      })

    return () => {
      isMounted.current = false
      controller.abort()
    }
  }, [])

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, isTyping])

  useEffect(() => {
    const controller = new AbortController()

    getPersonalizationSettings({ signal: controller.signal })
      .then((data) => {
        if (isMounted.current && isPersonalizationMissing(data)) {
          setShowPersonalizationGuide(true)
        }
      })
      .catch(() => {})

    return () => controller.abort()
  }, [])

  const handleBack = () => {
    navigate(-1)
  }

  const handleOpenScheduleCalendar = () => {
    navigate(PATH.SCHEDULE_CALENDAR)
  }

  const toggleRecordPanel = () => {
    setIsRecordPanelOpen((prev) => !prev)
  }

  const handleSelectProduct = (products, id) => {
    const selected = products.find((item) => item.id === id)

    if (selected?.url) window.open(selected.url, '_blank', 'noopener,noreferrer')
  }

  const handleSend = async () => {
    const question = inputValue.trim()
    if (!question || isTyping) return

    const temporaryId = makeId()
    setMessages((prev) => [
      ...prev,
      { id: temporaryId, sender: 'user', kind: 'text', segments: [{ text: question }] },
    ])
    setInputValue('')
    setIsTyping(true)

    try {
      const data = await sendChatMessage(question)
      if (!isMounted.current) return

      const additionalText = [
        ...(data.reasons ?? []),
        ...(data.alternatives?.length ? [`대안: ${data.alternatives.join(', ')}`] : []),
      ]
      const cutoffAt = toHourMinute(findCaffeineCutoffAt(data.context))
      const products = toProductItems(data.context)
      const topProduct = data.context?.nutritionRecommendations?.recommendations?.[0]

      setMessages((prev) => [
        ...prev.map((message) => message.id === temporaryId
          ? { ...message, id: data.userMessageId }
          : message),
        {
          id: data.assistantMessageId,
          sender: 'ai',
          kind: 'text',
          segments: [{
            text: [data.answer, ...additionalText].filter(Boolean).join('\n\n'),
          }],
          infoRow: cutoffAt
            ? { icon: '☕', label: '카페인 컷오프', value: cutoffAt }
            : undefined,
          footnote: data.disclaimer,
          emergencyContacts: data.emergencyContacts ?? [],
          safetyFlag: data.safetyFlag,
        },
        ...(products.length > 0
          ? [{
            id: `${data.assistantMessageId}-products`,
            sender: 'ai',
            kind: 'products',
            products,
          }]
          : []),
        ...(topProduct
          ? [{
            id: `${data.assistantMessageId}-suggestion`,
            sender: 'ai',
            kind: 'text',
            segments: [
              { text: '카페인이 부담된다면\n' },
              { text: `${topProduct.productName} 추천드려요!`, highlight: true },
              { text: '\n근무 전 가볍게 컨디션을 관리해 보세요.' },
            ],
            infoRow: cutoffAt
              ? { icon: '☕', label: '추천 시간', value: cutoffAt }
              : undefined,
            footnote: topProduct.disclaimer,
          }]
          : []),
      ])
    } catch (error) {
      if (!isMounted.current) return
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          sender: 'ai',
          kind: 'text',
          segments: [{ text: error.message ?? '답변을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.' }],
        },
      ])
    } finally {
      if (isMounted.current) setIsTyping(false)
    }
  }

  return (
    <div className="assistant">
      <div className="assistant__top">
        <button
          type="button"
          className="assistant__back"
          onClick={handleBack}
          aria-label="이전 화면으로"
        >
          <IconChevronLeft size={22} />
        </button>
        <ChatBanner
          title="근무 일정을 바탕으로 즉시 답변해드려요"
          description="지금 궁금한 점을 물어보세요!"
        />

        <div className="assistant__actions">
          <button
            type="button"
            className="assistant__action"
            onClick={handleOpenScheduleCalendar}
          >
            <IconSchedule size={18} />
            근무표 달력
          </button>
          <button
            type="button"
            className={`assistant__action${isRecordPanelOpen ? ' assistant__action--active' : ''}`}
            onClick={toggleRecordPanel}
            aria-expanded={isRecordPanelOpen}
            aria-controls="assistant-health-record"
          >
            <IconCoffee size={18} />
            커피·수면 기록
          </button>
        </div>

        {isRecordPanelOpen && (
          <HealthRecordPanel onClose={() => setIsRecordPanelOpen(false)} />
        )}
      </div>

      <div className="assistant__messages">
        {messages.map((message, index) => {
          const prevSender = index > 0 ? messages[index - 1].sender : null
          const showAvatar = message.sender === 'ai' && prevSender !== 'ai'

          if (message.kind === 'products') {
            return (
              <ChatRow key={message.id} sender="ai" showAvatar={showAvatar}>
                <ChatProductCarousel
                  items={message.products}
                  onSelect={(id) => handleSelectProduct(message.products, id)}
                />
              </ChatRow>
            )
          }

          return (
            <ChatRow key={message.id} sender={message.sender} showAvatar={showAvatar}>
              <ChatMessageBubble
                sender={message.sender}
                segments={message.segments}
                infoRow={message.infoRow}
                footnote={message.footnote}
                emergencyContacts={message.emergencyContacts}
                safetyFlag={message.safetyFlag}
              />
            </ChatRow>
          )
        })}

        {isTyping && (
          <ChatRow sender="ai" showAvatar={messages.at(-1)?.sender !== 'ai'}>
            <ChatTypingIndicator />
          </ChatRow>
        )}

        <div ref={scrollAnchorRef} />
      </div>

      <ChatInputBar
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        disclaimer={DISCLAIMER}
        maxLength={500}
      />

      {showPersonalizationGuide && (
        <PersonalizationGuideModal onClose={() => setShowPersonalizationGuide(false)} />
      )}
    </div>
  )
}

export default Assistant
