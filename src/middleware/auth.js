// =============================================================================
// 🔐 AUTHENTICATION MIDDLEWARE
// =============================================================================

import { verifyJWT, getSessionFromCookie } from '../utils/security.js';

export async function authMiddleware(request, env, ctx) {
  const path = new URL(request.url).pathname;
  const method = request.method;
  const cookieHeader = request.headers.get('Cookie');

  console.log(`🔐 AUTH MIDDLEWARE: ${method} ${path}`);
  console.log(`🔐 COOKIE HEADER: ${cookieHeader ? cookieHeader.substring(0, 100) + '...' : 'NO COOKIE'}`);

  // Skip auth for public endpoints
  const publicPaths = ['/auth', '/health', '/', '/consent/', '/callback', '/oauth-popup.js'];

  if (publicPaths.some(p => path.startsWith(p))) {
    console.log(`🔐 PUBLIC PATH: ${path} - SKIPPING AUTH`);
    return null; // Continue to handler
  }

  console.log(`🔐 PROTECTED PATH: ${path} - CHECKING AUTH`);

  // Check for session cookie
  const session = getSessionFromCookie(request);
  console.log(`🔐 SESSION COOKIE: ${session ? session.substring(0, 50) + '...' : 'NO SESSION COOKIE'}`);

  if (!session) {
    console.log(`🔐 NO SESSION COOKIE - CHECKING API KEY`);

    // Check for API key in Authorization header as fallback
    const authHeader = request.headers.get('Authorization');
    console.log(`🔐 AUTH HEADER: ${authHeader ? authHeader.substring(0, 50) + '...' : 'NO AUTH HEADER'}`);

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const apiKey = authHeader.substring(7);
      console.log(`🔐 API KEY FOUND: ${apiKey.substring(0, 10)}...`);

      // Validate API key
      const validationResult = await validateApiKeyFromHeader(apiKey, env);
      console.log(`🔐 API KEY VALIDATION: ${validationResult ? 'SUCCESS' : 'FAILED'}`);

      if (validationResult) {
        // Attach user info to request
        request.user = validationResult;
        console.log(`🔐 API KEY AUTH SUCCESS: ${validationResult.email}`);
        return null; // Continue to handler
      }
    }

    console.log(`🔐 AUTH FAILED - NO SESSION COOKIE OR VALID API KEY`);
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  console.log(`🔐 SESSION COOKIE FOUND - VERIFYING JWT`);

  // Verify JWT session
  const userData = await verifyJWT(session, null, env);
  console.log(`🔐 JWT VERIFICATION: ${userData ? 'SUCCESS' : 'FAILED'}`);

  if (userData) {
    console.log(`🔐 JWT VALID: User ${userData.email} (${userData.userId})`);
  }

  if (!userData) {
    console.log(`🔐 JWT INVALID - CLEARING SESSION`);

    // Clear invalid session
    return new Response(JSON.stringify({ error: 'Invalid session' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'session=; Path=/; Max-Age=0; Secure; SameSite=None'
      }
    });
  }

  // Attach user to request
  request.user = userData;
  console.log(`🔐 AUTH SUCCESS: User ${userData.email} granted access to ${path}`);

  return null; // Continue to handler
}

async function validateApiKeyFromHeader(apiKey, env) {
  if (!apiKey || !apiKey.startsWith('sk_')) return null;
  
  // Look up API key in KV storage
  const { keys } = await env.API_KEYS.list();
  
  for (const keyInfo of keys) {
    if (keyInfo.name.startsWith('api-')) {
      const data = await env.API_KEYS.get(keyInfo.name);
      const keyData = JSON.parse(data);
      
      if (keyData.apiKey === apiKey) {
        return {
          email: keyData.userEmail || keyData.email,
          userId: keyData.userId,
          keyName: keyData.keyName,
          via: 'api_key'
        };
      }
    }
  }
  
  return null;
}
