// =============================================================================
// 📖 DOCUMENTATION PAGE - API Documentation
// =============================================================================

import { getNavigation, getSharedScript } from '../shared/navigation.js';

export function getDocsPage(UNIFIED_CSS) {
  // Helper function to create code blocks with copy buttons
  const createCodeBlock = (code, language = 'javascript', title = '') => `
    <div class="code-block-container">
      <div class="code-block">
        <span class="language-label">${language}</span>
        <button class="copy-button" onclick="copyToClipboard(this)" data-code="${code.replace(/"/g, '&quot;').replace(/\n/g, '\\n')}">
          📋 Copy
        </button>
        <pre style="margin: 0; padding-top: var(--space-8);"><code>${code}</code></pre>
      </div>
      ${title ? `<p style="margin-top: var(--space-2); color: var(--gray-600); font-size: 0.875rem;">${title}</p>` : ''}
    </div>
  `;

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
            position: relative;
        }
        .code-block-container {
            position: relative;
            margin: var(--space-3) 0;
        }
        .copy-button {
            position: absolute;
            top: var(--space-2);
            right: var(--space-2);
            background: var(--primary-600);
            color: white;
            border: none;
            padding: var(--space-1) var(--space-2);
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        .copy-button:hover {
            opacity: 1;
        }
        .copy-button.copied {
            background: var(--success-600);
        }
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
            letter-spacing: 0.5px;
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
    </style>
</head>
<body>
    <div class="app-layout">
        ${getNavigation('docs')}
        
        <main class="main">
            <div class="container" style="max-width: 1000px;">
                <div class="page-header">
                    <h1 class="page-title">OAuth Hub Documentation</h1>
                    <p class="page-description">Complete guide to OAuth token management for all platforms</p>
                </div>

                <!-- Quick Start Guide -->
                <div class="card">
                    <h2>🚀 Quick Start (5 Minutes)</h2>
                    
                    <div class="success-box">
                        <h4>✅ One Callback URL for All Platforms</h4>
                        <p>Set this single redirect URI for ALL your OAuth apps:</p>
                        <div class="code-block" style="text-align: center; font-size: 1rem; font-weight: bold;">
                            https://oauth-handler.socialoauth.workers.dev/callback
                        </div>
                    </div>
                    
                    <h3>Step 1: Get Your API Key</h3>
                    <ol>
                        <li>Create an account on OAuth Hub</li>
                        <li>Go to <a href="/api-keys">API Keys</a> page</li>
                        <li>Click "Generate API Key" and give it a name</li>
                        <li>Copy your key (starts with <code>sk_</code>)</li>
                    </ol>
                    
                    <h3>Step 2: Create OAuth Apps</h3>
                    <p>For each platform you want to use, create an OAuth app in their developer portal and get your Client ID & Secret:</p>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-4); margin: var(--space-4) 0;">
                        <div class="platform-card">
                            <h4>📘 Facebook</h4>
                            <p>Create apps for Facebook Login & Instagram API</p>
                            <a href="https://developers.facebook.com/" target="_blank" class="platform-url">
                                Create Facebook App →
                            </a>
                        </div>
                        
                        <div class="platform-card">
                            <h4>🎬 Google</h4>
                            <p>Access Gmail, Drive, Calendar & more APIs</p>
                            <a href="https://console.cloud.google.com/" target="_blank" class="platform-url">
                                Create Google App →
                            </a>
                        </div>
                        
                        <div class="platform-card">
                            <h4>🐦 X (Twitter)</h4>
                            <p>Create apps for X API v2 access</p>
                            <a href="https://developer.x.com/" target="_blank" class="platform-url">
                                Create X App →
                            </a>
                        </div>
                        
                        <div class="platform-card">
                            <h4>💼 LinkedIn</h4>
                            <p>Access professional profiles & company data</p>
                            <a href="https://developer.linkedin.com/" target="_blank" class="platform-url">
                                Create LinkedIn App →
                            </a>
                        </div>
                        
                        <div class="platform-card">
                            <h4>📸 Instagram</h4>
                            <p>Use Facebook Developer Portal for Instagram API</p>
                            <a href="https://developers.facebook.com/" target="_blank" class="platform-url">
                                Create Instagram App →
                            </a>
                        </div>
                        
                        <div class="platform-card">
                            <h4>🎵 TikTok</h4>
                            <p>Create apps for TikTok Login Kit & API</p>
                            <a href="https://developers.tiktok.com/" target="_blank" class="platform-url">
                                Create TikTok App →
                            </a>
                        </div>
                    </div>
                    
                    <h3>Step 3: Add App Credentials to OAuth Hub</h3>
                    <p>Go to <a href="/apps">App Credentials</a> page and add your OAuth app details (Client ID, Secret, Scopes) for each platform.</p>
                    
                    <div class="warning-box">
                        <h4>⚠️ Important: Redirect URI Setup</h4>
                        <p>In each platform's OAuth app settings, make sure to add this exact redirect URI:</p>
                        <code>https://oauth-handler.socialoauth.workers.dev/callback</code>
                        <p><strong>This same URL works for ALL platforms!</strong></p>
                    </div>
                </div>
                
                <!-- API Endpoints -->
                <div class="card">
                    <h2>📡 API Usage</h2>
                    
                    <div class="success-box">
                        <h4>🏁 Base URL</h4>
                        <div class="code-block" style="text-align: center; font-size: 1rem;">
                            https://oauth-handler.socialoauth.workers.dev
                        </div>
                    </div>
                    
                    <h3>🎯 NEW: Direct OAuth Flow (No Webhooks Needed!)</h3>
                    <div class="success-box">
                        <h4>✨ Instant Platform User ID & Tokens</h4>
                        <p>Get the platform user ID and tokens directly in your browser - no webhooks or polling required!</p>
                        ${createCodeBlock(`// Simple popup flow - get data instantly
const result = await connectSocial('facebook', 'sk_your_api_key');

console.log('Facebook User ID:', result.platformUserId);
console.log('Access Token:', result.tokens.accessToken);`)}
                    </div>

                    <h4>🔧 Complete Implementation</h4>
                    ${createCodeBlock(`// Helper function for OAuth popup flow
function connectSocial(platform, apiKey) {
  return new Promise((resolve, reject) => {
    // 1. Get consent URL
    fetch(\`/consent/\${platform}/\${apiKey}\`)
      .then(res => res.json())
      .then(data => {
        // 2. Open popup
        const popup = window.open(data.consentUrl, 'oauth', 'width=500,height=600');

        // 3. Listen for completion
        const messageHandler = (event) => {
          if (event.data.type === 'oauth_complete') {
            window.removeEventListener('message', messageHandler);
            popup.close();

            // 4. You immediately get everything!
            resolve({
              platform: event.data.platform,
              platformUserId: event.data.platformUserId,
              tokens: event.data.tokens
            });
          } else if (event.data.type === 'oauth_error') {
            window.removeEventListener('message', messageHandler);
            popup.close();
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener('message', messageHandler);

        // Handle popup closed without completion
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);
            reject(new Error('User cancelled authorization'));
          }
        }, 1000);
      })
      .catch(reject);
  });
}`, 'javascript', 'Copy this helper function to your application')}

                    <h4>⚛️ Framework-Specific Examples</h4>

                    <h5>React Hook</h5>
                    ${createCodeBlock(`import { useState } from 'react';

function useSocialConnect(apiKey) {
  const [loading, setLoading] = useState(false);

  const connectSocial = async (platform) => {
    setLoading(true);
    try {
      const result = await connectSocial(platform, apiKey);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { connectSocial, loading };
}

// Usage in component
const { connectSocial, loading } = useSocialConnect('sk_your_api_key');

const handleConnect = async () => {
  try {
    const result = await connectSocial('facebook');
    setUser(prev => ({
      ...prev,
      facebookId: result.platformUserId,
      facebookConnected: true
    }));
  } catch (error) {
    console.error('Connection failed:', error);
  }
};`, 'javascript', 'React hook for social connections')}

                    <h5>Vue.js Composition API</h5>
                    ${createCodeBlock(`import { ref } from 'vue';

export function useSocialConnect(apiKey) {
  const loading = ref(false);

  const connectSocial = async (platform) => {
    loading.value = true;
    try {
      const result = await connectSocial(platform, apiKey);
      return result;
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    connectSocial,
    loading: readonly(loading)
  };
}

// Usage in component
const { connectSocial, loading } = useSocialConnect('sk_your_api_key');

const connectFacebook = async () => {
  try {
    const result = await connectSocial('facebook');
    user.value.facebookId = result.platformUserId;
    await saveConnection(result);
  } catch (error) {
    showError(error.message);
  }
};`, 'javascript', 'Vue.js composition API for social connections')}

                    <h5>Vanilla JavaScript</h5>
                    ${createCodeBlock(`// Simple button handler
document.getElementById('connect-btn').addEventListener('click', async () => {
  const btn = document.getElementById('connect-btn');
  const status = document.getElementById('status');

  btn.disabled = true;
  btn.textContent = 'Connecting...';

  try {
    const result = await connectSocial('facebook', 'sk_your_api_key');

    status.textContent = \`Connected: \${result.platformUserId}\`;
    status.style.color = 'green';

    // Save to your backend
    await fetch('/api/users/connect-social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: 'facebook',
        platformUserId: result.platformUserId,
        accessToken: result.tokens.accessToken
      })
    });

  } catch (error) {
    status.textContent = \`Error: \${error.message}\`;
    status.style.color = 'red';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Connect Facebook';
  }
});`, 'javascript', 'Vanilla JavaScript implementation')}
                    
                    <h3>1. Generate OAuth URL</h3>
                    <div class="endpoint">
                        <div style="display: flex; align-items: center; margin-bottom: var(--space-2);">
                            <span class="method get">GET</span>
                            <code>/consent/{platform}/{apiKey}</code>
                        </div>
                        <p>Get the authorization URL for users to grant permissions</p>
                        <div class="code-block">
