// =============================================================================
// 🔐 OAUTH SERVICE - OAuth token management operations
// =============================================================================

import { 
  generateConsentUrl,
  getStoredTokens,
  refreshStoredTokens,
  getPlatformConfig
} from '../auth/oauth.js';

export class OAuthService {
  constructor(env) {
    this.env = env;
  }

  /**
   * Generate OAuth consent URL
   */
  async generateConsentUrl(platform, apiKey) {
    // Validate API key first
    const { keys } = await this.env.API_KEYS.list();
    let validApiKey = false;
    
    for (const keyInfo of keys) {
      if (keyInfo.name.startsWith('api-')) {
        const data = await this.env.API_KEYS.get(keyInfo.name);
        const keyData = JSON.parse(data);
        if (keyData.apiKey === apiKey) {
          validApiKey = true;
          break;
        }
      }
    }
    
    if (!validApiKey) {
      throw new Error('Invalid API key');
    }

    // Get app credentials for this platform
    const appKey = `app:${platform}`;
    const appData = await this.env.API_KEYS.get(appKey);
    
    if (!appData) {
      throw new Error(`No OAuth app configured for ${platform}`);
    }
    
    const app = JSON.parse(appData);
    const consentUrl = generateConsentUrl(platform, app, `${platform}_${Date.now()}`);
    
    return { consentUrl, platform };
  }

  /**
   * Store OAuth tokens after callback
   */
  async storeTokens(platform, platformUserId, tokens, userInfo = {}) {
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

    await this.env.OAUTH_TOKENS.put(tokenKey, JSON.stringify(tokenData));
    return tokenData;
  }

  /**
   * Get tokens for platform user
   */
  async getTokens(platformUserId, platform) {
    const tokenKey = `token:${platform}:${platformUserId}`;
    const tokenData = await this.env.OAUTH_TOKENS.get(tokenKey);
    
    if (!tokenData) {
      return null;
    }

    const tokens = JSON.parse(tokenData);
    
    // Return only OAuth token fields, not user data
    return {
      accessToken: tokens.accessToken,
      tokenType: tokens.tokenType || 'bearer',
      expiresAt: tokens.expiresAt,
      platform: tokens.platform,
      platformUserId: tokens.platformUserId
    };
  }

  /**
   * Find token key by platform user ID
   */
  async findTokenKeyByPlatformUserId(platformUserId) {
    const { keys } = await this.env.OAUTH_TOKENS.list();
    
    for (const keyInfo of keys) {
      if (keyInfo.name.startsWith('token:')) {
        const tokenData = await this.env.OAUTH_TOKENS.get(keyInfo.name);
        if (tokenData) {
          const tokens = JSON.parse(tokenData);
          if (tokens.platformUserId === platformUserId) {
            return keyInfo.name;
          }
        }
      }
    }
    
    return null;
  }

  /**
   * Revoke user token
   */
  async revokeToken(platformUserId) {
    const tokenKey = await this.findTokenKeyByPlatformUserId(platformUserId);
    if (tokenKey) {
      await this.env.OAUTH_TOKENS.delete(tokenKey);
      return true;
    }
    return false;
  }

  /**
   * Get all tokens for analytics
   */
  async getAllTokens() {
    const { keys } = await this.env.OAUTH_TOKENS.list();
    const tokens = [];
    
    for (const keyInfo of keys) {
      if (keyInfo.name.startsWith('token:')) {
        const tokenData = await this.env.OAUTH_TOKENS.get(keyInfo.name);
        if (tokenData) {
          const token = JSON.parse(tokenData);
          tokens.push({
            platform: token.platform,
            platformUserId: token.platformUserId,
            createdAt: token.createdAt,
            expiresAt: token.expiresAt
          });
        }
      }
    }
    
    return tokens;
  }
}
