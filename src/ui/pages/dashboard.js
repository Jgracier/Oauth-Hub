// =============================================================================
// 📊 MODERN DASHBOARD - Sleek analytics and overview
// =============================================================================

import { MODERN_CSS, MODERN_ICONS, THEME_PREVENTION_SCRIPT } from '../styles.js';
import { getModernLayout, getModernScripts } from '../navigation.js';
import { getAuthManagerScript } from '../../lib/auth/auth-manager.js';

export function getModernDashboardPage() {
  const content = `
    <!-- Page Header -->
    <div class="mb-6">
      <p class="text-secondary">Welcome back! Here's an overview of your OAuth platform.</p>
    </div>
    
    <!-- Stats Grid -->
    <div class="stats-grid">
      <!-- API Keys Card -->
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value" id="api-keys-count">-</div>
            <div class="stat-label">API Keys</div>
          </div>
          <div class="stat-icon" style="background: rgba(0, 113, 227, 0.1); color: var(--brand-accent);">
            ${MODERN_ICONS.keys}
          </div>
        </div>
        <div class="stat-action">
          <a href="/api-keys" class="btn btn-primary btn-small">Manage Keys</a>
        </div>
      </div>
      
      <!-- OAuth Apps Card -->
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value" id="apps-count">-</div>
            <div class="stat-label">OAuth Apps</div>
          </div>
          <div class="stat-icon" style="background: rgba(52, 199, 89, 0.1); color: var(--brand-success);">
            ${MODERN_ICONS.apps}
          </div>
        </div>
        <div class="stat-action">
          <a href="/apps" class="btn btn-primary btn-small">Configure Apps</a>
        </div>
      </div>
      
      <!-- Active Tokens Card -->
      <div class="stat-card">
        <div class="stat-header">
          <div>
            <div class="stat-value" id="tokens-count">-</div>
            <div class="stat-label">Active Tokens</div>
          </div>
          <div class="stat-icon" style="background: rgba(255, 149, 0, 0.1); color: var(--brand-warning);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>
        <div class="stat-action">
          <a href="/analytics" class="btn btn-primary btn-small">View Analytics</a>
        </div>
      </div>
    </div>
    
    <!-- Main Content Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); margin-top: var(--space-7);">
      <!-- Quick Start Guide -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Quick Start Guide</h3>
        </div>
        <div class="space-y-4">
          <div class="flex gap-3">
            <div class="flex-shrink-0">
              <div style="width: 32px; height: 32px; background: var(--bg-tertiary); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; color: var(--brand-accent); font-weight: 600;">
                1
              </div>
            </div>
            <div>
              <h4 class="font-semibold mb-1">Create API Key</h4>
              <p class="text-secondary text-small">Generate your first API key to authenticate requests</p>
              <a href="/api-keys" class="text-small" style="color: var(--brand-accent);">Create key →</a>
            </div>
          </div>
          
          <div class="flex gap-3">
            <div class="flex-shrink-0">
              <div style="width: 32px; height: 32px; background: var(--bg-tertiary); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; color: var(--brand-accent); font-weight: 600;">
                2
              </div>
            </div>
            <div>
              <h4 class="font-semibold mb-1">Add OAuth Apps</h4>
              <p class="text-secondary text-small">Configure your OAuth applications and credentials</p>
              <a href="/apps" class="text-small" style="color: var(--brand-accent);">Add app →</a>
            </div>
          </div>
          
          <div class="flex gap-3">
            <div class="flex-shrink-0">
              <div style="width: 32px; height: 32px; background: var(--bg-tertiary); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; color: var(--brand-accent); font-weight: 600;">
                3
              </div>
            </div>
            <div>
              <h4 class="font-semibold mb-1">Integrate</h4>
              <p class="text-secondary text-small">Use our API endpoints to manage OAuth tokens</p>
              <a href="/docs" class="text-small" style="color: var(--brand-accent);">View docs →</a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recent Activity -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recent Activity</h3>
          <button class="btn btn-ghost btn-small">View All</button>
        </div>
        <div id="recent-activity">
          <div class="text-center py-8">
            <div style="width: 64px; height: 64px; margin: 0 auto var(--space-4); background: var(--bg-tertiary); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <p class="text-secondary">No recent activity</p>
            <p class="text-small text-muted mt-2">Your OAuth activity will appear here</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Platform Integration Status -->
    <div class="card mt-6">
      <div class="card-header">
        <h3 class="card-title">Platform Integration Status</h3>
        <a href="/apps" class="btn btn-primary btn-small">
          ${MODERN_ICONS.plus}
          Add Platform
        </a>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4" id="platform-status">
        <!-- Platforms will be loaded here -->
      </div>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - OAuth Hub</title>
    
    ${THEME_PREVENTION_SCRIPT}
    
    <style>${MODERN_CSS}</style>
</head>
<body>
    ${getModernLayout('dashboard', 'Dashboard', content)}
    
    ${getAuthManagerScript()}
    ${getModernScripts()}
    
    <script>
      // Platform data
      const platforms = [
        { id: 'google', name: 'Google', icon: '🔍', color: '#4285F4' },
        { id: 'facebook', name: 'Facebook', icon: '📘', color: '#1877F2' },
        { id: 'twitter', name: 'Twitter', icon: '🐦', color: '#1DA1F2' },
        { id: 'github', name: 'GitHub', icon: '🐙', color: '#181717' },
        { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
        { id: 'instagram', name: 'Instagram', icon: '📸', color: '#E4405F' },
        { id: 'tiktok', name: 'TikTok', icon: '🎵', color: '#000000' },
        { id: 'discord', name: 'Discord', icon: '💬', color: '#5865F2' }
      ];
      
      // Load dashboard data
      async function loadDashboardData() {
        try {
          const email = localStorage.getItem('userEmail');
          if (!email) return;

          // Show loading state
          document.getElementById('api-keys-count').innerHTML = '<div class="skeleton" style="width: 60px; height: 32px;"></div>';
          document.getElementById('apps-count').innerHTML = '<div class="skeleton" style="width: 60px; height: 32px;"></div>';
          document.getElementById('tokens-count').innerHTML = '<div class="skeleton" style="width: 60px; height: 32px;"></div>';

          // Load data in parallel
          const [keysResponse, appsResponse] = await Promise.all([
            fetch(`/user-keys?email=\${encodeURIComponent(email)}`).catch(() => null),
            fetch(`/user-apps?email=\${encodeURIComponent(email)}`).catch(() => null)
          ]);

          let apiKeysCount = 0;
          let appsCount = 0;
          let configuredPlatforms = [];

          if (keysResponse && keysResponse.ok) {
            const keysData = await keysResponse.json();
            apiKeysCount = keysData.keys ? keysData.keys.length : 0;
          }

          if (appsResponse && appsResponse.ok) {
            const appsData = await appsResponse.json();
            appsCount = appsData.apps ? appsData.apps.length : 0;
            configuredPlatforms = appsData.apps ? appsData.apps.map(app => app.platform) : [];
          }
          
          // Animate counter updates
          animateCounter('api-keys-count', 0, apiKeysCount);
          animateCounter('apps-count', 0, appsCount);
          animateCounter('tokens-count', 0, 0); // TODO: Implement token counting
          
          // Update platform status
          updatePlatformStatus(configuredPlatforms);

        } catch (error) {
          console.error('Error loading dashboard data:', error);
          document.getElementById('api-keys-count').textContent = '0';
          document.getElementById('apps-count').textContent = '0';
          document.getElementById('tokens-count').textContent = '0';
        }
      }
      
      // Animate counter
      function animateCounter(elementId, start, end, duration = 500) {
        const element = document.getElementById(elementId);
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
          current += increment;
          if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = end;
            clearInterval(timer);
          } else {
            element.textContent = Math.floor(current);
          }
        }, 16);
      }
      
      // Update platform status
      function updatePlatformStatus(configuredPlatforms) {
        const container = document.getElementById('platform-status');
        
        container.innerHTML = platforms.map(platform => {
          const isConfigured = configuredPlatforms.includes(platform.id);
          return `
            <div class="flex items-center gap-3 p-3 rounded-lg border \${isConfigured ? 'border-green-200 bg-green-50' : 'border-gray-200'}" style="background: \${isConfigured ? 'rgba(52, 199, 89, 0.05)' : 'var(--bg-secondary)'};">
              <div style="width: 40px; height: 40px; background: \${isConfigured ? platform.color + '20' : 'var(--bg-tertiary)'}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                \${platform.icon}
              </div>
              <div class="flex-1">
                <div class="font-medium text-small">\${platform.name}</div>
                <div class="text-tiny \${isConfigured ? 'text-green-600' : 'text-muted'}">\${isConfigured ? 'Connected' : 'Not connected'}</div>
              </div>
              \${isConfigured ? '<span style="color: var(--brand-success);">${MODERN_ICONS.check}</span>' : ''}
            </div>
          `;
        }).join('');
      }
      
      // Initialize user info
      function initUserInfo() {
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        
        if (userEmail && userName) {
          // Update sidebar profile info
          const emailElements = document.querySelectorAll('.profile-email');
          const nameElements = document.querySelectorAll('.profile-name');
          
          emailElements.forEach(el => el.textContent = userEmail);
          nameElements.forEach(el => el.textContent = userName);
          
          // Update avatar
          const avatarElements = document.querySelectorAll('.profile-avatar');
          const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
          avatarElements.forEach(el => el.textContent = initials);
        }
      }
      
      // Load data on page load
      document.addEventListener('DOMContentLoaded', () => {
        initUserInfo();
        setTimeout(loadDashboardData, 100);
      });
    </script>
</body>
</html>`;
}
