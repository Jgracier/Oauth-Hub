// =============================================================================
// 📖 DOCUMENTATION PAGE - API Documentation
// =============================================================================

import { getNavigation, getSharedScript } from '../shared/navigation.js';

export function getDocsPage(UNIFIED_CSS) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation - OAuth Hub</title>
    <style>
        ${UNIFIED_CSS}
        .code-block {
            background: var(--gray-50);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            padding: var(--space-4);
            margin: var(--space-3) 0;
            font-family: var(--font-mono);
            font-size: 0.875rem;
            overflow-x: auto;
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
        }
        .platform-url {
            display: inline-block;
            padding: var(--space-2) var(--space-3);
            background: var(--primary-500);
            color: white;
            text-decoration: none;
            border-radius: var(--radius-md);
            margin-top: var(--space-2);
            font-weight: 600;
            transition: background-color 0.2s;
        }
        .platform-url:hover {
            background: var(--primary-600);
            color: white;
        }
        .warning-box {
            background: var(--warning-50);
            border: 1px solid var(--warning-200);
            border-radius: var(--radius-md);
            padding: var(--space-4);
            margin: var(--space-4) 0;
        }
        .success-box {
            background: var(--success-50);
            border: 1px solid var(--success-200);
            border-radius: var(--radius-md);
            padding: var(--space-4);
            margin: var(--space-4) 0;
        }
        .feature-highlight {
            background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
            border: 2px solid var(--primary-300);
            border-radius: var(--radius-lg);
            padding: var(--space-6);
            margin: var(--space-6) 0;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="app-layout">
        ${getNavigation('docs')}
        
        <main class="main">
            <div class="container" style="max-width: 1000px;">
                <div class="page-header">
                    <h1 class="page-title">OAuth Hub Documentation</h1>
                    <p class="page-description">The simplest way to manage OAuth connections across all platforms</p>
                </div>

                <!-- NEW: Direct Platform User ID Feature -->
                <div class="feature-highlight">
                    <h2 style="color: var(--primary-700); margin: 0 0 var(--space-3) 0;">🎯 NEW: Direct Platform User ID Return</h2>
                    <p style="font-size: 1.125rem; margin: 0;">
                        Get platform user IDs instantly via popup window messaging.<br/>
                        <strong>No webhooks needed. No polling. Just direct results!</strong>
                    </p>
                </div>

                <!-- Quick Start Guide -->
                <div class="card">
                    <h2>🚀 Quick Start (2 Minutes)</h2>
                    
                    <div class="success-box">
                        <h4>✨ What You'll Get</h4>
                        <ul>
                            <li>Platform User ID returned directly to your app</li>
                            <li>Automatic token storage and refresh</li>
                            <li>One simple flow for all platforms</li>
                        </ul>
                    </div>

                    <h3>Step 1: Include OAuth Popup Helper</h3>
                    <div class="code-block">
&lt;!-- Add to your HTML --&gt;
&lt;script src="https://oauth-handler.socialoauth.workers.dev/oauth-popup.js"&gt;&lt;/script&gt;
                    </div>

                    <h3>Step 2: Connect Social Account</h3>
                    <div class="code-block">
// That's it! One line of code:
const result = await OAuthHub.connect('facebook', 'sk_your_api_key');

// You immediately get:
console.log(result.platformUserId);  // "1234567890"
console.log(result.tokens);          // { accessToken, expiresAt, ... }
console.log(result.userInfo);        // { name, email, ... } (if available)
                    </div>

                    <h3>Step 3: Use the Tokens</h3>
                    <div class="code-block">
// Now you can make API calls to the platform:
fetch('https://graph.facebook.com/me', {
  headers: { 'Authorization': \`Bearer \${result.tokens.accessToken}\` }
});

// Or fetch fresh tokens anytime using the platform user ID:
const tokens = await fetch(\`/tokens/\${result.platformUserId}/\${apiKey}\`);
                    </div>

                    <div class="warning-box">
                        <h4>🔄 Migrating from Webhooks?</h4>
                        <p>If you're currently using webhooks, migration is simple:</p>
                        <ol>
                            <li>Replace webhook endpoint with the popup helper</li>
                            <li>Remove webhook configuration code</li>
                            <li>Update your OAuth button to use <code>OAuthHub.connect()</code></li>
                        </ol>
                    </div>
                </div>

                <!-- Complete Integration Example -->
                <div class="card">
                    <h2>💻 Complete Integration Example</h2>
                    
                    <h3>Frontend Integration</h3>
                    <div class="code-block">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;script src="https://oauth-handler.socialoauth.workers.dev/oauth-popup.js"&gt;&lt;/script&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;!-- Social Connect Buttons --&gt;
  &lt;button onclick="connectSocial('facebook')"&gt;Connect Facebook&lt;/button&gt;
  &lt;button onclick="connectSocial('google')"&gt;Connect Google&lt;/button&gt;
  &lt;button onclick="connectSocial('instagram')"&gt;Connect Instagram&lt;/button&gt;
  
  &lt;script&gt;
    // Initialize with your API key
    const oauth = OAuthHub.init('sk_your_api_key');
    
    async function connectSocial(platform) {
      try {
        // Show loading state
        console.log('Connecting to ' + platform + '...');
        
        // Open OAuth popup and wait for completion
        const result = await oauth.connect(platform);
        
        // Success! You have the platform user ID immediately
        console.log('Connected! Platform User ID:', result.platformUserId);
        
        // Save to your backend
        await fetch('/api/users/social-connection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform: result.platform,
            platformUserId: result.platformUserId,
            // Optional: Include tokens if you want to store them
            tokens: result.tokens
          })
        });
        
        // Update UI
        alert(platform + ' connected successfully!');
        
      } catch (error) {
        console.error('OAuth failed:', error);
        alert('Connection failed: ' + error.message);
      }
    }
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
                    </div>

                    <h3>Backend Integration (Node.js)</h3>
                    <div class="code-block">
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const OAUTH_HUB_API_KEY = 'sk_your_api_key';
const OAUTH_HUB_URL = 'https://oauth-handler.socialoauth.workers.dev';

// Store user's social connections
app.post('/api/users/social-connection', async (req, res) => {
  const { platform, platformUserId } = req.body;
  const userId = req.user.id; // Your authenticated user
  
  // Save connection to your database
  await db.socialConnections.create({
    userId,
    platform,
    platformUserId,
    connectedAt: new Date()
  });
  
  res.json({ success: true });
});

// Get fresh access token when needed
async function getAccessToken(platformUserId) {
  const response = await fetch(
    \`\${OAUTH_HUB_URL}/tokens/\${platformUserId}/\${OAUTH_HUB_API_KEY}\`
  );
  
  if (!response.ok) {
    throw new Error('Failed to get access token');
  }
  
  const data = await response.json();
  return data.accessToken;
}

// Use tokens to make API calls
app.get('/api/facebook/profile', async (req, res) => {
  // Get user's Facebook connection
  const connection = await db.socialConnections.findOne({
    userId: req.user.id,
    platform: 'facebook'
  });
  
  if (!connection) {
    return res.status(404).json({ error: 'Facebook not connected' });
  }
  
  // Get fresh access token
  const accessToken = await getAccessToken(connection.platformUserId);
  
  // Call Facebook API
  const fbResponse = await fetch('https://graph.facebook.com/me', {
    headers: { 'Authorization': \`Bearer \${accessToken}\` }
  });
  
  const profile = await fbResponse.json();
  res.json(profile);
});
                    </div>

                    <h3>React/Vue/Angular Example</h3>
                    <div class="code-block">
// React Component Example
import { useState, useEffect } from 'react';

function SocialConnections() {
  const [connections, setConnections] = useState({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Load OAuth popup helper
    const script = document.createElement('script');
    script.src = 'https://oauth-handler.socialoauth.workers.dev/oauth-popup.js';
    document.head.appendChild(script);
  }, []);
  
  const connectPlatform = async (platform) => {
    setLoading(true);
    
    try {
      // Initialize OAuth Hub (can also be done once globally)
      const oauth = window.OAuthHub.init('sk_your_api_key');
      
      // Connect to platform
      const result = await oauth.connect(platform);
      
      // Update state
      setConnections(prev => ({
        ...prev,
        [platform]: {
          connected: true,
          platformUserId: result.platformUserId,
          connectedAt: new Date()
        }
      }));
      
      // Save to backend
      await saveConnection(platform, result.platformUserId);
      
    } catch (error) {
      console.error('OAuth error:', error);
      alert(\`Failed to connect \${platform}\`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    &lt;div&gt;
      &lt;h2&gt;Connect Your Social Accounts&lt;/h2&gt;
      
      {['facebook', 'google', 'instagram', 'twitter'].map(platform =&gt; (
        &lt;div key={platform}&gt;
          &lt;button
            onClick={() =&gt; connectPlatform(platform)}
            disabled={loading || connections[platform]?.connected}
          &gt;
            {connections[platform]?.connected 
              ? \`✓ \${platform} Connected\`
              : \`Connect \${platform}\`
            }
          &lt;/button&gt;
        &lt;/div&gt;
      ))}
    &lt;/div&gt;
  );
}
                    </div>
                </div>

                <!-- API Reference -->
                <div class="card">
                    <h2>📡 API Reference</h2>
                    
                    <div class="success-box">
                        <h4>🏁 Base URL</h4>
                        <div class="code-block" style="text-align: center; font-size: 1rem;">
                            https://oauth-handler.socialoauth.workers.dev
                        </div>
                    </div>

                    <h3>OAuth Popup Helper Methods</h3>
                    
                    <div class="endpoint">
                        <h4>OAuthHub.connect(platform, apiKey, options)</h4>
                        <p>Opens OAuth popup and returns platform user ID and tokens</p>
                        <div class="code-block">
<strong>Parameters:</strong>
- platform: string - Platform name ('facebook', 'google', etc.)
- apiKey: string - Your OAuth Hub API key
- options: object (optional)
  - width: number - Popup width (default: 500)
  - height: number - Popup height (default: 600)
  - timeout: number - Timeout in ms (default: 300000)

<strong>Returns Promise:</strong>
{
  platform: 'facebook',
  platformUserId: '1234567890',
  tokens: {
    accessToken: 'token...',
    tokenType: 'bearer',
    expiresAt: 1234567890,
    scope: 'email public_profile'
  },
  userInfo: { // Optional, if available
    name: 'John Doe',
    email: 'john@example.com'
  }
}
                        </div>
                    </div>

                    <div class="endpoint">
                        <h4>OAuthHub.init(apiKey, defaultOptions)</h4>
                        <p>Initialize OAuth Hub with default API key and options</p>
                        <div class="code-block">
const oauth = OAuthHub.init('sk_your_api_key', {
  width: 600,
  height: 700
});

// Now use without specifying API key each time
const result = await oauth.connect('facebook');
                        </div>
                    </div>

                    <h3>Backend API Endpoints</h3>
                    
                    <div class="endpoint">
                        <div style="display: flex; align-items: center; margin-bottom: var(--space-2);">
                            <span class="method get">GET</span>
                            <code>/consent/{platform}/{apiKey}</code>
                        </div>
                        <p>Get OAuth consent URL (used internally by popup helper)</p>
                    </div>
                    
                    <div class="endpoint">
                        <div style="display: flex; align-items: center; margin-bottom: var(--space-2);">
                            <span class="method get">GET</span>
                            <code>/tokens/{platformUserId}/{apiKey}</code>
                        </div>
                        <p>Get current access token (auto-refreshes if expired)</p>
                        <div class="code-block">
<strong>Example:</strong>
GET /tokens/1234567890/sk_abc123

<strong>Returns:</strong>
{
  "accessToken": "EAAVfX...",
  "tokenType": "bearer",
  "expiresAt": 1756142188028,
  "platform": "facebook",
  "platformUserId": "1234567890"
}
                        </div>
                    </div>

                    <div class="endpoint">
                        <div style="display: flex; align-items: center; margin-bottom: var(--space-2);">
                            <span class="method post">POST</span>
                            <code>/refresh/{platformUserId}/{apiKey}</code>
                        </div>
                        <p>Manually refresh access token</p>
                    </div>

                    <div class="endpoint">
                        <div style="display: flex; align-items: center; margin-bottom: var(--space-2);">
                            <span class="method delete">DELETE</span>
                            <code>/revoke-token/{platformUserId}/{apiKey}</code>
                        </div>
                        <p>Revoke stored tokens for a user</p>
                    </div>
                </div>

                <!-- Supported Platforms -->
                <div class="card">
                    <h2>🌐 Supported Platforms</h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-4); margin: var(--space-4) 0;">
                        <div class="platform-card" style="text-align: center;">
                            <div style="font-size: 3rem;">📘</div>
                            <h4>Facebook</h4>
                            <code>facebook</code>
                        </div>
                        <div class="platform-card" style="text-align: center;">
                            <div style="font-size: 3rem;">🔍</div>
                            <h4>Google</h4>
                            <code>google</code>
                        </div>
                        <div class="platform-card" style="text-align: center;">
                            <div style="font-size: 3rem;">📸</div>
                            <h4>Instagram</h4>
                            <code>instagram</code>
                        </div>
                        <div class="platform-card" style="text-align: center;">
                            <div style="font-size: 3rem;">🐦</div>
                            <h4>Twitter/X</h4>
                            <code>x</code> or <code>twitter</code>
                        </div>
                        <div class="platform-card" style="text-align: center;">
                            <div style="font-size: 3rem;">💼</div>
                            <h4>LinkedIn</h4>
                            <code>linkedin</code>
                        </div>
                        <div class="platform-card" style="text-align: center;">
                            <div style="font-size: 3rem;">🎵</div>
                            <h4>TikTok</h4>
                            <code>tiktok</code>
                        </div>
                        <div class="platform-card" style="text-align: center;">
                            <div style="font-size: 3rem;">🎮</div>
                            <h4>Discord</h4>
                            <code>discord</code>
                        </div>
                        <div class="platform-card" style="text-align: center;">
                            <div style="font-size: 3rem;">📌</div>
                            <h4>Pinterest</h4>
                            <code>pinterest</code>
                        </div>
                    </div>

                    <div class="success-box">
                        <h4>✅ One Redirect URI for ALL Platforms</h4>
                        <p>Set this single redirect URI in each platform's OAuth app settings:</p>
                        <div class="code-block" style="text-align: center; font-size: 1rem; font-weight: bold;">
                            https://oauth-handler.socialoauth.workers.dev/callback
                        </div>
                    </div>
                </div>

                <!-- Best Practices -->
                <div class="card">
                    <h2>🔐 Security Best Practices</h2>
                    
                    <h3>API Key Security</h3>
                    <ul>
                        <li>✅ Keep API keys on your backend server only</li>
                        <li>✅ Never expose API keys in client-side JavaScript</li>
                        <li>✅ Use environment variables for API key storage</li>
                        <li>✅ Rotate keys regularly</li>
                    </ul>

                    <h3>Platform User ID Storage</h3>
                    <ul>
                        <li>✅ Store platform user IDs securely in your database</li>
                        <li>✅ Associate them with your internal user IDs</li>
                        <li>✅ Never expose platform user IDs publicly</li>
                        <li>✅ Use them only for token retrieval</li>
                    </ul>

                    <h3>OAuth Security</h3>
                    <ul>
                        <li>✅ Always use HTTPS for API calls</li>
                        <li>✅ Validate popup window origins</li>
                        <li>✅ Handle popup blockers gracefully</li>
                        <li>✅ Implement proper error handling</li>
                    </ul>
                </div>

                <!-- Common Issues -->
                <div class="card">
                    <h2>🚨 Troubleshooting</h2>
                    
                    <h3>Popup Blocked</h3>
                    <div class="code-block">
// Check if popup was blocked
const popup = window.open(consentUrl, 'oauth', 'width=500,height=600');

if (!popup || popup.closed || typeof popup.closed == 'undefined') {
  alert('Please allow popups for this site to connect social accounts');
}
                    </div>

                    <h3>Cross-Origin Issues</h3>
                    <p>The OAuth popup helper handles cross-origin communication automatically. If you're implementing your own solution, ensure you:</p>
                    <ul>
                        <li>Listen for <code>postMessage</code> events</li>
                        <li>Validate the origin is <code>https://oauth-handler.socialoauth.workers.dev</code></li>
                        <li>Handle both <code>oauth_complete</code> and <code>oauth_error</code> message types</li>
                    </ul>

                    <h3>Token Expiration</h3>
                    <p>Tokens are automatically refreshed when you call the <code>/tokens</code> endpoint. If you need to handle expiration manually:</p>
                    <div class="code-block">
if (tokens.expiresAt < Date.now()) {
  // Token expired, fetch fresh one
  const freshTokens = await getTokens(platformUserId, apiKey);
}
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    ${getSharedScript()}
    <script>
        // Smooth scrolling for any internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    </script>
</body>
</html>`;
}