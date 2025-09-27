# OAuth Hub - Complete Modular Platform

A comprehensive, modular OAuth management platform built with **Cloudflare Workers** (UI/API proxy) and **Node.js/Express** (OAuth2 backend via `@node-oauth/oauth2-server`). Features modern UI, user authentication, API key management, OAuth app credentials, and complete OAuth flow handling for 37+ platforms. Now supports full OAuth2.1 compliance, client registration, token introspection, and revocation.

## 🚀 Live URL
https://oauth-hub.com

## 🔄 Auto-Deployment
✅ **GitHub Actions Enabled** - Automatic deployment on every push to main branch!

## 📁 Project Structure

```
oauth-worker/
├── src/                           # Cloudflare Workers (UI/API proxy)
│   ├── index.js                   # Workers entry point
│   ├── core/                      # Platform configurations
│   │   └── platforms/             # 37+ OAuth platform configs
│   ├── ui/                        # User interface
│   │   ├── pages/                 # UI components
│   │   ├── navigation.js          # Navigation
│   │   └── styles.js              # CSS design system
│   └── lib/                       # Shared utilities
│       ├── auth/                  # Auth helpers
│       └── utils/                 # Common helpers
├── server.js                      # Node.js Express OAuth2 backend
├── models/                        # OAuth2 server models
│   └── oauth-model.js             # Storage & logic for oauth2-server
├── wrangler.toml                  # Cloudflare Workers config
├── package.json                   # Node.js dependencies
└── README.md                      # This file
```

## ✨ Features

### 🔐 **Modern Authentication System**
- **Multiple Login Methods**: Email/password, Google OAuth, GitHub OAuth
- **Profile Pictures**: Automatic profile picture from OAuth providers
- **Secure Sessions**: JWT-based session management with HttpOnly cookies
- **User Profiles**: Rich user profiles with OAuth provider data

### 🔑 **Advanced API Key Management**
- **Multiple Keys**: Generate unlimited API keys per user
- **Named Keys**: Organize keys with custom names
- **Secure Storage**: Keys stored with O(1) lookup patterns
- **Instant Actions**: Copy, delete, and manage keys seamlessly

### 📱 **Comprehensive OAuth Platform Support**
- **37+ Platforms**: Support for major OAuth providers
- **Smart Scopes**: Platform-specific scope management with search/filter
- **Auto-Configuration**: Required scopes automatically included
- **Professional UI**: Sleek modal-based app management

### 🎨 **Modern User Interface**
- **Tesla/Apple Inspired**: Clean, professional, modern design
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark Theme**: Elegant dark theme throughout
- **Sidebar Navigation**: Collapsible sidebar with icons and profile section

### 📖 **Complete API Documentation**
- **Interactive Docs**: Live API reference with examples
- **Multiple Languages**: Code examples in JavaScript and Python
- **Real-time Testing**: Test endpoints directly from docs

### 📊 **Advanced Analytics & Monitoring**
- **Real-time Data**: Live API usage statistics
- **Platform Distribution**: Visual breakdown of OAuth platform usage
- **Token Management**: Monitor active tokens and refresh status
- **Success Rates**: Track OAuth flow success metrics

### ⚡ **Full OAuth2.1 Backend (NEW)**
- **OAuth2 Server**: Complete `@node-oauth/oauth2-server` implementation
- **PKCE Support**: Proof Key for Code Exchange for enhanced security
- **Client Registration**: Dynamic client registration (RFC 7591)
- **Token Introspection**: Validate active tokens (`/oauth/introspect`)
- **Token Revocation**: Revoke access/refresh tokens (`/oauth/revoke`)
- **Auto-Discovery**: OAuth metadata endpoint (RFC 8414)
- **Backward Compatible**: Original consent/tokens endpoints preserved
- **Database Ready**: Models designed for Oracle DB migration

## 🛠️ Development

### **Cloudflare Workers (UI/API Proxy)**
```bash
# Run Workers locally (UI/API proxy)
npx wrangler dev
# Deploy to Cloudflare
npx wrangler deploy
```

### **Node.js OAuth2 Backend**
```bash
# Install dependencies (includes oauth2-server)
npm install

# Run OAuth2 backend locally
npm start
# Or with auto-reload
npm run dev:node

# Deploy to Oracle Cloud
npm run deploy:oci
```

## 🔄 Complete OAuth Flow - Direct & Simple!

### 1. **User Setup**
1. Sign up or log in (email/password, Google, or GitHub)
2. Generate an API key for your application
3. Add OAuth app credentials for each platform you want to support

