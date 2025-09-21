/**
 * 🖌️ CANVA PLATFORM CONFIGURATION
 * Complete OAuth configuration for Canva API
 */

export const canva = {
  name: 'Canva',
  displayName: 'Canva',
  icon: '🖌️',
  color: '#00c4cc',
  authUrl: 'https://www.canva.com/api/oauth/authorize',
  tokenUrl: 'https://api.canva.com/rest/v1/oauth/token',
  userInfoUrl: 'https://api.canva.com/rest/v1/users/me',
  userIdField: 'id',
  docsUrl: 'https://www.canva.dev/docs/connect/authentication/',
  description: 'Canva design platform and API',
  requiredScopes: ['design:read'],
  scopeDelimiter: ' ',
  additionalParams: { response_type: 'code' },
  scopes: {
    'Design': {
      'design:read': { name: 'Design Read', description: 'Read designs and folders', required: true },
      'design:write': { name: 'Design Write', description: 'Create and modify designs' }
    },
    'Assets': {
      'asset:read': { name: 'Asset Read', description: 'Read brand assets and uploads' },
      'asset:write': { name: 'Asset Write', description: 'Upload and manage assets' }
    }
  }
};
