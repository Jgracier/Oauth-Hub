// =============================================================================
// ⚡ RATE LIMITING MIDDLEWARE
// =============================================================================

export async function rateLimitMiddleware(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Different rate limits for different endpoints
  const rateLimits = {
    '/auth': { requests: 5, window: 60 }, // 5 requests per minute for auth
    '/api/': { requests: 100, window: 60 }, // 100 requests per minute for API
    '/consent/': { requests: 30, window: 60 }, // 30 OAuth flows per minute
    default: { requests: 200, window: 60 } // 200 requests per minute default
  };
  
  // Find applicable rate limit
  let limit = rateLimits.default;
  for (const [prefix, config] of Object.entries(rateLimits)) {
    if (prefix !== 'default' && path.startsWith(prefix)) {
      limit = config;
      break;
    }
  }
  
  // Get client identifier (IP address or API key)
  const clientId = request.headers.get('CF-Connecting-IP') || 
                   request.headers.get('X-Forwarded-For') || 
                   'unknown';
  
  const rateLimitKey = `rate:${clientId}:${path}`;
  
  // Get current request count
  const currentCount = parseInt(await env.API_KEYS.get(rateLimitKey) || '0');
  
  if (currentCount >= limit.requests) {
    return new Response(JSON.stringify({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again in ${limit.window} seconds.`
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': limit.requests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(Date.now() + limit.window * 1000).toISOString(),
        'Retry-After': limit.window.toString()
      }
    });
  }
  
  // Increment counter
  await env.API_KEYS.put(rateLimitKey, (currentCount + 1).toString(), {
    expirationTtl: limit.window
  });
  
  // Add rate limit headers to response
  ctx.waitUntil(
    new Promise(resolve => {
      ctx.responseHeaders = {
        'X-RateLimit-Limit': limit.requests.toString(),
        'X-RateLimit-Remaining': (limit.requests - currentCount - 1).toString(),
        'X-RateLimit-Reset': new Date(Date.now() + limit.window * 1000).toISOString()
      };
      resolve();
    })
  );
  
  return null; // Continue to handler
}