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
  docsUrl: 'https://developers.notion.com/docs/authorization',
  description: 'Notion workspace and productivity platform',
  requiredScopes: ['read'],
  scopeDelimiter: ' ',
  additionalParams: { response_type: 'code' },
  scopes: {
    'Basic': {
      'read': { name: 'Read', description: 'Read pages, databases, and blocks', required: true },
      'write': { name: 'Write', description: 'Create and modify pages, databases, and blocks' }
    }
  }
};
