// Full content for new models/oauth-model.js file
// OAuth2 Server Model - Handles storage and logic for clients, tokens, users (in-memory for demo; migrate to Oracle DB)

/**
 * In-memory storage placeholders - Replace with Oracle DB queries using oracledb
 * For production: Use OCI Autonomous Database for scalability
 */

const clients = new Map();  // clientId -> client object
const tokens = new Map();  // accessToken -> token object
const refreshTokens = new Map();  // refreshToken -> token object
const users = new Map();  // userId -> user object
const authorizationCodes = new Map();  // authorizationCode -> code object

// Generate unique IDs (simplified; use UUID in production)
let idCounter = 0;
function generateId() {
  return `id-${++idCounter}`;
}

// Import existing platform configs for scope validation
const PLATFORMS = require('../src/core/platforms/index.js').PLATFORMS;

// Model Methods Required by oauth2-server (simplifies custom storage logic)

// 1. Generate Access Token
async function generateAccessToken(client, user, scope) {
  const accessToken = generateId();
  const accessTokenLifetime = 3600;  // 1 hour

  const token = {
    accessToken,
    accessTokenLifetime,
    client: { id: client.id },
    user: { id: user.id },
    scope: scope.join(' '),
    platformUserId: user.platformUserId || user.id,  // Track platform-specific ID
    expiresAt: new Date(Date.now() + accessTokenLifetime * 1000).toISOString()
  };

  // Persist token
  tokens.set(accessToken, token);

  return {
    accessToken,
    tokenType: 'Bearer',
    userId: user.id,
    clientId: client.id,
    expiresAt: token.expiresAt
  };
}

// 2. Get Access Token (for validation)
async function getAccessToken(accessToken) {
  const token = tokens.get(accessToken);
  if (!token) return false;

  // Check expiration
  if (new Date(token.expiresAt) < new Date()) {
    tokens.delete(accessToken);  // Revoke expired
    return false;
  }

  // Map to platform scopes (integrate existing platforms)
  token.platformScopes = parseTokenScopes(token.scope);

  return {
    accessToken: token.accessToken,
    accessTokenLifetime: token.accessTokenLifetime,
    client: { id: token.client.id },
    user: { id: token.user.id, platformUserId: token.platformUserId },
    scope: token.scope.split(' ')
  };
}

// 3. Save Token
async function saveToken(token, client, user) {
  tokens.set(token.accessToken, {
    ...token,
    client: { id: client.id },
    user: { id: user.id, platformUserId: token.platformUserId },
    expiresAt: new Date(Date.now() + token.accessTokenLifetime * 1000).toISOString()
  });
}

// 4. Revoke Token
async function revokeToken(token) {
  tokens.delete(token.accessToken);
  if (token.refreshToken) {
    refreshTokens.delete(token.refreshToken);
  }
}

// 5. Get Client
async function getClient(clientId, clientSecret) {
  const client = clients.get(clientId);
  if (!client) return false;

  // Validate secret for confidential clients
  if (client.secret && client.secret !== clientSecret) return false;

  // Validate scopes against supported platforms
  if (client.grants && !validateClientGrants(client.grants)) return false;

  return {
    id: client.id,
    grants: client.grants || ['authorization_code', 'refresh_token'],
    redirectUris: client.redirectUris || [],
    accessTokenLifetime: client.accessTokenLifetime || 3600,
    refreshTokenLifetime: client.refreshTokenLifetime || 1209600,
    supportedPlatforms: client.supportedPlatforms || []  // Your 37+ platforms
  };
}

// 6. Save Client (for registration)
async function saveClient(client, user) {
  const newClient = {
    id: client.id || generateId(),
    name: client.name,
    secret: client.secret || null,  // Generate for confidential
    redirectUris: client.redirectUris || [],
    grants: client.grants || ['authorization_code'],
    accessTokenLifetime: client.accessTokenLifetime || 3600,
    supportedPlatforms: client.supportedPlatforms || validateClientPlatforms(client.redirectUris)
  };

  clients.set(newClient.id, newClient);
  return newClient;
}

// 7. Get User (by username/password or platform ID)
async function getUser(username, password) {
  const user = users.get(username);
  if (!user || user.password !== password) return false;  // Hash in production

  return { id: user.id, platformUserId: user.platformUserId };
}

// 8. Save User
async function saveUser(user) {
  users.set(user.username, user);
  return user;
}

// Refresh Token Methods
async function generateRefreshToken(client, user, scope) {
  const refreshToken = generateId();
  const refreshTokenLifetime = 1209600;  // 2 weeks

  const token = {
    refreshToken,
    refreshTokenLifetime,
    client: { id: client.id },
    user: { id: user.id },
    scope: scope.join(' ')
  };

  refreshTokens.set(refreshToken, token);
  return { refreshToken, refreshTokenLifetime };
}

