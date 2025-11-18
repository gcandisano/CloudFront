import type { Product } from './product'

export interface CartItem {
  product_id: number
  quantity: number
}

export interface CartItemWithProduct extends CartItem {
  product: Product
}

export interface CartResponse {
  items: CartItemWithProduct[]
}

export interface UpdateCartRequest {
  items: CartItem[]
}

