/**
 * 🔧 OAUTH SERVICE
 * Core OAuth flow logic using simple-oauth2 package
 * Handles consent URL generation, token exchange, and user info retrieval
 */

// Note: PLATFORMS will be imported lazily to avoid circular dependencies
import { AuthorizationCode, AccessToken } from 'simple-oauth2';
import { extractPlatformUserId } from './user-info-extractor.js';
import { generateState, parseState, validateOAuthResponse, sanitizeForLogging, buildErrorMessage } from './utils.js';

/**
 * Create OAuth2 client for a platform
 */
function createOAuthClient(platformConfig, userApp, forRefresh = false) {
  const baseUrl = new URL(platformConfig.authUrl);
  const tokenUrl = new URL(platformConfig.tokenUrl || platformConfig.authUrl);
  
  const clientConfig = {
    client: {
      id: userApp.clientId,
      secret: userApp.clientSecret
    },
    auth: {
      tokenHost: tokenUrl.origin,
      tokenPath: tokenUrl.pathname,
      authorizeHost: baseUrl.origin,
      authorizePath: baseUrl.pathname
    },
    options: {
      useBasicAuthorizationHeader: true, // Most providers
      useBodyAuth: false, // Override per platform if needed
      usePkce: platformConfig.requiresPKCE !== false // Default PKCE for security
    }
  };

  if (forRefresh) {
    return new AccessToken(clientConfig, { access_token: '', refresh_token: '', token_type: 'Bearer' });
  }
  return new AuthorizationCode(clientConfig);
}

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
    // Combine required scopes with user-selected scopes
    const requiredScopes = platformConfig.requiredScopes || [];
    const userScopes = userApp.scopes || [];
    const allScopes = [...new Set([...requiredScopes, ...userScopes])];
    const scopeString = allScopes.join(platformConfig.scopeDelimiter || ' ');

    const client = createOAuthClient(platformConfig, userApp);

    // Platform-specific options (minimal switch)
    let authOptions = {
      redirect_uri: `${baseUrl}/callback`,
      scope: scopeString,
      state: state
    };

    // Add additional params from config
    Object.assign(authOptions, platformConfig.additionalParams);

    const authorizationUri = client.authorizeURL(authOptions);
    return authorizationUri;
  } catch (error) {
    throw new Error(`[${platform}] Failed to generate consent URL: ${error.message}`);
  }
}

/**
 * Exchange authorization code for access token with platform-specific handling
 */
export async function exchangeCodeForToken(platform, code, userApp, codeVerifier = null) {
  const { PLATFORMS } = await import('../index.js');
  
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  if (!platformConfig) {
    throw new Error(`[${platform}] Unsupported platform`);
  }

  try {
    const client = createOAuthClient(platformConfig, userApp);

    let tokenOptions = {
      code,
      redirect_uri: 'https://oauth-hub.com/callback'
    };

    // Platform-specific token options (minimal switch)
    switch (platform.toLowerCase()) {
      case 'github':
        client.options.useBodyAuth = true; // GitHub uses POST body for client_id/secret
        break;
      case 'slack':
        tokenOptions.client_id = userApp.clientId;
        tokenOptions.client_secret = userApp.clientSecret;
        break;
      case 'shopify':
        // Assume shopDomain from userApp or config
        const shopDomain = userApp.shopDomain || 'shop';
        client.auth.tokenHost = `${shopDomain}.myshopify.com`;
        break;
    }

    const token = await client.getToken(tokenOptions);

    // Package normalizes: token.token = { access_token, refresh_token, expires_in, etc. }
    const normalized = {
      accessToken: token.token.access_token,
      refreshToken: token.token.refresh_token,
      tokenType: token.token.token_type || 'Bearer',
      expiresIn: token.token.expires_in,
      scope: token.token.scope
    };

    // Calculate expiresAt
    if (normalized.expiresIn) {
      normalized.expiresAt = Date.now() + (normalized.expiresIn * 1000);
    }

    return normalized;
  } catch (error) {
    throw new Error(`[${platform}] Token exchange failed: ${error.message}`);
  }
}

/**
 * Get user info from OAuth provider with platform-specific handling
 */
export async function getUserInfo(platform, accessToken) {
  const { PLATFORMS } = await import('../index.js');
  
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  if (!platformConfig) {
    throw new Error(`[${platform}] Unsupported platform`);
  }

  try {
    // Build headers (Bearer default)
    let headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    };

    // Minimal switch for custom headers
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
      case 'figma':
        headers['X-Figma-Token'] = accessToken;
        delete headers['Authorization'];
        break;
      case 'notion':
        headers['Notion-Version'] = '2022-06-28';
        break;
    }

    const response = await fetch(platformConfig.userInfoUrl, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`User info fetch failed: ${response.status} ${errorText}`);
    }

    const rawUserInfo = await response.json();
    
    // Extract ID (keep existing logic)
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

  // Platforms without refresh (package will error if unsupported)
  const noRefreshPlatforms = ['github', 'shopify', 'trello', 'notion', 'dribbble', 'unsplash', 'netflix', 'steam'];
  if (noRefreshPlatforms.includes(platform.toLowerCase())) {
    throw new Error(`[${platform}] Tokens do not expire and cannot be refreshed`);
  }

  try {
    const client = createOAuthClient(platformConfig, userApp, true); // AccessToken for refresh

    const oldToken = { refresh_token: refreshToken };
    const refreshed = await client.refresh(oldToken);

    // Normalized from package
    const normalized = {
      accessToken: refreshed.token.access_token,
      refreshToken: refreshed.token.refresh_token || refreshToken, // Keep old if not returned
      tokenType: refreshed.token.token_type || 'Bearer',
      expiresIn: refreshed.token.expires_in,
      scope: refreshed.token.scope
    };

    if (normalized.expiresIn) {
      normalized.expiresAt = Date.now() + (normalized.expiresIn * 1000);
    }

    return normalized;
  } catch (error) {
    throw new Error(`[${platform}] Token refresh failed: ${error.message}`);
  }
}

/**
 * New: Authenticate a provider for login/signup (Google/GitHub)
 * Uses same logic as platform flows but with env vars
 */
export async function authenticateProvider(platform, code, clientId, clientSecret, redirectUri) {
  const hardcodedConfigs = {
    google: {
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
      scope: 'openid email profile',
      additionalParams: { access_type: 'offline', prompt: 'consent' }
    },
    github: {
      authUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      userInfoUrl: 'https://api.github.com/user',
      scope: 'user:email',
      additionalParams: {}
    }
  };

  const config = hardcodedConfigs[platform.toLowerCase()];
  if (!config) throw new Error(`Unsupported login provider: ${platform}`);

  // Fake userApp for consistency
  const userApp = { clientId, clientSecret, scopes: config.scope.split(' ') };

  // Exchange and get info
  const tokens = await exchangeCodeForToken(platform, code, userApp);
  const { userInfo } = await getUserInfo(platform, tokens.accessToken);

  return { tokens, userInfo };
}

/**
 * New: Revoke access token (expand capability)
 */
export async function revokeAccessToken(platform, accessToken, userApp) {
  const { PLATFORMS } = await import('../index.js');
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  if (!platformConfig.revokeUrl) throw new Error(`[${platform}] Revocation not supported`);

  const client = createOAuthClient(platformConfig, userApp);

  try {
    await client.revokeToken({ access_token: accessToken });
    return { success: true, message: 'Token revoked' };
  } catch (error) {
    throw new Error(`[${platform}] Revocation failed: ${error.message}`);
  }
}