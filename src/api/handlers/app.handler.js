// =============================================================================
// 📱 APP HANDLER - Manage user OAuth applications
// =============================================================================

import { BaseHandler } from './base.handler.js';

export class AppHandler extends BaseHandler {
  /**
   * Get user's OAuth apps
   */
  async getUserApps(request, corsHeaders) {
    try {
      const email = this.validateEmailParam(request);
      
      // Search for OAuth apps belonging to this user
      const userRecords = await this.searchUserRecords(
        this.env.OAUTH_TOKENS,
        (keyName, email) => keyName.startsWith('app-') && keyName.endsWith(`-${email}`),
        email
      );

      // Transform records to expected format
      const userApps = userRecords.map(record => ({
        platform: record.platform,
        name: record.name || record.appName,
        clientId: record.clientId,
        clientSecret: record.clientSecret,
        scopes: record.scopes || [],
        createdAt: record.createdAt
      }));

      return this.successResponse({ apps: userApps }, corsHeaders);

    } catch (error) {
      return this.handleError(error, 'Get user apps', corsHeaders);
    }
  }

  /**
   * Save OAuth app
   */
  async saveApp(request, corsHeaders) {
    try {
      const appData = await request.json();
      const { userEmail, platform, name, clientId, clientSecret, scopes, redirectUri } = appData;
      const email = userEmail; // For backward compatibility
      
      if (!email || !platform || !clientId || !clientSecret) {
        throw new Error('Email, platform, clientId, and clientSecret are required');
      }

      // Create app record
      const appRecord = {
        userEmail: email,
        platform: platform,
        name: name || platform.charAt(0).toUpperCase() + platform.slice(1),
        clientId: clientId,
        clientSecret: clientSecret,
        scopes: scopes || [],
        redirectUri: redirectUri,
        createdAt: new Date().toISOString()
      };

      // Store in KV (using consistent format: app-{platform}-{email})
      const keyName = `app-${platform}-${email}`;
      await this.env.OAUTH_TOKENS.put(keyName, JSON.stringify(appRecord));

      return this.successResponse({ 
        message: 'OAuth app saved successfully',
        app: appRecord
      }, corsHeaders);

    } catch (error) {
      return this.handleError(error, 'Save app', corsHeaders);
    }
  }

  /**
   * Delete OAuth app
   */
  async deleteApp(request, corsHeaders) {
    try {
      const url = new URL(request.url);
      const platform = url.pathname.split('/').pop();
      const email = url.searchParams.get('email');
      
      if (!platform || !email) {
        throw new Error('Platform and email are required');
      }

      // Search for the OAuth app by platform and email
      const { keys } = await this.env.OAUTH_TOKENS.list();
      let foundKey = null;
      
      for (const keyInfo of keys) {
        if (keyInfo.name.startsWith(`app-${platform}-`)) {
          const data = await this.env.OAUTH_TOKENS.get(keyInfo.name);
          if (data) {
            const parsed = JSON.parse(data);
            if (parsed.userEmail === email || parsed.email === email) {
              foundKey = keyInfo.name;
              break;
            }
          }
        }
      }
      
      if (!foundKey) {
        throw new Error('OAuth app not found');
      }

      await this.env.OAUTH_TOKENS.delete(foundKey);

      return this.successResponse({ 
        message: 'OAuth app deleted successfully',
        deletedKey: foundKey
      }, corsHeaders);

    } catch (error) {
      return this.handleError(error, 'Delete app', corsHeaders);
    }
  }
}
