// =============================================================================
// 🔐 OAUTH HANDLER - OAuth flow endpoints
// =============================================================================

import { jsonResponse, parseJsonBody } from '../../lib/utils/helpers.js';
import { getSessionFromRequest } from '../../lib/auth/session.js';
import { UserService } from '../../lib/services/user.service.js';
import { ApiKeyService } from '../../lib/services/apikey.service.js';
import { OAuthService } from '../../lib/services/oauth.service.js';
import { AppService } from '../../lib/services/app.service.js';
import { 
  exchangeCodeForTokens,
  getUserInfo,
  getPlatformConfig
} from '../../lib/auth/oauth.js';
import { Logger } from '../../lib/utils/logger.js';
import { 
  OAuthError,
  InvalidOAuthCodeError,
  OAuthConfigError,
  TokenExchangeError,
  ValidationError,
  NotFoundError,
  AuthError
} from '../../lib/utils/errors.js';

export class OAuthHandler {
  constructor(env) {
    this.env = env;
    this.logger = new Logger('OAuthHandler', env);
    this.userService = new UserService(env);
    this.apiKeyService = new ApiKeyService(env);
    this.oauthService = new OAuthService(env);
    this.appService = new AppService(env);
  }

  /**
   * Generate OAuth consent URL
   */
  async handleConsentRequest(platform, apiKey, request, corsHeaders) {
    const startTime = Date.now();
    
    try {
      this.logger.info('Generating OAuth consent URL', { 
        platform,
        apiKeyPrefix: apiKey?.substring(0, 8) + '***'
      });
      
      if (!platform) {
        throw new ValidationError('Platform is required', 'platform', platform);
      }
      
      if (!apiKey) {
        throw new ValidationError('API key is required', 'apiKey');
      }
      
      const { consentUrl } = await this.oauthService.generateConsentUrl(platform, apiKey);
      
      this.logger.info('OAuth consent URL generated successfully', {
        platform,
        duration: Date.now() - startTime
      });
      
      return jsonResponse({
        success: true,
        consentUrl: consentUrl,
        platform: platform,
        message: `OAuth consent URL for ${platform.toUpperCase()}`
      }, 200, corsHeaders);
      
    } catch (error) {
      this.logger.error('Failed to generate consent URL', {
        platform,
        apiKeyPrefix: apiKey?.substring(0, 8) + '***',
        duration: Date.now() - startTime
      }, error);
      
      if (error instanceof ValidationError) {
        throw error;
      }
      
      if (error.message?.includes('Invalid API key')) {
        throw new AuthError('Invalid API key provided', 'INVALID_API_KEY');
      }
      
      if (error.message?.includes('No OAuth app configured')) {
        throw new OAuthConfigError(platform);
      }
      
      throw new OAuthError('Failed to generate consent URL', platform, 'CONSENT_URL_FAILED', {
        originalError: error.message
      });
    }
  }

