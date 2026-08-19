import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getScheduleDrafts,
  getScheduleUpload,
  uploadScheduleImage,
} from '@/api/scheduleApi.js'
import PageHeader from '../../components/common/PageHeader.jsx'
import routineHero from '../../assets/routine-summary/routine-hero.png'
import { PATH } from '../../routes/paths.js'
import ScheduleStats from './components/ScheduleStats.jsx'
import ScheduleUploadCard from './components/ScheduleUploadCard.jsx'
import ScheduleWarningBanner from './components/ScheduleWarningBanner.jsx'
import './Schedule.scss'

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png'])

function getUploadErrorMessage(error) {
  if (error.status === 401) {
    return '로그인이 만료되었습니다. 다시 로그인한 뒤 업로드해 주세요.'
  }

  if (error.status === 404) {
    return '근무표 업로드 API 또는 OCR 리소스를 찾지 못했습니다. 백엔드 배포 상태를 확인해 주세요.'
  }

  if (error.status === 413) {
    return '이미지는 10MB 이하만 업로드할 수 있습니다.'
  }

  if (error.status >= 500) {
    return '근무표 인식 서버에 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.'
  }

  return error.message ?? '근무표를 업로드하지 못했습니다.'
}

function Schedule() {
  const navigate = useNavigate()
  const [previewSrc, setPreviewSrc] = useState(null)
  const [uploadId, setUploadId] = useState(null)
  const [pollingIntervalMs, setPollingIntervalMs] = useState(1000)
  const [stats, setStats] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!uploadId || !isUploading) return undefined

    let cancelled = false
    let timeoutId = null

    const scheduleNextPoll = () => {
      if (cancelled) return

      timeoutId = window.setTimeout(poll, pollingIntervalMs)
    }

    const poll = async () => {
      try {
        const status = await getScheduleUpload(uploadId)

        if (cancelled) return

        if (status.status === 'FAILED') {
          setErrorMessage(status.failReason ?? '근무표를 인식하지 못했습니다.')
          setIsUploading(false)
          return
        }

        if (status.status !== 'PROCESSING') {
          const draftData = await getScheduleDrafts(uploadId)
          if (cancelled) return

          setStats({
            confirmed: draftData.progress.resolvedDays,
            needsReview: draftData.progress.remainingDays,
            total: draftData.progress.requiredDays,
          })
          setIsUploading(false)
          return
        }

        scheduleNextPoll()
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(getUploadErrorMessage(error))
          setIsUploading(false)
        }
      }
    }

    poll()

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [isUploading, pollingIntervalMs, uploadId])

  const handleUpload = async (file) => {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setErrorMessage('PNG 또는 JPG 이미지만 업로드할 수 있습니다.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('이미지는 10MB 이하만 업로드할 수 있습니다.')
      return
    }

    if (previewSrc?.startsWith('blob:')) URL.revokeObjectURL(previewSrc)

    setPreviewSrc(URL.createObjectURL(file))
    setErrorMessage('')
    setStats(null)
    setIsUploading(true)

    try {
      const upload = await uploadScheduleImage(file)
      sessionStorage.setItem('shiftmate.scheduleUploadId', String(upload.uploadId))
      setPollingIntervalMs(Math.min(
        Math.max(Number(upload.pollingIntervalMs) || 1000, 500),
        5000,
      ))
      setUploadId(upload.uploadId)
    } catch (error) {
      setErrorMessage(getUploadErrorMessage(error))
      setIsUploading(false)
    }
  }

  // 업로드가 끝나면 두 버튼 모두 캘린더 화면으로 이동한다.
  // 세부 수정은 캘린더 화면의 "수정하러 가기"에서 이어서 진행한다.
  const handleGoToCalendar = () => {
    navigate(stats?.needsReview > 0 ? PATH.SCHEDULE_RESULT : PATH.SCHEDULE_CALENDAR, {
      state: { uploadId },
    })
  }

  const isUploaded = Boolean(previewSrc && stats)

  return (
    <div className="schedule">
      <img className="schedule__hero" src={routineHero} alt="" aria-hidden="true" />
      <div className="schedule__hero-shade" aria-hidden="true" />

      <PageHeader
        title="근무표 관리"
        subtitle="오늘 근무도 시프트메이트가 챙겨드릴게요!"
        onSettingsClick={() => navigate(PATH.SETTINGS)}
      />

      <div className="schedule__card">
        <ScheduleUploadCard
          previewSrc={previewSrc}
          onUpload={handleUpload}
          loading={isUploading}
        />

        {errorMessage && (
          <p className="schedule__error" role="alert" aria-live="polite">
            {errorMessage}
          </p>
        )}

        {isUploaded && (
          <>
            <ScheduleStats
              stats={stats}
              caption="최소 4주(28일) 일정 기준 · 보정 항목을 먼저 확인해 주세요"
            />

            {stats.needsReview > 0 && (
              <ScheduleWarningBanner
                title="인식이 어려운 날짜가 있어요"
                description="직접 근무유형을 선택해 수정해주세요"
              />
            )}

            <div className="schedule__actions">
              <button
                type="button"
                className="schedule__action schedule__action--primary"
                onClick={handleGoToCalendar}
              >
                수정하러 가기
              </button>
              <button
                type="button"
                className="schedule__action"
                onClick={handleGoToCalendar}
                disabled={stats.needsReview > 0}
              >
                완료
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Schedule
