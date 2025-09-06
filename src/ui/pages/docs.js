// =============================================================================
// 📖 DOCUMENTATION PAGE - Clean & Organized OAuth Hub Documentation
// =============================================================================

import { CONFIG } from '../../core/config.js';
import { PLATFORMS, getAllPlatforms } from '../../core/platforms.js';
import { getNavigation, getSharedScript } from '../navigation.js';

export function getDocsPage(UNIFIED_CSS) {
  // Helper function to create clean code blocks with copy buttons
  const createCodeBlock = (code, language = 'javascript', title = '') => {
    const cleanCode = code.trim();
    const escapedCode = cleanCode.replace(/"/g, '&quot;').replace(/\n/g, '\\n');
    
    return `
    <div class="code-block-container">
      <div class="code-block">
        <span class="language-label">${language}</span>
        <button class="copy-button" onclick="copyToClipboard(this)" data-code="${escapedCode}">
          📋 Copy
        </button>
        <pre><code>${cleanCode}</code></pre>
      </div>
      ${title ? `<p class="code-title">${title}</p>` : ''}
    </div>
    `;
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation - OAuth Hub</title>
    <style>
        ${UNIFIED_CSS}
        
        /* Documentation specific styles */
        .container { max-width: 1000px; overflow-x: hidden; }
        .code-block-container { margin: var(--space-4) 0; }
        .code-block {
            position: relative;
            background: var(--gray-900);
            color: var(--gray-100);
            border-radius: var(--radius-md);
            overflow: hidden;
            border: 1px solid var(--border-color);
        }
        .code-block pre {
            padding: var(--space-4);
            margin: 0;
            overflow-x: auto;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.875rem;
            line-height: 1.5;
        }
        .copy-button {
            position: absolute;
            top: var(--space-2);
            right: var(--space-2);
            background: var(--gray-700);
            color: white;
            border: none;
            padding: var(--space-1) var(--space-2);
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            cursor: pointer;
            opacity: 0.7;
            transition: all 0.2s;
        }
        .copy-button:hover { opacity: 1; }
        .copy-button.copied { background: var(--success-600); }
        .language-label {
            position: absolute;
            top: var(--space-2);
            left: var(--space-2);
            background: var(--gray-700);
            color: white;
            padding: var(--space-1) var(--space-2);
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
        }
        .endpoint {
            background: var(--primary-50);
            border-left: 4px solid var(--primary-500);
            padding: var(--space-4);
            margin: var(--space-4) 0;
            border-radius: 0 var(--radius-md) var(--radius-md) 0;
        }
        .method {
            display: inline-block;
            padding: var(--space-1) var(--space-2);
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            font-weight: 600;
            margin-right: var(--space-2);
        }
        .method.get { background: var(--success-500); color: white; }
        .method.post { background: var(--warning-500); color: white; }
        .method.delete { background: var(--danger-500); color: white; }
        .platform-card {
            padding: var(--space-4);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            margin-bottom: var(--space-3);
            text-align: center;
            transition: all 0.2s;
        }
        .platform-card:hover {
            border-color: var(--primary-300);
            transform: translateY(-2px);
        }
        .success-box {
            background: var(--success-50);
            border: 1px solid var(--success-200);
            border-radius: var(--radius-md);
            padding: var(--space-4);
            margin: var(--space-4) 0;
        }
        .warning-box {
            background: var(--warning-50);
            border: 1px solid var(--warning-200);
            border-radius: var(--radius-md);
            padding: var(--space-4);
            margin: var(--space-4) 0;
        }
        .info-box {
            background: var(--primary-50);
            border: 1px solid var(--primary-200);
            border-radius: var(--radius-md);
            padding: var(--space-4);
            margin: var(--space-4) 0;
        }
        .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-4); }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-3); }
        .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-3); }
    </style>
