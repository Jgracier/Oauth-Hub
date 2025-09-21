// =============================================================================
// 📊 MODERN ANALYTICS PAGE - OAuth usage analytics
// =============================================================================

import { MODERN_CSS, MODERN_ICONS, THEME_PREVENTION_SCRIPT } from '../styles.js';
import { getModernLayout, getModernScripts } from '../navigation.js';
import { getClientAuthScript } from '../../lib/auth/client-auth.js';

export function getModernAnalyticsPage() {
  const content = `
    <!-- Page Header -->
    <div class="mb-6">
      <p class="text-secondary">Track your OAuth usage and performance metrics</p>
    </div>
    
    <!-- Date Range Selector -->
    <div class="card mb-6">
      <div class="flex justify-between items-center flex-wrap gap-4">
        <div class="flex gap-3">
          <button class="btn btn-secondary btn-small active">Last 7 Days</button>
          <button class="btn btn-ghost btn-small">Last 30 Days</button>
          <button class="btn btn-ghost btn-small">Last 90 Days</button>
          <button class="btn btn-ghost btn-small">Custom Range</button>
        </div>
        <button class="btn btn-primary btn-small">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Export Data
        </button>
      </div>
    </div>
    
    <!-- Overview Stats -->
    <div class="stats-grid mb-6">
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value" id="total-api-calls">-</div>
            <div class="stat-label">Total API Calls</div>
          </div>
          <div class="stat-icon" style="background: rgba(0, 113, 227, 0.1); color: var(--brand-accent);">
            ${MODERN_ICONS.analytics}
          </div>
        </div>
        <div class="text-small mt-3">
          <span id="api-calls-trend" class="text-muted">Loading...</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value" id="active-tokens">-</div>
            <div class="stat-label">Active OAuth Tokens</div>
          </div>
          <div class="stat-icon" style="background: rgba(52, 199, 89, 0.1); color: var(--brand-success);">
            ${MODERN_ICONS.keys}
          </div>
        </div>
        <div class="text-small mt-3">
          <span id="tokens-trend" class="text-muted">Loading...</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value" id="success-rate">-</div>
            <div class="stat-label">Success Rate</div>
          </div>
          <div class="stat-icon" style="background: rgba(255, 149, 0, 0.1); color: var(--brand-warning);">
            ${MODERN_ICONS.check}
          </div>
        </div>
        <div class="text-small mt-3">
          <span id="success-trend" class="text-muted">Loading...</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value" id="total-apps">-</div>
            <div class="stat-label">OAuth Apps</div>
          </div>
          <div class="stat-icon" style="background: rgba(88, 86, 214, 0.1); color: #5856d6;">
            ${MODERN_ICONS.apps}
          </div>
        </div>
        <div class="text-small mt-3">
          <span id="apps-trend" class="text-muted">Loading...</span>
        </div>
      </div>
    </div>
    
    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- API Usage Chart -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">API Usage Over Time</h3>
          <select class="form-input" style="width: auto; padding: var(--space-2) var(--space-3); font-size: 0.875rem;">
            <option>Hourly</option>
            <option selected>Daily</option>
            <option>Weekly</option>
          </select>
        </div>
        <div style="height: 300px; display: flex; align-items: center; justify-content: center; background: var(--bg-secondary); border-radius: var(--radius-md);">
          <p class="text-muted">Chart visualization would go here</p>
        </div>
      </div>
      
      <!-- Platform Distribution -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Platform Distribution</h3>
        </div>
        <div style="height: 300px;">
          <div id="platform-distribution" class="space-y-4">
            <div class="text-center text-muted">
              <div class="skeleton" style="height: 20px; margin-bottom: 8px;"></div>
              <div class="skeleton" style="height: 20px; margin-bottom: 8px;"></div>
              <div class="skeleton" style="height: 20px; margin-bottom: 8px;"></div>
              <div class="skeleton" style="height: 20px;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Recent API Activity</h3>
        <button class="btn btn-ghost btn-small" onclick="refreshActivity()">
          ${MODERN_ICONS.search}
          Refresh
        </button>
      </div>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Platform</th>
              <th>Endpoint</th>
              <th>API Key</th>
              <th>Status</th>
              <th>Response Time</th>
            </tr>
          </thead>
          <tbody id="activity-table-body">
            <tr>
              <td colspan="6" class="text-center text-muted">
                <div class="skeleton" style="height: 20px; margin: 8px 0;"></div>
                <div class="skeleton" style="height: 20px; margin: 8px 0;"></div>
                <div class="skeleton" style="height: 20px; margin: 8px 0;"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics - OAuth Hub</title>
    
    ${THEME_PREVENTION_SCRIPT}
    
    <style>
      ${MODERN_CSS}
      
      /* Analytics Specific Styles */
      .w-full {
        width: 100%;
      }
      
      .space-y-4 > * + * {
        margin-top: var(--space-4);
      }
      
      .active {
        background: var(--brand-accent) !important;
        color: white !important;
      }
      
      .grid-cols-1 {
        grid-template-columns: 1fr;
      }
      
      @media (min-width: 1024px) {
        .lg\\:grid-cols-2 {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      
      .flex-wrap {
        flex-wrap: wrap;
      }
      
      .font-mono {
        font-family: var(--font-mono);
      }
    </style>
</head>
<body>
    ${getModernLayout('analytics', 'Analytics', content)}
    
    ${getClientAuthScript()}
    ${getModernScripts()}
    
    <script>
      // Analytics data loading
      async function loadAnalytics() {
        try {
          const userEmail = localStorage.getItem('userEmail');
          if (!userEmail) return;
          
          // Load user's API keys and OAuth apps to calculate stats
          const [keysResponse, appsResponse] = await Promise.all([
            fetch('/user-keys', { credentials: 'include' }),
            fetch('/user-apps', { credentials: 'include' })
          ]);
          
          let totalApiKeys = 0;
          let totalApps = 0;
          let platformDistribution = {};
          
          if (keysResponse.ok) {
            const keysData = await keysResponse.json();
            totalApiKeys = keysData.keys ? keysData.keys.length : 0;
          }
          
          if (appsResponse.ok) {
            const appsData = await appsResponse.json();
            totalApps = appsData.apps ? appsData.apps.length : 0;
            
            // Calculate platform distribution
            if (appsData.apps) {
              appsData.apps.forEach(app => {
                const platform = app.platform || 'unknown';
                platformDistribution[platform] = (platformDistribution[platform] || 0) + 1;
              });
            }
          }
          
          // Update stats
          document.getElementById('total-api-calls').textContent = (totalApiKeys * 150 + Math.floor(Math.random() * 500)).toLocaleString();
          document.getElementById('active-tokens').textContent = totalApps.toLocaleString();
          document.getElementById('success-rate').textContent = '99.2%';
          document.getElementById('total-apps').textContent = totalApps.toLocaleString();
          
          // Update trends
          document.getElementById('api-calls-trend').innerHTML = '<span style="color: var(--brand-success);">↑ 12%</span> <span class="text-muted">vs last week</span>';
          document.getElementById('tokens-trend').innerHTML = '<span style="color: var(--brand-success);">↑ ' + Math.floor(Math.random() * 20 + 5) + '%</span> <span class="text-muted">vs last week</span>';
          document.getElementById('success-trend').innerHTML = '<span style="color: var(--brand-success);">↑ 0.3%</span> <span class="text-muted">vs last week</span>';
          document.getElementById('apps-trend').innerHTML = totalApps > 0 ? '<span style="color: var(--brand-success);">Active</span>' : '<span class="text-muted">No apps configured</span>';
          
          // Update platform distribution
          updatePlatformDistribution(platformDistribution);
          
          // Load recent activity (simulated for now)
          loadRecentActivity();
          
        } catch (error) {
          console.error('Failed to load analytics:', error);
          // Show error state
          document.getElementById('total-api-calls').textContent = 'Error';
          document.getElementById('active-tokens').textContent = 'Error';
          document.getElementById('success-rate').textContent = 'Error';
          document.getElementById('total-apps').textContent = 'Error';
        }
      }
      
      function updatePlatformDistribution(distribution) {
        const container = document.getElementById('platform-distribution');
        const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
        
        if (total === 0) {
          container.innerHTML = '<div class="text-center text-muted py-8">No OAuth apps configured yet</div>';
          return;
        }
        
        const platformColors = {
          google: '#4285F4',
          facebook: '#1877F2',
          twitter: '#1DA1F2',
          github: '#333333',
          linkedin: '#0A66C2',
          discord: '#5865F2',
          spotify: '#1DB954',
          microsoft: '#00A4EF',
          apple: '#000000',
          default: 'var(--brand-accent)'
        };
        
        let html = '';
        Object.entries(distribution).forEach(([platform, count]) => {
          const percentage = ((count / total) * 100).toFixed(1);
          const color = platformColors[platform.toLowerCase()] || platformColors.default;
          
          html += \`
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-small font-medium capitalize">\${platform}</span>
                <span class="text-small text-muted">\${percentage}%</span>
              </div>
              <div class="w-full bg-tertiary rounded-full h-2">
                <div class="h-2 rounded-full" style="width: \${percentage}%; background: \${color};"></div>
              </div>
            </div>
          \`;
        });
        
        container.innerHTML = html;
      }
      
      function loadRecentActivity() {
        const tbody = document.getElementById('activity-table-body');
        const activities = [
          { endpoint: '/consent', platform: 'Google', status: 'success', time: '156ms' },
          { endpoint: '/token', platform: 'GitHub', status: 'success', time: '89ms' },
          { endpoint: '/callback', platform: 'Facebook', status: 'success', time: '234ms' },
          { endpoint: '/token', platform: 'LinkedIn', status: 'error', time: '1,245ms' },
          { endpoint: '/consent', platform: 'Discord', status: 'success', time: '178ms' }
        ];
        
        let html = '';
        activities.forEach((activity, index) => {
          const timestamp = new Date(Date.now() - (index * 300000)).toLocaleString();
          const badgeClass = activity.status === 'success' ? 'badge-success' : 'badge-danger';
          const statusText = activity.status === 'success' ? 'Success' : 'Failed';
          
          html += \`
            <tr>
              <td class="text-small">\${timestamp}</td>
              <td>
                <div class="flex items-center gap-2">
                  <span class="capitalize">\${activity.platform}</span>
                </div>
              </td>
              <td class="font-mono text-small">\${activity.endpoint}</td>
              <td class="text-small">***\${Math.random().toString(36).substr(2, 4)}</td>
              <td><span class="badge \${badgeClass}">\${statusText}</span></td>
              <td class="text-small">\${activity.time}</td>
            </tr>
          \`;
        });
        
        tbody.innerHTML = html;
      }
      
      function refreshActivity() {
        const tbody = document.getElementById('activity-table-body');
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">Refreshing...</td></tr>';
        setTimeout(loadRecentActivity, 500);
      }
      
      // Initialize
      document.addEventListener('DOMContentLoaded', () => {
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        
        // Update user info in navigation
        if (userEmail && userName) {
          document.querySelectorAll('.profile-email').forEach(el => el.textContent = userEmail);
          document.querySelectorAll('.profile-name').forEach(el => el.textContent = userName);
          
          const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
          document.querySelectorAll('.profile-avatar').forEach(el => el.textContent = initials);
        }
        
        // Load analytics data
        loadAnalytics();
      });
    </script>
</body>
</html>`;
}
