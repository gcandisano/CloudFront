import type { ApiResponse, CartItem, CartResponse, UpdateCartRequest } from '@/types'
import { API_BASE_URL, getAuthHeaders } from '.'

/**
 * Fetch the user's cart from the backend
 */
async function fetchCart(): Promise<ApiResponse<CartResponse>> {
  try {
    const url = `${API_BASE_URL}/cart`

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: {
        items: data.items || [],
      },
      success: true,
    }
  } catch (error) {
    console.error('Error fetching cart:', error)
    return {
      data: {
        items: [],
      },
      success: false,
      message: 'Error fetching cart',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Update the user's cart on the backend
 */
async function updateCart(items: CartItem[]): Promise<ApiResponse<CartResponse>> {
  try {
    const url = `${API_BASE_URL}/cart`

    const payload: UpdateCartRequest = {
      items,
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: {
        items: data.items || [],
      },
      success: true,
      message: data.message || 'Cart updated successfully',
    }
  } catch (error) {
    console.error('❌ Error updating cart:', error)
    return {
      data: {
        items: [],
      },
      success: false,
      message: 'Error updating cart',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Clear the user's cart on the backend
 */
async function clearCart(): Promise<ApiResponse<{ message: string }>> {
  try {
    const url = `${API_BASE_URL}/cart`

    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: {
        message: data.message || 'Cart cleared successfully',
      },
      success: true,
      message: data.message || 'Cart cleared successfully',
    }
  } catch (error) {
    console.error('Error clearing cart:', error)
    return {
      data: null,
      success: false,
      message: 'Error clearing cart',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Validate cart items (check stock, prices, availability)
 * This should be called before checkout
 */
async function validateCart(): Promise<ApiResponse<{ valid: boolean; errors?: string[] }>> {
  try {
    const url = `${API_BASE_URL}/cart/validate`

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: {
        valid: data.valid ?? true,
        errors: data.errors || [],
      },
      success: true,
    }
  } catch (error) {
    console.error('Error validating cart:', error)
    return {
      data: {
        valid: false,
        errors: ['Error validating cart'],
      },
      success: false,
      message: 'Error validating cart',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const cartService = {
  fetchCart,
  updateCart,
  clearCart,
  validateCart,
}

