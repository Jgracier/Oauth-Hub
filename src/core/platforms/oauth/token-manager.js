/**
 * 🎫 TOKEN MANAGER
 * Simplified token normalization - now mostly handled by simple-oauth2 package
 * Keeps legacy support for custom platform quirks
 */

/**
 * Normalize token response format across all platforms
 * Note: simple-oauth2 handles most normalization, this is for legacy/custom cases
 */
export function normalizeTokenResponse(platform, tokenResponse) {
  const normalized = {
    accessToken: null,
    refreshToken: null,
    tokenType: 'Bearer',
    expiresIn: null,
    expiresAt: null,
    scope: null
  };

  try {
    // Most platforms now handled by simple-oauth2 package
    // Only special cases need manual handling
    switch (platform.toLowerCase()) {
      case 'trello':
        // OAuth 1.0a: { oauth_token, oauth_token_secret }
        normalized.accessToken = tokenResponse.oauth_token;
        normalized.refreshToken = tokenResponse.oauth_token_secret;
        break;

      case 'netflix':
        // OAuth 1.0a: { oauth_token, oauth_token_secret, user_id }
        normalized.accessToken = tokenResponse.oauth_token;
        normalized.refreshToken = tokenResponse.oauth_token_secret;
        break;

      case 'steam':
        // OpenID: Returns identity URL, not traditional OAuth tokens
        normalized.accessToken = tokenResponse.openid_identity || tokenResponse.access_token;
        break;

      default:
        // Generic OAuth 2.0 response (simple-oauth2 handles most cases)
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
