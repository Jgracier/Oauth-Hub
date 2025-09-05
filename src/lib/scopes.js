// =============================================================================
// 🔐 OAUTH SCOPES DATABASE - Comprehensive Platform Scopes
// =============================================================================

import { PLATFORMS, getPlatformScopes as getPlatformScopesFromConfig } from '../core/platforms.js';

// Get required scopes from centralized platform configuration
export function getRequiredScopes(platform) {
  try {
    return getPlatformScopesFromConfig(platform).required;
  } catch (error) {
    console.warn('Platform not found:', platform);
    return [];
  }
}

// For backward compatibility
export const REQUIRED_SCOPES = new Proxy({}, {
  get(target, platform) {
    return getRequiredScopes(platform);
  }
});

// Legacy PLATFORM_SCOPES - now using centralized platform configuration
// This is kept for backward compatibility but data comes from platforms.js
export const PLATFORM_SCOPES = new Proxy({}, {
  get(target, platform) {
    try {
      const platformConfig = PLATFORMS[platform];
      return {
        name: platformConfig.displayName,
        emoji: platformConfig.icon,
    categories: {
          'Available Scopes': platformConfig.availableScopes || []
        }
      };
    } catch (error) {
      return null;
    }
  }
});


// Helper function to get all scopes for a platform
export function getPlatformScopes(platform) {
  try {
    return getPlatformScopesFromConfig(platform).available;
  } catch (error) {
    console.warn('Platform not found:', platform);
    return [];
  }
}

// Helper function to search scopes
export function searchScopes(platform, query) {
  const scopes = getPlatformScopes(platform);
  if (!query) return scopes;
  
  const searchTerm = query.toLowerCase();
  return scopes.filter(scope => 
    scope.scope.toLowerCase().includes(searchTerm) ||
    scope.description.toLowerCase().includes(searchTerm) ||
    scope.category.toLowerCase().includes(searchTerm)
  );
}

// Helper function to get final scopes including required ones
export function getFinalScopes(platform, selectedScopes = []) {
  const requiredScopes = REQUIRED_SCOPES[platform] || [];
  const allScopes = [...requiredScopes, ...selectedScopes];
  
  // Remove duplicates
  return [...new Set(allScopes)];
}