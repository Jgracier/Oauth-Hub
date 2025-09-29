# OAuth Hub - Admin Documentation

## System Overview

OAuth Hub is a comprehensive token management system built on Cloudflare Workers with KV storage. It provides modern user authentication (including Google/GitHub OAuth), API key management, OAuth app credentials storage, and token management across 37+ platforms.

**Base URL**: `https://oauth-hub.com`

---

## 🔐 Authentication Methods

### 1. User Registration (Email/Password)
```bash
curl -X POST "${BASE_URL}/auth" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "signup",
    "email": "user@example.com",
    "password": "securepassword",
    "fullName": "John Doe"
  }'
```

**Response:**
```json
{
  "success": true,
  "apiKey": "sk_abc123...",
  "email": "user@example.com",
  "name": "John Doe",
  "message": "Account created successfully"
}
```

### 2. User Login (Email/Password)
```bash
curl -X POST "${BASE_URL}/auth" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "login",
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

**Response:**
```json
{
  "success": true,
  "email": "user@example.com",
  "name": "John Doe",
  "message": "Login successful"
}
```

### 3. Google OAuth Login
```bash
curl -X POST "${BASE_URL}/google-auth" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "google_auth_code",
    "state": "optional_state"
  }'
```

### 4. GitHub OAuth Login
```bash
curl -X POST "${BASE_URL}/github-auth" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "github_auth_code",
    "state": "optional_state"
  }'
```

---

## 🔑 API Key Management

### 1. Generate New API Key
```bash
curl -X POST "${BASE_URL}/generate-key" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "Production API"
  }'
```

**Response:**
```json
{
  "success": true,
  "key": {
    "id": "unique-key-id",
    "name": "Production API",
    "key": "sk_abc123...",
    "createdAt": "2025-01-28T01:30:00.000Z"
  },
  "message": "API key generated successfully"
}
```

### 2. List User's API Keys
```bash
curl "${BASE_URL}/user-keys?email=user@example.com"
```

**Response:**
```json
{
  "success": true,
  "keys": [
    {
      "id": "key-id-1",
      "name": "Default Key",
      "key": "sk_abc123...",
      "createdAt": "2025-01-28T01:30:00.000Z"
    },
    {
      "id": "key-id-2",
      "name": "Production API",
      "key": "sk_def456...",
      "createdAt": "2025-01-28T01:31:00.000Z"
    }
  ]
}
```

### 3. Delete API Key
```bash
curl -X DELETE "${BASE_URL}/delete-key/{keyId}?email=user@example.com"
```

**Response:**
```json
{
  "success": true,
  "message": "API key deleted successfully"
}
```

### 4. API Key Authentication
Include API key in Authorization header for authenticated requests:
```bash
curl -H "Authorization: Bearer sk_abc123..." "${BASE_URL}/endpoint"
```

---

## 🔗 OAuth App Credentials Management

### 1. Save OAuth App Credentials
```bash
curl -X POST "${BASE_URL}/save-app" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "platform": "facebook",
    "name": "My Facebook App",
    "clientId": "facebook_client_id",
    "clientSecret": "facebook_client_secret",
    "scopes": ["email", "public_profile"],
    "redirectUri": "https://oauth-hub.com/callback"
  }'
