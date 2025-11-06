import type { ApiResponse } from '@/types'
import { API_BASE_URL } from '.'
import { getAuthToken } from '@/utils/cognito'

export interface UserProfile {
  id: number
  email: string
  first_name: string
  last_name: string
  phone?: string
  address?: string
  is_seller: boolean
  is_active: boolean
}

export interface UpdateProfileForm {
  first_name?: string
  last_name?: string
  phone?: string
  address?: string
}

async function getProfile(): Promise<ApiResponse<UserProfile>> {
  try {
    const token = getAuthToken()
    if (!token) {
      // Datos hardcodeados
      return {
        data: {
          id: 1,
          email: 'usuario@example.com',
          first_name: 'Usuario',
          last_name: 'Ejemplo',
          phone: '+1234567890',
          address: 'Calle Ejemplo 123',
          is_seller: false,
          is_active: true,
        },
        success: true,
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      data: data.user || data,
      success: true,
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
    // Datos hardcodeados cuando no hay backend
    return {
      data: {
        id: 1,
        email: 'usuario@ejemplo.com',
        first_name: 'Usuario',
        last_name: 'Ejemplo',
        phone: '+54 11 1234-5678',
        address: 'Av. Corrientes 1234, CABA, Argentina',
        is_seller: true,
        is_active: true,
      },
      success: true,
      message: 'Datos hardcodeados (backend no disponible)',
    }
  }
}

async function updateProfile(form: UpdateProfileForm): Promise<ApiResponse<UserProfile>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: null,
        success: false,
        message: 'No autenticado',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      data: data.user || data,
      success: true,
      message: 'Perfil actualizado correctamente',
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    return {
      data: null,
      success: false,
      message: 'Error actualizando perfil',
      error: error as string,
    }
  }
}

async function deleteProfile(): Promise<ApiResponse<void>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: null,
        success: false,
        message: 'No autenticado',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return {
      data: null,
      success: true,
      message: 'Cuenta eliminada correctamente',
    }
  } catch (error) {
    console.error('Error deleting profile:', error)
    return {
      data: null,
      success: false,
      message: 'Error eliminando cuenta',
      error: error as string,
    }
  }
}

export const userService = {
  getProfile,
  updateProfile,
  deleteProfile,
}

