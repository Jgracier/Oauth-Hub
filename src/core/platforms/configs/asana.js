/**
 * ✅ ASANA PLATFORM CONFIGURATION
 * Complete OAuth configuration for Asana API
 */

const asana = {
  name: 'Asana',
  displayName: 'Asana',
  icon: '✅',
  color: '#f06a6a',
  authUrl: 'https://app.asana.com/-/oauth_authorize',
  tokenUrl: 'https://app.asana.com/-/oauth_token',
  userInfoUrl: 'https://app.asana.com/api/1.0/users/me',
  userIdField: 'data.gid',
  revokeUrl: null, // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://developers.asana.com/docs/oauth',
  description: 'Asana task and project management platform',
  requiredScopes: ['default'],
  scopeDelimiter: ' ',
  requiresPKCE: false, // PKCE requirement for enhanced security
  additionalParams: { response_type: 'code' },
  scopes: {
    'Basic': {
      'default': { name: 'Default', description: 'Access tasks, projects, and workspaces', required: true }
    }
  }
};


module.exports = { asana };

