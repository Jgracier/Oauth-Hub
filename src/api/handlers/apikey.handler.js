// =============================================================================
// 🔑 API KEY HANDLER - Manage user API keys
// =============================================================================

import { BaseHandler } from './base.handler.js';

export class ApiKeyHandler extends BaseHandler {
  /**
   * Get user's API keys
   */
  async getUserKeys(request, corsHeaders) {
    try {
      const email = this.validateEmailParam(request);
      
      // SCALABLE LOOKUP: Use user index instead of full scan
      const userIndexKey = `user-keys-${email}`;
      const userIndex = await this.env.API_KEYS.get(userIndexKey);
      
      let userRecords = [];
      if (userIndex) {
        const keyNames = JSON.parse(userIndex);
        const keyPromises = keyNames.map(keyName => this.env.API_KEYS.get(keyName));
        const keyData = await Promise.all(keyPromises);
        
        userRecords = keyData
          .filter(data => data !== null)
          .map(data => JSON.parse(data));
      }

      // Transform records to expected format
      const userKeys = userRecords.map(record => ({
        keyName: record.keyName,
        apiKey: record.apiKey,
        createdAt: record.createdAt,
        keyId: record.keyId
      }));

      return this.successResponse({ keys: userKeys }, corsHeaders);

    } catch (error) {
      return this.handleError(error, 'Get user keys', corsHeaders);
    }
  }

  /**
   * Generate new API key
   */
  async generateKey(request, corsHeaders) {
    try {
      const { email, name } = await request.json();
      
      if (!email || !name) {
        throw new Error('Email and name are required');
      }

      // Generate new API key
      const apiKey = 'sk_' + Array.from({length: 32}, () => Math.random().toString(16)[2]).join('');
      const keyId = Array.from({length: 32}, () => Math.random().toString(16)[2]).join('').substring(0, 32);
      
      // Create key record
      const keyRecord = {
        keyName: name,
        apiKey: apiKey,
        email: email,
        createdAt: new Date().toISOString(),
        keyId: keyId
      };

      // SCALABLE STORAGE: Store main record, lookup index, and user index
      const keyName = `api-${name}-${email}`;
      const lookupKey = `lookup-${apiKey}`;
      const userIndexKey = `user-keys-${email}`;
      
      // Get existing user index and add new key
      const existingIndex = await this.env.API_KEYS.get(userIndexKey);
      const userKeys = existingIndex ? JSON.parse(existingIndex) : [];
      userKeys.push(keyName);
      
      await Promise.all([
        this.env.API_KEYS.put(keyName, JSON.stringify(keyRecord)),
        this.env.API_KEYS.put(lookupKey, JSON.stringify({ email, keyName })),
        this.env.API_KEYS.put(userIndexKey, JSON.stringify(userKeys))
      ]);

      return this.successResponse({ 
        key: { key: apiKey, name: name, id: keyId }
      }, corsHeaders);

    } catch (error) {
      return this.handleError(error, 'Generate key', corsHeaders);
    }
  }

  /**
   * Delete API key
   */
  async deleteKey(request, corsHeaders) {
    try {
      const url = new URL(request.url);
      const keyId = url.pathname.split('/').pop();
      const email = url.searchParams.get('email');
      
      if (!keyId || !email) {
        throw new Error('Key ID and email are required');
      }

      // Find and delete the key
      const { keys } = await this.env.API_KEYS.list();
      let deleted = false;
      
      for (const keyInfo of keys) {
        if (keyInfo.name.endsWith(email)) {
          const keyData = await this.env.API_KEYS.get(keyInfo.name);
          if (keyData) {
            const parsed = JSON.parse(keyData);
            if (parsed.keyId === keyId && parsed.email === email) {
              await this.env.API_KEYS.delete(keyInfo.name);
              deleted = true;
              break;
            }
          }
        }
      }

      if (!deleted) {
        throw new Error('API key not found');
      }

      return this.successResponse({ message: 'API key deleted successfully' }, corsHeaders);

    } catch (error) {
      return this.handleError(error, 'Delete key', corsHeaders);
    }
  }
}