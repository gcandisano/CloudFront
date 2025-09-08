import type { Product } from '@/types'

export interface ProductFilters {
  page?: number
  search?: string
  category?: string
  orderBy?: string
}

export interface ProductResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

async function fetchProducts(filters: ProductFilters = {}): Promise<ProductResponse> {
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
    const transformedProducts: Product[] = data.products.map((product: any) => ({
      id: product.id.toString(),
      name: product.name,
      price: product.price,
      imageId: '', // This will need to be handled separately if you have image endpoints
      sellerId: product.store_id.toString(),
      category: '', // This will need to be added to your API if needed
      rating: 0, // This will need to be added to your API if needed
      ratingCount: 0, // This will need to be added to your API if needed
      paused: !product.is_active,
      seller: {
        firstName: '', // This will need to be fetched separately or included in the API
        store: {
          storeId: product.store_id.toString(),
          storeName: '', // This will need to be fetched separately or included in the API
          storeImageId: null,
        },
      },
    }))

    return {
      products: transformedProducts,
      pagination: data.pagination
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

async function fetchCategories(): Promise<string[]> {
  try {
    // TODO: Implement when you have a categories endpoint
    // For now, return mock data
    return ['Electronics', 'Clothing', 'Books', 'Home', 'Sports']
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

async function fetchStore(storeId: string): Promise<any> {
  try {
    // TODO: Implement when you have a store endpoint
    // For now, return mock data
    return {
      storeId,
      storeName: 'Sample Store',
      description: 'A sample store description',
      coverImageId: null,
      storeImageId: null,
      user: {
        id: '1',
        firstName: 'Store',
        lastName: 'Owner',
        email: 'owner@store.com',
      },
    }
  } catch (error) {
    console.error('Error fetching store:', error)
    throw error
  }
}

// Export the service object with methods
export const productService = {
  fetchProducts,
  fetchCategories,
  fetchStore,
}
