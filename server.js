// Full content for new server.js file
require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const https = require('https');
const fs = require('fs');
const OAuth2Server = require('@node-oauth/oauth2-server');

const app = express();
const port = process.env.PORT || 3001;

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting (simple implementation - can be enhanced)
const rateLimitStore = new Map();
app.use((req, res, next) => {
  const clientId = req.ip;
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW) || 900000; // 15 minutes
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX) || 100;

  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitStore.has(clientId)) {
    rateLimitStore.set(clientId, []);
  }

  const clientRequests = rateLimitStore.get(clientId);
  const validRequests = clientRequests.filter(timestamp => timestamp > windowStart);

  if (validRequests.length >= maxRequests) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  validRequests.push(now);
  rateLimitStore.set(clientId, validRequests);

  next();
});

// OAuth2 Server Instance (core backend - simplifies all custom logic)
const oauth = new OAuth2Server({
  model: require('./models/oauth-model'),  // Custom models for storage and platform integration
  grants: ['authorization_code', 'refresh_token', 'client_credentials'],  // Supported flows
  accessTokenLifetime: 3600,  // 1 hour
  refreshTokenLifetime: 1209600,  // 2 weeks
  requireClientAuthentication: {
    authorization_code: false,  // Enable PKCE for public clients
    refresh_token: true
  },
  allowExtendedTokenAttributes: true,  // Allow custom token attributes
  alwaysIssueNewRefreshToken: true  // Security best practice
});

// =========================================
// API ENDPOINTS
// =========================================

// Consent/Authorization Endpoint (/oauth/authorize) - Generates URL with scopes, redirect, PKCE
app.get('/oauth/authorize', async (req, res, next) => {
  try {
    // Wrap Express request in oauth2-server Request
    const oauthRequest = new OAuth2Server.Request(req);
    const oauthResponse = new OAuth2Server.Response(res);

    // Authorize and generate consent (handles validation, PKCE, scopes)
    const authResult = await oauth.authorize(oauthRequest, oauthResponse, {
      authenticateHandler: async (request) => {
        // Custom consent logic: In production, render UI; here, auto-approve for demo
        // Integrate with existing src/ui/ for custom consent page
        const userId = 'platform-user-123';  // From session or DB
        return { id: userId, platformUserId: userId };
      }
    });

    // The oauth2-server handles the response automatically
    // Don't send additional response here

  } catch (error) {
    next(error);
  }
});

// Tokens Endpoint (/oauth/token) - Exchange code/refresh, return token by platform user ID
app.post('/oauth/token', async (req, res, next) => {
  try {
    // Wrap Express request in oauth2-server Request
    const oauthRequest = new OAuth2Server.Request(req);
    const oauthResponse = new OAuth2Server.Response(res);

    const token = await oauth.token(oauthRequest, oauthResponse, {
      accessTokenLifetime: 3600, // 1 hour
      refreshTokenLifetime: 1209600, // 2 weeks
      requireClientAuthentication: {
        authorization_code: false,
        refresh_token: true
      }
    });

    // The oauth2-server handles the response automatically

  } catch (error) {
    next(error);
  }
});

// Custom Tokens Retrieval (/tokens/:platformUserId) - Get working token by user ID
app.get('/tokens/:platformUserId', async (req, res, next) => {
  try {
    const { platformUserId } = req.params;
    // Fetch from storage (model)
    const tokenData = await getTokenByPlatformUserId(platformUserId);
    if (!tokenData) {
      return res.status(404).json({ error: 'Token not found' });
    }

    // Auto-refresh if expired (using oauth2-server refresh grant)
    if (isTokenExpired(tokenData)) {
      const refreshed = await refreshTokenByUserId(platformUserId);
      tokenData.accessToken = refreshed.accessToken;
      tokenData.expiresAt = refreshed.expiresAt;
    }

    res.json({
      success: true,
      access_token: tokenData.accessToken,
      token_type: 'Bearer',
      expires_in: calculateExpiresIn(tokenData.expiresAt),
      platform_user_id: platformUserId,
      scope: tokenData.scope
    });
  } catch (error) {
    next(error);
  }
});

