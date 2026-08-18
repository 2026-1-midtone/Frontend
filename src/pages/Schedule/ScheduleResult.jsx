import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AiAssistantBubble from '../../components/common/AiAssistantBubble.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import scheduleMockPreview from '../../assets/schedule-preview.svg'
import { PATH } from '../../routes/paths.js'
import ScheduleDateList from './components/ScheduleDateList.jsx'
import ScheduleResultSummary from './components/ScheduleResultSummary.jsx'
import ScheduleResultThumbnail from './components/ScheduleResultThumbnail.jsx'
import './ScheduleResult.scss'

// 근무유형 선택지. 실제 값은 근무표 정책이 확정되면 상수로 분리해 공유한다.
const SHIFT_TYPE_OPTIONS = ['데이', '이브닝', '나이트', '오프']

// 실제 OCR 연동 전까지 사용하는 목업 데이터.
// 전체 스케줄(예: 28일)의 일부만 대표로 담았다 — 통계 수치는 이 목록 길이를 기준으로 계산된다.
const INITIAL_DATES = [
  { id: 'd1', date: '6월 1일 (월)', shiftType: '데이', resolved: true },
  { id: 'd2', date: '6월 2일 (화)', shiftType: '데이', resolved: true },
  { id: 'd3', date: '6월 3일 (수)', shiftType: '나이트', resolved: false },
  { id: 'd4', date: '6월 4일 (목)', shiftType: '나이트', resolved: true },
  { id: 'd5', date: '6월 5일 (금)', shiftType: '오프', resolved: true },
  { id: 'd6', date: '6월 6일 (토)', shiftType: '오프', resolved: false },
  { id: 'd7', date: '6월 7일 (일)', shiftType: '이브닝', resolved: true },
  { id: 'd8', date: '6월 8일 (월)', shiftType: '데이', resolved: false },
]

function ScheduleResult() {
  const navigate = useNavigate()
  const [dates, setDates] = useState(INITIAL_DATES)
  const [showAssistantMessage, setShowAssistantMessage] = useState(true)

  // 인식 불확실 항목을 사용자가 직접 고치면 확인 완료로 전환하고,
  // 요약 통계(확인 완료 / 수정 필요)도 함께 갱신되도록 한다.
  const handleChangeShiftType = (id, value) => {
    setDates((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, shiftType: value, resolved: true } : item,
      ),
    )
  }

  // TODO: 실제 재처리 API 연동
  const handleReprocess = () => {}

  // TODO: 이미지 재업로드 화면/다이얼로그 연동
  const handleReupload = () => {}

  // TODO: 수동 입력 화면 라우트 연결 (별도 티켓)
  const handleManualEntry = () => {}

  // TODO: 완료 처리 후 이동할 화면 확정 필요
  const handleComplete = () => {}

  const total = dates.length
  const confirmed = dates.filter((item) => item.resolved).length
  const needsReview = total - confirmed

  return (
    <div className="schedule-result">
      <PageHeader
        title="근무표 관리"
        subtitle="오늘 근무도 시프트메이트가 챙겨드릴게요!"
        onSettingsClick={() => navigate(PATH.SETTINGS)}
      />

      <div className="schedule-result__card">
        <h2 className="schedule-result__title">근무표 인식결과 확인</h2>

        <ScheduleResultThumbnail
          src={scheduleMockPreview}
          onReprocess={handleReprocess}
          onReupload={handleReupload}
        />

        <ScheduleResultSummary
          total={total}
          confirmed={confirmed}
          needsReview={needsReview}
        />
      </div>

      <ScheduleDateList
        items={dates}
        shiftTypeOptions={SHIFT_TYPE_OPTIONS}
        onChange={handleChangeShiftType}
      />

      <button type="button" className="schedule-result__complete" onClick={handleComplete}>
        완료
      </button>

      <button type="button" className="schedule-result__manual" onClick={handleManualEntry}>
        수동으로 직접 입력하기
      </button>

      <AiAssistantBubble
        message="AI비서한테 물어보세요!"
        showMessage={showAssistantMessage}
        onDismissMessage={() => setShowAssistantMessage(false)}
      />
    </div>
  )
}

export default ScheduleResult
