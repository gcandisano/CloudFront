import { API_BASE_URL } from './index'
import type {
  User,
  ApiError,
  CognitoTokens
} from '@/types'

class AuthService {
  private baseUrl: string

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api`
  }

  /**
   * Parse tokens from URL hash after Cognito callback
   * Expected format: https://mi-app.com/#token=accessToken&refreshToken=refreshToken&idToken=idToken
   */
  parseTokensFromUrl(): CognitoTokens | null {
    try {
      const hash = window.location.hash.substring(1) // Remove #
      const params = new URLSearchParams(hash)

      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const idToken = params.get('id_token');

      if (!accessToken) {
        return null
      }

      return {
        accessToken,
        refreshToken: refreshToken || '',
        idToken: idToken || ''
      }
    } catch (error) {
      console.error('Error parsing tokens from URL:', error)
      return null
    }
  }

  /**
   * Clear tokens from URL hash after successful authentication
   */
  clearTokensFromUrl(): void {
    try {
      // Remove hash from URL without causing a page reload
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    } catch (error) {
      console.error('Error clearing tokens from URL:', error)
    }
  }

  /**
   * Get current user information
   * Uses the stored token to fetch user data from backend
   */
  async getCurrentUser(token: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid or expired token')
        }
        const errorData: ApiError = await response.json()
        throw new Error(errorData.error || 'Failed to get user data')
      }

      const data = await response.json();
      return data.user as User;
    } catch (error) {
      console.error('Get current user error:', error)
      throw error
    }
  }

  async changePassword(token: string, oldPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      })

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Change password error:', error)
      throw error
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.message || 'Failed to request password reset')
      }
    } catch (error) {
      console.error('Request password reset error:', error)
      throw error
    }
  }

  async confirmPasswordReset(email: string, code: string, newPassword: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/confirm-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, new_password: newPassword }),
      })

      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.message || 'Failed to confirm password reset')
      }
    } catch (error) {
      console.error('Confirm password reset error:', error)
      throw error
    }
  }

  /**
   * Get Cognito Hosted UI URL for authentication
   */
  getCognitoLoginUrl(): string {
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID
    const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI

    if (!cognitoDomain || !clientId || !redirectUri) {
      throw new Error('Cognito configuration missing. Please check your environment variables.')
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'openid email profile'
    })

    return `https://${cognitoDomain}/oauth2/authorize?${params.toString()}`
  }

  /**
   * Get Cognito logout URL
   */
  getCognitoLogoutUrl(): string {
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID
    const logoutUri = import.meta.env.VITE_COGNITO_FRONTEND_URL

    if (!cognitoDomain || !clientId) {
      throw new Error('Cognito configuration missing. Please check your environment variables.')
    }

    const params = new URLSearchParams({
      client_id: clientId,
      logout_uri: logoutUri
    })

    return `https://${cognitoDomain}/logout?${params.toString()}`
  }
}

// Export singleton instance
export const authService = new AuthService()
export default authService
