import type {
  ApiResponse,
  Product,
  ProductFilters,
  ProductsResponse,
  CreateProductForm,
} from '@/types'
import { API_BASE_URL } from '.'

async function fetchProducts(filters: ProductFilters = {}): Promise<ApiResponse<ProductsResponse>> {
  try {
    const queryParams = new URLSearchParams()

    // Convert filters to query parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString())
      }
    })

    const url = `${API_BASE_URL}/api/products?${queryParams.toString()}`

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

    // Transform the API response to match our frontend types
    const transformedProducts: Product[] = data.products.map((product: Product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      image_url: product.image_url,
      paused: product.paused,
      seller_sub: product.seller_sub,
    }))

    return {
      data: {
        products: transformedProducts,
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
    const url = `${API_BASE_URL}/api/products/${id}`

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
      email: string
      stock?: number
      store_name?: string
      image_url?: string
    } = {
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      email: product.email,
    }

    // Only add optional fields if they have values
    if (product.stock !== undefined && product.stock !== null) {
      payload.stock = product.stock
    }
    if (product.store_name) {
      payload.store_name = product.store_name
    }
    if (product.image_url) {
      payload.image_url = product.image_url
    }

    const url = `${API_BASE_URL}/api/products`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

export const productService = {
  fetchProducts,
  fetchProduct,
  createProduct,
}
