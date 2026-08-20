import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  confirmScheduleUpload,
  correctScheduleDrafts,
  createScheduleDraft,
  deleteShift,
  getScheduleDrafts,
  getShifts,
  updateShift,
} from '@/api/scheduleApi.js'
import Select from '../../components/common/Select.jsx'
import PageHeader from '../../components/common/PageHeader.jsx'
import routineHero from '../../assets/routine-summary/routine-hero.png'
import sparkleIcon from '../../assets/sparkle.svg'
import { PATH } from '../../routes/paths.js'
import {
  formatDate,
  formatShiftType,
  getMonthRange,
  toShiftType,
} from '../../lib/formatApiData.js'
import ScheduleDateList from './components/ScheduleDateList.jsx'
import ScheduleResultSummary from './components/ScheduleResultSummary.jsx'
import ShiftEditSheet from './components/ShiftEditSheet.jsx'
import {
  clearOcrContext,
  getStoredOcrJobId,
  getStoredOcrMonth,
  rememberCalendarMonth,
  resolveScheduleMonth,
} from './utils/scheduleFlow.js'
import './ScheduleResult.scss'

// 근무유형 선택지. 실제 값은 근무표 정책이 확정되면 상수로 분리해 공유한다.
const SHIFT_TYPE_OPTIONS = ['데이', '이브닝', '나이트', '오프']

