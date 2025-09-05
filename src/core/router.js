// =============================================================================
// 🛣️ ROUTER - Request routing and handler coordination
// =============================================================================

import { htmlResponse, jsonResponse, getCorsHeaders } from '../lib/utils/helpers.js';
import { UNIFIED_CSS } from '../ui/styles.js';
import { getApiKeysPage } from '../ui/pages/api-keys.js';
import { getAuthPage } from '../ui/pages/auth.js';
import { getDashboardPage } from '../ui/pages/dashboard.js';
import { getAppsPage } from '../ui/pages/apps.js';
import { getDocsPage } from '../ui/pages/docs.js';
import { getAnalyticsPage } from '../ui/pages/analytics.js';

// Import handlers
import { AuthHandler } from '../api/handlers/auth.handler.js';
import { ApiKeyHandler } from '../api/handlers/apikey.handler.js';
import { OAuthHandler } from '../api/handlers/oauth.handler.js';
import { AppHandler } from '../api/handlers/app.handler.js';

// Import error handling
import { GlobalErrorHandler } from '../lib/utils/error-handler.js';
import { Logger } from '../lib/utils/logger.js';
import { MonitoringService } from '../lib/utils/monitoring.js';

export class Router {
  constructor(env) {
    this.env = env;
    this.logger = new Logger('Router', env);
    this.errorHandler = new GlobalErrorHandler(env);
    this.monitoring = new MonitoringService(env);
    this.authHandler = new AuthHandler(env);
    this.apiKeyHandler = new ApiKeyHandler(env);
    this.oauthHandler = new OAuthHandler(env);
    this.appHandler = new AppHandler(env);
  }

  async handleRequest(request) {
    const startTime = Date.now();
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const corsHeaders = getCorsHeaders();

    // Log incoming request
    this.logger.info('Incoming request', {
      method,
      path,
      userAgent: request.headers.get('User-Agent'),
      ip: request.headers.get('CF-Connecting-IP') || 
          request.headers.get('X-Forwarded-For') || 
          'unknown'
    });

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
      
      if (path === '/check-session' && method === 'GET') {
        return await this.authHandler.checkSession(request, corsHeaders);
      }

      // API Key endpoints
      if (path === '/generate-api-key' && method === 'POST') {
        return await this.apiKeyHandler.generateApiKey(request, corsHeaders);
      }
      
      if (path === '/api-keys' && method === 'GET') {
        return await this.apiKeyHandler.getUserApiKeys(request, corsHeaders);
      }
      
      if (path.startsWith('/delete-api-key/') && method === 'DELETE') {
        const keyId = path.split('/')[2];
        return await this.apiKeyHandler.deleteApiKey(keyId, request, corsHeaders);
      }

      // App management endpoints
      if (path === '/save-app' && method === 'POST') {
        return await this.appHandler.saveAppCredentials(request, corsHeaders);
      }
      
      if (path === '/user-apps' && method === 'GET') {
        return await this.appHandler.getUserApps(request, corsHeaders);
      }
      
      if (path.startsWith('/delete-app/') && method === 'DELETE') {
        const platform = path.split('/')[2];
        return await this.appHandler.deleteAppCredentials(platform, request, corsHeaders);
      }

      // OAuth flow endpoints
      if (path.startsWith('/consent/') && method === 'GET') {
        const pathParts = path.split('/');
        const platform = pathParts[2];
        const apiKey = pathParts[3];
        return await this.oauthHandler.handleConsentRequest(platform, apiKey, request, corsHeaders);
      }
      
      if (path === '/callback' && method === 'GET') {
        return await this.oauthHandler.handleOAuthCallback(request, corsHeaders);
      }
      
      if (path.startsWith('/tokens/') && method === 'GET') {
        const [, , platformUserId, apiKey] = path.split('/');
        return await this.oauthHandler.handleTokenRequest(platformUserId, apiKey, request, corsHeaders);
      }
      
      if (path.startsWith('/revoke-token/') && method === 'DELETE') {
        const [, , platformUserId] = path.split('/');
        return await this.oauthHandler.revokeUserToken(platformUserId, request, corsHeaders);
      }

      // Analytics endpoint (simplified for now)
      if (path === '/analytics-data' && method === 'GET') {
        return await this.getAnalyticsData(request, corsHeaders);
      }
      
      // Health check
      if (path === '/health') {
        const healthStatus = await this.monitoring.performHealthCheck();
        return jsonResponse(healthStatus, healthStatus.status === 'healthy' ? 200 : 503, corsHeaders);
      }

      // System stats
      if (path === '/stats' && method === 'GET') {
        const stats = await this.monitoring.getSystemStats();
        return jsonResponse(stats, 200, corsHeaders);
      }

      // =============================================================================
      // PAGE ROUTES
      // =============================================================================
      
      if (path === '/' || path === '/auth') {
        return htmlResponse(getAuthPage(UNIFIED_CSS));
      }
      
      if (path === '/dashboard') {
        return htmlResponse(getDashboardPage(UNIFIED_CSS));
      }
      
      if (path === '/api-keys') {
        return htmlResponse(getApiKeysPage(UNIFIED_CSS));
      }
      
      if (path === '/apps') {
        return htmlResponse(getAppsPage(UNIFIED_CSS));
      }
      
      if (path === '/docs') {
        return htmlResponse(getDocsPage(UNIFIED_CSS));
      }
      
      if (path === '/analytics') {
        return htmlResponse(getAnalyticsPage(UNIFIED_CSS));
      }

      // 404 for unmatched routes
      return jsonResponse({ error: 'Not found' }, 404, corsHeaders);

    } catch (error) {
      // Use global error handler for all unhandled errors
      return await this.errorHandler.handleError(error, request, corsHeaders);
    } finally {
      // Log request completion
      const duration = Date.now() - startTime;
      this.logger.logPerformance('Request', duration, {
        method,
        path
      });
    }
  }

  /**
   * Get analytics data (simplified implementation)
   */
  async getAnalyticsData(request, corsHeaders) {
    try {
      // Get all tokens for analytics
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
      
      // Group by platform
      const platformStats = {};
      tokens.forEach(token => {
        if (!platformStats[token.platform]) {
          platformStats[token.platform] = 0;
        }
        platformStats[token.platform]++;
      });
      
      return jsonResponse({
        success: true,
        data: {
          totalTokens: tokens.length,
          platformStats,
          recentTokens: tokens.slice(-10) // Last 10 tokens
        }
      }, 200, corsHeaders);
      
    } catch (error) {
      return jsonResponse({ 
        error: 'Failed to get analytics data', 
        message: error.message 
      }, 500, corsHeaders);
    }
  }
}
