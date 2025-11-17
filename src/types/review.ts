import type { PaginationResponse } from './api'

// Review types - matches API response schema
export interface Review {
  id: number
  rating: number
  description: string | null
  timestamp: string
  given_name: string | null
  family_name: string | null
}

// Review query parameters
export interface ReviewsQuery {
  page?: string | number
  limit?: string | number
  product_id: string | number
}

// Review form types
export interface CreateReviewForm {
  productId: string
  rating: number
  description?: string
}

// Review response types - matches paginated reviews response schema
export interface PaginatedReviewsResponse {
  reviews: Review[]
  pagination: PaginationResponse
}
