import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AuthState } from '@/types'

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => !!token.value && !!currentUser.value)

  // Métodos
  const login = async (email: string, password: string): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Credenciales inválidas')
      }

      const data = await response.json()
      token.value = data.token
      currentUser.value = data.user

      // Guardar token en localStorage
      localStorage.setItem('token', data.token)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error de autenticación'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error en el registro')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error en el registro'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = (): void => {
    currentUser.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  const getCurrentUser = async (): Promise<void> => {
    if (!token.value) return

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const user: User = await response.json()
        currentUser.value = user
      } else {
        // Token inválido, limpiar estado
        logout()
      }
    } catch (err) {
      console.error('Error obteniendo usuario actual:', err)
      logout()
    }
  }

  const clearError = (): void => {
    error.value = null
  }

  // Inicializar usuario si hay token
  if (token.value) {
    getCurrentUser()
  }

  return {
    // Estado
    currentUser,
    token,
    loading,
    error,

    // Computed
    isAuthenticated,

    // Métodos
    login,
    register,
    logout,
    getCurrentUser,
    clearError,
  }
})