async function getRefreshToken(refreshToken) {
  const token = refreshTokens.get(refreshToken);
  if (!token) return false;
  return {
    refreshToken: token.refreshToken,
    refreshTokenLifetime: token.refreshTokenLifetime,
    client: { id: token.client.id },
    user: { id: token.user.id },
    scope: token.scope.split(' ')
  };
}

async function revokeRefreshToken(refreshToken) {
  refreshTokens.delete(refreshToken);
}

// Authorization Code Methods
async function generateAuthorizationCode(client, user, scope) {
  const authorizationCode = generateId();
  const expiresAt = new Date(Date.now() + 600000); // 10 minutes

  const code = {
    authorizationCode,
    expiresAt,
    redirectUri: client.redirectUri,
    scope,
    client: { id: client.id },
    user: { id: user.id }
  };

  authorizationCodes.set(authorizationCode, code);
  return authorizationCode;
}

async function getAuthorizationCode(authorizationCode) {
  const code = authorizationCodes.get(authorizationCode);
  if (!code) return false;

  // Check expiration
  if (new Date(code.expiresAt) < new Date()) {
    authorizationCodes.delete(authorizationCode);
    return false;
  }

  return {
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    client: code.client,
    user: code.user
  };
}

async function saveAuthorizationCode(code, client, user) {
  const expiresAt = new Date(Date.now() + 600000); // 10 minutes

  const authCode = {
    authorizationCode: code.authorizationCode,
    expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    client: { id: client.id },
    user: { id: user.id }
  };

  authorizationCodes.set(code.authorizationCode, authCode);
  return authCode;
}

async function revokeAuthorizationCode(code) {
  authorizationCodes.delete(code.authorizationCode);
}

// Custom Methods for Your Platform (simplifies token retrieval by platformUserId)
async function getAccessTokenByUserId(platformUserId) {
  for (const [accessToken, token] of tokens) {
    if (token.platformUserId === platformUserId && new Date(token.expiresAt) > new Date()) {
      return { accessToken, ...token };
    }
  }
  return null;
}

async function getRefreshTokenByUserId(platformUserId) {
  // Find refresh token for user
  for (const [refreshToken, token] of refreshTokens) {
    if (token.user.id === platformUserId) {
      return refreshToken;
    }
  }
  return null;
}

async function getRefreshToken(refreshToken) {
  return refreshTokens.get(refreshToken) || false;
}

async function getAccessToken(token) {
  return tokens.get(token) || false;
}

async function revokeToken(token) {
  tokens.delete(token.accessToken);
  if (token.refreshToken) {
    refreshTokens.delete(token.refreshToken);
  }
}

async function getClientByApiKey(apiKey) {
  // Simple implementation - in production, query database
  // This should validate API keys from your existing system
  for (const [clientId, client] of clients) {
    if (client.apiKey === apiKey) {
      return client;
    }
  }
  return null;
}

async function saveClientToDB(client) {
  // Placeholder for Oracle DB insert
  console.log('Saving client to DB:', client);
  // await db.execute('INSERT INTO clients ...');
}

async function saveTokenToDB(token) {
  // Placeholder for Oracle DB insert
  console.log('Saving token to DB:', token);
  // await db.execute('INSERT INTO tokens ...');
}

// Helper Functions (integrated from existing utils/helpers.js)
function parseTokenScopes(scopeString) {
  return scopeString.split(' ').map(scope => {
    const [action, platform] = scope.split(':');
    return { action, platform, config: PLATFORMS[platform] };
  }).filter(item => item.config);  // Validate against supported platforms
}

function validateClientGrants(grants) {
  const valid = ['authorization_code', 'refresh_token', 'client_credentials'];
  return grants.every(grant => valid.includes(grant));
}

function validateClientPlatforms(redirectUris) {
  // Ensure redirects support your platforms (simplified)
  const supported = Object.keys(PLATFORMS);  // 37+ platforms
  return supported;  // Full support for now
}

// Export Model
module.exports = {
  // Required by oauth2-server
  generateAccessToken,
  getAccessToken,
  saveToken,
  revokeToken,
  getClient,
  saveClient,
  getUser,
  saveUser,
  generateRefreshToken,
  getRefreshToken,
  revokeRefreshToken,
  generateAuthorizationCode,
  getAuthorizationCode,
  saveAuthorizationCode,
  revokeAuthorizationCode,

  // Custom for platform
  getAccessTokenByUserId,
  getRefreshTokenByUserId,
  getClientByApiKey,
  saveClientToDB,
  saveTokenToDB
};
