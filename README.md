# OAuth Hub - Complete OAuth2 Provider Backend

A comprehensive OAuth2 authorization server built with Node.js and oauth2-server. Provides developers with standardized consent and token endpoints for seamless integration with 37+ OAuth platforms.

## 🚀 Architecture

- **Backend**: Node.js + Express + oauth2-server (RFC 6749/OAuth2.1 compliant)
- **Frontend**: Server-side rendered UI with modern components
- **Database**: Oracle Autonomous Database (production) / In-memory (development)
- **Deployment**: Oracle Cloud Infrastructure (OCI) with Docker/Kubernetes

## 🔄 Auto-Deployment
✅ **GitHub Actions Enabled** - Automatic deployment to Oracle Cloud on every push to main branch!

## 📁 Project Structure

```
oauth-hub/
├── server.js                       # Main Express server with oauth2-server
├── models/
│   └── oauth-model.js              # OAuth2 storage model (tokens, clients, users)
├── src/                            # Core application code
│   ├── core/
│   │   └── platforms/              # 37+ OAuth platform configurations
│   ├── ui/                         # Server-side rendered UI components
│   │   ├── pages/                  # Page components (dashboard, settings, etc.)
│   │   ├── navigation.js           # Navigation and layout
│   │   └── styles.js               # CSS and theming
│   └── lib/                        # Utilities and services
├── Dockerfile                      # Oracle Cloud deployment
├── deploy-to-oracle.sh             # Oracle deployment script
├── .env                            # Environment configuration
├── package.json                    # Node.js dependencies
└── README.md                       # This file
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

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Deploy to Oracle Cloud
./deploy-to-oracle.sh
```

## 🚀 Oracle Cloud Deployment

### Prerequisites
- Oracle Cloud server (Compute instance) with SSH access
- Node.js installed on the server
- PM2 process manager (recommended)

### Environment Variables (set on server)
```bash
DATABASE_URL=your_oracle_database_connection_string
NODE_ENV=production
PORT=3000
```

### GitHub Secrets (already configured)
```
CRM_SERVER_IP=your_oracle_server_ip
CRM_SERVER_USER=your_ssh_username
CRM_SERVER_SSH_PRIVATE_KEY=your_ssh_private_key
CRM_DATABASE_URL=your_database_connection_string
```

### Deployment Process
1. **Automatic**: GitHub Actions deploys on every push to main
2. **SSH Connection**: Connects to your Oracle server
3. **Code Update**: Pulls latest changes and installs dependencies
4. **App Restart**: Uses PM2 to restart the application

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

- **🏗️ Modular Design**: Clean separation of concerns with layered architecture
- **🔐 Scalable Security**: O(1) API key lookups, secure session management
- **⚡ Edge Performance**: Built on Cloudflare Workers global network  
- **🎨 Modern UI/UX**: Tesla/Apple-inspired design with responsive layouts
- **📱 Mobile-First**: Optimized for all screen sizes and devices
- **🔄 Real-time Updates**: Live data updates without page refreshes

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

✅ **Enterprise Features**:
- ✅ Multi-platform OAuth support
- ✅ Comprehensive scope management
- ✅ Real-time usage analytics
- ✅ Professional admin interface
- ✅ Secure API key system
- ✅ Modern responsive UI

## 🔧 API Endpoints

### **Authentication**
- `POST /auth` - User login/signup
- `POST /google-auth` - Google OAuth login
- `POST /github-auth` - GitHub OAuth login
- `GET /validate-session` - Session validation

### **API Keys**
- `POST /generate-key` - Generate new API key
- `GET /user-keys` - List user's API keys
- `DELETE /delete-key/{keyId}` - Delete API key

### **OAuth Apps**
- `POST /save-app` - Save OAuth app credentials
- `GET /user-apps` - List user's OAuth apps
- `DELETE /delete-app/{platform}` - Delete OAuth app

### **OAuth Flow**
- `GET /consent/{platform}/{apiKey}` - Generate consent URL
- `GET /callback` - OAuth callback handler
- `GET /tokens/{platformUserId}/{apiKey}` - Get user tokens
- `POST /refresh/{platformUserId}/{apiKey}` - Refresh tokens

### **System**
- `GET /health` - System health check
- `GET /docs` - API documentation

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ using Cloudflare Workers, modern web technologies, and a focus on developer experience.**