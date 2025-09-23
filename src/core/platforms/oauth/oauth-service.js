/**
 * 🔧 OAUTH SERVICE
 * Core OAuth flow logic separated from platform configurations
 * Handles consent URL generation, token exchange, and user info retrieval
 */

// Note: PLATFORMS will be imported lazily to avoid circular dependencies
import { normalizeTokenResponse } from './token-manager.js';
import { extractPlatformUserId } from './user-info-extractor.js';

/**
 * Generate OAuth consent URL with required scopes automatically included
 */
export async function generateConsentUrl(platform, userApp, apiKey, state, baseUrl = 'https://oauth-hub.com') {
  const { PLATFORMS } = await import('../index.js');
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  if (!platformConfig) {
    throw new Error(`[${platform}] Unsupported platform`);
  }

  try {
    // Merge required and user scopes
    const requiredScopes = platformConfig.requiredScopes || [];
    const userScopes = userApp.scopes || [];
    const allScopes = [...new Set([...requiredScopes, ...userScopes])];
    const scopeString = allScopes.join(platformConfig.scopeDelimiter || ' ');

    // Build URL parameters manually (Workers-compatible)
    const params = new URLSearchParams({
      client_id: userApp.clientId,
      redirect_uri: `${baseUrl}/callback`,
      response_type: 'code',
      scope: scopeString,
      state: state,
      ...platformConfig.additionalParams
    });

    const authUrl = new URL(platformConfig.authUrl);
    authUrl.search = params.toString();

    return authUrl.toString();
  } catch (error) {
    throw new Error(`[${platform}] Failed to generate consent URL: ${error.message}`);
  }
}

/**
 * Exchange authorization code for access token with platform-specific handling
 */
export async function exchangeCodeForToken(platform, code, userApp, baseUrl = 'https://oauth-hub.com') {
  const { PLATFORMS } = await import('../index.js');
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  if (!platformConfig) {
    throw new Error(`[${platform}] Unsupported platform`);
  }

  try {
    // Build token exchange request manually (Workers-compatible)
    const params = new URLSearchParams({
      client_id: userApp.clientId,
      client_secret: userApp.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: `${baseUrl}/callback`
    });

    // Platform-specific handling
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    // Some platforms require basic auth instead of form params
    if (platformConfig.authMethod === 'basic') {
      const credentials = btoa(`${userApp.clientId}:${userApp.clientSecret}`);
      headers['Authorization'] = `Basic ${credentials}`;
      // Remove client_secret from body for basic auth
      params.delete('client_secret');
    }

    const response = await fetch(platformConfig.tokenUrl, {
      method: 'POST',
      headers: headers,
      body: params.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
    }

    const tokenData = await response.json();

    // Normalize token response
    const normalized = normalizeTokenResponse(platform, tokenData);
    return normalized;
  } catch (error) {
    throw new Error(`[${platform}] Token exchange failed: ${error.message}`);
  }
}

/**
 * Get user info from OAuth provider with platform-specific handling
 */
export async function getUserInfo(platform, accessToken) {
  // Lazy import to avoid circular dependency
  const { PLATFORMS } = await import('../index.js');
  
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  if (!platformConfig) {
    throw new Error(`[${platform}] Unsupported platform`);
  }

  try {
    // Build platform-specific headers
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    };

    // Add platform-specific headers
    switch (platform.toLowerCase()) {
      case 'github':
        headers['User-Agent'] = 'OAuth-Hub/1.0';
        break;
      case 'twitch':
        headers['Client-ID'] = platformConfig.clientId;
        break;
      case 'shopify':
        headers['X-Shopify-Access-Token'] = accessToken;
        delete headers['Authorization'];
        break;
      case 'stripe':
        headers['Stripe-Version'] = '2020-08-27';
        break;
      case 'adobe':
        headers['x-api-key'] = platformConfig.clientId;
        break;
      case 'hubspot':
        headers['Content-Type'] = 'application/json';
        break;
      case 'zoom':
        headers['User-Agent'] = 'OAuth-Hub/1.0';
        break;
      case 'salesforce':
        headers['Accept'] = 'application/json';
        break;
      case 'dropbox':
        headers['Dropbox-API-Select-User'] = platformConfig.selectUser || '';
        break;
      case 'box':
        headers['BoxApi'] = `shared_link=${platformConfig.sharedLink || ''}`;
        break;
      case 'steam':
        if (platformConfig.apiKey) {
          headers['Authorization'] = `Bearer ${platformConfig.apiKey}`;
        }
        break;
      case 'notion':
        headers['Notion-Version'] = '2022-06-28';
        break;
      case 'figma':
        headers['X-Figma-Token'] = accessToken;
        delete headers['Authorization'];
        break;
    }

    const response = await fetch(platformConfig.userInfoUrl, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`User info fetch failed: ${response.status} ${errorText}`);
    }

    const rawUserInfo = await response.json();
    
    // Extract platform user ID using platform-specific logic
    const platformUserId = extractPlatformUserId(platform, rawUserInfo, platformConfig);
    
    if (!platformUserId) {
      throw new Error(`Could not extract user ID from response`);
    }

    return {
      platformUserId: platformUserId.toString(),
      userInfo: rawUserInfo
    };
  } catch (error) {
    throw new Error(`[${platform}] Get user info failed: ${error.message}`);
  }
}

