import type { ApiResponse, ToggleFavoriteResponse } from '@/types'
import { API_BASE_URL, getAuthHeaders } from '.'

/**
 * Toggle favorite status for a product
 * @param productId - The ID of the product to toggle favorite status for
 * @returns Promise that resolves with the toggle response
 */
async function toggleFavorite(productId: number): Promise<ApiResponse<ToggleFavoriteResponse>> {
  try {
    const url = `${API_BASE_URL}/favorites/toggle`

    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        product_id: productId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: {
        message: data.message,
        is_favorite: data.is_favorite,
      },
      success: true,
      message: data.message,
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return {
      data: null,
      success: false,
      message: 'Error toggling favorite',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const favoriteService = {
  toggleFavorite,
}

