import type { ApiResponse, StoresListResponse } from '@/types'
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

export const storeService = {
  fetchStores,
}

