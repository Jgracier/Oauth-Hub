/**
 * 🏗️ PLATFORM STUB TEMPLATE
 * This is a template for creating platform configuration stubs
 */

// Quick stub generator for remaining platforms
const STUB_PLATFORMS = {
  twitch: { displayName: 'Twitch', icon: '🎮', color: '#9146ff' },
  slack: { displayName: 'Slack', icon: '💬', color: '#4a154b' },
  pinterest: { displayName: 'Pinterest', icon: '📌', color: '#bd081c' },
  wordpress: { displayName: 'WordPress.com', icon: '📝', color: '#21759b' },
  reddit: { displayName: 'Reddit', icon: '🤖', color: '#ff4500' },
  tiktok: { displayName: 'TikTok', icon: '🎵', color: '#ff0050' },
  amazon: { displayName: 'Amazon', icon: '📦', color: '#ff9900' },
  shopify: { displayName: 'Shopify', icon: '🛍️', color: '#7ab55c' },
  stripe: { displayName: 'Stripe', icon: '💳', color: '#635bff' },
  paypal: { displayName: 'PayPal', icon: '💰', color: '#0070ba' },
  salesforce: { displayName: 'Salesforce', icon: '☁️', color: '#00a1e0' },
  hubspot: { displayName: 'HubSpot', icon: '🧲', color: '#ff7a59' },
  mailchimp: { displayName: 'Mailchimp', icon: '🐵', color: '#ffe01b' },
  zoom: { displayName: 'Zoom', icon: '📹', color: '#2d8cff' },
  trello: { displayName: 'Trello', icon: '📋', color: '#0079bf' },
  asana: { displayName: 'Asana', icon: '✅', color: '#f06a6a' },
  notion: { displayName: 'Notion', icon: '📝', color: '#000000' },
  adobe: { displayName: 'Adobe Creative Cloud', icon: '🎨', color: '#ff0000' },
  figma: { displayName: 'Figma', icon: '🎯', color: '#f24e1e' },
  canva: { displayName: 'Canva', icon: '🖌️', color: '#00c4cc' },
  dribbble: { displayName: 'Dribbble', icon: '🏀', color: '#ea4c89' },
  unsplash: { displayName: 'Unsplash', icon: '📸', color: '#000000' },
  dropbox: { displayName: 'Dropbox', icon: '📦', color: '#0061ff' },
  box: { displayName: 'Box', icon: '📁', color: '#0061d5' },
  netflix: { displayName: 'Netflix', icon: '🎬', color: '#e50914' },
  steam: { displayName: 'Steam', icon: '🎮', color: '#1b2838' },
  coinbase: { displayName: 'Coinbase', icon: '₿', color: '#0052ff' }
};

// Generate stub configurations - these will be replaced with full configs
export function createStubConfig(platformName, info) {
  const capitalizedName = platformName.charAt(0).toUpperCase() + platformName.slice(1);
  
  return {
    name: capitalizedName,
    displayName: info.displayName,
    icon: info.icon,
    color: info.color,
    authUrl: `https://api.${platformName}.com/oauth/authorize`, // Placeholder
    tokenUrl: `https://api.${platformName}.com/oauth/token`, // Placeholder
    userInfoUrl: `https://api.${platformName}.com/v1/me`, // Placeholder
    userIdField: 'id',
    docsUrl: `https://developers.${platformName}.com/`, // Placeholder
    description: `Access ${info.displayName} APIs`,
    requiredScopes: ['read'],
    scopeDelimiter: ' ',
    additionalParams: { response_type: 'code' },
    scopes: {
      'Basic': {
        'read': { name: 'Read Access', description: 'Basic read access', required: true }
      }
    }
  };
}

export { STUB_PLATFORMS };


