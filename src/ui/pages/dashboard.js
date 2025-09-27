// =============================================================================
// 📊 MODERN DASHBOARD - Sleek analytics and overview
// =============================================================================

import { MODERN_CSS, MODERN_ICONS, THEME_PREVENTION_SCRIPT } from '../styles.js';
import { getModernLayout, getModernScripts } from '../navigation.js';
import { getAuthManagerScript } from '../../lib/auth/auth-manager.js';

export function getModernDashboardPage() {
  const content = `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Welcome to OAuth Hub</h1>
        <p>Manage your OAuth applications and API keys</p>
      </div>

      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon">${MODERN_ICONS.keys}</div>
          <div class="stat-content">
            <div class="stat-number" id="api-keys-count">0</div>
            <div class="stat-label">API Keys</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">${MODERN_ICONS.apps}</div>
          <div class="stat-content">
            <div class="stat-number" id="apps-count">0</div>
            <div class="stat-label">Apps</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">${MODERN_ICONS.analytics}</div>
          <div class="stat-content">
            <div class="stat-number" id="tokens-count">0</div>
            <div class="stat-label">Tokens</div>
          </div>
        </div>
      </div>

      <div class="dashboard-actions">
        <a href="/apps" class="action-button">
          <span class="action-icon">${MODERN_ICONS.plus}</span>
          Create App
        </a>
        <a href="/api-keys" class="action-button">
          <span class="action-icon">${MODERN_ICONS.keys}</span>
          Manage Keys
        </a>
      </div>
    </div>

    <script>
      // Simple dashboard data loading
      async function loadDashboardData() {
        try {
          const email = localStorage.getItem('userEmail');
          if (!email) return;

          const [keysResponse, appsResponse] = await Promise.all([
            fetch(\`/user-keys?email=\${encodeURIComponent(email)}\`).catch(() => null),
            fetch(\`/user-apps?email=\${encodeURIComponent(email)}\`).catch(() => null)
          ]);

          let apiKeysCount = 0;
          let appsCount = 0;

          if (keysResponse && keysResponse.ok) {
            const keysData = await keysResponse.json();
            apiKeysCount = keysData.apiKeys.length;
          }

          if (appsResponse && appsResponse.ok) {
            const appsData = await appsResponse.json();
            appsCount = appsData.apps.length;
          }

          document.getElementById('api-keys-count').textContent = apiKeysCount;
          document.getElementById('apps-count').textContent = appsCount;
          document.getElementById('tokens-count').textContent = '0';
        } catch (error) {
          console.error('Failed to load dashboard data:', error);
        }
      }

      // Load data when page loads
      loadDashboardData();
    </script>
  `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OAuth Hub - Dashboard</title>
      ${THEME_PREVENTION_SCRIPT}
      <style>${MODERN_CSS}</style>
    </head>
    <body>
      ${getModernLayout('dashboard', 'Dashboard', content)}
      ${getAuthManagerScript()}
      ${getModernScripts()}
    </body>
    </html>
  `;
}
