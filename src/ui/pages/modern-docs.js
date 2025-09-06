// =============================================================================
// 📚 MODERN DOCUMENTATION PAGE - API documentation
// =============================================================================

import { MODERN_CSS, MODERN_ICONS } from '../modern-styles.js';
import { getModernLayout, getModernScripts } from '../modern-navigation.js';
import { getClientAuthScript } from '../../lib/auth/client-auth.js';

export function getModernDocsPage() {
  const content = `
    <!-- Page Header -->
    <div class="mb-6">
      <p class="text-secondary">Complete guide to integrating with OAuth Hub API</p>
    </div>
    
    <!-- Quick Links -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <a href="#getting-started" class="card hover:shadow-md transition-shadow cursor-pointer">
        <div class="flex items-center gap-3">
          <div class="stat-icon" style="width: 48px; height: 48px; background: rgba(0, 113, 227, 0.1); color: var(--brand-accent);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="10 8 16 12 10 16 10 8"></polygon>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold">Getting Started</h3>
            <p class="text-small text-muted">Quick setup guide</p>
          </div>
        </div>
      </a>
      
      <a href="#api-reference" class="card hover:shadow-md transition-shadow cursor-pointer">
        <div class="flex items-center gap-3">
          <div class="stat-icon" style="width: 48px; height: 48px; background: rgba(52, 199, 89, 0.1); color: var(--brand-success);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold">API Reference</h3>
            <p class="text-small text-muted">Endpoint documentation</p>
          </div>
        </div>
      </a>
      
      <a href="#examples" class="card hover:shadow-md transition-shadow cursor-pointer">
        <div class="flex items-center gap-3">
          <div class="stat-icon" style="width: 48px; height: 48px; background: rgba(255, 149, 0, 0.1); color: var(--brand-warning);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <div>
            <h3 class="font-semibold">Code Examples</h3>
            <p class="text-small text-muted">Implementation samples</p>
          </div>
        </div>
      </a>
    </div>
    
    <!-- Documentation Content -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar Navigation -->
      <div class="lg:col-span-1">
        <div class="card sticky top-24">
          <h3 class="font-semibold mb-4">Contents</h3>
          <nav class="space-y-2">
            <a href="#getting-started" class="block py-2 px-3 rounded-md hover:bg-tertiary transition-colors text-small">Getting Started</a>
            <a href="#authentication" class="block py-2 px-3 rounded-md hover:bg-tertiary transition-colors text-small">Authentication</a>
            <a href="#consent-flow" class="block py-2 px-3 rounded-md hover:bg-tertiary transition-colors text-small">OAuth Consent Flow</a>
            <a href="#token-management" class="block py-2 px-3 rounded-md hover:bg-tertiary transition-colors text-small">Token Management</a>
            <a href="#api-reference" class="block py-2 px-3 rounded-md hover:bg-tertiary transition-colors text-small">API Reference</a>
            <a href="#error-handling" class="block py-2 px-3 rounded-md hover:bg-tertiary transition-colors text-small">Error Handling</a>
            <a href="#rate-limits" class="block py-2 px-3 rounded-md hover:bg-tertiary transition-colors text-small">Rate Limits</a>
            <a href="#examples" class="block py-2 px-3 rounded-md hover:bg-tertiary transition-colors text-small">Examples</a>
          </nav>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="lg:col-span-3 space-y-8">
        <!-- Getting Started -->
        <section id="getting-started" class="card">
          <h2 class="text-2xl font-bold mb-4">Getting Started</h2>
          <p class="text-secondary mb-4">
            OAuth Hub provides a simple, unified API for managing OAuth integrations across multiple platforms. 
            Follow these steps to get started:
          </p>
          
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold mb-2">1. Create an Account</h3>
              <p class="text-secondary mb-3">Sign up for an OAuth Hub account to get started.</p>
              <div class="code-block">
                <pre><code>https://oauth-hub.com/auth</code></pre>
              </div>
            </div>
            
            <div>
              <h3 class="font-semibold mb-2">2. Generate an API Key</h3>
              <p class="text-secondary mb-3">Create an API key from your dashboard to authenticate your requests.</p>
              <div class="code-block">
                <pre><code>Dashboard → API Keys → Create New Key</code></pre>
              </div>
            </div>
            
            <div>
              <h3 class="font-semibold mb-2">3. Add OAuth Apps</h3>
              <p class="text-secondary mb-3">Configure your OAuth applications for each platform you want to integrate.</p>
              <div class="code-block">
                <pre><code>Dashboard → OAuth Apps → Add OAuth App</code></pre>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Authentication -->
        <section id="authentication" class="card">
          <h2 class="text-2xl font-bold mb-4">Authentication</h2>
          <p class="text-secondary mb-4">
            All API requests must include your API key in the URL path. Keep your API keys secure and never expose them in client-side code.
          </p>
          
          <div class="alert alert-info mb-4">
            <span style="width: 20px; height: 20px;">${MODERN_ICONS.info}</span>
            <span>API keys should be kept confidential and stored securely in your backend.</span>
          </div>
          
          <div class="code-block">
            <pre><code>GET https://oauth-hub.com/consent/{platform}/{your_api_key}
GET https://oauth-hub.com/token/{platform_user_id}/{your_api_key}</code></pre>
          </div>
        </section>
        
        <!-- OAuth Consent Flow -->
        <section id="consent-flow" class="card">
          <h2 class="text-2xl font-bold mb-4">OAuth Consent Flow</h2>
          <p class="text-secondary mb-4">
            The consent flow allows your users to authorize access to their accounts on various platforms.
          </p>
          
          <h3 class="font-semibold mb-3">Step 1: Generate Consent URL</h3>
          <p class="text-secondary mb-3">Request a consent URL for the user to authorize access:</p>
          
          <div class="code-block mb-4">
            <pre><code>GET /consent/{platform}/{api_key}

Response:
{
  "consentUrl": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "state": "google_sk_abc123_1234567890"
}</code></pre>
          </div>
          
          <h3 class="font-semibold mb-3">Step 2: User Authorization</h3>
          <p class="text-secondary mb-3">Redirect the user to the consent URL or open it in a popup:</p>
          
          <div class="code-block mb-4">
            <pre><code>// JavaScript Example
window.open(consentUrl, 'oauth-consent', 'width=500,height=600');</code></pre>
          </div>
          
          <h3 class="font-semibold mb-3">Step 3: Handle Callback</h3>
          <p class="text-secondary mb-3">After authorization, the user is redirected to:</p>
          
          <div class="code-block">
            <pre><code>https://oauth-hub.com/?code={auth_code}&state={state}

// Extract platform and user ID from the response
{
  "platform": "google",
  "platformUserId": "user_12345"
}</code></pre>
          </div>
        </section>
        
        <!-- Token Management -->
        <section id="token-management" class="card">
          <h2 class="text-2xl font-bold mb-4">Token Management</h2>
          <p class="text-secondary mb-4">
            OAuth Hub handles token storage, refresh, and retrieval automatically.
          </p>
          
          <h3 class="font-semibold mb-3">Get Access Token</h3>
          <p class="text-secondary mb-3">Retrieve a valid access token for API calls:</p>
          
          <div class="code-block mb-4">
            <pre><code>GET /token/{platform_user_id}/{api_key}

Response:
{
  "access_token": "ya29.a0AfH6SMBx...",
  "token_type": "Bearer",
  "expires_in": 3599
}</code></pre>
          </div>
          
          <div class="alert alert-success">
            <span style="width: 20px; height: 20px;">${MODERN_ICONS.check}</span>
            <span>Tokens are automatically refreshed when needed - no manual refresh required!</span>
          </div>
        </section>
        
        <!-- API Reference -->
        <section id="api-reference" class="card">
          <h2 class="text-2xl font-bold mb-4">API Reference</h2>
          
          <div class="space-y-6">
            <!-- Consent Endpoint -->
            <div class="border rounded-lg p-4">
              <div class="flex items-center gap-3 mb-3">
                <span class="badge badge-primary">GET</span>
                <code class="text-sm">/consent/{platform}/{api_key}</code>
              </div>
              <p class="text-secondary mb-3">Generate an OAuth consent URL for user authorization.</p>
              
              <h4 class="font-semibold mb-2">Parameters</h4>
              <table class="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>platform</code></td>
                    <td>string</td>
                    <td>Platform identifier (google, facebook, etc.)</td>
                  </tr>
                  <tr>
                    <td><code>api_key</code></td>
                    <td>string</td>
                    <td>Your OAuth Hub API key</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Token Endpoint -->
            <div class="border rounded-lg p-4">
              <div class="flex items-center gap-3 mb-3">
                <span class="badge badge-primary">GET</span>
                <code class="text-sm">/token/{platform_user_id}/{api_key}</code>
              </div>
              <p class="text-secondary mb-3">Retrieve a valid access token for the platform user.</p>
              
              <h4 class="font-semibold mb-2">Parameters</h4>
              <table class="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>platform_user_id</code></td>
                    <td>string</td>
                    <td>Platform-specific user identifier</td>
                  </tr>
                  <tr>
                    <td><code>api_key</code></td>
                    <td>string</td>
                    <td>Your OAuth Hub API key</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        <!-- Error Handling -->
        <section id="error-handling" class="card">
          <h2 class="text-2xl font-bold mb-4">Error Handling</h2>
          <p class="text-secondary mb-4">
            OAuth Hub uses standard HTTP response codes to indicate success or failure.
          </p>
          
          <table class="table">
            <thead>
              <tr>
                <th>Status Code</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>200 OK</code></td>
                <td>Request succeeded</td>
              </tr>
              <tr>
                <td><code>400 Bad Request</code></td>
                <td>Invalid request parameters</td>
              </tr>
              <tr>
                <td><code>401 Unauthorized</code></td>
                <td>Invalid or missing API key</td>
              </tr>
              <tr>
                <td><code>404 Not Found</code></td>
                <td>Resource not found</td>
              </tr>
              <tr>
                <td><code>429 Too Many Requests</code></td>
                <td>Rate limit exceeded</td>
              </tr>
              <tr>
                <td><code>500 Internal Server Error</code></td>
                <td>Server error</td>
              </tr>
            </tbody>
          </table>
        </section>
        
        <!-- Examples -->
        <section id="examples" class="card">
          <h2 class="text-2xl font-bold mb-4">Code Examples</h2>
          
          <div class="space-y-6">
            <div>
              <h3 class="font-semibold mb-3">JavaScript/Node.js</h3>
              <div class="code-block">
                <pre><code>// Generate consent URL
const response = await fetch(\`https://oauth-hub.com/consent/google/\${API_KEY}\`);
const { consentUrl } = await response.json();

// Open consent popup
window.open(consentUrl, 'oauth', 'width=500,height=600');

// Get access token
const tokenResponse = await fetch(\`https://oauth-hub.com/token/\${platformUserId}/\${API_KEY}\`);
const { access_token } = await tokenResponse.json();

// Use the token
const userInfo = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
  headers: { 'Authorization': \`Bearer \${access_token}\` }
});</code></pre>
              </div>
            </div>
            
            <div>
              <h3 class="font-semibold mb-3">Python</h3>
              <div class="code-block">
                <pre><code>import requests

# Generate consent URL
response = requests.get(f'https://oauth-hub.com/consent/google/{API_KEY}')
consent_url = response.json()['consentUrl']

# Get access token
token_response = requests.get(f'https://oauth-hub.com/token/{platform_user_id}/{API_KEY}')
access_token = token_response.json()['access_token']

# Use the token
headers = {'Authorization': f'Bearer {access_token}'}
user_info = requests.get('https://www.googleapis.com/oauth2/v1/userinfo', headers=headers)</code></pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentation - OAuth Hub</title>
    <style>
      ${MODERN_CSS}
      
      /* Documentation Specific Styles */
      .code-block {
        background: var(--bg-tertiary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-md);
        padding: var(--space-4);
        overflow-x: auto;
        margin-bottom: var(--space-4);
      }
      
      .code-block pre {
        margin: 0;
        font-family: var(--font-mono);
        font-size: 0.875rem;
        line-height: 1.6;
      }
      
      .code-block code {
        color: var(--text-primary);
        font-family: inherit;
      }
      
      .space-y-2 > * + * {
        margin-top: var(--space-2);
      }
      
      .space-y-6 > * + * {
        margin-top: var(--space-6);
      }
      
      .space-y-8 > * + * {
        margin-top: var(--space-8);
      }
      
      .sticky {
        position: sticky;
      }
      
      .top-24 {
        top: 6rem;
      }
      
      .hover\\:bg-tertiary:hover {
        background: var(--bg-tertiary);
      }
      
      .hover\\:shadow-md:hover {
        box-shadow: var(--shadow-md);
      }
      
      .transition-shadow {
        transition: box-shadow var(--transition-base);
      }
      
      .transition-colors {
        transition: background-color var(--transition-base), color var(--transition-base);
      }
      
      .grid-cols-1 {
        grid-template-columns: 1fr;
      }
      
      @media (min-width: 768px) {
        .md\\:grid-cols-3 {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      
      @media (min-width: 1024px) {
        .lg\\:grid-cols-4 {
          grid-template-columns: repeat(4, 1fr);
        }
        
        .lg\\:col-span-1 {
          grid-column: span 1;
        }
        
        .lg\\:col-span-3 {
          grid-column: span 3;
        }
      }
      
      .alert {
        padding: var(--space-3) var(--space-4);
        border-radius: var(--radius-md);
        margin-bottom: var(--space-4);
        display: flex;
        align-items: flex-start;
        gap: var(--space-3);
      }
      
      .alert-info {
        background: rgba(0, 113, 227, 0.1);
        border: 1px solid rgba(0, 113, 227, 0.2);
        color: var(--text-primary);
      }
      
      .alert-success {
        background: rgba(52, 199, 89, 0.1);
        border: 1px solid rgba(52, 199, 89, 0.2);
        color: var(--text-primary);
      }
      
      .text-2xl {
        font-size: 1.5rem;
      }
      
      .py-2 {
        padding-top: var(--space-2);
        padding-bottom: var(--space-2);
      }
      
      .px-3 {
        padding-left: var(--space-3);
        padding-right: var(--space-3);
      }
      
      .rounded-md {
        border-radius: var(--radius-md);
      }
      
      .border {
        border: 1px solid var(--border-light);
      }
      
      .rounded-lg {
        border-radius: var(--radius-lg);
      }
      
      .p-4 {
        padding: var(--space-4);
      }
      
      .text-sm {
        font-size: 0.875rem;
      }
    </style>
</head>
<body>
    ${getModernLayout('docs', 'Documentation', content)}
    
    ${getClientAuthScript()}
    ${getModernScripts()}
    
    <script>
      // Initialize
      document.addEventListener('DOMContentLoaded', () => {
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        
        // Update user info in navigation
        if (userEmail && userName) {
          document.querySelectorAll('.profile-email').forEach(el => el.textContent = userEmail);
          document.querySelectorAll('.profile-name').forEach(el => el.textContent = userName);
          
          const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
          document.querySelectorAll('.profile-avatar').forEach(el => el.textContent = initials);
        }
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          });
        });
      });
    </script>
</body>
</html>`;
}
