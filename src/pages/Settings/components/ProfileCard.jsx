import { useEffect, useState } from 'react'
import { IconCamera } from '../../../components/common/icons/index.jsx'
import './ProfileCard.scss'

/**
 * 프로필 카드. "수정하기"를 누르면 이름을 편집할 수 있는 모드로 전환된다.
 *
 * 실제 사진 업로드·저장은 아직 없다 — 편집 모드에서는 카메라 아이콘과
 * 입력 필드만 보여주고, "수정완료"를 누르면 편집을 종료한다.
 *
 * @param {string} avatarSrc
 * @param {string} name
 * @param {string} nameSuffix 이름 뒤에 붙는 호칭 (예: "(님)")
 * @param {string} email
 * @param {string} joinedAt 가입일 (있으면 이메일 아래에 표시, 계정 설정 화면용)
 * @param {boolean} readOnly true면 편집 진입점을 아예 숨긴다 (계정 설정 화면용)
 */
function ProfileCard({
  avatarSrc,
  name: initialName,
  nameSuffix,
  email,
  joinedAt,
  readOnly = false,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(initialName)

  useEffect(() => {
    setName(initialName)
  }, [initialName])

  const handleEdit = async () => {
    if (isEditing) await onSave?.(name)
    setIsEditing((prev) => !prev)
  }

  return (
    <div className="profile-card">
      <div className="profile-card__avatar-wrap">
        <img className="profile-card__avatar" src={avatarSrc} alt="" />
        {isEditing && (
          <span className="profile-card__avatar-edit" aria-hidden="true">
            <IconCamera size={20} />
          </span>
        )}
      </div>

      <div className="profile-card__info">
        {isEditing ? (
          <input
            type="text"
            className="profile-card__name-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-label="이름"
          />
        ) : (
          <p className="profile-card__name">
            {name}
            {nameSuffix && <span className="profile-card__name-suffix"> {nameSuffix}</span>}
          </p>
        )}
        <p className="profile-card__email">{email}</p>
        {joinedAt && <p className="profile-card__joined">{joinedAt}부터 함께하는중</p>}
      </div>

      {!readOnly && (
        <button
          type="button"
          className={
            isEditing
              ? 'profile-card__edit-button is-editing'
              : 'profile-card__edit-button'
          }
          onClick={handleEdit}
        >
          {isEditing ? '수정완료' : '수정하기'}
        </button>
      )}
    </div>
  )
}

export default ProfileCard
