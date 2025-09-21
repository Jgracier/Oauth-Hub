// =============================================================================
// ≡ƒ¢ú∩╕Å CLEAN ROUTER - Streamlined routing with proper separation of concerns
// =============================================================================

import { htmlResponse, jsonResponse, getCorsHeaders } from '../lib/utils/helpers.js';

// Import UI pages
import { getModernAuthPage } from '../ui/pages/auth.js';
import { getModernDashboardPage } from '../ui/pages/dashboard.js';
import { getModernApiKeysPage } from '../ui/pages/api-keys.js';
import { getModernAppsPage } from '../ui/pages/apps.js';
import { getModernDocsPage } from '../ui/pages/docs.js';
import { getModernAnalyticsPage } from '../ui/pages/analytics.js';
import { getSettingsPage } from '../ui/pages/settings.js';
import { getModernProfilePage } from '../ui/pages/profile.js';
import { getModernSubscriptionPage } from '../ui/pages/subscription.js';

// Import handlers
import { AuthHandler } from '../api/handlers/auth.handler.js';
import { ApiKeyHandler } from '../api/handlers/apikey.handler.js';
import { AppHandler } from '../api/handlers/app.handler.js';
import { GoogleAuthHandler } from '../api/handlers/google-auth.handler.js';
import { GitHubAuthHandler } from '../api/handlers/github-auth.handler.js';
import { SubscriptionHandler } from '../api/handlers/subscription.handler.js';
import { ProfileHandler } from '../api/handlers/profile.handler.js';
import { TokenManagementHandler } from '../api/handlers/token-management.handler.js';

export class Router {
  constructor(env) {
    this.env = env;
    this.authHandler = new AuthHandler(env);
    this.apiKeyHandler = new ApiKeyHandler(env);
    this.appHandler = new AppHandler(env);
    this.googleAuthHandler = new GoogleAuthHandler(env);
    this.githubAuthHandler = new GitHubAuthHandler(env);
    this.subscriptionHandler = new SubscriptionHandler(env);
    this.profileHandler = new ProfileHandler(env);
    this.tokenManagementHandler = new TokenManagementHandler(env);
  }

