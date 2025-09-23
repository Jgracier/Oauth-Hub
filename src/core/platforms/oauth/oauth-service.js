/**
 * 🔧 OAUTH SERVICE
 * Core OAuth flow logic separated from platform configurations
 * Handles consent URL generation, token exchange, and user info retrieval
 */

// Note: PLATFORMS will be imported lazily to avoid circular dependencies
import { AuthorizationCode } from 'simple-oauth2';
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

    // Parse URLs properly for simple-oauth2
    const tokenUrl = new URL(platformConfig.tokenUrl);
    const authUrl = new URL(platformConfig.authUrl);

    // Create simple-oauth2 client config
    const clientConfig = {
      client: {
        id: userApp.clientId,
        secret: userApp.clientSecret
      },
      auth: {
        tokenHost: tokenUrl.origin, // Use full origin instead of just host
        tokenPath: tokenUrl.pathname,
        authorizeHost: authUrl.origin, // Use full origin instead of just host
        authorizePath: authUrl.pathname
      },
      options: {
        // Remove useBasicAuthorizationHeader as it's not allowed
      }
    };

    const client = new AuthorizationCode(clientConfig);

    const authUrlOptions = {
      redirect_uri: `${baseUrl}/callback`,
      scope: scopeString, // Back to string - simple-oauth2 expects string
      state: state,
      ...platformConfig.additionalParams
    };

    const authorizationUri = client.authorizeURL(authUrlOptions);

    return authorizationUri; // Caller (router) can access if needed
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
    // Parse URLs properly for simple-oauth2
    const tokenUrl = new URL(platformConfig.tokenUrl);
    const authUrl = new URL(platformConfig.authUrl);

    const clientConfig = {
      client: {
        id: userApp.clientId,
        secret: userApp.clientSecret
      },
      auth: {
        tokenHost: tokenUrl.origin, // Use full origin instead of just host
        tokenPath: tokenUrl.pathname,
        authorizeHost: authUrl.origin, // Use full origin instead of just host
        authorizePath: authUrl.pathname
      },
      options: {
        // Remove useBasicAuthorizationHeader as it's not allowed
      }
    };

    // Platform-specific options - simplified for now
    // TODO: Add platform-specific options back after fixing basic config

    const client = new AuthorizationCode(clientConfig);

    const tokenOptions = {
      code,
      redirect_uri: 'https://oauth-hub.com/callback'
    };

    // PKCE verifier is handled internally by simple-oauth2

    const result = await client.getToken(tokenOptions);
    const token = result.token;

    // Use package normalization, add expiresAt
    const normalized = {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      tokenType: token.token_type || 'Bearer',
      expiresIn: token.expires_in,
      expiresAt: token.expires_in ? Date.now() + (token.expires_in * 1000) : null,
      scope: token.scope
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
    const clientConfig = {
      client: {
        id: userApp.clientId,
        secret: userApp.clientSecret
      },
      auth: {
        tokenHost: new URL(platformConfig.tokenUrl).host,
        tokenPath: new URL(platformConfig.tokenUrl).pathname
      },
      options: {
        useBasicAuthorizationHeader: true
      }
    };

    const client = new AuthorizationCode(clientConfig);

    const result = await client.getToken({
      refresh_token: refreshToken
    });

    const token = result.token;

    return {
      accessToken: token.access_token,
      refreshToken: token.refresh_token || refreshToken, // Keep old if not new
      tokenType: token.token_type || 'Bearer',
      expiresIn: token.expires_in,
      expiresAt: token.expires_in ? Date.now() + (token.expires_in * 1000) : null,
      scope: token.scope
    };
  } catch (error) {
    throw new Error(`[${platform}] Token refresh failed: ${error.message}`);
  }
}

export async function revokeToken(platform, accessToken, userApp, env) {
  const { PLATFORMS } = await import('../index.js');
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  
  const clientConfig = {
    client: { id: userApp.clientId, secret: userApp.clientSecret },
    auth: { 
      tokenHost: new URL(platformConfig.tokenUrl).host, 
      tokenPath: new URL(platformConfig.tokenUrl).pathname + '/revoke' // Or specific revoke URL if different
    },
    options: { useBasicAuthorizationHeader: true }
  };
  
  const client = new AuthorizationCode(clientConfig);
  await client.revokeToken({ token: accessToken });
}
