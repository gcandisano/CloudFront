import type { ApiResponse, PaginationResponse } from '@/types'
import type { Sale, SalesResponse, CreateSaleForm, SaleStats } from '@/types/sale'
import { API_BASE_URL } from '.'
import { getAuthToken } from '@/utils/cognito'

async function getSales(page: number = 1, limit: number = 20, isPurchase: boolean = true): Promise<ApiResponse<SalesResponse>> {
  try {
    const token = getAuthToken()
    if (!token) {
      // Datos hardcodeados
      return {
        data: {
          sales: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        },
        success: true,
      }
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    const endpoint = isPurchase ? '/api/sales' : '/api/sales/seller'
    const response = await fetch(`${API_BASE_URL}${endpoint}?${queryParams.toString()}`, {
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
      data: {
        sales: data.sales || [],
        pagination: data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      },
      success: true,
    }
  } catch (error) {
    console.error('Error fetching sales:', error)
    // Datos hardcodeados cuando no hay backend
    const mockSales: Sale[] = [
      {
        id: 1,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        total: 2849.97,
        status: 'delivered',
        address: 'Av. Corrientes 1234, CABA',
        note: 'Entregar en recepción',
        products: [
          {
            product_id: 1,
            price: 1299.99,
            amount: 2,
            name: 'iPhone 15 Pro',
            first_name: 'Juan',
            last_name: 'Pérez',
          },
          {
            product_id: 3,
            price: 249.99,
            amount: 1,
            name: 'AirPods Pro',
            first_name: 'Juan',
            last_name: 'Pérez',
          },
        ],
      },
      {
        id: 2,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        total: 1199.99,
        status: 'shipped',
        address: 'Av. Santa Fe 5678, CABA',
        products: [
          {
            product_id: 2,
            price: 1199.99,
            amount: 1,
            name: 'MacBook Air M2',
            first_name: 'María',
            last_name: 'García',
          },
        ],
      },
      {
        id: 3,
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        total: 599.99,
        status: 'confirmed',
        address: 'Av. Libertador 9012, CABA',
        products: [
          {
            product_id: 4,
            price: 599.99,
            amount: 1,
            name: 'iPad Air',
            first_name: 'María',
            last_name: 'García',
          },
        ],
      },
    ]
    
    return {
      data: {
        sales: mockSales,
        pagination: {
          page: 1,
          limit: 20,
          total: mockSales.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      },
      success: true,
      message: 'Datos hardcodeados (backend no disponible)',
    }
  }
}

async function getSale(id: number): Promise<ApiResponse<Sale>> {
  try {
    const token = getAuthToken()
    if (!token) {
      // Datos hardcodeados
      return {
        data: {
          id: id,
          date: new Date().toISOString(),
          total: 0,
          status: 'pending',
          address: '',
          products: [],
        },
        success: true,
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/sales/${id}`, {
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
      data: data.sale || data,
      success: true,
    }
  } catch (error) {
    console.error('Error fetching sale:', error)
    // Datos hardcodeados cuando no hay backend
    const mockSale: Sale = {
      id: id,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      total: 2849.97,
      status: 'delivered',
      address: 'Av. Corrientes 1234, CABA',
      note: 'Entregar en recepción',
      products: [
        {
          product_id: 1,
          price: 1299.99,
          amount: 2,
          name: 'iPhone 15 Pro',
          description: 'El último iPhone con chip A17 Pro',
          first_name: 'Juan',
          last_name: 'Pérez',
        },
        {
          product_id: 3,
          price: 249.99,
          amount: 1,
          name: 'AirPods Pro',
          description: 'Auriculares inalámbricos con cancelación de ruido',
          first_name: 'Juan',
          last_name: 'Pérez',
        },
      ],
    }
    return {
      data: mockSale,
      success: true,
      message: 'Datos hardcodeados (backend no disponible)',
    }
  }
}

async function createSale(form: CreateSaleForm): Promise<ApiResponse<Sale>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: null,
        success: false,
        message: 'No autenticado',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/sales`, {
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
      data: data.sale || data,
      success: true,
      message: 'Compra realizada correctamente',
    }
  } catch (error) {
    console.error('Error creating sale:', error)
    return {
      data: null,
      success: false,
      message: 'Error realizando compra',
      error: error as string,
    }
  }
}

async function updateSaleStatus(id: number, status: string): Promise<ApiResponse<Sale>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: null,
        success: false,
        message: 'No autenticado',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/sales/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      data: data.sale || data,
      success: true,
      message: 'Estado actualizado correctamente',
    }
  } catch (error) {
    console.error('Error updating sale status:', error)
    return {
      data: null,
      success: false,
      message: 'Error actualizando estado',
      error: error as string,
    }
  }
}

async function cancelSale(id: number): Promise<ApiResponse<void>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: null,
        success: false,
        message: 'No autenticado',
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/sales/${id}/cancel`, {
      method: 'PATCH',
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
      message: 'Venta/Compra cancelada correctamente',
    }
  } catch (error) {
    console.error('Error canceling sale:', error)
    return {
      data: null,
      success: false,
      message: 'Error cancelando venta/compra',
      error: error as string,
    }
  }
}

async function getSaleStats(): Promise<ApiResponse<SaleStats>> {
  try {
    const token = getAuthToken()
    if (!token) {
      return {
        data: {
          total_sales: 0,
          total_spent: 0,
          average_order: 0,
          first_order: '',
          last_order: '',
        },
        success: true,
      }
    }

    const response = await fetch(`${API_BASE_URL}/api/sales/stats/summary`, {
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
    console.error('Error fetching sale stats:', error)
    return {
      data: {
        total_sales: 0,
        total_spent: 0,
        average_order: 0,
        first_order: '',
        last_order: '',
      },
      success: false,
      message: 'Error obteniendo estadísticas',
      error: error as string,
    }
  }
}

export const saleService = {
  getSales,
  getSale,
  createSale,
  updateSaleStatus,
  cancelSale,
  getSaleStats,
}

