/**
 * Centralized Configuration
 * All URLs and environment-specific settings in one place
 */

export const CONFIG = {
  // Base URL - change this one place to update everywhere
  BASE_URL: 'https://oauth-hub.com',
  
  // Derived URLs - these are templates, actual URLs will include API key
  get CALLBACK_URL() {
    return `${this.BASE_URL}/callback/{apiKey}`;
  },
  
  get WWW_URL() {
    return `https://www.oauth-hub.com`;
  },
  
  get WWW_CALLBACK_URL() {
    return `${this.BASE_URL}/callback/{apiKey}`;
  },
  
  // API endpoints
  ENDPOINTS: {
    CONSENT: (platform, apiKey) => `${CONFIG.BASE_URL}/consent/${platform}/${apiKey}`,
    TOKENS: (platformUserId, apiKey) => `${CONFIG.BASE_URL}/tokens/${platformUserId}/${apiKey}`,
    REFRESH: (platformUserId, apiKey) => `${CONFIG.BASE_URL}/refresh/${platformUserId}/${apiKey}`,
    HEALTH: () => `${CONFIG.BASE_URL}/health`
  }
};

// For backward compatibility and easy access
export const BASE_URL = CONFIG.BASE_URL;
export const CALLBACK_URL = CONFIG.CALLBACK_URL;
export const WWW_CALLBACK_URL = CONFIG.WWW_CALLBACK_URL;
