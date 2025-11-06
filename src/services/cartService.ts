import type { ApiResponse } from '@/types'
import type { CartItem, CartResponse, AddToCartForm, UpdateCartItemForm } from '@/types/cart'
import { API_BASE_URL } from '.'
import { getAuthToken } from '@/utils/cognito'

async function getCart(): Promise<ApiResponse<CartResponse>> {
  try {
    const token = getAuthToken()
    if (!token) {
      // Datos hardcodeados para cuando no hay backend
      return {
        data: {
          cart: [],
          total: 0,
          item_count: 0,
        },
        success: true,
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/cart`, {
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
      data: data,
      success: true,
    }
  } catch (error) {
    console.error('Error fetching cart:', error)
    // Datos hardcodeados cuando no hay backend
    const mockCartItems: CartItem[] = [
      {
        id: '1',
        product_id: 1,
        amount: 2,
        product: {
          name: 'iPhone 15 Pro',
          price: 1299.99,
          stock: 10,
        },
        item_total: 2599.98,
      },
      {
        id: '2',
        product_id: 3,
        amount: 1,
        product: {
          name: 'AirPods Pro',
          price: 249.99,
          stock: 15,
        },
        item_total: 249.99,
      },
    ]
    return {
      data: {
        cart: mockCartItems,
        total: 2849.97,
        item_count: 3,
      },
      success: true,
      message: 'Datos hardcodeados (backend no disponible)',
    }
  }
}

async function addToCart(form: AddToCartForm): Promise<ApiResponse<CartItem>> {
  try {
    const token = getAuthToken()
    if (!token) {
      // Datos hardcodeados
      return {
        data: {
          id: '1',
          product_id: form.product_id,
          amount: form.amount,
          product: {
            name: 'Producto de ejemplo',
            price: 100,
            stock: 10,
          },
        },
        success: true,
        message: 'Producto agregado al carrito',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: 'POST',
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
      data: data,
      success: true,
      message: 'Producto agregado al carrito',
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return {
      data: null,
      success: false,
      message: 'Error agregando producto al carrito',
      error: error as string,
    }
  }
}

async function updateCartItem(productId: number, form: UpdateCartItemForm): Promise<ApiResponse<CartItem>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: null,
        success: false,
        message: 'No autenticado',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/cart/${productId}`, {
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
      data: data,
      success: true,
    }
  } catch (error) {
    console.error('Error updating cart item:', error)
    return {
      data: null,
      success: false,
      message: 'Error actualizando carrito',
      error: error as string,
    }
  }
}

async function removeFromCart(productId: number): Promise<ApiResponse<void>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: null,
        success: false,
        message: 'No autenticado',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/cart/${productId}`, {
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
      message: 'Producto eliminado del carrito',
    }
  } catch (error) {
    console.error('Error removing from cart:', error)
    return {
      data: null,
      success: false,
      message: 'Error eliminando producto del carrito',
      error: error as string,
    }
  }
}

async function clearCart(): Promise<ApiResponse<void>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: null,
        success: false,
        message: 'No autenticado',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/cart`, {
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
      message: 'Carrito vaciado',
    }
  } catch (error) {
    console.error('Error clearing cart:', error)
    return {
      data: null,
      success: false,
      message: 'Error vaciando carrito',
      error: error as string,
    }
  }
}

async function getCartSummary(): Promise<ApiResponse<{ total: number; item_count: number }>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: {
          total: 0,
          item_count: 0,
        },
        success: true,
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/cart/summary`, {
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
      data: data,
      success: true,
    }
  } catch (error) {
    console.error('Error fetching cart summary:', error)
    return {
      data: {
        total: 0,
        item_count: 0,
      },
      success: false,
      message: 'Error obteniendo resumen del carrito',
      error: error as string,
    }
  }
}

export const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary,
}

