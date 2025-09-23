/**
 * 👤 USER INFO EXTRACTOR
 * Extracts platform user IDs from user info responses
 * Handles platform-specific data structure differences
 */

/**
 * Extract platform user ID from user info response
 */
export function extractPlatformUserId(platform, userInfo, platformConfig) {
  const userIdField = platformConfig.userIdField;
  
  try {
    // Handle platform-specific data structures
    switch (platform.toLowerCase()) {
      case 'apple':
        return userInfo.sub;
      
      case 'amazon':
        return userInfo.user_id;
      
      case 'shopify':
        return userInfo.shop?.id || userInfo.id;
      
      case 'stripe':
        return userInfo.id;
      
      case 'paypal':
        return userInfo.user_id || userInfo.payer_id;
      
      case 'salesforce':
        return userInfo.user_id || userInfo.id;
      
      case 'hubspot':
        return userInfo.user_id || userInfo.user;
      
      case 'zoom':
        return userInfo.id;
      
      case 'dropbox':
        return userInfo.account_id;
      
      case 'coinbase':
        return userInfo.data?.id || userInfo.id;

      // Additional American platforms
      case 'mailchimp':
        return userInfo.user_id;
      
      case 'trello':
        return userInfo.id;
      
      case 'asana':
        return userInfo.data?.gid || userInfo.gid || userInfo.id;
      
      case 'notion':
        return userInfo.id;
      
      case 'adobe':
        return userInfo.user_id || userInfo.userId || userInfo.id;
      
      case 'figma':
        return userInfo.id;
      
      case 'canva':
        return userInfo.id;
      
      case 'dribbble':
        return userInfo.id;
      
      case 'unsplash':
        return userInfo.id;
      
      case 'box':
        return userInfo.id;
      
      case 'netflix':
        return userInfo.user?.user_id || userInfo.user_id;
      
      case 'steam':
        return userInfo.steamid || userInfo.response?.players?.[0]?.steamid;

      // Social media platforms
      case 'github':
        return userInfo.id;
      
      case 'google':
        return userInfo.id || userInfo.sub;
      
      case 'facebook':
        return userInfo.id;
      
      case 'instagram':
        return userInfo.id;
      
      case 'twitter':
      case 'x':
        return userInfo.data?.id || userInfo.id;
      
      case 'linkedin':
        return userInfo.sub || userInfo.id;
      
      case 'discord':
        return userInfo.id;
      
      case 'spotify':
        return userInfo.id;
      
      case 'twitch':
        return Array.isArray(userInfo.data) ? userInfo.data[0]?.id : userInfo.id;
      
      case 'slack':
        return userInfo.user?.id || userInfo.id;
      
      case 'microsoft':
        return userInfo.id;

      case 'pinterest':
        return userInfo.id;
      
      case 'reddit':
        return userInfo.id;
      
      case 'tiktok':
        return userInfo.open_id || userInfo.union_id || userInfo.id;
      
      case 'wordpress':
        return userInfo.ID || userInfo.id;

      default:
        // Generic fallback
        if (userIdField.includes('.')) {
          const fields = userIdField.split('.');
          let value = userInfo;
          for (const field of fields) {
            value = value?.[field];
            if (value === undefined) break;
          }
          return value;
        }
        return userInfo[userIdField];
    }
  } catch (error) {
    throw new Error(`[${platform}] Failed to extract user ID: ${error.message}`);
  }
}
