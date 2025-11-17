import type {
  ApiResponse,
  CreateSaleForm,
  SaleCreationResponse,
} from '@/types'
import { API_BASE_URL, getAuthHeaders } from '.'

async function createSale(
  saleData: CreateSaleForm
): Promise<ApiResponse<SaleCreationResponse>> {
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

export const saleService = {
  createSale,
}

