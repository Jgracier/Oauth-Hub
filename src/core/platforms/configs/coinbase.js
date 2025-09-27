/**
 * ₿ COINBASE PLATFORM CONFIGURATION
 * Complete OAuth configuration for Coinbase API
 */

const coinbase = {
  name: 'Coinbase',
  displayName: 'Coinbase',
  icon: '₿',
  color: '#0052ff',
  authUrl: 'https://www.coinbase.com/oauth/authorize',
  tokenUrl: 'https://api.coinbase.com/oauth/token',
  userInfoUrl: 'https://api.coinbase.com/v2/user',
  userIdField: 'data.id',
  revokeUrl: null, // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://developers.coinbase.com/docs/wallet/coinbase-connect',
  description: 'Coinbase cryptocurrency platform',
  requiredScopes: ['wallet:user:read'],
  scopeDelimiter: ' ',
  requiresPKCE: false, // PKCE requirement for enhanced security
  additionalParams: { response_type: 'code' },
  scopes: {
    'User Information': {
      'wallet:user:read': { name: 'User Read', description: 'View basic user information', required: true },
      'wallet:user:email': { name: 'User Email', description: 'Access user email address' },
      'wallet:user:update': { name: 'User Update', description: 'Update user information' }
    },
    'Accounts': {
      'wallet:accounts:read': { name: 'Accounts Read', description: 'View account information and balances' },
      'wallet:accounts:create': { name: 'Accounts Create', description: 'Create new cryptocurrency accounts' },
      'wallet:accounts:update': { name: 'Accounts Update', description: 'Update account information' },
      'wallet:accounts:delete': { name: 'Accounts Delete', description: 'Delete cryptocurrency accounts' }
    },
    'Transactions': {
      'wallet:transactions:read': { name: 'Transactions Read', description: 'View transaction history and details' },
      'wallet:transactions:send': { name: 'Transactions Send', description: 'Send cryptocurrency to other users' },
      'wallet:transactions:request': { name: 'Transactions Request', description: 'Request cryptocurrency from other users' },
      'wallet:transactions:transfer': { name: 'Transactions Transfer', description: 'Transfer between own accounts' }
    },
    'Addresses': {
      'wallet:addresses:read': { name: 'Addresses Read', description: 'View cryptocurrency addresses' },
      'wallet:addresses:create': { name: 'Addresses Create', description: 'Generate new cryptocurrency addresses' }
    },
    'Buys & Sells': {
      'wallet:buys:read': { name: 'Buys Read', description: 'View buy order history' },
      'wallet:buys:create': { name: 'Buys Create', description: 'Place buy orders' },
      'wallet:sells:read': { name: 'Sells Read', description: 'View sell order history' },
      'wallet:sells:create': { name: 'Sells Create', description: 'Place sell orders' }
    },
    'Deposits & Withdrawals': {
      'wallet:deposits:read': { name: 'Deposits Read', description: 'View deposit history' },
      'wallet:deposits:create': { name: 'Deposits Create', description: 'Make deposits' },
      'wallet:withdrawals:read': { name: 'Withdrawals Read', description: 'View withdrawal history' },
      'wallet:withdrawals:create': { name: 'Withdrawals Create', description: 'Make withdrawals' }
    },
    'Payment Methods': {
      'wallet:payment-methods:read': { name: 'Payment Methods Read', description: 'View linked payment methods' },
      'wallet:payment-methods:limits': { name: 'Payment Methods Limits', description: 'View payment method limits' }
    },
    'Notifications': {
      'wallet:notifications:read': { name: 'Notifications Read', description: 'View account notifications' }
    },
    'Checkouts': {
      'wallet:checkouts:read': { name: 'Checkouts Read', description: 'View checkout information' },
      'wallet:checkouts:create': { name: 'Checkouts Create', description: 'Create payment checkouts' }
    },
    'Orders': {
      'wallet:orders:read': { name: 'Orders Read', description: 'View order information' },
      'wallet:orders:create': { name: 'Orders Create', description: 'Create orders' }
    }
  }
};


module.exports = { coinbase };

