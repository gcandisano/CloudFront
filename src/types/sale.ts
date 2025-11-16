import type { PaginationParams } from './api'

// Sales and Orders types
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

export interface SaleProduct {
  product_id: number
  price: number
  amount: number
  name: string
  description?: string
  first_name: string
  last_name: string
}

// Sale form types
export interface CreateSaleForm {
  total: number
  status?: string
  note?: string
  invoice_id?: number
  address: string
  cart_product_ids?: number[]
}

// Sale response types
export interface SalesResponse {
  sales: Sale[]
  pagination: PaginationParams
}

// Sale statistics
export interface SaleStats {
  total_sales: number
  total_spent: number
  average_order: number
  first_order: string
  last_order: string
}