<strong>Example:</strong><br>
GET /consent/facebook/sk_abc123<br><br>
<strong>Returns:</strong><br>
{<br>
&nbsp;&nbsp;"consentUrl": "https://facebook.com/oauth?...",<br>
&nbsp;&nbsp;"platform": "FACEBOOK",<br>
&nbsp;&nbsp;"state": "base64_encoded_state"<br>
}
                        </div>
                    </div>
                    
                    <h3>2. Get Access Tokens</h3>
                    <div class="endpoint">
                        <div style="display: flex; align-items: center; margin-bottom: var(--space-2);">
                            <span class="method get">GET</span>
                            <code>/tokens/{platformUserId}/{apiKey}</code>
                        </div>
                        <p>Retrieve valid access tokens (auto-refreshes if expired)</p>
                        <div class="code-block">
<strong>Example:</strong><br>
GET /tokens/123456789/sk_abc123<br><br>
<strong>Returns:</strong><br>
{<br>
&nbsp;&nbsp;"accessToken": "EAAVfX...",<br>
&nbsp;&nbsp;"tokenType": "bearer",<br>
&nbsp;&nbsp;"expiresAt": 1756142188028,<br>
&nbsp;&nbsp;"platform": "facebook",<br>
&nbsp;&nbsp;"platformUserId": "123456789"<br>
}
                        </div>
                    </div>
                    
                    <h3>Supported Platforms</h3>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); margin: var(--space-4) 0;">
                        <div style="text-align: center; padding: var(--space-2);">
                            <div style="font-size: 1.5rem;">📘</div>
                            <code>facebook</code>
                        </div>
                        <div style="text-align: center; padding: var(--space-2);">
                            <div style="font-size: 1.5rem;">🎬</div>
                            <code>google</code>
                        </div>
                        <div style="text-align: center; padding: var(--space-2);">
                            <div style="font-size: 1.5rem;">📸</div>
                            <code>instagram</code>
                        </div>
                        <div style="text-align: center; padding: var(--space-2);">
                            <div style="font-size: 1.5rem;">🐦</div>
                            <code>twitter</code>
                        </div>
                        <div style="text-align: center; padding: var(--space-2);">
                            <div style="font-size: 1.5rem;">💼</div>
                            <code>linkedin</code>
                        </div>
                        <div style="text-align: center; padding: var(--space-2);">
                            <div style="font-size: 1.5rem;">🎵</div>
                            <code>tiktok</code>
                        </div>
                    </div>
                </div>
                
                <!-- Implementation Guide -->
                <div class="card">
                    <h2>💻 Implementation Guide</h2>
                    
                    <div class="warning-box">
                        <h4>🔑 Critical: Capturing Platform User ID</h4>
                        <p>After OAuth completion, you <strong>MUST</strong> capture the platform user ID to make token requests.</p>
                    </div>
                    
                    <h3>Frontend Implementation (JavaScript)</h3>
                    <div class="code-block">
