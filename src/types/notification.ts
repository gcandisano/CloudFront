import type { PaginationParams } from './api'

// Notification types
export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}

export interface NotificationItem {
  id: number
  title?: string
  message: string
  type: string
  product_id?: number
  read: boolean
  created_at: string
}

// Notification form types
export interface CreateNotificationForm {
  title?: string
  message: string
  type?: string
  product_id?: number
}

// Notification response types
export interface NotificationsResponse {
  notifications: NotificationItem[]
  unread_count: number
  pagination: PaginationParams
}
