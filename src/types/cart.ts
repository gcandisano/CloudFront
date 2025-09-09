// Cart types
export interface CartItem {
  id: string
  product_id: number
  amount: number
  product: {
    name: string
    price: number
    stock: number
  }
  item_total?: number
}

export interface CartResponse {
  cart: CartItem[]
  total: number
  item_count: number
}

// Cart form types
export interface AddToCartForm {
  product_id: number
  amount: number
}

export interface UpdateCartItemForm {
  amount: number
}