// Client Registration (/oauth/register) - For developers to register apps
app.post('/oauth/register', async (req, res, next) => {
  try {
    // Wrap Express request in oauth2-server Request
    const oauthRequest = new OAuth2Server.Request(req);
    const oauthResponse = new OAuth2Server.Response(res);

    const client = await oauth.register(oauthRequest, oauthResponse);

    // The oauth2-server handles the response automatically

  } catch (error) {
    next(error);
  }
});

// Backward-compatible Consent Endpoint (/consent/{platform}/{apiKey}) - Maps to oauth/authorize
app.get('/consent/:platform/:apiKey', async (req, res, next) => {
  try {
    const { platform, apiKey } = req.params;

    // Validate API key (from your existing logic)
    const client = await validateApiKey(apiKey);  // Implement from model
    if (!client) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Map platform to scopes (reuse existing platforms/)
    const scopes = [`read:${platform}`, `write:${platform}`];  // Or dynamic from PLATFORMS[platform]

    // Build standard OAuth request URL manually for backward compatibility
    // Since this is a compatibility endpoint, we'll construct the URL directly
    const baseUrl = `${req.protocol}://${req.get('host')}/oauth/authorize`;
    const scopeParam = scopes.join(' ');
    const state = generateState();
    const codeChallenge = generatePKCEChallenge();

    const consentUrl = `${baseUrl}?response_type=code&client_id=${client.id}&redirect_uri=${encodeURIComponent(client.redirectUris[0])}&scope=${encodeURIComponent(scopeParam)}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    // Return original format: consent URL
    res.json({
      success: true,
      consentUrl: consentUrl,
      platform,
      apiKey,
      scopes
    });
  } catch (error) {
    next(error);
  }
});

// Backward-compatible Tokens Endpoint (/tokens/{platformUserId}/{apiKey}) - Maps to custom retrieval
app.get('/tokens/:platformUserId/:apiKey', async (req, res, next) => {
  try {
    const { platformUserId, apiKey } = req.params;

    // Validate API key
    const client = await validateApiKey(apiKey);
    if (!client) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Fetch token by platformUserId (from model)
    const tokenData = await getTokenByPlatformUserId(platformUserId);
    if (!tokenData) {
      return res.status(404).json({ error: 'Token not found' });
    }

    // Auto-refresh if expired
    if (isTokenExpired(tokenData)) {
      const refreshed = await refreshTokenByUserId(platformUserId);
      tokenData.accessToken = refreshed.accessToken;
    }

    // Original response format
    res.json({
      success: true,
      access_token: tokenData.accessToken,
      platform_user_id: platformUserId,
      api_key: apiKey,
      expires_in: calculateExpiresIn(tokenData.expiresAt),
      scope: tokenData.scope
    });
  } catch (error) {
    next(error);
  }
});

// New Supported Features (powered by oauth2-server)

// Token Introspection (/oauth/introspect) - Validate active tokens
app.post('/oauth/introspect', async (req, res, next) => {
  try {
    // Wrap Express request in oauth2-server Request
    const oauthRequest = new OAuth2Server.Request(req);
    const oauthResponse = new OAuth2Server.Response(res);

    await oauth.introspect(oauthRequest, oauthResponse);

    // The oauth2-server handles the response automatically

  } catch (error) {
    next(error);
  }
});

// Token Revocation (/oauth/revoke) - Revoke tokens
app.post('/oauth/revoke', async (req, res, next) => {
  try {
    // Wrap Express request in oauth2-server Request
    const oauthRequest = new OAuth2Server.Request(req);
    const oauthResponse = new OAuth2Server.Response(res);

    await oauth.revoke(oauthRequest, oauthResponse);

    // The oauth2-server handles the response automatically

  } catch (error) {
    next(error);
  }
});

// Health Check and Metadata
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    oauthVersion: '2.0',
    platformsSupported: 37,
    server: 'Oracle Cloud',
    uptime: process.uptime()
  });
});

app.get('/.well-known/oauth-authorization-server', (req, res) => {
  // oauth2-server auto-handles discovery; customize here if needed
  res.json({
    issuer: process.env.OAUTH_ISSUER || `https://${req.get('host')}`,
    authorization_endpoint: `${process.env.OAUTH_ISSUER || `https://${req.get('host')}`}/oauth/authorize`,
    token_endpoint: `${process.env.OAUTH_ISSUER || `https://${req.get('host')}`}/oauth/token`,
    registration_endpoint: `${process.env.OAUTH_ISSUER || `https://${req.get('host')}`}/oauth/register`,
    introspection_endpoint: `${process.env.OAUTH_ISSUER || `https://${req.get('host')}`}/oauth/introspect`,
    revocation_endpoint: `${process.env.OAUTH_ISSUER || `https://${req.get('host')}`}/oauth/revoke`,
    scopes_supported: ['read:google', 'write:facebook' /* + your 37 platforms */],
    response_types_supported: ['code', 'token'],
    grant_types_supported: ['authorization_code', 'refresh_token', 'client_credentials'],
    token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post']
  });
});

