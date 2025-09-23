/**
 * 🎯 FIGMA PLATFORM CONFIGURATION
 * Complete OAuth configuration for Figma API
 */

export const figma = {
  name: 'Figma',
  displayName: 'Figma',
  icon: '🎨',
  color: '#F24E1E',
  authUrl: 'https://www.figma.com/oauth',
  tokenUrl: 'https://www.figma.com/api/oauth/token',
  userInfoUrl: 'https://api.figma.com/v1/me',
  userIdField: 'id',
  docsUrl: 'https://www.figma.com/developers/api#oauth2',
  description: 'Access Figma files and designs',
  requiredScopes: ['file:read'],
  scopeDelimiter: ' ',
  additionalParams: { response_type: 'code' },
  requiresPKCE: true,
  authMethod: 'post',
  scopes: {
    'Files': {
      'file:read': { name: 'Read Files', description: 'View files', required: true },
      'file:write': { name: 'Write Files', description: 'Edit files' }
    },
    'Accounts': {
      'account:read': { name: 'Account Info', description: 'View account details' }
    }
  }
};
