/**
 * 🎮 DISCORD PLATFORM CONFIGURATION
 * Complete OAuth configuration for Discord API
 */

export const discord = {
  name: 'Discord',
  displayName: 'Discord',
  icon: '🎮',
  color: '#5865f2',
  authUrl: 'https://discord.com/api/oauth2/authorize',
  tokenUrl: 'https://discord.com/api/oauth2/token',
  userInfoUrl: 'https://discord.com/api/users/@me',
  userIdField: 'id',
  docsUrl: 'https://discord.com/developers/',
  description: 'Access Discord API for bot and user functionality',
  requiredScopes: ['identify'],
  scopeDelimiter: ' ',
  additionalParams: { response_type: 'code' },
  scopes: {
    'User': {
      'identify': { name: 'Identify', description: 'Access basic user information', required: true },
      'email': { name: 'Email', description: 'Access email address' },
      'connections': { name: 'Connections', description: 'Access linked third-party accounts' }
    },
    'Guilds': {
      'guilds': { name: 'Guilds', description: 'Access list of guilds user is in' },
      'guilds.join': { name: 'Guilds Join', description: 'Join guilds on behalf of user' },
      'guilds.members.read': { name: 'Guild Members Read', description: 'Read guild member information' }
    },
    'Bot': {
      'bot': { name: 'Bot', description: 'Add bot to guild with basic permissions' }
    }
  }
};
