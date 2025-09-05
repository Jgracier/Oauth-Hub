// =============================================================================
// 🔑 API KEY HANDLER - API key management endpoints
// =============================================================================

import { jsonResponse, parseJsonBody } from '../../lib/utils/helpers.js';
import { getSessionFromRequest } from '../../lib/auth/session.js';
import { UserService } from '../../lib/services/user.service.js';
import { ApiKeyService } from '../../lib/services/apikey.service.js';

export class ApiKeyHandler {
  constructor(env) {
    this.env = env;
    this.userService = new UserService(env);
    this.apiKeyService = new ApiKeyService(env);
  }

  /**
   * Generate new API key
   */
  async generateApiKey(request, corsHeaders) {
    try {
      const sessionToken = getSessionFromRequest(request);
      const user = await this.userService.getBySessionToken(sessionToken);
      
      if (!user) {
        return jsonResponse({ error: 'Authentication required' }, 401, corsHeaders);
      }
      
      const data = await parseJsonBody(request);
      const keyName = data.name || 'Default API Key';
      
      const { keyData } = await this.apiKeyService.generate(user.userData.email, keyName);
      
      return jsonResponse({
        success: true,
        message: 'API key generated successfully',
        apiKey: keyData.apiKey,
        keyId: keyData.id,
        name: keyData.name
      }, 200, corsHeaders);
      
    } catch (error) {
      return jsonResponse({ 
        error: 'Failed to generate API key', 
        message: error.message 
      }, 500, corsHeaders);
    }
  }

  /**
   * Get user's API keys
   */
  async getUserApiKeys(request, corsHeaders) {
    try {
      const sessionToken = getSessionFromRequest(request);
      const user = await this.userService.getBySessionToken(sessionToken);
      
      if (!user) {
        return jsonResponse({ error: 'Authentication required' }, 401, corsHeaders);
      }
      
      const apiKeys = await this.apiKeyService.getByUser(user.userData.email);
      
      // Return keys without the actual API key value for security
      const safeKeys = apiKeys.map(key => ({
        id: key.id,
        name: key.name,
        createdAt: key.createdAt,
        lastUsed: key.lastUsed,
        isActive: key.isActive,
        // Only show first 8 characters of API key
        apiKeyPreview: key.apiKey.substring(0, 8) + '...'
      }));
      
      return jsonResponse({
        success: true,
        apiKeys: safeKeys
      }, 200, corsHeaders);
      
    } catch (error) {
      return jsonResponse({ 
        error: 'Failed to get API keys', 
        message: error.message 
      }, 500, corsHeaders);
    }
  }

  /**
   * Delete API key
   */
  async deleteApiKey(keyId, request, corsHeaders) {
    try {
      const sessionToken = getSessionFromRequest(request);
      const user = await this.userService.getBySessionToken(sessionToken);
      
      if (!user) {
        return jsonResponse({ error: 'Authentication required' }, 401, corsHeaders);
      }
      
      const deleted = await this.apiKeyService.delete(keyId, user.userData.email);
      
      if (!deleted) {
        return jsonResponse({ error: 'API key not found or unauthorized' }, 404, corsHeaders);
      }
      
      return jsonResponse({
        success: true,
        message: 'API key deleted successfully'
      }, 200, corsHeaders);
      
    } catch (error) {
      return jsonResponse({ 
        error: 'Failed to delete API key', 
        message: error.message 
      }, 500, corsHeaders);
    }
  }
}
