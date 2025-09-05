// =============================================================================
// 🔐 SECURITY UTILITIES - JWT, Password Hashing, CSRF Protection
// =============================================================================

// Simple JWT implementation for Cloudflare Workers
export async function generateJWT(payload, secret, env) {
  // Use environment variable if available, fallback for development
  const jwtSecret = secret || env?.JWT_SECRET || 'development-secret-change-in-production';
  
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '');
  
  const data = `${encodedHeader}.${encodedPayload}`;
  
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(jwtSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(data)
  );
  
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  
  return `${data}.${encodedSignature}`;
}

export async function verifyJWT(token, secret, env) {
  // Use environment variable if available, fallback for development
  const jwtSecret = secret || env?.JWT_SECRET || 'development-secret-change-in-production';
  try {
    const [header, payload, signature] = token.split('.');
    
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(jwtSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const data = `${header}.${payload}`;
    const signatureBytes = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      new TextEncoder().encode(data)
    );
    
    if (!valid) return null;
    
    const decodedPayload = JSON.parse(atob(payload));
    
    // Check expiration
    if (decodedPayload.exp && decodedPayload.exp < Date.now() / 1000) {
      return null;
    }
    
    return decodedPayload;
  } catch (error) {
    return null;
  }
}

// Simple password hashing using Web Crypto API (Cloudflare Workers compatible)
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordBytes = new TextEncoder().encode(password);
  
  // Combine password and salt
  const combined = new Uint8Array(passwordBytes.length + salt.length);
  combined.set(passwordBytes);
  combined.set(salt, passwordBytes.length);
  
  // Hash using SHA-256 multiple times for security
  let hash = combined;
  for (let i = 0; i < 10000; i++) {
    hash = new Uint8Array(
      await crypto.subtle.digest('SHA-256', hash)
    );
  }
  
  // Return salt and hash as base64
  return {
    salt: btoa(String.fromCharCode(...salt)),
    hash: btoa(String.fromCharCode(...hash))
  };
}

export async function verifyPassword(password, storedSalt, storedHash) {
  try {
    // Handle base64 padding properly - add missing padding
    let paddedSalt = storedSalt;
    while (paddedSalt.length % 4 !== 0) {
      paddedSalt += '=';
    }

    let paddedHash = storedHash;
    while (paddedHash.length % 4 !== 0) {
      paddedHash += '=';
    }

    const salt = Uint8Array.from(atob(paddedSalt), c => c.charCodeAt(0));
    const storedHashBytes = Uint8Array.from(atob(paddedHash), c => c.charCodeAt(0));

    const passwordBytes = new TextEncoder().encode(password);

    // Combine password and salt
    const combined = new Uint8Array(passwordBytes.length + salt.length);
    combined.set(passwordBytes);
    combined.set(salt, passwordBytes.length);

    // Hash using same method
    let hash = combined;
    for (let i = 0; i < 10000; i++) {
      hash = new Uint8Array(
        await crypto.subtle.digest('SHA-256', hash)
      );
    }

    // Compare byte-by-byte instead of string comparison (handles padding differences)
    const isMatch = hash.length === storedHashBytes.length &&
                   hash.every((byte, index) => byte === storedHashBytes[index]);
    return isMatch;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

// CSRF Token Generation
export function generateCSRFToken() {
  return crypto.randomUUID();
}

// Secure State Parameter for OAuth
export async function generateSecureState(userId, email, platform, env) {
  const timestamp = Date.now();
  const nonce = crypto.randomUUID();
  const data = {
    userId,
    email,
    platform,
    timestamp,
    nonce
  };

  // Sign the state - use proper JWT secret
  const jwtSecret = env?.JWT_SECRET || 'development-secret-change-in-production';
  const signature = await generateJWT(data, jwtSecret, env);
  return signature; // JWT itself serves as signed state
}

export async function validateSecureState(state, env) {
  // Use proper JWT secret
  const jwtSecret = env?.JWT_SECRET || 'development-secret-change-in-production';
  const data = await verifyJWT(state, jwtSecret, env);

  if (!data) {
    throw new Error('Invalid state parameter');
  }

  // Check if state is not expired (5 minutes)
  if (Date.now() - data.timestamp > 300000) {
    throw new Error('State parameter expired');
  }

  return data;
}

// Security Headers
export function getSecurityHeaders() {
  return {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
}

// Session Cookie Helpers
export function createSessionCookie(token, maxAge = 86400) {
  // In development, don't use Secure flag to allow localhost
  const isProduction = typeof globalThis !== 'undefined' && globalThis?.location?.protocol === 'https:';
  const secureFlag = isProduction ? '; Secure' : '';

  return `session=${token}; HttpOnly${secureFlag}; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
}

export function getSessionFromCookie(request) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  return cookies.session || null;
}

// API Key Validation Helper
export function isValidApiKey(apiKey) {
  return apiKey && apiKey.startsWith('sk_') && apiKey.length > 20;
}
