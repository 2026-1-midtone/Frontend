import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getShifts } from '@/api/scheduleApi.js'
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
  const [shifts, setShifts] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const { from, to } = getMonthRange(year, month)

    getShifts(from, to, { signal: controller.signal })
      .then((data) => setShifts(data.shifts))
      .catch(() => {})

    return () => controller.abort()
  }, [month, year])

  const shiftsByDate = useMemo(() => {
    if (!shifts) return SHIFTS_BY_DATE

    return shifts.reduce((result, shift) => ({
      ...result,
      [shift.workDate]: [
        ...(result[shift.workDate] ?? []),
        formatShiftType(shift.shiftType),
      ],
    }), {})
  }, [shifts])

  const agendaItems = useMemo(() => {
    if (!shifts) return AGENDA_ITEMS

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
          shiftsByDate={shiftsByDate}
        />
      </div>

      <ScheduleAgendaList items={agendaItems} />

    </div>
  )
}

export default ScheduleCalendar
