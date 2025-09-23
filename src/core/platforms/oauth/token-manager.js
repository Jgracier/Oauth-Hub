/**
 * 🎫 TOKEN MANAGER
 * Normalizes token responses from different OAuth platforms
 * Handles platform-specific token format quirks
 */

/**
 * Normalize token response format across all platforms
 */
export function normalizeTokenResponse(platform, tokenResponse) {
  // simple-oauth2 already normalizes to result.token
  const token = tokenResponse.token || tokenResponse;
  
  const normalized = {
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    tokenType: token.token_type || 'Bearer',
    expiresIn: token.expires_in,
    scope: token.scope
  };

  if (normalized.expiresIn) {
    normalized.expiresAt = Date.now() + (normalized.expiresIn * 1000);
  }

  return normalized;
}
