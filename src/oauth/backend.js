// =============================================================================
// 🛠️ SIMPLIFIED OAUTH BACKEND - Core OAuth functionality
// =============================================================================

// Platform configurations
export function getPlatformConfig(platform, app) {
  const configs = {
    google: {
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo'
    },
    facebook: {
      authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
      tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
      userInfoUrl: 'https://graph.facebook.com/me'
    },
    instagram: {
      authUrl: 'https://api.instagram.com/oauth/authorize',
      tokenUrl: 'https://api.instagram.com/oauth/access_token',
      userInfoUrl: 'https://graph.instagram.com/me'
    },
    twitter: {
      authUrl: 'https://twitter.com/i/oauth2/authorize',
      tokenUrl: 'https://api.twitter.com/2/oauth2/token',
      userInfoUrl: 'https://api.twitter.com/2/users/me'
    },
    linkedin: {
      authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
      userInfoUrl: 'https://api.linkedin.com/v2/people/~'
    },
    tiktok: {
      authUrl: 'https://www.tiktok.com/auth/authorize/',
      tokenUrl: 'https://open-api.tiktok.com/oauth/access_token/',
      userInfoUrl: 'https://open-api.tiktok.com/oauth/userinfo/'
    },
    discord: {
      authUrl: 'https://discord.com/api/oauth2/authorize',
      tokenUrl: 'https://discord.com/api/oauth2/token',
      userInfoUrl: 'https://discord.com/api/users/@me'
    },
    pinterest: {
      authUrl: 'https://www.pinterest.com/oauth/',
      tokenUrl: 'https://api.pinterest.com/v5/oauth/token',
      userInfoUrl: 'https://api.pinterest.com/v5/user_account'
    },
    wordpress: {
      authUrl: 'https://public-api.wordpress.com/oauth2/authorize',
      tokenUrl: 'https://public-api.wordpress.com/oauth2/token',
      userInfoUrl: 'https://public-api.wordpress.com/rest/v1/me'
    },
    reddit: {
      authUrl: 'https://www.reddit.com/api/v1/authorize',
      tokenUrl: 'https://www.reddit.com/api/v1/access_token',
      userInfoUrl: 'https://oauth.reddit.com/api/v1/me'
    },
    github: {
      authUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      userInfoUrl: 'https://api.github.com/user'
    },
    spotify: {
      authUrl: 'https://accounts.spotify.com/authorize',
      tokenUrl: 'https://accounts.spotify.com/api/token',
      userInfoUrl: 'https://api.spotify.com/v1/me'
    },
    twitch: {
      authUrl: 'https://id.twitch.tv/oauth2/authorize',
      tokenUrl: 'https://id.twitch.tv/oauth2/token',
      userInfoUrl: 'https://api.twitch.tv/helix/users'
    },
    slack: {
      authUrl: 'https://slack.com/oauth/v2/authorize',
      tokenUrl: 'https://slack.com/api/oauth.v2.access',
      userInfoUrl: 'https://slack.com/api/users.identity'
    },
    microsoft: {
      authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      userInfoUrl: 'https://graph.microsoft.com/v1.0/me'
    }
  };

  const config = configs[platform.toLowerCase()];
  if (!config) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  return {
    ...config,
    clientId: app.clientId,
    clientSecret: app.clientSecret,
    redirectUri: app.redirectUri,
    scopes: app.scopes
  };
}

// Generate OAuth consent URL
export function generateConsentUrl(platform, app, state, baseUrl) {
  const config = getPlatformConfig(platform, app);
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: 'https://oauth-handler.socialoauth.workers.dev/callback',
    scope: config.scopes.join(' '),
    response_type: 'code',
    state: state || `${platform}_${Date.now()}`
  });

  return `${config.authUrl}?${params.toString()}`;
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(platform, code, app) {
  const config = getPlatformConfig(platform, app);
  
  const tokenData = {
    grant_type: 'authorization_code',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    code: code
  };

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(tokenData).toString()
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  const tokens = await response.json();
  
  // Normalize token response format
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    tokenType: tokens.token_type || 'bearer',
    expiresIn: tokens.expires_in,
    expiresAt: tokens.expires_in ? Date.now() + (tokens.expires_in * 1000) : null,
    scope: tokens.scope
  };
}

