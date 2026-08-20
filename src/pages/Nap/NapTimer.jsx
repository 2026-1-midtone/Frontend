import { useEffect, useRef, useState } from 'react'
import { finishNap, getActiveNap, startNap } from '@/api/napApi.js'
import { getPersonalizationSettings } from '@/api/settingsApi.js'
import SubPageHeader from '../../components/common/SubPageHeader.jsx'
import { IconSun, IconWarningTriangle } from '../../components/common/icons/index.jsx'
import NapDial from './components/NapDial.jsx'
import './NapTimer.scss'

const DURATION_OPTIONS = [10, 20, 30, 45, 60]
const DEFAULT_MINUTES = 20

const NOTICES = [
  '나이트 근무 전 낮잠은 30분 이내가 깨어난 뒤 개운합니다.',
  '근무 시작 직전보다는 1시간 이상 여유를 두고 자는 편이 좋아요.',
  '하루 낮잠 횟수는 개인화 설정에서 정한 값까지만 시작할 수 있어요.',
]

function formatCountdown(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const minutes = String(Math.floor(safe / 60)).padStart(2, '0')
  const seconds = String(safe % 60).padStart(2, '0')

  return `${minutes}:${seconds}`
}

function NapTimer() {
  const [activeNap, setActiveNap] = useState(null)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [selectedMinutes, setSelectedMinutes] = useState(DEFAULT_MINUTES)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [finishedMessage, setFinishedMessage] = useState('')

  // 서버가 내려준 종료 시각을 기준으로 계산해야 탭을 오래 열어둬도 어긋나지 않는다.
  const expectedEndRef = useRef(null)

  const applyActiveNap = (nap) => {
    setActiveNap(nap)

    if (!nap) {
      expectedEndRef.current = null
      setRemainingSeconds(0)
      return
    }

    expectedEndRef.current = new Date(nap.expectedEndAt).getTime()
    setRemainingSeconds(nap.remainingSeconds)
  }

  useEffect(() => {
    const controller = new AbortController()
    const options = { signal: controller.signal }

    getActiveNap(options)
      .then((data) => {
        // 진행 중인 낮잠이 없으면 { activeNap: null }, 있으면 낮잠 객체를 그대로 준다.
        applyActiveNap(data?.napId ? data : null)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setErrorMessage(error.message)
      })
      .finally(() => setIsLoading(false))

    getPersonalizationSettings(options)
      .then((data) => setSelectedMinutes(data.preferredNapMinutes ?? DEFAULT_MINUTES))
      .catch(() => {})

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!activeNap) return undefined

    const tick = () => {
      const left = Math.max(0, Math.round((expectedEndRef.current - Date.now()) / 1000))
      setRemainingSeconds(left)
    }

    tick()
    const timerId = setInterval(tick, 1000)

    return () => clearInterval(timerId)
  }, [activeNap])

  const handleStart = async () => {
    setIsSubmitting(true)
    setErrorMessage('')
    setFinishedMessage('')

    try {
      applyActiveNap(await startNap(selectedMinutes))
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinish = async (status) => {
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const result = await finishNap(activeNap.napId, status)
      applyActiveNap(null)
      setFinishedMessage(status === 'COMPLETED'
        ? `${result.actualMinutes}분 낮잠을 마쳤어요.`
        : '낮잠을 취소했어요.')
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isOver = activeNap && remainingSeconds === 0
  const elapsedRatio = activeNap
    ? 1 - remainingSeconds / (activeNap.plannedMinutes * 60)
    : 0

  return (
    <div className="nap-timer">
      <SubPageHeader title="낮잠 타이머" />

      <div className="nap-timer__card">
        <div className="nap-timer__intro">
          <h2 className="nap-timer__title">
            <IconSun size={20} />
            {activeNap ? '낮잠을 자는 중이에요' : '지금 낮잠을 잘까요?'}
          </h2>
          <p className="nap-timer__subtitle">
            {activeNap
              ? '알람이 울릴 때까지 편하게 쉬세요.'
              : '근무 전 짧은 낮잠은 야간 각성도를 올려줍니다.'}
          </p>
        </div>

        {isLoading
          ? <p className="nap-timer__loading">낮잠 상태를 확인하고 있어요.</p>
          : (
            <>
              <NapDial
                progress={elapsedRatio}
                caption={activeNap ? `${activeNap.plannedMinutes}분 낮잠` : `${selectedMinutes}분 예정`}
                value={activeNap ? formatCountdown(remainingSeconds) : `${selectedMinutes}분`}
                isDone={Boolean(isOver)}
              />

              {isOver && (
                <p className="nap-timer__done" role="status">
                  예정한 시간이 지났어요. 일어날 시간입니다.
                </p>
              )}

              {activeNap
                ? (
                  <div className="nap-timer__actions">
                    <button
                      type="button"
                      className="nap-timer__button nap-timer__button--primary"
                      onClick={() => handleFinish('COMPLETED')}
                      disabled={isSubmitting}
                    >
                      낮잠 완료
                    </button>
                    <button
                      type="button"
                      className="nap-timer__button"
                      onClick={() => handleFinish('CANCELED')}
                      disabled={isSubmitting}
                    >
                      취소하기
                    </button>
                  </div>
                )
                : (
                  <>
                    <section className="nap-timer__section">
                      <h3 className="nap-timer__section-title">낮잠 시간</h3>
                      <ul className="nap-timer__durations">
                        {DURATION_OPTIONS.map((minutes) => (
                          <li key={minutes}>
                            <button
                              type="button"
                              className={`nap-timer__duration${
                                minutes === selectedMinutes ? ' nap-timer__duration--active' : ''
                              }`}
                              onClick={() => setSelectedMinutes(minutes)}
                              aria-pressed={minutes === selectedMinutes}
                            >
                              {minutes}분
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <button
                      type="button"
                      className="nap-timer__button nap-timer__button--primary"
                      onClick={handleStart}
                      disabled={isSubmitting}
                    >
                      낮잠 시작
                    </button>
                  </>
                )}
            </>
          )}

        {finishedMessage && (
          <p className="nap-timer__notice-line" role="status">{finishedMessage}</p>
        )}
        {errorMessage && (
          <p className="nap-timer__error" role="alert">{errorMessage}</p>
        )}

        <footer className="nap-timer__notice">
          <h3>
            <IconWarningTriangle size={16} />
            낮잠 팁
          </h3>
          <ul>
            {NOTICES.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </footer>
      </div>
    </div>
  )
}

export default NapTimer
