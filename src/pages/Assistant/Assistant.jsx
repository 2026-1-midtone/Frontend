import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconChevronLeft } from '../../components/common/icons/index.jsx'
import productPlaceholder from '../../assets/product-placeholder.svg'
import ChatBanner from './components/ChatBanner.jsx'
import ChatInputBar from './components/ChatInputBar.jsx'
import ChatMessageBubble from './components/ChatMessageBubble.jsx'
import ChatProductCarousel from './components/ChatProductCarousel.jsx'
import ChatRow from './components/ChatRow.jsx'
import ChatTypingIndicator from './components/ChatTypingIndicator.jsx'
import './Assistant.scss'

const FOOTNOTE = '*이 정보는 참고용이며 개인 건강 상태에 따라 다를 수 있습니다.'
const DISCLAIMER =
  '약물 복용·질환 진단·응급 증상 관련 질문은 답변을 드리지 않습니다.\n의료 전문가 또는 긴급 서비스에 문의해 주세요.'

const PRODUCT_ITEMS = [
  { id: 'p1', image: productPlaceholder, name: '말차 쉐이크', ctaLabel: '스토어 바로가기' },
  { id: 'p2', image: productPlaceholder, name: '말차 쉐이크', ctaLabel: '스토어 바로가기' },
]

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function Assistant() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(true)
  const [inputValue, setInputValue] = useState('')
  const [hasRepliedOnce, setHasRepliedOnce] = useState(false)

  const nextId = useRef(0)
  const isMounted = useRef(true)
  const scrollAnchorRef = useRef(null)

  const makeId = () => {
    nextId.current += 1
    return `m${nextId.current}`
  }

  // 실제 API 연동 전까지 쓰는 목업. 컴포넌트가 사라진 뒤 setState가 불리지
  // 않도록 매 스텝마다 isMounted를 확인한다.
  useEffect(() => {
    isMounted.current = true

    const introduce = async () => {
      await wait(900)
      if (!isMounted.current) return
      setIsTyping(false)
      setMessages([
        {
          id: makeId(),
          sender: 'ai',
          kind: 'text',
          segments: [{ text: '안녕하세요 시프트메이트입니다\n무엇을 도와드릴까요?' }],
        },
      ])
    }

    introduce()

    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, isTyping])

  const handleBack = () => {
    navigate(-1)
  }

  const runFirstReply = async () => {
    await wait(1100)
    if (!isMounted.current) return
    setIsTyping(false)
    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        sender: 'ai',
        kind: 'text',
        segments: [
          { text: '지금은 카페인 섭취를 피하는 것이 좋습니다.\n' },
          { text: '다음 나이트 근무 시작까지 4시간', highlight: true },
          { text: ' 남아 있어 카페인이 수면에 영향을 줄 수 있습니다.' },
        ],
      },
      {
        id: makeId(),
        sender: 'ai',
        kind: 'text',
        segments: [{ text: '디카페인 음료 또는 10~20분 짧은 낮잠을 추천드려요.' }],
        infoRow: { icon: '☕', label: '컷오프 시간', value: '21:00' },
        footnote: FOOTNOTE,
      },
    ])

    await wait(900)
    if (!isMounted.current) return
    setIsTyping(true)
    await wait(1000)
    if (!isMounted.current) return
    setIsTyping(false)
    setMessages((prev) => [
      ...prev,
      { id: makeId(), sender: 'ai', kind: 'products', items: PRODUCT_ITEMS },
      {
        id: makeId(),
        sender: 'ai',
        kind: 'text',
        segments: [
          { text: '카페인이 부담된다면\n' },
          { text: '윔쉐이크 말차', highlight: true },
          { text: '를 추천드려요!\n근무 전 가볍게 컨디션을 관리해 보세요.' },
        ],
        infoRow: { icon: '☕', label: '추천 시간', value: '21:00' },
        footnote: FOOTNOTE,
      },
    ])
    setHasRepliedOnce(true)
  }

  const runFallbackReply = async () => {
    await wait(700)
    if (!isMounted.current) return
    setIsTyping(false)
    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        sender: 'ai',
        kind: 'text',
        segments: [
          {
            text: '죄송해요, 아직 이 질문에는 답변을 준비하지 못했어요.\n다른 질문을 시도해 주세요!',
          },
        ],
      },
    ])
  }

  const handleSend = () => {
    const question = inputValue.trim()
    if (!question) return

    setMessages((prev) => [
      ...prev,
      { id: makeId(), sender: 'user', kind: 'text', segments: [{ text: question }] },
    ])
    setInputValue('')
    setIsTyping(true)

    if (!hasRepliedOnce) {
      runFirstReply()
    } else {
      runFallbackReply()
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
      </div>

      <div className="assistant__messages">
        {messages.map((message, index) => {
          const prevSender = index > 0 ? messages[index - 1].sender : null
          const showAvatar = message.sender === 'ai' && prevSender !== 'ai'

          return (
            <ChatRow key={message.id} sender={message.sender} showAvatar={showAvatar}>
              {message.kind === 'text' ? (
                <ChatMessageBubble
                  sender={message.sender}
                  segments={message.segments}
                  infoRow={message.infoRow}
                  footnote={message.footnote}
                />
              ) : (
                <ChatProductCarousel items={message.items} />
              )}
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
      />
    </div>
  )
}

export default Assistant
