// =============================================================================
// ⚡ OAUTH PLATFORM - MODULAR ENTRY POINT
// =============================================================================

import { UNIFIED_CSS } from './shared/styles.js';
import { getNavigation, getSharedScript } from './shared/navigation.js';
import { getApiKeysPage } from './pages/api-keys.js';
import { getAuthPage } from './pages/auth.js';
import { getDashboardPage } from './pages/dashboard.js';
import { getAppsPage } from './pages/apps.js';
import { getDocsPage } from './pages/docs.js';
import { getAnalyticsPage } from './pages/analytics.js';
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
} from './utils/helpers.js';
import {
  generateJWT,
  verifyJWT,
  hashPassword,
  verifyPassword,
  generateSecureState,
  validateSecureState,
  getSecurityHeaders,
  createSessionCookie,
  getSessionFromCookie
} from './utils/security.js';
import { authMiddleware } from './middleware/auth.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';
import { getOAuthPopupScript } from './client/oauth-popup.js';

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

// Helper function to find user by email using optimized lookup
async function findUserByEmail(email, env) {
  try {
    // First try the optimized email lookup
    const userId = await env.USERS.get(`email:${email}`);
    if (userId) {
      const userData = await env.USERS.get(`user:${userId}`);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        return {
          userData: parsedUser,
          userKey: `user:${userId}`
        };
      }
    }
    
    // Fallback: search through all entries (for backward compatibility)
    const { keys } = await env.USERS.list();
    
    for (const keyInfo of keys) {
      // Check both old format (user FirstName LastName email) and new format (user:UUID)
      if (keyInfo.name.startsWith('user ') || keyInfo.name.startsWith('user:')) {
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
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

// Import OAuth backend
import { 
  generateConsentUrl,
  getStoredTokens,
  refreshStoredTokens,
  getPlatformConfig
} from './oauth/backend.js';

// =============================================================================
// MAIN REQUEST HANDLER
// =============================================================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const corsHeaders = { ...getCorsHeaders(), ...getSecurityHeaders() };
    const userAgent = request.headers.get('User-Agent') || 'Unknown';
    const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'Unknown';

    console.log(`🚀 ===== REQUEST START =====`);
    console.log(`🚀 MAIN HANDLER: ${method} ${path}`);
    console.log(`🚀 CLIENT: ${clientIP} | UA: ${userAgent.substring(0, 50)}...`);
    console.log(`🚀 TIMESTAMP: ${new Date().toISOString()}`);
    console.log(`🚀 REQUEST HEADERS:`, Object.fromEntries(request.headers.entries()));

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      console.log(`🚀 CORS PREFLIGHT: ${method} ${path}`);
      console.log(`🚀 ===== REQUEST END =====`);
      return new Response(null, { headers: corsHeaders });
    }

    try {
      console.log(`🚀 APPLYING MIDDLEWARE`);

      // Apply middleware
      const rateLimitResponse = await rateLimitMiddleware(request, env, ctx);
      if (rateLimitResponse) {
        console.log(`🚀 RATE LIMITED: ${method} ${path} - Status: ${rateLimitResponse.status}`);
        console.log(`🚀 ===== REQUEST END =====`);
        return rateLimitResponse;
      }

      const authResponse = await authMiddleware(request, env, ctx);
      if (authResponse) {
        console.log(`🚀 AUTH FAILED: ${method} ${path} - Status: ${authResponse.status}`);
        console.log(`🚀 AUTH RESPONSE BODY:`, await authResponse.clone().text());
        console.log(`🚀 ===== REQUEST END =====`);
        return authResponse;
      }

      console.log(`🚀 AUTH PASSED: ${method} ${path} - proceeding to route handling`);
      console.log(`🚀 USER INFO: ${JSON.stringify(request.user || 'NO USER ATTACHED')}`);
      
      // =============================================================================
      // API ENDPOINTS (Before page routes to avoid conflicts)
      // =============================================================================
      
      // Authentication (Login/Signup)
      if (path === '/auth' && method === 'POST') {
        return await handleAuth(request, env, corsHeaders);
      }
      
      // Password Reset for Migrated Users
      if (path === '/reset-password' && method === 'POST') {
        return await handlePasswordReset(request, env, corsHeaders);
      }
      
      // Serve OAuth popup helper script
      if (path === '/oauth-popup.js' && method === 'GET') {
        return new Response(getOAuthPopupScript(), {
          headers: {
            'Content-Type': 'application/javascript',
            'Cache-Control': 'public, max-age=3600',
            ...corsHeaders
          }
        });
      }
      
      // Logout endpoint
      if (path === '/auth/logout' && method === 'POST') {
        return jsonResponse({
          success: true,
          message: 'Logged out successfully'
        }, 200, {
          ...corsHeaders,
          'Set-Cookie': 'session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
        });
      }
      
      // API Key Management
      if (path === '/generate-key' && method === 'POST') {
        return await generateUserApiKey(request, env, corsHeaders);
      }
      
      if (path === '/user-keys' && method === 'GET') {
        console.log(`🚀 HANDLING /user-keys for user: ${request.user?.email || 'UNKNOWN'}`);
        console.log(`🚀 USER OBJECT:`, JSON.stringify(request.user || 'NO USER OBJECT'));

        try {
          const result = await getUserApiKeys(request, env, corsHeaders);
          console.log(`🚀 /user-keys RESPONSE: Status ${result.status}`);

          if (result.status !== 200) {
            const responseText = await result.clone().text();
            console.log(`🚀 /user-keys ERROR RESPONSE:`, responseText);
          }

          return result;
        } catch (error) {
          console.log(`🚀 /user-keys EXCEPTION:`, error.message);
          throw error;
        }
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
        console.log(`🚀 HANDLING /user-apps for user: ${request.user?.email || 'UNKNOWN'}`);
        console.log(`🚀 USER OBJECT:`, JSON.stringify(request.user || 'NO USER OBJECT'));

        try {
          const result = await getUserApps(request, env, corsHeaders);
          console.log(`🚀 /user-apps RESPONSE: Status ${result.status}`);

          if (result.status !== 200) {
            const responseText = await result.clone().text();
            console.log(`🚀 /user-apps ERROR RESPONSE:`, responseText);
          }

          return result;
        } catch (error) {
          console.log(`🚀 /user-apps EXCEPTION:`, error.message);
          throw error;
        }
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
          status: '✅ OAuth Hub Online - Modular v3.0',
          version: '3.0-secure',
          timestamp: new Date().toISOString(),
          features: ['Authentication', 'API Keys', 'OAuth Apps', 'Token Management', 'Analytics', 'Direct Platform User ID Return']
        }, 200, corsHeaders);
      }

      // =============================================================================
      // PAGE ROUTES (After API endpoints to avoid conflicts)
      // =============================================================================
      
      // Auth Page (Login/Signup)
      if (path === '/' || path === '/auth') {
        return htmlResponse(getAuthPage(UNIFIED_CSS));
      }

      // Dashboard Page (require auth)
      if (path === '/dashboard') {
        // User data is attached by auth middleware
        const userData = request.user || {};
        return htmlResponse(getDashboardPage(UNIFIED_CSS, userData));
      }

      // API Keys Page (require auth)
      if (path === '/api-keys') {
        const userData = request.user || {};
        return htmlResponse(getApiKeysPage(UNIFIED_CSS, userData));
      }

      // App Credentials Page (require auth)
      if (path === '/apps') {
        const userData = request.user || {};
        return htmlResponse(getAppsPage(UNIFIED_CSS, userData));
      }

      // Documentation Page (public)
      if (path === '/docs') {
        return htmlResponse(getDocsPage(UNIFIED_CSS));
      }

      // Analytics Page (require auth)
      if (path === '/analytics') {
        const userData = request.user || {};
        return htmlResponse(getAnalyticsPage(UNIFIED_CSS, userData));
      }

      // 404 Not Found
      console.log(`🚀 404 NOT FOUND: ${method} ${path}`);
      console.log(`🚀 ===== REQUEST END =====`);
      return new Response('Not Found', { status: 404, headers: corsHeaders });

    } catch (error) {
      console.log(`🚀 REQUEST EXCEPTION: ${method} ${path}`);
      console.log(`🚀 ERROR MESSAGE:`, error.message);
      console.log(`🚀 ERROR STACK:`, error.stack);
      console.log(`🚀 ===== REQUEST END =====`);

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

// Authentication handler
async function handleAuth(request, env, corsHeaders) {
  try {
    console.log(`🔐 HANDLE AUTH: Starting authentication process`);

    const data = await parseJsonBody(request);
    const { mode, email, password, fullName } = data;

    console.log(`🔐 HANDLE AUTH: Mode=${mode}, Email=${email}, HasPassword=${!!password}, FullName=${fullName}`);

    if (!validateEmail(email) || !password || password.length < 8) {
      console.log(`🔐 HANDLE AUTH: Validation failed - email or password invalid`);
      return jsonResponse({ error: 'Invalid email or password (minimum 8 characters)' }, 400, corsHeaders);
    }

    console.log(`🔐 HANDLE AUTH: Validation passed, proceeding with ${mode} mode`);
    
    if (mode === 'signup') {
      console.log(`🔐 HANDLE AUTH: Signup mode - checking if user exists`);

      // Check if user already exists
      const existingUser = await findUserByEmail(email, env);
      if (existingUser) {
        console.log(`🔐 HANDLE AUTH: User already exists: ${email}`);
        return jsonResponse({ error: 'User already exists' }, 400, corsHeaders);
      }

      console.log(`🔐 HANDLE AUTH: User doesn't exist, proceeding with signup`);
      
      // Create new user with hashed password
      const { salt, hash } = await hashPassword(password);
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
        passwordSalt: salt,
        passwordHash: hash,
        createdAt: new Date().toISOString()
      };
      
      // Store with resource type first - "user firstname lastname email"
      const cleanUserKey = `user ${firstName} ${lastName} ${email}`;
      await env.USERS.put(cleanUserKey, JSON.stringify({
        ...userData,
        userId: userId // Include user ID in data
      }));
      
      // Generate JWT session token
      console.log(`🔐 HANDLE AUTH: Generating JWT for user: ${userData.email}`);

      const sessionToken = await generateJWT({
        userId: userData.id,
        email: userData.email,
        name: userData.name,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }, null, env);

      console.log(`🔐 HANDLE AUTH: JWT generated successfully`);

      // Create default API key
      const apiKey = generateApiKey();
      console.log(`🔐 HANDLE AUTH: Generated default API key`);
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
      
      // Store default API key with resource type first
      const defaultKeyName = 'Default Key';
      const cleanKey = `api-${defaultKeyName} ${firstName} ${lastName} ${email}`;
      await env.API_KEYS.put(cleanKey, JSON.stringify({
        ...apiKeyInfo,
        keyId: generateId()
      }));
      
      console.log(`🔐 HANDLE AUTH: Signup successful for user: ${userData.email}`);
      return jsonResponse({
        success: true,
        email: userData.email,
        name: userData.name,
        message: 'Account created successfully'
      }, 200, {
        ...corsHeaders,
        'Set-Cookie': createSessionCookie(sessionToken)
      });

    } else if (mode === 'login') {
      console.log(`🔐 HANDLE AUTH: Login mode - finding user: ${email}`);

      // Login existing user - search directly for user
      const userResult = await findUserByEmail(email, env);
      if (!userResult) {
        console.log(`🔐 HANDLE AUTH: User not found: ${email}`);
        return jsonResponse({ error: 'Invalid email or password' }, 401, corsHeaders);
      }

      const user = userResult.userData;
      console.log(`🔐 HANDLE AUTH: User found: ${user.email} (${user.id})`);

      // Check if user has password data (migrated users might not)
      if (!user.passwordSalt || !user.passwordHash) {
        console.log(`🔐 HANDLE AUTH: Password reset required for user: ${user.email}`);
        return jsonResponse({
          error: 'Password reset required',
          message: 'Your account was migrated and requires a password reset. Please use the password reset feature.',
          requiresPasswordReset: true,
          email: user.email
        }, 401, corsHeaders);
      }

      console.log(`🔐 HANDLE AUTH: Password data found, verifying password`);

      // Verify password
      const isValidPassword = await verifyPassword(password, user.passwordSalt, user.passwordHash);
      if (!isValidPassword) {
        console.log(`🔐 HANDLE AUTH: Invalid password for user: ${user.email}`);
        return jsonResponse({ error: 'Invalid email or password' }, 401, corsHeaders);
      }

      console.log(`🔐 HANDLE AUTH: Password verified, generating JWT`);

      // Generate JWT session token
      const sessionToken = await generateJWT({
        userId: user.id,
        email: user.email,
        name: user.name,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      }, null, env);

      console.log(`🔐 HANDLE AUTH: JWT generated for login`);
      
      console.log(`🔐 HANDLE AUTH: Login successful for user: ${user.email}`);
      return jsonResponse({
        success: true,
        email: user.email,
        name: user.name,
        message: 'Login successful'
      }, 200, {
        ...corsHeaders,
        'Set-Cookie': createSessionCookie(sessionToken)
      });
    }
    
    return jsonResponse({ error: 'Invalid mode' }, 400, corsHeaders);
    
  } catch (error) {
    console.log(`🔐 HANDLE AUTH: Exception occurred:`, error.message);
    console.log(`🔐 HANDLE AUTH: Stack trace:`, error.stack);
    return jsonResponse({ error: 'Authentication failed', message: error.message }, 500, corsHeaders);
  }
}