### 2. **Direct OAuth Flow**

#### ✨ Simple Implementation
```javascript
// Get platform user ID & tokens instantly!
const result = await connectSocial('facebook', 'sk_your_api_key');

console.log('Facebook User ID:', result.platformUserId);
console.log('Access Token:', result.tokens.accessToken);
```

#### 🔧 Helper Function
```javascript
function connectSocial(platform, apiKey) {
  return new Promise((resolve, reject) => {
    // 1. Get consent URL from OAuth Hub
    fetch(`https://oauth-hub.com/consent/${platform}/${apiKey}`)
      .then(res => res.json())
      .then(data => {
        // 2. Open OAuth popup
        const popup = window.open(data.consentUrl, 'oauth', 'width=500,height=600');

        // 3. Listen for completion
        const messageHandler = (event) => {
          if (event.data.type === 'oauth_complete') {
            window.removeEventListener('message', messageHandler);
            popup.close();

            // 4. You get everything instantly!
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
}
```

#### ⚛️ React Example
```javascript
import { useState } from 'react';

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

// Usage
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
};
```

### 3. **Token Management**
```javascript
// Get user's tokens later (auto-refreshes if expired)
GET https://oauth-hub.com/tokens/{platformUserId}/{apiKey}

// Manual token refresh
POST https://oauth-hub.com/refresh/{platformUserId}/{apiKey}
```

## 🌐 Supported Platforms (37 Total)

### **🇺🇸 Tier 1 American Platforms**
| Platform | Status | Features |
|----------|--------|----------|
| **Google** | ✅ Ready | YouTube, Drive, Gmail, Analytics APIs |
| **Facebook** | ✅ Ready | Graph API, Pages, Posts, Marketing |
| **Instagram** | ✅ Ready | Basic Display API, Media, Stories |
| **Twitter/X** | ✅ Ready | API v2, Tweets, Users, Spaces |
| **LinkedIn** | ✅ Ready | Profile, Company, Marketing APIs |
| **Apple** | ✅ Ready | Sign in with Apple, App Store Connect |
| **Microsoft** | ✅ Ready | Graph API, Office 365, Azure AD |

### **🏢 Business & Productivity**
| Platform | Status | Features |
|----------|--------|----------|
| **Salesforce** | ✅ Ready | CRM APIs, Custom Objects |
| **HubSpot** | ✅ Ready | CRM, Marketing, Sales APIs |
| **Zoom** | ✅ Ready | Meetings, Webinars, Phone APIs |
| **Slack** | ✅ Ready | Workspace APIs, Bot Integration |
| **Trello** | ✅ Ready | Boards, Cards, Lists APIs |
| **Asana** | ✅ Ready | Tasks, Projects, Teams APIs |
| **Notion** | ✅ Ready | Pages, Databases, Blocks APIs |

### **🎨 Creative & Design**
| Platform | Status | Features |
|----------|--------|----------|
| **Adobe** | ✅ Ready | Creative SDK, Document APIs |
| **Figma** | ✅ Ready | Design Files, Comments, Teams |
| **Canva** | ✅ Ready | Design APIs, Templates |
| **Dribbble** | ✅ Ready | Shots, Users, Teams APIs |
| **Unsplash** | ✅ Ready | Photos, Collections APIs |

### **🛒 E-commerce & Payments**
| Platform | Status | Features |
|----------|--------|----------|
| **Amazon** | ✅ Ready | Advertising API, Seller Central |
| **Shopify** | ✅ Ready | Admin API, Storefront API |
| **Stripe** | ✅ Ready | Payments, Connect, Billing |
| **PayPal** | ✅ Ready | Payments, Subscriptions APIs |

### **☁️ Cloud & Storage**
| Platform | Status | Features |
|----------|--------|----------|
| **Dropbox** | ✅ Ready | Files, Sharing, Paper APIs |
| **Box** | ✅ Ready | Content Management APIs |

### **🎮 Gaming & Entertainment**
| Platform | Status | Features |
|----------|--------|----------|
| **Steam** | ✅ Ready | OpenID, User Stats, Games |
| **Netflix** | ✅ Ready | Content APIs (Partner Only) |
| **Twitch** | ✅ Ready | Streams, Chat, Games APIs |
| **Discord** | ✅ Ready | Bot APIs, User Data, Guilds |
| **Spotify** | ✅ Ready | Music, Playlists, User Data |

### **📱 Social & Communication**
| Platform | Status | Features |
|----------|--------|----------|
| **TikTok** | ✅ Ready | For Developers API, Videos |
| **Pinterest** | ✅ Ready | Boards, Pins, Analytics APIs |
| **Reddit** | ✅ Ready | Posts, Comments, User APIs |
| **WordPress** | ✅ Ready | Posts, Media, Comments APIs |

### **💰 Cryptocurrency & Finance**
| Platform | Status | Features |
|----------|--------|----------|
| **Coinbase** | ✅ Ready | Wallet APIs, Trading, Users |

### **📧 Email & Marketing**
| Platform | Status | Features |
|----------|--------|----------|
| **Mailchimp** | ✅ Ready | Campaigns, Lists, Automation |

## 📝 Architecture

- **🏗️ Dual Architecture**: Cloudflare Workers (UI/API proxy) + Node.js/Express (OAuth2 backend)
- **🔐 Full OAuth2.1 Compliance**: `@node-oauth/oauth2-server` with PKCE, introspection, revocation
- **⚡ Edge Performance**: Workers for global UI/API proxy, Express for OAuth logic
- **🎨 Modern UI/UX**: Tesla/Apple-inspired design with responsive layouts
- **📱 Mobile-First**: Optimized for all screen sizes and devices
- **🔄 Real-time Updates**: Live data updates without page refreshes
- **🗄️ Database Ready**: Models designed for Oracle DB migration (production)
- **🔒 Backward Compatible**: Original endpoints preserved for existing developers

## 🚦 Current Status

✅ **Production Ready**:
- ✅ Modern authentication system (email, Google, GitHub OAuth)
- ✅ Advanced API key management with scalable storage
- ✅ Comprehensive OAuth platform support (37 platforms)
- ✅ Professional UI with Tesla/Apple-inspired design
- ✅ Complete API documentation with interactive examples
- ✅ Real-time analytics and monitoring dashboard
- ✅ Responsive design for all devices
- ✅ Secure session management and profile system
- ✅ OAuth consent flow with postMessage integration
- ✅ Automatic token refresh and management
- ✅ Scalable KV storage architecture

✅ **OAuth2.1 Backend Features (NEW)**:
- ✅ Full `@node-oauth/oauth2-server` implementation
- ✅ PKCE (Proof Key for Code Exchange) support
- ✅ Dynamic client registration (RFC 7591)
- ✅ Token introspection and revocation
- ✅ OAuth auto-discovery metadata (RFC 8414)
- ✅ Backward compatible consent/tokens endpoints
- ✅ Database-ready models for Oracle Cloud

✅ **Enterprise Features**:
- ✅ Multi-platform OAuth support
- ✅ Comprehensive scope management
- ✅ Real-time usage analytics
- ✅ Professional admin interface
- ✅ Secure API key system
- ✅ Modern responsive UI

## 🔧 API Endpoints

### **OAuth2 Standard Endpoints (NEW)**
- `GET /oauth/authorize` - Authorization endpoint (PKCE, scopes, state)
- `POST /oauth/token` - Token exchange (code, refresh, client_credentials)
- `POST /oauth/register` - Client registration (RFC 7591)
- `POST /oauth/introspect` - Token introspection (validate active tokens)
- `POST /oauth/revoke` - Token revocation (revoke access/refresh tokens)
- `GET /.well-known/oauth-authorization-server` - Auto-discovery metadata

### **Backward Compatible Endpoints**
- `GET /consent/{platform}/{apiKey}` - Generate consent URL (maps to /oauth/authorize)
- `GET /tokens/{platformUserId}/{apiKey}` - Get user tokens (maps to custom retrieval)
- `POST /refresh/{platformUserId}/{apiKey}` - Refresh tokens (uses oauth2-server)

### **Legacy Authentication** (Cloudflare Workers)
- `POST /auth` - User login/signup
- `POST /google-auth` - Google OAuth login
- `POST /github-auth` - GitHub OAuth login
- `GET /validate-session` - Session validation

### **API Keys** (Cloudflare Workers)
- `POST /generate-key` - Generate new API key
- `GET /user-keys` - List user's API keys
- `DELETE /delete-key/{keyId}` - Delete API key

### **OAuth Apps** (Cloudflare Workers)
- `POST /save-app` - Save OAuth app credentials
- `GET /user-apps` - List user's OAuth apps
- `DELETE /delete-app/{platform}` - Delete OAuth app

### **System**
- `GET /health` - System health check
- `GET /docs` - API documentation

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ using Cloudflare Workers, modern web technologies, and a focus on developer experience.**