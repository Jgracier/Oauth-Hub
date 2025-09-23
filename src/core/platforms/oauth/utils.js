/**
 * 🛠️ OAUTH UTILITIES
 * PKCE helpers and other OAuth-related utility functions
 */

/**
 * Validate OAuth response and extract error information
 */
export function validateOAuthResponse(searchParams) {
  const error = searchParams.get('error');
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  
  if (error) {
    return {
      success: false,
      error: {
        type: error,
        description: searchParams.get('error_description'),
        uri: searchParams.get('error_uri')
      }
    };
  }
  
  if (!code || !state) {
    return {
      success: false,
      error: {
        type: 'invalid_request',
        description: 'Missing authorization code or state parameter'
      }
    };
  }
  
  return {
    success: true,
    code,
    state
  };
}

/**
 * Check if a token is expired or will expire soon
 */
export function isTokenExpired(expiresAt, bufferSeconds = 300) {
  if (!expiresAt) return false; // No expiration set
  
  const now = Date.now();
  const bufferMs = bufferSeconds * 1000;
  
  return (expiresAt - bufferMs) <= now;
}

/**
 * Format scopes for display in UI
 */
export function formatScopeForDisplay(scope, platformConfig) {
  // Find the scope in platform configuration
  for (const category of Object.values(platformConfig.scopes || {})) {
    if (category[scope]) {
      return {
        name: category[scope].name,
        description: category[scope].description,
        required: category[scope].required || false
      };
    }
  }
  
  // Fallback for unknown scopes
  return {
    name: scope,
    description: `Access to ${scope}`,
    required: false
  };
}

/**
 * Build user-friendly error messages
 */
export function buildErrorMessage(platform, operation, error) {
  const errorMessages = {
    consent_url: `Failed to generate authorization URL for ${platform}`,
    token_exchange: `Failed to exchange authorization code for ${platform} tokens`,
    user_info: `Failed to retrieve user information from ${platform}`,
    token_refresh: `Failed to refresh ${platform} access token`
  };
  
  const baseMessage = errorMessages[operation] || `OAuth operation failed for ${platform}`;
  
  if (error.message) {
    return `${baseMessage}: ${error.message}`;
  }
  
  return baseMessage;
}

/**
 * Sanitize sensitive data for logging
 */
export function sanitizeForLogging(data, sensitiveFields = ['access_token', 'refresh_token', 'client_secret', 'code']) {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const sanitized = { ...data };
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      const value = sanitized[field];
      if (typeof value === 'string' && value.length > 10) {
        sanitized[field] = `${value.substring(0, 6)}...${value.substring(value.length - 4)}`;
      } else {
        sanitized[field] = '[REDACTED]';
      }
    }
  }
  
  return sanitized;
}
