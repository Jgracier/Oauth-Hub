/**
 * 🎯 FIGMA PLATFORM CONFIGURATION
 * Complete OAuth configuration for Figma API
 */

export const figma = {
  name: 'Figma',
  displayName: 'Figma',
  icon: '🎯',
  color: '#f24e1e',
  authUrl: 'https://www.figma.com/oauth',
  tokenUrl: 'https://www.figma.com/api/oauth/token',
  userInfoUrl: 'https://api.figma.com/v1/me',
  userIdField: 'id',
  docsUrl: 'https://www.figma.com/developers/api#authentication',
  description: 'Figma collaborative design platform',
  requiredScopes: ['file_read'],
  scopeDelimiter: ' ',
  additionalParams: { 
    response_type: 'code',
    scope: 'file_read'
  },
  scopes: {
    'Files': {
      'file_read': { name: 'File Read', description: 'Read access to files and projects', required: true }
    }
  }
};
