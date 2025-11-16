import { CognitoUserPool } from 'amazon-cognito-identity-js'

/**
 * Environment variables configuration
 * These variables are prefixed with VITE_ to be available in the browser
 */
export interface EnvironmentConfig {
  /** AWS Cognito User Pool ID */
  userPoolId: string
  /** AWS Cognito App Client ID */
  clientId: string
  /** S3 bucket URL for file uploads */
  s3Url: string
}

/**
 * Get environment configuration with validation
 * @returns EnvironmentConfig object with validated values
 * @throws Error if required environment variables are missing
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    s3Url: import.meta.env.VITE_S3_URL,
  }

  // Validate required environment variables
  const requiredVars = [
    'userPoolId',
    'clientId',
    's3Url',
  ] as const

  const missingVars = requiredVars.filter((key) => !config[key] || config[key].includes('<'))

  if (missingVars.length > 0) {
    throw new Error(
      `Missing or invalid environment variables: ${missingVars.join(', ')}. ` +
        'Please check your .env file and ensure all values are properly set.',
    )
  }

  return config
}

export const userPool = new CognitoUserPool({
  UserPoolId: getEnvironmentConfig().userPoolId,
  ClientId: getEnvironmentConfig().clientId,
})
