/**
 * 💳 STRIPE PLATFORM CONFIGURATION
 * Complete OAuth configuration for Stripe Connect
 */

const stripe = {
  name: 'Stripe',
  displayName: 'Stripe',
  icon: '💳',
  color: '#635bff',
  authUrl: 'https://connect.stripe.com/oauth/authorize',
  tokenUrl: 'https://connect.stripe.com/oauth/token',
  userInfoUrl: 'https://api.stripe.com/v1/account',
  userIdField: 'id',
  revokeUrl: null, // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://stripe.com/docs/connect/oauth-reference',
  description: 'Stripe Connect for payment processing and marketplace platforms',
  requiredScopes: ['read_only'],
  scopeDelimiter: ' ',
  requiresPKCE: false, // PKCE requirement for enhanced security
  additionalParams: { response_type: 'code' },
  scopes: {
    'General Access': {
      'read_only': { name: 'Read Only', description: 'Read-only access to all account resources', required: true },
      'read_write': { name: 'Read Write', description: 'Read and write access to all account resources' }
    }
  }
};


module.exports = { stripe };

