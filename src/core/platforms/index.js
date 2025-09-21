/**
 * 🎯 UNIFIED PLATFORM SYSTEM - Main Entry Point
 * 
 * This is the single import point for all platform configurations and OAuth handlers.
 * Individual platforms are separated into their own files for better maintainability
 * while this file maintains backward compatibility.
 * 
 * Import structure:
 * - Platform configs from ./configs/
 * - OAuth handlers from ./oauth/
 * - Utilities from ./utils/
 */

// Import available platform configurations
// Note: More platforms can be added by creating config files in ./configs/
import { google } from './configs/google.js';
import { facebook } from './configs/facebook.js';
import { instagram } from './configs/instagram.js';
import { twitter } from './configs/twitter.js';
import { linkedin } from './configs/linkedin.js';
import { apple } from './configs/apple.js';
import { microsoft } from './configs/microsoft.js';
import { github } from './configs/github.js';
import { spotify } from './configs/spotify.js';
import { discord } from './configs/discord.js';

// Stub configurations - replace with full configs from original platforms.js
import { createStubConfig, STUB_PLATFORMS } from './configs/_stub-template.js';

// Import OAuth handlers
import { 
  generateConsentUrl, 
  exchangeCodeForToken, 
  getUserInfo, 
  refreshAccessToken 
} from './oauth/oauth-service.js';

// Import utilities
import { 
  getPlatform, 
  getAllPlatforms, 
  getPlatformNames, 
  getPlatformScopes 
} from './utils/platform-utils.js';

// ============================================================================
// 🌐 UNIFIED PLATFORM REGISTRY
// All platform configurations in one place for easy access
// ============================================================================

// Available platform configurations (fully implemented)
const AVAILABLE_PLATFORMS = {
  google,
  facebook,
  instagram,
  twitter,
  linkedin,
  apple,
  microsoft,
  github,
  spotify,
  discord
};

// Generate stub configurations for remaining platforms
const STUB_PLATFORMS_CONFIGS = {};
for (const [platformName, info] of Object.entries(STUB_PLATFORMS)) {
  STUB_PLATFORMS_CONFIGS[platformName] = createStubConfig(platformName, info);
}

// Combine available platforms with stubs
export const PLATFORMS = {
  ...AVAILABLE_PLATFORMS,
  ...STUB_PLATFORMS_CONFIGS
};

// ============================================================================
// 🔧 RE-EXPORT OAUTH HANDLERS & UTILITIES
// Maintain backward compatibility with existing imports
// ============================================================================

export {
  // OAuth Flow Functions
  generateConsentUrl,
  exchangeCodeForToken,
  getUserInfo,
  refreshAccessToken,
  
  // Utility Functions
  getPlatform,
  getAllPlatforms,
  getPlatformNames,
  getPlatformScopes
};

// ============================================================================
// 📊 PLATFORM STATISTICS & INFO
// ============================================================================

export const PLATFORM_STATS = {
  totalPlatforms: Object.keys(PLATFORMS).length,
  categories: {
    'Social Media': ['google', 'facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'pinterest', 'reddit'],
    'Business & Productivity': ['microsoft', 'salesforce', 'hubspot', 'zoom', 'slack', 'trello', 'asana', 'notion'],
    'Creative & Design': ['adobe', 'figma', 'canva', 'dribbble', 'unsplash'],
    'E-commerce & Payments': ['amazon', 'shopify', 'stripe', 'paypal', 'coinbase'],
    'Developer Tools': ['github'],
    'Entertainment & Gaming': ['spotify', 'twitch', 'discord', 'netflix', 'steam'],
    'Cloud Storage': ['dropbox', 'box'],
    'Content Management': ['wordpress'],
    'Marketing': ['mailchimp']
  },
  supportedAuthTypes: ['OAuth 2.0', 'OAuth 1.0a', 'OpenID Connect'],
  lastUpdated: new Date().toISOString()
};

// ============================================================================
// 🎯 PLATFORM VALIDATION
// Ensure all platforms are properly configured
// ============================================================================

function validatePlatform(platformName, config) {
  const required = ['name', 'displayName', 'authUrl', 'tokenUrl', 'userInfoUrl', 'userIdField'];
  const missing = required.filter(field => !config[field]);
  
  if (missing.length > 0) {
    throw new Error(`Platform ${platformName} missing required fields: ${missing.join(', ')}`);
  }
}

// Validate all platforms on load
Object.entries(PLATFORMS).forEach(([name, config]) => {
  try {
    validatePlatform(name, config);
  } catch (error) {
    console.error(`❌ Platform validation failed for ${name}:`, error.message);
    throw error; // Re-throw to prevent loading invalid platforms
  }
});

console.log(`✅ Loaded ${Object.keys(PLATFORMS).length} OAuth platforms successfully`);
