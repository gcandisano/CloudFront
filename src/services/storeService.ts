import type {
  ApiResponse,
  StoresListResponse,
  StoreResponse,
  ProductFilters,
  ProductsResponse,
} from '@/types'
import { API_BASE_URL, getAuthHeaders } from '.'

async function fetchStores(params?: {
  page?: number
  limit?: number
}): Promise<ApiResponse<StoresListResponse>> {
  try {
    const queryParams = new URLSearchParams()

    if (params?.page !== undefined) {
      queryParams.append('page', params.page.toString())
    }

    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString())
    }

    const url = `${API_BASE_URL}/stores${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

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
        stores: data.stores,
        pagination: data.pagination,
      },
      success: true,
    }
  } catch (error) {
    console.error('Error fetching stores:', error)
    return {
      data: {
        stores: [],
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
      message: 'Error fetching stores',
      error: error as string,
    }
  }
}

async function fetchSingleStore(id: string): Promise<ApiResponse<StoreResponse>> {
  try {
    const url = `${API_BASE_URL}/stores/${id}`

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: data.store,
      success: true,
    }
  } catch (error) {
    console.error('Error fetching store:', error)
    return {
      data: null,
      success: false,
      message: 'Error fetching store',
      error: error as string,
    }
  }
}

async function fetchStoreProducts(
  storeId: string,
  filters: ProductFilters = {},
): Promise<ApiResponse<ProductsResponse>> {
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

    const url = `${API_BASE_URL}/stores/${storeId}/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

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
    console.error('Error fetching store products:', error)
    return {
      data: {
        products: [],
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
      message: 'Error fetching store products',
      error: error as string,
    }
  }
}

async function updateStore(
  storeId: string,
  data: {
    store_name?: string
    description?: string | null
    store_image_url?: string
    cover_image_url?: string
  },
): Promise<ApiResponse<StoreResponse>> {
  try {
    const url = `${API_BASE_URL}/stores/${storeId}`

    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const responseData = await response.json()

    return {
      data: responseData.store,
      success: true,
      message: responseData.message || 'Tienda actualizada exitosamente',
    }
  } catch (error) {
    console.error('Error updating store:', error)
    return {
      data: null,
      success: false,
      message: 'Error al actualizar la tienda',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const storeService = {
  fetchStores,
  fetchSingleStore,
  fetchStoreProducts,
  updateStore,
}
