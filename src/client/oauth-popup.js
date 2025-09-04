// =============================================================================
// 🚀 OAUTH POPUP CLIENT HELPER - For easy integration
// =============================================================================

// This file can be served at /oauth-popup.js for developers to include
export const OAuthPopupScript = `
/**
 * OAuth Hub Popup Helper
 * Simple client-side library for OAuth popup flow
 * 
 * Usage:
 *   const result = await OAuthHub.connect('facebook');
 *   console.log('Platform User ID:', result.platformUserId);
 */
window.OAuthHub = (function() {
  const DEFAULT_OPTIONS = {
    width: 500,
    height: 600,
    baseUrl: window.location.origin
  };
  
  /**
   * Connect a social platform via OAuth popup
   * @param {string} platform - Platform name (facebook, google, etc.)
   * @param {string} apiKey - Your OAuth Hub API key
   * @param {Object} options - Optional configuration
   * @returns {Promise} Resolves with { platformUserId, tokens, platform }
   */
  function connect(platform, apiKey, options = {}) {
    return new Promise((resolve, reject) => {
      const config = { ...DEFAULT_OPTIONS, ...options };
      
      // Generate consent URL
      const consentUrl = \`\${config.baseUrl}/consent/\${platform}/\${apiKey}\`;
      
      // Calculate popup position
      const left = (window.screen.width - config.width) / 2;
      const top = (window.screen.height - config.height) / 2;
      
      // Open popup
      const popup = window.open(
        consentUrl,
        'oauth_popup',
        \`width=\${config.width},height=\${config.height},left=\${left},top=\${top}\`
      );
      
      if (!popup) {
        reject(new Error('Failed to open popup. Please allow popups for this site.'));
        return;
      }
      
      // Listen for completion message
      const messageHandler = (event) => {
        // Validate origin if specified
        if (config.validOrigins && !config.validOrigins.includes(event.origin)) {
          return;
        }
        
        if (event.data && event.data.type === 'oauth_complete') {
          window.removeEventListener('message', messageHandler);
          clearInterval(popupChecker);
          
          resolve({
            platform: event.data.platform,
            platformUserId: event.data.platformUserId,
            tokens: event.data.tokens,
            userInfo: event.data.userInfo
          });
        } else if (event.data && event.data.type === 'oauth_error') {
          window.removeEventListener('message', messageHandler);
          clearInterval(popupChecker);
          
          reject(new Error(event.data.error || 'OAuth authorization failed'));
        }
      };
      
      window.addEventListener('message', messageHandler);
      
      // Check if popup was closed without completing
      const popupChecker = setInterval(() => {
        if (popup.closed) {
          clearInterval(popupChecker);
          window.removeEventListener('message', messageHandler);
          reject(new Error('OAuth popup was closed by user'));
        }
      }, 1000);
      
      // Optional: Timeout after 5 minutes
      if (config.timeout !== false) {
        setTimeout(() => {
          clearInterval(popupChecker);
          window.removeEventListener('message', messageHandler);
          popup.close();
          reject(new Error('OAuth authorization timed out'));
        }, config.timeout || 300000); // 5 minutes default
      }
    });
  }
  
  /**
   * Connect with state parameter
   * @param {string} platform - Platform name
   * @param {string} apiKey - Your OAuth Hub API key
   * @param {string} state - Custom state parameter
   * @param {Object} options - Optional configuration
   */
  function connectWithState(platform, apiKey, state, options = {}) {
    const config = { ...DEFAULT_OPTIONS, ...options };
    const stateParam = encodeURIComponent(state);
    const consentUrl = \`\${config.baseUrl}/consent/\${platform}/\${apiKey}?state=\${stateParam}\`;
    
    // Reuse the connect logic with custom URL
    return connect(platform, apiKey, { ...options, customUrl: consentUrl });
  }
  
  /**
   * Initialize OAuth Hub with default API key
   * @param {string} apiKey - Your OAuth Hub API key
   * @param {Object} options - Optional default configuration
   */
  function init(apiKey, options = {}) {
    return {
      connect: (platform, customOptions) => connect(platform, apiKey, { ...options, ...customOptions }),
      connectWithState: (platform, state, customOptions) => connectWithState(platform, apiKey, state, { ...options, ...customOptions }),
      apiKey: apiKey
    };
  }
  
  // Public API
  return {
    connect,
    connectWithState,
    init
  };
})();

// AMD/CommonJS/Global support
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.OAuthHub = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  return window.OAuthHub;
}));
`;

// Export as a function that returns the script content
export function getOAuthPopupScript() {
  return OAuthPopupScript;
}