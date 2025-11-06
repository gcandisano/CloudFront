import type { ApiResponse, PaginationResponse } from '@/types'
import type { NotificationItem, NotificationsResponse } from '@/types/notification'
import { API_BASE_URL } from '.'
import { getAuthToken } from '@/utils/cognito'

async function getNotifications(page: number = 1, limit: number = 20, unreadOnly: boolean = false): Promise<ApiResponse<NotificationsResponse>> {
  try {
    const token = getAuthToken()
    if (!token) {
      // Datos hardcodeados
      return {
        data: {
          notifications: [],
          unread_count: 0,
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        },
        success: true,
      }
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    if (unreadOnly) {
      queryParams.append('unread', 'true')
    }

    const response = await fetch(`${API_BASE_URL}/api/notifications?${queryParams.toString()}`, {
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
      data: {
        notifications: data.notifications || [],
        unread_count: data.unread_count || 0,
        pagination: data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      },
      success: true,
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    // Datos hardcodeados cuando no hay backend
    const mockNotifications: NotificationItem[] = [
      {
        id: 1,
        title: 'Nueva venta',
        message: 'Has recibido una nueva orden de compra #1',
        type: 'SALE',
        product_id: 1,
        read: false,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        title: 'Producto actualizado',
        message: 'Tu producto "iPhone 15 Pro" ha recibido una nueva reseña',
        type: 'REVIEW',
        product_id: 1,
        read: false,
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        title: 'Compra completada',
        message: 'Tu compra #2 ha sido enviada',
        type: 'PURCHASE',
        read: true,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
    
    const filteredNotifications = unreadOnly 
      ? mockNotifications.filter(n => !n.read)
      : mockNotifications
    
    return {
      data: {
        notifications: filteredNotifications,
        unread_count: mockNotifications.filter(n => !n.read).length,
        pagination: {
          page: 1,
          limit: 20,
          total: filteredNotifications.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      },
      success: true,
      message: 'Datos hardcodeados (backend no disponible)',
    }
  }
}

async function markAsRead(id: number): Promise<ApiResponse<void>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: null,
        success: false,
        message: 'No autenticado',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
      method: 'PATCH',
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
      message: 'Notificación marcada como leída',
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return {
      data: null,
      success: false,
      message: 'Error marcando notificación',
      error: error as string,
    }
  }
}

async function markAllAsRead(): Promise<ApiResponse<void>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: null,
        success: false,
        message: 'No autenticado',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
      method: 'PATCH',
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
      message: 'Todas las notificaciones marcadas como leídas',
    }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return {
      data: null,
      success: false,
      message: 'Error marcando notificaciones',
      error: error as string,
    }
  }
}

async function getNotification(id: number): Promise<ApiResponse<NotificationItem>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: null,
        success: false,
        message: 'No autenticado',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
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
      data: data.notification || data,
      success: true,
    }
  } catch (error) {
    console.error('Error fetching notification:', error)
    return {
      data: null,
      success: false,
      message: 'Error obteniendo notificación',
      error: error as string,
    }
  }
}

export const notificationService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getNotification,
}

