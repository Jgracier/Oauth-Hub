// =============================================================================
// ⚡ OAUTH PLATFORM - MODULAR ENTRY POINT
// =============================================================================

import { CONFIG } from './core/config.js';
import { UNIFIED_CSS } from './ui/styles.js';
import { getNavigation, getSharedScript } from './ui/navigation.js';
import { getApiKeysPage } from './ui/pages/api-keys.js';
import { getAuthPage } from './ui/pages/auth.js';
import { getDashboardPage } from './ui/pages/dashboard.js';
import { getAppsPage } from './ui/pages/apps.js';
import { getDocsPage } from './ui/pages/docs.js';
import { getAnalyticsPage } from './ui/pages/analytics.js';
import { 
  jsonResponse, 
  htmlResponse, 
  getCorsHeaders,
  parseJsonBody,
  generateApiKey,
  generateId,
  sanitizeInput,
  validateEmail,
  errorResponse
} from './lib/utils/helpers.js';
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  createSessionCookie,
  getSessionFromRequest,
  generateOAuthState,
  validateOAuthState
} from './lib/auth/session.js';

// Helper function to find API key by searching all entries
async function validateApiKey(apiKey, env) {
  const { keys } = await env.API_KEYS.list();
  
  for (const keyInfo of keys) {
    if (keyInfo.name.startsWith('api-')) {
      const data = await env.API_KEYS.get(keyInfo.name);
      const keyData = JSON.parse(data);
      
      if (keyData.apiKey === apiKey) {
        return {
          email: keyData.userEmail,
          keyData: keyData,
          keyName: keyInfo.name
        };
      }
    }
  }
  
  return null;
}

// Helper function to find user by email by searching through entries
async function findUserByEmail(email, env) {
  const { keys } = await env.USERS.list();
  
  for (const keyInfo of keys) {
    if (keyInfo.name.startsWith('user ')) {
      const userData = await env.USERS.get(keyInfo.name);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.email === email) {
          return {
            userData: parsedUser,
            userKey: keyInfo.name
          };
        }
      }
    }
  }
  
  return null;
}

// Import OAuth backend
import { 
  generateConsentUrl,
  getStoredTokens,
  refreshStoredTokens,
  getPlatformConfig
} from './lib/auth/oauth.js';

// =============================================================================
// MAIN REQUEST HANDLER
// =============================================================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const corsHeaders = getCorsHeaders();

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // =============================================================================
      // API ENDPOINTS (Before page routes to avoid conflicts)
      // =============================================================================
      
      // Authentication (Login/Signup)
      if (path === '/auth' && method === 'POST') {
        return await handleAuth(request, env, corsHeaders);
      }
      
      // Logout endpoint
      if (path === '/logout' && method === 'POST') {
        const sessionToken = getSessionFromRequest(request);
        if (sessionToken) {
          await env.USERS.delete(`session:${sessionToken}`);
        }
        return jsonResponse({ success: true, message: 'Logged out' }, 200, {
          ...corsHeaders,
          'Set-Cookie': 'session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
        });
      }
      
      // Session check endpoint
      if (path === '/check-session' && method === 'GET') {
        const sessionToken = getSessionFromRequest(request);
        if (!sessionToken) {
          return jsonResponse({ authenticated: false }, 200, corsHeaders);
        }
        
        const sessionData = await env.USERS.get(`session:${sessionToken}`);
        if (!sessionData) {
          return jsonResponse({ authenticated: false }, 200, corsHeaders);
        }
        
        const session = JSON.parse(sessionData);
        return jsonResponse({ 
          authenticated: true,
          user: {
            email: session.email,
            name: session.name
          }
        }, 200, corsHeaders);
      }
      
      // API Key Management
      if (path === '/generate-key' && method === 'POST') {
        return await generateUserApiKey(request, env, corsHeaders);
      }
      
      if (path === '/user-keys' && method === 'GET') {
        return await getUserApiKeys(request, env, corsHeaders);
      }
      
      if (path.startsWith('/delete-key/') && method === 'DELETE') {
        const keyId = path.split('/').pop();
        return await deleteUserApiKey(keyId, request, env, corsHeaders);
      }
      
      // App Management
      if (path === '/save-app' && method === 'POST') {
        return await saveAppCredentials(request, env, corsHeaders);
      }
      
      if (path === '/user-apps' && method === 'GET') {
        return await getUserApps(request, env, corsHeaders);
      }
      
      if (path.startsWith('/delete-app/') && method === 'DELETE') {
        const platform = path.split('/')[2];
        return await deleteAppCredentials(platform, request, env, corsHeaders);
      }
      
      // Analytics Data API (only when email parameter is provided)
      if (path === '/analytics' && method === 'GET' && url.searchParams.get('email')) {
        return await getAnalyticsData(request, env, corsHeaders);
      }
      
      // OAuth Flow - Consent URL Generation
      if (path.startsWith('/consent/') && method === 'GET') {
        const pathParts = path.split('/');
        const platform = pathParts[2];
        const apiKey = pathParts[3];
        return await handleConsentRequest(platform, apiKey, request, env, corsHeaders);
      }
      
      // OAuth Flow - Unified Callback Handler
      if (path === '/callback' && method === 'GET') {
        return await handleOAuthCallback(request, env, corsHeaders);
      }
      
      // OAuth Flow - Token Retrieval (with auto-refresh)
      if (path.startsWith('/tokens/') && method === 'GET') {
        const [, , platformUserId, apiKey] = path.split('/');
        return await handleTokenRequest(platformUserId, apiKey, request, env, corsHeaders);
      }
      
      // OAuth Flow - Manual Token Refresh
      if (path.startsWith('/refresh/') && method === 'POST') {
        const [, , platformUserId, email] = path.split('/');
        return await handleRefreshRequest(platformUserId, email, request, env, corsHeaders);
      }
      
      // Token Revocation
      if (path.startsWith('/revoke-token/') && method === 'DELETE') {
        const [, , platformUserId, email] = path.split('/');
        return await revokeUserToken(platformUserId, email, request, env, corsHeaders);
      }
      
      
      
      // Health Check
      if (path === '/health') {
        return jsonResponse({
          status: '✅ OAuth Hub Online - Modular v2.0',
          version: '2.0-modular',
          timestamp: new Date().toISOString(),
          features: ['Authentication', 'API Keys', 'OAuth Apps', 'Token Management', 'Analytics']
        }, 200, corsHeaders);
      }

      // =============================================================================
      // PAGE ROUTES (After API endpoints to avoid conflicts)
      // =============================================================================
      
      // Auth Page (Login/Signup)
      if (path === '/' || path === '/auth') {
        return htmlResponse(getAuthPage(UNIFIED_CSS));
      }

      // Dashboard Page
      if (path === '/dashboard') {
        return htmlResponse(getDashboardPage(UNIFIED_CSS));
      }

      // API Keys Page
      if (path === '/api-keys') {
        return htmlResponse(getApiKeysPage(UNIFIED_CSS));
      }

      // App Credentials Page
      if (path === '/apps') {
        return htmlResponse(getAppsPage(UNIFIED_CSS));
      }

      // Documentation Page
      if (path === '/docs') {
        return htmlResponse(getDocsPage(UNIFIED_CSS));
      }

      // Analytics Page
      if (path === '/analytics') {
        return htmlResponse(getAnalyticsPage(UNIFIED_CSS));
      }

      // 404 Not Found
      return new Response('Not Found', { status: 404, headers: corsHeaders });
      
    } catch (error) {
      console.error('Request error:', error);
      return jsonResponse({ 
        error: 'Internal server error', 
        message: error.message 
      }, 500, corsHeaders);
    }
  }
};

