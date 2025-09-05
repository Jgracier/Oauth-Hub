// =============================================================================
// 🔑 API KEY SERVICE - API key management operations
// =============================================================================

import { generateApiKey, generateId } from '../utils/helpers.js';

export class ApiKeyService {
  constructor(env) {
    this.env = env;
  }

  /**
   * Validate API key and return associated user
   */
  async validate(apiKey) {
    const { keys } = await this.env.API_KEYS.list();
    
    for (const keyInfo of keys) {
      if (keyInfo.name.startsWith('api-')) {
        const data = await this.env.API_KEYS.get(keyInfo.name);
        const keyData = JSON.parse(data);
        
        if (keyData.apiKey === apiKey) {
          return {
            email: keyData.userEmail,
            keyData: keyData,
            keyName: keyInfo.name
          };
        }
      }
    }
    
    return null;
  }

  /**
   * Generate new API key for user
   */
  async generate(userEmail, keyName) {
    const apiKey = generateApiKey();
    const keyId = generateId();
    
    const keyData = {
      id: keyId,
      apiKey: apiKey,
      userEmail: userEmail,
      name: keyName || 'Default API Key',
      createdAt: new Date().toISOString(),
      lastUsed: null,
      isActive: true
    };
    
    const keyStorageName = `api-${keyId}`;
    await this.env.API_KEYS.put(keyStorageName, JSON.stringify(keyData));
    
    return { keyData, keyStorageName };
  }

  /**
   * Get all API keys for a user
   */
  async getByUser(userEmail) {
    const { keys } = await this.env.API_KEYS.list();
    const userKeys = [];
    
    for (const keyInfo of keys) {
      if (keyInfo.name.startsWith('api-')) {
        const data = await this.env.API_KEYS.get(keyInfo.name);
        const keyData = JSON.parse(data);
        
        if (keyData.userEmail === userEmail) {
          userKeys.push({
            ...keyData,
            keyName: keyInfo.name
          });
        }
      }
    }
    
    return userKeys;
  }

  /**
   * Delete API key
   */
  async delete(keyId, userEmail) {
    const { keys } = await this.env.API_KEYS.list();
    
    for (const keyInfo of keys) {
      if (keyInfo.name.startsWith('api-')) {
        const data = await this.env.API_KEYS.get(keyInfo.name);
        const keyData = JSON.parse(data);
        
        if (keyData.id === keyId && keyData.userEmail === userEmail) {
          await this.env.API_KEYS.delete(keyInfo.name);
          return true;
        }
      }
    }
    
    return false;
  }
}
