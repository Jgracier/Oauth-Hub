// =============================================================================
// 📱 MODERN OAUTH APPS PAGE - Sleek app management
// =============================================================================

import { MODERN_CSS, MODERN_ICONS } from '../modern-styles.js';
import { getModernLayout, getModernScripts } from '../modern-navigation.js';
import { getClientAuthScript } from '../../lib/auth/client-auth.js';
import { PLATFORMS } from '../../core/platforms.js';

export function getModernAppsPage() {
  const content = `
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <p class="text-secondary">Configure your OAuth applications and manage credentials</p>
      </div>
      <button class="btn btn-primary" onclick="showAddAppModal()">
        ${MODERN_ICONS.plus}
        Add OAuth App
      </button>
    </div>
    
    <!-- Search and Filters -->
    <div class="card mb-6">
      <div class="flex gap-4 flex-wrap">
        <div class="flex-1 min-w-[300px]">
          <div class="relative">
            <input 
              type="search" 
              placeholder="Search apps..." 
              class="form-input pl-10"
              id="search-apps"
              onkeyup="filterApps()"
            >
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              ${MODERN_ICONS.search}
            </div>
          </div>
        </div>
        <select class="form-input" id="platform-filter" onchange="filterApps()">
          <option value="">All Platforms</option>
          ${Object.entries(PLATFORMS).map(([key, platform]) => 
            `<option value="${key}">${platform.displayName}</option>`
          ).join('')}
        </select>
      </div>
    </div>
    
    <!-- Apps Grid -->
    <div id="apps-container" class="grid gap-5">
      <!-- Apps will be loaded here -->
    </div>
    
    <!-- Empty State -->
    <div id="empty-state" class="card text-center py-12" style="display: none;">
      <div style="width: 80px; height: 80px; margin: 0 auto var(--space-5); background: var(--bg-tertiary); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center;">
        ${MODERN_ICONS.apps}
      </div>
      <h3 class="mb-2">No OAuth Apps Yet</h3>
      <p class="text-secondary mb-5">Add your first OAuth application to get started</p>
      <button class="btn btn-primary" onclick="showAddAppModal()">
        ${MODERN_ICONS.plus}
        Add Your First App
      </button>
    </div>
    
    <!-- Add/Edit App Modal -->
    <div class="modal-backdrop" id="app-modal">
      <div class="modal" style="max-width: 700px;">
        <div class="modal-header">
          <h2 class="modal-title" id="modal-title">Add OAuth App</h2>
          <button class="modal-close" onclick="hideAppModal()">
            ${MODERN_ICONS.close}
          </button>
        </div>
        <form id="app-form" onsubmit="handleSaveApp(event)">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label" for="platform">Platform</label>
              <select class="form-input" id="platform" name="platform" required onchange="updatePlatformInfo()">
                <option value="">Select a platform</option>
                ${Object.entries(PLATFORMS).map(([key, platform]) => 
                  `<option value="${key}">${platform.displayName}</option>`
                ).join('')}
              </select>
            </div>
            
            <div id="platform-info" class="alert alert-info mb-5" style="display: none;">
              <div class="flex gap-3">
                <span id="platform-icon" style="font-size: 1.5rem;"></span>
                <div>
                  <p class="font-semibold mb-1">Platform Configuration</p>
                  <p class="text-small">Redirect URI: <code>https://oauth-hub.com</code></p>
                  <a href="#" id="platform-docs-link" target="_blank" class="text-small">View developer docs →</a>
                </div>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label" for="name">App Name</label>
                <input type="text" class="form-input" id="name" name="name" placeholder="My App" required>
              </div>
              
              <div class="form-group">
                <label class="form-label" for="clientId">Client ID</label>
                <input type="text" class="form-input" id="clientId" name="clientId" placeholder="Your client ID" required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="clientSecret">Client Secret</label>
              <div class="password-input-wrapper">
                <input type="password" class="form-input" id="clientSecret" name="clientSecret" placeholder="Your client secret" required>
                <button type="button" class="password-toggle" onclick="toggleSecret()">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Scopes</label>
              <div id="scope-selector" class="border rounded-lg p-3 bg-secondary">
                <!-- Scope selector will be initialized here -->
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="hideAppModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">
              <span id="save-btn-text">Add App</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OAuth Apps - OAuth Hub</title>
    <style>
      ${MODERN_CSS}
      
      /* App Card Styles */
      .app-card {
        background: var(--bg-elevated);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-lg);
        padding: var(--space-5);
        transition: all var(--transition-fast);
        position: relative;
        overflow: hidden;
      }
      
      .app-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
        border-color: var(--border-medium);
      }
      
      .app-header {
        display: flex;
        align-items: flex-start;
        gap: var(--space-4);
        margin-bottom: var(--space-4);
      }
      
      .app-icon {
        width: 56px;
        height: 56px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.75rem;
        flex-shrink: 0;
      }
      
      .app-info {
        flex: 1;
        min-width: 0;
      }
      
      .app-name {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--space-1);
      }
      
      .app-platform {
        font-size: 0.875rem;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }
      
      .app-details {
        display: grid;
        gap: var(--space-3);
        margin-bottom: var(--space-4);
      }
      
      .app-detail {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        font-size: 0.875rem;
      }
      
      .app-detail-label {
        color: var(--text-tertiary);
        min-width: 80px;
      }
      
      .app-detail-value {
        color: var(--text-secondary);
        font-family: var(--font-mono);
        font-size: 0.75rem;
        background: var(--bg-tertiary);
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        word-break: break-all;
      }
      
      .app-scopes {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-bottom: var(--space-4);
      }
      
      .scope-badge {
        padding: var(--space-1) var(--space-2);
        background: var(--bg-tertiary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        color: var(--text-secondary);
      }
      
      .app-actions {
        display: flex;
        gap: var(--space-2);
        padding-top: var(--space-4);
        border-top: 1px solid var(--border-light);
      }
      
      /* Scope Selector */
      .scope-selector {
        max-height: 300px;
        overflow-y: auto;
      }
      
      .scope-group {
        margin-bottom: var(--space-3);
      }
      
      .scope-group-title {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-tertiary);
        text-transform: uppercase;
        margin-bottom: var(--space-2);
      }
      
      .scope-item {
        display: flex;
        align-items: flex-start;
        gap: var(--space-2);
        padding: var(--space-2);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: background var(--transition-fast);
      }
      
      .scope-item:hover {
        background: var(--bg-tertiary);
      }
      
      .scope-checkbox {
        margin-top: 2px;
      }
      
      .scope-info {
        flex: 1;
      }
      
      .scope-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary);
      }
      
      .scope-description {
        font-size: 0.75rem;
        color: var(--text-tertiary);
        margin-top: 2px;
      }
      
      .alert-info {
        background: rgba(0, 113, 227, 0.1);
        border: 1px solid rgba(0, 113, 227, 0.2);
        color: var(--text-primary);
        padding: var(--space-3);
        border-radius: var(--radius-md);
      }
    </style>
</head>
<body>
    ${getModernLayout('apps', 'OAuth Apps', content)}
    
    ${getClientAuthScript()}
    ${getModernScripts()}
    
    <script>
      // Define PLATFORMS for client-side use (moved to top to fix template literal issues)
      const PLATFORMS = ${JSON.stringify(PLATFORMS)};
      
      let apps = [];
      let editingApp = null;
      let selectedScopes = new Set();
      
      // Load apps
      async function loadApps() {
        try {
          const email = localStorage.getItem('userEmail');
          if (!email) return;
          
          const response = await fetch(\`/user-apps?email=\${encodeURIComponent(email)}\`);
          if (response.ok) {
            const data = await response.json();
            apps = data.apps || [];
            renderApps();
          }
        } catch (error) {
          console.error('Error loading apps:', error);
        }
      }
      
      // Render apps
      function renderApps() {
        const container = document.getElementById('apps-container');
        const emptyState = document.getElementById('empty-state');
        
        if (apps.length === 0) {
          container.style.display = 'none';
          emptyState.style.display = 'block';
          return;
        }
        
        container.style.display = 'grid';
        emptyState.style.display = 'none';
        
        container.innerHTML = apps.map(app => {
          const platform = PLATFORMS[app.platform] || {};
          const iconColor = platform.color || '#000';
          
          return \`
            <div class="app-card">
              <div class="app-header">
                <div class="app-icon" style="background: \${iconColor}20;">
                  <span>\${platform.icon || '📱'}</span>
                </div>
                <div class="app-info">
                  <div class="app-name">\${app.name}</div>
                  <div class="app-platform">
                    \${platform.displayName || app.platform}
                    <span class="badge badge-neutral">\${app.platform}</span>
                  </div>
                </div>
              </div>
              
              <div class="app-details">
                <div class="app-detail">
                  <span class="app-detail-label">Client ID:</span>
                  <span class="app-detail-value">\${app.clientId}</span>
                </div>
              </div>
              
              <div class="app-scopes">
                \${app.scopes.slice(0, 3).map(scope => 
                  \`<span class="scope-badge">\${scope}</span>\`
                ).join('')}
                \${app.scopes.length > 3 ? \`<span class="scope-badge">+\${app.scopes.length - 3} more</span>\` : ''}
              </div>
              
              <div class="app-actions">
                <button class="btn btn-secondary btn-small" onclick='editApp(\${JSON.stringify(app)})'>
                  ${MODERN_ICONS.edit}
                  Edit
                </button>
                <button class="btn btn-ghost btn-small text-danger" onclick="deleteApp('\${app.platform}', '\${app.name}')">
                  ${MODERN_ICONS.trash}
                  Delete
                </button>
              </div>
            </div>
          \`;
        }).join('');
      }
      
      // Filter apps
      function filterApps() {
        const searchTerm = document.getElementById('search-apps').value.toLowerCase();
        const platformFilter = document.getElementById('platform-filter').value;
        
        const filtered = apps.filter(app => {
          const matchesSearch = !searchTerm || 
            app.name.toLowerCase().includes(searchTerm) ||
            app.platform.toLowerCase().includes(searchTerm);
          
          const matchesPlatform = !platformFilter || app.platform === platformFilter;
          
          return matchesSearch && matchesPlatform;
        });
        
        // Re-render with filtered apps
        const originalApps = apps;
        apps = filtered;
        renderApps();
        apps = originalApps;
      }
      
      // Show add app modal
      function showAddAppModal() {
        editingApp = null;
        selectedScopes = new Set();
        document.getElementById('modal-title').textContent = 'Add OAuth App';
        document.getElementById('save-btn-text').textContent = 'Add App';
        document.getElementById('app-form').reset();
        document.getElementById('platform-info').style.display = 'none';
        document.getElementById('app-modal').classList.add('active');
        initializeScopeSelector();
      }
      
      // Hide app modal
      function hideAppModal() {
        document.getElementById('app-modal').classList.remove('active');
      }
      
      // Edit app
      function editApp(app) {
        editingApp = app;
        selectedScopes = new Set(app.scopes);
        
        document.getElementById('modal-title').textContent = 'Edit OAuth App';
        document.getElementById('save-btn-text').textContent = 'Save Changes';
        
        // Fill form
        document.getElementById('platform').value = app.platform;
        document.getElementById('name').value = app.name;
        document.getElementById('clientId').value = app.clientId;
        document.getElementById('clientSecret').value = app.clientSecret;
        
        updatePlatformInfo();
        document.getElementById('app-modal').classList.add('active');
        initializeScopeSelector();
      }
      
      // Update platform info
      function updatePlatformInfo() {
        const platformKey = document.getElementById('platform').value;
        const platformInfo = document.getElementById('platform-info');
        
        if (!platformKey) {
          platformInfo.style.display = 'none';
          return;
        }
        
        const platform = PLATFORMS[platformKey];
        if (platform) {
          document.getElementById('platform-icon').textContent = platform.icon;
          document.getElementById('platform-docs-link').href = platform.docsUrl;
          platformInfo.style.display = 'block';
        }
      }
      
      // Toggle secret visibility
      function toggleSecret() {
        const input = document.getElementById('clientSecret');
        input.type = input.type === 'password' ? 'text' : 'password';
      }
      
      // Initialize scope selector
      function initializeScopeSelector() {
        const container = document.getElementById('scope-selector');
        const platformKey = document.getElementById('platform').value;
        
        if (!platformKey) {
          container.innerHTML = '<p class="text-muted text-small">Select a platform to configure scopes</p>';
          return;
        }
        
        const platform = PLATFORMS[platformKey];
        const scopes = platform.scopes || {};
        
        container.innerHTML = \`
          <div class="scope-selector">
            \${Object.entries(scopes).map(([category, categoryScopes]) => \`
              <div class="scope-group">
                <div class="scope-group-title">\${category}</div>
                \${Object.entries(categoryScopes).map(([scopeKey, scopeInfo]) => {
                  const isChecked = selectedScopes.has(scopeKey);
                  const isRequired = platform.requiredScopes?.includes(scopeKey);
                  
                  return \`
                    <label class="scope-item">
                      <input 
                        type="checkbox" 
                        class="scope-checkbox" 
                        value="\${scopeKey}"
                        \${isChecked ? 'checked' : ''}
                        \${isRequired ? 'checked disabled' : ''}
                        onchange="toggleScope('\${scopeKey}')"
                      >
                      <div class="scope-info">
                        <div class="scope-name">
                          \${scopeInfo.name}
                          \${isRequired ? '<span class="badge badge-primary text-tiny ml-2">Required</span>' : ''}
                        </div>
                        <div class="scope-description">\${scopeInfo.description}</div>
                      </div>
                    </label>
                  \`;
                }).join('')}
              </div>
            \`).join('')}
          </div>
        \`;
        
        // Add required scopes
        const requiredScopes = platform.requiredScopes || [];
        requiredScopes.forEach(scope => selectedScopes.add(scope));
      }
      
      // Toggle scope
      function toggleScope(scope) {
        if (selectedScopes.has(scope)) {
          selectedScopes.delete(scope);
        } else {
          selectedScopes.add(scope);
        }
      }
      
      // Handle save app
      async function handleSaveApp(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const email = localStorage.getItem('userEmail');
        
        const appData = {
          platform: formData.get('platform'),
          name: formData.get('name'),
          clientId: formData.get('clientId'),
          clientSecret: formData.get('clientSecret'),
          scopes: Array.from(selectedScopes),
          userEmail: email
        };
        
        try {
          const response = await fetch('/user-apps', {
            method: editingApp ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData)
          });
          
          if (response.ok) {
            hideAppModal();
            loadApps();
          } else {
            const error = await response.json();
            alert(error.error || 'Failed to save app');
          }
        } catch (error) {
          alert('Network error. Please try again.');
        }
      }
      
      // Delete app
      async function deleteApp(platform, name) {
        if (!confirm(\`Are you sure you want to delete "\${name}"?\`)) return;
        
        const email = localStorage.getItem('userEmail');
        
        try {
          const response = await fetch('/user-apps', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ platform, userEmail: email })
          });
          
          if (response.ok) {
            loadApps();
          } else {
            alert('Failed to delete app');
          }
        } catch (error) {
          alert('Network error. Please try again.');
        }
      }
      
      // Platform selector change
      document.getElementById('platform').addEventListener('change', initializeScopeSelector);
      
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
        
        loadApps();
      });
    </script>
</body>
</html>`;
}