```

**Response:**
```json
{
  "success": true,
  "app": {
    "platform": "facebook",
    "name": "My Facebook App",
    "clientId": "facebook_client_id",
    "clientSecret": "facebook_client_secret",
    "scopes": ["email", "public_profile"],
    "redirectUri": "https://oauth-hub.com/callback",
    "createdAt": "2025-01-28T01:30:00.000Z"
  },
  "message": "App credentials saved successfully"
}
```

### 2. List User's OAuth Apps
```bash
curl "${BASE_URL}/user-apps?email=user@example.com"
```

**Response:**
```json
{
  "success": true,
  "apps": [
    {
      "platform": "facebook",
      "name": "My Facebook App",
      "clientId": "facebook_client_id",
      "clientSecret": "facebook_client_secret",
      "scopes": ["email", "public_profile"],
      "redirectUri": "https://oauth-hub.com/callback",
      "createdAt": "2025-01-28T01:30:00.000Z"
    }
  ]
}
```

### 3. Delete OAuth App
```bash
curl -X DELETE "${BASE_URL}/delete-app/{platform}?email=user@example.com"
```

**Response:**
```json
{
  "success": true,
  "message": "App credentials deleted successfully"
}
```

---

## 🌐 OAuth Flow Management

### 1. Generate OAuth Consent URL
```bash
curl "${BASE_URL}/consent/{platform}/{apiKey}?state=optional_state"
```

**Supported Platforms (37 Total):**

#### **🇺🇸 Tier 1 American Platforms**
- `google` - Google (YouTube, Drive, Gmail, Analytics)
- `facebook` - Facebook (Graph API, Pages, Posts)
- `instagram` - Instagram (Basic Display, Media)
- `x` - Twitter/X (API v2, Tweets, Users)
- `linkedin` - LinkedIn (Profile, Company APIs)
- `apple` - Apple (Sign in with Apple)
- `microsoft` - Microsoft (Graph API, Office 365)

#### **🏢 Business & Productivity**
- `salesforce` - Salesforce CRM
- `hubspot` - HubSpot CRM & Marketing
- `zoom` - Zoom Meetings & Webinars
- `slack` - Slack Workspace APIs
- `trello` - Trello Boards & Cards
- `asana` - Asana Tasks & Projects
- `notion` - Notion Pages & Databases

#### **🎨 Creative & Design**
- `adobe` - Adobe Creative SDK
- `figma` - Figma Design Files
- `canva` - Canva Design APIs
- `dribbble` - Dribbble Shots & Users
- `unsplash` - Unsplash Photos

#### **🛒 E-commerce & Payments**
- `amazon` - Amazon Advertising API
- `shopify` - Shopify Admin API
- `stripe` - Stripe Payments
- `paypal` - PayPal Payments

#### **☁️ Cloud & Storage**
- `dropbox` - Dropbox Files & Sharing
- `box` - Box Content Management

#### **🎮 Gaming & Entertainment**
- `steam` - Steam OpenID & User Stats
- `netflix` - Netflix Content APIs
- `twitch` - Twitch Streams & Chat
- `discord` - Discord Bot APIs
- `spotify` - Spotify Music & Playlists

#### **📱 Social & Communication**
- `tiktok` - TikTok For Developers
- `pinterest` - Pinterest Boards & Pins
- `reddit` - Reddit Posts & Comments
- `wordpress` - WordPress Posts & Media

#### **💰 Finance & Crypto**
- `coinbase` - Coinbase Wallet & Trading

#### **📧 Email & Marketing**
- `mailchimp` - Mailchimp Campaigns & Lists

**Response:**
```json
{
  "platform": "FACEBOOK",
  "consentUrl": "https://www.facebook.com/v18.0/dialog/oauth?client_id=123...",
  "message": "OAuth consent URL for FACEBOOK"
}
```

### 2. OAuth Callback Handler
```bash
# This is called automatically by OAuth providers
curl "${BASE_URL}/callback?code=auth_code&state=platform_timestamp_email"
```

**Response:** Auto-closing HTML page with postMessage that completes OAuth flow

### 3. Retrieve OAuth Tokens
```bash
curl "${BASE_URL}/tokens/{platformUserId}/{apiKey}"
```

**Response:**
```json
{
  "success": true,
  "tokens": {
    "access_token": "oauth_access_token",
    "refresh_token": "oauth_refresh_token",
    "expires_in": 3600,
    "platform": "facebook",
    "platformUserId": "123456789"
  }
}
```

### 4. Refresh OAuth Tokens
```bash
curl -X POST "${BASE_URL}/refresh/{platformUserId}/{apiKey}"
```

**Response:**
```json
{
  "success": true,
  "tokens": {
    "access_token": "new_access_token",
    "refresh_token": "new_refresh_token",
    "expires_in": 3600
  }
}
```

### 5. Revoke OAuth Tokens
```bash
curl -X DELETE "${BASE_URL}/revoke-token/{platformUserId}/{apiKey}"
```

**Response:**
```json
{
  "success": true,
  "message": "Token revoked successfully"
}
```

---

## 📊 System Monitoring

### 1. Health Check
```bash
curl "${BASE_URL}/health"
```

**Response:**
```json
{
  "status": "✅ OAuth Hub Online - Modular v2.0",
  "version": "2.0-modular",
  "timestamp": "2025-01-28T01:30:00.000Z",
  "features": [
    "Authentication",
    "API Keys",
    "OAuth Apps",
    "Token Management",
    "Analytics",
    "Google OAuth Login",
    "GitHub OAuth Login",
    "Profile Pictures",
    "Modern UI"
  ]
}
```

### 2. Documentation Access
```bash
curl "${BASE_URL}/docs"
```

**Response:** HTML documentation page with interactive API reference

---

## 🗄️ Cloudflare KV Storage Structure

### **Scalable Storage Patterns**

#### **API_KEYS Namespace**
```
# Main API Key Records
api-{name}-{email}                    # Primary key record
lookup-{apiKey}                       # Fast API key validation
user-keys-{email}                     # User's key index

