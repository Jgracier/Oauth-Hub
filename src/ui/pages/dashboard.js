export function getModernDashboardPage(user) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Dashboard - OAuth Hub</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; background: #f5f5f5; }
        nav { background: white; padding: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
        .card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .btn { background: #007AFF; color: white; padding: 0.5rem 1rem; border: none; border-radius: 4px; text-decoration: none; display: inline-block; }
      </style>
    </head>
    <body>
      <nav>
        <h1>OAuth Hub</h1>
        <div>Welcome, ${user.preferred_username || user.name} <a href="/logout">Logout</a></div>
      </nav>
      <div class="container">
        <h2>Dashboard</h2>
        <div class="grid">
          <div class="card">
            <h3>API Keys</h3>
            <p id="api-keys-count">Loading...</p>
            <a href="/api-keys" class="btn">Manage</a>
          </div>
          <div class="card">
            <h3>OAuth Apps</h3>
            <p id="apps-count">Loading...</p>
            <a href="/apps" class="btn">Configure</a>
          </div>
        </div>
      </div>
      <script>
        fetch('/api/api-keys').then(r => r.json()).then(d => document.getElementById('api-keys-count').textContent = d.apiKeys.length);
        fetch('/api/user-apps').then(r => r.json()).then(d => document.getElementById('apps-count').textContent = d.apps.length);
      </script>
    </body>
    </html>
  `;
}