// =============================================================================
// 🛣️ CLEAN ROUTER - Streamlined routing with proper separation of concerns
// =============================================================================

import { htmlResponse, jsonResponse, getCorsHeaders } from '../lib/utils/helpers.js';
import { UNIFIED_CSS } from '../ui/styles.js';

// Import UI pages
import { getAuthPage } from '../ui/pages/auth.js';
import { getDashboardPage } from '../ui/pages/dashboard.js';
import { getApiKeysPage } from '../ui/pages/api-keys.js';
import { getAppsPage } from '../ui/pages/apps.js';
import { getDocsPage } from '../ui/pages/docs.js';
import { getAnalyticsPage } from '../ui/pages/analytics.js';

// Import handlers
import { AuthHandler } from '../api/handlers/auth.handler.js';
import { ApiKeyHandler } from '../api/handlers/apikey.handler.js';
import { AppHandler } from '../api/handlers/app.handler.js';

export class Router {
  constructor(env) {
    this.env = env;
    this.authHandler = new AuthHandler(env);
    this.apiKeyHandler = new ApiKeyHandler(env);
    this.appHandler = new AppHandler(env);
  }

  // Helper method to get session from request
  getSessionFromRequest(request) {
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) return null;
    const match = cookieHeader.match(/session=([^;]+)/);
    return match ? match[1] : null;
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
        return htmlResponse(getAuthPage(UNIFIED_CSS));
      }

      // Dashboard page
      if (path === '/dashboard') {
        return htmlResponse(getDashboardPage(UNIFIED_CSS));
      }

      // API Keys page
      if (path === '/api-keys') {
        return htmlResponse(getApiKeysPage(UNIFIED_CSS));
      }

      // Apps page
      if (path === '/apps') {
        return htmlResponse(getAppsPage(UNIFIED_CSS));
      }

      // Documentation page
      if (path === '/docs') {
        return htmlResponse(getDocsPage(UNIFIED_CSS));
      }

      // Analytics page
      if (path === '/analytics') {
        return htmlResponse(getAnalyticsPage(UNIFIED_CSS));
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
