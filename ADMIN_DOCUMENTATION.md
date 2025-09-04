# OAuth Hub - Admin Documentation

## System Overview

OAuth Hub is a production-ready OAuth token management system built on Cloudflare Workers with KV storage. It provides secure user authentication, API key management, OAuth app credentials storage, and simplified OAuth flows with direct platform user ID return.

**Base URL**: `https://oauth-handler.socialoauth.workers.dev`

---

## 🔐 Security Architecture

### Authentication
- **Password Hashing**: SHA-256 with 10,000 iterations + salt
- **Session Management**: JWT tokens in HTTP-only cookies (24-hour expiry)
- **API Keys**: Secure random generation with `sk_` prefix
- **CSRF Protection**: Signed state parameters for OAuth flows

### Middleware Stack
1. **Rate Limiting**: Different limits per endpoint
2. **Authentication**: JWT verification or API key validation
3. **Security Headers**: CSP, HSTS, X-Frame-Options, etc.

---

## 🚀 NEW: Direct Platform User ID Flow

### How It Works
1. Developer calls `OAuthHub.connect('platform', 'api_key')`
2. OAuth popup opens with consent URL
3. User authorizes the app
4. Platform redirects to callback with auth code
5. **Server exchanges code for tokens AND platform user ID**
6. **Data sent back to parent window via postMessage**
7. Developer immediately has platform user ID and tokens

### Benefits
- No webhooks required
- No polling needed
- Instant results
- Works across all platforms

---

## 📡 API Endpoints

### Authentication

#### User Registration
```bash
curl -X POST "${BASE_URL}/auth" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "signup",
    "email": "user@example.com",
    "password": "securepassword123",
    "fullName": "John Doe"
  }'
```

**Response:** Sets session cookie + returns success message

#### User Login
```bash
curl -X POST "${BASE_URL}/auth" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "login",
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

**Response:** Sets session cookie + returns user data

#### Logout
```bash
curl -X POST "${BASE_URL}/auth/logout" \
  --cookie "session=jwt_token_here"
```

---

### API Key Management

All endpoints require authentication via session cookie.

#### Generate New API Key
```bash
curl -X POST "${BASE_URL}/generate-key" \
  -H "Content-Type: application/json" \
  --cookie "session=jwt_token_here" \
  -d '{
    "name": "Production API"
  }'
```

#### List User's API Keys
```bash
curl "${BASE_URL}/user-keys" \
  --cookie "session=jwt_token_here"
```

#### Delete API Key
```bash
curl -X DELETE "${BASE_URL}/delete-key/{keyId}" \
  --cookie "session=jwt_token_here"
```

---

### OAuth App Management

#### Save OAuth App Credentials
```bash
curl -X POST "${BASE_URL}/save-app" \
  -H "Content-Type: application/json" \
  --cookie "session=jwt_token_here" \
  -d '{
    "platform": "facebook",
    "name": "My Facebook App",
    "clientId": "facebook_client_id",
    "clientSecret": "facebook_client_secret",
    "scopes": ["email", "public_profile"],
    "redirectUri": "https://oauth-handler.socialoauth.workers.dev/callback"
  }'
```

---

### OAuth Flow

#### 1. Generate Consent URL (Public)
```bash
curl "${BASE_URL}/consent/{platform}/{apiKey}"
```

Returns OAuth consent URL for the platform.

#### 2. OAuth Callback (Automatic)
The callback endpoint handles the OAuth redirect and:
1. Validates the secure state parameter
2. Exchanges auth code for tokens
3. Stores tokens securely in KV
4. Returns platform user ID to parent window

#### 3. Get Tokens (Public with API Key)
```bash
curl "${BASE_URL}/tokens/{platformUserId}/{apiKey}"
```

Returns current access token (auto-refreshes if expired).

---

## 🗄️ Cloudflare KV Storage Structure

### API_KEYS Namespace
```
Key Format: {resource-type} {firstname} {lastname} {email}

Examples:
api-Production API John Doe user@example.com
oauth-facebook John Doe user@example.com
rate:127.0.0.1:/auth (for rate limiting)
```

### OAUTH_TOKENS Namespace
```
Key Format: token-{platform} {firstname} {lastname} {email}

Example:
token-facebook John Doe user@example.com
```

### USERS Namespace
```
Key Format: user {firstname} {lastname} {email}

Example:
user John Doe user@example.com
```

---

## 🔍 Rate Limiting

Different endpoints have different rate limits:

- `/auth` - 5 requests/minute (prevent brute force)
- `/api/*` - 100 requests/minute
- `/consent/*` - 30 requests/minute
- Default - 200 requests/minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
- `Retry-After` (on 429 errors)

---

## 🚨 Error Handling

### Standard Error Format
```json
{
  "error": "Short error message",
  "message": "Detailed error description"
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## 🛡️ Security Checklist

### Password Security
- ✅ Passwords hashed with salt
- ✅ 10,000 iteration SHA-256
- ✅ Minimum 8 character requirement
- ✅ Salt stored separately

### Session Security
- ✅ JWT tokens with expiration
- ✅ HTTP-only cookies
- ✅ Secure flag on cookies
- ✅ SameSite=Strict

### API Security
- ✅ Rate limiting per endpoint
- ✅ API key validation
- ✅ CORS headers
- ✅ Security headers

### OAuth Security
- ✅ Signed state parameters
- ✅ State expiration (5 minutes)
- ✅ Origin validation on callbacks
- ✅ Encrypted token storage

---

## 📊 Monitoring

### Health Check
```bash
curl "${BASE_URL}/health"
```

Returns system status and enabled features.

### Search Patterns in KV
- By user: Search for email
- By resource: Search for "api-" or "oauth-" or "token-"
- By platform: Search for platform name

---

## 🔧 Maintenance

### Rotating Secrets
1. Update JWT_SECRET in environment variables
2. Users will need to re-authenticate
3. Consider grace period with dual validation

### Cleaning Up Expired Data
- Rate limit keys expire automatically (TTL set)
- Consider periodic cleanup of old tokens
- Monitor KV storage usage

---

## 📞 Support

- **Version**: 3.0 (Simplified + Secure)
- **Platform**: Cloudflare Workers
- **Storage**: Cloudflare KV
- **Documentation**: Available at `/docs`

---

*Last Updated: Current Version with Security Enhancements*