import type { ApiResponse } from '@/types'
import { API_BASE_URL } from '.'
import { getAuthToken } from '@/utils/cognito'

export interface Store {
  storeId: string
  storeName?: string
  description?: string
  coverImageId?: number
  storeImageId?: number
  cbu?: string
  user?: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
}

export interface UpdateStoreForm {
  storeName?: string
  description?: string
  cbu?: string
  coverImage?: File
  storeImage?: File
}

async function getStore(storeId?: string): Promise<ApiResponse<Store>> {
  try {
    const token = getAuthToken()
    if (!token) {
      // Datos hardcodeados
      return {
        data: {
          storeId: storeId || '1',
          storeName: 'Mi Tienda',
          description: 'Descripción de la tienda',
          cbu: '1234567890123456789012',
        },
        success: true,
      }
    }

    const endpoint = storeId ? `/api/stores/${storeId}` : '/api/stores/me'
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
      data: data.store || data,
      success: true,
    }
  } catch (error) {
    console.error('Error fetching store:', error)
    // Datos hardcodeados cuando no hay backend
    return {
      data: {
        storeId: storeId || '1',
        storeName: 'TechStore - Electrónica Premium',
        description: 'Tu tienda de confianza para los últimos dispositivos tecnológicos. Ofrecemos productos de alta calidad con garantía y soporte técnico.',
        cbu: '1234567890123456789012',
        user: {
          id: 1,
          firstName: 'Usuario',
          lastName: 'Ejemplo',
          email: 'usuario@ejemplo.com',
        },
      },
      success: true,
      message: 'Datos hardcodeados (backend no disponible)',
    }
  }
}

async function updateStore(form: UpdateStoreForm): Promise<ApiResponse<Store>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: null,
        success: false,
        message: 'No autenticado',
      }
    }

    const formData = new FormData()
    if (form.storeName) formData.append('storeName', form.storeName)
    if (form.description) formData.append('description', form.description)
    if (form.cbu) formData.append('cbu', form.cbu)
    if (form.coverImage) formData.append('coverImage', form.coverImage)
    if (form.storeImage) formData.append('storeImage', form.storeImage)

    const response = await fetch(`${API_BASE_URL}/api/stores/me`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      data: data.store || data,
      success: true,
      message: 'Tienda actualizada correctamente',
    }
  } catch (error) {
    console.error('Error updating store:', error)
    return {
      data: null,
      success: false,
      message: 'Error actualizando tienda',
      error: error as string,
    }
  }
}

export const storeService = {
  getStore,
  updateStore,
}
