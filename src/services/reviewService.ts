import type { ApiResponse, PaginationResponse } from '@/types'
import type { Review, ReviewsResponse, CreateReviewForm } from '@/types/review'
import { API_BASE_URL } from '.'
import { getAuthToken } from '@/utils/cognito'

async function getProductReviews(productId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<ReviewsResponse>> {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    const response = await fetch(`${API_BASE_URL}/api/reviews/product/${productId}?${queryParams.toString()}`, {
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
        reviews: data.reviews || [],
        average_rating: data.average_rating || 0,
        total_reviews: data.total_reviews || 0,
        pagination: data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      },
      success: true,
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    // Datos hardcodeados cuando no hay backend
    const mockReviews: Review[] = [
      {
        id: '1',
        rating: 5,
        description: 'Excelente producto, muy buena calidad. La entrega fue rápida y el vendedor muy profesional.',
        timestamp: '2024-01-15',
        user: {
          id: 'user1',
          firstName: 'María',
          lastName: 'García',
        },
      },
      {
        id: '2',
        rating: 4,
        description: 'Muy buen teléfono, la cámara es increíble. Solo le doy 4 estrellas porque la batería podría durar un poco más.',
        timestamp: '2024-01-10',
        user: {
          id: 'user2',
          firstName: 'Carlos',
          lastName: 'López',
        },
      },
      {
        id: '3',
        rating: 5,
        description: 'Perfecto en todos los aspectos. Super rápido, excelente cámara y muy buena duración de batería.',
        timestamp: '2024-01-05',
        user: {
          id: 'user3',
          firstName: 'Ana',
          lastName: 'Martínez',
        },
      },
    ]
    
    return {
      data: {
        reviews: mockReviews,
        average_rating: 4.67,
        total_reviews: mockReviews.length,
        pagination: {
          page: 1,
          limit: 20,
          total: mockReviews.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      },
      success: true,
      message: 'Datos hardcodeados (backend no disponible)',
    }
  }
}

async function getUserReviews(page: number = 1, limit: number = 20): Promise<ApiResponse<ReviewsResponse>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: {
          reviews: [],
          average_rating: 0,
          total_reviews: 0,
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        },
        success: true,
      }
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    const response = await fetch(`${API_BASE_URL}/api/reviews/user/me?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      data: {
        reviews: data.reviews || [],
        average_rating: data.average_rating || 0,
        total_reviews: data.total_reviews || 0,
        pagination: data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      },
      success: true,
    }
  } catch (error) {
    console.error('Error fetching user reviews:', error)
    return {
      data: {
        reviews: [],
        average_rating: 0,
        total_reviews: 0,
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      },
      success: false,
      message: 'Error obteniendo reseñas',
      error: error as string,
    }
  }
}

async function createReview(form: CreateReviewForm): Promise<ApiResponse<Review>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: null,
        success: false,
        message: 'No autenticado',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: parseInt(form.productId),
        rating: form.rating,
        description: form.description,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      data: data.review || data,
      success: true,
      message: 'Reseña creada correctamente',
    }
  } catch (error) {
    console.error('Error creating review:', error)
    return {
      data: null,
      success: false,
      message: 'Error creando reseña',
      error: error as string,
    }
  }
}

async function updateReview(id: string, form: { rating?: number; description?: string }): Promise<ApiResponse<Review>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: null,
        success: false,
        message: 'No autenticado',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      data: data.review || data,
      success: true,
      message: 'Reseña actualizada correctamente',
    }
  } catch (error) {
    console.error('Error updating review:', error)
    return {
      data: null,
      success: false,
      message: 'Error actualizando reseña',
      error: error as string,
    }
  }
}

async function deleteReview(id: string): Promise<ApiResponse<void>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: null,
        success: false,
        message: 'No autenticado',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return {
      data: null,
      success: true,
      message: 'Reseña eliminada correctamente',
    }
  } catch (error) {
    console.error('Error deleting review:', error)
    return {
      data: null,
      success: false,
      message: 'Error eliminando reseña',
      error: error as string,
    }
  }
}

export const reviewService = {
  getProductReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
}

