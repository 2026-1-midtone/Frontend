import './ScheduleResultThumbnail.scss'

/**
 * 업로드 이미지 썸네일 + 재처리/재업로드 액션.
 * @param {string} src
 * @param {() => void} onReprocess "같은 이미지 재처리"
 * @param {() => void} onReupload "다른 이미지 업로드"
 */
function ScheduleResultThumbnail({ src, onReprocess, onReupload }) {
  return (
    <div className="schedule-thumbnail">
      <img className="schedule-thumbnail__image" src={src} alt="업로드된 근무표" />

      <div className="schedule-thumbnail__actions">
        <button
          type="button"
          className="schedule-thumbnail__action"
          onClick={onReprocess}
        >
          같은 이미지 재처리
        </button>
        <button
          type="button"
          className="schedule-thumbnail__action"
          onClick={onReupload}
        >
          다른 이미지 업로드
        </button>
      </div>
    </div>
  )
}

export default ScheduleResultThumbnail
