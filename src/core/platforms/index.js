// Platforms configuration for OAuth integrations
export const PLATFORMS = {
  google: {
    displayName: 'Google',
    icon: '🔵',
    description: 'Google OAuth 2.0',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    requiredScopes: ['openid', 'profile', 'email'],
    scopeDelimiter: ' ',
    additionalParams: {
      access_type: 'offline',
      prompt: 'consent'
    }
  },
  github: {
    displayName: 'GitHub',
    icon: '🐙',
    description: 'GitHub OAuth 2.0',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    requiredScopes: ['user:email', 'read:user'],
    scopeDelimiter: ' ',
    additionalParams: {}
  }
};
