// =============================================================================
// 🛣️ CLEAN ROUTER - Streamlined routing with proper separation of concerns
// =============================================================================

import { htmlResponse, jsonResponse, getCorsHeaders } from '../lib/utils/helpers.js';

// Import UI pages
import { getModernAuthPage } from '../ui/pages/auth.js';
import { getModernDashboardPage } from '../ui/pages/dashboard.js';
import { getModernApiKeysPage } from '../ui/pages/api-keys.js';
import { getModernAppsPage } from '../ui/pages/apps.js';
import { getModernDocsPage } from '../ui/pages/docs.js';
import { getModernAnalyticsPage } from '../ui/pages/analytics.js';
import { getModernSettingsPage } from '../ui/pages/settings.js';
import { getModernProfilePage } from '../ui/pages/profile.js';

// Import handlers
import { AuthHandler } from '../api/handlers/auth.handler.js';
import { ApiKeyHandler } from '../api/handlers/apikey.handler.js';
import { AppHandler } from '../api/handlers/app.handler.js';
import { GoogleAuthHandler } from '../api/handlers/google-auth.handler.js';
import { GitHubAuthHandler } from '../api/handlers/github-auth.handler.js';

export class Router {
  constructor(env) {
    this.env = env;
    this.authHandler = new AuthHandler(env);
    this.apiKeyHandler = new ApiKeyHandler(env);
    this.appHandler = new AppHandler(env);
    this.googleAuthHandler = new GoogleAuthHandler(env);
    this.githubAuthHandler = new GitHubAuthHandler(env);
  }

