/**
 * 📝 NOTION PLATFORM CONFIGURATION
 * Complete OAuth configuration for Notion API
 */

export const notion = {
  name: 'Notion',
  displayName: 'Notion',
  icon: '📝',
  color: '#000000',
  authUrl: 'https://api.notion.com/v1/oauth/authorize',
  tokenUrl: 'https://api.notion.com/v1/oauth/token',
  userInfoUrl: 'https://api.notion.com/v1/users/me',
  userIdField: 'id',
  docsUrl: 'https://developers.notion.com/reference/intro',
  description: 'Access Notion pages and databases',
  requiredScopes: ['read', 'write'],
  scopeDelimiter: ' ',
  additionalParams: { response_type: 'code' },
  requiresPKCE: true,
  authMethod: 'post',
  scopes: {
    'Pages': {
      'read': { name: 'Read Pages', description: 'View pages and databases', required: true },
      'write': { name: 'Write Pages', description: 'Edit pages and databases' }
    }
  }
};
