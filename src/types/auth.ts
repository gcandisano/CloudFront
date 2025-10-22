import type { Store } from "./product"

// Authentication and User types
export interface User {
  id: number
  email: string
  is_seller: boolean
  is_active: boolean
  firstName?: string
  lastName?: string
  store?: Store
}

export interface AuthState {
  isAuthenticated: boolean
  currentUser: User | null
  token: string | null
}

// Cognito-specific types
export interface CognitoTokens {
  accessToken: string
  idToken: string
  refreshToken: string
}

export interface CognitoUser {
  sub: string
  email: string
  email_verified: boolean
  given_name?: string
  family_name?: string
  username?: string
}

// API Response types
export interface AuthResponse {
  user: User
  tokens?: CognitoTokens
}

export interface ApiError {
  error: string
  message?: string
}