  // Helper method to get session from request
  getSessionFromRequest(request) {
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) return null;
    const match = cookieHeader.match(/session=([^;]+)/);
    return match ? match[1] : null;
  }

  // Generate OAuth authorization URL
  async handleOAuthAuthorize(request, corsHeaders) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    
    // Expected format: /oauth/authorize/{platform}/{apiKey}
    if (pathParts.length < 5) {
      return jsonResponse({
        error: 'Invalid authorize endpoint format. Expected: /oauth/authorize/{platform}/{apiKey}'
      }, 400, corsHeaders);
    }

    const platform = pathParts[3];
    const apiKey = pathParts[4];
    const state = url.searchParams.get('state') || `${platform}_${Date.now()}`;

    try {
      // Find the user's app for this platform and API key
      const { keys } = await this.env.OAUTH_TOKENS.list();
      let userApp = null;
      
      for (const keyInfo of keys) {
        const data = await this.env.OAUTH_TOKENS.get(keyInfo.name);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.platform === platform && parsed.apiKey === apiKey) {
            userApp = parsed;
            break;
          }
        }
      }

      if (!userApp) {
        return jsonResponse({
          error: 'No OAuth app found for this platform and API key',
          platform: platform,
          apiKey: apiKey.substring(0, 10) + '...'
        }, 404, corsHeaders);
      }

      // Import OAuth functions
      const { generateConsentUrl } = await import('../lib/auth/oauth.js');
      
      // Generate the authorization URL
      const authUrl = await generateConsentUrl(platform, userApp, apiKey, state);
      
      return jsonResponse({
        authorizationUrl: authUrl,
        platform: platform,
        state: state,
        scopes: userApp.scopes,
        redirectUri: userApp.redirectUri || `https://oauth-hub.com/consent/${apiKey}`
      }, 200, corsHeaders);
      
    } catch (error) {
      console.error('OAuth authorize failed:', error.message);
      return jsonResponse({
        error: 'Failed to generate authorization URL',
        message: error.message
      }, 500, corsHeaders);
    }
  }

  // Generate OAuth consent URL
  async handleConsentUrlGeneration(request, corsHeaders) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    
    // Expected format: /consent/{platform}/{apiKey}
    if (pathParts.length < 4) {
      return jsonResponse({
        error: 'Invalid consent endpoint format. Expected: /consent/{platform}/{apiKey}'
      }, 400, corsHeaders);
    }

    const platform = pathParts[2];
    const apiKey = pathParts[3];
    const state = url.searchParams.get('state') || `${platform}_${apiKey}_${Date.now()}`;

    try {
      // 1. First validate the API key exists and get user email
      const { keys: apiKeys } = await this.env.API_KEYS.list();
      let validApiKey = false;
      let userEmail = null;
      
      for (const keyInfo of apiKeys) {
        const data = await this.env.API_KEYS.get(keyInfo.name);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.apiKey === apiKey) {
            validApiKey = true;
            userEmail = parsed.email;
            break;
          }
        }
      }

      if (!validApiKey) {
        return jsonResponse({
          error: 'Invalid API key',
          apiKey: apiKey.substring(0, 10) + '...'
        }, 401, corsHeaders);
      }

      // 2. Find OAuth app for this platform and user (not tied to API key)
      const { keys: oauthKeys } = await this.env.OAUTH_TOKENS.list();
      let userApp = null;
      
      for (const keyInfo of oauthKeys) {
        const data = await this.env.OAUTH_TOKENS.get(keyInfo.name);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.platform === platform && parsed.userEmail === userEmail) {
            userApp = parsed;
            break;
          }
        }
      }

      if (!userApp) {
        return jsonResponse({
          error: 'No OAuth app configured for this platform',
          platform: platform,
          userEmail: userEmail,
          message: 'Please configure your OAuth app credentials first'
        }, 404, corsHeaders);
      }

      // Import OAuth functions
      const { generateConsentUrl } = await import('../lib/auth/oauth.js');
      
      // Generate the authorization URL with callback pointing to our callback endpoint
      const authUrl = await generateConsentUrl(platform, userApp, apiKey, state, 'https://oauth-hub.com');
      
      return jsonResponse({
        consentUrl: authUrl,
        platform: platform,
        state: state,
        scopes: userApp.scopes,
        redirectUri: 'https://oauth-hub.com',
        message: 'Open this URL to start OAuth consent flow'
      }, 200, corsHeaders);
      
    } catch (error) {
      console.error('Consent URL generation failed:', error.message);
      return jsonResponse({
        error: 'Failed to generate consent URL',
        message: error.message
      }, 500, corsHeaders);
    }
  }

  // Handle OAuth provider callback
  async handleOAuthCallback(request, corsHeaders) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      return jsonResponse({
        error: 'OAuth authorization failed',
        details: error,
        description: url.searchParams.get('error_description')
      }, 400, corsHeaders);
    }

    if (!code || !state) {
      return jsonResponse({
        error: 'Missing authorization code or state parameter'
      }, 400, corsHeaders);
    }

    // Extract platform and API key from state parameter (format: platform_apikey_timestamp)
    const stateParts = state.split('_');
    if (stateParts.length < 3) {
      return jsonResponse({
        error: 'Invalid state parameter format'
      }, 400, corsHeaders);
    }

    const platform = stateParts[0];
    // API key is everything between platform and timestamp (last part)
    const apiKey = stateParts.slice(1, -1).join('_');

    try {
      // 1. First validate the API key exists and get user email
      const { keys: apiKeys } = await this.env.API_KEYS.list();
      let validApiKey = false;
      let userEmail = null;
      
      for (const keyInfo of apiKeys) {
        const data = await this.env.API_KEYS.get(keyInfo.name);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.apiKey === apiKey) {
            validApiKey = true;
            userEmail = parsed.email;
            break;
          }
        }
      }

      if (!validApiKey) {
        return jsonResponse({
          error: 'Invalid API key',
          apiKey: apiKey.substring(0, 10) + '...'
        }, 401, corsHeaders);
      }

      // 2. Find OAuth app for this platform and user (not tied to API key)
      const { keys: oauthKeys } = await this.env.OAUTH_TOKENS.list();
      let userApp = null;
      
      for (const keyInfo of oauthKeys) {
        const data = await this.env.OAUTH_TOKENS.get(keyInfo.name);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.platform === platform && parsed.userEmail === userEmail) {
            userApp = parsed;
            break;
          }
        }
      }

      if (!userApp) {
        return jsonResponse({
          error: 'No OAuth app configured for this platform',
          platform: platform,
          userEmail: userEmail,
          message: 'Please configure your OAuth app credentials first'
        }, 404, corsHeaders);
      }

      // 2. Import OAuth functions
      const { exchangeCodeForTokens, getUserInfo } = await import('../lib/auth/oauth.js');
      
      // 3. Exchange authorization code for access token (use the same redirect URI as consent)
      const redirectUri = 'https://oauth-hub.com';
      const tokens = await exchangeCodeForTokens(platform, code, userApp, redirectUri);
      
      // 4. Get user info to extract platform user ID
      const { platformUserId, userInfo } = await getUserInfo(platform, tokens.accessToken);
      
      // 5. Store tokens in KV with platform user ID as key
      const tokenKey = `token-${platform}-${platformUserId}-${apiKey}`;
      const tokenData = {
        platform: platform,
        platformUserId: platformUserId,
        apiKey: apiKey,
        userEmail: userApp.userEmail,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenType: tokens.tokenType,
        expiresIn: tokens.expiresIn,
        expiresAt: tokens.expiresAt,
        scope: tokens.scope,
        userInfo: userInfo,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      await this.env.OAUTH_TOKENS.put(tokenKey, JSON.stringify(tokenData), {
        expirationTtl: 86400 * 365 // 1 year
      });

      // 6. Return success response with platform user ID
      return jsonResponse({
        success: true,
        message: 'OAuth authorization completed successfully',
        platform: platform,
        platformUserId: platformUserId,
        apiKey: apiKey.substring(0, 10) + '...',
        tokenStored: true,
        userInfo: {
          id: platformUserId,
          platform: platform
        }
      }, 200, corsHeaders);
      
    } catch (error) {
      console.error('OAuth consent processing failed:', error.message);
      return jsonResponse({
        error: 'Failed to process OAuth consent',
        message: error.message
      }, 500, corsHeaders);
    }
  }

  // Handle token endpoint
  async handleTokenEndpoint(request, corsHeaders) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    
    // Expected format: /token/{platformUserId}/{apiKey}
    if (pathParts.length < 4) {
      return jsonResponse({
        error: 'Invalid token endpoint format. Expected: /token/{platformUserId}/{apiKey}'
      }, 400, corsHeaders);
    }

    const platformUserId = pathParts[2];
    const apiKey = pathParts[3];

    try {
      // 1. Find the stored token by searching for matching records
      const { keys } = await this.env.OAUTH_TOKENS.list();
      let tokenData = null;
      let tokenKey = null;
      
      // First try to find by exact key pattern
      for (const keyInfo of keys) {
        if (keyInfo.name.startsWith('token-') && keyInfo.name.includes(platformUserId) && keyInfo.name.endsWith(apiKey)) {
          const data = await this.env.OAUTH_TOKENS.get(keyInfo.name);
          if (data) {
            const parsed = JSON.parse(data);
            if (parsed.platformUserId === platformUserId && parsed.apiKey === apiKey) {
              tokenData = parsed;
              tokenKey = keyInfo.name;
              break;
            }
          }
        }
      }
      
      // If not found, try broader search
      if (!tokenData) {
        for (const keyInfo of keys) {
          if (keyInfo.name.startsWith('token-')) {
            const data = await this.env.OAUTH_TOKENS.get(keyInfo.name);
            if (data) {
              const parsed = JSON.parse(data);
              if (parsed.platformUserId === platformUserId && parsed.apiKey === apiKey) {
                tokenData = parsed;
                tokenKey = keyInfo.name;
                break;
              }
            }
          }
        }
      }

      if (!tokenData) {
        return jsonResponse({
          error: 'No tokens found for this platform user and API key',
          platformUserId: platformUserId,
          apiKey: apiKey.substring(0, 10) + '...'
        }, 404, corsHeaders);
      }

      // 2. Check if token is expired and refresh if needed
      const now = Date.now();
      let needsRefresh = false;
      
      if (tokenData.expiresAt && tokenData.expiresAt < now) {
        needsRefresh = true;
      }

      if (needsRefresh && tokenData.refreshToken) {
        try {
          // 3. Import OAuth functions and refresh token
          const { refreshAccessToken } = await import('../lib/auth/oauth.js');
          
          // Find the OAuth app configuration for refresh
          let userApp = null;
          for (const keyInfo of keys) {
            const data = await this.env.OAUTH_TOKENS.get(keyInfo.name);
            if (data) {
              const parsed = JSON.parse(data);
              if (parsed.platform === tokenData.platform && parsed.apiKey === apiKey && parsed.clientId) {
                userApp = parsed;
                break;
              }
            }
          }

          if (!userApp) {
            return jsonResponse({
              error: 'OAuth app configuration not found for token refresh'
            }, 500, corsHeaders);
          }

          // Refresh the token
          const refreshedTokens = await refreshAccessToken(tokenData.platform, tokenData.refreshToken, userApp);
          
          // Update stored token data
          tokenData.accessToken = refreshedTokens.accessToken;
          tokenData.refreshToken = refreshedTokens.refreshToken || tokenData.refreshToken;
          tokenData.tokenType = refreshedTokens.tokenType;
          tokenData.expiresIn = refreshedTokens.expiresIn;
          tokenData.expiresAt = refreshedTokens.expiresAt;
          tokenData.updatedAt = now;
          
          // Store updated tokens
          await this.env.OAUTH_TOKENS.put(tokenKey, JSON.stringify(tokenData), {
            expirationTtl: 86400 * 365 // 1 year
          });
          
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError.message);
          return jsonResponse({
            error: 'Token refresh failed',
            message: refreshError.message,
            expired: true
          }, 401, corsHeaders);
        }
      }

      // 4. Return valid tokens (refreshed or existing)
      return jsonResponse({
        success: true,
        platform: tokenData.platform,
        platformUserId: tokenData.platformUserId,
        accessToken: tokenData.accessToken,
        tokenType: tokenData.tokenType || 'bearer',
        expiresIn: tokenData.expiresIn,
        expiresAt: tokenData.expiresAt,
        scope: tokenData.scope,
        refreshed: needsRefresh,
        userInfo: tokenData.userInfo
      }, 200, corsHeaders);
      
    } catch (error) {
      console.error('Token endpoint failed:', error.message);
      return jsonResponse({
        error: 'Failed to retrieve tokens',
        message: error.message
      }, 500, corsHeaders);
    }
  }

  async handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const corsHeaders = getCorsHeaders();

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // =============================================================================
      // API ENDPOINTS
      // =============================================================================
      
      // Authentication endpoints
      if (path === '/auth' && method === 'POST') {
        return await this.authHandler.handleAuth(request, corsHeaders);
      }
      
      if (path === '/logout' && method === 'POST') {
        return await this.authHandler.handleLogout(request, corsHeaders);
      }
      
      // Google OAuth endpoints
      if (path === '/auth/google' && method === 'GET') {
        return await this.googleAuthHandler.handleGoogleAuth(request);
      }
      
      if (path === '/auth/google/callback' && method === 'GET') {
        return await this.googleAuthHandler.handleGoogleAuth(request);
      }
      
      // GitHub OAuth endpoints
      if (path === '/auth/github' && method === 'GET') {
        return await this.githubAuthHandler.handleGitHubAuth(request);
      }
      
      if (path === '/auth/github/callback' && method === 'GET') {
        return await this.githubAuthHandler.handleGitHubAuth(request);
      }
      
      if (path === '/check-session' && method === 'GET') {
        return await this.authHandler.checkSession(request, corsHeaders);
      }

      // API Keys endpoints
      if (path === '/user-keys' && method === 'GET') {
        return await this.apiKeyHandler.getUserKeys(request, corsHeaders);
      }
      if (path === '/generate-key' && method === 'POST') {
        return await this.apiKeyHandler.generateKey(request, corsHeaders);
      }
      if (path.startsWith('/delete-key/') && method === 'DELETE') {
        return await this.apiKeyHandler.deleteKey(request, corsHeaders);
      }

      // OAuth Apps endpoints
      if (path === '/user-apps' && method === 'GET') {
        return await this.appHandler.getUserApps(request, corsHeaders);
      }
      if (path === '/save-app' && method === 'POST') {
        return await this.appHandler.saveApp(request, corsHeaders);
      }
      if (path.startsWith('/delete-app/') && method === 'DELETE') {
        return await this.appHandler.deleteApp(request, corsHeaders);
      }

      // OAuth endpoints
      if (path.startsWith('/oauth/authorize/') && method === 'GET') {
        // Generate OAuth authorization URL
        return await this.handleOAuthAuthorize(request, corsHeaders);
      }
      if (path.startsWith('/consent/') && method === 'GET') {
        // Generate OAuth consent URL
        return await this.handleConsentUrlGeneration(request, corsHeaders);
      }
      // Check for OAuth callback at root (when code/state params are present)
      if (path === '/' && method === 'GET') {
        const url = new URL(request.url);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');
        
        if (code && state) {
          // This is an OAuth callback
          return await this.handleOAuthCallback(request, corsHeaders);
        }
        // Otherwise fall through to normal homepage
      }
      if (path.startsWith('/token') && method === 'GET') {
        // Handle token endpoint
        return await this.handleTokenEndpoint(request, corsHeaders);
      }

      // Health check endpoint
      if (path === '/health') {
        return jsonResponse({
          status: '✅ OAuth Hub Online - Clean v2.0',
          version: '2.0-clean',
          timestamp: new Date().toISOString(),
          features: ['Authentication', 'Session Management', 'Clean Architecture']
        }, 200, corsHeaders);
      }

      // =============================================================================
      // UI PAGES
      // =============================================================================

      // Authentication page
      if (path === '/' || path === '/auth') {
        return htmlResponse(getModernAuthPage());
      }

      // Dashboard page
      if (path === '/dashboard') {
        return htmlResponse(getModernDashboardPage());
      }

      // API Keys page
      if (path === '/api-keys') {
        return htmlResponse(getModernApiKeysPage());
      }

      // Apps page
      if (path === '/apps') {
        return htmlResponse(getModernAppsPage());
      }

      // Settings page
      if (path === '/settings') {
        return htmlResponse(getModernSettingsPage());
      }

      // Profile page
      if (path === '/profile') {
        return htmlResponse(getModernProfilePage());
      }

      // Documentation page
      if (path === '/docs') {
        return htmlResponse(getModernDocsPage());
      }

      // Analytics page
      if (path === '/analytics') {
        return htmlResponse(getModernAnalyticsPage());
      }

      // 404 for unmatched routes
      return jsonResponse({ error: 'Not found' }, 404, corsHeaders);

    } catch (error) {
      console.error('Router error:', error);
      return jsonResponse({ 
        error: 'Internal server error', 
        message: error.message 
      }, 500, corsHeaders);
    }
  }
}
