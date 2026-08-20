import { useEffect, useState } from 'react'
import { getCaffeineIntakes, getSleepLogs } from '@/api/healthRecordApi.js'
import SubPageHeader from '@/components/common/SubPageHeader.jsx'
import { IconCoffee, IconEyeOff } from '@/components/common/icons/index.jsx'
import { addDays, formatClock, formatDate, toDateString } from '@/lib/formatApiData.js'
import './HealthRecords.scss'

const RANGE_OPTIONS = [
  { days: 7, label: '최근 7일' },
  { days: 14, label: '최근 14일' },
  { days: 30, label: '최근 30일' },
]

function formatSleepDuration(sleptAt, wokeAt) {
  const minutes = Math.round((new Date(wokeAt) - new Date(sleptAt)) / 60000)

  if (!Number.isFinite(minutes) || minutes <= 0) return ''

  return `${Math.floor(minutes / 60)}시간 ${minutes % 60}분`
}

function groupByDate(items, getTimestamp) {
  const groups = new Map()

  items.forEach((item) => {
    const date = toDateString(new Date(getTimestamp(item)))
    if (!groups.has(date)) groups.set(date, [])
    groups.get(date).push(item)
  })

  return [...groups.entries()].sort(([a], [b]) => b.localeCompare(a))
}

function HealthRecords() {
  const [rangeDays, setRangeDays] = useState(7)
  const [sleepLogs, setSleepLogs] = useState([])
  const [caffeine, setCaffeine] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const options = { signal: controller.signal }
    const to = toDateString()
    const from = addDays(to, -(rangeDays - 1))

    setIsLoading(true)
    setErrorMessage('')

    Promise.allSettled([
      getSleepLogs(from, to, options),
      getCaffeineIntakes(from, to, options),
    ])
      .then(([sleepResult, caffeineResult]) => {
        if (controller.signal.aborted) return

        if (sleepResult.status === 'fulfilled') setSleepLogs(sleepResult.value.logs ?? [])
        if (caffeineResult.status === 'fulfilled') setCaffeine(caffeineResult.value)

        if (sleepResult.status === 'rejected' && caffeineResult.status === 'rejected') {
          setErrorMessage(sleepResult.reason?.message ?? '기록을 불러오지 못했습니다.')
        }

        setIsLoading(false)
      })

    return () => controller.abort()
  }, [rangeDays])

  const sleepByDate = groupByDate(sleepLogs, (log) => log.sleptAt)
  const caffeineByDate = groupByDate(caffeine?.intakes ?? [], (intake) => intake.consumedAt)

  return (
    <div className="health-records">
      <SubPageHeader title="수면·카페인 기록" />

      <div className="health-records__card">
        <div className="health-records__intro">
          <h2 className="health-records__title">지금까지 남긴 기록</h2>
          <p className="health-records__subtitle">
            홈 화면에서 입력한 기록을 기간별로 모아 봅니다.
          </p>
        </div>

        <ul className="health-records__ranges">
          {RANGE_OPTIONS.map((option) => (
            <li key={option.days}>
              <button
                type="button"
                className={`health-records__range${
                  option.days === rangeDays ? ' health-records__range--active' : ''
                }`}
                onClick={() => setRangeDays(option.days)}
                aria-pressed={option.days === rangeDays}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>

        {errorMessage && (
          <p className="health-records__error" role="alert">{errorMessage}</p>
        )}

        {caffeine && (
          <section className="health-records__highlight">
            <h3>기간 합계</h3>
            <p>
              카페인 {caffeine.totalAmountMg}mg · {caffeine.totalServings}잔
            </p>
          </section>
        )}

        <section className="health-records__section">
          <h3 className="health-records__section-title">
            <IconEyeOff size={16} />
            수면 기록
          </h3>
          {isLoading
            ? <p className="health-records__empty">불러오는 중이에요.</p>
            : sleepByDate.length === 0
              ? <p className="health-records__empty">이 기간에 남긴 수면 기록이 없어요.</p>
              : (
                <div className="health-records__groups">
                  {sleepByDate.map(([date, logs]) => (
                    <div key={date} className="health-records__group">
                      <h4>{formatDate(date)}</h4>
                      <ul>
                        {logs.map((log) => (
                          <li key={log.sleepLogId}>
                            <span className="health-records__time">
                              {formatClock(log.sleptAt)} – {formatClock(log.wokeAt)}
                            </span>
                            <span className="health-records__meta">
                              {formatSleepDuration(log.sleptAt, log.wokeAt)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
        </section>

        <section className="health-records__section">
          <h3 className="health-records__section-title">
            <IconCoffee size={16} />
            카페인 기록
          </h3>
          {isLoading
            ? <p className="health-records__empty">불러오는 중이에요.</p>
            : caffeineByDate.length === 0
              ? <p className="health-records__empty">이 기간에 남긴 카페인 기록이 없어요.</p>
              : (
                <div className="health-records__groups">
                  {caffeineByDate.map(([date, intakes]) => (
                    <div key={date} className="health-records__group">
                      <h4>{formatDate(date)}</h4>
                      <ul>
                        {intakes.map((intake) => (
                          <li key={intake.intakeId}>
                            <span className="health-records__time">
                              {formatClock(intake.consumedAt)}
                            </span>
                            <span className="health-records__meta">
                              {intake.beverageType || '카페인'} · {intake.amountMg}mg
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
        </section>
      </div>
    </div>
  )
}

export default HealthRecords
