// =============================================================================
// 👤 MODERN PROFILE PAGE - User profile management
// =============================================================================

import { MODERN_CSS, MODERN_ICONS, THEME_PREVENTION_SCRIPT } from '../styles.js';
import { getModernLayout, getModernScripts } from '../navigation.js';
import { getAuthManagerScript } from '../../lib/auth/auth-manager.js';

export function getModernProfilePage() {
  const content = `
    <!-- Page Header -->
    <div class="mb-6">
      <p class="text-secondary">Manage your personal information and account details</p>
    </div>
    
    <!-- Profile Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="lg:col-span-1">
        <div class="card text-center">
          <div class="profile-avatar-large mx-auto mb-4">
            <span id="profile-initials">U</span>
          </div>
          <h3 class="font-semibold text-xl mb-1" id="profile-name">User</h3>
          <p class="text-secondary mb-4" id="profile-email">user@example.com</p>
          <button class="btn btn-secondary btn-small w-full" onclick="document.getElementById('avatar-upload').click()">
            Change Avatar
          </button>
          <input type="file" id="avatar-upload" accept="image/*" style="display: none;" onchange="handleAvatarUpload(event)">
          
          <div class="mt-6 pt-6 border-t border-light">
            <div class="text-left space-y-3">
              <div>
                <p class="text-small text-muted">Member Since</p>
                <p class="font-medium" id="member-since">-</p>
              </div>
              <div>
                <p class="text-small text-muted">Account Type</p>
                <p class="font-medium">Free Plan</p>
              </div>
              <div>
                <p class="text-small text-muted">API Usage</p>
                <p class="font-medium">1,234 requests</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Profile Form -->
      <div class="lg:col-span-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Personal Information</h3>
          </div>
          
          <form id="profile-form" onsubmit="handleUpdateProfile(event)">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="form-group">
                <label class="form-label" for="firstName">First Name</label>
                <input type="text" class="form-input" id="firstName" name="firstName" required>
              </div>
              
              <div class="form-group">
                <label class="form-label" for="lastName">Last Name</label>
                <input type="text" class="form-input" id="lastName" name="lastName" required>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="email">Email Address</label>
              <input type="email" class="form-input" id="email" name="email" required disabled>
              <p class="text-small text-muted mt-1">Email cannot be changed</p>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="company">Company</label>
              <input type="text" class="form-input" id="company" name="company" placeholder="Your company name">
            </div>
            
            <div class="form-group">
              <label class="form-label" for="website">Website</label>
              <input type="url" class="form-input" id="website" name="website" placeholder="https://example.com">
            </div>
            
            <div class="form-group">
              <label class="form-label" for="bio">Bio</label>
              <textarea class="form-input" id="bio" name="bio" rows="3" placeholder="Tell us about yourself..."></textarea>
            </div>
            
            <div class="flex justify-end gap-3 pt-4">
              <button type="button" class="btn btn-secondary" onclick="resetForm()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
        
        <!-- Connected Accounts -->
        <div class="card mt-6">
          <div class="card-header">
            <h3 class="card-title">Connected Accounts</h3>
          </div>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex items-center gap-3">
                <div style="width: 40px; height: 40px; background: #4285F420; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                  ${MODERN_ICONS.google}
                </div>
                <div>
                  <p class="font-medium">Google</p>
                  <p class="text-small text-muted">Sign in with Google</p>
                </div>
              </div>
              <button class="btn btn-secondary btn-small" onclick="connectGoogle()">
                Connect
              </button>
            </div>
            
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex items-center gap-3">
                <div style="width: 40px; height: 40px; background: #18171720; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium">GitHub</p>
                  <p class="text-small text-muted">Sign in with GitHub</p>
                </div>
              </div>
              <button class="btn btn-secondary btn-small" onclick="connectGitHub()">
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - OAuth Hub</title>
    
    ${THEME_PREVENTION_SCRIPT}
    
    <style>
      ${MODERN_CSS}
      
      /* Profile Specific Styles */
      .profile-avatar-large {
        width: 120px;
        height: 120px;
        border-radius: var(--radius-full);
        background: var(--brand-accent);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: 600;
        position: relative;
        overflow: hidden;
      }
      
      .profile-avatar-large img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .grid-cols-1 {
        grid-template-columns: 1fr;
      }
      
      @media (min-width: 1024px) {
        .lg\\:grid-cols-3 {
          grid-template-columns: repeat(3, 1fr);
        }
        
        .lg\\:col-span-1 {
          grid-column: span 1;
        }
        
        .lg\\:col-span-2 {
          grid-column: span 2;
        }
      }
      
      .border-t {
        border-top: 1px solid var(--border-light);
      }
      
      .pt-6 {
        padding-top: var(--space-6);
      }
      
      .space-y-3 > * + * {
        margin-top: var(--space-3);
      }
      
      .w-full {
        width: 100%;
      }
      
      .mx-auto {
        margin-left: auto;
        margin-right: auto;
      }
    </style>
</head>
<body>
    ${getModernLayout('profile', 'Profile', content)}
    
    ${getAuthManagerScript()}
    ${getModernScripts()}
    
    <script>
      let userData = {
        email: '',
        firstName: '',
        lastName: '',
        company: '',
        website: '',
        bio: '',
        createdAt: ''
      };
      
      // Load user data
      async function loadUserData() {
        const email = localStorage.getItem('userEmail');
        const name = localStorage.getItem('userName') || '';
        
        if (email) {
          userData.email = email;
          
          // Parse name
          const nameParts = name.split(' ');
          userData.firstName = nameParts[0] || '';
          userData.lastName = nameParts.slice(1).join(' ') || '';
          
          // TODO: Load additional user data from API
          userData.createdAt = localStorage.getItem('userCreatedAt') || new Date().toISOString();
          
          updateUI();
        }
      }
      
      // Update UI with user data
      function updateUI() {
        // Update profile card
        document.getElementById('profile-email').textContent = userData.email;
        document.getElementById('profile-name').textContent = `${userData.firstName} ${userData.lastName}`.trim() || 'User';
        
        const initials = `${userData.firstName[0] || ''}${userData.lastName[0] || ''}`.toUpperCase() || 'U';
        
        // Handle profile picture from OAuth data
        let profilePicture = null;
        if (userData.googleProfile?.picture) {
          profilePicture = userData.googleProfile.picture;
        } else if (userData.githubProfile?.avatar_url) {
          profilePicture = userData.githubProfile.avatar_url;
        }
        
        if (profilePicture) {
          document.getElementById('profile-initials').innerHTML = `<img src="${profilePicture}" alt="Profile" style="width: 100%; height: 100%; border-radius: inherit; object-fit: cover;">`;
        } else {
          document.getElementById('profile-initials').textContent = initials;
        }
        
        // Update navigation with profile picture
        document.querySelectorAll('.profile-email').forEach(el => el.textContent = userData.email);
        document.querySelectorAll('.profile-name').forEach(el => el.textContent = `${userData.firstName} ${userData.lastName}`.trim());
        
        if (profilePicture) {
          document.querySelectorAll('.profile-avatar').forEach(el => {
            el.innerHTML = `<img src="${profilePicture}" alt="Profile" style="width: 100%; height: 100%; border-radius: inherit; object-fit: cover;">`;
          });
        } else {
          document.querySelectorAll('.profile-avatar').forEach(el => el.textContent = initials);
        }
        
        // Update form
        document.getElementById('firstName').value = userData.firstName;
        document.getElementById('lastName').value = userData.lastName;
        document.getElementById('email').value = userData.email;
        document.getElementById('company').value = userData.company || '';
        document.getElementById('website').value = userData.website || '';
        document.getElementById('bio').value = userData.bio || '';
        
        // Update member since
        const memberSince = new Date(userData.createdAt).toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        });
        document.getElementById('member-since').textContent = memberSince;
      }
      
      // Handle profile update
      async function handleUpdateProfile(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        
        userData.firstName = formData.get('firstName');
        userData.lastName = formData.get('lastName');
        userData.company = formData.get('company');
        userData.website = formData.get('website');
        userData.bio = formData.get('bio');
        
        // Update localStorage
        localStorage.setItem('userName', `${userData.firstName} ${userData.lastName}`.trim());
        
        // TODO: Save to API
        
        updateUI();
        showNotification('Profile updated successfully');
      }
      
      // Reset form
      function resetForm() {
        updateUI();
      }
      
      // Handle avatar upload
      function handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (file) {
          // TODO: Upload avatar to server
          showNotification('Avatar upload coming soon');
        }
      }
      
      // Connect social accounts
      function connectGoogle() {
        // TODO: Implement Google OAuth connection
        showNotification('Google connection coming soon');
      }
      
      function connectGitHub() {
        // TODO: Implement GitHub OAuth connection
        showNotification('GitHub connection coming soon');
      }
      
      // Show notification
      function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-primary text-white px-4 py-3 rounded-lg shadow-lg z-tooltip';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.remove();
        }, 3000);
      }
      
      // Initialize
      document.addEventListener('DOMContentLoaded', () => {
        loadUserData();
      });
    </script>
</body>
</html>`;
}
