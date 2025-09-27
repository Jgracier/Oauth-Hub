/**
 * 🍎 APPLE PLATFORM CONFIGURATION
 * Complete OAuth configuration for Apple Sign In
 */

const apple = {
  name: 'Apple',
  displayName: 'Apple',
  icon: '🍎',
  color: '#000000',
  authUrl: 'https://appleid.apple.com/auth/authorize',
  tokenUrl: 'https://appleid.apple.com/auth/token',
  userInfoUrl: 'https://appleid.apple.com/auth/userinfo', // JWT token contains user info
  userIdField: 'sub',
  revokeUrl: 'https://appleid.apple.com/auth/revoke', // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://developer.apple.com/sign-in-with-apple/',
  description: 'Sign in with Apple - Privacy-focused authentication',
  requiredScopes: ['openid'],
  scopeDelimiter: ' ',
  requiresPKCE: true, // PKCE requirement for enhanced security
  additionalParams: { 
    response_type: 'code',
    response_mode: 'form_post' // Apple requires form_post
  },
  scopes: {
    'Authentication': {
      'openid': { name: 'OpenID Connect', description: 'Basic authentication with Apple ID', required: true }
    },
    'Profile': {
      'name': { name: 'Name', description: 'Access user\'s name (first time only)' },
      'email': { name: 'Email', description: 'Access user\'s email address' }
    }
  }
};


export { apple };



