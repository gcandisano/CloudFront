import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js'
import { userPool } from '@/config/environment'
import type { CognitoTokens } from '@/types/cognito'

// Types for service methods
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export interface ResetPasswordData {
  email: string
  code: string
  newPassword: string
}

/**
 * Login with email and password
 * @param credentials - Login credentials
 * @returns Promise that resolves with Cognito tokens
 */
export function login(credentials: LoginCredentials): Promise<CognitoTokens> {
  const authenticationData = {
    Username: credentials.email,
    Password: credentials.password,
  }
  const authDetails = new AuthenticationDetails(authenticationData)

  const cognitoUser = new CognitoUser({
    Username: credentials.email,
    Pool: userPool,
  })

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        const accessToken = session.getAccessToken().getJwtToken()
        const idToken = session.getIdToken().getJwtToken()
        const refreshToken = session.getRefreshToken().getToken()

        resolve({
          accessToken,
          idToken,
          refreshToken,
        })
      },
      onFailure: (err) => {
        reject(err)
      },
      newPasswordRequired: () => {
        // This should be handled separately, but we'll reject with a specific error
        reject(
          new Error(
            'NEW_PASSWORD_REQUIRED: You must set a new password. Please use the reset password flow.',
          ),
        )
      },
    })
  })
}

/**
 * Register a new user
 * @param data - Registration data
 * @returns Promise that resolves with the Cognito user object
 */
export function register(data: RegisterData): Promise<{ user: CognitoUser }> {
  const attributeList: CognitoUserAttribute[] = [
    new CognitoUserAttribute({ Name: 'given_name', Value: data.firstName }),
    new CognitoUserAttribute({ Name: 'family_name', Value: data.lastName }),
    new CognitoUserAttribute({ Name: 'email', Value: data.email }),
    new CognitoUserAttribute({ Name: 'phone_number', Value: data.phoneNumber }),
  ]

  return new Promise((resolve, reject) => {
    userPool.signUp(data.email, data.password, attributeList, [], (err, result) => {
      if (err) {
        reject(err)
        return
      }

      if (!result) {
        reject(new Error('Error al registrar el usuario'))
        return
      }

      resolve({ user: result.user })
    })
  })
}

/**
 * Request password reset code
 * @param email - User email
 * @returns Promise that resolves when code is sent
 */
export function forgotPassword(email: string): Promise<void> {
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  })

  return new Promise((resolve, reject) => {
    cognitoUser.forgotPassword({
      onSuccess: () => {
        resolve()
      },
      onFailure: (err) => {
        reject(err)
      },
    })
  })
}

/**
 * Reset password with verification code
 * @param data - Reset password data
 * @returns Promise that resolves when password is reset
 */
export function resetPassword(data: ResetPasswordData): Promise<void> {
  const cognitoUser = new CognitoUser({
    Username: data.email,
    Pool: userPool,
  })

  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(data.code, data.newPassword, {
      onSuccess: () => {
        resolve()
      },
      onFailure: (err) => {
        reject(err)
      },
    })
  })
}

/**
 * Verify email with verification code
 * @param email - User email
 * @param code - Verification code
 * @returns Promise that resolves when email is verified
 */
export function verifyEmail(email: string, code: string): Promise<void> {
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  })

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err)
        return
      }

      if (result === 'SUCCESS') {
        resolve()
      } else {
        reject(new Error('Error inesperado al verificar el código'))
      }
    })
  })
}

/**
 * Resend email verification code
 * @param email - User email
 * @returns Promise that resolves when code is resent
 */
export function resendVerificationCode(email: string): Promise<void> {
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  })

  return new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        reject(err)
        return
      }

      if (result) {
        resolve()
      } else {
        reject(new Error('Error al reenviar el código'))
      }
    })
  })
}

/**
 * Resend password reset code
 * @param email - User email
 * @returns Promise that resolves when code is resent
 */
export function resendPasswordResetCode(email: string): Promise<void> {
  return forgotPassword(email)
}

export const authService = {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationCode,
  resendPasswordResetCode,
}
