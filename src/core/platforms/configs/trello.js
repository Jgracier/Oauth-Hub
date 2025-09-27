/**
 * 📋 TRELLO PLATFORM CONFIGURATION
 * Complete OAuth configuration for Trello API (OAuth 1.0a)
 */

const trello = {
  name: 'Trello',
  displayName: 'Trello',
  icon: '📋',
  color: '#0079bf',
  authUrl: 'https://trello.com/1/authorize',
  tokenUrl: 'https://trello.com/1/OAuthGetAccessToken', // OAuth 1.0a
  userInfoUrl: 'https://api.trello.com/1/members/me',
  userIdField: 'id',
  revokeUrl: null, // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://developer.atlassian.com/cloud/trello/guides/rest-api/authorization/',
  description: 'Trello project management and collaboration platform',
  requiredScopes: ['read'],
  scopeDelimiter: ',',
  requiresPKCE: false, // PKCE requirement for enhanced security
  additionalParams: { 
    response_type: 'token',
    scope: 'read,write,account'
  },
  scopes: {
    'Basic': {
      'read': { name: 'Read', description: 'Read boards, lists, and cards', required: true },
      'write': { name: 'Write', description: 'Create and modify boards, lists, and cards' },
      'account': { name: 'Account', description: 'Access account information' }
    }
  }
};


export { trello };



