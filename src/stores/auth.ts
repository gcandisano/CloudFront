import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode, type JwtPayload } from 'jwt-decode'
import type { CognitoIdTokenPayload, TokenData, CognitoUserInfo } from '@/types/cognito'

export const useAuthStore = defineStore('auth', () => {
  // Token state
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const idToken = ref<string | null>(null)

  // Token expiration times
  const accessTokenExp = ref<number | null>(null)
  const idTokenExp = ref<number | null>(null)
  const accessTokenIssuedAt = ref<number | null>(null)
  const idTokenIssuedAt = ref<number | null>(null)

  // User info extracted from tokens
  const userInfo = ref<CognitoUserInfo | null>(null)
  const email = ref<string | null>(null)
  const userId = ref<string | null>(null)
  const username = ref<string | null>(null)

  // Session metadata
  const loginTime = ref<number | null>(null)
  const lastRefreshTime = ref<number | null>(null)

  // Computed properties
  const isAuthenticated = computed(() => {
    return !!accessToken.value && !!idToken.value && !!refreshToken.value
  })

  const isAccessTokenExpired = computed(() => {
    if (!accessTokenExp.value) return false
    return Date.now() >= accessTokenExp.value * 1000
  })

  const isIdTokenExpired = computed(() => {
    if (!idTokenExp.value) return false
    return Date.now() >= idTokenExp.value * 1000
  })

  const isTokenExpired = computed(() => {
    return isAccessTokenExpired.value || isIdTokenExpired.value
  })

  const timeUntilAccessTokenExpiry = computed(() => {
    if (!accessTokenExp.value) return null
    const expiryTime = accessTokenExp.value * 1000
    const now = Date.now()
    return expiryTime > now ? expiryTime - now : 0
  })

  const timeUntilIdTokenExpiry = computed(() => {
    if (!idTokenExp.value) return null
    const expiryTime = idTokenExp.value * 1000
    const now = Date.now()
    return expiryTime > now ? expiryTime - now : 0
  })

  // Methods
  const setAuthData = (
    newAccessToken: string,
    newRefreshToken: string,
    newIdToken: string,
  ): void => {
    try {
      // Decode and extract data from tokens
      const accessTokenPayload = jwtDecode<JwtPayload>(newAccessToken)
      const idTokenPayload = jwtDecode<CognitoIdTokenPayload>(newIdToken)

      accessToken.value = newAccessToken
      refreshToken.value = newRefreshToken
      idToken.value = newIdToken

      if (accessTokenPayload) {
        accessTokenExp.value = accessTokenPayload.exp || null
        accessTokenIssuedAt.value = accessTokenPayload.iat || null
      }

      if (idTokenPayload) {
        idTokenExp.value = idTokenPayload.exp || null
        idTokenIssuedAt.value = idTokenPayload.iat || null

        // Extract user info from idToken
        userInfo.value = {
          sub: idTokenPayload.sub,
          email: idTokenPayload.email || '',
          email_verified: idTokenPayload.email_verified,
          phone_number: idTokenPayload.phone_number,
          given_name: idTokenPayload.given_name,
          family_name: idTokenPayload.family_name,
          username: idTokenPayload.username || idTokenPayload['cognito:username'],
          'cognito:username': idTokenPayload['cognito:username'],
        }

        email.value = idTokenPayload.email || null
        userId.value = idTokenPayload.sub
        username.value =
          idTokenPayload.username ||
          idTokenPayload['cognito:username'] ||
          idTokenPayload.email ||
          null
      }

      // Set session metadata
      loginTime.value = Date.now()
      lastRefreshTime.value = Date.now()

      // Persist to localStorage
      localStorage.setItem('auth_accessToken', newAccessToken)
      localStorage.setItem('auth_refreshToken', newRefreshToken)
      localStorage.setItem('auth_idToken', newIdToken)
    } catch (error) {
      // If token decoding fails, clear auth data to prevent invalid state
      console.error('Failed to decode tokens:', error)
      clearAuthData()
      throw new Error('Invalid token format. Please log in again.')
    }
  }

  const updateAccessToken = (newAccessToken: string): void => {
    try {
      const accessTokenPayload = jwtDecode<JwtPayload>(newAccessToken)

      // Only update token if decoding succeeds
      accessToken.value = newAccessToken

      if (accessTokenPayload) {
        accessTokenExp.value = accessTokenPayload.exp || null
        accessTokenIssuedAt.value = accessTokenPayload.iat || null
      }

      lastRefreshTime.value = Date.now()
      localStorage.setItem('auth_accessToken', newAccessToken)
    } catch (error) {
      // If token decoding fails, don't update the token
      console.error('Failed to decode access token:', error)
      throw new Error('Invalid access token format. Please log in again.')
    }
  }

  const clearAuthData = (): void => {
    accessToken.value = null
    refreshToken.value = null
    idToken.value = null
    accessTokenExp.value = null
    idTokenExp.value = null
    accessTokenIssuedAt.value = null
    idTokenIssuedAt.value = null
    userInfo.value = null
    email.value = null
    userId.value = null
    username.value = null
    loginTime.value = null
    lastRefreshTime.value = null

    // Clear localStorage
    localStorage.removeItem('auth_accessToken')
    localStorage.removeItem('auth_refreshToken')
    localStorage.removeItem('auth_idToken')
  }

  const initializeFromStorage = (): void => {
    const storedAccessToken = localStorage.getItem('auth_accessToken')
    const storedRefreshToken = localStorage.getItem('auth_refreshToken')
    const storedIdToken = localStorage.getItem('auth_idToken')

    if (storedAccessToken && storedRefreshToken && storedIdToken) {
      setAuthData(storedAccessToken, storedRefreshToken, storedIdToken)
    }
  }

  const getTokenData = (): TokenData | null => {
    if (!accessToken.value || !refreshToken.value || !idToken.value) {
      return null
    }

    return {
      accessToken: accessToken.value,
      refreshToken: refreshToken.value,
      idToken: idToken.value,
      accessTokenExp: accessTokenExp.value || undefined,
      idTokenExp: idTokenExp.value || undefined,
      accessTokenIssuedAt: accessTokenIssuedAt.value || undefined,
      idTokenIssuedAt: idTokenIssuedAt.value || undefined,
    }
  }

  // Initialize from storage on store creation
  initializeFromStorage()

  return {
    // State
    accessToken,
    refreshToken,
    idToken,
    accessTokenExp,
    idTokenExp,
    accessTokenIssuedAt,
    idTokenIssuedAt,
    userInfo,
    email,
    userId,
    username,
    loginTime,
    lastRefreshTime,

    // Computed
    isAuthenticated,
    isAccessTokenExpired,
    isIdTokenExpired,
    isTokenExpired,
    timeUntilAccessTokenExpiry,
    timeUntilIdTokenExpiry,

    // Methods
    setAuthData,
    updateAccessToken,
    clearAuthData,
    initializeFromStorage,
    getTokenData,
  }
})
