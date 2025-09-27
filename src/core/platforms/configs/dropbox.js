/**
 * 📦 DROPBOX PLATFORM CONFIGURATION
 * Complete OAuth configuration for Dropbox API
 */

const dropbox = {
  name: 'Dropbox',
  displayName: 'Dropbox',
  icon: '📦',
  color: '#0061ff',
  authUrl: 'https://www.dropbox.com/oauth2/authorize',
  tokenUrl: 'https://api.dropboxapi.com/oauth2/token',
  userInfoUrl: 'https://api.dropboxapi.com/2/users/get_current_account',
  userIdField: 'account_id',
  revokeUrl: null, // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://developers.dropbox.com/oauth-guide',
  description: 'Dropbox cloud storage and file sharing platform',
  requiredScopes: ['files.metadata.read'],
  scopeDelimiter: ' ',
  requiresPKCE: false, // PKCE requirement for enhanced security
  additionalParams: { 
    response_type: 'code',
    token_access_type: 'offline' // For refresh tokens
  },
  scopes: {
    'Files': {
      'files.metadata.read': { name: 'Files Metadata Read', description: 'View file and folder metadata', required: true },
      'files.metadata.write': { name: 'Files Metadata Write', description: 'Edit file and folder metadata' },
      'files.content.read': { name: 'Files Content Read', description: 'View file contents' },
      'files.content.write': { name: 'Files Content Write', description: 'Edit file contents' }
    },
    'Sharing': {
      'sharing.read': { name: 'Sharing Read', description: 'View shared links and folder members' },
      'sharing.write': { name: 'Sharing Write', description: 'Create and modify shared links and folder permissions' }
    },
    'Account': {
      'account_info.read': { name: 'Account Info Read', description: 'View account information' }
    }
  }
};


export { dropbox };



