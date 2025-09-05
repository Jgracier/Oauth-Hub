# OAuth Hub - Complete Modular Platform

A comprehensive, modular OAuth management platform built with Cloudflare Workers. Features user authentication, API key management, OAuth app credentials, and complete OAuth flow handling.

## 🚀 Live URL
https://www.oauth-hub.com

## 🔄 Auto-Deployment
✅ **GitHub Actions Enabled** - Automatic deployment on every push to main branch!

## 📁 Project Structure

```
oauth-worker/
├── src/
│   ├── index.js           # Main entry point & request router
│   ├── pages/             # Individual page modules
│   │   ├── auth.js        # Login/Signup page
│   │   ├── dashboard.js   # Main dashboard
│   │   ├── api-keys.js    # API key management
│   │   ├── apps.js        # OAuth app credentials
│   │   ├── docs.js        # API documentation
│   │   └── analytics.js   # Usage analytics & token management
│   ├── shared/            # Shared resources
│   │   └── styles.js      # Unified CSS design system
│   ├── utils/             # Utility functions
│   │   └── helpers.js     # Common helper functions
│   └── oauth/             # OAuth backend
│       └── backend.js     # Core OAuth logic & token management
├── backup/                # Backup of old files
├── wrangler.toml          # Cloudflare Workers config
├── package.json           # Node.js dependencies
└── README.md              # This file
```

## ✨ Features

### 🔐 **User Authentication**
- Sign up / Login system
- Secure session management
- User data stored in Cloudflare KV

### 🔑 **API Key Management** 
- Generate multiple API keys per user
- Secure key storage and validation
- Copy/delete functionality

### 📱 **OAuth App Credentials**
- Add OAuth apps for 8+ platforms (Google, Facebook, Instagram, Twitter, LinkedIn, TikTok, Discord, Pinterest)
- Store client IDs, secrets, scopes, and redirect URIs
- Platform-specific configuration

### 📖 **API Documentation**
- Complete API reference
- Code examples in JavaScript and Python  
- Interactive endpoint documentation

### 📊 **Analytics & Token Management**
- View active OAuth tokens
- Monitor platform usage
- Token refresh and revocation

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run locally
npx wrangler dev

# Deploy to Cloudflare
npx wrangler deploy --env=""
```

## 🔄 Complete OAuth Flow - Direct & Simple!

### 1. **User Setup**
1. Sign up or log in to your account
2. Generate an API key for your application
3. Add OAuth app credentials for each platform you want to support

### 2. **Direct OAuth Flow (NEW!)**

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
    fetch(`/consent/\${platform}/\${apiKey}`)
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

### 3. **Token Usage**
```javascript
// Get user's tokens later (auto-refreshes if expired)
GET /tokens/{platformUserId}/{apiKey}

// Manual token refresh
POST /refresh/{platformUserId}/{apiKey}
```

## 🌐 Supported Platforms

| Platform | Status | Features |
|----------|--------|----------|
| **Google** | ✅ Ready | YouTube, Drive, Gmail APIs |
| **Facebook** | ✅ Ready | Graph API, Pages, Posts |
| **Instagram** | ✅ Ready | Basic Display API, Media |
| **Twitter/X** | ✅ Ready | API v2, Tweets, Users |
| **LinkedIn** | ✅ Ready | Profile, Company APIs |
| **TikTok** | ✅ Ready | For Developers API |
| **Discord** | ✅ Ready | Bot APIs, User Data |
| **Pinterest** | ✅ Ready | Boards, Pins APIs |

## 📝 Architecture

- **🏗️ Modular Design**: Each feature is a separate page module
- **🔐 Secure**: API keys and OAuth tokens stored in Cloudflare KV
- **⚡ Fast**: Built on Cloudflare Workers edge network  
- **🎨 Unified**: Consistent design system across all pages
- **📱 Responsive**: Works on desktop and mobile devices

## 🚦 Current Status

✅ **Fully Implemented**:
- User authentication (signup/login)
- API key management system
- OAuth app credentials management
- Complete API documentation
- Analytics and token management dashboard
- OAuth consent URL generation
- Callback handling and success pages
- Modular, maintainable codebase

✅ **Ready for Production**:
- All pages working and connected
- Backend API endpoints implemented
- OAuth flow architecture complete
- Professional UI/UX design

## 📄 License

Private project - All rights reserved
