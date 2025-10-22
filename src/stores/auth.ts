import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => !!token.value && !!currentUser.value)
  const isSeller = computed(() => currentUser.value?.is_seller || false)
  const isActive = computed(() => currentUser.value?.is_active || false)

  // Métodos
  const initializeAuth = async (): Promise<void> => {
    // Check if there are tokens in the URL (after Cognito callback)
    const tokensFromUrl = authService.parseTokensFromUrl()

    if (tokensFromUrl) {
      // Store tokens from URL
      setAuthData(tokensFromUrl.accessToken, tokensFromUrl.refreshToken)

      // Clear tokens from URL
      authService.clearTokensFromUrl()

      // Fetch user data
      await getCurrentUser()
    } else if (token.value) {
      await getCurrentUser()
    }
  }

  const loginWithCognito = (): void => {
    try {
      const loginUrl = authService.getCognitoLoginUrl()
      window.location.href = loginUrl
    } catch (err) {
      console.error('Error redirecting to Cognito:', err)
      error.value = 'Error de configuración de Cognito'
    }
  }

  const getCurrentUser = async (): Promise<void> => {
    if (!token.value) return
    loading.value = true
    try {
      const user = await authService.getCurrentUser(token.value)
      currentUser.value = user
    } catch (err) {
      console.error('Error getting current user, logging out:', err)
      await logout()
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    currentUser.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  const clearError = (): void => {
    error.value = null
  }

  // Set token and user (for Cognito authentication flow)
  const setAuthData = (accessToken: string, refreshToken?: string, user?: User): void => {
    token.value = accessToken
    localStorage.setItem('token', accessToken)

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken)
    }

    if (user) {
      currentUser.value = user
    }
  }

  // Inicializar autenticación
  initializeAuth()

  return {
    // Estado
    currentUser,
    token,
    loading,
    error,

    // Computed
    isAuthenticated,
    isSeller,
    isActive,

    // Métodos
    initializeAuth,
    loginWithCognito,
    logout,
    getCurrentUser,
    clearError,
    setAuthData,
  }
})
