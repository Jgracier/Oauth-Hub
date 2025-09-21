/**
 * 📦 AMAZON PLATFORM CONFIGURATION
 * Complete OAuth configuration for Amazon Login
 */

export const amazon = {
  name: 'Amazon',
  displayName: 'Amazon',
  icon: '📦',
  color: '#ff9900',
  authUrl: 'https://www.amazon.com/ap/oa',
  tokenUrl: 'https://api.amazon.com/auth/o2/token',
  userInfoUrl: 'https://api.amazon.com/user/profile',
  userIdField: 'user_id',
  docsUrl: 'https://developer.amazon.com/docs/login-with-amazon/web-docs.html',
  description: 'Login with Amazon for e-commerce and AWS integration',
  requiredScopes: ['profile'],
  scopeDelimiter: ' ',
  additionalParams: { response_type: 'code' },
  scopes: {
    'Profile': {
      'profile': { name: 'Profile', description: 'Access basic profile information', required: true },
      'profile:user_id': { name: 'User ID', description: 'Access unique user identifier' }
    },
    'Contact': {
      'postal_code': { name: 'Postal Code', description: 'Access user\'s postal code for shipping' }
    }
  }
};