// =============================================================================
// API HANDLER FUNCTIONS
// =============================================================================

// Authentication handler with secure sessions
async function handleAuth(request, env, corsHeaders) {
  try {
    const data = await parseJsonBody(request);
    const { mode, email, password, fullName } = data;
    
    if (!validateEmail(email) || !password) {
      return jsonResponse({ error: 'Invalid email or password' }, 400, corsHeaders);
    }
    
    if (mode === 'signup') {
      // Check if user already exists
      const existingUser = await findUserByEmail(email, env);
      if (existingUser) {
        return jsonResponse({ error: 'User already exists' }, 400, corsHeaders);
      }
      
      // Hash password securely
      const { hash, salt } = await hashPassword(password);
      
      // Create new user
      const apiKey = generateApiKey();
      const userId = generateId();
      
      // Parse first and last name from full name
      const nameParts = (fullName || email.split('@')[0]).split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const userData = {
        id: userId,
        email: sanitizeInput(email),
        name: sanitizeInput(fullName || email.split('@')[0]),
        firstName: sanitizeInput(firstName),
        lastName: sanitizeInput(lastName),
        passwordHash: hash,
        passwordSalt: salt,
        createdAt: new Date().toISOString()
      };
      
      // Store user
      const cleanUserKey = `user ${firstName} ${lastName} ${email}`;
      await env.USERS.put(cleanUserKey, JSON.stringify(userData));
      
      // Store default API key
      const apiKeyInfo = {
        userId, 
        email,
        firstName: firstName,
        lastName: lastName,
        fullName: fullName || email.split('@')[0],
        keyName: 'Default Key',
        apiKey: apiKey,
        createdAt: new Date().toISOString()
      };
      
      const defaultKeyName = 'Default Key';
      const cleanKey = `api-${defaultKeyName} ${firstName} ${lastName} ${email}`;
      
      // SAFEGUARD: Validate namespace usage before storing
      validateNamespaceUsage('API_KEYS', cleanKey, 'PUT');
      
      await env.API_KEYS.put(cleanKey, JSON.stringify({
        ...apiKeyInfo,
        keyId: generateId()
      }));
      
      // Create session
      const sessionToken = createSessionToken();
      const sessionData = {
        userId,
        email,
        name: userData.name,
        createdAt: Date.now()
      };
      
      // Store session in KV with 24 hour expiry
      await env.USERS.put(`session:${sessionToken}`, JSON.stringify(sessionData), {
        expirationTtl: 86400
      });
      
      // Return with session cookie
      const headers = {
        ...corsHeaders,
        'Set-Cookie': createSessionCookie(sessionToken)
      };
      
      return jsonResponse({
        success: true,
        apiKey,
        email: userData.email,
        name: userData.name,
        message: 'Account created successfully'
      }, 200, headers);
      
    } else if (mode === 'login') {
      // Login existing user
      const userResult = await findUserByEmail(email, env);
      if (!userResult) {
        return jsonResponse({ error: 'Invalid email or password' }, 401, corsHeaders);
      }
      
      const user = userResult.userData;
      
      // Verify password
      const isValid = await verifyPassword(password, user.passwordHash, user.passwordSalt);
      if (!isValid) {
        return jsonResponse({ error: 'Invalid email or password' }, 401, corsHeaders);
      }
      
      // Get user's default API key
      const { keys } = await env.API_KEYS.list();
      let userApiKey = null;
      
      for (const keyInfo of keys) {
        if (keyInfo.name.includes('Default Key') && keyInfo.name.includes(email)) {
          const keyData = await env.API_KEYS.get(keyInfo.name);
          const parsed = JSON.parse(keyData);
          if (parsed.userEmail === email || parsed.email === email) {
            userApiKey = parsed.apiKey;
            break;
          }
        }
      }
      
      // Create session
      const sessionToken = createSessionToken();
      const sessionData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        createdAt: Date.now()
      };
      
      // Store session in KV with 24 hour expiry
      await env.USERS.put(`session:${sessionToken}`, JSON.stringify(sessionData), {
        expirationTtl: 86400
      });
      
      // Return with session cookie
      const headers = {
        ...corsHeaders,
        'Set-Cookie': createSessionCookie(sessionToken)
      };
      
      return jsonResponse({
        success: true,
        apiKey: userApiKey,
        email: user.email,
        name: user.name,
        message: 'Login successful'
      }, 200, headers);
    }
    
    return jsonResponse({ error: 'Invalid mode' }, 400, corsHeaders);
    
  } catch (error) {
    return jsonResponse({ error: 'Authentication failed', message: error.message }, 500, corsHeaders);
  }
}

