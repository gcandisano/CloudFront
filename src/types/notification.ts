// Notification types
export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}
