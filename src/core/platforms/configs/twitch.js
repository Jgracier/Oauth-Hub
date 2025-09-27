/**
 * 🎮 TWITCH PLATFORM CONFIGURATION
 * Complete OAuth configuration for Twitch API
 */

const twitch = {
  name: 'Twitch',
  displayName: 'Twitch',
  icon: '🎮',
  color: '#9146ff',
  authUrl: 'https://id.twitch.tv/oauth2/authorize',
  tokenUrl: 'https://id.twitch.tv/oauth2/token',
  userInfoUrl: 'https://api.twitch.tv/helix/users',
  userIdField: 'id',
  revokeUrl: 'https://id.twitch.tv/oauth2/revoke', // OAuth token revocation endpoint
  introspectUrl: null, // OAuth token introspection endpoint
  docsUrl: 'https://dev.twitch.tv/console',
  description: 'Access Twitch API for streams and user data',
  requiredScopes: ['user:read:email'],
  scopeDelimiter: ' ',
  requiresPKCE: false, // PKCE requirement for enhanced security
  additionalParams: { response_type: 'code' },
  scopes: {
    'User': {
      'user:read:email': { name: 'User Read Email', description: 'Read user email address', required: true },
      'user:read:follows': { name: 'User Read Follows', description: 'Read user follows' },
      'user:read:subscriptions': { name: 'User Read Subscriptions', description: 'Read user subscriptions' },
      'user:read:blocked_users': { name: 'User Read Blocked Users', description: 'Read blocked users' },
      'user:manage:blocked_users': { name: 'User Manage Blocked Users', description: 'Manage blocked users' }
    },
    'Channel': {
      'channel:read:subscriptions': { name: 'Channel Read Subscriptions', description: 'Read channel subscriptions' },
      'channel:read:hype_train': { name: 'Channel Read Hype Train', description: 'Read hype train events' },
      'channel:read:stream_key': { name: 'Channel Read Stream Key', description: 'Read channel stream key' },
      'channel:manage:broadcast': { name: 'Channel Manage Broadcast', description: 'Manage channel broadcast settings' },
      'channel:manage:extensions': { name: 'Channel Manage Extensions', description: 'Manage channel extensions' },
      'channel:manage:moderators': { name: 'Channel Manage Moderators', description: 'Manage channel moderators' },
      'channel:manage:polls': { name: 'Channel Manage Polls', description: 'Manage channel polls' },
      'channel:manage:predictions': { name: 'Channel Manage Predictions', description: 'Manage channel predictions' },
      'channel:manage:raids': { name: 'Channel Manage Raids', description: 'Manage channel raids' },
      'channel:manage:redemptions': { name: 'Channel Manage Redemptions', description: 'Manage channel point redemptions' },
      'channel:manage:schedule': { name: 'Channel Manage Schedule', description: 'Manage channel schedule' },
      'channel:manage:videos': { name: 'Channel Manage Videos', description: 'Manage channel videos' },
      'channel:read:editors': { name: 'Channel Read Editors', description: 'Read channel editors' },
      'channel:manage:ads': { name: 'Channel Manage Ads', description: 'Manage channel ads' }
    },
    'Bits': {
      'bits:read': { name: 'Bits Read', description: 'Read Bits information' }
    },
    'Analytics': {
      'analytics:read:extensions': { name: 'Analytics Read Extensions', description: 'Read extension analytics' },
      'analytics:read:games': { name: 'Analytics Read Games', description: 'Read game analytics' }
    },
    'Clips': {
      'clips:edit': { name: 'Clips Edit', description: 'Create and edit clips' }
    },
    'Moderation': {
      'moderation:read': { name: 'Moderation Read', description: 'Read moderation actions' },
      'moderator:manage:announcements': { name: 'Moderator Manage Announcements', description: 'Manage channel announcements' },
      'moderator:manage:automod': { name: 'Moderator Manage AutoMod', description: 'Manage AutoMod settings' },
      'moderator:manage:automod_settings': { name: 'Moderator Manage AutoMod Settings', description: 'Manage AutoMod configuration' },
      'moderator:manage:banned_users': { name: 'Moderator Manage Banned Users', description: 'Manage banned users' },
      'moderator:manage:chat_messages': { name: 'Moderator Manage Chat Messages', description: 'Manage chat messages' },
      'moderator:manage:chat_settings': { name: 'Moderator Manage Chat Settings', description: 'Manage chat settings' }
    },
    'Chat': {
      'chat:edit': { name: 'Chat Edit', description: 'Send chat messages' },
      'chat:read': { name: 'Chat Read', description: 'Read chat messages' }
    },
    'Whispers': {
      'whispers:read': { name: 'Whispers Read', description: 'Read whisper messages' },
      'whispers:edit': { name: 'Whispers Edit', description: 'Send whisper messages' }
    }
  }
};


module.exports = { twitch };

