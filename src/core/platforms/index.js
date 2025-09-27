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

// Require all platform configurations
// Note: Each platform is now in its own dedicated file for better maintainability
const { google } = require('./configs/google.js');
const { facebook } = require('./configs/facebook.js');
const { instagram } = require('./configs/instagram.js');
const { twitter } = require('./configs/twitter.js');
const { linkedin } = require('./configs/linkedin.js');
const { apple } = require('./configs/apple.js');
const { microsoft } = require('./configs/microsoft.js');
const { github } = require('./configs/github.js');
const { spotify } = require('./configs/spotify.js');
const { discord } = require('./configs/discord.js');
const { twitch } = require('./configs/twitch.js');
const { slack } = require('./configs/slack.js');
const { pinterest } = require('./configs/pinterest.js');
const { tiktok } = require('./configs/tiktok.js');
const { reddit } = require('./configs/reddit.js');
const { wordpress } = require('./configs/wordpress.js');
const { shopify } = require('./configs/shopify.js');
const { stripe } = require('./configs/stripe.js');
const { paypal } = require('./configs/paypal.js');
const { amazon } = require('./configs/amazon.js');
const { salesforce } = require('./configs/salesforce.js');
const { hubspot } = require('./configs/hubspot.js');
const { zoom } = require('./configs/zoom.js');
const { trello } = require('./configs/trello.js');
const { asana } = require('./configs/asana.js');
const { notion } = require('./configs/notion.js');
const { adobe } = require('./configs/adobe.js');
const { figma } = require('./configs/figma.js');
const { canva } = require('./configs/canva.js');
const { dribbble } = require('./configs/dribbble.js');
const { unsplash } = require('./configs/unsplash.js');
const { dropbox } = require('./configs/dropbox.js');
const { box } = require('./configs/box.js');
const { netflix } = require('./configs/netflix.js');
const { steam } = require('./configs/steam.js');
const { coinbase } = require('./configs/coinbase.js');
const { mailchimp } = require('./configs/mailchimp.js');

// Note: All 37 platforms are now fully implemented in individual config files

// Require OAuth handlers
const {
  generateConsentUrl,
  exchangeCodeForToken,
  getUserInfo,
  refreshAccessToken
} = require('./oauth/oauth-service.js');

// Require utilities
const {
  getPlatform,
  getAllPlatforms,
  getPlatformNames,
  getPlatformScopes
} = require('./utils/platform-utils.js');

// ============================================================================
// 🌐 UNIFIED PLATFORM REGISTRY
// All platform configurations in one place for easy access
// ============================================================================

// All platform configurations (fully implemented)
const PLATFORMS = {
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

// ============================================================================
// 📊 PLATFORM STATISTICS & INFO
// ============================================================================

const PLATFORM_STATS = {
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

// ============================================================================
// 🔧 EXPORTS - Maintain backward compatibility
// ============================================================================

module.exports = {
  // Main exports
  PLATFORMS,
  PLATFORM_STATS,

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

console.log(`✅ Loaded ${Object.keys(PLATFORMS).length} OAuth platforms successfully`);
