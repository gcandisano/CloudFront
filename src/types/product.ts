import type { PaginationResponse } from './api'
import type { User } from './user'

export interface Store {
  storeId: string
  storeName?: string
  description?: string
  coverImageId?: string
  storeImageId?: string
  user: User
}

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
  storeId?: string
}

// Product response types
export interface ProductsResponse {
  products: Product[]
  pagination: PaginationResponse
}
