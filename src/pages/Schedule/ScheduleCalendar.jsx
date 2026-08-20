import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  addShift,
  deleteShift,
  getShifts,
  updateShift,
} from '@/api/scheduleApi.js'
import PageHeader from '../../components/common/PageHeader.jsx'
import routineHero from '../../assets/routine-summary/routine-hero.png'
import { PATH } from '../../routes/paths.js'
import {
  formatDate,
  formatShiftType,
  getMonthRange,
} from '../../lib/formatApiData.js'
import ScheduleAgendaList from './components/ScheduleAgendaList.jsx'
import ScheduleMonthGrid from './components/ScheduleMonthGrid.jsx'
import ScheduleResultSummary from './components/ScheduleResultSummary.jsx'
import ShiftEditSheet from './components/ShiftEditSheet.jsx'
import {
  getCurrentYearMonth,
  getRememberedCalendarMonth,
  parseYearMonth,
  rememberCalendarMonth,
} from './utils/scheduleFlow.js'
import './ScheduleCalendar.scss'

function getInitialCursor(targetMonth) {
  return parseYearMonth(targetMonth)
    ?? parseYearMonth(getRememberedCalendarMonth())
    ?? parseYearMonth(getCurrentYearMonth())
}

function ScheduleCalendar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [{ year, month }, setCursor] = useState(
    () => getInitialCursor(location.state?.targetMonth),
  )
  const [shifts, setShifts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  // 근무 편집 시트 상태. reloadToken 을 올리면 현재 월을 다시 조회한다.
  const [editingDate, setEditingDate] = useState(null)
  const [isSavingShift, setIsSavingShift] = useState(false)
  const [sheetErrorMessage, setSheetErrorMessage] = useState('')
  const [reloadToken, setReloadToken] = useState(0)
  const confirmedTargetMonth = location.state?.justConfirmed
    ? location.state.targetMonth
    : null
  const skippedDates = location.state?.justConfirmed
    ? (location.state.skippedDates ?? [])
    : []

  useEffect(() => {
    const controller = new AbortController()
    const { from, to } = getMonthRange(year, month)

    setIsLoading(true)
    setErrorMessage('')
    getShifts(from, to, { signal: controller.signal })
      .then((data) => {
        const loadedShifts = data.shifts ?? []

        setShifts(loadedShifts)
        rememberCalendarMonth(`${year}-${String(month + 1).padStart(2, '0')}`)

        const queriedMonth = `${year}-${String(month + 1).padStart(2, '0')}`
        if (confirmedTargetMonth === queriedMonth && loadedShifts.length === 0) {
          setErrorMessage(
            '저장 요청은 완료됐지만 해당 월의 근무 일정을 조회하지 못했습니다. 잠시 후 새로고침하거나 백엔드 저장 결과를 확인해 주세요.',
          )
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setShifts([])
          setErrorMessage(error.message)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [confirmedTargetMonth, month, year, reloadToken])

  const shiftsByDate = useMemo(() => {
    return shifts.reduce((result, shift) => ({
      ...result,
      [shift.workDate]: [
        ...(result[shift.workDate] ?? []),
        formatShiftType(shift.shiftType),
      ],
    }), {})
  }, [shifts])

  const agendaItems = useMemo(() => {
    return shifts.map((shift) => ({
      id: shift.shiftId,
      date: formatDate(shift.workDate),
      checkInTime: shift.startTime ? `${shift.startTime} 출근` : null,
      tags: [formatShiftType(shift.shiftType)],
      resolved: shift.confirmed,
    }))
  }, [shifts])

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
    navigate(PATH.SCHEDULE_RESULT, {
      state: getMonthRange(year, month),
    })
  }

  const editingShift = shifts.find((shift) => shift.workDate === editingDate) ?? null

  const openShiftEditor = (dateKey) => {
    setEditingDate(dateKey)
    setSheetErrorMessage('')
  }

  const closeShiftEditor = () => {
    setEditingDate(null)
    setSheetErrorMessage('')
  }

  const handleSaveShift = async ({ shiftType, startTime, endTime }) => {
    setIsSavingShift(true)
    setSheetErrorMessage('')

    // 빈 시각은 요청에서 제외한다. 백엔드가 HH:mm 형식만 허용하고,
    // 값이 없으면 기본 시각(생성) 또는 기존 시각(수정)을 그대로 쓴다.
    const times = {
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    }

    try {
      if (editingShift) {
        await updateShift(editingShift.shiftId, { shiftType, ...times })
      } else {
        await addShift({ workDate: editingDate, shiftType, ...times })
      }
      closeShiftEditor()
      setReloadToken((token) => token + 1)
    } catch (error) {
      setSheetErrorMessage(error.message ?? '근무를 저장하지 못했습니다.')
    } finally {
      setIsSavingShift(false)
    }
  }

  const handleDeleteShift = async () => {
    if (!editingShift) return

    setIsSavingShift(true)
    setSheetErrorMessage('')

    try {
      await deleteShift(editingShift.shiftId)
      closeShiftEditor()
      setReloadToken((token) => token + 1)
    } catch (error) {
      setSheetErrorMessage(error.message ?? '근무를 삭제하지 못했습니다.')
    } finally {
      setIsSavingShift(false)
    }
  }

  const total = agendaItems.length
  const confirmed = agendaItems.filter((item) => item.resolved).length
  const needsReview = total - confirmed

  return (
    <div className="schedule-calendar">
      <img className="schedule-calendar__hero" src={routineHero} alt="" aria-hidden="true" />
      <div className="schedule-calendar__hero-shade" aria-hidden="true" />

      <PageHeader
        title="근무표 캘린더"
        subtitle="오늘 근무도 시프트메이트가 챙겨드릴게요!"
        onSettingsClick={() => navigate(PATH.SETTINGS)}
      />

      <div className="schedule-calendar__card">
        {errorMessage && (
          <p className="schedule-calendar__message schedule-calendar__message--error" role="alert">
            {errorMessage}
          </p>
        )}
        {skippedDates.length > 0 && (
          <p className="schedule-calendar__message schedule-calendar__message--warning" role="status">
            같은 날짜에 근무가 여러 건 인식돼 신뢰도가 가장 높은 일정 하나만 저장됐어요.
            아래 날짜는 직접 확인해 주세요.
            <br />
            {skippedDates.map((date) => formatDate(date)).join(', ')}
          </p>
        )}
        {!isLoading && !errorMessage && shifts.length === 0 && (
          <p className="schedule-calendar__message">
            이 달에 등록된 근무 일정이 없습니다.
          </p>
        )}

        <ScheduleResultSummary total={total} confirmed={confirmed} needsReview={needsReview} />

        <button
          type="button"
          className="schedule-calendar__edit-button"
          onClick={handleGoToEdit}
        >
          수정하러 가기
        </button>

        <p className="schedule-calendar__message">
          날짜를 누르면 근무를 추가하거나 수정할 수 있어요.
        </p>

        <ScheduleMonthGrid
          year={year}
          month={month}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          shiftsByDate={shiftsByDate}
          onSelectDate={openShiftEditor}
        />
      </div>

      <ScheduleAgendaList items={agendaItems} />

      {editingDate && (
        <ShiftEditSheet
          key={editingDate}
          date={editingDate}
          shift={editingShift}
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

export default ScheduleCalendar