// API key management
async function generateUserApiKey(request, env, corsHeaders) {
  try {
    const data = await parseJsonBody(request);
    const { email, name } = data;
    
    // Validate required fields
    if (!email || !name) {
      return jsonResponse({ error: 'Email and name are required' }, 400, corsHeaders);
    }
    // Get user by searching directly
    const userResult = await findUserByEmail(email, env);
    if (!userResult) {
      return jsonResponse({ error: 'User not found' }, 404, corsHeaders);
    }
    
    const user = userResult.userData;
    const newApiKey = generateApiKey();
    const newKeyData = {
      id: generateId(),
      name: sanitizeInput(name) || 'API Key',
      key: newApiKey,
      createdAt: new Date().toISOString()
    };
    
    // Store API key with full user info for better Cloudflare visibility
    const firstName = user.firstName || user.name?.split(' ')[0] || '';
    const lastName = user.lastName || user.name?.split(' ')[1] || '';
    const fullName = user.name || `${firstName} ${lastName}`.trim() || email.split('@')[0];
    
    const apiKeyData = {
      userId: user.id, 
      userEmail: email, // Use userEmail for consistency
      email: email, // Keep email as fallback
      firstName: firstName,
      lastName: lastName,
      fullName: fullName,
      keyName: name,
      apiKey: newApiKey, // Store actual API key for deletion lookup
      createdAt: new Date().toISOString()
    };
    
    // Store API key with resource type first - "api-keyname firstname lastname email"
    const cleanKey = `api-${name} ${firstName} ${lastName} ${email}`; // Resource type first for easy identification
    
    // SAFEGUARD: Validate namespace usage before storing
    validateNamespaceUsage('API_KEYS', cleanKey, 'PUT');
    
    // Store with clean key containing all data - ONLY this entry needed
    await env.API_KEYS.put(cleanKey, JSON.stringify({
      ...apiKeyData,
      keyId: newKeyData.id // Add key ID for management
    }));
    
    return jsonResponse({
      success: true,
      key: newKeyData,
      message: 'API key generated successfully'
    }, 200, corsHeaders);
    
  } catch (error) {
    return jsonResponse({ error: 'Failed to generate API key', message: error.message }, 500, corsHeaders);
  }
}

async function getUserApiKeys(request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return jsonResponse({ error: 'Email required' }, 401, corsHeaders);
    }
    // Get user by searching directly
    const userResult = await findUserByEmail(email, env);
    if (!userResult) {
      return jsonResponse({ error: 'User not found' }, 404, corsHeaders);
    }
    
    // Search through all API key entries to find ones belonging to this user
    const { keys } = await env.API_KEYS.list();
    const apiKeys = [];
    
    for (const keyInfo of keys) {
      if (keyInfo.name.startsWith('api-') && keyInfo.name.includes(email)) {
        const keyData = await env.API_KEYS.get(keyInfo.name);
        const parsedData = JSON.parse(keyData);
        
        // Verify this key belongs to the user (check both old and new field names)
        const userEmailMatch = parsedData.userEmail === email || parsedData.email === email;
        if (userEmailMatch) {
          apiKeys.push({
            id: parsedData.keyId || parsedData.id,
            name: parsedData.keyName || parsedData.name || 'API Key',
            key: (parsedData.apiKey || parsedData.key) ? (parsedData.apiKey || parsedData.key).substring(0, 12) + '...' : 'sk_hidden', // Show partial key
            createdAt: parsedData.createdAt
          });
        }
      }
    }
    
    return jsonResponse({
      success: true,
      keys: apiKeys
    }, 200, corsHeaders);
    
  } catch (error) {
    return jsonResponse({ error: 'Failed to fetch API keys', message: error.message }, 500, corsHeaders);
  }
}

