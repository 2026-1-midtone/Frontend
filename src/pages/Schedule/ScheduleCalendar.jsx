import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader.jsx'
import AiAssistantBubble from '../../components/common/AiAssistantBubble.jsx' // AI 비서 컴포넌트 추가
import { PATH } from '../../routes/paths.js'
import ScheduleAgendaList from './components/ScheduleAgendaList.jsx'
import ScheduleMonthGrid from './components/ScheduleMonthGrid.jsx'
import ScheduleResultSummary from './components/ScheduleResultSummary.jsx'
import './ScheduleCalendar.scss'

// 실제 OCR·서버 연동 전까지 사용하는 목업. 표시 중인 달(2026년 8월)만 채워뒀고,
// 다른 달로 이동하면 태그 없는 빈 캘린더가 보인다 (이번 티켓의 범위 밖).
const MOCK_YEAR = 2026
const MOCK_MONTH = 7 // 0-indexed: 8월

const SHIFTS_BY_DATE = {
  '2026-08-01': ['오프'],
  '2026-08-04': ['오프', '나이트'],
  '2026-08-09': ['데이'],
  '2026-08-12': ['오프', '나이트'],
  '2026-08-15': ['이브닝', '나이트'],
  '2026-08-17': ['이브닝'],
}

const AGENDA_ITEMS = [
  {
    id: 'a1',
    date: '8월 1일 (토)',
    checkInTime: '9:00 출근',
    tags: ['오프'],
    resolved: true,
  },
  {
    id: 'a2',
    date: '8월 4일 (화)',
    checkInTime: '9:00 출근',
    tags: ['나이트', '오프'],
    resolved: true,
  },
  { id: 'a3', date: '8월 9일 (일)', checkInTime: null, tags: ['데이'], resolved: false },
  {
    id: 'a4',
    date: '8월 12일 (수)',
    checkInTime: '9:00 출근',
    tags: ['나이트', '오프'],
    resolved: true,
  },
  {
    id: 'a5',
    date: '8월 15일 (토)',
    checkInTime: '9:00 출근',
    tags: ['이브닝', '나이트'],
    resolved: true,
  },
  {
    id: 'a6',
    date: '8월 17일 (월)',
    checkInTime: '9:00 출근',
    tags: ['이브닝'],
    resolved: true,
  },
]

function ScheduleCalendar() {
  const navigate = useNavigate()
  const [{ year, month }, setCursor] = useState({ year: MOCK_YEAR, month: MOCK_MONTH })
  const [showAssistantMessage, setShowAssistantMessage] = useState(true) // 말풍선 상태값 추가

  const handlePrevMonth = () => {
    setCursor(({ year: y, month: m }) => {
      const date = new Date(y, m - 1, 1)
      return { year: date.getFullYear(), month: date.getMonth() }
    })
  }

  const handleNextMonth = () => {
    setCursor(({ year: y, month: m }) => {
      const date = new Date(y, m + 1, 1)
      return { year: date.getFullYear(), month: date.getMonth() }
    })
  }

  const handleGoToEdit = () => {
    navigate(PATH.SCHEDULE_RESULT)
  }

  const total = AGENDA_ITEMS.length
  const confirmed = AGENDA_ITEMS.filter((item) => item.resolved).length
  const needsReview = total - confirmed

  return (
    <div className="schedule-calendar">
      <PageHeader
        title="근무표 캘린더"
        subtitle="오늘 근무도 시프트메이트가 챙겨드릴게요!"
        onSettingsClick={() => navigate(PATH.SETTINGS)}
      />

      <div className="schedule-calendar__card">
        <ScheduleResultSummary total={total} confirmed={confirmed} needsReview={needsReview} />

        <button
          type="button"
          className="schedule-calendar__edit-button"
          onClick={handleGoToEdit}
        >
          수정하러 가기
        </button>

        <ScheduleMonthGrid
          year={year}
          month={month}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          shiftsByDate={SHIFTS_BY_DATE}
        />
      </div>

      <ScheduleAgendaList items={AGENDA_ITEMS} />

      <AiAssistantBubble
        message="AI비서한테 물어보세요!"
        showMessage={showAssistantMessage}
        onDismissMessage={() => setShowAssistantMessage(false)}
        onOpen={() => navigate(PATH.ASSISTANT)}
      />
    </div>
  )
}

export default ScheduleCalendar