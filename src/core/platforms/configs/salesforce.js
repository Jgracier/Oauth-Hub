/**
 * ☁️ SALESFORCE PLATFORM CONFIGURATION
 * Complete OAuth configuration for Salesforce APIs
 */

export const salesforce = {
  name: 'Salesforce',
  displayName: 'Salesforce',
  icon: '☁️',
  color: '#00a1e0',
  authUrl: 'https://login.salesforce.com/services/oauth2/authorize',
  tokenUrl: 'https://login.salesforce.com/services/oauth2/token',
  userInfoUrl: 'https://login.salesforce.com/services/oauth2/userinfo',
  userIdField: 'user_id',
  docsUrl: 'https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm',
  description: 'Salesforce CRM and cloud platform integration',
  requiredScopes: ['openid'],
  scopeDelimiter: ' ',
  additionalParams: { response_type: 'code' },
  scopes: {
    'Authentication': {
      'openid': { name: 'OpenID Connect', description: 'Basic authentication', required: true },
      'id': { name: 'Identity', description: 'Access identity information' },
      'profile': { name: 'Profile', description: 'Access profile information' }
    },
    'Data Access': {
      'api': { name: 'API Access', description: 'Access Salesforce APIs' },
      'web': { name: 'Web Access', description: 'Access Salesforce web interface' },
      'full': { name: 'Full Access', description: 'Full access to all data' }
    },
    'Refresh': {
      'refresh_token': { name: 'Refresh Token', description: 'Obtain refresh tokens for offline access' }
    }
  }
};