// App credentials management
async function saveAppCredentials(request, env, corsHeaders) {
  try {
    const data = await parseJsonBody(request);
    const { email, platform, name, clientId, clientSecret, scopes, redirectUri } = data;
    
    // Validate required fields
    if (!email || !platform || !clientId || !clientSecret) {
      return jsonResponse({ error: 'Missing required fields: email, platform, clientId, clientSecret' }, 400, corsHeaders);
    }
    // Get user by searching directly
    const userResult = await findUserByEmail(email, env);
    if (!userResult) {
      return jsonResponse({ error: 'User not found' }, 404, corsHeaders);
    }
    
    const user = userResult.userData;
    
    // Store OAuth app with resource type first - "oauth-platform firstname lastname email"
    const appKey = `oauth-${platform} ${user.firstName || ''} ${user.lastName || ''} ${email}`;
    const appData = {
      userEmail: email,
      userName: user.name,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      platform: sanitizeInput(platform),
      name: sanitizeInput(name),
      clientId: sanitizeInput(clientId),
      clientSecret: sanitizeInput(clientSecret),
      scopes: Array.isArray(scopes) ? scopes.map(s => sanitizeInput(s)) : [],
      redirectUri: sanitizeInput(redirectUri),
      createdAt: new Date().toISOString()
    };
    
    // Store OAuth app with clean key
    await env.API_KEYS.put(appKey, JSON.stringify(appData));
    
    // No need for tracking list - we search directly through entries
    
    return jsonResponse({
      success: true,
      app: appData,
      message: 'App credentials saved successfully'
    }, 200, corsHeaders);
    
  } catch (error) {
    return jsonResponse({ error: 'Failed to save app credentials', message: error.message }, 500, corsHeaders);
  }
}

async function getUserApps(request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return jsonResponse({ error: 'Email required' }, 401, corsHeaders);
    }
    // Get user by searching directly
    const userResult = await findUserByEmail(email, env);
    if (!userResult) {
      return jsonResponse({ error: 'User not found' }, 404, corsHeaders);
    }
    
    // Get user info for building key names
    const user = userResult.userData;
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    // Search directly through all OAuth app entries for this user
    const { keys } = await env.API_KEYS.list();
    const apps = [];
    
    for (const keyInfo of keys) {
      // Look for OAuth app entries that belong to this user
      if (keyInfo.name.startsWith('oauth-') && keyInfo.name.includes(email)) {
        const appData = await env.API_KEYS.get(keyInfo.name);
        if (appData) {
          const app = JSON.parse(appData);
          // Verify this app belongs to the requesting user
          if (app.userEmail === email || app.email === email) {
            // Remove user info from response
            delete app.userEmail;
            delete app.userName;
            delete app.firstName;
            delete app.lastName;
            apps.push(app);
          }
        }
      }
    }
    
    return jsonResponse({
      success: true,
      apps: apps
    }, 200, corsHeaders);
    
  } catch (error) {
    return jsonResponse({ error: 'Failed to fetch apps', message: error.message }, 500, corsHeaders);
  }
}

async function deleteAppCredentials(platform, request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return jsonResponse({ error: 'Email required' }, 401, corsHeaders);
    }
    // Get user by searching directly
    const userResult = await findUserByEmail(email, env);
    if (!userResult) {
      return jsonResponse({ error: 'User not found' }, 404, corsHeaders);
    }
    
    // Get user info for building key names
    const user = userResult.userData;
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    // Delete OAuth app from storage
    const appKey = `oauth-${platform} ${firstName} ${lastName} ${email}`;
    await env.API_KEYS.delete(appKey);
    
    // No need to update tracking list - we search directly through entries
    
    return jsonResponse({
      success: true,
      message: 'App credentials deleted successfully'
    }, 200, corsHeaders);
    
  } catch (error) {
    return jsonResponse({ error: 'Failed to delete app credentials', message: error.message }, 500, corsHeaders);
  }
}

// OAuth flow handlers - streamlined
async function handleConsentRequest(platform, apiKey, request, env, corsHeaders) {
  try {
    if (!apiKey) {
      return jsonResponse({ error: 'API key required in URL path' }, 401, corsHeaders);
    }
    
    // Validate API key and get user
    const validationResult = await validateApiKey(apiKey, env);
    if (!validationResult) {
      return jsonResponse({ error: 'Invalid API key' }, 401, corsHeaders);
    }
    
    const { email } = validationResult;
    // Get user by searching directly
    const userResult = await findUserByEmail(email, env);
    if (!userResult) {
      return jsonResponse({ error: 'User not found' }, 404, corsHeaders);
    }
    
    // Get user info for building key names
    const user = userResult.userData;
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    // Get OAuth app credentials from storage
    const appKey = `oauth-${platform.toLowerCase()} ${firstName} ${lastName} ${email}`;
    const appData = await env.API_KEYS.get(appKey);
    const app = appData ? JSON.parse(appData) : null;
    
    if (!app) {
      return jsonResponse({ 
        error: 'No app credentials found for platform',
        message: `Please add ${platform} credentials in the App Credentials page first`
      }, 400, corsHeaders);
    }
    
    // Generate simple state with user info
    const state = generateOAuthState(email, platform);
    
    // Store state temporarily for validation (5 minute expiry)
    await env.OAUTH_TOKENS.put(`state:${state}`, JSON.stringify({
      email,
      platform,
      userId: user.id,
      timestamp: Date.now()
    }), { expirationTtl: 300 });
    
    // Generate consent URL using the OAuth backend
    const consentUrl = generateConsentUrl(platform, app, state);
    
    return jsonResponse({
      platform: platform.toUpperCase(),
      consentUrl,
      state,
      message: `OAuth consent URL for ${platform.toUpperCase()}`
    }, 200, corsHeaders);
    
  } catch (error) {
    return jsonResponse({ 
      error: 'Failed to generate consent URL', 
      message: error.message 
    }, 500, corsHeaders);
  }
}