function ScheduleResult() {
  const navigate = useNavigate()
  const location = useLocation()
  const jobId = location.state?.jobId
    ?? getStoredOcrJobId()
  const targetMonth = location.state?.targetMonth
    ?? getStoredOcrMonth()
  const [dates, setDates] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [newDraftDate, setNewDraftDate] = useState('')
  const [newDraftShiftType, setNewDraftShiftType] = useState('')
  const [isAddingDraft, setIsAddingDraft] = useState(false)
  // 확정된 근무를 고치는 모드(jobId 없음)에서 쓰는 편집 시트 상태.
  const [editingShiftId, setEditingShiftId] = useState(null)
  const [isSavingShift, setIsSavingShift] = useState(false)
  const [sheetErrorMessage, setSheetErrorMessage] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    if (!jobId) {
      const now = new Date()
      const fallbackRange = getMonthRange(now.getFullYear(), now.getMonth())
      const from = location.state?.from ?? fallbackRange.from
      const to = location.state?.to ?? fallbackRange.to

      getShifts(from, to, { signal: controller.signal })
        .then((data) => {
          setDates((data.shifts ?? []).map((shift) => {
            const shiftType = formatShiftType(shift.shiftType)

            return {
              id: shift.shiftId,
              workDate: shift.workDate,
              date: formatDate(shift.workDate),
              shiftType,
              originalShiftType: shiftType,
              initiallyExcluded: false,
              excluded: false,
              resolved: true,
              // 시트에서 시각까지 고칠 수 있도록 원본 값을 함께 들고 있는다.
              startTime: shift.startTime,
              endTime: shift.endTime,
            }
          }))
        })
        .catch((error) => {
          if (error.name !== 'AbortError') setErrorMessage(error.message)
        })

      return () => controller.abort()
    }

    getScheduleDrafts(jobId, { signal: controller.signal })
      .then((data) => {
        if (data.status !== 'COMPLETED') {
          throw new Error('분석이 완료된 근무표만 검수할 수 있습니다.')
        }

        setDates(data.drafts.map((draft) => {
          const originalShiftType = formatShiftType(draft.shiftType)
          const excluded = Boolean(draft.excluded ?? draft.isUncertain ?? false)
          const resolved = !excluded

          return {
            id: draft.draftId,
            workDate: draft.workDate,
            date: formatDate(draft.workDate),
            shiftType: resolved ? originalShiftType : '',
            originalShiftType,
            initiallyExcluded: excluded,
            excluded,
            userExcluded: false,
            resolved,
          }
        }))
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setErrorMessage(error.message)
      })

    return () => controller.abort()
  }, [jobId, location.state, reloadToken])

  // 인식 불확실 항목을 사용자가 직접 고치면 확인 완료로 전환하고,
  // 요약 통계(확인 완료 / 수정 필요)도 함께 갱신되도록 한다.
  const handleChangeShiftType = (id, value) => {
    setDates((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, shiftType: value, excluded: false, resolved: true }
          : item,
      ),
    )
  }

  // 사용자가 직접 "제외"를 누른 날짜는 근무유형을 안 골라도 확정을 막지 않는다.
  const handleToggleExclude = (id) => {
    setDates((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, userExcluded: !item.userExcluded } : item,
      ),
    )
  }

  // OCR이 아예 초안을 만들지 못한 날짜(예: "교육" 같은 근무 외 배지)를 사용자가 직접 추가한다.
  const handleAddDraft = async (event) => {
    event.preventDefault()
    if (!jobId || !newDraftDate || !newDraftShiftType || isAddingDraft) return

    setErrorMessage('')
    setIsAddingDraft(true)

    try {
      const draft = await createScheduleDraft(jobId, {
        workDate: newDraftDate,
        shiftType: toShiftType(newDraftShiftType),
      })
      const originalShiftType = formatShiftType(draft.shiftType)

      setDates((prev) => [
        // 같은 날짜에 이미 초안이 있으면 방금 직접 넣은 값이 우선한다(백엔드 규칙과 동일).
        ...prev.filter((item) => item.workDate !== draft.workDate),
        {
          id: draft.draftId,
          workDate: draft.workDate,
          date: formatDate(draft.workDate),
          shiftType: originalShiftType,
          originalShiftType,
          initiallyExcluded: false,
          excluded: false,
          userExcluded: false,
          resolved: true,
        },
      ].sort((a, b) => a.workDate.localeCompare(b.workDate)))
      setNewDraftDate('')
      setNewDraftShiftType('')
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsAddingDraft(false)
    }
  }

  const handleConfirmSave = async () => {
    if (dates.some((item) => !item.resolved && !item.userExcluded) || isSaving) return

    if (!jobId) {
      setErrorMessage('')
      setIsSaving(true)

      try {
        const changedDates = dates.filter(
          (item) => item.shiftType !== item.originalShiftType,
        )

        await Promise.all(changedDates.map((item) => (
          updateShift(item.id, { shiftType: toShiftType(item.shiftType) })
        )))
        const scheduleMonth = resolveScheduleMonth(dates, targetMonth)

        rememberCalendarMonth(scheduleMonth)
        navigate(PATH.SCHEDULE_CALENDAR, {
          state: { targetMonth: scheduleMonth },
        })
      } catch (error) {
        setErrorMessage(error.message)
        setIsSaving(false)
      }
      return
    }

    const confirmed = window.confirm(
      '근무표를 확정하면 인식 결과 검수가 끝납니다.\n확정 후에는 캘린더의 "수정하러 가기"에서 언제든지 수정하거나 삭제할 수 있습니다.\n계속할까요?',
    )
    if (!confirmed) return

    setErrorMessage('')
    setIsSaving(true)

    try {
      const corrections = [
        ...dates
          .filter((item) => item.userExcluded)
          .map((item) => ({ draftId: item.id, excluded: true })),
        ...dates
          .filter((item) => (
            !item.userExcluded
            && (item.initiallyExcluded || item.shiftType !== item.originalShiftType)
          ))
          .map((item) => ({
            draftId: item.id,
            shiftType: toShiftType(item.shiftType),
          })),
      ]

      if (corrections.length > 0) {
        await correctScheduleDrafts(jobId, corrections)
      }

      const result = await confirmScheduleUpload(jobId)
      const scheduleMonth = resolveScheduleMonth(dates, targetMonth)

      clearOcrContext()
      rememberCalendarMonth(scheduleMonth)
      navigate(PATH.SCHEDULE_CALENDAR, {
        state: {
          targetMonth: scheduleMonth,
          justConfirmed: true,
          skippedDates: result?.skippedDates ?? [],
        },
      })
    } catch (error) {
      setErrorMessage(error.message)
      setIsSaving(false)
    }
  }

  const handleBackToCalendar = () => {
    navigate(PATH.SCHEDULE_CALENDAR)
  }

  const editingItem = dates.find((item) => item.id === editingShiftId) ?? null

  const closeShiftEditor = () => {
    setEditingShiftId(null)
    setSheetErrorMessage('')
  }

  // 시트에서 저장하면 즉시 반영한다. 빈 시각은 요청에서 제외해야
  // 백엔드의 HH:mm 형식 검증을 통과하고 기존 시각이 유지된다.
  const handleSaveShift = async ({ shiftType, startTime, endTime }) => {
    if (!editingItem) return

    setIsSavingShift(true)
    setSheetErrorMessage('')

    try {
      await updateShift(editingItem.id, {
        shiftType: toShiftType(shiftType),
        startTime: startTime || undefined,
        endTime: endTime || undefined,
      })
      closeShiftEditor()
      setReloadToken((token) => token + 1)
    } catch (error) {
      setSheetErrorMessage(error.message ?? '근무를 저장하지 못했습니다.')
    } finally {
      setIsSavingShift(false)
    }
  }

  const handleDeleteShift = async () => {
    if (!editingItem) return

    setIsSavingShift(true)
    setSheetErrorMessage('')

    try {
      await deleteShift(editingItem.id)
      closeShiftEditor()
      setReloadToken((token) => token + 1)
    } catch (error) {
      setSheetErrorMessage(error.message ?? '근무를 삭제하지 못했습니다.')
    } finally {
      setIsSavingShift(false)
    }
  }

  const total = dates.length
  const confirmed = dates.filter((item) => item.resolved || item.userExcluded).length
  const needsReview = total - confirmed

  return (
    <div className="schedule-result">
      <img className="schedule-result__hero" src={routineHero} alt="" aria-hidden="true" />
      <div className="schedule-result__hero-shade" aria-hidden="true" />

      <PageHeader
        title="근무표 관리"
        subtitle="오늘 근무도 시프트메이트가 챙겨드릴게요!"
        onSettingsClick={() => navigate(PATH.SETTINGS)}
      />

      <div className="schedule-result__card">
        <h2 className="schedule-result__title">
          {jobId ? '근무표 인식결과 확인' : '근무표 수정'}
        </h2>

        <p className="schedule-result__banner">
          {jobId
            ? '수정이 필요한 날짜만 선택해 근무 유형을 변경하세요.'
            : '날짜 옆 수정을 눌러 근무 유형과 시간을 바꾸거나 삭제할 수 있어요.'}
          <br />
          확인된 날짜는 그대로 유지됩니다.
        </p>

        {errorMessage && <p className="schedule-result__error" role="alert">{errorMessage}</p>}

        <ScheduleDateList
          items={dates}
          shiftTypeOptions={SHIFT_TYPE_OPTIONS}
          onChange={handleChangeShiftType}
          onToggleExclude={jobId ? handleToggleExclude : undefined}
          onEdit={jobId ? undefined : setEditingShiftId}
          title={jobId ? '날짜별 근무 유형 수정' : '날짜별 근무'}
        />

        {jobId && (
          <form className="schedule-result__add-form" onSubmit={handleAddDraft}>
            <p className="schedule-result__add-form-title">
              인식되지 않은 날짜가 있나요?
            </p>
            <div className="schedule-result__add-form-row">
              <input
                className="schedule-result__add-form-date"
                type="date"
                value={newDraftDate}
                onChange={(event) => setNewDraftDate(event.target.value)}
                disabled={isAddingDraft}
                required
              />
              <Select
                className="schedule-result__add-form-select"
                value={newDraftShiftType}
                onChange={setNewDraftShiftType}
                options={SHIFT_TYPE_OPTIONS.map((option) => ({ value: option, label: option }))}
                placeholder="근무유형"
                disabled={isAddingDraft}
              />
              <button
                type="submit"
                className="schedule-result__add-form-submit"
                disabled={isAddingDraft || !newDraftDate || !newDraftShiftType}
              >
                {isAddingDraft ? '추가 중' : '날짜 추가'}
              </button>
            </div>
          </form>
        )}

        <div className="schedule-result__divider" aria-hidden="true">
          <span className="schedule-result__divider-line" />
          <img src={sparkleIcon} alt="" width={16} height={16} />
          <span className="schedule-result__divider-line" />
        </div>

        <ScheduleResultSummary total={total} confirmed={confirmed} needsReview={needsReview} />

        <p className="schedule-result__caption">
          확정 후에도 이 화면에서 언제든지 수정하거나 삭제할 수 있습니다.
          <br />
          시프트메이트는 저장된 일정을 참고용으로만 활용합니다.
        </p>

        {jobId && (
          <button
            type="button"
            className="schedule-result__confirm"
            onClick={handleConfirmSave}
            disabled={dates.length === 0 || needsReview > 0 || isSaving}
          >
            {isSaving ? '저장 중' : '일정 저장 확정'}
          </button>
        )}

        <button
          type="button"
          className="schedule-result__back"
          onClick={handleBackToCalendar}
        >
          캘린더로 돌아가기
        </button>
      </div>

      {editingItem && (
        <ShiftEditSheet
          key={editingItem.id}
          date={editingItem.workDate}
          shift={{
            shiftId: editingItem.id,
            shiftType: toShiftType(editingItem.shiftType),
            startTime: editingItem.startTime,
            endTime: editingItem.endTime,
          }}
          onSave={handleSaveShift}
          onDelete={handleDeleteShift}
          onClose={closeShiftEditor}
          isSaving={isSavingShift}
          errorMessage={sheetErrorMessage}
        />
      )}
    </div>
  )
}

export default ScheduleResult
