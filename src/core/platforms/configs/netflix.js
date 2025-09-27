/**
 * 🎬 NETFLIX PLATFORM CONFIGURATION
 * Complete OAuth configuration for Netflix API (OAuth 1.0a)
 */

const netflix = {
  name: 'Netflix',
  displayName: 'Netflix',
  icon: '🎬',
  color: '#e50914',
  authUrl: 'https://api.netflix.com/oauth/request_token',
  tokenUrl: 'https://api.netflix.com/oauth/access_token',
  userInfoUrl: 'https://api.netflix.com/users/current',
  userIdField: 'user.user_id',
  revokeUrl: null, // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://developer.netflix.com/docs/security',
  description: 'Netflix streaming platform (OAuth 1.0a)',
  requiredScopes: ['read'],
  scopeDelimiter: ' ',
  requiresPKCE: false, // PKCE requirement for enhanced security
  additionalParams: { oauth_version: '1.0' },
  scopes: {
    'Basic': {
      'read': { name: 'Read', description: 'Access user profile and viewing history', required: true }
    }
  }
};


module.exports = { netflix };

