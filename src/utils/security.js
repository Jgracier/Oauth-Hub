// =============================================================================
// 🔐 SECURITY UTILITIES - JWT, Password Hashing, CSRF Protection
// =============================================================================

// Simple JWT implementation for Cloudflare Workers
export async function generateJWT(payload, secret, env) {
  // Use environment variable if available, fallback for development
  const jwtSecret = secret || env?.JWT_SECRET || 'development-secret-change-in-production';

  console.log(`🔐 JWT GENERATE: Payload: ${JSON.stringify(payload)}`);
  console.log(`🔐 JWT SECRET: ${jwtSecret.substring(0, 10)}... (length: ${jwtSecret.length})`);
  
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
  
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));

  const finalToken = `${data}.${encodedSignature}`;
  console.log(`🔐 JWT GENERATED: Token length: ${finalToken.length}`);
  console.log(`🔐 JWT STRUCTURE: ${finalToken.split('.').map((part, i) => `${i === 0 ? 'Header' : i === 1 ? 'Payload' : 'Signature'}: ${part.length} chars`).join(' | ')}`);

  return finalToken;
}

export async function verifyJWT(token, secret, env) {
  // Use environment variable if available, fallback for development
  const jwtSecret = secret || env?.JWT_SECRET || 'development-secret-change-in-production';

  console.log(`🔑 JWT VERIFY: Token length: ${token.length}`);
  console.log(`🔑 JWT SECRET: ${jwtSecret.substring(0, 10)}... (length: ${jwtSecret.length})`);

  try {
    const [header, payload, signature] = token.split('.');

    console.log(`🔑 JWT PARTS: Header(${header.length}), Payload(${payload.length}), Signature(${signature.length})`);

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(jwtSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Restore base64 padding that was removed during generation
    const paddedHeader = header + '='.repeat((4 - header.length % 4) % 4);
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const paddedSignature = signature + '='.repeat((4 - signature.length % 4) % 4);

    console.log(`🔑 JWT PADDING: Header(${paddedHeader.length}), Payload(${paddedPayload.length}), Signature(${paddedSignature.length})`);

    const data = `${header}.${payload}`;
    const signatureBytes = Uint8Array.from(atob(paddedSignature), c => c.charCodeAt(0));

    console.log(`🔑 JWT SIGNATURE: ${signatureBytes.length} bytes`);

    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      new TextEncoder().encode(data)
    );

    console.log(`🔑 JWT SIGNATURE VERIFICATION: ${valid ? 'VALID' : 'INVALID'}`);

    if (!valid) {
      console.log(`🔑 JWT SIGNATURE MISMATCH`);
      return null;
    }

    const decodedPayload = JSON.parse(atob(paddedPayload));
    console.log(`🔑 JWT PAYLOAD: ${JSON.stringify(decodedPayload)}`);

    // Check expiration
    if (decodedPayload.exp && decodedPayload.exp < Date.now() / 1000) {
      console.log(`🔑 JWT EXPIRED: ${new Date(decodedPayload.exp * 1000)} vs ${new Date()}`);
      return null;
    }

    console.log(`🔑 JWT VERIFICATION SUCCESS`);
    return decodedPayload;
  } catch (error) {
    console.log(`🔑 JWT VERIFICATION ERROR: ${error.message}`);
    console.log(`🔑 JWT VERIFICATION STACK: ${error.stack}`);
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
  const salt = Uint8Array.from(atob(storedSalt), c => c.charCodeAt(0));
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
  
  const hashString = btoa(String.fromCharCode(...hash));
  return hashString === storedHash;
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
  
  // Sign the state
  const signature = await generateJWT(data, null, env);
  return signature; // JWT itself serves as signed state
}

export async function validateSecureState(state, env) {
  const data = await verifyJWT(state, null, env);
  
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
  // Secure cookie settings for HTTPS
  const cookieValue = `session=${token}; Path=/; Max-Age=${maxAge}; Secure; SameSite=None`;
  console.log(`🍪 CREATING SESSION COOKIE: ${cookieValue.substring(0, 100)}...`);
  console.log(`🍪 COOKIE LENGTH: ${cookieValue.length} characters`);
  return cookieValue;
}

export function getSessionFromCookie(request) {
  const cookieHeader = request.headers.get('Cookie');
  console.log(`🍪 COOKIE HEADER RECEIVED: ${cookieHeader ? cookieHeader.substring(0, 100) + '...' : 'NO COOKIE HEADER'}`);

  if (!cookieHeader) {
    console.log(`🍪 NO COOKIE HEADER FOUND`);
    return null;
  }

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});

  console.log(`🍪 PARSED COOKIES: ${Object.keys(cookies).join(', ')}`);
  console.log(`🍪 SESSION COOKIE: ${cookies.session ? cookies.session.substring(0, 50) + '...' : 'NO SESSION COOKIE'}`);

  return cookies.session || null;
}

// API Key Validation Helper
export function isValidApiKey(apiKey) {
  return apiKey && apiKey.startsWith('sk_') && apiKey.length > 20;
}
