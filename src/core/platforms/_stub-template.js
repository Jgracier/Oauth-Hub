export const _stubTemplate = {
  name: 'Platform',
  displayName: 'Platform Name',
  icon: '🔗',
  color: '#4F46E5',
  authUrl: 'https://api.platform.com/oauth/authorize',
  tokenUrl: 'https://api.platform.com/oauth/token',
  userInfoUrl: 'https://api.platform.com/v1/user',
  userIdField: 'id',
  docsUrl: 'https://docs.platform.com/oauth',
  description: 'Platform integration',
  requiredScopes: ['basic'],
  scopeDelimiter: ' ',
  additionalParams: { response_type: 'code' },
  requiresPKCE: true,
  authMethod: 'query',
  scopes: {
    'Basic': {
      'basic': { name: 'Basic Access', description: 'Basic read access', required: true },
      'read': { name: 'Read', description: 'Read data' },
      'write': { name: 'Write', description: 'Write data' }
    }
  }
};
