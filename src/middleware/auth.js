// =============================================================================
// 🔐 AUTHENTICATION MIDDLEWARE
// =============================================================================

import { verifyJWT, getSessionFromCookie } from '../utils/security.js';

export async function authMiddleware(request, env, ctx) {
  // Skip auth for public endpoints
  const publicPaths = ['/auth', '/health', '/', '/consent/', '/callback', '/oauth-popup.js'];
  const path = new URL(request.url).pathname;
  
  if (publicPaths.some(p => path.startsWith(p))) {
    return null; // Continue to handler
  }
  
  // Check for session cookie
  const session = getSessionFromCookie(request);
  
  if (!session) {
    // Check for API key in Authorization header as fallback
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const apiKey = authHeader.substring(7);
      
      // Validate API key
      const validationResult = await validateApiKeyFromHeader(apiKey, env);
      if (validationResult) {
        // Attach user info to request
        request.user = validationResult;
        return null; // Continue to handler
      }
    }
    
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Verify JWT session
  const userData = await verifyJWT(session, null, env);
  
  if (!userData) {
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