async function handleTokenRequest(platformUserId, apiKey, request, env, corsHeaders) {
  try {
    if (!apiKey) {
      return jsonResponse({ error: 'API key required in URL path' }, 401, corsHeaders);
    }
    
    // Validate API key
    const validationResult = await validateApiKey(apiKey, env);
    if (!validationResult) {
      return jsonResponse({ error: 'Invalid API key' }, 401, corsHeaders);
    }
    const { email } = validationResult;
    
    // Find tokens for this platform user ID across all platforms
    const tokenKey = await findTokenKeyByPlatformUserId(platformUserId, env);
    if (!tokenKey) {
      return jsonResponse({ 
        error: 'No tokens found',
        message: 'User has not authorized this app yet'
      }, 404, corsHeaders);
    }
    
    // Get token data directly from the found token key
    const tokenData = await env.OAUTH_TOKENS.get(tokenKey);
    if (!tokenData) {
      return jsonResponse({ 
        error: 'Token data not found',
        message: 'Token key exists but data is missing'
      }, 500, corsHeaders);
    }
    
    const tokens = JSON.parse(tokenData);
    
    // Return only OAuth token fields, not user data
    return jsonResponse({
      accessToken: tokens.accessToken,
      tokenType: tokens.tokenType || 'bearer',
      expiresAt: tokens.expiresAt,
      platform: tokens.platform,
      platformUserId: tokens.platformUserId
    }, 200, corsHeaders);
    
  } catch (error) {
    return jsonResponse({ 
      error: 'Failed to retrieve tokens', 
      message: error.message 
    }, 500, corsHeaders);
  }
}

async function handleRefreshRequest(platformUserId, email, request, env, corsHeaders) {
  try {
    if (!email) {
      return jsonResponse({ error: 'Email required in URL path' }, 401, corsHeaders);
    }
    
    // Verify user exists
    const userResult = await findUserByEmail(email, env);
    if (!userResult) {
      return jsonResponse({ error: 'User not found' }, 404, corsHeaders);
    }
    
    // Find tokens for this platform user ID across all platforms
    const tokenKey = await findTokenKeyByPlatformUserId(platformUserId, env);
    if (!tokenKey) {
      return jsonResponse({ 
        error: 'No tokens found',
        message: 'User has not authorized this app yet'
      }, 404, corsHeaders);
    }
    
    // Get token data directly from the found token key  
    const tokenData = await env.OAUTH_TOKENS.get(tokenKey);
    if (!tokenData) {
      return jsonResponse({ 
        error: 'Token data not found',
        message: 'Token key exists but data is missing'
      }, 500, corsHeaders);
    }
    
    const tokens = JSON.parse(tokenData);
    
    // Check if refresh token is available
    if (!tokens.refreshToken) {
      return jsonResponse({ 
        error: 'Failed to refresh tokens',
        message: 'No refresh token available'
      }, 400, corsHeaders);
    }
    
    // For now, return existing tokens (refresh logic can be added later)
    // TODO: Implement actual token refresh logic here
    
    return jsonResponse({
      ...tokens,
      refreshed: true
    }, 200, corsHeaders);
    
  } catch (error) {
    return jsonResponse({ 
      error: 'Failed to refresh tokens', 
      message: error.message 
    }, 500, corsHeaders);
  }
}

