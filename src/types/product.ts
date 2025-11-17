import type { PaginationResponse } from './api'

export interface Product {
  id: number
  name: string
  description?: string
  category: string
  price: number
  image_url?: string
  paused?: boolean
  seller_id?: number
  rating?: number
  ratingCount?: number
  is_favorite?: boolean
  store_id: number
  store_name: string
  store_image_url: string | null
}

// Product form types
export interface CreateProductForm {
  name: string
  description: string
  category: string
  price: number
  image_url?: string
}

// Product filters
export interface ProductFilters {
  search?: string
  category?: string
  sort?: string
  liked?: boolean
  page?: number
  limit?: number
  storeId?: string
}

// Product response types
export interface ProductsResponse {
  products: Product[]
  pagination: PaginationResponse
}
