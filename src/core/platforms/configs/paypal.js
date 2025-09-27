/**
 * 💰 PAYPAL PLATFORM CONFIGURATION
 * Complete OAuth configuration for PayPal APIs
 */

const paypal = {
  name: 'PayPal',
  displayName: 'PayPal',
  icon: '💰',
  color: '#0070ba',
  authUrl: 'https://www.paypal.com/signin/authorize',
  tokenUrl: 'https://api.paypal.com/v1/oauth2/token',
  userInfoUrl: 'https://api.paypal.com/v1/identity/oauth2/userinfo',
  userIdField: 'user_id',
  revokeUrl: null, // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://developer.paypal.com/docs/log-in-with-paypal/',
  description: 'PayPal authentication and payment processing',
  requiredScopes: ['openid'],
  scopeDelimiter: ' ',
  requiresPKCE: false, // PKCE requirement for enhanced security
  additionalParams: { response_type: 'code' },
  scopes: {
    'Authentication': {
      'openid': { name: 'OpenID Connect', description: 'Basic authentication with PayPal', required: true }
    },
    'Profile': {
      'profile': { name: 'Profile', description: 'Access basic profile information' },
      'email': { name: 'Email', description: 'Access email address' },
      'address': { name: 'Address', description: 'Access address information' },
      'phone': { name: 'Phone', description: 'Access phone number' }
    },
    'Payments': {
      'https://uri.paypal.com/services/payments/payment': { name: 'Payments', description: 'Create and manage payments' },
      'https://uri.paypal.com/services/payments/refund': { name: 'Refunds', description: 'Process refunds' },
      'https://uri.paypal.com/services/payments/payment/authcapture': { name: 'Auth Capture', description: 'Authorize and capture payments' }
    }
  }
};


module.exports = { paypal };

