import type {
  ApiResponse,
  PaginatedReviewsResponse,
  ReviewsQuery,
  CreateReviewForm,
  Review,
} from '@/types'
import { API_BASE_URL, getAuthHeaders } from '.'

async function fetchProductReviews(
  query: ReviewsQuery,
): Promise<ApiResponse<PaginatedReviewsResponse>> {
  try {
    const queryParams = new URLSearchParams()

    // Transform and add query parameters
    const page = query.page ? Math.max(1, parseInt(String(query.page)) || 1) : 1
    const limit = query.limit ? Math.min(50, Math.max(1, parseInt(String(query.limit)) || 10)) : 10
    const product_id = parseInt(String(query.product_id))

    queryParams.append('page', page.toString())
    queryParams.append('limit', limit.toString())
    queryParams.append('product_id', product_id.toString())

    const url = `${API_BASE_URL}/reviews?${queryParams.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: {
        reviews: data.reviews,
        pagination: data.pagination,
      },
      success: true,
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return {
      data: {
        reviews: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      },
      success: false,
      message: 'Error fetching reviews',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function createReview(reviewData: CreateReviewForm): Promise<ApiResponse<Review>> {
  try {
    const payload: {
      product_id: number
      rating: number
      description?: string
    } = {
      product_id: parseInt(reviewData.productId),
      rating: reviewData.rating,
    }

    // Only include description if it's provided and not empty
    if (reviewData.description && reviewData.description.trim()) {
      payload.description = reviewData.description.trim()
    }

    const url = `${API_BASE_URL}/reviews`

    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: data.review || data,
      success: true,
      message: data.message || 'Review created successfully',
    }
  } catch (error) {
    console.error('Error creating review:', error)
    return {
      data: null,
      success: false,
      message: 'Error creating review',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const reviewService = {
  fetchProductReviews,
  createReview,
}
