// =============================================================================
// 🛠️ SIMPLIFIED OAUTH BACKEND - Core OAuth functionality
// =============================================================================

import { CONFIG } from '../../core/config.js';
import { getPlatform } from '../../core/platforms.js';

// Platform configurations
export function getPlatformConfig(platform, app) {
  const platformConfig = getPlatform(platform);

  return {
    authUrl: platformConfig.authUrl,
    tokenUrl: platformConfig.tokenUrl,
    userInfoUrl: platformConfig.userInfoUrl,
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
    redirect_uri: CONFIG.WWW_CALLBACK_URL,
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
  const platformConfig = getPlatform(platform);
  const url = platformConfig.userInfoUrl;

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
  const platformConfigForUserId = getPlatform(platform);
  let platformUserId;
  
  // Handle special cases for user ID extraction
  switch (platform.toLowerCase()) {
    case 'tiktok':
      platformUserId = userInfo.data?.user?.open_id || userInfo.open_id;
      break;
    case 'wordpress':
      platformUserId = userInfo.ID;
      break;
    case 'reddit':
      platformUserId = userInfo.id || userInfo.name;
      break;
    case 'twitch':
      platformUserId = userInfo.data?.[0]?.id || userInfo.id;
      break;
    case 'slack':
      platformUserId = userInfo.user?.id || userInfo.id;
      break;
    default:
      // Use the configured userIdField or fallback to 'id'
      const idField = platformConfigForUserId.userIdField || 'id';
      platformUserId = userInfo[idField] || userInfo.id || userInfo.user_id;
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