/**
 * OAuth Service - Core OAuth flow implementations
 */

import { PLATFORMS } from '../index.js';

/**
 * Generate OAuth consent URL for a platform
 */
export async function generateConsentUrl(platform, userApp, apiKey, state, redirectUri) {
  const platformConfig = PLATFORMS[platform];
  if (!platformConfig) {
    throw new Error(`Platform ${platform} not found`);
  }

  const params = new URLSearchParams({
    client_id: userApp.clientId,
    redirect_uri: redirectUri,
    scope: userApp.scopes.join(' '),
    response_type: 'code',
    state: state
  });

  return `${platformConfig.authUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(platform, code, userApp, redirectUri) {
  const platformConfig = PLATFORMS[platform];
  if (!platformConfig) {
    throw new Error(`Platform ${platform} not found`);
  }

  const response = await fetch(platformConfig.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: userApp.clientId,
      client_secret: userApp.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    })
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get user information from platform
 */
export async function getUserInfo(platform, accessToken, userApp) {
  const platformConfig = PLATFORMS[platform];
  if (!platformConfig) {
    throw new Error(`Platform ${platform} not found`);
  }

  const response = await fetch(platformConfig.userInfoUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`User info request failed: ${response.status}`);
  }

  return await response.json();
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(platform, refreshToken, userApp) {
  const platformConfig = PLATFORMS[platform];
  if (!platformConfig) {
    throw new Error(`Platform ${platform} not found`);
  }

  const response = await fetch(platformConfig.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: userApp.clientId,
      client_secret: userApp.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  return await response.json();
}
