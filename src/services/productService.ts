import type {
  ApiResponse,
  Product,
  ProductFilters,
  ProductsResponse,
  CreateProductForm,
} from '@/types'
import { API_BASE_URL, getAuthHeaders } from '.'

async function fetchProducts(filters: ProductFilters = {}): Promise<ApiResponse<ProductsResponse>> {
  try {
    const queryParams = new URLSearchParams()

    // Convert filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // For boolean values, only include if true
        if (typeof value === 'boolean') {
          if (value) {
            queryParams.append(key, 'true')
          }
        } else {
          queryParams.append(key, value.toString())
        }
      }
    })

    const url = `${API_BASE_URL}/products?${queryParams.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: {
        products: data.products,
        pagination: data.pagination,
      },
      success: true,
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      data: {
        products: [],
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
      message: 'Error fetching products',
      error: error as string,
    }
  }
}

async function fetchProduct(id: string): Promise<ApiResponse<Product>> {
  try {
    const url = `${API_BASE_URL}/products/${id}`

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: data.product,
      success: true,
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return {
      data: null,
      success: false,
      message: 'Error fetching product',
      error: error as string,
    }
  }
}

async function createProduct(product: CreateProductForm): Promise<ApiResponse<Product>> {
  try {
    // Prepare JSON payload - only include fields that are provided
    const payload: {
      name: string
      description: string
      category: string
      price: number
      image_url?: string
      stock?: number
    } = {
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
    }

    if (product.image_url) {
      payload.image_url = product.image_url
    }

    if (product.stock !== undefined && product.stock !== null) {
      payload.stock = product.stock
    }

    const url = `${API_BASE_URL}/products`

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
      data: data.product,
      success: true,
      message: data.message || 'Product created successfully',
    }
  } catch (error) {
    console.error('Error creating product:', error)
    return {
      data: null,
      success: false,
      message: 'Error creating product',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function fetchRelatedProducts(
  productId: string,
  limit: number = 10,
): Promise<ApiResponse<Product[]>> {
  try {
    const queryParams = new URLSearchParams()
    if (limit) {
      queryParams.append('limit', limit.toString())
    }

    const url = `${API_BASE_URL}/products/${productId}/related?${queryParams.toString()}`

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      if (response.status === 404) {
        return {
          data: [],
          success: true,
          message: 'Product not found',
        }
      }
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: data.products || [],
      success: true,
    }
  } catch (error) {
    console.error('Error fetching related products:', error)
    return {
      data: [],
      success: false,
      message: 'Error fetching related products',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const productService = {
  fetchProducts,
  fetchProduct,
  createProduct,
  fetchRelatedProducts,
}
