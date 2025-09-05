// =============================================================================
// 📖 DOCUMENTATION PAGE - Streamlined API Documentation
// =============================================================================

import { getNavigation, getSharedScript } from '../shared/navigation.js';

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
        
        /* Prevent horizontal overflow */
        body {
            overflow-x: hidden;
        }
        
        .container {
            max-width: 100%;
            overflow-x: hidden;
        }
        
        * {
            box-sizing: border-box;
        }
        
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
            transition: border-color 0.2s ease;
            max-width: 100%;
            word-wrap: break-word;
        }
        .code-block:hover {
            border-color: var(--primary-400);
        }
        .code-block-container {
            position: relative;
            margin: var(--space-4) 0;
            max-width: 100%;
            overflow: hidden;
        }
        .code-block pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            max-width: 100%;
            overflow-x: auto;
        }
        .code-title {
            margin-top: var(--space-2);
            color: var(--gray-600);
            font-size: 0.875rem;
            font-style: italic;
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
                    <p class="page-description">Simple, unified OAuth token management for all social platforms</p>
                </div>

                <!-- Quick Start Guide -->
                <div class="card">
                    <h2>🚀 Quick Start</h2>
                    
                    <div class="success-box">
                        <h4>✨ One URL for Everything</h4>
                        <p>Use this single redirect URI for ALL your OAuth apps:</p>
                        <div class="code-block" style="text-align: center; font-size: 1rem; font-weight: bold; background: var(--primary-50); border-color: var(--primary-300);">
                            https://oauth-handler.socialoauth.workers.dev/callback
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-4); margin: var(--space-4) 0;">
                        <div>
                            <h3>1️⃣ Get API Key</h3>
                            <ul>
                                <li>Sign up for OAuth Hub</li>
                                <li>Go to <a href="/api-keys">API Keys</a></li>
                                <li>Generate new key (starts with <code>sk_</code>)</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3>2️⃣ Create OAuth Apps</h3>
                            <ul>
                                <li>Visit platform developer portals</li>
                                <li>Create OAuth applications</li>
                                <li>Use the callback URL above</li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3>3️⃣ Add Credentials</h3>
                            <ul>
                                <li>Go to <a href="/apps">App Credentials</a></li>
                                <li>Add Client ID & Secret</li>
                                <li>Configure scopes</li>
                            </ul>
                        </div>
                    </div>
                    
                    <h3>🔗 Platform Developer Portals</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-3); margin: var(--space-4) 0;">
                        <a href="https://developers.facebook.com/" target="_blank" class="platform-card" style="text-decoration: none; color: inherit;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">📘</div>
                            <h4>Facebook</h4>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Login & Instagram API</p>
                        </a>
                        
                        <a href="https://console.cloud.google.com/" target="_blank" class="platform-card" style="text-decoration: none; color: inherit;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">🎬</div>
                            <h4>Google</h4>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Gmail, Drive, Calendar</p>
                        </a>
                        
                        <a href="https://developer.x.com/" target="_blank" class="platform-card" style="text-decoration: none; color: inherit;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">🐦</div>
                            <h4>X (Twitter)</h4>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Posts, Profile, DMs</p>
                        </a>
                        
                        <a href="https://developer.linkedin.com/" target="_blank" class="platform-card" style="text-decoration: none; color: inherit;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">💼</div>
                            <h4>LinkedIn</h4>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Professional profiles</p>
                        </a>
                        
                        <a href="https://developers.tiktok.com/" target="_blank" class="platform-card" style="text-decoration: none; color: inherit;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">🎵</div>
                            <h4>TikTok</h4>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Login Kit & API</p>
                        </a>
                    </div>
                </div>
                
                <!-- API Usage -->
                <div class="card">
                    <h2>💻 Implementation</h2>
                    
                    <div class="success-box">
                        <h4>🎯 Simple Popup Flow</h4>
                        <p>Get platform user ID and tokens instantly - no webhooks or polling needed!</p>
                    </div>
                    
                    <h3>📋 Copy & Paste Solution</h3>
                    ${createCodeBlock(`// Add this helper function to your app
async function connectSocial(platform, apiKey) {
  // 1. Get OAuth URL
  const response = await fetch(\`https://oauth-handler.socialoauth.workers.dev/consent/\${platform}/\${apiKey}\`);
  const { consentUrl } = await response.json();
  
  // 2. Open popup and wait for completion
  return new Promise((resolve, reject) => {
    const popup = window.open(consentUrl, 'oauth', 'width=500,height=600');
    
    const messageHandler = (event) => {
      if (event.data.type === 'oauth_complete') {
        cleanup();
        resolve({
          platform: event.data.platform,
          platformUserId: event.data.platformUserId,
          tokens: event.data.tokens
        });
      } else if (event.data.type === 'oauth_error') {
        cleanup();
        reject(new Error(event.data.error));
      }
    };
    
    const cleanup = () => {
      window.removeEventListener('message', messageHandler);
      popup.close();
    };
    
    window.addEventListener('message', messageHandler);
    
    // Handle manual popup close
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        cleanup();
        reject(new Error('User cancelled'));
      }
    }, 1000);
  });
}

// Usage - it's that simple!
const result = await connectSocial('facebook', 'sk_your_api_key');
console.log('User ID:', result.platformUserId);
console.log('Token:', result.tokens.accessToken);`, 'javascript', 'Complete implementation - just copy and paste!')}

                    <h3>🔧 Framework Examples</h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-4); max-width: 100%;">
                        <div style="min-width: 0;">
                            <h4>⚛️ React</h4>
                            ${createCodeBlock(`const [user, setUser] = useState({});
const [loading, setLoading] = useState(false);

const handleConnect = async (platform) => {
  setLoading(true);
  try {
    const result = await connectSocial(platform, 'sk_your_key');
    setUser(prev => ({
      ...prev,
      [\`\${platform}Id\`]: result.platformUserId,
      [\`\${platform}Connected\`]: true
    }));
  } catch (error) {
    alert('Connection failed: ' + error.message);
  } finally {
    setLoading(false);
  }
};`, 'javascript')}
                        </div>
                        
                        <div style="min-width: 0;">
                            <h4>🟢 Vue.js</h4>
                            ${createCodeBlock(`const user = ref({});
const loading = ref(false);

const handleConnect = async (platform) => {
  loading.value = true;
  try {
    const result = await connectSocial(platform, 'sk_your_key');
    user.value[\`\${platform}Id\`] = result.platformUserId;
    user.value[\`\${platform}Connected\`] = true;
  } catch (error) {
    alert('Connection failed: ' + error.message);
  } finally {
    loading.value = false;
  }
};`, 'javascript')}
                        </div>
                    </div>
                    
                    <h3>🔗 API Endpoints</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-4); margin: var(--space-4) 0; max-width: 100%;">
                        <div class="endpoint" style="min-width: 0;">
                            <div style="display: flex; align-items: center; margin-bottom: var(--space-2); flex-wrap: wrap; gap: var(--space-2);">
                                <span class="method get">GET</span>
                                <code style="word-break: break-all;">/consent/{platform}/{apiKey}</code>
                            </div>
                            <p>Get OAuth authorization URL</p>
                        </div>
                        
                        <div class="endpoint" style="min-width: 0;">
                            <div style="display: flex; align-items: center; margin-bottom: var(--space-2); flex-wrap: wrap; gap: var(--space-2);">
                                <span class="method get">GET</span>
                                <code style="word-break: break-all;">/tokens/{userId}/{apiKey}</code>
                            </div>
                            <p>Get fresh access tokens</p>
                        </div>
                    </div>
                    
                    <h3>🌐 Supported Platforms</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: var(--space-2); margin: var(--space-4) 0; text-align: center; max-width: 100%;">
                        <div><div style="font-size: 1.5rem;">📘</div><code>facebook</code></div>
                        <div><div style="font-size: 1.5rem;">🎬</div><code>google</code></div>
                        <div><div style="font-size: 1.5rem;">📸</div><code>instagram</code></div>
                        <div><div style="font-size: 1.5rem;">🐦</div><code>twitter</code></div>
                        <div><div style="font-size: 1.5rem;">💼</div><code>linkedin</code></div>
                        <div><div style="font-size: 1.5rem;">🎵</div><code>tiktok</code></div>
                    </div>
                </div>
                
                <!-- Backend Usage -->
                <div class="card">
                    <h2>🔧 Backend Integration</h2>
                    
                    <div class="warning-box">
                        <h4>🔑 Important</h4>
                        <p>Save the <strong>platformUserId</strong> from the popup result - you need it to retrieve tokens later!</p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-4); max-width: 100%;">
                        <div style="min-width: 0;">
                            <h4>🟨 Node.js</h4>
                            ${createCodeBlock(`// Get fresh tokens
async function getTokens(platformUserId, apiKey) {
  const url = \`https://oauth-handler.socialoauth.workers.dev/tokens/\${platformUserId}/\${apiKey}\`;
  const response = await fetch(url);
  const data = await response.json();
  return data.accessToken;
}

// Use with platform APIs
const token = await getTokens('123456789', 'sk_your_key');
const profile = await fetch('https://graph.facebook.com/me', {
  headers: { 'Authorization': \`Bearer \${token}\` }
});`, 'javascript')}
                        </div>
                        
                        <div style="min-width: 0;">
                            <h4>🐍 Python</h4>
                            ${createCodeBlock(`import requests

def get_tokens(platform_user_id, api_key):
    url = f"https://oauth-handler.socialoauth.workers.dev/tokens/{platform_user_id}/{api_key}"
    response = requests.get(url)
    return response.json()['accessToken']

# Use with platform APIs
token = get_tokens('123456789', 'sk_your_key')
profile = requests.get('https://graph.facebook.com/me', 
    headers={'Authorization': f'Bearer {token}'})`, 'python')}
                        </div>
                    </div>
                </div>
                
                <!-- Security & Tips -->
                <div class="card">
                    <h2>🔐 Security & Tips</h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-4); max-width: 100%;">
                        <div style="min-width: 0;">
                            <h4>✅ Best Practices</h4>
                            <ul>
                                <li>Keep API keys secret (backend only)</li>
                                <li>Store platform user IDs securely</li>
                                <li>Use HTTPS for all requests</li>
                                <li>Tokens auto-refresh when needed</li>
                            </ul>
                        </div>
                        
                        <div style="min-width: 0;">
                            <h4>📋 Common Status Codes</h4>
                            <ul>
                                <li><code>200</code> - Success</li>
                                <li><code>401</code> - Invalid API key</li>
                                <li><code>404</code> - No tokens found</li>
                                <li><code>500</code> - Server error</li>
                            </ul>
                        </div>
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

        // Smooth scrolling for internal links
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