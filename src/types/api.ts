// API and common types
export interface ApiResponse<T> {
  data: T | null
  message?: string
  error?: string
  success: boolean
}

export interface PaginationResponse {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

