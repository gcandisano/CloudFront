// Favorite request types
export interface ToggleFavoriteRequest {
  product_id: number
}

// Favorite response types
export interface ToggleFavoriteResponse {
  message: string
  is_favorite: boolean
}

