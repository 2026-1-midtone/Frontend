import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader.jsx'
import AiAssistantBubble from '../../components/common/AiAssistantBubble.jsx' // AI 비서 컴포넌트 추가
import routineHero from '../../assets/routine-summary/routine-hero.png'
import { ApiError } from '../../lib/apiClient.js'
import { getUploadStatus, uploadScheduleImage } from '../../lib/ocrApi.js'
import { PATH } from '../../routes/paths.js'
import ScheduleUploadCard from './components/ScheduleUploadCard.jsx'
import './Schedule.scss'

const POLL_INTERVAL_FALLBACK_MS = 1500
const MAX_POLL_ATTEMPTS = 30

// OCR 처리가 끝날 때까지 pollingIntervalMs 간격으로 상태를 확인한다.
async function pollUntilDone(uploadId, intervalMs) {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
    const status = await getUploadStatus(uploadId)
    if (status.status !== 'PROCESSING') return status
  }
  throw new Error('근무표 인식이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.')
}

function Schedule() {
  const navigate = useNavigate()
  const [previewSrc, setPreviewSrc] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef(null)

  const handlePickImage = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setErrorMessage('')
    setIsUploading(true)
    setPreviewSrc(URL.createObjectURL(file))

    try {
      const { uploadId, pollingIntervalMs } = await uploadScheduleImage(file)
      const status = await pollUntilDone(uploadId, pollingIntervalMs || POLL_INTERVAL_FALLBACK_MS)

      if (status.status === 'FAILED') {
        setErrorMessage(status.failReason || '근무표를 인식하지 못했습니다. 다른 이미지를 업로드해 주세요.')
        return
      }

      navigate(PATH.SCHEDULE_RESULT, { state: { uploadId } })
    } catch (error) {
      setErrorMessage(error instanceof ApiError || error instanceof Error ? error.message : '업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

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
          isUploading={isUploading}
          onUpload={handlePickImage}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="visually-hidden"
          onChange={handleFileChange}
        />

        {errorMessage && <p className="schedule__error">{errorMessage}</p>}
      </div>

      <AiAssistantBubble onOpen={() => navigate(PATH.ASSISTANT)} />
    </div>
  )
}

export default Schedule
