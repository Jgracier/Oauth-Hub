/**
 * 🎯 PLATFORM UTILITIES
 * Helper functions for working with platform configurations
 */

// Note: PLATFORMS will be injected when these functions are called
// This avoids circular dependency issues

/**
 * Get platform configuration by name
 */
function getPlatform(platformName, platforms) {
  if (!platforms) {
    // Lazy require to avoid circular dependency
    const { PLATFORMS } = require('../index.js');
    platforms = PLATFORMS;
  }

  const platform = platforms[platformName.toLowerCase()];
  if (!platform) {
    throw new Error(`Unsupported platform: ${platformName}`);
  }
  return platform;
}

/**
 * Get all available platform names
 */
function getAllPlatforms(platforms) {
  if (!platforms) {
    // Lazy require to avoid circular dependency
    const { PLATFORMS } = require('../index.js');
    platforms = PLATFORMS;
  }

  return Object.keys(platforms);
}

/**
 * Get platform names with display information
 */
function getPlatformNames(platforms) {
  if (!platforms) {
    // Lazy require to avoid circular dependency
    const { PLATFORMS } = require('../index.js');
    platforms = PLATFORMS;
  }

  return Object.keys(platforms).map(key => ({
    key,
    name: platforms[key].name,
    displayName: platforms[key].displayName,
    icon: platforms[key].icon,
    color: platforms[key].color
  }));
}

/**
 * Get platform scopes organized by category
 */
function getPlatformScopes(platformName, platforms) {
  const platform = getPlatform(platformName, platforms);
  return platform.scopes || {};
}

/**
 * Get flattened list of all scopes for a platform
 */
function getFlatPlatformScopes(platformName, platforms) {
  const scopes = getPlatformScopes(platformName, platforms);
  const flatScopes = [];

  for (const [category, categoryScopes] of Object.entries(scopes)) {
    for (const [scopeId, scopeInfo] of Object.entries(categoryScopes)) {
      flatScopes.push({
        id: scopeId,
        category,
        name: scopeInfo.name,
        description: scopeInfo.description,
        required: scopeInfo.required || false
      });
    }
  }

  return flatScopes;
}

/**
 * Get required scopes for a platform
 */
function getRequiredScopes(platformName, platforms) {
  const platform = getPlatform(platformName, platforms);
  return platform.requiredScopes || [];
}

/**
 * Validate that all required scopes are included in user selection
 */
function validateRequiredScopes(platformName, userScopes, platforms) {
  const requiredScopes = getRequiredScopes(platformName, platforms);
  const missing = requiredScopes.filter(scope => !userScopes.includes(scope));

  if (missing.length > 0) {
    throw new Error(`Missing required scopes for ${platformName}: ${missing.join(', ')}`);
  }

  return true;
}

/**
 * Get platform by category
 */
