/**
 * 🔧 OAUTH SERVICE
 * Core OAuth flow logic separated from platform configurations
 * Handles consent URL generation, token exchange, and user info retrieval
 */

// Note: PLATFORMS will be imported lazily to avoid circular dependencies
import { OAuth2Client } from '@badgateway/oauth2-client';
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

    // Create OAuth2 client using @badgateway/oauth2-client
    const client = new OAuth2Client({
      clientId: userApp.clientId,
      clientSecret: userApp.clientSecret,
      authorizationEndpoint: platformConfig.authUrl,
      tokenEndpoint: platformConfig.tokenUrl
    });

    const authorizationUri = client.authorizationCode.getAuthorizeUri({
      redirectUri: `${baseUrl}/callback`,
      scope: allScopes, // Pass as array
      state: state,
      ...platformConfig.additionalParams
    });

    return authorizationUri;
  } catch (error) {
    throw new Error(`[${platform}] Failed to generate consent URL: ${error.message}`);
  }
}

/**
 * Exchange authorization code for access token with platform-specific handling
 */
export async function exchangeCodeForToken(platform, code, userApp) {
  const { PLATFORMS } = await import('../index.js');
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  if (!platformConfig) {
    throw new Error(`[${platform}] Unsupported platform`);
  }

  try {
    // Create OAuth2 client using @badgateway/oauth2-client
    const client = new OAuth2Client({
      clientId: userApp.clientId,
      clientSecret: userApp.clientSecret,
      authorizationEndpoint: platformConfig.authUrl,
      tokenEndpoint: platformConfig.tokenUrl
    });

    // Platform-specific handling
    let tokenEndpoint = platformConfig.tokenUrl;
    switch (platform.toLowerCase()) {
      case 'shopify':
        // Handle shopDomain if in userApp
        if (userApp.shopDomain) {
          tokenEndpoint = `https://${userApp.shopDomain}.myshopify.com/admin/oauth/access_token`;
        }
        break;
    }

    const token = await client.authorizationCode.getToken({
      code,
      redirectUri: 'https://oauth-hub.com/callback'
    });

    // Normalize token response
    const normalized = {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken || null,
      tokenType: token.tokenType || 'Bearer',
      expiresIn: token.expiresIn || null,
      expiresAt: token.expiresIn ? Date.now() + (token.expiresIn * 1000) : null,
      scope: token.scope || null
    };

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
    // Create OAuth2 client using @badgateway/oauth2-client
    const client = new OAuth2Client({
      clientId: userApp.clientId,
      clientSecret: userApp.clientSecret,
      authorizationEndpoint: platformConfig.authUrl,
      tokenEndpoint: platformConfig.tokenUrl
    });

    const token = await client.refreshToken.getToken({
      refreshToken: refreshToken
    });

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken || refreshToken, // Keep old if not new
      tokenType: token.tokenType || 'Bearer',
      expiresIn: token.expiresIn || null,
      expiresAt: token.expiresIn ? Date.now() + (token.expiresIn * 1000) : null,
      scope: token.scope || null
    };
  } catch (error) {
    throw new Error(`[${platform}] Token refresh failed: ${error.message}`);
  }
}

export async function revokeToken(platform, accessToken, userApp, env) {
  const { PLATFORMS } = await import('../index.js');
  const platformConfig = PLATFORMS[platform.toLowerCase()];

  // Create OAuth2 client using @badgateway/oauth2-client
  const client = new OAuth2Client({
    clientId: userApp.clientId,
    clientSecret: userApp.clientSecret,
    authorizationEndpoint: platformConfig.authUrl,
    tokenEndpoint: platformConfig.tokenUrl
  });

  // Check if platform supports revocation
  const revokeUrl = platformConfig.revokeUrl || `${new URL(platformConfig.tokenUrl).origin}/oauth/revoke`;

  try {
    await client.revokeToken({
      token: accessToken,
      revokeEndpoint: revokeUrl
    });
  } catch (error) {
    // Some platforms may not support revocation, log but don't fail
    console.log(`[${platform}] Token revocation not supported or failed: ${error.message}`);
    throw new Error(`[${platform}] Token revocation failed: ${error.message}`);
  }
}
