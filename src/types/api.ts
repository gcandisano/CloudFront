// API and common types
export interface ApiResponse<T> {
  data: T | null
  message?: string
  error?: string
  success: boolean
}

export interface PaginationParams {
  page: number
  size: number
}

export interface PaginationResponse {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Image types
export interface Image {
  id: number
  image: string
}

export interface UploadedImage {
  id: number
  key: string
  url: string
  size: number
  mimetype: string
}

// Product Like types
export interface ProductLike {
  product_id: number
  user_id: number
  name: string
  description?: string
  price: number
  category: string
  first_name: string
  last_name: string
}

export interface ProductLikesResponse {
  liked_products: ProductLike[]
  pagination: PaginationResponse
}

export interface LikeCountResponse {
  likes_count: number
}
