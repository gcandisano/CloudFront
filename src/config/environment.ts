import { CognitoUserPool } from 'amazon-cognito-identity-js';

/**
 * Environment variables configuration
 * These variables are prefixed with VITE_ to be available in the browser
 */
export interface EnvironmentConfig {
  /** AWS Cognito User Pool domain */
  cognitoDomain: string;
  /** AWS Cognito User Pool ID */
  userPoolId: string;
  /** AWS Cognito App Client ID */
  clientId: string;
  /** OAuth redirect URI for API Gateway callback */
  redirectUri: string;
  /** S3 bucket URL for file uploads */
  s3Url: string;
  /** Current environment (development, production, etc.) */
  nodeEnv: string;
  /** Frontend URL */
  frontendUrl: string;
}

/**
 * Get environment configuration with validation
 * @returns EnvironmentConfig object with validated values
 * @throws Error if required environment variables are missing
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    cognitoDomain: import.meta.env.VITE_COGNITO_DOMAIN,
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    redirectUri: import.meta.env.VITE_REDIRECT_URI,
    s3Url: import.meta.env.VITE_S3_URL,
    nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
    frontendUrl: import.meta.env.VITE_FRONTEND_URL,
  };

  // Validate required environment variables
  const requiredVars = [
    /* 'cognitoDomain', */
    'userPoolId',
    'clientId',
    /* 'redirectUri',
    's3Url', */
  ] as const;

  const missingVars = requiredVars.filter(
    (key) => !config[key] || config[key].includes('<')
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing or invalid environment variables: ${missingVars.join(', ')}. ` +
      'Please check your .env file and ensure all values are properly set.'
    );
  }

  return config;
}

export const userPool = new CognitoUserPool({
  UserPoolId: getEnvironmentConfig().userPoolId,
  ClientId: getEnvironmentConfig().clientId,
})

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return getEnvironmentConfig().nodeEnv === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return getEnvironmentConfig().nodeEnv === 'production';
}
