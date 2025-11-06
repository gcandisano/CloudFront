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
  const isAuthenticated = computed(() => {
    // En desarrollo, si hay token simulado, considerar autenticado
    if (import.meta.env.DEV && token.value === 'mock-token-for-development') {
      return true
    }
    return !!token.value && !!currentUser.value
  })
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
    
    // En desarrollo, si es un token simulado, no intentar llamar al backend
    if (import.meta.env.DEV && token.value === 'mock-token-for-development') {
      // El usuario ya está establecido por simulateAuth, no hacer nada
      return
    }
    
    loading.value = true
    try {
      const user = await authService.getCurrentUser(token.value)
      currentUser.value = user
    } catch (err) {
      console.error('Error getting current user, logging out:', err)
      // En desarrollo, si falla pero hay un token simulado, no desloguear
      if (!(import.meta.env.DEV && token.value === 'mock-token-for-development')) {
        await logout()
      }
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

  const logoutWithCognito = () => {
    logout()
    
    try {
      const logoutUrl = authService.getCognitoLogoutUrl()
      window.location.href = logoutUrl
    } catch (err) {
      console.error('Error redirecting to Cognito logout:', err)
      error.value = 'Error al redirigir al logout de Cognito'
    }
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

  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    if (!token.value) {
      throw new Error('User not authenticated to change password.')
    }
    loading.value = true
    try {
      await authService.changePassword(token.value, oldPassword, newPassword)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to change password'
      throw err
    } finally {
      loading.value = false
    }
  }

  const requestPasswordReset = async (email: string): Promise<void> => {
    loading.value = true
    try {
      await authService.requestPasswordReset(email)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to request password reset'
      throw err
    } finally {
      loading.value = false
    }
  }

  const confirmPasswordReset = async (email: string, code: string, newPassword: string): Promise<void> => {
    loading.value = true
    try {
      await authService.confirmPasswordReset(email, code, newPassword)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to confirm password reset'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Función para simular autenticación en desarrollo
  const simulateAuth = (): void => {
    if (import.meta.env.DEV) {
      const mockUser: User = {
        id: 1,
        email: 'usuario@ejemplo.com',
        is_seller: true,
        is_active: true,
        firstName: 'Usuario',
        lastName: 'Ejemplo',
      }
      const mockToken = 'mock-token-for-development'
      setAuthData(mockToken, undefined, mockUser)
      console.log('✅ Usuario simulado autenticado:', mockUser)
    }
  }

  // En desarrollo, simular autenticación ANTES de inicializar si no hay token
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    if (!localStorage.getItem('token')) {
      // Simular inmediatamente antes de que el router se inicialice
      simulateAuth()
      console.log('🔧 Modo desarrollo: Autenticación simulada automáticamente')
    }
    
    // Exponer funciones globalmente
    ;(window as any).simulateAuth = simulateAuth
    ;(window as any).logoutSimulated = () => {
      logout()
      console.log('✅ Usuario simulado deslogueado')
    }
    console.log('💡 Para desloguear, ejecuta en la consola: logoutSimulated()')
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
    logoutWithCognito,
    changePassword,
    requestPasswordReset,
    confirmPasswordReset,
    getCurrentUser,
    clearError,
    setAuthData,
    simulateAuth,
  }
})