// Get user info from platform
export async function getUserInfo(platform, accessToken) {
  const configs = {
    google: 'https://www.googleapis.com/oauth2/v2/userinfo',
    facebook: 'https://graph.facebook.com/me?fields=id,name,email',
    instagram: 'https://graph.instagram.com/me?fields=id,username',
    twitter: 'https://api.twitter.com/2/users/me',
    linkedin: 'https://api.linkedin.com/v2/people/~?projection=(id,firstName,lastName,emailAddress)',
    tiktok: 'https://open-api.tiktok.com/oauth/userinfo/?fields=open_id,union_id,avatar_url,display_name',
    discord: 'https://discord.com/api/users/@me',
    pinterest: 'https://api.pinterest.com/v5/user_account',
    wordpress: 'https://public-api.wordpress.com/rest/v1/me',
    reddit: 'https://oauth.reddit.com/api/v1/me',
    github: 'https://api.github.com/user',
    spotify: 'https://api.spotify.com/v1/me',
    twitch: 'https://api.twitch.tv/helix/users',
    slack: 'https://slack.com/api/users.identity',
    microsoft: 'https://graph.microsoft.com/v1.0/me'
  };

  const url = configs[platform.toLowerCase()];
  if (!url) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.status}`);
  }

  const userInfo = await response.json();
  
  // Normalize user ID field based on platform
  let platformUserId;
  switch (platform.toLowerCase()) {
    case 'google':
    case 'facebook':
    case 'instagram':
    case 'twitter':
    case 'discord':
      platformUserId = userInfo.id;
      break;
    case 'linkedin':
      platformUserId = userInfo.id;
      break;
    case 'tiktok':
      platformUserId = userInfo.data?.user?.open_id || userInfo.open_id;
      break;
    case 'pinterest':
      platformUserId = userInfo.id;
      break;
    case 'wordpress':
      platformUserId = userInfo.ID;
      break;
    case 'reddit':
      platformUserId = userInfo.id || userInfo.name;
      break;
    case 'github':
      platformUserId = userInfo.id;
      break;
    case 'spotify':
      platformUserId = userInfo.id;
      break;
    case 'twitch':
      platformUserId = userInfo.data?.[0]?.id || userInfo.id;
      break;
    case 'slack':
      platformUserId = userInfo.user?.id || userInfo.id;
      break;
    case 'microsoft':
      platformUserId = userInfo.id;
      break;
    default:
      platformUserId = userInfo.id || userInfo.user_id;
  }

  return {
    platformUserId: platformUserId.toString(),
    userInfo
  };
}

// Refresh access token
export async function refreshAccessToken(platform, refreshToken, app) {
  const config = getPlatformConfig(platform, app);
  
  const tokenData = {
    grant_type: 'refresh_token',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: refreshToken
  };

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: new URLSearchParams(tokenData).toString()
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  const tokens = await response.json();
  
  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token || refreshToken, // Some platforms don't return new refresh token
    tokenType: tokens.token_type || 'bearer',
    expiresIn: tokens.expires_in,
    expiresAt: tokens.expires_in ? Date.now() + (tokens.expires_in * 1000) : null,
    scope: tokens.scope
  };
}

// Get stored tokens with optional auto-refresh
export async function getStoredTokens(platformUserId, platform, env, autoRefresh = true) {
  const tokenKey = `token:${platform}:${platformUserId}`;
  const storedData = await env.OAUTH_TOKENS.get(tokenKey);
  
  if (!storedData) {
    return null;
  }

  let tokenData = JSON.parse(storedData);
  
  // Check if token is expired and auto-refresh is enabled
  if (autoRefresh && tokenData.expiresAt && tokenData.expiresAt < Date.now()) {
    if (tokenData.refreshToken) {
      try {
        // We need the app config to refresh, but we don't have it here
        // For now, return expired token and let the client handle refresh
        return {
          ...tokenData,
          expired: true
        };
      } catch (error) {
        console.error('Token refresh failed:', error);
        return {
          ...tokenData,
          expired: true,
          refreshError: error.message
        };
      }
    }
  }

  return {
    accessToken: tokenData.accessToken,
    tokenType: tokenData.tokenType || 'bearer',
    expiresAt: tokenData.expiresAt,
    platform: platform,
    platformUserId: platformUserId
  };
}

// Refresh stored tokens
export async function refreshStoredTokens(platformUserId, platform, env, app) {
  const tokenKey = `token:${platform}:${platformUserId}`;
  const storedData = await env.OAUTH_TOKENS.get(tokenKey);
  
  if (!storedData) {
    return null;
  }

  const tokenData = JSON.parse(storedData);
  
  if (!tokenData.refreshToken) {
    throw new Error('No refresh token available');
  }

  const newTokens = await refreshAccessToken(platform, tokenData.refreshToken, app);
  
  // Update stored tokens
  const updatedTokenData = {
    ...tokenData,
    ...newTokens,
    updatedAt: new Date().toISOString()
  };

  await env.OAUTH_TOKENS.put(tokenKey, JSON.stringify(updatedTokenData));
  
  return {
    accessToken: newTokens.accessToken,
    tokenType: newTokens.tokenType || 'bearer',
    expiresAt: newTokens.expiresAt,
    platform: platform,
    platformUserId: platformUserId
  };
}

// Store tokens after OAuth callback
export async function storeTokens(platformUserId, platform, tokens, userInfo, env) {
  const tokenKey = `token:${platform}:${platformUserId}`;
  
  const tokenData = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    tokenType: tokens.tokenType || 'bearer',
    expiresIn: tokens.expiresIn,
    expiresAt: tokens.expiresAt,
    scope: tokens.scope,
    platform: platform,
    platformUserId: platformUserId,
    userInfo: userInfo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await env.OAUTH_TOKENS.put(tokenKey, JSON.stringify(tokenData));
  
  return tokenData;
}