// 1. Set up OAuth callback listener (BEFORE opening popup)
window.addEventListener('message', (event) => {
&nbsp;&nbsp;if (event.origin !== 'https://oauth-handler.socialoauth.workers.dev') return;
&nbsp;&nbsp;
&nbsp;&nbsp;if (event.data.type === 'oauth_success') {
&nbsp;&nbsp;&nbsp;&nbsp;const platformUserId = event.data.userId;  // "822389666895701"
&nbsp;&nbsp;&nbsp;&nbsp;const platform = event.data.platform;      // "facebook"
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;// SAVE THIS ID! You need it for all token requests
&nbsp;&nbsp;&nbsp;&nbsp;saveUserOAuthData(platform, platformUserId);
&nbsp;&nbsp;}
});

// 2. Start OAuth flow
async function startOAuth(platform) {
&nbsp;&nbsp;const response = await fetch('/consent/' + platform + '/' + API_KEY);
&nbsp;&nbsp;const { consentUrl } = await response.json();
&nbsp;&nbsp;
&nbsp;&nbsp;// Open popup window
&nbsp;&nbsp;window.open(consentUrl, 'oauth', 'width=500,height=600');
}
                    </div>
                    
                    <h3>Backend Implementation (Node.js)</h3>
                    <div class="code-block">
