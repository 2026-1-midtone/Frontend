import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AiAssistantBubble from '../../components/common/AiAssistantBubble.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import scheduleMockPreview from '../../assets/schedule-preview.svg'
import { PATH } from '../../routes/paths.js'
import ScheduleStats from './components/ScheduleStats.jsx'
import ScheduleUploadCard from './components/ScheduleUploadCard.jsx'
import ScheduleWarningBanner from './components/ScheduleWarningBanner.jsx'
import './Schedule.scss'

// 실제 업로드·OCR 연동 전까지 사용하는 목업 통계.
const MOCK_STATS = { confirmed: 18, needsReview: 6, total: 28 }

function Schedule() {
  const navigate = useNavigate()
  const [previewSrc, setPreviewSrc] = useState(null)
  const [showAssistantMessage, setShowAssistantMessage] = useState(true)

  // TODO: 실제 파일 선택 다이얼로그 + 업로드 API 연동.
  // 지금은 클릭하면 목업 이미지를 채워 "업로드 후" 상태를 보여준다.
  const handleUpload = () => {
    setPreviewSrc(scheduleMockPreview)
  }

  const handleGoToResult = () => {
    navigate(PATH.SCHEDULE_RESULT)
  }

  const isUploaded = Boolean(previewSrc)

  return (
    <div className="schedule">
      <PageHeader
        title="근무표 관리"
        subtitle="오늘 근무도 시프트메이트가 챙겨드릴게요!"
      />

      <div className="schedule__card">
        <ScheduleUploadCard previewSrc={previewSrc} onUpload={handleUpload} />

        {isUploaded && (
          <>
            <ScheduleStats
              stats={MOCK_STATS}
              caption="최소 4주(28일) 일정 기준 · 보정 항목을 먼저 확인해 주세요"
            />

            {MOCK_STATS.needsReview > 0 && (
              <ScheduleWarningBanner
                title="인식이 어려운 날짜가 있어요"
                description="직접 근무유형을 선택해 수정해주세요"
              />
            )}

            <div className="schedule__actions">
              <button
                type="button"
                className="schedule__action schedule__action--primary"
                onClick={handleGoToResult}
              >
                수정하러 가기
              </button>
              <button type="button" className="schedule__action">
                완료
              </button>
            </div>
          </>
        )}
      </div>

      <AiAssistantBubble
        message="AI비서한테 물어보세요!"
        showMessage={showAssistantMessage}
        onDismissMessage={() => setShowAssistantMessage(false)}
      />
    </div>
  )
}

export default Schedule
