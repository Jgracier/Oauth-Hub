/**
 * 🐵 MAILCHIMP PLATFORM CONFIGURATION
 * Complete OAuth configuration for Mailchimp API
 */

export const mailchimp = {
  name: 'Mailchimp',
  displayName: 'Mailchimp',
  icon: '🐵',
  color: '#ffe01b',
  authUrl: 'https://login.mailchimp.com/oauth2/authorize',
  tokenUrl: 'https://login.mailchimp.com/oauth2/token',
  userInfoUrl: 'https://login.mailchimp.com/oauth2/metadata',
  userIdField: 'user_id',
  docsUrl: 'https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/',
  description: 'Mailchimp email marketing and automation platform',
  requiredScopes: ['read'],
  scopeDelimiter: ' ',
  additionalParams: { response_type: 'code' },
  scopes: {
    'Basic': {
      'read': { name: 'Read', description: 'Read account and campaign data', required: true },
      'write': { name: 'Write', description: 'Create and modify campaigns and lists' }
    }
  }
};
