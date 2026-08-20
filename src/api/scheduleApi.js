import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from '@/lib/apiClient.js'

export function getShifts(from, to, options) {
  return apiGet('/api/v1/shifts', { from, to }, options)
}

export function addShift(shift, options) {
  return apiPost('/api/v1/shifts', shift, options)
}

export function updateShift(shiftId, shift, options) {
  return apiPatch(`/api/v1/shifts/${shiftId}`, shift, options)
}

export function deleteShift(shiftId, options) {
  return apiDelete(`/api/v1/shifts/${shiftId}`, undefined, options)
}

export function updateShiftsBulk(change, options) {
  return apiPatch('/api/v1/shifts:bulk', change, options)
}

export function createShiftsFromPattern(pattern, options) {
  return apiPost('/api/v1/shifts/pattern', pattern, options)
}

export function getShiftCompleteness(weeks = 4, options) {
  return apiGet('/api/v1/shifts/completeness', { weeks }, options)
}

export function getShiftPatterns(options) {
  return apiGet('/api/v1/shift-patterns', undefined, options)
}

export function saveShiftPattern(pattern, options) {
  return apiPost('/api/v1/shift-patterns', pattern, options)
}

export function deleteShiftPattern(patternId, options) {
  return apiDelete(`/api/v1/shift-patterns/${patternId}`, undefined, options)
}

export function uploadScheduleImage(image, month, options) {
  const formData = new FormData()
  formData.append('image', image)
  if (month) formData.append('month', month)

  return apiPost('/api/v1/ocr/jobs', formData, options)
}

export function getScheduleUpload(jobId, options) {
  return apiGet(`/api/v1/ocr/jobs/${jobId}`, undefined, options)
}

export function retryScheduleUpload(jobId, options) {
  return apiPost(`/api/v1/ocr/jobs/${jobId}:retry`, undefined, options)
}

export function getScheduleDrafts(jobId, options) {
  return getScheduleUpload(jobId, options)
}

export function correctScheduleDrafts(jobId, corrections, options) {
  return Promise.all(corrections.map(({ draftId, ...correction }) =>
    apiPatch(`/api/v1/ocr/jobs/${jobId}/drafts/${draftId}`, correction, options),
  ))
}

export function createScheduleDraft(jobId, draft, options) {
  return apiPost(`/api/v1/ocr/jobs/${jobId}/drafts`, draft, options)
}

export function confirmScheduleUpload(jobId, options) {
  return apiPost(`/api/v1/ocr/jobs/${jobId}:confirm`, undefined, options)
}
