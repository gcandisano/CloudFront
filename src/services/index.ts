import { useAuthStore } from '@/stores/auth'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

/**
 * Get headers for authenticated requests
 * This function lazily accesses the auth store, so it can be called from service functions
 * without causing Pinia initialization errors
 */
export function getAuthHeaders(): HeadersInit {
  const authStore = useAuthStore()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (authStore.accessToken) {
    headers.Authorization = `Bearer ${authStore.accessToken}`
  }

  return headers
}