// Centralized Error Handling (reduces custom error code)
app.use((error, req, res, next) => {
  console.error('OAuth Error:', error);
  res.status(error.code || 500).json({
    error: error.oauthError || 'Server Error',
    error_description: error.message
  });
});

// Fallback for existing UI routes (integrate src/ui/)
app.get('*', (req, res) => {
  // Proxy to your existing Workers UI or serve static
  res.json({ message: 'OAuth Hub Backend - Use /oauth/authorize or /tokens endpoints' });
});

// Server startup with HTTPS support
if (process.env.HTTPS === 'true') {
  const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH || '/etc/ssl/private/oauth-hub.key'),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH || '/etc/ssl/certs/oauth-hub.crt')
  };

  const server = https.createServer(httpsOptions, app);
  server.listen(port, process.env.HOST || '0.0.0.0', () => {
    console.log(`🔒 OAuth Hub HTTPS server running on port ${port}`);
    console.log(`🌐 Issuer: ${process.env.OAUTH_ISSUER || `https://localhost:${port}`}`);
  });
} else {
  app.listen(port, process.env.HOST || '0.0.0.0', () => {
    console.log(`🌐 OAuth Hub server running on port ${port}`);
    console.log(`🔗 Issuer: ${process.env.OAUTH_ISSUER || `http://localhost:${port}`}`);
  });
}

module.exports = app;

// Helper functions (simplified from existing utils)
function parseScopesToPlatforms(scopes) {
  // Reuse logic from src/core/platforms/ - map 'read:google' to Google config
  return scopes.split(' ').map(scope => ({ platform: scope.split(':')[1], action: scope.split(':')[0] }));
}

async function exchangeExternalToken(code, scopes) {
  // Integrate existing src/core/platforms/oauth/oauth-service.js
  // Use oauth4webapi to exchange with external provider
  const platform = scopes[0]?.split(':')[1];  // e.g., 'google'
  // ... call your existing exchangeCodeForToken(platform, code)
  return { access_token: 'external-token-placeholder' };
}

async function saveToken(token) {
  // Delegate to model
  await require('./models/oauth-model').saveToken(token, {}, {});
}

async function getTokenByPlatformUserId(platformUserId) {
  // Delegate to model
  return await require('./models/oauth-model').getAccessTokenByUserId(platformUserId);
}

function isTokenExpired(token) {
  return new Date(token.expiresAt) < new Date();
}

async function refreshTokenByUserId(platformUserId) {
  // Use oauth2-server refresh grant
  const refreshToken = await getRefreshToken(platformUserId);
  // ... oauth.refresh({ refreshToken })
  return { accessToken: 'refreshed-token', expiresAt: new Date(Date.now() + 3600000) };
}

function calculateExpiresIn(expiresAt) {
  return Math.floor((new Date(expiresAt) - Date.now()) / 1000);
}

function validateClientPlatforms(redirectUris, scopes) {
  // Ensure scopes map to supported platforms (your 37+)
  const supported = ['google', 'facebook' /* etc. */];
  return scopes.filter(scope => supported.includes(scope.split(':')[1]));
}

// Helper functions for backward compatibility
async function validateApiKey(apiKey) {
  // From your existing API_KEYS KV or model
  const client = await getClientByApiKey(apiKey);  // Implement in model
  return client;
}

function generateState() {
  return require('crypto').randomBytes(16).toString('hex');  // Secure random
}

function generatePKCEChallenge() {
  const verifier = require('crypto').randomBytes(32).toString('base64url');
  // Hash with SHA256 for challenge (implement full PKCE)
  return verifier;  // Simplified
}

async function getClientByApiKey(apiKey) {
  // Query model or KV for client by API key (your existing logic)
  // Placeholder
  return { id: 'test-client', redirectUris: ['http://localhost:3000/callback'] };
}
