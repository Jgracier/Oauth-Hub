// =============================================================================
// 🔧 UTILITY FUNCTIONS
// =============================================================================

// JSON Response Helper
export function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

// HTML Response Helper
export function htmlResponse(html, status = 200, headers = {}) {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      ...headers
    }
  });
}

// Generate Random API Key
export function generateApiKey() {
  return 'sk_' + crypto.randomUUID().replace(/-/g, '');
}

// Generate Random String
export function generateRandomString(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate Random ID
export function generateId() {
  return crypto.randomUUID();
}


// Simplified error response
export function errorResponse(message, status = 500, corsHeaders = {}) {
  return jsonResponse({ error: message }, status, corsHeaders);
}

// Sanitize Input
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/&/g, '&amp;');
}

// Validate Email
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Parse JSON Body
export async function parseJsonBody(request) {
  try {
    return await request.json();
  } catch (e) {
    return null;
  }
}

// CORS Headers
export function getCorsHeaders() {
  return {
    'Access-Control-Allow-Origin': 'https://oauth-hub.com',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}