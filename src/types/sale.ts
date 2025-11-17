import type { PaginationResponse } from './api'

// Sale with products response type (matches saleWithProductsResponseSchema)
export interface SaleWithProducts {
  id: number
  user_id: number
  date: string
  total_amount: number
  status: string
  note: string | null
  invoice_id: number | null
  address: string
  products: SaleProduct[]
}

export interface SaleProduct {
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
  product_name: string
  product_description: string | null
  product_category: string
  product_image_url: string | null
}

// Sale creation product item type
export interface CreateSaleProduct {
  product_id: number
  quantity?: number
}

// Sale creation request type (matches createSaleSchema)
export interface CreateSaleForm {
  products: CreateSaleProduct[]
  note?: string
  address?: string
}

// Sale creation response type (matches saleCreationResponseSchema)
export interface SaleCreationResponse {
  message: string
  sale: SaleWithProducts
}

// Sales list response type (matches salesListResponseSchema)
export interface SalesListResponse {
  sales: SaleWithProducts[]
  pagination: PaginationResponse
}

// Legacy types (keeping for backward compatibility if needed)
export interface Sale {
  id: number
  date: string
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  note?: string
  invoice_id?: number
  address: string
  products: SaleProduct[]
}

// Sale response types
export interface SalesResponse {
  sales: Sale[]
  pagination: PaginationResponse
}

// Sale statistics
export interface SaleStats {
  total_sales: number
  total_spent: number
  average_order: number
  first_order: string
  last_order: string
}