# Example Keys:
api-Production API-user@example.com
lookup-sk_abc123def456...
user-keys-user@example.com
```

#### **OAUTH_TOKENS Namespace**
```
# Token Storage (Scalable Pattern)
token-{platformUserId}-{apiKey}       # Direct token lookup

# Example Keys:
token-123456789-sk_abc123def456...
```

#### **USERS Namespace**
```
# User Records
user-{email}                          # Primary user record

# Example Keys:
user-user@example.com
```

#### **USER_SESSIONS Namespace**
```
# Session Management
session-{sessionToken}                # Session data

# Example Keys:
session-sess_abc123def456...
```

#### **OAuth Apps Storage (in API_KEYS)**
```
# OAuth App Credentials
app-{platform}-{email}               # Platform-specific app

# Example Keys:
app-facebook-user@example.com
app-google-user@example.com
```

---

## 🔍 Searching in Cloudflare Dashboard

### **Optimized Search Patterns:**
- **By Resource Type**: `"api-"` → All API keys, `"app-"` → All OAuth apps, `"token-"` → All tokens
- **By User Email**: `"user@example.com"` → All resources for that email
- **By Platform**: `"facebook"` → All Facebook-related resources
- **By API Key**: `"sk_abc123"` → Resources using that API key
- **By Session**: `"session-"` → All active sessions

---

## ⚠️ Error Responses

All endpoints return consistent error formats:

```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

### **Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (invalid API key or session)
- `404` - Not Found (user/resource not found)
- `500` - Internal Server Error

---

## 🛡️ Security Features

1. **Multi-Factor Authentication** - Email/password + OAuth providers
2. **API Key Security** - Secure generation with O(1) validation
3. **Session Management** - JWT tokens with HttpOnly cookies
4. **Input Sanitization** - All inputs sanitized before storage
5. **CORS Protection** - Proper CORS headers for web applications
6. **Encrypted Storage** - Sensitive data encrypted in Cloudflare KV
7. **Profile Pictures** - Secure OAuth provider profile integration
8. **Rate Limiting** - Built-in Cloudflare Workers rate limiting

---

## 📝 Usage Examples

### **Complete OAuth Flow Example:**
```bash
# 1. Save OAuth app credentials
curl -X POST "${BASE_URL}/save-app" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","platform":"facebook","clientId":"123","clientSecret":"secret"}'

# 2. Generate consent URL
curl "${BASE_URL}/consent/facebook/sk_your_api_key"

# 3. User visits consent URL, authorizes, gets redirected to callback

# 4. Retrieve tokens
curl "${BASE_URL}/tokens/facebook_user_id/sk_your_api_key"
```

### **API Key Management Example:**
```bash
# 1. Generate new API key
curl -X POST "${BASE_URL}/generate-key" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"My API Key"}'

# 2. List all keys
curl "${BASE_URL}/user-keys?email=user@example.com"

# 3. Use API key for authenticated requests
curl -H "Authorization: Bearer sk_abc123..." "${BASE_URL}/user-apps?email=user@example.com"

# 4. Delete key when no longer needed
curl -X DELETE "${BASE_URL}/delete-key/key-id?email=user@example.com"
```

### **Modern Authentication Example:**
```bash
# Google OAuth Login
curl -X POST "${BASE_URL}/google-auth" \
  -H "Content-Type: application/json" \
  -d '{"code":"google_auth_code"}'

# GitHub OAuth Login  
curl -X POST "${BASE_URL}/github-auth" \
  -H "Content-Type: application/json" \
  -d '{"code":"github_auth_code"}'

# Session Validation
curl "${BASE_URL}/validate-session" \
  -H "Cookie: session=your_session_token"
```

---

## 📞 Support Information

- **Base URL**: https://oauth-hub.com
- **Version**: 2.0-modular-modern
- **Platform**: Cloudflare Workers
- **Storage**: Cloudflare KV (4 namespaces)
- **UI**: Modern Tesla/Apple-inspired design
- **Authentication**: Multi-provider (Email, Google, GitHub)
- **Platforms Supported**: 37+ OAuth providers
- **Documentation**: Available at `/docs` endpoint

---

## 🚀 Performance & Scale

### **Optimized for Scale:**
- **O(1) Lookups**: Direct key-based access patterns
- **Edge Performance**: Cloudflare Workers global network
- **Efficient Storage**: Structured KV patterns for fast retrieval
- **Modern UI**: Responsive design with optimized loading

### **Capacity:**
- **Users**: Unlimited (KV storage scales automatically)
- **API Keys**: Unlimited per user
- **OAuth Apps**: Unlimited per user per platform
- **Tokens**: Unlimited with automatic refresh
- **Platforms**: 37+ supported, easily extensible

---

*Last Updated: January 28, 2025*