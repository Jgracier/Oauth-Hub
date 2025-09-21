/**
 * 📌 PINTEREST PLATFORM CONFIGURATION
 * Complete OAuth configuration for Pinterest API
 */

export const pinterest = {
  name: 'Pinterest',
  displayName: 'Pinterest',
  icon: '📌',
  color: '#bd081c',
  authUrl: 'https://www.pinterest.com/oauth/',
  tokenUrl: 'https://api.pinterest.com/v5/oauth/token',
  userInfoUrl: 'https://api.pinterest.com/v5/user_account',
  userIdField: 'id',
  docsUrl: 'https://developers.pinterest.com/',
  description: 'Access Pinterest API for boards and pins',
  requiredScopes: ['user_accounts:read'],
  scopeDelimiter: ',',
  additionalParams: { response_type: 'code' },
  scopes: {
    'User Account': {
      'user_accounts:read': { name: 'User Account Read', description: 'Read user account information', required: true }
    },
    'Boards': {
      'boards:read': { name: 'Boards Read', description: 'Read boards and board information' },
      'boards:write': { name: 'Boards Write', description: 'Create, edit, and delete boards' },
      'boards:read_secret': { name: 'Boards Read Secret', description: 'Read secret boards' },
      'boards:write_secret': { name: 'Boards Write Secret', description: 'Create and edit secret boards' }
    },
    'Pins': {
      'pins:read': { name: 'Pins Read', description: 'Read pins and pin information' },
      'pins:write': { name: 'Pins Write', description: 'Create, edit, and delete pins' },
      'pins:read_secret': { name: 'Pins Read Secret', description: 'Read secret pins' },
      'pins:write_secret': { name: 'Pins Write Secret', description: 'Create and edit secret pins' }
    },
    'Advertising': {
      'ads:read': { name: 'Ads Read', description: 'Read advertising account information' },
      'ads:write': { name: 'Ads Write', description: 'Create and manage advertising campaigns' }
    },
    'Catalogs': {
      'catalogs:read': { name: 'Catalogs Read', description: 'Read product catalog information' },
      'catalogs:write': { name: 'Catalogs Write', description: 'Create and manage product catalogs' }
    }
  }
};
