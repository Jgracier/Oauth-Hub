/**
 * 📝 WORDPRESS PLATFORM CONFIGURATION
 * Complete OAuth configuration for WordPress.com API
 */

export const wordpress = {
  name: 'WordPress',
  displayName: 'WordPress.com',
  icon: '📝',
  color: '#21759b',
  authUrl: 'https://public-api.wordpress.com/oauth2/authorize',
  tokenUrl: 'https://public-api.wordpress.com/oauth2/token',
  userInfoUrl: 'https://public-api.wordpress.com/rest/v1/me',
  userIdField: 'ID',
  revokeUrl: null, // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://developer.wordpress.com/apps/',
  description: 'Access WordPress.com API for sites and posts',
  requiredScopes: ['auth'],
  scopeDelimiter: ' ',
  requiresPKCE: false, // PKCE requirement for enhanced security
  additionalParams: { response_type: 'code' },
  scopes: {
    'Authentication': {
      'auth': { name: 'Authentication', description: 'Authenticate and access basic profile', required: true }
    },
    'Site Management': {
      'global': { name: 'Global Access', description: 'Access all sites and perform all actions' }
    }
  }
};
