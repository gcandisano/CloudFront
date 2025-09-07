// Tipos de usuario
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  store?: Store
}

// Tipos de tienda
export interface Store {
  storeId: string
  storeName?: string
  description?: string
  coverImageId?: string
  storeImageId?: string
  user: User
}

// Tipos de producto
export interface CreateProductForm {
  name: string
  description: string
  category: string
  price: number
  image: File | null
}

export interface Product {
  id: string
  name: string
  price: number
  imageId?: string
  sellerId: string
  category?: string
  description?: string
  rating?: number
  ratingCount?: number
  paused?: boolean
  seller: {
    firstName: string
    store: Store
  }
}

// Tipos de filtros
export interface ProductFilters {
  search?: string
  category?: string
  sort?: string
  liked?: boolean
  page?: number
  storeId?: string
}

// Tipos de respuesta de productos
export interface ProductsResponse {
  products: Product[]
  totalPages: number
  currentPage: number
  totalProducts: number
}

// Tipos de notificación
export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}

export interface Review {
  id: string
  rating: number
  description: string
  timestamp: string
  user: {
    id: string
    firstName: string
    lastName: string
  }
}

// Tipos de autenticación
export interface AuthState {
  isAuthenticated: boolean
  currentUser: User | null
  token: string | null
}

// Tipos de API
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginationParams {
  page: number
  size: number
}
