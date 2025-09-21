/**
 * 🎮 STEAM PLATFORM CONFIGURATION
 * Complete OAuth configuration for Steam OpenID
 */

export const steam = {
  name: 'Steam',
  displayName: 'Steam',
  icon: '🎮',
  color: '#1b2838',
  authUrl: 'https://steamcommunity.com/openid/login',
  tokenUrl: 'https://steamcommunity.com/openid/login', // OpenID flow
  userInfoUrl: 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/',
  userIdField: 'steamid',
  docsUrl: 'https://steamcommunity.com/dev',
  description: 'Steam gaming platform (OpenID)',
  requiredScopes: ['identity'],
  scopeDelimiter: ' ',
  additionalParams: { 
    'openid.mode': 'checkid_setup',
    'openid.ns': 'http://specs.openid.net/auth/2.0'
  },
  scopes: {
    'Basic': {
      'identity': { name: 'Identity', description: 'Access Steam profile information', required: true }
    }
  }
};