function getPlatformsByCategory() {
  const { PLATFORMS } = require('../index.js');
  const categories = {};

  for (const [key, platform] of Object.entries(PLATFORMS)) {
    // Determine category based on platform characteristics
    let category = 'Other';

    if (['google', 'facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'pinterest', 'reddit'].includes(key)) {
      category = 'Social Media';
    } else if (['microsoft', 'salesforce', 'hubspot', 'zoom', 'slack', 'trello', 'asana', 'notion'].includes(key)) {
      category = 'Business & Productivity';
    } else if (['adobe', 'figma', 'canva', 'dribbble', 'unsplash'].includes(key)) {
      category = 'Creative & Design';
    } else if (['amazon', 'shopify', 'stripe', 'paypal', 'coinbase'].includes(key)) {
      category = 'E-commerce & Payments';
    } else if (['github'].includes(key)) {
      category = 'Developer Tools';
    } else if (['spotify', 'twitch', 'discord', 'netflix', 'steam'].includes(key)) {
      category = 'Entertainment & Gaming';
    } else if (['dropbox', 'box'].includes(key)) {
      category = 'Cloud Storage';
    } else if (['wordpress'].includes(key)) {
      category = 'Content Management';
    } else if (['mailchimp'].includes(key)) {
      category = 'Marketing';
    } else if (['apple'].includes(key)) {
      category = 'Apple Ecosystem';
    }

    if (!categories[category]) {
      categories[category] = [];
    }

    categories[category].push({
      key,
      ...platform
    });
  }

  return categories;
}

/**
 * Search platforms by name or description
 */
function searchPlatforms(query) {
  const { PLATFORMS } = require('../index.js');
  const lowerQuery = query.toLowerCase();
  const results = [];

  for (const [key, platform] of Object.entries(PLATFORMS)) {
    const searchableText = [
      platform.name,
      platform.displayName,
      platform.description
    ].join(' ').toLowerCase();

    if (searchableText.includes(lowerQuery)) {
      results.push({
        key,
        ...platform,
        relevance: calculateRelevance(lowerQuery, searchableText)
      });
    }
  }

  return results.sort((a, b) => b.relevance - a.relevance);
}

/**
 * Calculate search relevance score
 */
function calculateRelevance(query, text) {
  let score = 0;

  // Exact match in name gets highest score
  if (text.includes(query)) {
    score += 100;
  }

  // Word matches
  const queryWords = query.split(' ');
  const textWords = text.split(' ');

  for (const queryWord of queryWords) {
    for (const textWord of textWords) {
      if (textWord.includes(queryWord)) {
        score += 10;
      }
    }
  }

  return score;
}

/**
 * Get platform statistics
 */
function getPlatformStats() {
  const { PLATFORMS } = require('../index.js');
  const platforms = Object.entries(PLATFORMS);
  const categories = getPlatformsByCategory();

  return {
    totalPlatforms: platforms.length,
    categoryCounts: Object.entries(categories).reduce((acc, [category, platformList]) => {
      acc[category] = platformList.length;
      return acc;
    }, {}),
    authTypes: {
      'OAuth 2.0': platforms.filter(([, p]) => !p.requiresPKCE).length,
      'OAuth 2.0 + PKCE': platforms.filter(([, p]) => p.requiresPKCE).length,
      'OAuth 1.0a': platforms.filter(([, p]) => p.name === 'Trello' || p.name === 'Netflix').length
    },
    scopeStats: platforms.reduce((acc, [, platform]) => {
      const scopeCount = Object.values(platform.scopes || {}).reduce((count, category) => {
        return count + Object.keys(category).length;
      }, 0);
      acc.totalScopes += scopeCount;
      acc.averageScopes = Math.round(acc.totalScopes / platforms.length);
      return acc;
    }, { totalScopes: 0, averageScopes: 0 })
  };
}

/**
 * Check if platform supports refresh tokens
 */
function supportsRefreshTokens(platformName) {
  const noRefreshPlatforms = ['github', 'shopify', 'trello', 'notion', 'dribbble', 'unsplash', 'netflix', 'steam'];
  return !noRefreshPlatforms.includes(platformName.toLowerCase());
}

/**
 * Get platform documentation URL
 */
function getPlatformDocsUrl(platformName) {
  const { PLATFORMS } = require('../index.js');
  const platform = PLATFORMS[platformName.toLowerCase()];
  if (!platform) {
    throw new Error(`Unsupported platform: ${platformName}`);
  }
  return platform.docsUrl;
}

/**
 * Check if platform requires PKCE
 */
function requiresPKCE(platformName) {
  const { PLATFORMS } = require('../index.js');
  const platform = PLATFORMS[platformName.toLowerCase()];
  if (!platform) {
    throw new Error(`Unsupported platform: ${platformName}`);
  }
  return platform.requiresPKCE || false;
}

// Export all functions
module.exports = {
  getPlatform,
  getAllPlatforms,
  getPlatformNames,
  getPlatformScopes,
  getFlatPlatformScopes,
  getRequiredScopes,
  validateRequiredScopes,
  getPlatformsByCategory,
  searchPlatforms,
  calculateRelevance,
  getPlatformStats,
  supportsRefreshTokens,
  getPlatformDocsUrl,
  requiresPKCE
};
