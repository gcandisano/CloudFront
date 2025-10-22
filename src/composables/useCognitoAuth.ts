import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { validateCognitoConfig, getCognitoUrls } from '@/utils/cognito'

export function useCognitoAuth() {
  const authStore = useAuthStore()
  const isInitializing = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const currentUser = computed(() => authStore.currentUser)
  const isSeller = computed(() => authStore.isSeller)
  const isActive = computed(() => authStore.isActive)

  // Initialize authentication on app startup
  const initializeAuth = async () => {
    try {
      isInitializing.value = true
      error.value = null

      await authStore.initializeAuth()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error initializing authentication'
      console.error('Auth initialization error:', err)
    } finally {
      isInitializing.value = false
    }
  }

  // Login with Cognito
  const login = () => {
    try {
      error.value = null

      if (!validateCognitoConfig()) {
        throw new Error('Cognito configuration is missing or invalid')
      }

      const { loginUrl } = getCognitoUrls()
      window.location.href = loginUrl
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error redirecting to login'
      console.error('Login error:', err)
    }
  }

  // Logout with Cognito
  const logout = async () => {
    try {
      error.value = null
      await authStore.logoutWithCognito()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error during logout'
      console.error('Logout error:', err)
    }
  }

  // Change password
  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      error.value = null
      await authStore.changePassword(oldPassword, newPassword)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error changing password'
      throw err
    }
  }

  // Request password reset
  const requestPasswordReset = async (email: string) => {
    try {
      error.value = null
      await authStore.requestPasswordReset(email)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error requesting password reset'
      throw err
    }
  }

  // Confirm password reset
  const confirmPasswordReset = async (email: string, code: string, newPassword: string) => {
    try {
      error.value = null
      await authStore.confirmPasswordReset(email, code, newPassword)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error confirming password reset'
      throw err
    }
  }

  // Clear error
  const clearError = () => {
    error.value = null
    authStore.clearError()
  }

  return {
    // State
    isInitializing,
    error,

    // Computed
    isAuthenticated,
    currentUser,
    isSeller,
    isActive,

    // Methods
    initializeAuth,
    login,
    logout,
    changePassword,
    requestPasswordReset,
    confirmPasswordReset,
    clearError,
  }
}
