// =============================================================================
// 📚 MODERN DOCUMENTATION PAGE - OpenAI Style with Copy Buttons & Language Dropdowns
// =============================================================================

import { MODERN_CSS, MODERN_ICONS } from '../styles.js';
import { getModernLayout, getModernScripts } from '../navigation.js';
import { getClientAuthScript } from '../../lib/auth/client-auth.js';

export function getModernDocsPage() {
  const content = `
    <!-- Page Header -->
    <div class="mb-6">
      <p class="text-secondary">Complete guide to integrating with OAuth Hub API</p>
    </div>
    
    <!-- Quick Navigation Bar -->
    <div class="card mb-6">
      <div class="flex items-center gap-2 mb-4">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-brand-accent">
          <path d="M3 3h18v18H3zM9 9h6v6H9z"/>
        </svg>
        <h3 class="font-semibold text-lg">Quick Navigation</h3>
      </div>
      <nav class="nav-container">
        <div class="flex flex-wrap gap-2">
        <a href="#getting-started" class="nav-pill">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Getting Started
        </a>
        <a href="#redirect-setup" class="nav-pill">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          Redirect URI
        </a>
        <a href="#api-reference" class="nav-pill">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          API Reference
        </a>
        <a href="#consent-flow" class="nav-pill">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
          OAuth Flow
        </a>
        <a href="#token-management" class="nav-pill">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
          </svg>
          Tokens
        </a>
        <a href="#supported-platforms" class="nav-pill">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <rect x="7" y="7" width="3" height="9"/>
            <rect x="14" y="7" width="3" height="5"/>
          </svg>
          Platforms
        </a>
        <a href="#error-handling" class="nav-pill">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Error Handling
        </a>
        <a href="#examples" class="nav-pill">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
          Examples
        </a>
        </div>
      </nav>
    </div>
    
    <!-- Main Documentation Content -->
    <div class="space-y-8">
        <!-- Getting Started -->
        <section id="getting-started" class="card">
          <h2 class="text-2xl font-bold mb-4">Getting Started</h2>
          <p class="text-secondary mb-6">
            OAuth Hub provides a simple, unified API for managing OAuth integrations across multiple platforms. 
            Follow these steps to get started:
          </p>
          
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-8 h-8 bg-brand-accent text-white rounded-full flex items-center justify-center font-semibold text-sm">
                1
              </div>
              <div>
                <h3 class="font-semibold mb-2">Create an Account</h3>
                <p class="text-secondary mb-3">
                  Sign up for an OAuth Hub account at <a href="/auth" class="text-brand-accent hover:underline">oauth-hub.com/auth</a> 
                  to access the dashboard and start managing your OAuth integrations.
                </p>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-8 h-8 bg-brand-accent text-white rounded-full flex items-center justify-center font-semibold text-sm">
                2
              </div>
              <div>
                <h3 class="font-semibold mb-2">Generate an API Key</h3>
                <p class="text-secondary mb-3">
                  Navigate to <strong>Dashboard → API Keys → Create New Key</strong> to generate your authentication key. 
                  This key will be used to authenticate all your API requests.
                </p>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-8 h-8 bg-brand-accent text-white rounded-full flex items-center justify-center font-semibold text-sm">
                3
              </div>
              <div>
                <h3 class="font-semibold mb-2">Add OAuth Apps</h3>
                <p class="text-secondary mb-3">
                  Go to <strong>Dashboard → OAuth Apps → Add OAuth App</strong> to configure your OAuth applications 
                  for each platform you want to integrate (Google, Facebook, GitHub, etc.).
                </p>
              </div>
            </div>
            
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-8 h-8 bg-brand-accent text-white rounded-full flex items-center justify-center font-semibold text-sm">
                4
              </div>
              <div>
                <h3 class="font-semibold mb-2">Start Integrating</h3>
                <p class="text-secondary mb-3">
                  You're ready to start using the OAuth Hub API! Check out the examples below to see how to 
                  implement the OAuth flow in your application.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Redirect URI Setup -->
        <section id="redirect-setup" class="card">
          <h2 class="text-2xl font-bold mb-4">🔗 Redirect URI Configuration</h2>
          <p class="text-secondary mb-4">
            When setting up your OAuth applications in each provider's console (Google Console, Facebook Developers, etc.), 
            you must configure the redirect URI to point to OAuth Hub's callback endpoint.
          </p>
          
          <div class="alert alert-warning mb-4">
            <span style="width: 20px; height: 20px;">${MODERN_ICONS.warning}</span>
            <span><strong>Important:</strong> Use this exact redirect URI in all OAuth provider consoles</span>
          </div>
          
          <div class="code-block-container mb-4">
            <button class="copy-button" onclick="copyToClipboard(this, 'https://oauth-hub.com/callback')">
              ${MODERN_ICONS.copy}
            </button>
            <pre class="code-block"><code>https://oauth-hub.com/callback</code></pre>
          </div>
          
          <h3 class="font-semibold mb-3">Provider-Specific Setup:</h3>
          <ul class="list-disc list-inside text-secondary space-y-2 mb-4">
            <li><strong>Google:</strong> Google Cloud Console → APIs & Services → Credentials → Authorized redirect URIs</li>
            <li><strong>Facebook:</strong> Facebook Developers → App Settings → Facebook Login → Valid OAuth Redirect URIs</li>
            <li><strong>GitHub:</strong> GitHub Settings → Developer settings → OAuth Apps → Authorization callback URL</li>
            <li><strong>Other platforms:</strong> Look for "Redirect URI", "Callback URL", or "Authorization callback URL" settings</li>
          </ul>
        </section>

        <!-- API Reference -->
        <section id="api-reference" class="card">
          <h2 class="text-2xl font-bold mb-4">API Reference</h2>
          <p class="text-secondary mb-4">
            All API requests must include your API key in the URL path. Keep your API keys secure and never expose them in client-side code.
          </p>
          
          <div class="mb-6">
            <h3 class="font-semibold mb-3">Base URL</h3>
            <div class="code-block-container">
              <button class="copy-button" onclick="copyToClipboard(this, 'https://oauth-hub.com')">
                ${MODERN_ICONS.copy}
              </button>
              <pre class="code-block"><code>https://oauth-hub.com</code></pre>
            </div>
          </div>
          
          <div class="alert alert-info mb-6">
            <span style="width: 20px; height: 20px;">${MODERN_ICONS.info}</span>
            <span>API keys should be kept confidential and stored securely in your backend.</span>
          </div>
          
          <div class="space-y-6">
            <!-- Consent Endpoint -->
            <div class="border rounded-lg p-4">
              <div class="flex items-center gap-3 mb-3">
                <span class="badge badge-primary">GET</span>
                <code class="text-sm">/consent/{platform}/{api_key}</code>
                <button class="copy-button-small" onclick="copyToClipboard(this, '/consent/{platform}/{api_key}')">
                  ${MODERN_ICONS.copy}
                </button>
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
                <button class="copy-button-small" onclick="copyToClipboard(this, '/token/{platform_user_id}/{api_key}')">
                  ${MODERN_ICONS.copy}
                </button>
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
        
        <!-- OAuth Consent Flow -->
        <section id="consent-flow" class="card">
          <h2 class="text-2xl font-bold mb-4">OAuth Consent Flow</h2>
          <p class="text-secondary mb-4">
            The consent flow allows your users to authorize access to their accounts on various platforms.
          </p>
          
          <h3 class="font-semibold mb-3">Step 1: Generate Consent URL</h3>
          <p class="text-secondary mb-3">Request a consent URL for the user to authorize access:</p>
          
          <div class="code-block-container mb-4">
            <button class="copy-button" onclick="copyToClipboard(this, \`GET /consent/{platform}/{api_key}

Response:
{
  \"consentURL\": \"https://accounts.google.com/o/oauth2/v2/auth?...\",
  \"Platform\": \"facebook\"
}\`)">
              ${MODERN_ICONS.copy}
            </button>
            <pre class="code-block"><code>GET /consent/{platform}/{api_key}

Response:
{
  "consentURL": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "Platform": "facebook"
}</code></pre>
          </div>
          
          <h3 class="font-semibold mb-3">Step 2: User Authorization</h3>
          <p class="text-secondary mb-3">Redirect the user to the consent URL or open it in a popup:</p>
          
          <div class="code-example-container mb-4">
            <div class="code-example-header">
              <div class="language-selector">
                <select onchange="switchLanguage(this, 'consent-example')">
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="go">Go</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="curl">cURL</option>
                </select>
              </div>
              <button class="copy-button" onclick="copyCodeExample('consent-example')">
                ${MODERN_ICONS.copy}
              </button>
            </div>
            <div class="code-examples" id="consent-example">
              <pre class="code-block active" data-lang="javascript"><code>// JavaScript Example
window.open(consentUrl, 'oauth-consent', 'width=500,height=600');</code></pre>
              <pre class="code-block" data-lang="python"><code># Python Example
import webbrowser
webbrowser.open(consent_url)</code></pre>
              <pre class="code-block" data-lang="php"><code><?php
// PHP Example
header("Location: " . $consentUrl);
exit();
?></code></pre>
              <pre class="code-block" data-lang="ruby"><code># Ruby Example
require 'launchy'
Launchy.open(consent_url)</code></pre>
              <pre class="code-block" data-lang="go"><code>// Go Example
package main

import (
    "os/exec"
    "runtime"
)

func openBrowser(url string) {
    var err error
    switch runtime.GOOS {
    case "linux":
        err = exec.Command("xdg-open", url).Start()
    case "windows":
        err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
    case "darwin":
        err = exec.Command("open", url).Start()
    }
}</code></pre>
              <pre class="code-block" data-lang="java"><code>// Java Example
import java.awt.Desktop;
import java.net.URI;

Desktop.getDesktop().browse(new URI(consentUrl));</code></pre>
              <pre class="code-block" data-lang="csharp"><code>// C# Example
using System.Diagnostics;

Process.Start(new ProcessStartInfo(consentUrl) { UseShellExecute = true });</code></pre>
              <pre class="code-block" data-lang="curl"><code># cURL Example
curl "https://oauth-hub.com/consent/google/your_api_key"</code></pre>
            </div>
          </div>
          
          <h3 class="font-semibold mb-3">Step 3: Handle Callback</h3>
          <p class="text-secondary mb-3">After authorization, the OAuth provider redirects to <code>https://oauth-hub.com/callback</code>. OAuth Hub processes this callback and communicates the results back to your application via postMessage:</p>
          
          <div class="code-block-container">
            <button class="copy-button" onclick="copyToClipboard(this, \`// Your application receives:
{
  \"platform\": \"google\",
  \"platformUserId\": \"user_12345\"
}

// Data flows directly to your app - no webhooks needed!\`)">
              ${MODERN_ICONS.copy}
            </button>
            <pre class="code-block"><code>// Your application receives:
{
  "platform": "google",
  "platformUserId": "user_12345"
}

// Data flows directly to your app - no webhooks needed!</code></pre>
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
          
          <div class="code-example-container mb-4">
            <div class="code-example-header">
              <div class="language-selector">
                <select onchange="switchLanguage(this, 'token-example')">
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="go">Go</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="curl">cURL</option>
                </select>
              </div>
              <button class="copy-button" onclick="copyCodeExample('token-example')">
                ${MODERN_ICONS.copy}
              </button>
            </div>
            <div class="code-examples" id="token-example">
              <pre class="code-block active" data-lang="javascript"><code>// JavaScript/Node.js
const response = await fetch(\`https://oauth-hub.com/token/\${platformUserId}/\${apiKey}\`);
const data = await response.json();
console.log('Access token:', data.access_token);</code></pre>
              <pre class="code-block" data-lang="python"><code># Python
import requests

response = requests.get(f'https://oauth-hub.com/token/{platform_user_id}/{api_key}')
data = response.json()
print('Access token:', data['access_token'])</code></pre>
              <pre class="code-block" data-lang="php"><code><?php
// PHP
$url = "https://oauth-hub.com/token/{$platformUserId}/{$apiKey}";
$response = file_get_contents($url);
$data = json_decode($response, true);
echo 'Access token: ' . $data['access_token'];
?></code></pre>
              <pre class="code-block" data-lang="ruby"><code># Ruby
require 'net/http'
require 'json'

uri = URI("https://oauth-hub.com/token/#{platform_user_id}/#{api_key}")
response = Net::HTTP.get_response(uri)
data = JSON.parse(response.body)
puts "Access token: #{data['access_token']}"</code></pre>
              <pre class="code-block" data-lang="go"><code>// Go
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
)

func getToken(platformUserId, apiKey string) {
    url := fmt.Sprintf("https://oauth-hub.com/token/%s/%s", platformUserId, apiKey)
    resp, err := http.Get(url)
    if err != nil {
        return
    }
    defer resp.Body.Close()
    
    body, _ := ioutil.ReadAll(resp.Body)
    var data map[string]interface{}
    json.Unmarshal(body, &data)
    fmt.Println("Access token:", data["access_token"])
}</code></pre>
              <pre class="code-block" data-lang="java"><code>// Java
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import com.google.gson.Gson;

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://oauth-hub.com/token/" + platformUserId + "/" + apiKey))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
Gson gson = new Gson();
TokenResponse data = gson.fromJson(response.body(), TokenResponse.class);</code></pre>
              <pre class="code-block" data-lang="csharp"><code>// C#
using System.Net.Http;
using System.Text.Json;

var client = new HttpClient();
var response = await client.GetAsync($"https://oauth-hub.com/token/{platformUserId}/{apiKey}");
var json = await response.Content.ReadAsStringAsync();
var data = JsonSerializer.Deserialize<TokenResponse>(json);
Console.WriteLine($"Access token: {data.access_token}");</code></pre>
              <pre class="code-block" data-lang="curl"><code># cURL
curl "https://oauth-hub.com/token/user_12345/your_api_key"</code></pre>
            </div>
          </div>
          
          <div class="code-block-container mb-4">
            <button class="copy-button" onclick="copyToClipboard(this, \`Response:
{
  \"access_token\": \"ya29.a0AfH6SMBx...\",
  \"token_type\": \"Bearer\",
  \"expires_in\": 3599
}\`)">
              ${MODERN_ICONS.copy}
            </button>
            <pre class="code-block"><code>Response:
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
        
        <!-- Complete Examples -->
        <section id="examples" class="card">
          <h2 class="text-2xl font-bold mb-4">Complete Integration Examples</h2>
          
          <div class="space-y-6">
            <div>
              <h3 class="font-semibold mb-3">Full OAuth Flow Implementation</h3>
              <div class="code-example-container">
                <div class="code-example-header">
                  <div class="language-selector">
                    <select onchange="switchLanguage(this, 'full-example')">
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="php">PHP</option>
                      <option value="ruby">Ruby</option>
                      <option value="go">Go</option>
                      <option value="java">Java</option>
                      <option value="csharp">C#</option>
                    </select>
                  </div>
                  <button class="copy-button" onclick="copyCodeExample('full-example')">
                    ${MODERN_ICONS.copy}
                  </button>
                </div>
                <div class="code-examples" id="full-example">
                  <pre class="code-block active" data-lang="javascript"><code>// JavaScript/Node.js - Complete OAuth Flow
const API_KEY = 'your_api_key_here';
const PLATFORM = 'google';

class OAuthHubClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://oauth-hub.com';
  }

  // Step 1: Generate consent URL
  async generateConsentUrl(platform) {
    const response = await fetch(\`\${this.baseUrl}/consent/\${platform}/\${this.apiKey}\`);
    const data = await response.json();
    return data.consentURL;
  }

  // Step 2: Open consent popup and handle callback
  async initiateOAuth(platform) {
    const consentUrl = await this.generateConsentUrl(platform);
    
    return new Promise((resolve, reject) => {
      const popup = window.open(consentUrl, 'oauth-consent', 'width=500,height=600');
      
      // Listen for postMessage from callback
      const messageHandler = (event) => {
        if (event.origin !== this.baseUrl) return;
        
        window.removeEventListener('message', messageHandler);
        popup.close();
        
        if (event.data.platform && event.data.platformUserId) {
          resolve(event.data);
        } else {
          reject(new Error('OAuth authorization failed'));
        }
      };
      
      window.addEventListener('message', messageHandler);
    });
  }

  // Step 3: Get access token
  async getAccessToken(platformUserId) {
    const response = await fetch(\`\${this.baseUrl}/token/\${platformUserId}/\${this.apiKey}\`);
    const data = await response.json();
    return data.access_token;
  }

  // Step 4: Use token to make API calls
  async makeApiCall(accessToken, apiUrl) {
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': \`Bearer \${accessToken}\`
      }
    });
    return response.json();
  }
}

// Usage Example
const oauthClient = new OAuthHubClient(API_KEY);

async function handleGoogleLogin() {
  try {
    // Initiate OAuth flow
    const result = await oauthClient.initiateOAuth('google');
    console.log('OAuth success:', result);
    
    // Get access token
    const accessToken = await oauthClient.getAccessToken(result.platformUserId);
    console.log('Access token:', accessToken);
    
    // Use token to get user info
    const userInfo = await oauthClient.makeApiCall(
      accessToken, 
      'https://www.googleapis.com/oauth2/v1/userinfo'
    );
    console.log('User info:', userInfo);
    
  } catch (error) {
    console.error('OAuth error:', error);
  }
}</code></pre>
                  <pre class="code-block" data-lang="python"><code># Python - Complete OAuth Flow
import requests
import webbrowser

class OAuthHubClient:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://oauth-hub.com'
    
    def generate_consent_url(self, platform):
        """Step 1: Generate consent URL"""
        response = requests.get(f'{self.base_url}/consent/{platform}/{self.api_key}')
        data = response.json()
        return data['consentURL']
    
    def initiate_oauth(self, platform):
        """Step 2: Open browser and handle callback"""
        consent_url = self.generate_consent_url(platform)
        
        # Open browser
        webbrowser.open(consent_url)
        
        # In a real application, you'd handle the callback
        platform_user_id = input("Enter the platform user ID from callback: ")
        return {'platform': platform, 'platformUserId': platform_user_id}
    
    def get_access_token(self, platform_user_id):
        """Step 3: Get access token"""
        response = requests.get(f'{self.base_url}/token/{platform_user_id}/{self.api_key}')
        data = response.json()
        return data['access_token']
    
    def make_api_call(self, access_token, api_url):
        """Step 4: Use token to make API calls"""
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(api_url, headers=headers)
        return response.json()

# Usage Example
API_KEY = 'your_api_key_here'
oauth_client = OAuthHubClient(API_KEY)

def handle_google_login():
    try:
        # Initiate OAuth flow
        result = oauth_client.initiate_oauth('google')
        print('OAuth success:', result)
        
        # Get access token
        access_token = oauth_client.get_access_token(result['platformUserId'])
        print('Access token:', access_token)
        
        # Use token to get user info
        user_info = oauth_client.make_api_call(
            access_token, 
            'https://www.googleapis.com/oauth2/v1/userinfo'
        )
        print('User info:', user_info)
        
    except Exception as error:
        print('OAuth error:', error)

# Run the example
handle_google_login()</code></pre>
                  <pre class="code-block" data-lang="php"><code><?php
// PHP - Complete OAuth Flow
class OAuthHubClient {
    private $apiKey;
    private $baseUrl = 'https://oauth-hub.com';
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }
    
    // Step 1: Generate consent URL
    public function generateConsentUrl($platform) {
        $url = "{$this->baseUrl}/consent/{$platform}/{$this->apiKey}";
        $response = file_get_contents($url);
        $data = json_decode($response, true);
        return $data['consentURL'];
    }
    
    // Step 2: Redirect to consent URL
    public function initiateOAuth($platform) {
        $consentUrl = $this->generateConsentUrl($platform);
        header("Location: " . $consentUrl);
        exit();
    }
    
    // Step 3: Get access token
    public function getAccessToken($platformUserId) {
        $url = "{$this->baseUrl}/token/{$platformUserId}/{$this->apiKey}";
        $response = file_get_contents($url);
        $data = json_decode($response, true);
        return $data['access_token'];
    }
    
    // Step 4: Use token to make API calls
    public function makeApiCall($accessToken, $apiUrl) {
        $context = stream_context_create([
            'http' => [
                'header' => "Authorization: Bearer {$accessToken}\\r\\n"
            ]
        ]);
        $response = file_get_contents($apiUrl, false, $context);
        return json_decode($response, true);
    }
}

// Usage Example
$apiKey = 'your_api_key_here';
$oauthClient = new OAuthHubClient($apiKey);

function handleGoogleLogin($oauthClient) {
    try {
        // In a real application, you'd handle the callback properly
        $platformUserId = $_GET['platform_user_id'] ?? null;
        
        if (!$platformUserId) {
            // Initiate OAuth flow
            $oauthClient->initiateOAuth('google');
        } else {
            // Get access token
            $accessToken = $oauthClient->getAccessToken($platformUserId);
            echo "Access token: " . $accessToken . "\\n";
            
            // Use token to get user info
            $userInfo = $oauthClient->makeApiCall(
                $accessToken, 
                'https://www.googleapis.com/oauth2/v1/userinfo'
            );
            echo "User info: " . json_encode($userInfo) . "\\n";
        }
        
    } catch (Exception $error) {
        echo "OAuth error: " . $error->getMessage() . "\\n";
    }
}

// Run the example
handleGoogleLogin($oauthClient);
?></code></pre>
                  <pre class="code-block" data-lang="ruby"><code># Ruby - Complete OAuth Flow
require 'net/http'
require 'json'
require 'launchy'

class OAuthHubClient
  def initialize(api_key)
    @api_key = api_key
    @base_url = 'https://oauth-hub.com'
  end
  
  # Step 1: Generate consent URL
  def generate_consent_url(platform)
    uri = URI("#{@base_url}/consent/#{platform}/#{@api_key}")
    response = Net::HTTP.get_response(uri)
    data = JSON.parse(response.body)
    data['consentURL']
  end
  
  # Step 2: Open browser and handle callback
  def initiate_oauth(platform)
    consent_url = generate_consent_url(platform)
    
    # Open browser
    Launchy.open(consent_url)
    
    # In a real application, you'd handle the callback
    print "Enter the platform user ID from callback: "
    platform_user_id = gets.chomp
    
    { 'platform' => platform, 'platformUserId' => platform_user_id }
  end
  
  # Step 3: Get access token
  def get_access_token(platform_user_id)
    uri = URI("#{@base_url}/token/#{platform_user_id}/#{@api_key}")
    response = Net::HTTP.get_response(uri)
    data = JSON.parse(response.body)
    data['access_token']
  end
  
  # Step 4: Use token to make API calls
  def make_api_call(access_token, api_url)
    uri = URI(api_url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    
    request = Net::HTTP::Get.new(uri)
    request['Authorization'] = "Bearer #{access_token}"
    
    response = http.request(request)
    JSON.parse(response.body)
  end
end

# Usage Example
API_KEY = 'your_api_key_here'
oauth_client = OAuthHubClient.new(API_KEY)

def handle_google_login(oauth_client)
  begin
    # Initiate OAuth flow
    result = oauth_client.initiate_oauth('google')
    puts "OAuth success: #{result}"
    
    # Get access token
    access_token = oauth_client.get_access_token(result['platformUserId'])
    puts "Access token: #{access_token}"
    
    # Use token to get user info
    user_info = oauth_client.make_api_call(
      access_token, 
      'https://www.googleapis.com/oauth2/v1/userinfo'
    )
    puts "User info: #{user_info}"
    
  rescue => error
    puts "OAuth error: #{error.message}"
  end
end

# Run the example
handle_google_login(oauth_client)</code></pre>
                  <pre class="code-block" data-lang="go"><code>// Go - Complete OAuth Flow
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "os/exec"
    "runtime"
)

type OAuthHubClient struct {
    APIKey  string
    BaseURL string
}

type ConsentResponse struct {
    ConsentURL string \`json:"consentURL"\`
    Platform   string \`json:"Platform"\`
}

type TokenResponse struct {
    AccessToken string \`json:"access_token"\`
    TokenType   string \`json:"token_type"\`
    ExpiresIn   int    \`json:"expires_in"\`
}

func NewOAuthHubClient(apiKey string) *OAuthHubClient {
    return &OAuthHubClient{
        APIKey:  apiKey,
        BaseURL: "https://oauth-hub.com",
    }
}

// Step 1: Generate consent URL
func (c *OAuthHubClient) GenerateConsentURL(platform string) (string, error) {
    url := fmt.Sprintf("%s/consent/%s/%s", c.BaseURL, platform, c.APIKey)
    resp, err := http.Get(url)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()
    
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return "", err
    }
    
    var consentResp ConsentResponse
    err = json.Unmarshal(body, &consentResp)
    if err != nil {
        return "", err
    }
    
    return consentResp.ConsentURL, nil
}

// Step 2: Open browser
func (c *OAuthHubClient) openBrowser(url string) error {
    var err error
    switch runtime.GOOS {
    case "linux":
        err = exec.Command("xdg-open", url).Start()
    case "windows":
        err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
    case "darwin":
        err = exec.Command("open", url).Start()
    }
    return err
}

// Step 3: Get access token
func (c *OAuthHubClient) GetAccessToken(platformUserID string) (string, error) {
    url := fmt.Sprintf("%s/token/%s/%s", c.BaseURL, platformUserID, c.APIKey)
    resp, err := http.Get(url)
    if err != nil {
        return "", err
    }
    defer resp.Body.Close()
    
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return "", err
    }
    
    var tokenResp TokenResponse
    err = json.Unmarshal(body, &tokenResp)
    if err != nil {
        return "", err
    }
    
    return tokenResp.AccessToken, nil
}

func main() {
    apiKey := "your_api_key_here"
    client := NewOAuthHubClient(apiKey)
    
    // Generate consent URL
    consentURL, err := client.GenerateConsentURL("google")
    if err != nil {
        fmt.Printf("Error generating consent URL: %v\\n", err)
        return
    }
    
    // Open browser
    err = client.openBrowser(consentURL)
    if err != nil {
        fmt.Printf("Error opening browser: %v\\n", err)
        return
    }
    
    // In a real application, you'd handle the callback
    fmt.Print("Enter the platform user ID from callback: ")
    var platformUserID string
    fmt.Scanln(&platformUserID)
    
    // Get access token
    accessToken, err := client.GetAccessToken(platformUserID)
    if err != nil {
        fmt.Printf("Error getting access token: %v\\n", err)
        return
    }
    
    fmt.Printf("Access token: %s\\n", accessToken)
}</code></pre>
                  <pre class="code-block" data-lang="java"><code>// Java - Complete OAuth Flow
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.awt.Desktop;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class OAuthHubClient {
    private String apiKey;
    private String baseUrl = "https://oauth-hub.com";
    private HttpClient client;
    private Gson gson;
    
    public OAuthHubClient(String apiKey) {
        this.apiKey = apiKey;
        this.client = HttpClient.newHttpClient();
        this.gson = new Gson();
    }
    
    // Step 1: Generate consent URL
    public String generateConsentUrl(String platform) throws Exception {
        String url = String.format("%s/consent/%s/%s", baseUrl, platform, apiKey);
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .build();
            
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JsonObject jsonResponse = gson.fromJson(response.body(), JsonObject.class);
        return jsonResponse.get("consentURL").getAsString();
    }
    
    // Step 2: Open browser
    public void openBrowser(String url) throws Exception {
        Desktop.getDesktop().browse(new URI(url));
    }
    
    // Step 3: Get access token
    public String getAccessToken(String platformUserId) throws Exception {
        String url = String.format("%s/token/%s/%s", baseUrl, platformUserId, apiKey);
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(url))
            .build();
            
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JsonObject jsonResponse = gson.fromJson(response.body(), JsonObject.class);
        return jsonResponse.get("access_token").getAsString();
    }
    
    public static void main(String[] args) {
        try {
            String apiKey = "your_api_key_here";
            OAuthHubClient oauthClient = new OAuthHubClient(apiKey);
            
            // Generate consent URL
            String consentUrl = oauthClient.generateConsentUrl("google");
            System.out.println("Consent URL: " + consentUrl);
            
            // Open browser
            oauthClient.openBrowser(consentUrl);
            
            // In a real application, you'd handle the callback
            System.out.print("Enter the platform user ID from callback: ");
            java.util.Scanner scanner = new java.util.Scanner(System.in);
            String platformUserId = scanner.nextLine();
            
            // Get access token
            String accessToken = oauthClient.getAccessToken(platformUserId);
            System.out.println("Access token: " + accessToken);
            
        } catch (Exception e) {
            System.err.println("OAuth error: " + e.getMessage());
        }
    }
}</code></pre>
                  <pre class="code-block" data-lang="csharp"><code>// C# - Complete OAuth Flow
using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Diagnostics;
using Newtonsoft.Json.Linq;

public class OAuthHubClient
{
    private readonly string apiKey;
    private readonly string baseUrl = "https://oauth-hub.com";
    private readonly HttpClient client;
    
    public OAuthHubClient(string apiKey)
    {
        this.apiKey = apiKey;
        this.client = new HttpClient();
    }
    
    // Step 1: Generate consent URL
    public async Task<string> GenerateConsentUrlAsync(string platform)
    {
        var url = $"{baseUrl}/consent/{platform}/{apiKey}";
        var response = await client.GetStringAsync(url);
        var json = JObject.Parse(response);
        return json["consentURL"].ToString();
    }
    
    // Step 2: Open browser
    public void OpenBrowser(string url)
    {
        Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
    }
    
    // Step 3: Get access token
    public async Task<string> GetAccessTokenAsync(string platformUserId)
    {
        var url = $"{baseUrl}/token/{platformUserId}/{apiKey}";
        var response = await client.GetStringAsync(url);
        var json = JObject.Parse(response);
        return json["access_token"].ToString();
    }
    
    public static async Task Main(string[] args)
    {
        try
        {
            var apiKey = "your_api_key_here";
            var oauthClient = new OAuthHubClient(apiKey);
            
            // Generate consent URL
            var consentUrl = await oauthClient.GenerateConsentUrlAsync("google");
            Console.WriteLine($"Consent URL: {consentUrl}");
            
            // Open browser
            oauthClient.OpenBrowser(consentUrl);
            
            // In a real application, you'd handle the callback
            Console.Write("Enter the platform user ID from callback: ");
            var platformUserId = Console.ReadLine();
            
            // Get access token
            var accessToken = await oauthClient.GetAccessTokenAsync(platformUserId);
            Console.WriteLine($"Access token: {accessToken}");
            
        }
        catch (Exception ex)
        {
            Console.WriteLine($"OAuth error: {ex.Message}");
        }
    }
}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Supported Platforms -->
        <section id="supported-platforms" class="card">
          <h2 class="text-2xl font-bold mb-4">Supported Platforms</h2>
          <p class="text-secondary mb-4">
            OAuth Hub supports 37+ major platforms with comprehensive scope management.
          </p>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div class="platform-card">Google</div>
            <div class="platform-card">Facebook</div>
            <div class="platform-card">GitHub</div>
            <div class="platform-card">Twitter/X</div>
            <div class="platform-card">LinkedIn</div>
            <div class="platform-card">TikTok</div>
            <div class="platform-card">Discord</div>
            <div class="platform-card">Pinterest</div>
            <div class="platform-card">WordPress</div>
            <div class="platform-card">Reddit</div>
            <div class="platform-card">Spotify</div>
            <div class="platform-card">Twitch</div>
            <div class="platform-card">Slack</div>
            <div class="platform-card">Microsoft</div>
            <div class="platform-card">Apple</div>
            <div class="platform-card">Amazon</div>
            <div class="platform-card">Shopify</div>
            <div class="platform-card">Stripe</div>
            <div class="platform-card">PayPal</div>
            <div class="platform-card">Salesforce</div>
            <div class="platform-card">HubSpot</div>
            <div class="platform-card">Mailchimp</div>
            <div class="platform-card">Zoom</div>
            <div class="platform-card">Trello</div>
            <div class="platform-card">Asana</div>
            <div class="platform-card">Notion</div>
            <div class="platform-card">Adobe</div>
            <div class="platform-card">Figma</div>
            <div class="platform-card">Canva</div>
            <div class="platform-card">Dribbble</div>
            <div class="platform-card">Unsplash</div>
            <div class="platform-card">Dropbox</div>
            <div class="platform-card">Box</div>
            <div class="platform-card">Netflix</div>
            <div class="platform-card">Steam</div>
            <div class="platform-card">Coinbase</div>
            <div class="platform-card">+ More</div>
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
      .nav-pill {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-2) var(--space-4);
        background: var(--bg-secondary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-full);
        text-decoration: none;
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-weight: 500;
        transition: all var(--transition-fast);
        white-space: nowrap;
      }
      
      .nav-pill:hover {
        background: var(--brand-accent);
        color: white;
        border-color: var(--brand-accent);
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
      }
      
      .nav-pill svg {
        flex-shrink: 0;
        opacity: 0.7;
        transition: opacity var(--transition-fast);
      }
      
      .nav-pill:hover svg {
        opacity: 1;
      }
      
      .text-brand-accent {
        color: var(--brand-accent);
      }
      
      /* OpenAI-Style Code Blocks */
      .code-block-container {
        position: relative;
        background: var(--bg-tertiary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-md);
        margin-bottom: var(--space-4);
      }
      
      .code-example-container {
        position: relative;
        background: var(--bg-tertiary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-md);
        margin-bottom: var(--space-4);
      }
      
      .code-example-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-3) var(--space-4);
        border-bottom: 1px solid var(--border-light);
        background: var(--bg-secondary);
        border-radius: var(--radius-md) var(--radius-md) 0 0;
      }
      
      .language-selector select {
        background: var(--bg-primary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-sm);
        padding: var(--space-1) var(--space-2);
        color: var(--text-primary);
        font-size: 0.875rem;
        cursor: pointer;
      }
      
      .language-selector select:focus {
        outline: none;
        border-color: var(--brand-accent);
      }
      
      .copy-button, .copy-button-small {
        position: absolute;
        top: var(--space-3);
        right: var(--space-3);
        background: var(--bg-secondary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-sm);
        padding: var(--space-2);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all var(--transition-fast);
        z-index: 10;
      }
      
      .copy-button-small {
        position: relative;
        top: auto;
        right: auto;
        padding: var(--space-1);
        margin-left: var(--space-2);
      }
      
      .copy-button:hover, .copy-button-small:hover {
        background: var(--brand-accent);
        color: white;
        border-color: var(--brand-accent);
      }
      
      .copy-button svg, .copy-button-small svg {
        width: 16px;
        height: 16px;
      }
      
      .code-block {
        padding: var(--space-4);
        margin: 0;
        font-family: var(--font-mono);
        font-size: 0.875rem;
        line-height: 1.6;
        color: var(--text-primary);
        background: transparent;
        overflow-x: auto;
      }
      
      .code-examples {
        position: relative;
      }
      
      .code-examples .code-block {
        display: none;
      }
      
      .code-examples .code-block.active {
        display: block;
      }
      
      .code-block code {
        color: inherit;
        font-family: inherit;
      }
      
      /* Platform Cards */
      .platform-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-md);
        padding: var(--space-3);
        text-align: center;
        font-weight: 500;
        color: var(--text-primary);
        transition: all var(--transition-fast);
        cursor: default;
      }
      
      .platform-card:hover {
        background: var(--brand-accent);
        color: white;
        border-color: var(--brand-accent);
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }
      
      /* Responsive navigation fixes */
      .nav-pill {
        flex-shrink: 0;
        min-width: fit-content;
      }
      
      .nav-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        scrollbar-color: var(--border-dark) transparent;
      }
      
      .nav-container::-webkit-scrollbar {
        height: 6px;
      }
      
      .nav-container::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .nav-container::-webkit-scrollbar-thumb {
        background: var(--border-dark);
        border-radius: 3px;
      }
      
      /* Responsive adjustments */
      @media (max-width: 768px) {
        .nav-pill {
          font-size: 0.75rem;
          padding: var(--space-1) var(--space-3);
          gap: var(--space-1);
        }
        
        .nav-pill svg {
          width: 14px;
          height: 14px;
        }
        
        .code-example-header {
          flex-direction: column;
          gap: var(--space-2);
          align-items: stretch;
        }
        
        .copy-button {
          position: relative;
          top: auto;
          right: auto;
          align-self: flex-end;
        }
      }
      
      .main-content {
        overflow-x: hidden;
        box-sizing: border-box;
      }
      
      .card {
        overflow-x: auto;
        box-sizing: border-box;
        max-width: 100%;
      }
      
      .nav-container {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }
      
      .nav-container .flex {
        min-width: 0;
        flex-wrap: wrap;
      }
      
      @media (max-width: 1200px) {
        .main-content {
          padding: var(--space-4);
        }
      }
      
      @media (max-width: 768px) {
        .main-content {
          padding: var(--space-3);
        }
        
        .card {
          padding: var(--space-4);
        }
        
        .nav-container .flex {
          gap: var(--space-1);
        }
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
      
      .alert-warning {
        background: rgba(255, 149, 0, 0.1);
        border: 1px solid rgba(255, 149, 0, 0.2);
        color: var(--text-primary);
      }
      
      .text-2xl {
        font-size: 1.5rem;
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
      
      .grid {
        display: grid;
      }
      
      .grid-cols-2 {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .gap-4 {
        gap: var(--space-4);
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
      }
      
      /* Copy success animation */
      .copy-success {
        background: var(--success-color) !important;
        color: white !important;
        border-color: var(--success-color) !important;
      }
      
      @keyframes copySuccess {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      
      .copy-success {
        animation: copySuccess 0.3s ease;
      }
    </style>
</head>
<body>
    ${getModernLayout('docs', 'Documentation', content)}
    
    ${getClientAuthScript()}
    ${getModernScripts()}
    
    <script>
      // Copy to clipboard functionality
      async function copyToClipboard(button, text) {
        try {
          await navigator.clipboard.writeText(text);
          
          // Visual feedback
          const originalContent = button.innerHTML;
          button.innerHTML = '${MODERN_ICONS.check}';
          button.classList.add('copy-success');
          
          setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove('copy-success');
          }, 2000);
          
        } catch (err) {
          console.error('Failed to copy text: ', err);
          
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          
          // Visual feedback
          const originalContent = button.innerHTML;
          button.innerHTML = '${MODERN_ICONS.check}';
          button.classList.add('copy-success');
          
          setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove('copy-success');
          }, 2000);
        }
      }
      
      // Copy code example functionality
      function copyCodeExample(containerId) {
        const container = document.getElementById(containerId);
        const activeBlock = container.querySelector('.code-block.active');
        const button = container.parentElement.querySelector('.copy-button');
        
        if (activeBlock) {
          const text = activeBlock.textContent;
          copyToClipboard(button, text);
        }
      }
      
      // Language switcher functionality
      function switchLanguage(select, containerId) {
        const container = document.getElementById(containerId);
        const selectedLang = select.value;
        
        // Hide all code blocks
        container.querySelectorAll('.code-block').forEach(block => {
          block.classList.remove('active');
        });
        
        // Show selected language block
        const targetBlock = container.querySelector(\`[data-lang="\${selectedLang}"]\`);
        if (targetBlock) {
          targetBlock.classList.add('active');
        }
      }
      
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
