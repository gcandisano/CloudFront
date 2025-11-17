import type { PaginationResponse } from './api'

export interface SaleWithProducts {
  id: number
  user_id: number
  date: string
  total_amount: number
  status: string
  note?: string
  invoice_id?: number
  address?: string
  products: SaleProduct[]
}

export interface SaleProduct {
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
  product_name: string
  product_description?: string
  product_category: string
  product_image_url?: string
}

export interface CreateSaleProduct {
  product_id: number
  quantity?: number
}

export interface CreateSaleForm {
  products: CreateSaleProduct[]
  note?: string
  address?: string
}

export interface SaleCreationResponse {
  message: string
  sale: SaleWithProducts
}

export interface SalesListResponse {
  sales: SaleWithProducts[]
  pagination: PaginationResponse
}