// OAuth callback handler
async function handleOAuthCallback(request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    
    // Extract platform from state parameter (format: platform_timestamp or just platform)
    let platform = 'facebook'; // default fallback
    if (state) {
      const stateParts = state.split('_');
      if (stateParts.length > 0) {
        platform = stateParts[0];
      }
    }
    
    if (error) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authorization Failed</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
              text-align: center; 
              padding: 40px 20px; 
              background: #fff2f2;
              color: #333;
            }
            .error-icon { font-size: 64px; margin-bottom: 20px; }
            .error-title { color: #dc3545; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="error-icon">❌</div>
          <h1 class="error-title">Authorization Failed</h1>
          <p><strong>${platform.toUpperCase()}</strong> authorization was declined or failed.</p>
          <p><strong>Error:</strong> ${error}</p>
          <p><strong>Description:</strong> ${url.searchParams.get('error_description') || 'Unknown error'}</p>
          <p>This window will close automatically...</p>
          
          <script>
            // Send error to parent immediately
            const errorData = {
              type: 'oauth_error',
              platform: '${platform}',
              error: '${error}',
              description: '${url.searchParams.get('error_description') || 'Unknown error'}'
            };
            
            if (window.opener && !window.opener.closed) {
              window.opener.postMessage(errorData, '*');
            }
            if (window.parent && window.parent !== window) {
              window.parent.postMessage(errorData, '*');
            }
            
            setTimeout(() => {
              try {
                window.close();
              } catch (e) {
                document.body.innerHTML += '<p>You can close this window.</p>';
              }
            }, 3000);
          </script>
        </body>
        </html>
      `, { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'text/html' } 
      });
    }
    
    if (!code) {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Missing Authorization Code</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
              text-align: center; 
              padding: 40px 20px; 
              background: #fff2f2;
              color: #333;
            }
            .error-icon { font-size: 64px; margin-bottom: 20px; }
            .error-title { color: #dc3545; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="error-icon">❌</div>
          <h1 class="error-title">Missing Authorization Code</h1>
          <p>No authorization code received from <strong>${platform.toUpperCase()}</strong></p>
          <p>This window will close automatically...</p>
          
          <script>
            setTimeout(() => {
              try {
                window.close();
              } catch (e) {
                if (window.parent && window.parent !== window) {
                  window.parent.postMessage({ type: 'oauth_error', platform: '${platform}', error: 'Missing authorization code' }, '*');
                }
              }
            }, 5000);
          </script>
        </body>
        </html>
      `, { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'text/html' } 
      });
    }
    
    try {
      // Exchange authorization code for tokens
      const tokenResult = await exchangeOAuthCodeForTokens(platform, code, env);
      
      if (!tokenResult.success) {
        throw new Error(tokenResult.error);
      }
      
      const { tokens, platformUserId } = tokenResult;
      
      // Get user info from the state parameter if available
      let userInfo = {};
      if (state && state.includes('_')) {
        try {
          const stateParts = state.split('_');
          if (stateParts.length > 2) {
            // State format: platform_timestamp_email
            userInfo.email = stateParts[2];
          }
        } catch (e) {
          console.log('Could not extract user info from state');
        }
      }
      
      // Store tokens in KV storage with user info
      await storeOAuthTokens(platform, platformUserId, tokens, env, userInfo);
      
      // Return success page with direct data to parent window
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authorization Successful</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
              text-align: center; 
              padding: 40px 20px; 
              background: #f0f9ff;
              color: #333;
            }
            .success-icon { font-size: 64px; margin-bottom: 20px; }
            .success-title { color: #10b981; margin: 20px 0; }
            .loading { color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="success-icon">✅</div>
          <h1 class="success-title">Connected Successfully!</h1>
          <p class="loading">Completing connection...</p>
          
          <script>
            // Send complete data to parent window
            const data = {
              type: 'oauth_complete',
              platform: '${platform}',
              platformUserId: '${platformUserId}',
              tokens: {
                accessToken: '${tokens.accessToken}',
                expiresAt: ${tokens.expiresAt || 'null'},
                tokenType: '${tokens.tokenType || 'bearer'}'
              }
            };
            
            // Try multiple methods to communicate with parent
            if (window.opener && !window.opener.closed) {
              window.opener.postMessage(data, '*');
              console.log('Sent data to opener');
            }
            
            if (window.parent && window.parent !== window) {
              window.parent.postMessage(data, '*');
              console.log('Sent data to parent');
            }
            
            // Also broadcast to any listening windows
            if (window.top && window.top !== window) {
              window.top.postMessage(data, '*');
            }
            
            // Close after a short delay to ensure message is sent
            setTimeout(() => {
              try {
                window.close();
              } catch (e) {
                // If close fails, show user they can close manually
                document.querySelector('.loading').textContent = 'You can now close this window.';
              }
            }, 1000);
          </script>
        </body>
        </html>
      `, {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
      
    } catch (tokenError) {
      console.error('Token exchange failed:', tokenError);
      
      // Return auto-closing error page
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authorization Failed</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
              text-align: center; 
              padding: 40px 20px; 
              background: #fff2f2;
              color: #333;
            }
            .error-icon { font-size: 64px; margin-bottom: 20px; }
            .error-title { color: #dc3545; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="error-icon">❌</div>
          <h1 class="error-title">Authorization Failed</h1>
          <p>Failed to complete ${platform} authorization.</p>
          <p>Error: ${tokenError.message}</p>
          <p>This window will close automatically...</p>
          
          <script>
            setTimeout(() => {
              try {
                window.close();
              } catch (e) {
                if (window.parent && window.parent !== window) {
                  window.parent.postMessage({ type: 'oauth_error', platform: '${platform}', error: '${tokenError.message}' }, '*');
                }
              }
            }, 5000);
          </script>
        </body>
        </html>
      `, {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' }
      });
    }
    
  } catch (error) {
    return jsonResponse({ 
      error: 'OAuth callback failed', 
      message: error.message 
    }, 500, corsHeaders);
  }
}

