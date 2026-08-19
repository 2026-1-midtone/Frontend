import { apiGet } from '@/lib/apiClient.js'

export function getHomeDashboard(options) {
  return apiGet('/api/v1/home/dashboard', undefined, options)
}
