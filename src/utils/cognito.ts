// Environment configuration for Cognito
export const cognitoConfig = {
  domain: import.meta.env.VITE_COGNITO_DOMAIN,
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirectUri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  logoutUri: import.meta.env.VITE_COGNITO_LOGOUT_URI || window.location.origin,
}

// Validate Cognito configuration
export const validateCognitoConfig = (): boolean => {
  const required = ['domain', 'clientId', 'redirectUri']
  const missing = required.filter(key => !cognitoConfig[key as keyof typeof cognitoConfig])

  if (missing.length > 0) {
    console.error('Missing Cognito configuration:', missing)
    return false
  }

  return true
}

// Get Cognito URLs
export const getCognitoUrls = () => {
  if (!validateCognitoConfig()) {
    throw new Error('Invalid Cognito configuration')
  }

  const { domain, clientId, redirectUri, logoutUri } = cognitoConfig

  const loginParams = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'openid email profile'
  })

  const logoutParams = new URLSearchParams({
    client_id: clientId,
    logout_uri: logoutUri
  })

  return {
    loginUrl: `https://${domain}/oauth2/authorize?${loginParams.toString()}`,
    logoutUrl: `https://${domain}/logout?${logoutParams.toString()}`
  }
}