// OAuth token exchange helper functions
async function exchangeOAuthCodeForTokens(platform, code, env) {
  try {
    // We need to find which user has app credentials for this platform
    // For now, we'll use environment variables as fallback
    const appConfig = {
      clientId: env[`${platform.toUpperCase()}_CLIENT_ID`],
      clientSecret: env[`${platform.toUpperCase()}_CLIENT_SECRET`]
    };
    
    if (!appConfig.clientId || !appConfig.clientSecret) {
      return { success: false, error: `App credentials not found for ${platform}` };
    }
    
    // Get platform configuration
    const platformConfig = getPlatformConfig(platform, appConfig);
    if (!platformConfig) {
      return { success: false, error: `Platform ${platform} not configured` };
    }
    
    // Prepare token exchange request
    const redirectUri = CONFIG.WWW_CALLBACK_URL;
    
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: appConfig.clientId,
      client_secret: appConfig.clientSecret
    });
    
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    };
    
    // Exchange code for tokens
    const response = await fetch(platformConfig.tokenUrl, {
      method: 'POST',
      headers: headers,
      body: body.toString()
    });
    
    const tokenData = await response.json();
    
    if (!response.ok) {
      return { success: false, error: `Token exchange failed: ${tokenData.error || tokenData.error_description || 'Unknown error'}` };
    }
    
    // Get user info to extract platform user ID
    const userInfo = await getPlatformUserInfo(platform, tokenData.access_token, platformConfig);
    if (!userInfo.success) {
      return { success: false, error: `Failed to get user info: ${userInfo.error}` };
    }
    
    const tokens = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      tokenType: tokenData.token_type || 'bearer',
      scope: tokenData.scope,
      expiresAt: Date.now() + (tokenData.expires_in * 1000),
      createdAt: Date.now()
    };
    
    return { 
      success: true, 
      tokens, 
      platformUserId: userInfo.platformUserId 
    };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function getPlatformUserInfo(platform, accessToken, platformConfig) {
  try {
    const userInfoUrl = platformConfig.userInfoUrl;
    
    if (!userInfoUrl) {
      return { success: false, error: `User info URL not configured for platform ${platform}` };
    }
    
    let requestUrl = userInfoUrl;
    
    // Add required fields for specific platforms
    if (platform.toLowerCase() === 'facebook') {
      requestUrl += '?fields=id,name,email';
    }
    
    const response = await fetch(requestUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });
    
    const userData = await response.json();
    
    if (!response.ok) {
      return { success: false, error: `User info request failed: ${userData.error || 'Unknown error'}` };
    }
    
    // Extract platform user ID based on platform
    let platformUserId;
    if (platform.toLowerCase() === 'x' || platform.toLowerCase() === 'twitter') {
      platformUserId = userData.data?.id;
    } else {
      platformUserId = userData.id;
    }
    
    if (!platformUserId) {
      return { success: false, error: 'Could not extract platform user ID' };
    }
    
    return { success: true, platformUserId: platformUserId.toString() };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function storeOAuthTokens(platform, platformUserId, tokens, env, userInfo = {}) {
  // Get actual user info from USERS namespace instead of defaulting to "Unknown User"
  const email = userInfo.email || 'unknown';
  let name = userInfo.name || userInfo.fullName;
  let firstName = userInfo.firstName;
  let lastName = userInfo.lastName;
  
  // If no name provided, try to get user info from USERS namespace
  if (!name && email !== 'unknown') {
    try {
      const userResult = await findUserByEmail(email, env);
      if (userResult) {
        const user = userResult.userData;
        name = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
        firstName = user.firstName || '';
        lastName = user.lastName || '';
      }
    } catch (e) {
      console.log('Could not fetch user data for token storage:', e);
    }
  }
  
  // Fallback values only if we still don't have user info
  name = name || 'Unknown User';
  firstName = firstName || name.split(' ')[0] || '';
  lastName = lastName || name.split(' ')[1] || '';
  
  // Token key with resource type first - "token-platform firstname lastname email"
  const tokenKey = `token-${platform} ${firstName} ${lastName} ${email}`;
  
  const tokenData = {
    platform,
    platformUserId,
    userEmail: email,
    userName: name,
    firstName: firstName,
    lastName: lastName,
    ...tokens,
    updatedAt: Date.now()
  };
  
  // Store ONLY the main token entry - no lookup entry needed
  await env.OAUTH_TOKENS.put(tokenKey, JSON.stringify(tokenData));
}

// Helper function to find token key by platform user ID
async function findTokenKeyByPlatformUserId(platformUserId, env) {
  // Search through all token entries to find one with matching platformUserId
  const { keys } = await env.OAUTH_TOKENS.list();
  
  for (const keyInfo of keys) {
    if (keyInfo.name.startsWith('token-')) {
      try {
        const tokenData = await env.OAUTH_TOKENS.get(keyInfo.name);
        const parsedData = JSON.parse(tokenData);
        
        // Try both exact match and string conversion
        if (parsedData.platformUserId === platformUserId || 
            parsedData.platformUserId === String(platformUserId) ||
            String(parsedData.platformUserId) === String(platformUserId)) {
          return keyInfo.name;
        }
      } catch (error) {
        console.log(`Error parsing token data for ${keyInfo.name}:`, error);
        continue;
      }
    }
  }
  
  return null;
}


// Missing helper functions
async function deleteUserApiKey(keyId, request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return jsonResponse({ error: 'Email required' }, 401, corsHeaders);
    }
    
    // Get user by searching directly
    const userResult = await findUserByEmail(email, env);
    if (!userResult) {
      return jsonResponse({ error: 'User not found' }, 404, corsHeaders);
    }
    
    // Search through all API key entries to find the one to delete
    const { keys } = await env.API_KEYS.list();
    let deleted = false;
    
    for (const keyInfo of keys) {
      if (keyInfo.name.startsWith('api-') && keyInfo.name.includes(email)) {
        const keyData = await env.API_KEYS.get(keyInfo.name);
        const parsedData = JSON.parse(keyData);
        
        // Check if this is the key to delete and belongs to the user (check multiple possible ID fields and formats)
        const keyMatches = (parsedData.keyId === keyId) || 
                          (parsedData.id === keyId) || 
                          (parsedData.keyName === keyId) || 
                          (parsedData.name === keyId) ||
                          (keyInfo.name.includes(keyId));
        
        const userMatches = (parsedData.userEmail === email) || (parsedData.email === email);
        
        if (keyMatches && userMatches) {
          await env.API_KEYS.delete(keyInfo.name);
          deleted = true;
          break;
        }
      }
    }
    
    
    if (!deleted) {
      return jsonResponse({ error: 'API key not found' }, 404, corsHeaders);
    }
    
    return jsonResponse({
      success: true,
      message: 'API key deleted successfully'
    }, 200, corsHeaders);
    
  } catch (error) {
    return jsonResponse({ error: 'Failed to delete API key', message: error.message }, 500, corsHeaders);
  }
}

