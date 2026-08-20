import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  confirmScheduleUpload,
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
const OCR_JOB_STORAGE_KEY = 'shiftmate.ocrJobId'
const OCR_PENDING_STATUSES = new Set(['PENDING', 'PROCESSING'])
const OCR_REVIEW_CONFIDENCE = 0.8

function getCurrentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function getDraftStats(drafts = []) {
  const needsReview = drafts.filter((draft) =>
    draft.excluded
    || draft.confidence === null
    || Number(draft.confidence) < OCR_REVIEW_CONFIDENCE,
  ).length

  return {
    confirmed: drafts.length - needsReview,
    needsReview,
    total: drafts.length,
  }
}

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
  const [targetMonth, setTargetMonth] = useState(getCurrentMonth)
  const [jobId, setJobId] = useState(null)
  const [stats, setStats] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!jobId || !isUploading) return undefined

    let cancelled = false
    let timeoutId = null

    const scheduleNextPoll = () => {
      if (cancelled) return

      timeoutId = window.setTimeout(poll, 1000)
    }

    const poll = async () => {
      try {
        const job = await getScheduleUpload(jobId)

        if (cancelled) return

        if (job.status === 'FAILED') {
          setErrorMessage(job.errorMessage ?? '근무표를 인식하지 못했습니다.')
          setIsUploading(false)
          return
        }

        if (job.status === 'COMPLETED') {
          if (!job.drafts?.length) {
            setErrorMessage('인식된 근무 일정이 없습니다. 다른 이미지를 사용해 주세요.')
            setIsUploading(false)
            return
          }

          setStats(getDraftStats(job.drafts))
          setIsUploading(false)
          return
        }

        if (OCR_PENDING_STATUSES.has(job.status)) {
          scheduleNextPoll()
          return
        }

        setErrorMessage('근무표 처리 상태를 확인할 수 없습니다. 다시 업로드해 주세요.')
        setIsUploading(false)
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
  }, [isUploading, jobId])

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
    sessionStorage.removeItem('shiftmate.scheduleUploadId')
    sessionStorage.removeItem(OCR_JOB_STORAGE_KEY)

    try {
      const upload = await uploadScheduleImage(file, targetMonth)
      sessionStorage.setItem(OCR_JOB_STORAGE_KEY, String(upload.jobId))
      setJobId(upload.jobId)
    } catch (error) {
      setErrorMessage(getUploadErrorMessage(error))
      setIsUploading(false)
    }
  }

  const handleGoToResult = () => {
    navigate(PATH.SCHEDULE_RESULT, {
      state: { jobId },
    })
  }

  const handleConfirm = async () => {
    if (!jobId || stats?.needsReview > 0) return

    setErrorMessage('')
    setIsConfirming(true)

    try {
      await confirmScheduleUpload(jobId)
      sessionStorage.removeItem(OCR_JOB_STORAGE_KEY)
      navigate(PATH.SCHEDULE_CALENDAR)
    } catch (error) {
      setErrorMessage(getUploadErrorMessage(error))
      setIsConfirming(false)
    }
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
          targetMonth={targetMonth}
          onTargetMonthChange={setTargetMonth}
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
                onClick={handleGoToResult}
              >
                수정하러 가기
              </button>
              <button
                type="button"
                className="schedule__action"
                onClick={handleConfirm}
                disabled={stats.needsReview > 0 || isConfirming}
              >
                {isConfirming ? '저장 중' : '완료'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Schedule
