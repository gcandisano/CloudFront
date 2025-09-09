import type { Store } from "./product"

// Authentication and User types
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  store?: Store
}

export interface AuthState {
  isAuthenticated: boolean
  currentUser: User | null
  token: string | null
}

// Form types for authentication
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  password: string
  firstName: string
  lastName: string
  isSeller?: boolean
}
