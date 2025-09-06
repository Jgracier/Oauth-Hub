// =============================================================================
// 🔐 SIMPLE & SECURE AUTH - Using Cloudflare's built-in crypto
// =============================================================================

// Simple password hashing using Web Crypto API
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  // Return both hash and salt as base64
  return {
    hash: btoa(String.fromCharCode(...new Uint8Array(hash))),
    salt: btoa(String.fromCharCode(...salt))
  };
}

// Verify password
export async function verifyPassword(password, storedHash, storedSalt) {
  const encoder = new TextEncoder();
  const salt = Uint8Array.from(atob(storedSalt), c => c.charCodeAt(0));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
  return hashBase64 === storedHash;
}

// Simple session token generation (no JWT needed)
export function createSessionToken() {
  return crypto.randomUUID() + '-' + Date.now();
}

// Create session cookie
export function createSessionCookie(token) {
  return `session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`;
}

// Get session from request
export function getSessionFromRequest(request) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;
  
  const match = cookieHeader.match(/session=([^;]+)/);
  return match ? match[1] : null;
}

// Simple state parameter for OAuth (just needs to be unique and trackable)
export function generateOAuthState(userId, platform) {
  return btoa(`${platform}:${userId}:${Date.now()}:${crypto.randomUUID()}`);
}

// Validate OAuth state (just check format and expiry)
export function validateOAuthState(state) {
  try {
    const decoded = atob(state);
    const [platform, userId, timestamp] = decoded.split(':');
    
    // Check if state is not expired (5 minutes)
    if (Date.now() - parseInt(timestamp) > 300000) {
      throw new Error('State expired');
    }
    
    return { platform, userId };
  } catch (error) {
    return null;
  }
}
