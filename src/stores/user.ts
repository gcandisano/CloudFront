import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { userService } from '@/services/userService'
import { useAuthStore } from './auth'

const USER_CACHE_KEY = 'user_data'
const USER_CACHE_TIMESTAMP_KEY = 'user_data_timestamp'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export const useUserStore = defineStore('user', () => {
  // User state
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const isSeller = computed(() => {
    return user.value?.is_seller ?? false
  })

  /* const hasStore = computed(() => {
    return !!user.value?.store
  }) */

  // Cache management
  const saveUserToCache = (userData: User): void => {
    try {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(userData))
      localStorage.setItem(USER_CACHE_TIMESTAMP_KEY, Date.now().toString())
    } catch (err) {
      console.warn('Failed to save user data to cache:', err)
    }
  }

  const loadUserFromCache = (): User | null => {
    try {
      const cachedData = localStorage.getItem(USER_CACHE_KEY)
      const cachedTimestamp = localStorage.getItem(USER_CACHE_TIMESTAMP_KEY)

      if (!cachedData || !cachedTimestamp) {
        return null
      }

      const timestamp = parseInt(cachedTimestamp, 10)
      const now = Date.now()

      // Check if cache is expired
      if (now - timestamp > CACHE_DURATION) {
        // Cache expired, but return it anyway for instant display
        // We'll refresh in the background
        return JSON.parse(cachedData) as User
      }

      return JSON.parse(cachedData) as User
    } catch (err) {
      console.warn('Failed to load user data from cache:', err)
      return null
    }
  }

  const clearUserCache = (): void => {
    try {
      localStorage.removeItem(USER_CACHE_KEY)
      localStorage.removeItem(USER_CACHE_TIMESTAMP_KEY)
    } catch (err) {
      console.warn('Failed to clear user cache:', err)
    }
  }

  // Methods
  const fetchCurrentUser = async (forceRefresh = false): Promise<void> => {
    const authStore = useAuthStore()

    if (!authStore.idToken) {
      error.value = 'No access token available'
      return
    }

    // If not forcing refresh and we have cached data, use it immediately
    if (!forceRefresh && !user.value) {
      const cachedUser = loadUserFromCache()
      if (cachedUser) {
        user.value = cachedUser
      }
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await userService.getCurrentUser(authStore.idToken)

      if (response.success && response.data) {
        user.value = response.data
        saveUserToCache(response.data)
      } else {
        error.value = response.message || 'Failed to fetch user information'
        // Don't clear user if we have cached data and this is a background refresh
        if (forceRefresh || !user.value) {
          user.value = null
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      // Don't clear user if we have cached data and this is a background refresh
      if (forceRefresh || !user.value) {
        user.value = null
      }
    } finally {
      isLoading.value = false
    }
  }

  const clearUser = (): void => {
    user.value = null
    error.value = null
    isLoading.value = false
    clearUserCache()
  }

  const setUser = (userData: User): void => {
    user.value = userData
    error.value = null
    saveUserToCache(userData)
  }

  const initializeUser = async (): Promise<void> => {
    const authStore = useAuthStore()

    // Only initialize if authenticated and user data is not already loaded
    if (!authStore.isAuthenticated || user.value || isLoading.value) {
      return
    }

    // Try to load from cache first for instant display
    const cachedUser = loadUserFromCache()
    if (cachedUser) {
      user.value = cachedUser
    }

    // Always fetch fresh data in the background (will update cache)
    // This ensures we have the latest data even if cache exists
    await fetchCurrentUser(false)
  }

  return {
    // State
    user,
    isLoading,
    error,

    // Computed
    isSeller,
    /* hasStore, */

    // Methods
    fetchCurrentUser,
    clearUser,
    setUser,
    initializeUser,
  }
})
