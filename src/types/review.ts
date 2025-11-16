import type { PaginationParams } from './api'

// Review types
export interface Review {
  id: string
  rating: number
  description: string
  timestamp: string
  user: {
    id: string
    firstName: string
    lastName: string
  }
}

// Review form types
export interface CreateReviewForm {
  productId: string
  rating: number
  description: string
}

// Review response types
export interface ReviewsResponse {
  reviews: Review[]
  average_rating: number
  total_reviews: number
  pagination: PaginationParams
}
