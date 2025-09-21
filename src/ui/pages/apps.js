// =============================================================================
// 📱 MODERN OAUTH APPS PAGE - Sleek app management
// =============================================================================

import { MODERN_CSS, MODERN_ICONS, THEME_PREVENTION_SCRIPT } from '../styles.js';
import { getModernLayout, getModernScripts } from '../navigation.js';
import { getAuthManagerScript } from '../../lib/auth/auth-manager.js';
import { PLATFORMS } from '../../core/platforms/index.js';

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
      <p class="text-secondary">Use the "Add OAuth App" button above to create your first application</p>
    </div>
    
    <!-- Add/Edit App Modal -->
    <div class="modal-backdrop" id="app-modal">
        <div class="modal">
            <div class="modal-header">
          <h2 class="modal-title" id="modal-title">Add OAuth App</h2>
          <button class="modal-close" onclick="hideAppModal()">
            ${MODERN_ICONS.close}
          </button>
            </div>
        <div class="modal-body">
          <form id="app-form" onsubmit="handleSaveApp(event)">
                <div class="form-group">
              <label class="form-label" for="platform">Platform</label>
              <select class="form-input" id="platform" name="platform" required onchange="updatePlatformInfo()">
                        <option value="">Select a platform</option>
                ${Object.entries(PLATFORMS).map(([key, platform]) => 
                  `<option value="${key}">${platform.displayName}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="form-group">
                <label class="form-label" for="clientId">Client ID</label>
                <input type="text" class="form-input" id="clientId" name="clientId" placeholder="Your client ID" required>
                </div>
                
                <div class="form-group">
              <label class="form-label" for="clientSecret">Client Secret</label>
              <input type="password" class="form-input" id="clientSecret" name="clientSecret" placeholder="Your client secret" required>
                </div>
                
            <!-- Redirect URI -->
                <div class="form-group">
              <div class="modern-field">
                <span class="field-label">Redirect URI:</span>
                <span class="field-value" id="redirect-uri-display">https://oauth-hub.com/callback</span>
                <button type="button" class="field-copy-btn" onclick="copyRedirectUri(event)" title="Copy redirect URI">
                  ${MODERN_ICONS.copy}
                </button>
                <input type="hidden" id="redirect-uri" value="https://oauth-hub.com/callback">
              </div>
                </div>
                
                <!-- Auto-detection status (optional display) -->
                <div class="form-group" id="status-section" style="display: none;">
                  <div id="connection-status" class="connection-status">
                    <!-- Status messages will appear here during add process -->
                  </div>
                </div>
          </form>
                </div>
                
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="hideAppModal()">Cancel</button>
          <button type="submit" class="btn btn-primary" form="app-form" id="add-app-btn">
            ${MODERN_ICONS.plus}
            <span id="add-btn-text">Add App</span>
          </button>
        </div>
        </div>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OAuth Apps - OAuth Hub</title>
    
    ${THEME_PREVENTION_SCRIPT}
    
    <style>
      ${MODERN_CSS}
      
      /* Professional Modal Overrides */
      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index: 9999;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .modal-backdrop.active {
        display: flex;
        opacity: 1;
      }
      
      .modal {
        background: var(--bg-primary);
        border-radius: 12px;
        box-shadow: 
          0 25px 50px -12px rgba(0, 0, 0, 0.25),
          0 0 0 1px rgba(255, 255, 255, 0.05);
        width: 100%;
        max-width: 600px !important;
        max-height: calc(100vh - 80px);
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
        animation: modalSlideIn 0.3s ease-out;
      }
      
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .modal-header {
        padding: 24px 24px 20px;
        border-bottom: 1px solid var(--border-light);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--bg-primary);
        flex-shrink: 0;
      }
      
      .modal-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        letter-spacing: -0.025em;
      }
      
      .modal-close {
        background: var(--bg-secondary);
        border: none;
        padding: 10px;
        cursor: pointer;
        border-radius: 8px;
        color: var(--text-secondary);
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
      }
      
      .modal-close:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
        transform: scale(1.05);
      }
      
      .modal-close svg {
        width: 20px;
        height: 20px;
      }
      
      .modal-body {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 24px;
        background: var(--bg-primary);
      }
      
      .modal-body::-webkit-scrollbar {
        width: 6px;
      }
      
      .modal-body::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .modal-body::-webkit-scrollbar-thumb {
        background: var(--border-light);
        border-radius: 3px;
      }
      
      .modal-body::-webkit-scrollbar-thumb:hover {
        background: var(--text-muted);
      }
      
      .modal-footer {
        padding: 20px 24px 24px;
        border-top: 1px solid var(--border-light);
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        background: var(--bg-secondary);
        flex-shrink: 0;
      }
      
      /* Form Groups in Modal */
      .modal-body .form-group {
        margin-bottom: 24px;
      }
      
      .modal-body .form-group:last-child {
        margin-bottom: 0;
      }
      
      /* Enhanced Form Styling */
      .form-label {
        display: block;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 8px;
        font-size: 0.9rem;
      }
      
      .form-input, .form-select {
        width: 100%;
        padding: 12px 16px;
        border: 1.5px solid var(--border-light);
        border-radius: 8px;
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 0.9rem;
        transition: all 0.2s ease;
      }
      
      .form-input:focus, .form-select:focus {
        outline: none;
        border-color: var(--brand-accent);
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
      }
      
      .form-input::placeholder {
        color: var(--text-muted);
      }
      
      /* Button Enhancements */
      .btn {
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 500;
        font-size: 0.9rem;
        transition: all 0.2s ease;
        cursor: pointer;
        border: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      
      .btn-primary {
        background: var(--brand-accent);
        color: white;
      }
      
      .btn-primary:hover {
        background: var(--brand-accent-dark);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
      }
      
      .btn-secondary {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border-light);
      }
      
      .btn-secondary:hover {
        background: var(--bg-tertiary);
        transform: translateY(-1px);
      }
      
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
      
      /* Connection Status Display */
      .connection-status {
        min-height: 40px;
        padding: var(--space-3);
        background: var(--bg-tertiary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-md);
      }
      
      .scope-summary {
        padding: var(--space-3);
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
      }
      
      .scope-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }
      
      .scope-tag {
        background: var(--brand-accent);
        color: white;
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        font-size: var(--text-sm);
        font-weight: 500;
      }
      
      .alert {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        padding: var(--space-3);
        border-radius: var(--radius-md);
        font-weight: 500;
      }
      
      .alert-success {
        background: rgba(34, 197, 94, 0.1);
        color: var(--success-color);
        border: 1px solid rgba(34, 197, 94, 0.2);
      }
      
      .alert-error {
        background: rgba(239, 68, 68, 0.1);
        color: var(--error-color);
        border: 1px solid rgba(239, 68, 68, 0.2);
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
      
      /* Modern Field Styles */
      .modern-field {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-bottom: 1px solid var(--border-light);
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
        position: relative;
        width: 90%;
      }
      
      .field-label {
        font-weight: 500;
        color: var(--text-secondary);
        min-width: 100px;
        font-size: 0.9rem;
      }
      
      .field-value {
        flex: 1;
        color: var(--text-primary);
        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        font-size: 0.9rem;
        background: transparent;
        border: none;
        outline: none;
      }
      
      .field-copy-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .field-copy-btn:hover {
        color: var(--text-primary);
        background: var(--bg-tertiary);
      }
      
      .field-copy-btn svg {
        width: 16px;
        height: 16px;
      }
      
      /* Scope Container Styles */
      .scope-container {
        border: 1px solid var(--border-light);
        border-radius: 8px;
        background: var(--bg-primary);
        min-height: 200px;
        max-height: 300px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .scope-header {
        padding: 16px;
        border-bottom: 1px solid var(--border-light);
        background: var(--bg-secondary);
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .scope-search {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--border-light);
        border-radius: var(--radius-md);
        background: var(--bg-primary);
        font-size: 0.9rem;
      }
      
      .scope-search:focus {
        outline: none;
        border-color: var(--brand-accent);
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
      }
      
      .scope-summary {
        font-size: 0.85rem;
        color: var(--text-secondary);
        white-space: nowrap;
      }
      
      .scope-summary #selected-count {
        font-weight: 600;
        color: var(--brand-accent);
      }
      
      .scope-list {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0;
      }
      
      .scope-list::-webkit-scrollbar {
        width: 6px;
      }
      
      .scope-list::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .scope-list::-webkit-scrollbar-thumb {
        background: var(--border-light);
        border-radius: 3px;
      }
      
      .scope-list::-webkit-scrollbar-thumb:hover {
        background: var(--text-muted);
      }
      
      .scope-group {
        margin-bottom: 4px;
      }
      
      .scope-group-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px 8px;
        background: var(--bg-tertiary);
        border-bottom: 1px solid var(--border-light);
      }
      
      .scope-group-title {
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.9rem;
        margin: 0;
      }
      
      .scope-group-count {
        font-size: 0.8rem;
        color: var(--text-muted);
      }
      
      .scope-items {
        background: var(--bg-primary);
      }
      
      .scope-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 16px;
        cursor: pointer;
        border-bottom: 1px solid var(--border-light);
        transition: background-color 0.2s ease;
      }
      
      .scope-item:hover {
        background: var(--bg-secondary);
      }
      
      .scope-item:last-child {
        border-bottom: none;
      }
      
      .scope-item.scope-required {
        background: rgba(0, 123, 255, 0.05);
        border-left: 3px solid var(--brand-accent);
      }
      
      .scope-checkbox-wrapper {
        position: relative;
        margin-top: 2px;
      }
      
      .scope-checkbox {
        width: 18px;
        height: 18px;
        margin: 0;
        opacity: 0;
        cursor: pointer;
      }
      
      .checkbox-custom {
        position: absolute;
        top: 0;
        left: 0;
        width: 18px;
        height: 18px;
        border: 2px solid var(--border-light);
        border-radius: 3px;
        background: var(--bg-primary);
        transition: all 0.2s ease;
        pointer-events: none;
      }
      
      .scope-checkbox:checked + .checkbox-custom {
        background: var(--brand-accent);
        border-color: var(--brand-accent);
      }
      
      .scope-checkbox:checked + .checkbox-custom::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
      }
      
      .scope-checkbox:disabled + .checkbox-custom {
        background: var(--bg-tertiary);
        border-color: var(--border-light);
        opacity: 0.7;
      }
      
      .scope-content {
        flex: 1;
        min-width: 0;
      }
      
      .scope-name {
        font-weight: 500;
        color: var(--text-primary);
        font-size: 0.9rem;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .scope-description {
        color: var(--text-secondary);
        font-size: 0.85rem;
        line-height: 1.4;
        margin-bottom: 4px;
      }
      
      .scope-key {
        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
        font-size: 0.75rem;
        color: var(--text-muted);
        background: var(--bg-tertiary);
        padding: 2px 6px;
        border-radius: 3px;
        display: inline-block;
      }
      
      .scope-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .scope-badge-required {
        background: var(--brand-accent);
        color: white;
      }
      
      /* Scope Info Message */
      .scope-info-message {
        padding: 20px;
        text-align: center;
        background: var(--bg-secondary);
        border-radius: 8px;
        border: 1px solid var(--border-light);
      }
      
      /* Compact App Card Styles */
      .app-card {
        background: var(--bg-elevated);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-lg);
        padding: var(--space-4);
        transition: all var(--transition-fast);
        position: relative;
        overflow: hidden;
      }
      
      .app-header {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        margin-bottom: var(--space-3);
      }
      
      .app-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        flex-shrink: 0;
      }
      
      .app-info {
        flex: 1;
        min-width: 0;
      }
      
      .app-name {
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.95rem;
        margin-bottom: 2px;
      }
      
      .app-scopes {
        font-size: 0.8rem;
        color: var(--text-secondary);
        line-height: 1.3;
      }
      
      .scope-text {
        cursor: help;
      }
      
      .app-controls {
        display: flex;
        gap: var(--space-2);
        align-items: center;
      }
      
      .edit-btn, .delete-btn {
        background: none;
        border: none;
        padding: 6px;
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all var(--transition-fast);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .edit-btn {
        color: var(--text-secondary);
      }
      
      .edit-btn:hover {
        color: var(--primary);
        background: var(--primary-light);
      }
      
      .delete-btn {
        color: var(--text-muted);
      }
      
      .delete-btn:hover {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
      }
      
      .app-details {
        font-size: 0.8rem;
      }
      
      .app-detail {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }
      
      .app-detail-label {
        color: var(--text-secondary);
        font-weight: 500;
      }
      
      .app-detail-value {
        color: var(--text-primary);
        font-family: var(--font-mono);
        font-size: 0.75rem;
      }
    </style>
</head>
<body>
    ${getModernLayout('apps', 'OAuth Apps', content)}
    
    ${getAuthManagerScript()}
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
                } else {
                    console.error('Failed to load apps, status:', response.status);
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
          const platformName = platform.displayName || app.platform.charAt(0).toUpperCase() + app.platform.slice(1);
          const iconColor = platform.color || '#4F46E5';
          
          // Format scopes for display
          const scopes = app.scopes || [];
          const scopeNames = scopes.map(scope => {
            // Handle different scope formats
            if (scope.includes('googleapis.com')) {
              // Google scopes: extract the service name
              const parts = scope.split('/');
              const lastPart = parts[parts.length - 1];
              return lastPart.replace('auth.', '').replace(/\./g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
            } else if (scope.includes(':')) {
              // GitHub-style scopes: user:follow -> User Follow
              return scope.split(':').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
            } else {
              // Simple scopes: user -> User
              return scope.charAt(0).toUpperCase() + scope.slice(1);
            }
          });
          const scopeDisplay = scopeNames.length > 0 ? scopeNames.join(', ') : 'No scopes';
          const truncatedScopes = scopeDisplay.length > 40 ? scopeDisplay.substring(0, 40) + '...' : scopeDisplay;
          
          return \`
            <div class="app-card">
              <div class="app-header">
                <div class="app-icon" style="background: \${iconColor}20; color: \${iconColor};">
                  <span>\${platform.icon || '🔗'}</span>
                                </div>
                <div class="app-info">
                  <div class="app-name">\${platformName}</div>
                  <div class="app-scopes" title="\${scopeDisplay}">
                    <span class="scope-text">\${truncatedScopes}</span>
                                </div>
                            </div>
                <div class="app-controls">
                  <button class="edit-btn" onclick='editApp(\${JSON.stringify(app)})' title="Edit app">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button class="delete-btn" onclick="deleteApp('\${app.platform}', '\${platformName}')" title="Delete app">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                            </div>
                        </div>
                        
              <div class="app-details">
                <div class="app-detail">
                  <span class="app-detail-label">Client ID:</span>
                  <span class="app-detail-value">\${app.clientId}</span>
                        </div>
                    </div>
                </div>
          \`;
        }).join('');
      }
      
      // Filter apps
      function copyRedirectUri(event) {
        const redirectUri = document.getElementById('redirect-uri').value;
        navigator.clipboard.writeText(redirectUri).then(() => {
          // Show success feedback
          const button = event.target.closest('button');
          const originalHTML = button.innerHTML;
          button.innerHTML = '${MODERN_ICONS.check}';
          button.style.color = 'var(--success)';
          setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.color = '';
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
      }
      
      // Show add app modal
      function showAddAppModal() {
        editingApp = null;
        selectedScopes = new Set();
        document.getElementById('modal-title').textContent = 'Add OAuth App';
        document.getElementById('save-btn-text').textContent = 'Add App';
        document.getElementById('app-form').reset();
        
        // Hide scopes section initially
        document.getElementById('scopes-section').style.display = 'none';
        
        document.getElementById('app-modal').classList.add('active');
      }
      
      // Hide app modal
      function hideAppModal() {
        document.getElementById('app-modal').classList.remove('active');
      }
      
      // Edit app
      function editApp(app) {
        editingApp = app;
        selectedScopes = new Set(app.scopes || []);
        
        // Update modal title and button text
        const modalTitle = document.querySelector('.modal-title');
        const saveBtn = document.querySelector('.modal-footer button[type="submit"]');
        if (modalTitle) modalTitle.textContent = 'Edit OAuth App';
        if (saveBtn) saveBtn.textContent = 'Save Changes';
        
        // Fill form
        document.getElementById('platform').value = app.platform;
        document.getElementById('clientId').value = app.clientId;
        document.getElementById('clientSecret').value = app.clientSecret;
        
        updatePlatformInfo();
        document.getElementById('app-modal').classList.add('active');
        initializeScopeSelector();
      }
      
      // Update platform info
      function updatePlatformInfo() {
        const platformKey = document.getElementById('platform').value;
        const statusSection = document.getElementById('status-section');
        
        if (platformKey) {
          // Show status section for feedback during add process
          statusSection.style.display = 'block';
        } else {
          // Hide status section when no platform selected
          statusSection.style.display = 'none';
        }
        
        // Check if form is ready
        checkFormReady();
      }
      
      // Check if form is ready to submit
      function checkFormReady() {
        const platform = document.getElementById('platform').value;
        const clientId = document.getElementById('clientId').value;
        const clientSecret = document.getElementById('clientSecret').value;
        const addBtn = document.getElementById('add-app-btn');
        
        // Enable button when all required fields are filled
        const isReady = platform && clientId && clientSecret;
        addBtn.disabled = !isReady;
        
        if (isReady) {
          addBtn.innerHTML = '${MODERN_ICONS.plus} <span>Add App</span>';
        } else {
          addBtn.innerHTML = '${MODERN_ICONS.plus} <span>Add App</span>';
        }
      }
      
      // Alias for backward compatibility
      const checkCredentialsEntered = checkFormReady;
      
      
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
        const requiredScopes = platform.requiredScopes || [];
        
        // Clear existing selected scopes (required scopes are handled in backend)
        selectedScopes.clear();
        
        // Filter out required scopes from the UI
        const filteredScopes = {};
        Object.entries(scopes).forEach(([category, categoryScopes]) => {
          const nonRequiredScopes = {};
          Object.entries(categoryScopes).forEach(([scopeKey, scopeInfo]) => {
            if (!requiredScopes.includes(scopeKey) && !scopeInfo.required) {
              nonRequiredScopes[scopeKey] = scopeInfo;
            }
          });
          if (Object.keys(nonRequiredScopes).length > 0) {
            filteredScopes[category] = nonRequiredScopes;
          }
        });
        
        if (Object.keys(filteredScopes).length === 0) {
          container.innerHTML = \`
            <div class="scope-info-message">
              <p class="text-muted text-small">This platform only requires basic authentication scopes, which are automatically included.</p>
            </div>
          \`;
          return;
        }
        
        container.innerHTML = \`
          <div class="scope-header">
            <input 
              type="text" 
              class="scope-search" 
              placeholder="Search optional scopes..." 
              onkeyup="filterScopes(this.value)"
            >
            <div class="scope-summary">
              <span id="selected-count">0</span> optional scopes selected
            </div>
          </div>
          <div class="scope-list" id="scope-list">
            \${Object.entries(filteredScopes).map(([category, categoryScopes]) => \`
              <div class="scope-group" data-category="\${category}">
                <div class="scope-group-header">
                  <h4 class="scope-group-title">\${category}</h4>
                  <span class="scope-group-count">\${Object.keys(categoryScopes).length} scopes</span>
                </div>
                <div class="scope-items">
                  \${Object.entries(categoryScopes).map(([scopeKey, scopeInfo]) => {
                    return \`
                      <label class="scope-item" 
                             data-scope="\${scopeKey}" 
                             data-name="\${scopeInfo.name.toLowerCase()}" 
                             data-description="\${scopeInfo.description.toLowerCase()}"
                             data-category="\${category.toLowerCase()}">
                        <div class="scope-checkbox-wrapper">
                          <input 
                            type="checkbox" 
                            class="scope-checkbox" 
                            value="\${scopeKey}"
                            onchange="toggleScope('\${scopeKey}', this)"
                          >
                          <div class="checkbox-custom"></div>
                        </div>
                        <div class="scope-content">
                          <div class="scope-name">\${scopeInfo.name}</div>
                          <div class="scope-description">\${scopeInfo.description}</div>
                          <div class="scope-key">\${scopeKey}</div>
                        </div>
                      </label>
                    \`;
                  }).join('')}
                </div>
              </div>
            \`).join('')}
          </div>
        \`;
        
        updateScopeCount();
      }
      
      // Filter scopes based on search
      function filterScopes(searchTerm) {
        const scopeItems = document.querySelectorAll('.scope-item');
        const scopeGroups = document.querySelectorAll('.scope-group');
        
        if (!searchTerm) {
          scopeItems.forEach(item => item.style.display = 'flex');
          scopeGroups.forEach(group => group.style.display = 'block');
          return;
        }
        
        const term = searchTerm.toLowerCase();
        
        scopeGroups.forEach(group => {
          const items = group.querySelectorAll('.scope-item');
          let hasVisibleItems = false;
          
          items.forEach(item => {
            const name = item.dataset.name;
            const description = item.dataset.description;
            const scope = item.dataset.scope;
            
            if (name.includes(term) || description.includes(term) || scope.includes(term)) {
              item.style.display = 'flex';
              hasVisibleItems = true;
            } else {
              item.style.display = 'none';
            }
          });
          
          group.style.display = hasVisibleItems ? 'block' : 'none';
        });
      }
      
      // Toggle scope
      function toggleScope(scope, checkbox) {
        if (checkbox.checked) {
          selectedScopes.add(scope);
        } else {
          selectedScopes.delete(scope);
        }
        updateScopeCount();
      }
      
      // Update scope count
      function updateScopeCount() {
        const countElement = document.getElementById('selected-count');
        if (countElement) {
          countElement.textContent = selectedScopes.size;
        }
      }
      
      // Handle add app - auto-detects scopes and adds in one step
      async function handleSaveApp(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const email = localStorage.getItem('userEmail');
        const platformKey = formData.get('platform');
        const clientId = formData.get('clientId');
        const clientSecret = formData.get('clientSecret');
        
        if (!platformKey || !clientId || !clientSecret) {
          alert('Please fill in all required fields');
          return;
        }
        
        const addBtn = document.getElementById('add-app-btn');
        const statusDisplay = document.getElementById('connection-status');
        
        // Show loading state
        addBtn.disabled = true;
        addBtn.innerHTML = '${MODERN_ICONS.loading} <span>Adding App...</span>';
        statusDisplay.innerHTML = '<p class="text-muted">🔄 Testing credentials and auto-detecting scopes...</p>';
        
        try {
          // Auto-detect and save in one API call
          const appData = {
            platform: platformKey,
            clientId: clientId,
            clientSecret: clientSecret,
            autoDetect: true, // This triggers scope auto-detection in the backend
            userEmail: email
          };
            
          const response = await fetch('/save-app', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData)
          });
          
          const result = await response.json();
          
          if (result.success) {
            // Show success with detected scopes
            statusDisplay.innerHTML = \`
              <div class="alert alert-success">
                <span style="width: 20px; height: 20px;">${MODERN_ICONS.check}</span>
                <span><strong>App added successfully!</strong> Auto-detected \${result.detectedScopes?.length || 0} scopes</span>
              </div>
              
              \${result.detectedScopes?.length > 0 ? \`
                <div class="scope-summary mt-3">
                  <h4 class="font-semibold mb-2">📱 \${result.app.name}</h4>
                  <div class="scope-list">
                    <strong>Auto-detected Scopes (\${result.detectedScopes.length}):</strong>
                    <div class="scope-tags mt-2">
                      \${result.detectedScopes.map(scope => \`<span class="scope-tag">\${scope}</span>\`).join('')}
                    </div>
                  </div>
                </div>
              \` : ''}
            \`;
            
            // Close modal after brief delay to show success
            setTimeout(() => {
              hideAppModal();
              loadApps();
            }, 2000);
            
          } else {
            statusDisplay.innerHTML = \`
              <div class="alert alert-error">
                <span style="width: 20px; height: 20px;">${MODERN_ICONS.warning}</span>
                <span><strong>Failed to add app:</strong> \${result.error}</span>
              </div>
            \`;
          }
          
        } catch (error) {
          console.error('Error adding app:', error);
          statusDisplay.innerHTML = \`
            <div class="alert alert-error">
              <span style="width: 20px; height: 20px;">${MODERN_ICONS.warning}</span>
              <span><strong>Error:</strong> Could not connect to platform. Please check your credentials.</span>
            </div>
          \`;
        } finally {
          // Reset button
          addBtn.disabled = false;
          addBtn.innerHTML = '${MODERN_ICONS.plus} <span>Add App</span>';
        }
      }
      
      // Delete app
      async function deleteApp(platform, name) {
        if (!confirm(\`Are you sure you want to delete "\${name}"?\`)) return;
        
        const email = localStorage.getItem('userEmail');
        
        try {
          const response = await fetch(\`/delete-app/\${platform}?email=\${encodeURIComponent(email)}\`, {
            method: 'DELETE'
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
        
        // Add event listeners for form validation
        const platformSelect = document.getElementById('platform');
        const clientIdInput = document.getElementById('clientId');
        const clientSecretInput = document.getElementById('clientSecret');
        
        if (platformSelect) platformSelect.addEventListener('change', checkFormReady);
        if (clientIdInput) clientIdInput.addEventListener('input', checkFormReady);
        if (clientSecretInput) clientSecretInput.addEventListener('input', checkFormReady);
        
        loadApps();
      });
    </script>
</body>
</html>`;
}
