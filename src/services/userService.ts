import type { ApiResponse, User } from '@/types'
import { API_BASE_URL } from '.'

/**
 * Get current user information
 * @param accessToken - JWT access token for authentication
 * @returns Promise that resolves with user data
 */
async function getCurrentUser(accessToken: string): Promise<ApiResponse<User>> {
  try {
    const url = `${API_BASE_URL}/api/users/me`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      data: data.user || data,
      success: true,
    }
  } catch (error) {
    console.error('Error fetching current user:', error)
    return {
      data: null,
      success: false,
      message: 'Error fetching user information',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const userService = {
  getCurrentUser,
}

