// =============================================================================
// 🔑 MODERN API KEYS PAGE - Sleek key management
// =============================================================================

import { MODERN_CSS, MODERN_ICONS, THEME_PREVENTION_SCRIPT } from '../styles.js';
import { getModernLayout, getModernScripts } from '../navigation.js';
import { getAuthManagerScript } from '../../lib/auth/auth-manager.js';

export function getModernApiKeysPage() {
  const content = `
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <p class="text-secondary">Manage your API keys for OAuth Hub authentication</p>
      </div>
      <button class="btn btn-primary" onclick="showCreateKeyModal()">
        ${MODERN_ICONS.plus}
        Create New Key
      </button>
    </div>
    
    <!-- API Keys List -->
    <div class="card">
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Key</th>
              <th>Created</th>
              <th>Last Used</th>
              <th>Status</th>
              <th width="100">Actions</th>
            </tr>
          </thead>
          <tbody id="keys-list">
            <!-- Keys will be loaded here -->
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div id="empty-state" class="text-center py-12" style="display: none;">
        <div style="width: 80px; height: 80px; margin: 0 auto var(--space-5); background: var(--bg-tertiary); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center;">
          ${MODERN_ICONS.keys}
        </div>
        <h3 class="mb-2">No API Keys Yet</h3>
        <p class="text-secondary mb-5">Create your first API key to start using OAuth Hub</p>
        <button class="btn btn-primary" onclick="showCreateKeyModal()">
          ${MODERN_ICONS.plus}
          Create Your First Key
        </button>
      </div>
    </div>
    
    <!-- Usage Instructions -->
    <div class="card mt-6">
      <div class="card-header">
        <h3 class="card-title">How to Use Your API Key</h3>
      </div>
      <div class="space-y-4">
        <div>
          <h4 class="font-semibold mb-2">1. Generate Consent URL</h4>
          <div class="code-block">
            <pre><code>GET https://oauth-hub.com/consent/{platform}/{your_api_key}</code></pre>
          </div>
        </div>
        
        <div>
          <h4 class="font-semibold mb-2">2. Get Access Token</h4>
          <div class="code-block">
            <pre><code>GET https://oauth-hub.com/token/{platform_user_id}/{your_api_key}</code></pre>
          </div>
        </div>
        
        <div>
          <p class="text-secondary text-small">
            Keep your API keys secure. Never expose them in client-side code or public repositories.
          </p>
        </div>
      </div>
    </div>
    
    <!-- Create Key Modal -->
    <div class="modal-backdrop" id="create-key-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Create New API Key</h2>
          <button class="modal-close" onclick="hideCreateKeyModal()">
            ${MODERN_ICONS.close}
          </button>
        </div>
        <form onsubmit="handleCreateKey(event)">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label" for="keyName">Key Name</label>
              <input 
                type="text" 
                class="form-input" 
                id="keyName" 
                name="keyName"
                placeholder="Production API Key" 
                required
              >
              <p class="form-error text-small mt-2">Choose a descriptive name to identify this key</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="hideCreateKeyModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Key</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Key Created Modal -->
    <div class="modal-backdrop" id="key-created-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">API Key Created</h2>
        </div>
        <div class="modal-body">
          <div class="alert alert-warning mb-4">
            <span style="width: 20px; height: 20px;">${MODERN_ICONS.warning}</span>
            <span>Make sure to copy your API key now. You won't be able to see it again!</span>
          </div>
          
          <div class="form-group">
            <label class="form-label">Your API Key</label>
            <div class="flex gap-2">
              <input 
                type="text" 
                class="form-input font-mono" 
                id="newApiKey" 
                readonly 
                value=""
              >
              <button class="btn btn-secondary" onclick="copyApiKey()">
                ${MODERN_ICONS.copy}
                Copy
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="hideKeyCreatedModal()">Done</button>
        </div>
      </div>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Keys - OAuth Hub</title>
    
    ${THEME_PREVENTION_SCRIPT}
    
    <style>
      ${MODERN_CSS}
      
      /* Code Block Styles */
      .code-block {
        background: var(--bg-tertiary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-md);
        padding: var(--space-3);
        font-family: var(--font-mono);
        font-size: 0.875rem;
        overflow-x: auto;
      }
      
      .code-block pre {
        margin: 0;
      }
      
      .code-block code {
        color: var(--text-primary);
      }
      
      /* Key Display */
      .key-display {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        background: var(--bg-tertiary);
        padding: var(--space-2) var(--space-3);
        border-radius: var(--radius-sm);
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        max-width: 200px;
      }
      
      .key-value {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .key-hidden {
        filter: blur(4px);
        user-select: none;
      }
      
      .alert-warning {
        background: rgba(255, 149, 0, 0.1);
        border: 1px solid rgba(255, 149, 0, 0.2);
        color: var(--text-primary);
        padding: var(--space-3);
        border-radius: var(--radius-md);
        display: flex;
        align-items: flex-start;
        gap: var(--space-3);
      }
      
      .space-y-4 > * + * {
        margin-top: var(--space-4);
      }
      
      .font-mono {
        font-family: var(--font-mono);
      }
    </style>
</head>
<body>
    ${getModernLayout('api-keys', 'API Keys', content)}
    
    ${getAuthManagerScript()}
    ${getModernScripts()}
    
    <script>
      let apiKeys = [];
      
      // Load API keys
      async function loadApiKeys() {
        try {
          const email = localStorage.getItem('userEmail');
          if (!email) return;
          
          const response = await fetch(\`/user-keys?email=\${encodeURIComponent(email)}\`);
          if (response.ok) {
            const data = await response.json();
            apiKeys = data.keys || [];
            renderKeys();
          }
        } catch (error) {
          console.error('Error loading API keys:', error);
        }
      }
      
      // Render keys
      function renderKeys() {
        const tbody = document.getElementById('keys-list');
        const emptyState = document.getElementById('empty-state');
        const table = document.querySelector('.table-container');
        
        if (apiKeys.length === 0) {
          table.style.display = 'none';
          emptyState.style.display = 'block';
          return;
        }
        
        table.style.display = 'block';
        emptyState.style.display = 'none';
        
        tbody.innerHTML = apiKeys.map(key => {
          const createdDate = new Date(key.createdAt).toLocaleDateString();
          const lastUsed = key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never';
          const isActive = key.status === 'active';
          
          return \`
            <tr>
              <td>
                <div class="font-semibold">\${key.keyName}</div>
              </td>
              <td>
                <div class="key-display">
                  <span class="key-value key-hidden" id="key-\${key.keyId}">\${key.apiKey}</span>
                  <button class="btn btn-ghost btn-small" onclick="toggleKeyVisibility('\${key.keyId}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                  <button class="btn btn-ghost btn-small" onclick="copyKey('\${key.apiKey}')">
                    ${MODERN_ICONS.copy}
                  </button>
                </div>
              </td>
              <td>\${createdDate}</td>
              <td>\${lastUsed}</td>
              <td>
                <span class="badge \${isActive ? 'badge-success' : 'badge-neutral'}">
                  \${isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <button class="btn btn-ghost btn-small text-danger" onclick="deleteKey('\${key.keyId}', '\${key.keyName}')">
                  ${MODERN_ICONS.trash}
                </button>
              </td>
            </tr>
          \`;
        }).join('');
      }
      
      // Toggle key visibility
      function toggleKeyVisibility(keyId) {
        const keyElement = document.getElementById(\`key-\${keyId}\`);
        keyElement.classList.toggle('key-hidden');
      }
      
      // Copy key
      async function copyKey(apiKey) {
        try {
          await navigator.clipboard.writeText(apiKey);
          // Show success feedback
          const btn = event.currentTarget;
          const originalHTML = btn.innerHTML;
          btn.innerHTML = '${MODERN_ICONS.check}';
          btn.style.color = 'var(--brand-success)';
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.color = '';
          }, 2000);
        } catch (error) {
          alert('Failed to copy API key');
        }
      }
      
      // Show create key modal
      function showCreateKeyModal() {
        document.getElementById('create-key-modal').classList.add('active');
      }
      
      // Hide create key modal
      function hideCreateKeyModal() {
        document.getElementById('create-key-modal').classList.remove('active');
        document.getElementById('keyName').value = '';
      }
      
      // Handle create key
      async function handleCreateKey(event) {
        event.preventDefault();
        
        const keyName = document.getElementById('keyName').value;
        const email = localStorage.getItem('userEmail');
        
        try {
          const response = await fetch('/generate-key', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: keyName, email })
          });
          
          if (response.ok) {
            const data = await response.json();
            hideCreateKeyModal();
            showKeyCreatedModal(data.key.key);
            loadApiKeys();
          } else {
            const error = await response.json();
            alert(error.error || 'Failed to create API key');
          }
        } catch (error) {
          alert('Network error. Please try again.');
        }
      }
      
      // Show key created modal
      function showKeyCreatedModal(apiKey) {
        document.getElementById('newApiKey').value = apiKey;
        document.getElementById('key-created-modal').classList.add('active');
      }
      
      // Hide key created modal
      function hideKeyCreatedModal() {
        document.getElementById('key-created-modal').classList.remove('active');
      }
      
      // Copy new API key
      async function copyApiKey() {
        const apiKey = document.getElementById('newApiKey').value;
        try {
          await navigator.clipboard.writeText(apiKey);
          const btn = event.currentTarget;
          const originalText = btn.innerHTML;
          btn.innerHTML = '${MODERN_ICONS.check} Copied!';
          btn.classList.add('btn-success');
          btn.classList.remove('btn-secondary');
          
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.remove('btn-success');
            btn.classList.add('btn-secondary');
          }, 2000);
        } catch (error) {
          alert('Failed to copy API key');
        }
      }
      
      // Delete key
      async function deleteKey(keyId, keyName) {
        if (!confirm(\`Are you sure you want to delete "\${keyName}"?\`)) return;
        
        const email = localStorage.getItem('userEmail');
        
        try {
          const response = await fetch('/user-keys', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyId, email })
          });
          
          if (response.ok) {
            loadApiKeys();
          } else {
            alert('Failed to delete API key');
          }
        } catch (error) {
          alert('Network error. Please try again.');
        }
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
        
        loadApiKeys();
      });
    </script>
</body>
</html>`;
}
