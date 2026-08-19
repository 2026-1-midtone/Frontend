import { IconUpload } from '../../../components/common/icons/index.jsx'
import './ScheduleUploadCard.scss'

/**
 * 근무표 이미지 업로드 카드.
 *
 * `previewSrc`가 없으면 빈 업로드 상태, 있으면 업로드된 이미지 위에
 * 재업로드 버튼을 겹쳐 보여준다.
 *
 * @param {string|null} previewSrc
 * @param {boolean} isUploading 업로드·OCR 처리 중이면 true
 * @param {() => void} onUpload
 */
function ScheduleUploadCard({ previewSrc, isUploading = false, onUpload }) {
  const isUploaded = Boolean(previewSrc)

  return (
    <section className="schedule-upload">
      <div className="schedule-upload__heading">
        <h2 className="schedule-upload__title">근무표 업로드</h2>
        <p className="schedule-upload__description">
          사진 또는 캡처 이미지를 업로드하면 날짜·근무 유형을 자동으로 인식합니다
        </p>
      </div>

      <button
        type="button"
        className={
          isUploaded
            ? 'schedule-upload__dropzone has-preview'
            : 'schedule-upload__dropzone'
        }
        onClick={onUpload}
        disabled={isUploading}
        style={
          isUploaded ? { backgroundImage: `url(${previewSrc})` } : undefined
        }
      >
        <span className="schedule-upload__icon">
          <IconUpload size={26} />
        </span>
        <span className="schedule-upload__label">
          {isUploading ? '인식 중...' : '이미지 업로드'}
        </span>
        <span className="schedule-upload__caption">Png, Jpg 업로드가능</span>
      </button>
    </section>
  )
}

export default ScheduleUploadCard
