export function getModernAuthPage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OAuth Hub - Secure Authentication Platform</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; padding: 50px; }
        .container { max-width: 400px; margin: 0 auto; }
        .logo { font-size: 2em; margin-bottom: 20px; }
        .btn { background: #007AFF; color: white; padding: 12px 24px; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🔐 OAuth Hub</div>
        <h1>Welcome to OAuth Hub</h1>
        <p>Secure authentication platform for your OAuth needs</p>
        <button class="btn" onclick="window.location.href='${process.env.KEYCLOAK_URL || 'http://localhost:8080'}/realms/oauth-hub/protocol/openid-connect/auth?client_id=oauth-hub-client&redirect_uri=${encodeURIComponent(process.env.FRONTEND_URL || 'http://localhost:3000')}/dashboard&response_type=code&scope=openid profile email'">Login / Signup</button>
      </div>
    </body>
    </html>
  `;
}