import { apiGet, apiPatch, apiPost } from './apiClient.js'

/** @param {File} image */
export function uploadScheduleImage(image) {
  const formData = new FormData()
  formData.append('image', image)
  return apiPost('/api/v1/schedule-uploads', formData, { auth: true, isFormData: true })
}

/** @param {number} uploadId */
export function getUploadStatus(uploadId) {
  return apiGet(`/api/v1/schedule-uploads/${uploadId}`, { auth: true })
}

/** @param {number} uploadId */
export function getUploadDrafts(uploadId) {
  return apiGet(`/api/v1/schedule-uploads/${uploadId}/drafts`, { auth: true })
}

/**
 * @param {number} uploadId
 * @param {{ draftId: number, shiftType: string }[]} corrections
 */
export function correctUploadDrafts(uploadId, corrections) {
  return apiPatch(`/api/v1/schedule-uploads/${uploadId}/drafts`, { corrections }, { auth: true })
}

/** @param {number} uploadId */
export function retryUpload(uploadId) {
  return apiPost(`/api/v1/schedule-uploads/${uploadId}/retry`, undefined, { auth: true })
}

/**
 * @param {number} uploadId
 * @param {boolean} [overwriteExisting]
 */
export function confirmUpload(uploadId, overwriteExisting = false) {
  return apiPost(`/api/v1/schedule-uploads/${uploadId}/confirm`, { overwriteExisting }, { auth: true })
}
