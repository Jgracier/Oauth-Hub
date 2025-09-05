// =============================================================================
// 📱 APP HANDLER - OAuth app management endpoints
// =============================================================================

import { jsonResponse, parseJsonBody } from '../../lib/utils/helpers.js';
import { getSessionFromRequest } from '../../lib/auth/session.js';
import { UserService } from '../../lib/services/user.service.js';
import { AppService } from '../../lib/services/app.service.js';

export class AppHandler {
  constructor(env) {
    this.env = env;
    this.userService = new UserService(env);
    this.appService = new AppService(env);
  }

  /**
   * Save OAuth app credentials
   */
  async saveAppCredentials(request, corsHeaders) {
    try {
      const sessionToken = getSessionFromRequest(request);
      const user = await this.userService.getBySessionToken(sessionToken);
      
      if (!user) {
        return jsonResponse({ error: 'Authentication required' }, 401, corsHeaders);
      }
      
      const appData = await parseJsonBody(request);
      const { platform, clientId, clientSecret, scopes, redirectUri, name } = appData;
      
      if (!platform || !clientId || !clientSecret) {
        return jsonResponse({ 
          error: 'Missing required fields: platform, clientId, clientSecret' 
        }, 400, corsHeaders);
      }
      
      const savedApp = await this.appService.save(platform, {
        name,
        clientId,
        clientSecret,
        scopes: scopes || [],
        redirectUri
      }, user.userData.email);
      
      return jsonResponse({
        success: true,
        message: 'OAuth app credentials saved successfully',
        app: {
          platform: savedApp.platform,
          name: savedApp.name,
          clientId: savedApp.clientId,
          // Don't return client secret for security
          scopes: savedApp.scopes,
          redirectUri: savedApp.redirectUri
        }
      }, 200, corsHeaders);
      
    } catch (error) {
      return jsonResponse({ 
        error: 'Failed to save app credentials', 
        message: error.message 
      }, 500, corsHeaders);
    }
  }

  /**
   * Get user's OAuth apps
   */
  async getUserApps(request, corsHeaders) {
    try {
      const sessionToken = getSessionFromRequest(request);
      const user = await this.userService.getBySessionToken(sessionToken);
      
      if (!user) {
        return jsonResponse({ error: 'Authentication required' }, 401, corsHeaders);
      }
      
      const apps = await this.appService.getByUser(user.userData.email);
      
      // Return apps without client secrets for security
      const safeApps = apps.map(app => ({
        platform: app.platform,
        name: app.name,
        clientId: app.clientId,
        scopes: app.scopes,
        redirectUri: app.redirectUri,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt
      }));
      
      return jsonResponse({
        success: true,
        apps: safeApps
      }, 200, corsHeaders);
      
    } catch (error) {
      return jsonResponse({ 
        error: 'Failed to get apps', 
        message: error.message 
      }, 500, corsHeaders);
    }
  }

  /**
   * Delete OAuth app credentials
   */
  async deleteAppCredentials(platform, request, corsHeaders) {
    try {
      const sessionToken = getSessionFromRequest(request);
      const user = await this.userService.getBySessionToken(sessionToken);
      
      if (!user) {
        return jsonResponse({ error: 'Authentication required' }, 401, corsHeaders);
      }
      
      const deleted = await this.appService.delete(platform, user.userData.email);
      
      if (!deleted) {
        return jsonResponse({ error: 'App not found' }, 404, corsHeaders);
      }
      
      return jsonResponse({
        success: true,
        message: 'OAuth app deleted successfully'
      }, 200, corsHeaders);
      
    } catch (error) {
      if (error.message === 'Unauthorized to delete this app') {
        return jsonResponse({ error: error.message }, 403, corsHeaders);
      }
      
      return jsonResponse({ 
        error: 'Failed to delete app', 
        message: error.message 
      }, 500, corsHeaders);
    }
  }
}
