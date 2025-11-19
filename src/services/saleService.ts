import type { ApiResponse, CreateSaleForm, SaleCreationResponse, SalesListResponse } from '@/types'
import { API_BASE_URL, getAuthHeaders } from '.'

async function createSale(saleData: CreateSaleForm): Promise<ApiResponse<SaleCreationResponse>> {
  try {
    // Prepare JSON payload - only include fields that are provided
    const payload: {
      products: Array<{
        product_id: number
        quantity?: number
      }>
      note?: string
      address?: string
    } = {
      products: saleData.products.map((product) => ({
        product_id: product.product_id,
        ...(product.quantity !== undefined && { quantity: product.quantity }),
      })),
    }

    if (saleData.note !== undefined) {
      payload.note = saleData.note
    }
    if (saleData.address !== undefined) {
      payload.address = saleData.address
    }

    const url = `${API_BASE_URL}/sales`

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
      data: {
        message: data.message,
        sale: data.sale,
      },
      success: true,
      message: data.message || 'Sale created successfully',
    }
  } catch (error) {
    console.error('Error creating sale:', error)
    return {
      data: null,
      success: false,
      message: 'Error creating sale',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function fetchSales(params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<ApiResponse<SalesListResponse>> {
  try {
    const queryParams = new URLSearchParams()

    if (params?.page !== undefined) {
      queryParams.append('page', params.page.toString())
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString())
    }
    if (params?.status !== undefined && params.status !== '') {
      queryParams.append('status', params.status)
    }

    const url = `${API_BASE_URL}/sales${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

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
        sales: data.sales || [],
        pagination: data.pagination,
      },
      success: true,
    }
  } catch (error) {
    console.error('Error fetching sales:', error)
    return {
      data: {
        sales: [],
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
      message: 'Error fetching sales',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function fetchMySales(params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<ApiResponse<SalesListResponse>> {
  try {
    const queryParams = new URLSearchParams()

    if (params?.page !== undefined) {
      queryParams.append('page', params.page.toString())
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString())
    }
    if (params?.status !== undefined && params.status !== '') {
      queryParams.append('status', params.status)
    }

    const url = `${API_BASE_URL}/my-sales${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

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
        sales: data.sales || [],
        pagination: data.pagination,
      },
      success: true,
    }
  } catch (error) {
    console.error('Error fetching my sales:', error)
    return {
      data: {
        sales: [],
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
      message: 'Error fetching my sales',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const saleService = {
  createSale,
  fetchSales,
  fetchMySales,
}