/**
 * Refresh OAuth access token with platform-specific handling
 */
export async function refreshAccessToken(platform, refreshToken, userApp) {
  const { PLATFORMS } = await import('../index.js');
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  if (!platformConfig) {
    throw new Error(`[${platform}] Unsupported platform`);
  }

  const noRefreshPlatforms = ['github', 'shopify', 'trello', 'notion', 'dribbble', 'unsplash', 'netflix', 'steam'];
  if (noRefreshPlatforms.includes(platform.toLowerCase())) {
    throw new Error(`[${platform}] Tokens do not expire and cannot be refreshed`);
  }

  try {
    // Build refresh token request manually (Workers-compatible)
    const params = new URLSearchParams({
      client_id: userApp.clientId,
      client_secret: userApp.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    });

    const response = await fetch(platformConfig.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
    }

    const tokenData = await response.json();

    // Normalize token response
    const normalized = normalizeTokenResponse(platform, tokenData);
    return normalized;
  } catch (error) {
    throw new Error(`[${platform}] Token refresh failed: ${error.message}`);
  }
}

export async function revokeToken(platform, accessToken, userApp, env) {
  const { PLATFORMS } = await import('../index.js');
  const platformConfig = PLATFORMS[platform.toLowerCase()];

  if (!platformConfig) {
    throw new Error(`[${platform}] Unsupported platform`);
  }

  try {
    // Try platform-specific revocation endpoints
    let revokeUrl;
    let revokeParams;
    let headers = {};

    switch (platform.toLowerCase()) {
      case 'google':
        revokeUrl = 'https://oauth2.googleapis.com/revoke';
        revokeParams = new URLSearchParams({ token: accessToken });
        break;
      case 'github':
        // GitHub doesn't have a revoke endpoint - just delete locally
        return true;
      case 'microsoft':
        revokeUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/logout';
        revokeParams = new URLSearchParams({ post_logout_redirect_uri: 'https://oauth-hub.com' });
        break;
      default:
        // For platforms without revoke endpoints, just log and return success
        console.log(`[${platform}] No revocation endpoint available - token will expire naturally`);
        return true;
    }

    if (revokeUrl) {
      const response = await fetch(revokeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...headers
        },
        body: revokeParams.toString()
      });

      if (!response.ok) {
        console.warn(`[${platform}] Revocation may have failed: ${response.status} ${await response.text()}`);
      }
    }

    return true;
  } catch (error) {
    console.error(`[${platform}] Token revocation failed: ${error.message}`);
    // Don't throw - revocation failure shouldn't break the flow
    return false;
  }
}