  /**
   * Handle OAuth callback
   */
  async handleOAuthCallback(request, corsHeaders) {
    try {
      const url = new URL(request.url);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');
      
      if (error) {
        return new Response(`
          <!DOCTYPE html>
          <html><head><title>OAuth Error</title></head>
          <body>
            <h1>OAuth Authorization Failed</h1>
            <p>Error: ${error}</p>
            <p>Description: ${url.searchParams.get('error_description') || 'Unknown error'}</p>
            <script>
              window.opener?.postMessage({
                type: 'oauth_error',
                error: '${error}',
                description: '${url.searchParams.get('error_description') || 'Unknown error'}'
              }, '*');
              window.close();
            </script>
          </body></html>
        `, {
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      if (!code || !state) {
        throw new Error('Missing authorization code or state parameter');
      }
      
      // Extract platform from state
      const platform = state.split('_')[0];
      
      // Exchange code for tokens
      const result = await this.exchangeOAuthCodeForTokens(platform, code);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      const { tokens, platformUserId, userInfo } = result;
      
      // Store tokens
      await this.oauthService.storeTokens(platform, platformUserId, tokens, userInfo);
      
      // Return success page that posts message to parent window
      return new Response(`
        <!DOCTYPE html>
        <html><head><title>OAuth Success</title></head>
        <body>
          <h1>Authorization Successful!</h1>
          <p>You can close this window.</p>
          <script>
            window.opener?.postMessage({
              type: 'oauth_complete',
              platform: '${platform}',
              platformUserId: '${platformUserId}',
              tokens: {
                accessToken: '${tokens.accessToken}',
                tokenType: '${tokens.tokenType || 'bearer'}'
              }
            }, '*');
            setTimeout(() => window.close(), 1000);
          </script>
        </body></html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
      
    } catch (error) {
      return new Response(`
        <!DOCTYPE html>
        <html><head><title>OAuth Error</title></head>
        <body>
          <h1>OAuth Error</h1>
          <p>Error: ${error.message}</p>
          <script>
            window.opener?.postMessage({
              type: 'oauth_error',
              error: '${error.message}'
            }, '*');
            window.close();
          </script>
        </body></html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
  }

  /**
   * Get tokens for platform user
   */
  async handleTokenRequest(platformUserId, apiKey, request, corsHeaders) {
    try {
      if (!apiKey) {
        return jsonResponse({ error: 'API key required in URL path' }, 401, corsHeaders);
      }
      
      // Validate API key
      const validationResult = await this.apiKeyService.validate(apiKey);
      if (!validationResult) {
        return jsonResponse({ error: 'Invalid API key' }, 401, corsHeaders);
      }
      
      // Find tokens for this platform user ID
      const tokenKey = await this.oauthService.findTokenKeyByPlatformUserId(platformUserId);
      if (!tokenKey) {
        return jsonResponse({ 
          error: 'No tokens found',
          message: 'User has not authorized this app yet'
        }, 404, corsHeaders);
      }
      
      // Get token data
      const tokenData = await this.env.OAUTH_TOKENS.get(tokenKey);
      if (!tokenData) {
        return jsonResponse({ 
          error: 'Token data not found',
          message: 'Token key exists but data is missing'
        }, 500, corsHeaders);
      }
      
      const tokens = JSON.parse(tokenData);
      
      return jsonResponse({
        accessToken: tokens.accessToken,
        tokenType: tokens.tokenType || 'bearer',
        expiresAt: tokens.expiresAt,
        platform: tokens.platform,
        platformUserId: tokens.platformUserId
      }, 200, corsHeaders);
      
    } catch (error) {
      return jsonResponse({ 
        error: 'Failed to get tokens', 
        message: error.message 
      }, 500, corsHeaders);
    }
  }

  /**
   * Revoke user token
   */
  async revokeUserToken(platformUserId, request, corsHeaders) {
    try {
      const sessionToken = getSessionFromRequest(request);
      const user = await this.userService.getBySessionToken(sessionToken);
      
      if (!user) {
        return jsonResponse({ error: 'Authentication required' }, 401, corsHeaders);
      }
      
      const revoked = await this.oauthService.revokeToken(platformUserId);
      
      if (!revoked) {
        return jsonResponse({ error: 'Token not found' }, 404, corsHeaders);
      }
      
      return jsonResponse({
        success: true,
        message: 'Token revoked successfully'
      }, 200, corsHeaders);
      
    } catch (error) {
      return jsonResponse({ 
        error: 'Failed to revoke token', 
        message: error.message 
      }, 500, corsHeaders);
    }
  }

  /**
   * Exchange OAuth code for tokens (internal method)
   */
  async exchangeOAuthCodeForTokens(platform, code) {
    try {
      // Get app credentials
      const app = await this.appService.getByPlatform(platform);
      if (!app) {
        return { success: false, error: `No OAuth app configured for ${platform}` };
      }
      
      // Exchange code for tokens
      const tokens = await exchangeCodeForTokens(platform, code, app);
      
      // Get user info
      const { platformUserId, userInfo } = await getUserInfo(platform, tokens.accessToken);
      
      return {
        success: true,
        tokens,
        platformUserId,
        userInfo
      };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
