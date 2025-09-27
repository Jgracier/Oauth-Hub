/**
 * 📁 BOX PLATFORM CONFIGURATION
 * Complete OAuth configuration for Box API
 */

const box = {
  name: 'Box',
  displayName: 'Box',
  icon: '📁',
  color: '#0061d5',
  authUrl: 'https://account.box.com/api/oauth2/authorize',
  tokenUrl: 'https://api.box.com/oauth2/token',
  userInfoUrl: 'https://api.box.com/2.0/users/me',
  userIdField: 'id',
  revokeUrl: null, // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://developer.box.com/guides/authentication/oauth2/',
  description: 'Box enterprise cloud storage and collaboration platform',
  requiredScopes: ['root_readwrite'],
  scopeDelimiter: ' ',
  requiresPKCE: false, // PKCE requirement for enhanced security
  additionalParams: { response_type: 'code' },
  scopes: {
    'Basic': {
      'root_readonly': { name: 'Root Read Only', description: 'Read access to all files and folders' },
      'root_readwrite': { name: 'Root Read Write', description: 'Read/write access to all files and folders', required: true }
    }
  }
};


export { box };



