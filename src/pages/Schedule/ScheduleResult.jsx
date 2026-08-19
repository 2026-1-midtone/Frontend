import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader.jsx'
import routineHero from '../../assets/routine-summary/routine-hero.png'
import sparkleIcon from '../../assets/sparkle.svg'
import { PATH } from '../../routes/paths.js'
import ScheduleDateList from './components/ScheduleDateList.jsx'
import ScheduleResultSummary from './components/ScheduleResultSummary.jsx'
import './ScheduleResult.scss'

// 근무유형 선택지. 실제 값은 근무표 정책이 확정되면 상수로 분리해 공유한다.
const SHIFT_TYPE_OPTIONS = ['데이', '이브닝', '나이트', '오프']

// 실제 OCR 연동 전까지 사용하는 목업 데이터.
// 전체 스케줄(예: 28일)의 일부만 대표로 담았다 — 통계 수치는 이 목록 길이를 기준으로 계산된다.
// 캘린더 화면(ScheduleCalendar)의 목업과는 별도 상태라, 여기서 수정해도
// 캘린더 쪽에는 즉시 반영되지 않는다 (공유 스토어 도입 전까지의 한계).
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

  // 인식 불확실 항목을 사용자가 직접 고치면 확인 완료로 전환하고,
  // 요약 통계(확인 완료 / 수정 필요)도 함께 갱신되도록 한다.
  const handleChangeShiftType = (id, value) => {
    setDates((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, shiftType: value, resolved: true } : item,
      ),
    )
  }

  // TODO: 실제 저장 API 연동. 지금은 캘린더 화면으로 돌아가는 것으로 대신한다.
  const handleConfirmSave = () => {
    navigate(PATH.SCHEDULE_CALENDAR)
  }

  const handleBackToCalendar = () => {
    navigate(PATH.SCHEDULE_CALENDAR)
  }

  const total = dates.length
  const confirmed = dates.filter((item) => item.resolved).length
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
        <h2 className="schedule-result__title">근무표 인식결과 확인</h2>

        <p className="schedule-result__banner">
          수정이 필요한 날짜만 선택해 근무 유형을 변경하세요.
          <br />
          확인된 날짜는 그대로 유지됩니다.
        </p>

        <ScheduleDateList
          items={dates}
          shiftTypeOptions={SHIFT_TYPE_OPTIONS}
          onChange={handleChangeShiftType}
          title="날짜별 근무 유형 수정"
        />

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

    </div>
  )
}

export default ScheduleResult
