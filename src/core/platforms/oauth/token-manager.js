/**
 * 🎫 TOKEN MANAGER
 * Normalizes token responses from different OAuth platforms
 * Handles platform-specific token format quirks
 */

/**
 * Normalize token response format across all platforms
 */
function normalizeTokenResponse(platform, tokenResponse) {
  const normalized = {
    accessToken: null,
    refreshToken: null,
    tokenType: 'Bearer',
    expiresIn: null,
    expiresAt: null,
    scope: null
  };

  try {
    // Handle platform-specific token response formats
    switch (platform.toLowerCase()) {
      case 'github':
        normalized.accessToken = tokenResponse.access_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.scope = tokenResponse.scope;
        break;

      case 'google':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
        break;

      case 'apple':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        break;

      case 'amazon':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        break;

      case 'shopify':
        normalized.accessToken = tokenResponse.access_token;
        normalized.scope = tokenResponse.scope;
        break;

      case 'stripe':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.scope = tokenResponse.scope;
        break;

      case 'paypal':
        normalized.accessToken = tokenResponse.access_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
        break;

      case 'salesforce':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.scope = tokenResponse.scope;
        break;

      case 'hubspot':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        break;

      case 'zoom':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
        break;

      case 'dropbox':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
        break;

      case 'coinbase':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
        break;

      // Additional American platforms
      case 'mailchimp':
        normalized.accessToken = tokenResponse.access_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
        break;

      case 'trello':
        // Trello (OAuth 1.0a): { oauth_token, oauth_token_secret }
        normalized.accessToken = tokenResponse.oauth_token;
        normalized.refreshToken = tokenResponse.oauth_token_secret; // Store as refresh for consistency
        break;

      case 'asana':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        break;

      case 'notion':
        normalized.accessToken = tokenResponse.access_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        break;

      case 'adobe':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        break;

      case 'figma':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        break;

      case 'canva':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
        break;

      case 'dribbble':
        normalized.accessToken = tokenResponse.access_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.scope = tokenResponse.scope;
        break;

      case 'unsplash':
        normalized.accessToken = tokenResponse.access_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.scope = tokenResponse.scope;
        break;

      case 'box':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        break;

      case 'netflix':
        // Netflix (OAuth 1.0a): { oauth_token, oauth_token_secret, user_id }
        normalized.accessToken = tokenResponse.oauth_token;
        normalized.refreshToken = tokenResponse.oauth_token_secret;
        break;

      case 'steam':
        // Steam (OpenID): Returns identity URL, not traditional OAuth tokens
        normalized.accessToken = tokenResponse.openid_identity || tokenResponse.access_token;
        break;

      case 'facebook':
      case 'instagram':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
        break;

      case 'twitter':
      case 'x':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
        break;

      case 'linkedin':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
        break;

      case 'discord':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
        break;

      case 'spotify':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
        break;

      case 'twitch':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
        break;

      case 'slack':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
        break;

      case 'microsoft':
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
        break;

      default:
        // Generic OAuth 2.0 response
        normalized.accessToken = tokenResponse.access_token;
        normalized.refreshToken = tokenResponse.refresh_token;
        normalized.tokenType = tokenResponse.token_type || 'Bearer';
        normalized.expiresIn = tokenResponse.expires_in;
        normalized.scope = tokenResponse.scope;
    }

    // Calculate expiration timestamp if expiresIn is provided
    if (normalized.expiresIn) {
      normalized.expiresAt = Date.now() + (normalized.expiresIn * 1000);
    }

    return normalized;
  } catch (error) {
    throw new Error(`[${platform}] Failed to normalize token response: ${error.message}`);
  }
}

// Export the function
module.exports = {
  normalizeTokenResponse
};