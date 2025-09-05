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
                        
                        <a href="https://developer.wordpress.com/apps/" target="_blank" class="platform-card" style="text-decoration: none; color: inherit;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">📝</div>
                            <h4>WordPress.com</h4>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Sites & Content API</p>
                        </a>
                        
                        <a href="https://www.reddit.com/dev/api/" target="_blank" class="platform-card" style="text-decoration: none; color: inherit;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">🔴</div>
                            <h4>Reddit</h4>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Posts & Communities</p>
                        </a>
                        
                        <a href="https://github.com/settings/developers" target="_blank" class="platform-card" style="text-decoration: none; color: inherit;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">🐙</div>
                            <h4>GitHub</h4>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Repositories & Code</p>
                        </a>
                        
                        <a href="https://developer.spotify.com/dashboard" target="_blank" class="platform-card" style="text-decoration: none; color: inherit;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">🎵</div>
                            <h4>Spotify</h4>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Music & Playlists</p>
                        </a>
                        
                        <a href="https://dev.twitch.tv/console" target="_blank" class="platform-card" style="text-decoration: none; color: inherit;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">🎮</div>
                            <h4>Twitch</h4>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Streaming & Chat</p>
                        </a>
                        
                        <a href="https://api.slack.com/apps" target="_blank" class="platform-card" style="text-decoration: none; color: inherit;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">💬</div>
                            <h4>Slack</h4>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Workspace & Teams</p>
                        </a>
                        
                        <a href="https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps" target="_blank" class="platform-card" style="text-decoration: none; color: inherit;">
                            <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">🏢</div>
                            <h4>Microsoft</h4>
                            <p style="margin: 0; font-size: 0.875rem; color: var(--gray-600);">Office 365 & Azure</p>
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
                        <div><div style="font-size: 1.5rem;">🎮</div><code>discord</code></div>
                        <div><div style="font-size: 1.5rem;">📌</div><code>pinterest</code></div>
                        <div><div style="font-size: 1.5rem;">📝</div><code>wordpress</code></div>
                        <div><div style="font-size: 1.5rem;">🔴</div><code>reddit</code></div>
                        <div><div style="font-size: 1.5rem;">🐙</div><code>github</code></div>
                        <div><div style="font-size: 1.5rem;">🎵</div><code>spotify</code></div>
                        <div><div style="font-size: 1.5rem;">🎮</div><code>twitch</code></div>
                        <div><div style="font-size: 1.5rem;">💬</div><code>slack</code></div>
                        <div><div style="font-size: 1.5rem;">🏢</div><code>microsoft</code></div>
                        </div>
                    </div>

                <!-- WordPress.com Specific -->
                <div class="card">
                    <h2>📝 WordPress.com Integration</h2>
                    
                    <div class="success-box">
                        <h4>✨ WordPress.com OAuth2</h4>
                        <p>WordPress.com uses OAuth2 for secure authentication with fine-grained scope control. <a href="https://developer.wordpress.com/docs/api/oauth2/" target="_blank">Learn more about WordPress.com OAuth2</a>.</p>
                    </div>
                    
                    <h3>🔧 WordPress App Setup</h3>
                    <ol>
                        <li><strong>Register your application</strong> at <a href="https://developer.wordpress.com/apps/" target="_blank">WordPress.com Applications Manager</a></li>
                        <li><strong>Get your credentials:</strong>
                            <ul>
                                <li>Client ID (identifies your application)</li>
                                <li>Client Secret (authenticates your application - keep secure)</li>
                            </ul>
                        </li>
                        <li><strong>Set redirect URI:</strong> <code>https://oauth-handler.socialoauth.workers.dev/callback</code></li>
                        <li><strong>Configure scopes</strong> based on your needs (posts, media, sites, etc.)</li>
                    </ol>
                    
                    <h3>📋 WordPress Scopes</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-3); margin: var(--space-4) 0;">
                        <div>
                            <h4>Content Management</h4>
                            <ul style="font-size: 0.875rem;">
                                <li><code>posts</code> - Manage posts</li>
                                <li><code>media</code> - Upload media</li>
                                <li><code>pages</code> - Manage pages</li>
                                <li><code>comments</code> - Manage comments</li>
                            </ul>
                        </div>
                        <div>
                            <h4>Site Management</h4>
                            <ul style="font-size: 0.875rem;">
                                <li><code>sites</code> - Site information</li>
                                <li><code>themes</code> - Manage themes</li>
                                <li><code>plugins</code> - Manage plugins</li>
                                <li><code>users</code> - Manage users</li>
                            </ul>
                        </div>
                        <div>
                            <h4>Analytics & Global</h4>
                            <ul style="font-size: 0.875rem;">
                                <li><code>stats</code> - Site statistics</li>
                                <li><code>follows</code> - Followers</li>
                                <li><code>global</code> - All user sites</li>
                            </ul>
                        </div>
                    </div>

                    <h3>🔗 WordPress API Usage</h3>
                    ${createCodeBlock(`// Connect to WordPress.com
const result = await connectSocial('wordpress', 'sk_your_api_key');

// Use the token with WordPress.com REST API
const token = result.tokens.accessToken;

// Get user sites
const sitesResponse = await fetch('https://public-api.wordpress.com/rest/v1/me/sites', {
  headers: { 'Authorization': \`Bearer \${token}\` }
});
const sites = await sitesResponse.json();

// Create a new post
const postData = {
  title: 'Hello from OAuth Hub!',
  content: 'This post was created using OAuth Hub integration.',
  status: 'publish'
};

const postResponse = await fetch(\`https://public-api.wordpress.com/rest/v1/sites/\${siteId}/posts/new\`, {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(postData)
});`, 'javascript', 'WordPress.com API integration example')}
                                    </div>
                
                <!-- Platform Showcase -->
                <div class="card">
                    <h2>🌟 Platform Showcase</h2>
                    
                    <div class="success-box">
                        <h4>✨ 15 Major Platforms Supported</h4>
                        <p>OAuth Hub now supports all major social media, developer, music, streaming, workplace, and enterprise platforms with comprehensive scope management.</p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-4); margin: var(--space-4) 0; max-width: 100%;">
                        <div style="min-width: 0;">
                            <h4>🌐 Social & Media</h4>
                            <ul style="font-size: 0.875rem;">
                                <li><strong>📘 Facebook</strong> - Pages, ads, Instagram integration</li>
                                <li><strong>📸 Instagram</strong> - Content, stories, business features</li>
                                <li><strong>🐦 X (Twitter)</strong> - Tweets, follows, engagement</li>
                                <li><strong>💼 LinkedIn</strong> - Professional profiles, content</li>
                                <li><strong>🎵 TikTok</strong> - Videos, user info, analytics</li>
                                <li><strong>🔴 Reddit</strong> - Posts, comments, moderation</li>
                            </ul>
                        </div>
                        <div style="min-width: 0;">
                            <h4>🎮 Gaming & Streaming</h4>
                            <ul style="font-size: 0.875rem;">
                                <li><strong>🎮 Discord</strong> - Servers, bots, rich presence</li>
                                <li><strong>🎮 Twitch</strong> - Streams, chat, channel management</li>
                                <li><strong>🎵 Spotify</strong> - Music, playlists, playback control</li>
                            </ul>
                            
                            <h4>💼 Developer & Enterprise</h4>
                            <ul style="font-size: 0.875rem;">
                                <li><strong>🐙 GitHub</strong> - Repositories, organizations, packages</li>
                                <li><strong>💬 Slack</strong> - Workspaces, channels, messaging</li>
                                <li><strong>🏢 Microsoft</strong> - Office 365, Azure, Teams</li>
                            </ul>
                        </div>
                        <div style="min-width: 0;">
                            <h4>🎬 Content & Cloud</h4>
                            <ul style="font-size: 0.875rem;">
                                <li><strong>🎬 Google</strong> - YouTube, Drive, Gmail, Cloud</li>
                                <li><strong>📝 WordPress.com</strong> - Sites, posts, media</li>
                                <li><strong>📌 Pinterest</strong> - Boards, pins, business features</li>
                            </ul>
                            
                            <h4>🔗 Quick Integration</h4>
                            ${createCodeBlock(`// Connect to any platform
const platforms = [
  'facebook', 'google', 'instagram', 'twitter',
  'linkedin', 'tiktok', 'discord', 'pinterest',
  'wordpress', 'reddit', 'github', 'spotify',
  'twitch', 'slack', 'microsoft'
];

// Universal connection
const result = await connectSocial(platform, apiKey);`, 'javascript', 'Universal platform support')}
                        </div>
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