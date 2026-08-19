import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader.jsx'
import AiAssistantBubble from '../../components/common/AiAssistantBubble.jsx' // AI 비서 컴포넌트 추가
import sparkleIcon from '../../assets/sparkle.svg'
import { ApiError } from '../../lib/apiClient.js'
import { confirmUpload, correctUploadDrafts, getUploadDrafts } from '../../lib/ocrApi.js'
import { PATH } from '../../routes/paths.js'
import ScheduleDateList from './components/ScheduleDateList.jsx'
import ScheduleResultSummary from './components/ScheduleResultSummary.jsx'
import { formatWorkDate, shiftTypeCode, shiftTypeLabel } from './utils/shiftType.js'
import './ScheduleResult.scss'

// 근무유형 선택지. 실제 값은 근무표 정책이 확정되면 상수로 분리해 공유한다.
const SHIFT_TYPE_OPTIONS = ['데이', '이브닝', '나이트', '오프']

function mapDraftToItem(draft) {
  return {
    id: String(draft.draftId),
    draftId: draft.draftId,
    date: formatWorkDate(draft.workDate),
    shiftType: shiftTypeLabel(draft.shiftType),
    resolved: !draft.isUncertain,
  }
}

function errorMessageOf(error, fallback) {
  return error instanceof ApiError || error instanceof Error ? error.message : fallback
}

function ScheduleResult() {
  const navigate = useNavigate()
  const location = useLocation()
  const uploadId = location.state?.uploadId

  const [dates, setDates] = useState([])
  const [progress, setProgress] = useState({ requiredDays: 0, resolvedDays: 0 })
  const [isLoading, setIsLoading] = useState(Boolean(uploadId))
  const [errorMessage, setErrorMessage] = useState('')

  // 업로드된 근무표의 OCR 인식 결과(초안)를 불러온다.
  useEffect(() => {
    if (!uploadId) return undefined

    let isMounted = true
    getUploadDrafts(uploadId)
      .then((data) => {
        if (!isMounted) return
        setDates(data.drafts.map(mapDraftToItem))
        setProgress(data.progress)
      })
      .catch((error) => {
        if (!isMounted) return
        setErrorMessage(errorMessageOf(error, '인식 결과를 불러오지 못했습니다.'))
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [uploadId])

  // 인식 불확실 항목을 사용자가 직접 고치면 확인 완료로 전환하고,
  // 요약 통계(확인 완료 / 수정 필요)도 함께 갱신되도록 한다.
  const handleChangeShiftType = async (id, value) => {
    setDates((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, shiftType: value, resolved: true } : item,
      ),
    )

    const draft = dates.find((item) => item.id === id)
    if (!uploadId || !draft) return

    try {
      const result = await correctUploadDrafts(uploadId, [
        { draftId: draft.draftId, shiftType: shiftTypeCode(value) },
      ])
      if (result?.progress) setProgress(result.progress)
    } catch (error) {
      setErrorMessage(errorMessageOf(error, '보정 내용을 저장하지 못했습니다.'))
    }
  }

  const handleConfirmSave = async () => {
    if (!uploadId) {
      navigate(PATH.SCHEDULE_CALENDAR)
      return
    }

    try {
      await confirmUpload(uploadId)
      navigate(PATH.SCHEDULE_CALENDAR)
    } catch (error) {
      setErrorMessage(errorMessageOf(error, '일정을 확정하지 못했습니다.'))
    }
  }

  const handleBackToCalendar = () => {
    navigate(PATH.SCHEDULE_CALENDAR)
  }

  const total = uploadId ? progress.requiredDays : dates.length
  const confirmed = uploadId
    ? progress.resolvedDays
    : dates.filter((item) => item.resolved).length
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

        <p className="schedule-result__banner">
          수정이 필요한 날짜만 선택해 근무 유형을 변경하세요.
          <br />
          확인된 날짜는 그대로 유지됩니다.
        </p>

        {errorMessage && <p className="schedule-result__error">{errorMessage}</p>}

        {isLoading ? (
          <p className="schedule-result__loading">인식 결과를 불러오는 중...</p>
        ) : (
          <ScheduleDateList
            items={dates}
            shiftTypeOptions={SHIFT_TYPE_OPTIONS}
            onChange={handleChangeShiftType}
            title="날짜별 근무 유형 수정"
          />
        )}

        <div className="schedule-result__divider" aria-hidden="true">
          <span className="schedule-result__divider-line" />
          <img src={sparkleIcon} alt="" width={16} height={16} />
          <span className="schedule-result__divider-line" />
        </div>

        <ScheduleResultSummary total={total} confirmed={confirmed} needsReview={needsReview} />

        <p className="schedule-result__caption">
          언제든지 수정하거나 삭제할 수 있습니다.
          <br />
          시프트메이트는 저장된 일정을 참고용으로만 활용합니다.
        </p>

        <button
          type="button"
          className="schedule-result__confirm"
          onClick={handleConfirmSave}
        >
          일정 저장 확정
        </button>

        <button
          type="button"
          className="schedule-result__back"
          onClick={handleBackToCalendar}
        >
          캘린더로 돌아가기
        </button>
      </div>

      <AiAssistantBubble onOpen={() => navigate(PATH.ASSISTANT)} />
    </div>
  )
}

export default ScheduleResult