</head>
<body>
    <div class="app-layout">
        ${getNavigation('docs')}
        
        <main class="main">
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">OAuth Hub Documentation</h1>
                    <p class="page-description">Unified OAuth token management for 15+ social platforms</p>
                </div>

                <!-- 1. OVERVIEW -->
                <div class="card">
                    <h2>🎯 Overview</h2>
                    <p>OAuth Hub provides a unified API for managing OAuth tokens across all major social platforms. One simple integration works for Google, Facebook, Twitter, LinkedIn, Instagram, TikTok, and more.</p>
                    
                    <div class="success-box">
                        <h4>✨ Single Redirect URI for All Platforms</h4>
                        <p>Register this URL in ALL your OAuth applications:</p>
                        <div class="code-block" style="text-align: center; font-size: 1.2rem; font-weight: bold;">
                            <pre><code>https://oauth-hub.com</code></pre>
                        </div>
                    </div>

                    <div class="grid-3">
                        <div>
                            <h4>🔄 Unified Flow</h4>
                            <p>Same API endpoints work for all platforms. No platform-specific code needed.</p>
                        </div>
                        <div>
                            <h4>🔐 Secure Storage</h4>
                            <p>Tokens stored securely in Cloudflare KV with automatic refresh handling.</p>
                        </div>
                        <div>
                            <h4>⚡ Fast Integration</h4>
                            <p>Add OAuth to your app in minutes, not hours. Copy-paste ready code.</p>
                        </div>
                    </div>
                </div>

                <!-- 2. QUICK START -->
                <div class="card">
                    <h2>🚀 Quick Start</h2>
                    
                    <div class="grid-3">
                        <div>
                            <h3>1️⃣ Get API Key</h3>
                            <ul>
                                <li><a href="/auth">Sign up</a> for OAuth Hub</li>
                                <li>Go to <a href="/api-keys">API Keys</a></li>
                                <li>Generate your API key</li>
                            </ul>
                        </div>
                        <div>
                            <h3>2️⃣ Setup OAuth Apps</h3>
                            <ul>
                                <li>Create apps on platform developer portals</li>
                                <li>Set redirect URI: <code>https://oauth-hub.com</code></li>
                                <li>Add credentials to <a href="/apps">OAuth Hub</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3>3️⃣ Start Using</h3>
                            <ul>
                                <li>Generate consent URLs</li>
                                <li>Users grant permissions</li>
                                <li>Retrieve access tokens</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 3. CORE API ENDPOINTS -->
                <div class="card">
                    <h2>🔗 Core API Endpoints</h2>
                    
                    <div class="endpoint">
                        <h4><span class="method get">GET</span>/consent/{platform}/{apiKey}</h4>
                        <p><strong>Generate OAuth consent URL</strong> - Returns authorization URL for user to grant permissions</p>
                        ${createCodeBlock(`// Example: Generate Google consent URL
GET /consent/google/sk_your_api_key

Response:
{
  "consentUrl": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...",
  "platform": "google",
  "state": "google_sk_your_api_key_1234567890",
  "scopes": ["openid", "email", "profile"],
  "redirectUri": "https://oauth-hub.com"
}`, 'json')}
                    </div>

                    <div class="endpoint">
                        <h4><span class="method get">GET</span>/token/{platformUserId}/{apiKey}</h4>
                        <p><strong>Retrieve access tokens</strong> - Get valid access token (auto-refreshes if expired)</p>
                        ${createCodeBlock(`// Example: Get user's Google access token
GET /token/113672837219382787216/sk_your_api_key

Response:
{
  "success": true,
  "platform": "google",
  "platformUserId": "113672837219382787216",
  "accessToken": "ya29.a0AfH6SMC...",
  "tokenType": "bearer",
  "expiresIn": 3600,
  "refreshed": false
}`, 'json')}
                    </div>

                    <div class="info-box">
                        <h4>🔄 Automatic OAuth Callback Processing</h4>
                        <p>When users complete OAuth consent, they're redirected to <code>https://oauth-hub.com</code> with authorization code. OAuth Hub automatically:</p>
                        <ul>
                            <li>✅ Exchanges authorization code for access tokens</li>
                            <li>✅ Fetches user info and platform user ID</li>
                            <li>✅ Stores all data securely in Cloudflare KV</li>
                            <li>✅ Returns platform name and user ID to your app</li>
                        </ul>
                    </div>
                </div>

                <!-- 4. IMPLEMENTATION -->
                <div class="card">
                    <h2>💻 Implementation</h2>
                    
                    <h3>📋 Copy-Paste Integration</h3>
                    ${createCodeBlock(`// Add this helper function to your app
async function connectSocial(platform, apiKey) {
  try {
    // 1. Get consent URL
    const consentResponse = await fetch(\`https://oauth-hub.com/consent/\${platform}/\${apiKey}\`);
    const { consentUrl, state } = await consentResponse.json();
    
    // 2. Open consent popup
    const popup = window.open(consentUrl, 'oauth-consent', 'width=500,height=600');
    
    // 3. Wait for OAuth completion
    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          // Check if OAuth was successful by looking for stored tokens
          // Implementation depends on your app's needs
          resolve({ success: true });
        }
      }, 1000);
      
      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkClosed);
        popup.close();
        reject(new Error('OAuth timeout'));
      }, 300000);
    });
  } catch (error) {
    console.error('OAuth error:', error);
    throw error;
  }
}

// Usage examples
await connectSocial('google', 'sk_your_api_key');
await connectSocial('facebook', 'sk_your_api_key');
await connectSocial('twitter', 'sk_your_api_key');`, 'javascript')}

                    <h3>🔧 Framework Examples</h3>
                    
                    <div class="grid-2">
                        <div>
                            <h4>React/Next.js</h4>
                            ${createCodeBlock(`import { useState } from 'react';

function SocialConnect({ platform, apiKey }) {
  const [connecting, setConnecting] = useState(false);
  
  const handleConnect = async () => {
    setConnecting(true);
    try {
      await connectSocial(platform, apiKey);
      alert(\`Connected to \${platform}!\`);
    } catch (error) {
      alert('Connection failed');
    } finally {
      setConnecting(false);
    }
  };
  
  return (
    <button onClick={handleConnect} disabled={connecting}>
      {connecting ? 'Connecting...' : \`Connect \${platform}\`}
    </button>
  );
}`, 'jsx')}
                        </div>
                        <div>
                            <h4>Vue.js</h4>
                            ${createCodeBlock(`<template>
  <button @click="handleConnect" :disabled="connecting">
    {{ connecting ? 'Connecting...' : \`Connect \${platform}\` }}
  </button>
</template>

<script>
export default {
  props: ['platform', 'apiKey'],
  data() {
    return { connecting: false };
  },
  methods: {
    async handleConnect() {
      this.connecting = true;
      try {
        await connectSocial(this.platform, this.apiKey);
        this.$emit('connected', this.platform);
      } catch (error) {
        this.$emit('error', error);
      } finally {
        this.connecting = false;
      }
    }
  }
};
</script>`, 'vue')}
                        </div>
                    </div>
                </div>

                <!-- 5. SUPPORTED PLATFORMS -->
                <div class="card">
                    <h2>🌐 Supported Platforms</h2>
                    <p>OAuth Hub supports 15+ major social platforms with unified API endpoints:</p>
                    
                    <div class="grid-4">
                        ${getAllPlatforms().map(platformKey => {
                            const platform = PLATFORMS[platformKey];
                            return `
                            <div class="platform-card">
                                <div style="font-size: 2rem; margin-bottom: var(--space-2);">${platform.icon}</div>
                                <h4>${platform.displayName}</h4>
                                <code>${platformKey}</code>
                                <p style="font-size: 0.875rem; color: var(--gray-600); margin-top: var(--space-2);">${platform.description}</p>
                            </div>
                            `;
                        }).join('')}
                    </div>

                    <div class="info-box">
                        <h4>🔧 Platform Developer Portals</h4>
                        <p>Create OAuth applications on these developer portals:</p>
                        <div class="grid-3" style="margin-top: var(--space-3);">
                            ${getAllPlatforms().slice(0, 6).map(platformKey => {
                                const platform = PLATFORMS[platformKey];
                                return `
                                <a href="${platform.docsUrl}" target="_blank" style="text-decoration: none; color: var(--primary-600); font-weight: 500;">
                                    ${platform.icon} ${platform.displayName} Developer Portal →
                                </a>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>

                <!-- 6. SECURITY & BEST PRACTICES -->
                <div class="card">
                    <h2>🔐 Security & Best Practices</h2>
                    
                    <div class="grid-2">
                        <div>
                            <h4>🛡️ Security Features</h4>
                            <ul>
                                <li>✅ API key authentication for all requests</li>
                                <li>✅ Secure token storage in Cloudflare KV</li>
                                <li>✅ Automatic token refresh handling</li>
                                <li>✅ State parameter validation</li>
                                <li>✅ HTTPS-only communication</li>
                            </ul>
                        </div>
                        <div>
                            <h4>💡 Best Practices</h4>
                            <ul>
                                <li>🔑 Keep API keys secure and rotate regularly</li>
                                <li>🔄 Handle token refresh gracefully</li>
                                <li>⏰ Implement proper timeout handling</li>
                                <li>🚫 Never expose tokens in client-side code</li>
                                <li>📝 Log OAuth events for debugging</li>
                            </ul>
                        </div>
                    </div>

                    <div class="warning-box">
                        <h4>⚠️ Important Notes</h4>
                        <ul>
                            <li><strong>API Keys:</strong> Treat API keys like passwords. Never commit them to version control.</li>
                            <li><strong>Redirect URI:</strong> Must be exactly <code>https://oauth-hub.com</code> in all OAuth apps.</li>
                            <li><strong>HTTPS Only:</strong> OAuth Hub only works over HTTPS for security.</li>
                            <li><strong>Rate Limits:</strong> Respect platform rate limits when making API calls.</li>
                        </ul>
                    </div>
                </div>

                <!-- 7. TROUBLESHOOTING -->
                <div class="card">
                    <h2>🔧 Troubleshooting</h2>
                    
                    <div class="grid-2">
                        <div>
                            <h4>Common Issues</h4>
                            <ul>
                                <li><strong>Invalid API Key:</strong> Check API key format (starts with <code>sk_</code>)</li>
                                <li><strong>No OAuth App:</strong> Add platform credentials in <a href="/apps">App Credentials</a></li>
                                <li><strong>Redirect URI Mismatch:</strong> Ensure <code>https://oauth-hub.com</code> is registered</li>
                                <li><strong>Expired Tokens:</strong> Tokens auto-refresh, check for refresh token</li>
                            </ul>
                        </div>
                        <div>
                            <h4>Error Responses</h4>
                            ${createCodeBlock(`// Common error format
{
  "error": "Invalid API key",
  "message": "API key not found or invalid",
  "apiKey": "sk_abc123..."
}

// OAuth app not found
{
  "error": "No OAuth app configured for this platform",
  "platform": "google",
  "userEmail": "user@example.com"
}`, 'json')}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    ${getSharedScript()}
    
    <script>
        // Copy to clipboard functionality
        function copyToClipboard(button) {
            const code = button.getAttribute('data-code').replace(/\\n/g, '\\n');
            navigator.clipboard.writeText(code).then(() => {
                const originalText = button.textContent;
                button.textContent = '✅ Copied!';
                button.classList.add('copied');
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            });
        }
    </script>
</body>
</html>`;
}