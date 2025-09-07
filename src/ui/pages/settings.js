// =============================================================================
// ⚙️ MODERN SETTINGS PAGE - User preferences and configuration
// =============================================================================

import { MODERN_CSS, MODERN_ICONS } from '../styles.js';
import { getModernLayout, getModernScripts } from '../navigation.js';
import { getClientAuthScript } from '../../lib/auth/client-auth.js';

export function getModernSettingsPage() {
  const content = `
    <!-- Page Header -->
    <div class="mb-6">
      <p class="text-secondary">Manage your account settings and preferences</p>
    </div>
    
    <!-- Settings Sections -->
    <div class="space-y-6">
      <!-- Appearance Settings -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Appearance</h3>
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-semibold">Theme</h4>
              <p class="text-secondary text-small">Choose your preferred color theme</p>
            </div>
            <div class="flex gap-2">
              <button class="btn btn-secondary btn-small" onclick="setTheme('light')">
                ${MODERN_ICONS.sun}
                Light
              </button>
              <button class="btn btn-secondary btn-small" onclick="setTheme('dark')">
                ${MODERN_ICONS.moon}
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Security Settings -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Security</h3>
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-semibold">Password</h4>
              <p class="text-secondary text-small">Change your account password</p>
            </div>
            <button class="btn btn-secondary btn-small" onclick="showChangePasswordModal()">
              Change Password
            </button>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-semibold">Two-Factor Authentication</h4>
              <p class="text-secondary text-small">Add an extra layer of security to your account</p>
            </div>
            <button class="btn btn-secondary btn-small" disabled>
              Coming Soon
            </button>
          </div>
        </div>
      </div>
      
      <!-- Email Preferences -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Email Preferences</h3>
        </div>
        <div class="space-y-4">
          <label class="flex items-center justify-between cursor-pointer">
            <div>
              <h4 class="font-semibold">Security Alerts</h4>
              <p class="text-secondary text-small">Get notified about important security events</p>
            </div>
            <input type="checkbox" class="form-checkbox" checked>
          </label>
          
          <label class="flex items-center justify-between cursor-pointer">
            <div>
              <h4 class="font-semibold">Product Updates</h4>
              <p class="text-secondary text-small">Stay informed about new features and improvements</p>
            </div>
            <input type="checkbox" class="form-checkbox">
          </label>
          
          <label class="flex items-center justify-between cursor-pointer">
            <div>
              <h4 class="font-semibold">Usage Reports</h4>
              <p class="text-secondary text-small">Receive weekly summaries of your OAuth usage</p>
            </div>
            <input type="checkbox" class="form-checkbox">
          </label>
        </div>
      </div>
      
      <!-- API Settings -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">API Configuration</h3>
        </div>
        <div class="space-y-4">
          <div>
            <h4 class="font-semibold mb-2">Rate Limits</h4>
            <p class="text-secondary text-small">Current API usage and limits</p>
            <div class="mt-3 p-4 bg-secondary rounded-lg">
              <div class="flex justify-between mb-2">
                <span class="text-small">Requests Today</span>
                <span class="text-small font-semibold">1,234 / 10,000</span>
              </div>
              <div class="w-full bg-tertiary rounded-full h-2">
                <div class="bg-accent h-2 rounded-full" style="width: 12.34%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Danger Zone -->
      <div class="card border-danger">
        <div class="card-header">
          <h3 class="card-title text-danger">Danger Zone</h3>
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-semibold">Delete Account</h4>
              <p class="text-secondary text-small">Permanently delete your account and all associated data</p>
            </div>
            <button class="btn btn-danger btn-small" onclick="showDeleteAccountModal()">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Change Password Modal -->
    <div class="modal-backdrop" id="change-password-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Change Password</h2>
          <button class="modal-close" onclick="hideChangePasswordModal()">
            ${MODERN_ICONS.close}
          </button>
        </div>
        <form onsubmit="handleChangePassword(event)">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label" for="current-password">Current Password</label>
              <input type="password" class="form-input" id="current-password" required>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="new-password">New Password</label>
              <input type="password" class="form-input" id="new-password" required minlength="8">
              <p class="text-small text-muted mt-1">At least 8 characters</p>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="confirm-password">Confirm New Password</label>
              <input type="password" class="form-input" id="confirm-password" required>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="hideChangePasswordModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Change Password</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Delete Account Modal -->
    <div class="modal-backdrop" id="delete-account-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title text-danger">Delete Account</h2>
          <button class="modal-close" onclick="hideDeleteAccountModal()">
            ${MODERN_ICONS.close}
          </button>
        </div>
        <div class="modal-body">
          <div class="alert alert-danger mb-4">
            <span style="width: 20px; height: 20px;">${MODERN_ICONS.warning}</span>
            <span>This action cannot be undone. All your data will be permanently deleted.</span>
          </div>
          
          <p class="mb-4">Please type <strong>DELETE</strong> to confirm:</p>
          <input type="text" class="form-input" id="delete-confirmation" placeholder="Type DELETE">
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="hideDeleteAccountModal()">Cancel</button>
          <button class="btn btn-danger" onclick="deleteAccount()">Delete My Account</button>
        </div>
      </div>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings - OAuth Hub</title>
    <style>
      ${MODERN_CSS}
      
      /* Settings Specific Styles */
      .form-checkbox {
        width: 44px;
        height: 24px;
        appearance: none;
        background: var(--bg-tertiary);
        border: 1px solid var(--border-medium);
        border-radius: 12px;
        position: relative;
        cursor: pointer;
        transition: all var(--transition-fast);
      }
      
      .form-checkbox:checked {
        background: var(--brand-accent);
        border-color: var(--brand-accent);
      }
      
      .form-checkbox::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 18px;
        height: 18px;
        background: white;
        border-radius: 50%;
        transition: all var(--transition-fast);
      }
      
      .form-checkbox:checked::after {
        left: 22px;
      }
      
      .border-danger {
        border-color: rgba(255, 59, 48, 0.3) !important;
      }
      
      .text-danger {
        color: var(--brand-danger) !important;
      }
      
      .alert-danger {
        background: rgba(255, 59, 48, 0.1);
        border: 1px solid rgba(255, 59, 48, 0.2);
        color: var(--text-primary);
        padding: var(--space-3);
        border-radius: var(--radius-md);
        display: flex;
        align-items: flex-start;
        gap: var(--space-3);
      }
      
      .bg-secondary {
        background: var(--bg-secondary);
      }
      
      .bg-tertiary {
        background: var(--bg-tertiary);
      }
      
      .bg-accent {
        background: var(--brand-accent);
      }
    </style>
</head>
<body>
    ${getModernLayout('settings', 'Settings', content)}
    
    ${getClientAuthScript()}
    ${getModernScripts()}
    
    <script>
      // Set theme
      function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update all theme icons
        const moonIcon = '${MODERN_ICONS.moon}';
        const sunIcon = '${MODERN_ICONS.sun}';
        const icon = theme === 'dark' ? sunIcon : moonIcon;
        
        document.querySelectorAll('#theme-icon, #header-theme-icon').forEach(el => {
          if (el) el.innerHTML = icon;
        });
        
        // Show feedback
        showNotification(\`Theme changed to \${theme} mode\`);
      }
      
      // Show notification
      function showNotification(message) {
        // Simple notification implementation
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-primary text-white px-4 py-3 rounded-lg shadow-lg z-tooltip';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.remove();
        }, 3000);
      }
      
      // Change password modal
      function showChangePasswordModal() {
        document.getElementById('change-password-modal').classList.add('active');
      }
      
      function hideChangePasswordModal() {
        document.getElementById('change-password-modal').classList.remove('active');
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
      }
      
      async function handleChangePassword(event) {
        event.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (newPassword !== confirmPassword) {
          alert('New passwords do not match');
          return;
        }
        
        // TODO: Implement password change API
        showNotification('Password changed successfully');
        hideChangePasswordModal();
      }
      
      // Delete account modal
      function showDeleteAccountModal() {
        document.getElementById('delete-account-modal').classList.add('active');
      }
      
      function hideDeleteAccountModal() {
        document.getElementById('delete-account-modal').classList.remove('active');
        document.getElementById('delete-confirmation').value = '';
      }
      
      async function deleteAccount() {
        const confirmation = document.getElementById('delete-confirmation').value;
        
        if (confirmation !== 'DELETE') {
          alert('Please type DELETE to confirm');
          return;
        }
        
        if (!confirm('Are you absolutely sure? This action cannot be undone.')) {
          return;
        }
        
        // TODO: Implement account deletion API
        alert('Account deletion is not implemented in demo mode');
        hideDeleteAccountModal();
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
        
        // Highlight current theme button
        const currentTheme = localStorage.getItem('theme') || 'light';
        // You could add active state to theme buttons here
      });
    </script>
</body>
</html>`;
}