async function revokeUserToken(platformUserId, email, request, env, corsHeaders) {
  try {
    if (!email) {
      return jsonResponse({ error: 'Email required in URL path' }, 401, corsHeaders);
    }
    
    // Verify user exists
    const userResult = await findUserByEmail(email, env);
    if (!userResult) {
      return jsonResponse({ error: 'User not found' }, 404, corsHeaders);
    }
    
    // Find tokens for this platform user ID across all platforms
    const tokenKey = await findTokenKeyByPlatformUserId(platformUserId, env);
    if (!tokenKey) {
      return jsonResponse({ 
        error: 'No tokens found',
        message: 'User has not authorized this app yet'
      }, 404, corsHeaders);
    }
    
    await env.OAUTH_TOKENS.delete(tokenKey);
    
    return jsonResponse({
      success: true,
      message: `Token for user ${platformUserId} revoked successfully`
    }, 200, corsHeaders);
    
  } catch (error) {
    return jsonResponse({ error: 'Failed to revoke token', message: error.message }, 500, corsHeaders);
  }
}


// Analytics helper function to track events (ONLY in analytics namespace)
async function trackAnalyticsEvent(eventType, eventData, env) {
  try {
    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const eventKey = `analytics:event:${new Date().toISOString().split('T')[0]}:${eventId}`;
    
    const analyticsEvent = {
      eventId,
      eventType,
      timestamp: Date.now(),
      date: new Date().toISOString(),
      ...eventData
    };
    
    // CRITICAL SAFEGUARD: Ensure analytics events NEVER go to API_KEYS namespace
    if (!env.analytics) {
      console.error('CRITICAL: Analytics namespace not available - analytics event NOT stored');
      return;
    }
    
    // IMPORTANT: Store ONLY in analytics namespace, never in API_KEYS
    await env.analytics.put(eventKey, JSON.stringify(analyticsEvent));
    
  } catch (error) {
    console.error('Failed to track analytics event:', error);
    // Don't throw - analytics failures shouldn't break the main flow
  }
}

// Safeguard function to prevent analytics data in wrong namespace
function validateNamespaceUsage(namespace, key, operation) {
  // Prevent analytics events from being stored in API_KEYS namespace
  if (namespace === 'API_KEYS' && (key.includes('analytics:event') || key.includes('evt_'))) {
    throw new Error(`BLOCKED: Attempted to store analytics event "${key}" in API_KEYS namespace. Use analytics namespace instead.`);
  }
  
  // Prevent API keys from being stored in analytics namespace
  if (namespace === 'analytics' && key.startsWith('api-')) {
    throw new Error(`BLOCKED: Attempted to store API key "${key}" in analytics namespace. Use API_KEYS namespace instead.`);
  }
}

// Analytics and other handlers
async function getAnalyticsData(request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return jsonResponse({ error: 'Email required' }, 401, corsHeaders);
    }
    
    // Verify user exists
    const userResult = await findUserByEmail(email, env);
    if (!userResult) {
      return jsonResponse({ error: 'User not found' }, 404, corsHeaders);
    }
    
    // Get real analytics data from analytics namespace (not API_KEYS!)
    let tokens = [];
    let apiCalls = 0;
    let uniqueUsers = 0;
    let platforms = 0;
    
    try {
      // Get tokens from OAUTH_TOKENS namespace for this user
      const { keys: tokenKeys } = await env.OAUTH_TOKENS.list();
      const userTokens = [];
      
      for (const keyInfo of tokenKeys) {
        if (keyInfo.name.includes(email)) {
          const tokenData = await env.OAUTH_TOKENS.get(keyInfo.name);
          if (tokenData) {
            const token = JSON.parse(tokenData);
            userTokens.push(token);
          }
        }
      }
      
      tokens = userTokens;
      uniqueUsers = new Set(tokens.map(t => t.platformUserId)).size;
      platforms = new Set(tokens.map(t => t.platform)).size;
      
      // Get API call analytics from analytics namespace (if implemented)
      // For now, return 0 as we don't track API calls yet
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
    
    return jsonResponse({
      success: true,
      tokens,
      stats: {
        totalTokens: tokens.length,
        apiCalls,
        uniqueUsers,
        platforms
      }
    }, 200, corsHeaders);
    
  } catch (error) {
    return jsonResponse({ 
      error: 'Failed to fetch analytics', 
      message: error.message 
    }, 500, corsHeaders);
  }
}