// =============================================================================
// 📊 MODERN ANALYTICS PAGE - OAuth usage analytics
// =============================================================================

import { MODERN_CSS, MODERN_ICONS } from '../modern-styles.js';
import { getModernLayout, getModernScripts } from '../modern-navigation.js';
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
            <div class="stat-value">12,345</div>
            <div class="stat-label">Total API Calls</div>
          </div>
          <div class="stat-icon" style="background: rgba(0, 113, 227, 0.1); color: var(--brand-accent);">
            ${MODERN_ICONS.analytics}
          </div>
        </div>
        <div class="text-small mt-3">
          <span style="color: var(--brand-success);">↑ 23%</span>
          <span class="text-muted">vs last period</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">856</div>
            <div class="stat-label">Active Users</div>
          </div>
          <div class="stat-icon" style="background: rgba(52, 199, 89, 0.1); color: var(--brand-success);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        </div>
        <div class="text-small mt-3">
          <span style="color: var(--brand-success);">↑ 12%</span>
          <span class="text-muted">vs last period</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value">99.9%</div>
            <div class="stat-label">Success Rate</div>
          </div>
          <div class="stat-icon" style="background: rgba(255, 149, 0, 0.1); color: var(--brand-warning);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
        </div>
        <div class="text-small mt-3">
          <span style="color: var(--brand-danger);">↓ 0.1%</span>
          <span class="text-muted">vs last period</span>
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
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-small font-medium">Google</span>
                <span class="text-small text-muted">45%</span>
              </div>
              <div class="w-full bg-tertiary rounded-full h-2">
                <div class="bg-accent h-2 rounded-full" style="width: 45%; background: #4285F4;"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-small font-medium">Facebook</span>
                <span class="text-small text-muted">30%</span>
              </div>
              <div class="w-full bg-tertiary rounded-full h-2">
                <div class="bg-accent h-2 rounded-full" style="width: 30%; background: #1877F2;"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-small font-medium">Twitter</span>
                <span class="text-small text-muted">15%</span>
              </div>
              <div class="w-full bg-tertiary rounded-full h-2">
                <div class="bg-accent h-2 rounded-full" style="width: 15%; background: #1DA1F2;"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-small font-medium">Others</span>
                <span class="text-small text-muted">10%</span>
              </div>
              <div class="w-full bg-tertiary rounded-full h-2">
                <div class="bg-accent h-2 rounded-full" style="width: 10%; background: var(--text-tertiary);"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity Table -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Recent API Activity</h3>
        <button class="btn btn-ghost btn-small">View All</button>
      </div>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Platform</th>
              <th>Endpoint</th>
              <th>User</th>
              <th>Status</th>
              <th>Response Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-small">2025-09-06 10:45:23</td>
              <td>
                <div class="flex items-center gap-2">
                  <span style="font-size: 1rem;">🔍</span>
                  <span>Google</span>
                </div>
              </td>
              <td class="font-mono text-small">/token</td>
              <td class="text-small">user_123</td>
              <td><span class="badge badge-success">Success</span></td>
              <td class="text-small">124ms</td>
            </tr>
            <tr>
              <td class="text-small">2025-09-06 10:44:15</td>
              <td>
                <div class="flex items-center gap-2">
                  <span style="font-size: 1rem;">📘</span>
                  <span>Facebook</span>
                </div>
              </td>
              <td class="font-mono text-small">/consent</td>
              <td class="text-small">user_456</td>
              <td><span class="badge badge-success">Success</span></td>
              <td class="text-small">89ms</td>
            </tr>
            <tr>
              <td class="text-small">2025-09-06 10:43:07</td>
              <td>
                <div class="flex items-center gap-2">
                  <span style="font-size: 1rem;">🐦</span>
                  <span>Twitter</span>
                </div>
              </td>
              <td class="font-mono text-small">/token</td>
              <td class="text-small">user_789</td>
              <td><span class="badge badge-danger">Failed</span></td>
              <td class="text-small">2,341ms</td>
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
        
        // TODO: Load real analytics data
      });
    </script>
</body>
</html>`;
}
