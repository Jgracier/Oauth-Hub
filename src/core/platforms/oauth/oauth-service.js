/**
 * 🔧 OAUTH SERVICE
 * Core OAuth flow logic separated from platform configurations
 * Handles consent URL generation, token exchange, and user info retrieval
 */

// Note: PLATFORMS will be imported lazily to avoid circular dependencies
import { normalizeTokenResponse } from './token-manager.js';
import { extractPlatformUserId } from './user-info-extractor.js';
import { generateCodeVerifier, generateCodeChallenge } from './utils.js';

/**
 * Generate OAuth consent URL with required scopes automatically included
 */
export async function generateConsentUrl(platform, userApp, apiKey, state, baseUrl = 'https://oauth-hub.com') {
  // Lazy import to avoid circular dependency
  const { PLATFORMS } = await import('../index.js');
  
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  if (!platformConfig) {
    throw new Error(`[${platform}] Unsupported platform`);
  }

  try {
    // Combine required scopes with user-selected scopes
    const requiredScopes = platformConfig.requiredScopes || [];
    const userScopes = userApp.scopes || [];
    
    // Merge scopes, ensuring required scopes are always included
    const allScopes = [...new Set([...requiredScopes, ...userScopes])];
    const scopeString = allScopes.join(platformConfig.scopeDelimiter || ' ');

    // Build authorization URL parameters
    const params = new URLSearchParams({
      client_id: userApp.clientId,
      redirect_uri: `${baseUrl}/callback`,
      response_type: 'code', // Standard OAuth parameter
      scope: scopeString,
      state: state,
      ...platformConfig.additionalParams
    });

    // Handle PKCE for platforms that require it
    if (platformConfig.requiresPKCE) {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      params.set('code_challenge', codeChallenge);
      params.set('code_challenge_method', 'S256');
    }

    return `${platformConfig.authUrl}?${params.toString()}`;
  } catch (error) {
    throw new Error(`[${platform}] Failed to generate consent URL: ${error.message}`);
  }
}

/**
 * Exchange authorization code for access token with platform-specific handling
 */
export async function exchangeCodeForToken(platform, code, userApp, codeVerifier = null) {
  // Lazy import to avoid circular dependency
  const { PLATFORMS } = await import('../index.js');
  
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  if (!platformConfig) {
    throw new Error(`[${platform}] Unsupported platform`);
  }

  try {
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: userApp.clientId,
      client_secret: userApp.clientSecret,
      code: code,
      redirect_uri: 'https://oauth-hub.com/callback'
    });

    // Add PKCE code verifier if required
    if (platformConfig.requiresPKCE && codeVerifier) {
      tokenParams.set('code_verifier', codeVerifier);
    }

    // Platform-specific token request handling
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    };

    // Add platform-specific headers
    switch (platform.toLowerCase()) {
      case 'github':
        headers['User-Agent'] = 'OAuth-Hub/1.0';
        break;
      case 'slack':
        tokenParams.set('client_id', userApp.clientId);
        tokenParams.set('client_secret', userApp.clientSecret);
        break;
      case 'shopify':
        // Shopify uses different URL structure
        const shopDomain = userApp.shopDomain || 'shop';
        platformConfig.tokenUrl = platformConfig.tokenUrl.replace('{shop}', shopDomain);
        break;
    }

    const response = await fetch(platformConfig.tokenUrl, {
      method: 'POST',
      headers,
      body: tokenParams.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
    }

    const tokenResponse = await response.json();
    return normalizeTokenResponse(platform, tokenResponse);
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
  // Lazy import to avoid circular dependency
  const { PLATFORMS } = await import('../index.js');
  
  const platformConfig = PLATFORMS[platform.toLowerCase()];
  if (!platformConfig) {
    throw new Error(`[${platform}] Unsupported platform`);
  }

  // Some platforms don't support refresh tokens
  const noRefreshPlatforms = ['github', 'shopify', 'trello', 'notion', 'dribbble', 'unsplash', 'netflix', 'steam'];
  if (noRefreshPlatforms.includes(platform.toLowerCase())) {
    throw new Error(`[${platform}] Tokens do not expire and cannot be refreshed`);
  }

  try {
    const tokenParams = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: userApp.clientId,
      client_secret: userApp.clientSecret,
      refresh_token: refreshToken
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    };

    const response = await fetch(platformConfig.tokenUrl, {
      method: 'POST',
      headers,
      body: tokenParams.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
    }

    const tokenResponse = await response.json();
    return normalizeTokenResponse(platform, tokenResponse);
  } catch (error) {
    throw new Error(`[${platform}] Token refresh failed: ${error.message}`);
  }
}
