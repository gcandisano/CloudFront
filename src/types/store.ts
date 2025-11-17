import type { PaginationResponse } from './api'

export interface StoreResponse {
  store_id: number
  store_name: string
  description: string | null
  store_image_url: string | null
  cover_image_url: string | null
}

export interface StoresListResponse {
  stores: StoreResponse[]
  pagination: PaginationResponse
}

