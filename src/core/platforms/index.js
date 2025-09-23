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

// Import all platform configurations
// Note: Each platform is now in its own dedicated file for better maintainability
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
import { twitch } from './configs/twitch.js';
import { slack } from './configs/slack.js';
import { pinterest } from './configs/pinterest.js';
import { tiktok } from './configs/tiktok.js';
import { reddit } from './configs/reddit.js';
import { wordpress } from './configs/wordpress.js';
import { shopify } from './configs/shopify.js';
import { stripe } from './configs/stripe.js';
import { paypal } from './configs/paypal.js';
import { amazon } from './configs/amazon.js';
import { salesforce } from './configs/salesforce.js';
import { hubspot } from './configs/hubspot.js';
import { zoom } from './configs/zoom.js';
import { trello } from './configs/trello.js';
import { asana } from './configs/asana.js';
import { notion } from './configs/notion.js';
import { adobe } from './configs/adobe.js';
import { figma } from './configs/figma.js';
import { canva } from './configs/canva.js';
import { dribbble } from './configs/dribbble.js';
import { unsplash } from './configs/unsplash.js';
import { dropbox } from './configs/dropbox.js';
import { box } from './configs/box.js';
import { netflix } from './configs/netflix.js';
import { steam } from './configs/steam.js';
import { coinbase } from './configs/coinbase.js';
import { mailchimp } from './configs/mailchimp.js';

// Note: All 37 platforms are now fully implemented in individual config files

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

// All platform configurations (fully implemented)
export const PLATFORMS = {
  // Tier 1 American Platforms (7)
  google,
  facebook,
  instagram,
  twitter,
  linkedin,
  apple,
  microsoft,
  
  // Developer Tools (1)
  github,
  
  // Entertainment & Gaming (5)
  spotify,
  discord,
  twitch,
  netflix,
  steam,
  
  // Business & Productivity (7)
  slack,
  salesforce,
  hubspot,
  zoom,
  trello,
  asana,
  notion,
  
  // Social & Communication (4)
  pinterest,
  tiktok,
  reddit,
  wordpress,
  
  // E-commerce & Payments (4)
  shopify,
  stripe,
  paypal,
  amazon,
  
  // Creative & Design (5)
  adobe,
  figma,
  canva,
  dribbble,
  unsplash,
  
  // Cloud Storage (2)
  dropbox,
  box,
  
  // Cryptocurrency & Finance (1)
  coinbase,
  
  // Email & Marketing (1)
  mailchimp
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
  totalPlatforms: 37,
  categories: {
    'Tier 1 American': ['google', 'facebook', 'instagram', 'twitter', 'linkedin', 'apple', 'microsoft'],
    'Business & Productivity': ['slack', 'salesforce', 'hubspot', 'zoom', 'trello', 'asana', 'notion'],
    'Entertainment & Gaming': ['spotify', 'discord', 'twitch', 'netflix', 'steam'],
    'Social & Communication': ['pinterest', 'tiktok', 'reddit', 'wordpress'],
    'E-commerce & Payments': ['shopify', 'stripe', 'paypal', 'amazon'],
    'Creative & Design': ['adobe', 'figma', 'canva', 'dribbble', 'unsplash'],
    'Cloud Storage': ['dropbox', 'box'],
    'Developer Tools': ['github'],
    'Cryptocurrency & Finance': ['coinbase'],
    'Email & Marketing': ['mailchimp']
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