const API_KEY = 'sk_your_api_key_here';
const BASE_URL = 'https://oauth-handler.socialoauth.workers.dev';

// Get access token for API calls
async function getAccessToken(platformUserId) {
&nbsp;&nbsp;const response = await fetch(BASE_URL + '/tokens/' + platformUserId + '/' + API_KEY);
&nbsp;&nbsp;const data = await response.json();
&nbsp;&nbsp;
&nbsp;&nbsp;if (!response.ok) throw new Error(data.error);
&nbsp;&nbsp;return data.accessToken;
}

// Use token for platform API calls
async function callFacebookAPI(accessToken) {
&nbsp;&nbsp;const response = await fetch('https://graph.facebook.com/me', {
&nbsp;&nbsp;&nbsp;&nbsp;headers: { 'Authorization': 'Bearer ' + accessToken }
&nbsp;&nbsp;});
&nbsp;&nbsp;return response.json();
}
                    </div>
                    
                    <h3>Python Implementation</h3>
                    <div class="code-block">
import requests

API_KEY = 'sk_your_api_key_here'
BASE_URL = 'https://oauth-handler.socialoauth.workers.dev'

def get_access_token(platform_user_id):
&nbsp;&nbsp;&nbsp;&nbsp;url = f"{BASE_URL}/tokens/{platform_user_id}/{API_KEY}"
&nbsp;&nbsp;&nbsp;&nbsp;response = requests.get(url)
&nbsp;&nbsp;&nbsp;&nbsp;response.raise_for_status()
&nbsp;&nbsp;&nbsp;&nbsp;return response.json()['accessToken']

