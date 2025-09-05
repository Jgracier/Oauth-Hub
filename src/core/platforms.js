/**
 * Centralized Platform Configurations
 * All OAuth platform settings, URLs, and metadata in one place
 */

export const PLATFORMS = {
  google: {
    name: 'Google',
    displayName: 'Google',
    icon: '🔍',
    color: '#4285f4',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    userIdField: 'id',
    docsUrl: 'https://console.cloud.google.com/',
    description: 'Access Google services like YouTube, Drive, Gmail',
    requiredScopes: ['openid', 'email', 'profile'],
    availableScopes: [
      { scope: 'https://www.googleapis.com/auth/drive', description: 'Full access to Google Drive files' },
      { scope: 'https://www.googleapis.com/auth/drive.readonly', description: 'View Google Drive files' },
      { scope: 'https://www.googleapis.com/auth/drive.file', description: 'Access files created by this app' },
      { scope: 'https://www.googleapis.com/auth/drive.metadata', description: 'View and manage metadata of files' },
      { scope: 'https://www.googleapis.com/auth/youtube', description: 'Manage YouTube account' },
      { scope: 'https://www.googleapis.com/auth/youtube.readonly', description: 'View YouTube account' },
      { scope: 'https://www.googleapis.com/auth/youtube.upload', description: 'Upload videos to YouTube' },
      { scope: 'https://www.googleapis.com/auth/youtube.force-ssl', description: 'View and manage YouTube videos' },
      { scope: 'https://www.googleapis.com/auth/gmail.readonly', description: 'Read Gmail messages' }
    ]
  },

  facebook: {
    name: 'Facebook',
    displayName: 'Facebook',
    icon: '📘',
    color: '#1877f2',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    userInfoUrl: 'https://graph.facebook.com/me?fields=id,name,email',
    userIdField: 'id',
    docsUrl: 'https://developers.facebook.com/',
    description: 'Access Facebook Graph API for posts, pages, and user data',
    requiredScopes: ['email'],
    availableScopes: [
      { scope: 'public_profile', description: 'Access public profile information' },
      { scope: 'email', description: 'Access email address' },
      { scope: 'pages_read_engagement', description: 'Read page posts and engagement data' },
      { scope: 'pages_manage_posts', description: 'Create, edit and delete page posts' },
      { scope: 'pages_show_list', description: 'Access list of pages you manage' }
    ]
  },

  instagram: {
    name: 'Instagram',
    displayName: 'Instagram',
    icon: '📷',
    color: '#e4405f',
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    userInfoUrl: 'https://graph.instagram.com/me?fields=id,username',
    userIdField: 'id',
    docsUrl: 'https://developers.facebook.com/',
    description: 'Access Instagram Basic Display API for media and profile',
    requiredScopes: ['user_profile'],
    availableScopes: [
      { scope: 'user_profile', description: 'Access profile information' },
      { scope: 'user_media', description: 'Access media (photos and videos)' }
    ]
  },

  twitter: {
    name: 'Twitter',
    displayName: 'X (Twitter)',
    icon: '🐦',
    color: '#1da1f2',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    userInfoUrl: 'https://api.twitter.com/2/users/me',
    userIdField: 'id',
    docsUrl: 'https://developer.x.com/',
    description: 'Access X (Twitter) API v2 for tweets, users, and engagement',
    requiredScopes: ['tweet.read', 'users.read'],
    availableScopes: [
      { scope: 'tweet.read', description: 'Read tweets' },
      { scope: 'tweet.write', description: 'Create and delete tweets' },
      { scope: 'users.read', description: 'Read user profile information' },
      { scope: 'follows.read', description: 'Read following and followers lists' },
      { scope: 'follows.write', description: 'Follow and unfollow users' }
    ]
  },

  linkedin: {
    name: 'LinkedIn',
    displayName: 'LinkedIn',
    icon: '💼',
    color: '#0077b5',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    userInfoUrl: 'https://api.linkedin.com/v2/people/~?projection=(id,firstName,lastName,emailAddress)',
    userIdField: 'id',
    docsUrl: 'https://developer.linkedin.com/',
    description: 'Access LinkedIn APIs for profile and company data',
    requiredScopes: ['r_liteprofile', 'r_emailaddress'],
    availableScopes: [
      { scope: 'r_liteprofile', description: 'Access basic profile information' },
      { scope: 'r_emailaddress', description: 'Access email address' },
      { scope: 'w_member_social', description: 'Post on behalf of user' },
      { scope: 'r_organization_social', description: 'Read organization posts' }
    ]
  },

  tiktok: {
    name: 'TikTok',
    displayName: 'TikTok',
    icon: '🎵',
    color: '#ff0050',
    authUrl: 'https://www.tiktok.com/auth/authorize/',
    tokenUrl: 'https://open-api.tiktok.com/oauth/access_token/',
    userInfoUrl: 'https://open-api.tiktok.com/oauth/userinfo/?fields=open_id,union_id,avatar_url,display_name',
    userIdField: 'open_id',
    docsUrl: 'https://developers.tiktok.com/',
    description: 'Access TikTok for Developers API',
    requiredScopes: ['user.info.basic'],
    availableScopes: [
      { scope: 'user.info.basic', description: 'Access basic user information' },
      { scope: 'video.list', description: 'Access user video list' },
      { scope: 'video.upload', description: 'Upload videos' }
    ]
  },

  discord: {
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
    availableScopes: [
      { scope: 'identify', description: 'Access basic user information' },
      { scope: 'email', description: 'Access email address' },
      { scope: 'guilds', description: 'Access list of guilds user is in' },
      { scope: 'bot', description: 'Add bot to guild' }
    ]
  },

  pinterest: {
    name: 'Pinterest',
    displayName: 'Pinterest',
    icon: '📌',
    color: '#bd081c',
    authUrl: 'https://www.pinterest.com/oauth/',
    tokenUrl: 'https://api.pinterest.com/v5/oauth/token',
    userInfoUrl: 'https://api.pinterest.com/v5/user_account',
    userIdField: 'id',
    docsUrl: 'https://developers.pinterest.com/',
    description: 'Access Pinterest API for boards and pins',
    requiredScopes: ['user_accounts:read'],
    availableScopes: [
      { scope: 'user_accounts:read', description: 'Read user account information' },
      { scope: 'boards:read', description: 'Read boards' },
      { scope: 'boards:write', description: 'Create and edit boards' },
      { scope: 'pins:read', description: 'Read pins' },
      { scope: 'pins:write', description: 'Create and edit pins' }
    ]
  },

  wordpress: {
    name: 'WordPress',
    displayName: 'WordPress.com',
    icon: '📝',
    color: '#21759b',
    authUrl: 'https://public-api.wordpress.com/oauth2/authorize',
    tokenUrl: 'https://public-api.wordpress.com/oauth2/token',
    userInfoUrl: 'https://public-api.wordpress.com/rest/v1/me',
    userIdField: 'ID',
    docsUrl: 'https://developer.wordpress.com/apps/',
    description: 'Access WordPress.com API for sites and posts',
    requiredScopes: ['auth'],
    availableScopes: [
      { scope: 'auth', description: 'Authenticate and access basic profile' },
      { scope: 'global', description: 'Access all sites and perform all actions' }
    ]
  },

  reddit: {
    name: 'Reddit',
    displayName: 'Reddit',
    icon: '🤖',
    color: '#ff4500',
    authUrl: 'https://www.reddit.com/api/v1/authorize',
    tokenUrl: 'https://www.reddit.com/api/v1/access_token',
    userInfoUrl: 'https://oauth.reddit.com/api/v1/me',
    userIdField: 'id',
    docsUrl: 'https://www.reddit.com/dev/api/',
    description: 'Access Reddit API for posts and user data',
    requiredScopes: ['identity'],
    availableScopes: [
      { scope: 'identity', description: 'Access user identity' },
      { scope: 'read', description: 'Read posts and comments' },
      { scope: 'submit', description: 'Submit posts and comments' },
      { scope: 'vote', description: 'Vote on posts and comments' }
    ]
  },

  github: {
    name: 'GitHub',
    displayName: 'GitHub',
    icon: '🐙',
    color: '#333333',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    userIdField: 'id',
    docsUrl: 'https://github.com/settings/developers',
    description: 'Access GitHub API for repositories and user data',
    requiredScopes: ['user:email'],
    availableScopes: [
      { scope: 'user', description: 'Access user profile information' },
      { scope: 'user:email', description: 'Access user email addresses' },
      { scope: 'repo', description: 'Access repositories' },
      { scope: 'public_repo', description: 'Access public repositories' }
    ]
  },

  spotify: {
    name: 'Spotify',
    displayName: 'Spotify',
    icon: '🎵',
    color: '#1db954',
    authUrl: 'https://accounts.spotify.com/authorize',
    tokenUrl: 'https://accounts.spotify.com/api/token',
    userInfoUrl: 'https://api.spotify.com/v1/me',
    userIdField: 'id',
    docsUrl: 'https://developer.spotify.com/dashboard',
    description: 'Access Spotify Web API for music and playlists',
    requiredScopes: ['user-read-private'],
    availableScopes: [
      { scope: 'user-read-private', description: 'Access user profile information' },
      { scope: 'user-read-email', description: 'Access user email address' },
      { scope: 'playlist-read-private', description: 'Read private playlists' },
      { scope: 'playlist-modify-public', description: 'Modify public playlists' }
    ]
  },

  twitch: {
    name: 'Twitch',
    displayName: 'Twitch',
    icon: '🎮',
    color: '#9146ff',
    authUrl: 'https://id.twitch.tv/oauth2/authorize',
    tokenUrl: 'https://id.twitch.tv/oauth2/token',
    userInfoUrl: 'https://api.twitch.tv/helix/users',
    userIdField: 'id',
    docsUrl: 'https://dev.twitch.tv/console',
    description: 'Access Twitch API for streams and user data',
    requiredScopes: ['user:read:email'],
    availableScopes: [
      { scope: 'user:read:email', description: 'Read user email address' },
      { scope: 'channel:read:subscriptions', description: 'Read channel subscriptions' },
      { scope: 'bits:read', description: 'Read Bits information' }
    ]
  },

  slack: {
    name: 'Slack',
    displayName: 'Slack',
    icon: '💬',
    color: '#4a154b',
    authUrl: 'https://slack.com/oauth/v2/authorize',
    tokenUrl: 'https://slack.com/api/oauth.v2.access',
    userInfoUrl: 'https://slack.com/api/users.identity',
    userIdField: 'id',
    docsUrl: 'https://api.slack.com/apps',
    description: 'Access Slack API for messaging and workspace data',
    requiredScopes: ['users:read'],
    availableScopes: [
      { scope: 'users:read', description: 'View people in workspace' },
      { scope: 'chat:write', description: 'Send messages' },
      { scope: 'channels:read', description: 'View basic information about channels' }
    ]
  },

  microsoft: {
    name: 'Microsoft',
    displayName: 'Microsoft',
    icon: '🏢',
    color: '#0078d4',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
    userIdField: 'id',
    docsUrl: 'https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps',
    description: 'Access Microsoft Graph API for Office 365 and Azure',
    requiredScopes: ['User.Read'],
    availableScopes: [
      { scope: 'User.Read', description: 'Read user profile' },
      { scope: 'Mail.Read', description: 'Read user mail' },
      { scope: 'Files.Read', description: 'Read user files' },
      { scope: 'Calendars.Read', description: 'Read user calendars' }
    ]
  }
};

// Helper functions for easy access
export function getPlatform(platformName) {
  const platform = PLATFORMS[platformName.toLowerCase()];
  if (!platform) {
    throw new Error(`Unsupported platform: ${platformName}`);
  }
  return platform;
}

export function getAllPlatforms() {
  return Object.keys(PLATFORMS);
}

export function getPlatformNames() {
  return Object.keys(PLATFORMS).map(key => ({
    key,
    name: PLATFORMS[key].name,
    displayName: PLATFORMS[key].displayName
  }));
}

export function getPlatformScopes(platformName) {
  const platform = getPlatform(platformName);
  return {
    required: platform.requiredScopes,
    available: platform.availableScopes
  };
}
