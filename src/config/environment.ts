/**
 * Environment variables configuration
 * These variables are prefixed with VITE_ to be available in the browser
 */
export interface EnvironmentConfig {
  /** AWS Cognito User Pool domain */
  cognitoDomain: string;
  /** AWS Cognito App Client ID */
  clientId: string;
  /** OAuth redirect URI for API Gateway callback */
  redirectUri: string;
  /** Frontend URL (S3 bucket URL) */
  frontendUrl: string;
  /** Current environment (development, production, etc.) */
  nodeEnv: string;
}

/**
 * Get environment configuration with validation
 * @returns EnvironmentConfig object with validated values
 * @throws Error if required environment variables are missing
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    cognitoDomain: import.meta.env.VITE_COGNITO_DOMAIN,
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
    redirectUri: import.meta.env.VITE_REDIRECT_URI,
    frontendUrl: import.meta.env.VITE_FRONTEND_URL,
    nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
  };

  // Validate required environment variables
  const requiredVars = [
    'cognitoDomain',
    'clientId',
    'redirectUri',
    'frontendUrl',
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