def call_facebook_api(access_token):
&nbsp;&nbsp;&nbsp;&nbsp;headers = {'Authorization': f'Bearer {access_token}'}
&nbsp;&nbsp;&nbsp;&nbsp;response = requests.get('https://graph.facebook.com/me', headers=headers)
&nbsp;&nbsp;&nbsp;&nbsp;return response.json()
                    </div>
                </div>
                
                <!-- Security & Best Practices -->
                <div class="card">
                    <h2>🔐 Security & Best Practices</h2>
                    
                    <h3>API Key Security</h3>
                    <ul>
                        <li>✅ Keep API keys secret - never expose in client-side code</li>
                        <li>✅ Use OAuth Hub from your backend server only</li>
                        <li>✅ Rotate keys regularly for enhanced security</li>
                        <li>✅ Use HTTPS for all API calls</li>
                    </ul>
                    
                    <h3>OAuth Security</h3>
                    <ul>
                        <li>✅ Use unique state parameters to prevent CSRF attacks</li>
                        <li>✅ Verify message origins in OAuth callbacks</li>
                        <li>✅ Store platform user IDs securely in your database</li>
                        <li>✅ Tokens are automatically encrypted and stored securely</li>
                    </ul>
                </div>
                
                <!-- Error Handling -->
                <div class="card">
                    <h2>🚨 Error Handling</h2>
                    
                    <h3>Common HTTP Status Codes</h3>
                    <ul>
                        <li><code>200</code> - Success</li>
                        <li><code>400</code> - Bad Request (missing parameters)</li>
                        <li><code>401</code> - Unauthorized (invalid API key)</li>
                        <li><code>404</code> - Not Found (no tokens found)</li>
                        <li><code>500</code> - Internal Server Error</li>
                    </ul>
                    
                    <h3>Error Response Format</h3>
                    <div class="code-block">
{
&nbsp;&nbsp;"error": "Error message",
&nbsp;&nbsp;"message": "Additional details (optional)"
}
                    </div>
                </div>
                
            </div>
        </main>
    </div>
    
    ${getSharedScript()}
    <script>
        // Copy code to clipboard functionality
        async function copyToClipboard(button) {
            const code = button.getAttribute('data-code').replace(/\\n/g, '\n').replace(/&quot;/g, '"');

            try {
                await navigator.clipboard.writeText(code);
                button.textContent = '✅ Copied!';
                button.classList.add('copied');

                // Reset button after 2 seconds
                setTimeout(() => {
                    button.textContent = '📋 Copy';
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy: ', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = code;
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    document.execCommand('copy');
                    button.textContent = '✅ Copied!';
                    button.classList.add('copied');

                    setTimeout(() => {
                        button.textContent = '📋 Copy';
                        button.classList.remove('copied');
                    }, 2000);
                } catch (fallbackErr) {
                    console.error('Fallback copy failed: ', fallbackErr);
                    button.textContent = '❌ Copy failed';
                    setTimeout(() => {
                        button.textContent = '📋 Copy';
                    }, 2000);
                }

                document.body.removeChild(textArea);
            }
        }

        // Show platform URL on hover for platform cards
        document.querySelectorAll('.platform-card').forEach(card => {
            card.addEventListener('click', function() {
                const link = this.querySelector('.platform-url');
                if (link) {
                    link.click();
                }
            });
        });

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

        // Highlight code blocks on hover
        document.querySelectorAll('.code-block').forEach(block => {
            block.addEventListener('mouseenter', function() {
                this.style.borderColor = 'var(--primary-400)';
            });

            block.addEventListener('mouseleave', function() {
                this.style.borderColor = 'var(--border-color)';
            });
        });
    </script>
</body>
</html>`;
}