// Password reset handler for migrated users
async function handlePasswordReset(request, env, corsHeaders) {
  try {
    const data = await parseJsonBody(request);
    const { email, newPassword } = data;
    
    if (!validateEmail(email) || !newPassword || newPassword.length < 8) {
      return jsonResponse({ error: 'Invalid email or password (minimum 8 characters)' }, 400, corsHeaders);
    }
    
    // Find user by email
    const userResult = await findUserByEmail(email, env);
    if (!userResult) {
      return jsonResponse({ error: 'User not found' }, 404, corsHeaders);
    }
    
    const user = userResult.userData;
    
    // Generate new password hash
    const { salt, hash } = await hashPassword(newPassword);
    
    // Update user with new password
    const updatedUser = {
      ...user,
      passwordSalt: salt,
      passwordHash: hash,
      updatedAt: new Date().toISOString(),
      tempPassword: false,
      mustChangePassword: false,
      passwordResetAt: new Date().toISOString()
    };
    
    // Store updated user data
    await env.USERS.put(`user:${user.id}`, JSON.stringify(updatedUser));
    
    // Generate JWT session token for immediate login
    const sessionToken = await generateJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }, null, env);
    
    return jsonResponse({
      success: true,
      email: user.email,
      name: user.name,
      message: 'Password reset successfully. You are now logged in.'
    }, 200, {
      ...corsHeaders,
      'Set-Cookie': createSessionCookie(sessionToken)
    });
    
  } catch (error) {
    return jsonResponse({ error: 'Password reset failed', message: error.message }, 500, corsHeaders);
  }
}

