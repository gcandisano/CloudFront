import type { JwtPayload } from 'jwt-decode'

// Cognito-specific types
export interface CognitoTokens {
  accessToken: string
  idToken: string
  refreshToken: string
}

export interface CognitoIdTokenPayload extends JwtPayload {
  sub: string
  email?: string
  email_verified?: boolean
  phone_number?: string
  given_name?: string
  family_name?: string
  username?: string
  'cognito:username'?: string
}

export interface TokenData {
  accessToken: string
  refreshToken: string
  idToken: string
  accessTokenExp?: number
  idTokenExp?: number
  accessTokenIssuedAt?: number
  idTokenIssuedAt?: number
}

export interface CognitoUserInfo {
  sub: string
  email: string
  email_verified?: boolean
  phone_number?: string
  given_name?: string
  family_name?: string
  username?: string
  'cognito:username'?: string
}

