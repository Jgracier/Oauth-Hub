# OAuth Hub - Admin Documentation

## System Overview

OAuth Hub is a comprehensive token management system built on Cloudflare Workers with KV storage. It provides user authentication, API key management, OAuth app credentials storage, and token management across multiple platforms.

**Base URL**: `https://www.oauth-hub.com`

---

## 🔐 Authentication Methods

### 1. User Registration
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

### 2. User Login
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
    "createdAt": "2025-08-28T01:30:00.000Z"
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
      "createdAt": "2025-08-28T01:30:00.000Z"
    },
    {
      "id": "key-id-2",
      "name": "Production API",
      "key": "sk_def456...",
      "createdAt": "2025-08-28T01:31:00.000Z"
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
    "redirectUri": "https://example.com/callback"
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
    "redirectUri": "https://example.com/callback",
    "createdAt": "2025-08-28T01:30:00.000Z"
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
      "redirectUri": "https://example.com/callback",
      "createdAt": "2025-08-28T01:30:00.000Z"
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

**Supported Platforms:**
- `facebook`
- `google`
- `x` (Twitter/X)
- `instagram`
- `linkedin`
- `tiktok`
- `discord`
- `pinterest`

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

**Response:** Auto-closing HTML page that completes OAuth flow

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
  "timestamp": "2025-08-28T01:30:00.000Z",
  "features": [
    "Authentication",
    "API Keys",
    "OAuth Apps",
    "Token Management",
    "Analytics"
  ]
}
```

### 2. Documentation Access
```bash
curl "${BASE_URL}/docs"
```

**Response:** HTML documentation page

---

## 🗄️ Cloudflare KV Storage Structure

### API_KEYS Namespace
```
Key Format: {resource-type} {User Name} {email}

api-Production API John Doe user@example.com
oauth-facebook John Doe user@example.com
lookup-sk_abc123... (API key validation)
user-keys-user@example.com (User's API key list)
user-apps-user@example.com (User's OAuth app list)
```

### OAUTH_TOKENS Namespace
```
Key Format: {resource-type} {User Name} {email}

token-facebook John Doe user@example.com
lookup-facebook-123456 (Platform user ID lookup)
```

### USERS Namespace
```
Key Format: {resource-type} {User Name} {email}

user John Doe user@example.com
lookup-user@example.com (Email to user lookup)
```

---

## 🔍 Searching in Cloudflare Dashboard

### Search Examples:
- **By Resource Type**: `"api-"` → All API keys, `"oauth-"` → All OAuth apps
- **By User**: `"John Doe"` → All resources for John Doe
- **By Email**: `"user@example.com"` → All resources for that email
- **By Platform**: `"facebook"` → All Facebook-related resources
- **By Key Name**: `"Production API"` → That specific API key

---

## ⚠️ Error Responses

All endpoints return consistent error formats:

```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

### Common HTTP Status Codes:
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (invalid API key)
- `404` - Not Found (user/resource not found)
- `500` - Internal Server Error

---

## 🛡️ Security Features

1. **API Key Authentication** - All sensitive operations require valid API keys
2. **Email Validation** - Proper email format validation
3. **Input Sanitization** - All inputs are sanitized before storage
4. **CORS Headers** - Proper CORS handling for web applications
5. **Secure Storage** - Sensitive data encrypted in Cloudflare KV

---

## 📝 Usage Examples

### Complete OAuth Flow Example:
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

### API Key Management Example:
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

---

## 📞 Support Information

- **Base URL**: https://www.oauth-hub.com
- **Version**: 2.0-modular
- **Platform**: Cloudflare Workers
- **Storage**: Cloudflare KV
- **Documentation**: Available at `/docs` endpoint

---

*Last Updated: August 28, 2025*