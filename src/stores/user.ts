import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { userService } from '@/services/userService'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', () => {
  // User state
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const isSeller = computed(() => {
    return user.value?.is_seller ?? false
  })

  const hasStore = computed(() => {
    return !!user.value?.store
  })

  // Methods
  const fetchCurrentUser = async (): Promise<void> => {
    const authStore = useAuthStore()

    if (!authStore.accessToken) {
      error.value = 'No access token available'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await userService.getCurrentUser(authStore.accessToken)

      if (response.success && response.data) {
        user.value = response.data
      } else {
        error.value = response.message || 'Failed to fetch user information'
        user.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred'
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  const clearUser = (): void => {
    user.value = null
    error.value = null
    isLoading.value = false
  }

  const setUser = (userData: User): void => {
    user.value = userData
    error.value = null
  }

  return {
    // State
    user,
    isLoading,
    error,

    // Computed
    isSeller,
    hasStore,

    // Methods
    fetchCurrentUser,
    clearUser,
    setUser,
  }
})

