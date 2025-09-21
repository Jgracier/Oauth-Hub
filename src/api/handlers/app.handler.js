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
      const { userEmail, platform, name, clientId, clientSecret, autoDetect = true, manualScopes, redirectUri } = appData;
      const email = userEmail; // For backward compatibility
      
      if (!email || !platform || !clientId || !clientSecret) {
        throw new Error('Email, platform, clientId, and clientSecret are required');
      }

      let finalScopes = [];
      let appName = name || `${platform.charAt(0).toUpperCase() + platform.slice(1)} App`;
      let introspectionResult = null;

      if (autoDetect) {
        try {
          // Import introspection service
          const { introspectApp } = await import('../../core/platforms/oauth/app-introspection.js');
          
          // Automatically detect app configuration and scopes
          introspectionResult = await introspectApp(platform, clientId, clientSecret);
          
          finalScopes = introspectionResult.finalScopes || [];
          appName = introspectionResult.appName || appName;
          
        } catch (introspectionError) {
          console.warn(`Auto-detection failed for ${platform}:`, introspectionError.message);
          
          // Fallback to platform defaults if auto-detection fails
          const { PLATFORMS } = await import('../../core/platforms/index.js');
          const platformConfig = PLATFORMS[platform.toLowerCase()];
          finalScopes = platformConfig?.requiredScopes || [];
        }
      } else {
        // Use manually provided scopes
        finalScopes = manualScopes || [];
      }

      // Create app record
      const appRecord = {
        userEmail: email,
        platform: platform,
        name: appName,
        clientId: clientId,
        clientSecret: clientSecret,
        scopes: finalScopes,
        redirectUri: redirectUri,
        autoDetected: autoDetect,
        introspectionData: introspectionResult,
        createdAt: new Date().toISOString()
      };

      // Store in KV (using consistent format: app-{platform}-{email})
      const keyName = `app-${platform}-${email}`;
      await this.env.OAUTH_TOKENS.put(keyName, JSON.stringify(appRecord));

      return this.successResponse({ 
        message: 'OAuth app connected successfully',
        app: appRecord,
        autoDetected: autoDetect,
        detectedScopes: finalScopes,
        introspectionResult: introspectionResult
      }, corsHeaders);

    } catch (error) {
      return this.handleError(error, 'Save app', corsHeaders);
    }
  }

  /**
   * Test app credentials and fetch scopes
   */
  async testAppCredentials(request, corsHeaders) {
    try {
      const { platform, clientId, clientSecret } = await request.json();
      
      if (!platform || !clientId || !clientSecret) {
        throw new Error('Platform, clientId, and clientSecret are required');
      }

      // Import introspection service
      const { introspectApp } = await import('../../core/platforms/oauth/app-introspection.js');
      
      // Test credentials and fetch app configuration
      const result = await introspectApp(platform, clientId, clientSecret);
      
      return this.successResponse({
        success: true,
        platform: platform,
        appName: result.appName,
        detectedScopes: result.finalScopes || [],
        requiredScopes: result.requiredScopes || [],
        optionalScopes: result.optionalScopes || [],
        verified: result.verified,
        note: result.note,
        credentialsValid: true
      }, corsHeaders);

    } catch (error) {
      return this.errorResponse({
        success: false,
        error: error.message,
        credentialsValid: false
      }, 400, corsHeaders);
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