  // Helper method to get session from request
  getSessionFromRequest(request) {
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) return null;
    const match = cookieHeader.match(/session=([^;]+)/);
    return match ? match[1] : null;
  }

  // Helper method to validate API key efficiently - SCALABLE VERSION
  async validateApiKey(apiKey) {
    // Direct lookup using API key as index - O(1) operation
    const lookupKey = `lookup-${apiKey}`;
    const lookupData = await this.env.API_KEYS.get(lookupKey);
    
    if (lookupData) {
      const parsed = JSON.parse(lookupData);
      return { validApiKey: true, userEmail: parsed.email };
    }
    
    return { validApiKey: false, userEmail: null };
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
      const { generateConsentUrl } = await import('./platforms/index.js');
      
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
      return jsonResponse({ error: 'Failed to generate authorization URL' }, 500, corsHeaders);
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
    const state = url.searchParams.get('state') || `${platform}_${apiKey}_${Date.now()}_${crypto.randomUUID()}`;

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

      // 2. Find OAuth app for this platform and user using efficient key lookup
      const appKey = `app-${platform}-${userEmail}`;
      const appData = await this.env.OAUTH_TOKENS.get(appKey);
      let userApp = null;
      
      if (appData) {
        userApp = JSON.parse(appData);
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
      const { generateConsentUrl } = await import('./platforms/index.js');
      
      // Generate the authorization URL with callback pointing to our callback endpoint
      const authUrl = await generateConsentUrl(platform, userApp, apiKey, state, 'https://oauth-hub.com');
      
      return jsonResponse({
        consentURL: authUrl,
        Platform: platform
      }, 200, corsHeaders);
      
    } catch (error) {
      console.error('Consent URL generation failed:', error.message);
      return jsonResponse({ error: 'Failed to generate consent URL' }, 500, corsHeaders);
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

    // Extract platform and API key from state parameter (format: platform_apikey_timestamp_uuid)
    const stateParts = state.split('_');
    if (stateParts.length < 4) {
      return jsonResponse({
        error: 'Invalid state parameter format'
      }, 400, corsHeaders);
    }

    const platform = stateParts[0];
    // API key is everything between platform and timestamp+uuid (last 2 parts)
    const apiKey = stateParts.slice(1, -2).join('_');

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

      // 2. Find OAuth app for this platform and user using efficient key lookup
      const appKey = `app-${platform}-${userEmail}`;
      const appData = await this.env.OAUTH_TOKENS.get(appKey);
      let userApp = null;
      
      if (appData) {
        userApp = JSON.parse(appData);
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
      const { exchangeCodeForToken, getUserInfo } = await import('./platforms/index.js');
      
      // 3. Exchange authorization code for access token (use the same redirect URI as consent)
      const tokens = await exchangeCodeForToken(platform, code, userApp);
      
      // 4. Get user info to extract platform user ID
      const { platformUserId, userInfo } = await getUserInfo(platform, tokens.accessToken);
      
      // 5. SCALABLE TOKEN STORAGE: Use consistent key format
      const tokenKey = `token-${platformUserId}-${apiKey}`;
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

      // 6. Return HTML that communicates with parent window
      const callbackHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>OAuth Complete</title>
        </head>
        <body>
          <script>
            // Send data to parent window
            if (window.opener) {
              window.opener.postMessage({
                type: 'oauth_complete',
                platform: '${platform}',
                platformUserId: '${platformUserId}',
                tokens: {
                  access_token: 'stored_securely',
                  platform: '${platform}',
                  platformUserId: '${platformUserId}'
                }
              }, '*');
              window.close();
            } else if (window.parent !== window) {
              window.parent.postMessage({
                type: 'oauth_complete',
                platform: '${platform}',
                platformUserId: '${platformUserId}',
                tokens: {
                  access_token: 'stored_securely',
                  platform: '${platform}',
                  platformUserId: '${platformUserId}'
                }
              }, '*');
            } else {
              document.body.innerHTML = '<h2>OAuth Complete!</h2><p>Platform: ${platform}</p><p>User ID: ${platformUserId}</p><p>You can close this window.</p>';
            }
          </script>
        </body>
        </html>
      `;
      
      return htmlResponse(callbackHtml, 200, corsHeaders);
      
    } catch (error) {
      console.error('OAuth consent processing failed:', error.message);
      return jsonResponse({ error: 'Failed to process OAuth consent' }, 500, corsHeaders);
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
      // 1. SCALABLE TOKEN LOOKUP: Direct key access - O(1) operation
      const tokenKey = `token-${platformUserId}-${apiKey}`;
      const tokenDataRaw = await this.env.OAUTH_TOKENS.get(tokenKey);
      let tokenData = null;
      
      if (tokenDataRaw) {
        tokenData = JSON.parse(tokenDataRaw);
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
          const { refreshAccessToken } = await import('./platforms/index.js');
          
          // Find the OAuth app configuration for refresh using efficient lookup
          const { validApiKey, userEmail } = await this.validateApiKey(apiKey);
          if (!validApiKey) {
            return jsonResponse({
              error: 'Invalid API key for token refresh'
            }, 401, corsHeaders);
          }
          
          const appKey = `app-${tokenData.platform}-${userEmail}`;
          const appData = await this.env.OAUTH_TOKENS.get(appKey);
          let userApp = null;
          
          if (appData) {
            userApp = JSON.parse(appData);
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
      return jsonResponse({ error: 'Failed to retrieve tokens' }, 500, corsHeaders);
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

      // Profile endpoints
      if (path === '/api/profile' && method === 'GET') {
        return await this.profileHandler.getProfile(request, corsHeaders);
      }
      if (path === '/api/profile' && method === 'PUT') {
        return await this.profileHandler.updateProfile(request, corsHeaders);
      }
      if (path === '/api/change-password' && method === 'POST') {
        return await this.profileHandler.changePassword(request, corsHeaders);
      }
      if (path === '/api/profile/picture' && method === 'POST') {
        return await this.profileHandler.uploadProfilePicture(request, corsHeaders);
      }
      if (path === '/api/profile/sessions' && method === 'GET') {
        return await this.profileHandler.getUserSessions(request, corsHeaders);
      }
      if (path === '/api/profile/sessions' && method === 'DELETE') {
        return await this.profileHandler.revokeSession(request, corsHeaders);
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

      // =============================================================================
      // SUBSCRIPTION ENDPOINTS
      // =============================================================================
      
      // Get subscription plans
      if (path === '/subscription/plans' && method === 'GET') {
        return await this.subscriptionHandler.getPlans();
      }
      
      // Create Stripe checkout session
      if (path === '/subscription/checkout' && method === 'POST') {
        const body = await request.json();
        const { email, priceId } = body;
        const successUrl = `${url.origin}/subscription/success`;
        const cancelUrl = `${url.origin}/subscription/cancel`;
        
        try {
          const session = await this.subscriptionHandler.createCheckoutSession(
            email, priceId, successUrl, cancelUrl
          );
          return jsonResponse({ success: true, checkoutUrl: session.url }, 200, corsHeaders);
        } catch (error) {
          return jsonResponse({ error: error.message }, 400, corsHeaders);
        }
      }
      
      // Get subscription status
      if (path === '/subscription/status' && method === 'GET') {
        const email = url.searchParams.get('email');
        if (!email) {
          return jsonResponse({ error: 'Email parameter required' }, 400, corsHeaders);
        }
        return await this.subscriptionHandler.getSubscriptionStatus(email);
      }
      
      // Apply promo code
      if (path === '/subscription/promo' && method === 'POST') {
        const body = await request.json();
        const { email, promoCode } = body;
        return await this.subscriptionHandler.applyPromoCode(email, promoCode);
      }
      
      // Cancel subscription
      if (path === '/subscription/cancel' && method === 'POST') {
        const body = await request.json();
        const { email } = body;
        return await this.subscriptionHandler.cancelSubscription(email);
      }
      
      // Stripe webhook endpoint
      if (path === '/webhook/stripe' && method === 'POST') {
        return await this.subscriptionHandler.handleWebhook(request);
      }

      // =============================================================================
      // ≡ƒöì TOKEN MANAGEMENT API - Analytics, monitoring, and webhooks
      // =============================================================================
      
      // Get token analytics
      if (path === '/api/tokens/analytics' && method === 'GET') {
        return await this.tokenManagementHandler.getAnalytics(request, corsHeaders);
      }
      
      // Get token status
      if (path === '/api/tokens/status' && method === 'GET') {
        return await this.tokenManagementHandler.getTokenStatus(request, corsHeaders);
      }
      
      // Manually refresh token
      if (path === '/api/tokens/refresh' && method === 'POST') {
        return await this.tokenManagementHandler.refreshToken(request, corsHeaders);
      }
      
      // Webhook management
      if (path === '/api/webhooks' && method === 'GET') {
        return await this.tokenManagementHandler.getWebhookConfig(request, corsHeaders);
      }
      
      if (path === '/api/webhooks' && method === 'POST') {
        return await this.tokenManagementHandler.registerWebhook(request, corsHeaders);
      }
      
      if (path === '/api/webhooks' && method === 'PUT') {
        return await this.tokenManagementHandler.updateWebhook(request, corsHeaders);
      }
      
      if (path === '/api/webhooks' && method === 'DELETE') {
        return await this.tokenManagementHandler.deleteWebhook(request, corsHeaders);
      }
      
      if (path === '/api/webhooks/test' && method === 'POST') {
        return await this.tokenManagementHandler.testWebhook(request, corsHeaders);
      }
      
      // Security logs
      if (path === '/api/tokens/security-logs' && method === 'GET') {
        return await this.tokenManagementHandler.getSecurityLogs(request, corsHeaders);
      }
      
      // Grant Austyn full access (admin endpoint)
      if (path === '/admin/grant-austyn-access' && method === 'POST') {
        const { SubscriptionService } = await import('../lib/services/subscription.service.js');
        const subscriptionService = new SubscriptionService(this.env);
        const result = await subscriptionService.giveAustynFullAccess();
        return jsonResponse(result, result.success ? 200 : 400, corsHeaders);
      }

      // Health check endpoint
      if (path === '/health') {
        return jsonResponse({
          status: 'Γ£à OAuth Hub Online - Clean v2.0',
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
        return htmlResponse(getSettingsPage());
      }

      // Profile page
      if (path === '/profile') {
        return htmlResponse(getModernProfilePage());
      }

      // Subscription page
      if (path === '/subscription') {
        return htmlResponse(getModernSubscriptionPage());
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
import { getModernSubscriptionPage } from '../ui/pages/subscription.js';

// Import handlers
import { AuthHandler } from '../api/handlers/auth.handler.js';
import { ApiKeyHandler } from '../api/handlers/apikey.handler.js';
import { AppHandler } from '../api/handlers/app.handler.js';
import { GoogleAuthHandler } from '../api/handlers/google-auth.handler.js';
import { GitHubAuthHandler } from '../api/handlers/github-auth.handler.js';
import { SubscriptionHandler } from '../api/handlers/subscription.handler.js';

export class Router {
  constructor(env) {
    this.env = env;
    this.authHandler = new AuthHandler(env);
    this.apiKeyHandler = new ApiKeyHandler(env);
    this.appHandler = new AppHandler(env);
    this.googleAuthHandler = new GoogleAuthHandler(env);
    this.githubAuthHandler = new GitHubAuthHandler(env);
    this.subscriptionHandler = new SubscriptionHandler(env);
  }

  // Helper method to get session from request
  getSessionFromRequest(request) {
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) return null;
    const match = cookieHeader.match(/session=([^;]+)/);
    return match ? match[1] : null;
  }

  // Helper method to validate API key efficiently - SCALABLE VERSION
  async validateApiKey(apiKey) {
    // Direct lookup using API key as index - O(1) operation
    const lookupKey = `lookup-${apiKey}`;
    const lookupData = await this.env.API_KEYS.get(lookupKey);
    
    if (lookupData) {
      const parsed = JSON.parse(lookupData);
      return { validApiKey: true, userEmail: parsed.email };
    }
    
    return { validApiKey: false, userEmail: null };
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
      const { generateConsentUrl } = await import('./platforms/index.js');
      
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
      return jsonResponse({ error: 'Failed to generate authorization URL' }, 500, corsHeaders);
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
    const state = url.searchParams.get('state') || `${platform}_${apiKey}_${Date.now()}_${crypto.randomUUID()}`;

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

      // 2. Find OAuth app for this platform and user using efficient key lookup
      const appKey = `app-${platform}-${userEmail}`;
      const appData = await this.env.OAUTH_TOKENS.get(appKey);
      let userApp = null;
      
      if (appData) {
        userApp = JSON.parse(appData);
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
      const { generateConsentUrl } = await import('./platforms/index.js');
      
      // Generate the authorization URL with callback pointing to our callback endpoint
      const authUrl = await generateConsentUrl(platform, userApp, apiKey, state, 'https://oauth-hub.com');
      
      return jsonResponse({
        consentURL: authUrl,
        Platform: platform
      }, 200, corsHeaders);
      
    } catch (error) {
      console.error('Consent URL generation failed:', error.message);
      return jsonResponse({ error: 'Failed to generate consent URL' }, 500, corsHeaders);
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

    // Extract platform and API key from state parameter (format: platform_apikey_timestamp_uuid)
    const stateParts = state.split('_');
    if (stateParts.length < 4) {
      return jsonResponse({
        error: 'Invalid state parameter format'
      }, 400, corsHeaders);
    }

    const platform = stateParts[0];
    // API key is everything between platform and timestamp+uuid (last 2 parts)
    const apiKey = stateParts.slice(1, -2).join('_');

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

      // 2. Find OAuth app for this platform and user using efficient key lookup
      const appKey = `app-${platform}-${userEmail}`;
      const appData = await this.env.OAUTH_TOKENS.get(appKey);
      let userApp = null;
      
      if (appData) {
        userApp = JSON.parse(appData);
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
      const { exchangeCodeForToken, getUserInfo } = await import('./platforms/index.js');
      
      // 3. Exchange authorization code for access token (use the same redirect URI as consent)
      const tokens = await exchangeCodeForToken(platform, code, userApp);
      
      // 4. Get user info to extract platform user ID
      const { platformUserId, userInfo } = await getUserInfo(platform, tokens.accessToken);
      
      // 5. SCALABLE TOKEN STORAGE: Use consistent key format
      const tokenKey = `token-${platformUserId}-${apiKey}`;
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

      // 6. Return HTML that communicates with parent window
      const callbackHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>OAuth Complete</title>
        </head>
        <body>
          <script>
            // Send data to parent window
            if (window.opener) {
              window.opener.postMessage({
                type: 'oauth_complete',
                platform: '${platform}',
                platformUserId: '${platformUserId}',
                tokens: {
                  access_token: 'stored_securely',
                  platform: '${platform}',
                  platformUserId: '${platformUserId}'
                }
              }, '*');
              window.close();
            } else if (window.parent !== window) {
              window.parent.postMessage({
                type: 'oauth_complete',
                platform: '${platform}',
                platformUserId: '${platformUserId}',
                tokens: {
                  access_token: 'stored_securely',
                  platform: '${platform}',
                  platformUserId: '${platformUserId}'
                }
              }, '*');
            } else {
              document.body.innerHTML = '<h2>OAuth Complete!</h2><p>Platform: ${platform}</p><p>User ID: ${platformUserId}</p><p>You can close this window.</p>';
            }
          </script>
        </body>
        </html>
      `;
      
      return htmlResponse(callbackHtml, 200, corsHeaders);
      
    } catch (error) {
      console.error('OAuth consent processing failed:', error.message);
      return jsonResponse({ error: 'Failed to process OAuth consent' }, 500, corsHeaders);
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
      // 1. SCALABLE TOKEN LOOKUP: Direct key access - O(1) operation
      const tokenKey = `token-${platformUserId}-${apiKey}`;
      const tokenDataRaw = await this.env.OAUTH_TOKENS.get(tokenKey);
      let tokenData = null;
      
      if (tokenDataRaw) {
        tokenData = JSON.parse(tokenDataRaw);
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
          const { refreshAccessToken } = await import('./platforms/index.js');
          
          // Find the OAuth app configuration for refresh using efficient lookup
          const { validApiKey, userEmail } = await this.validateApiKey(apiKey);
          if (!validApiKey) {
            return jsonResponse({
              error: 'Invalid API key for token refresh'
            }, 401, corsHeaders);
          }
          
          const appKey = `app-${tokenData.platform}-${userEmail}`;
          const appData = await this.env.OAUTH_TOKENS.get(appKey);
          let userApp = null;
          
          if (appData) {
            userApp = JSON.parse(appData);
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
      return jsonResponse({ error: 'Failed to retrieve tokens' }, 500, corsHeaders);
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

      // =============================================================================
      // SUBSCRIPTION ENDPOINTS
      // =============================================================================
      
      // Get subscription plans
      if (path === '/subscription/plans' && method === 'GET') {
        return await this.subscriptionHandler.getPlans();
      }
      
      // Create Stripe checkout session
      if (path === '/subscription/checkout' && method === 'POST') {
        const body = await request.json();
        const { email, priceId } = body;
        const successUrl = `${url.origin}/subscription/success`;
        const cancelUrl = `${url.origin}/subscription/cancel`;
        
        try {
          const session = await this.subscriptionHandler.createCheckoutSession(
            email, priceId, successUrl, cancelUrl
          );
          return jsonResponse({ success: true, checkoutUrl: session.url }, 200, corsHeaders);
        } catch (error) {
          return jsonResponse({ error: error.message }, 400, corsHeaders);
        }
      }
      
      // Get subscription status
      if (path === '/subscription/status' && method === 'GET') {
        const email = url.searchParams.get('email');
        if (!email) {
          return jsonResponse({ error: 'Email parameter required' }, 400, corsHeaders);
        }
        return await this.subscriptionHandler.getSubscriptionStatus(email);
      }
      
      // Apply promo code
      if (path === '/subscription/promo' && method === 'POST') {
        const body = await request.json();
        const { email, promoCode } = body;
        return await this.subscriptionHandler.applyPromoCode(email, promoCode);
      }
      
      // Cancel subscription
      if (path === '/subscription/cancel' && method === 'POST') {
        const body = await request.json();
        const { email } = body;
        return await this.subscriptionHandler.cancelSubscription(email);
      }
      
      // Stripe webhook endpoint
      if (path === '/webhook/stripe' && method === 'POST') {
        return await this.subscriptionHandler.handleWebhook(request);
      }
      
      // Grant Austyn full access (admin endpoint)
      if (path === '/admin/grant-austyn-access' && method === 'POST') {
        const { SubscriptionService } = await import('../lib/services/subscription.service.js');
        const subscriptionService = new SubscriptionService(this.env);
        const result = await subscriptionService.giveAustynFullAccess();
        return jsonResponse(result, result.success ? 200 : 400, corsHeaders);
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

      // Subscription page
      if (path === '/subscription') {
        return htmlResponse(getModernSubscriptionPage());
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
