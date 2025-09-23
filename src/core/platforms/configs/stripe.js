/**
 * 💳 STRIPE PLATFORM CONFIGURATION
 * Complete OAuth configuration for Stripe Connect
 */

export const stripe = {
  name: 'Stripe',
  displayName: 'Stripe',
  icon: '💳',
  color: '#635BFF',
  authUrl: 'https://connect.stripe.com/oauth/authorize',
  tokenUrl: 'https://connect.stripe.com/oauth/token',
  userInfoUrl: 'https://api.stripe.com/v1/account',
  userIdField: 'id',
  docsUrl: 'https://docs.stripe.com/connect/oauth',
  description: 'Connect to Stripe accounts for payments',
  requiredScopes: ['read_write'],
  scopeDelimiter: ' ',
  additionalParams: { response_type: 'code', stripe_landing: 'login' },
  requiresPKCE: true,
  authMethod: 'query',
  scopes: {
    'Connect': {
      'read_write': { name: 'Full Access', description: 'Read and write access to Stripe account data', required: true },
      'read_only': { name: 'Read Only', description: 'Read-only access to account data' }
    }
  }
};
