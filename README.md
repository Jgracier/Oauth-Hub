# OAuth Hub - Production-Ready OAuth Management Platform

A secure, streamlined OAuth management platform built with Cloudflare Workers. Get platform user IDs instantly via popup messaging - no webhooks or polling required!

## 🎯 Key Features

### **NEW: Direct Platform User ID Return**
- Platform user IDs returned instantly via popup window messaging
- No webhooks needed - simplifies integration dramatically
- Automatic token storage and refresh in the background
- One simple flow works for all platforms

### **Security First**
- JWT-based session authentication with HTTP-only cookies
- Password hashing with SHA-256 iterations
- CSRF protection on OAuth flows
- Rate limiting on all endpoints
- Secure API key management

### **Developer Experience**
- Simple popup helper script - one line of code to connect
- Automatic token refresh
- Comprehensive documentation
- Support for 8+ major platforms

## 🚀 Quick Start

### For Developers Using OAuth Hub

1. **Include the popup helper:**
```html
<script src="https://oauth-handler.socialoauth.workers.dev/oauth-popup.js"></script>
```

2. **Connect a social account:**
```javascript
const result = await OAuthHub.connect('facebook', 'sk_your_api_key');
console.log('Platform User ID:', result.platformUserId);
console.log('Access Token:', result.tokens.accessToken);
```

That's it! The platform user ID is returned directly to your app.

## 📁 Project Structure

```
oauth-worker/
├── src/
│   ├── index.js           # Main entry point with middleware
│   ├── pages/             # UI pages (auth, dashboard, etc.)
│   ├── middleware/        # Auth & rate limiting
│   ├── client/           # OAuth popup helper script
│   ├── oauth/            # Core OAuth logic
│   ├── utils/            # Security & helper utilities
│   └── shared/           # Shared UI components
├── wrangler.toml         # Cloudflare Workers config
└── package.json          # Dependencies
```

## ✨ What's New

### Security Enhancements
- ✅ Secure password hashing (no more plain text!)
- ✅ JWT session tokens with HTTP-only cookies
- ✅ CSRF protection with signed state parameters
- ✅ Rate limiting to prevent abuse
- ✅ Security headers (CSP, HSTS, etc.)

### Simplified OAuth Flow
- ✅ Direct platform user ID return via popup messaging
- ✅ No webhook configuration required
- ✅ Automatic token refresh
- ✅ One redirect URI for all platforms

### Developer Experience
- ✅ Simple OAuth popup helper script
- ✅ Comprehensive documentation with examples
- ✅ Support for React/Vue/Angular
- ✅ Clean API with consistent responses

## 🔐 Security Features

1. **Authentication**
   - JWT sessions with 24-hour expiry
   - Secure password hashing (10,000 iterations)
   - HTTP-only session cookies

2. **API Security**
   - API keys for programmatic access
   - Rate limiting per endpoint
   - CORS protection

3. **OAuth Security**
   - Signed state parameters prevent CSRF
   - Automatic token encryption
   - Secure popup communication

## 🌐 Supported Platforms

- 📘 Facebook
- 🔍 Google  
- 📸 Instagram
- 🐦 Twitter/X
- 💼 LinkedIn
- 🎵 TikTok
- 🎮 Discord
- 📌 Pinterest

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run locally
npx wrangler dev

# Deploy to Cloudflare
npx wrangler deploy
```

## 📊 API Endpoints

### Public Endpoints
- `POST /auth` - Login/Signup
- `GET /oauth-popup.js` - OAuth helper script
- `GET /consent/{platform}/{apiKey}` - Generate consent URL
- `GET /callback` - OAuth callback handler

### Authenticated Endpoints
- `GET /user-keys` - List user's API keys
- `POST /generate-key` - Create new API key
- `GET /user-apps` - List OAuth app credentials
- `POST /save-app` - Save OAuth app credentials
- `GET /tokens/{platformUserId}/{apiKey}` - Get access tokens

## 🔄 Migration from Webhooks

If you're currently using webhooks:

1. Replace webhook endpoint with the popup helper
2. Remove webhook configuration code  
3. Update OAuth button to use `OAuthHub.connect()`
4. Platform user IDs now returned directly - no polling needed!

## 📄 License

Private project - All rights reserved