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

export function uploadScheduleImage(image, options) {
  const formData = new FormData()
  formData.append('image', image)

  return apiPost('/api/v1/schedule-uploads', formData, options)
}

export function getScheduleUpload(uploadId, options) {
  return apiGet(`/api/v1/schedule-uploads/${uploadId}`, undefined, options)
}

export function retryScheduleUpload(uploadId, options) {
  return apiPost(`/api/v1/schedule-uploads/${uploadId}/retry`, undefined, options)
}

export function getScheduleDrafts(uploadId, options) {
  return apiGet(`/api/v1/schedule-uploads/${uploadId}/drafts`, undefined, options)
}

export function correctScheduleDrafts(uploadId, corrections, options) {
  return apiPatch(`/api/v1/schedule-uploads/${uploadId}/drafts`, { corrections }, options)
}

export function confirmScheduleUpload(uploadId, overwriteExisting = false, options) {
  return apiPost(
    `/api/v1/schedule-uploads/${uploadId}/confirm`,
    { overwriteExisting },
    options,
  )
}