// API key management
async function generateUserApiKey(request, env, corsHeaders) {
  try {
    const data = await parseJsonBody(request);
    const { name } = data;
    
    // Get email from authenticated user
    const email = request.user?.email || request.user?.userEmail;
    
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
    // Get email from authenticated user
    const email = request.user?.email || request.user?.userEmail;
    
    if (!email) {
      return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders);
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
    const { platform, name, clientId, clientSecret, scopes, redirectUri } = data;
    
    // Get email from authenticated user
    const email = request.user?.email || request.user?.userEmail;
    
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
    // Get email from authenticated user
    const email = request.user?.email || request.user?.userEmail;
    
    if (!email) {
      return jsonResponse({ error: 'Unauthorized' }, 401, corsHeaders);
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

// OAuth flow handlers
async function handleConsentRequest(platform, apiKey, request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const state = url.searchParams.get('state');
    
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
    
    // Generate secure state parameter with user info
    const secureState = await generateSecureState(user.id || user.userId, email, platform, env);
    
    // Generate consent URL using the OAuth backend
    const consentUrl = generateConsentUrl(platform, app, secureState);
    
    return jsonResponse({
      platform: platform.toUpperCase(),
      consentUrl,
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
    
    // Validate and extract data from secure state
    let stateData = null;
    let platform = 'unknown';
    
    if (state) {
      try {
        stateData = await validateSecureState(state, env);
        platform = stateData.platform || 'unknown';
      } catch (stateError) {
        console.error('Invalid state parameter:', stateError);
        // Continue with fallback for backward compatibility
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
            setTimeout(() => {
              try {
                window.close();
              } catch (e) {
                if (window.parent && window.parent !== window) {
                  window.parent.postMessage({ type: 'oauth_error', platform: '${platform}', error: '${error}' }, '*');
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
      
      // Get user info from validated state
      let userInfo = {};
      if (stateData) {
        userInfo = {
          email: stateData.email,
          userId: stateData.userId,
          name: stateData.name
        };
      }
      
      // Get additional user info from platform (optional)
      let platformUserInfo = null;
      try {
        // We'll include basic user info if available from the token exchange
        platformUserInfo = { platform };
      } catch (e) {
        console.log('Could not fetch platform user info:', e);
      }
      
      // Store tokens in KV storage with user info
      await storeOAuthTokens(platform, platformUserId, tokens, env, userInfo);
      
      // Return enhanced success page with platform user ID and tokens
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
            .loading { color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="success-icon">✅</div>
          <h1 class="success-title">Connected Successfully!</h1>
          <p class="loading">Completing authorization...</p>
          
          <script>
            // Prepare data to send to parent window
            const authData = {
              type: 'oauth_complete',
              platform: '${platform}',
              platformUserId: '${platformUserId}',
              tokens: {
                accessToken: '${tokens.accessToken}',
                tokenType: '${tokens.tokenType || 'bearer'}',
                expiresAt: ${tokens.expiresAt || 'null'},
                scope: '${tokens.scope || ''}'  
              },
              userInfo: ${platformUserInfo ? JSON.stringify(platformUserInfo) : 'null'}
            };
            
            // Try multiple methods to communicate with parent
            let messageSent = false;
            
            // Method 1: PostMessage to opener (popup)
            if (window.opener && !window.opener.closed) {
              try {
                window.opener.postMessage(authData, '*');
                messageSent = true;
              } catch (e) {
                console.log('Could not post to opener:', e);
              }
            }
            
            // Method 2: PostMessage to parent (iframe)
            if (window.parent && window.parent !== window) {
              try {
                window.parent.postMessage(authData, '*');
                messageSent = true;
              } catch (e) {
                console.log('Could not post to parent:', e);
              }
            }
            
            // Method 3: Broadcast channel (for same-origin)
            try {
              const channel = new BroadcastChannel('oauth_hub_auth');
              channel.postMessage(authData);
              channel.close();
            } catch (e) {
              // BroadcastChannel might not be supported
            }
            
            // Close window after a short delay
            setTimeout(() => {
              try {
                window.close();
              } catch (e) {
                // If can't close, show success message
                if (!messageSent) {
                  document.body.innerHTML = '<div style="padding: 40px; text-align: center;"><h2>✅ Authorization Complete!</h2><p>You can close this window.</p><p style="font-family: monospace; background: #f3f4f6; padding: 10px; margin-top: 20px;">Platform User ID: ${platformUserId}</p></div>';
                }
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
    const redirectUri = `https://oauth-handler.socialoauth.workers.dev/callback`;
    
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
    
    // For now, return mock analytics data
    // TODO: Implement real analytics from KV storage
    return jsonResponse({
      success: true,
      tokens: [],
      stats: {
        totalTokens: 0,
        apiCalls: 0,
        uniqueUsers: 0,
        platforms: 0
      }
    }, 200, corsHeaders);
    
  } catch (error) {
    return jsonResponse({ 
      error: 'Failed to fetch analytics', 
      message: error.message 
    }, 500, corsHeaders);
  }
}