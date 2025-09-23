/**
 * 📦 DROPBOX PLATFORM CONFIGURATION
 * Complete OAuth configuration for Dropbox API
 */

export const dropbox = {
  name: 'Dropbox',
  displayName: 'Dropbox',
  icon: '📁',
  color: '#0061FE',
  authUrl: 'https://www.dropbox.com/oauth2/authorize',
  tokenUrl: 'https://api.dropboxapi.com/oauth2/token',
  userInfoUrl: 'https://api.dropboxapi.com/2/users/get_current_account',
  userIdField: 'account_id',
  docsUrl: 'https://www.dropbox.com/developers/reference/oauth-guide',
  description: 'Access Dropbox files and storage',
  requiredScopes: [],
  scopeDelimiter: ' ',
  additionalParams: { response_type: 'code', token_access_type: 'offline' },
  requiresPKCE: true,
  authMethod: 'post',
  scopes: {
    'Files': {
      'files.content.read': { name: 'Read Files', description: 'View files and folders' },
      'files.content.write': { name: 'Write Files', description: 'Upload and modify files' },
      'files.metadata.read': { name: 'Metadata Read', description: 'View file metadata' },
      'files.metadata.write': { name: 'Metadata Write', description: 'Modify file metadata' }
    },
    'Sharing': {
      'sharing.read': { name: 'Sharing Read', description: 'View shared links' },
      'sharing.write': { name: 'Sharing Write', description: 'Create shared links' }
    },
    'Team': {
      'team_data.member': { name: 'Team Member', description: 'Access team member data' }
    }
  }
};
