/**
 * 🔐 UNIFIED AUTHENTICATION MANAGER
 * Best practice authentication flow with single source of truth
 * Eliminates race conditions and redundant checks
 */

export function getAuthManagerScript() {
  return `
    <script>
      // SINGLE AUTHENTICATION MANAGER - Best practice implementation
      window.AuthManager = {
        // State
        isChecking: false,
        isAuthenticated: false,
        user: null,
        
        // Check authentication status (called once per page)
        async checkAuth() {
          // Prevent multiple simultaneous checks
          if (this.isChecking) return this.isAuthenticated;
          this.isChecking = true;
          
          try {
            const response = await fetch('/check-session', {
              method: 'GET',
              credentials: 'include'
            });
            
            if (response.ok) {
              const sessionData = await response.json();
              
              if (sessionData.authenticated) {
                this.isAuthenticated = true;
                this.user = sessionData.user;
                
                // Update cached data
                localStorage.setItem('userEmail', sessionData.user.email);
                localStorage.setItem('userName', sessionData.user.name);
                
                // Update global state
                if (window.OAUTH_HUB_STATE) {
                  window.OAUTH_HUB_STATE.userEmail = sessionData.user.email;
                  window.OAUTH_HUB_STATE.userName = sessionData.user.name;
                }
                
                // Update profile elements immediately if they exist
                const profileNameElements = document.querySelectorAll('.profile-name');
                const profileEmailElements = document.querySelectorAll('.profile-email');
                
                profileNameElements.forEach(el => el.textContent = sessionData.user.name);
                profileEmailElements.forEach(el => el.textContent = sessionData.user.email);
                
                // Update profile picture if available
                if (sessionData.user.googleProfile?.picture) {
                  const profilePic = sessionData.user.googleProfile.picture;
                  sessionStorage.setItem('profilePicture', profilePic);
                  const avatarElements = document.querySelectorAll('.profile-avatar, #profile-avatar');
                  avatarElements.forEach(el => {
                    el.innerHTML = \`<img src="\${profilePic}" alt="Profile" style="width: 100%; height: 100%; border-radius: inherit; object-fit: cover;">\`;
                  });
                } else if (sessionData.user.githubProfile?.avatar_url) {
                  const profilePic = sessionData.user.githubProfile.avatar_url;
                  sessionStorage.setItem('profilePicture', profilePic);
                  const avatarElements = document.querySelectorAll('.profile-avatar, #profile-avatar');
                  avatarElements.forEach(el => {
                    el.innerHTML = \`<img src="\${profilePic}" alt="Profile" style="width: 100%; height: 100%; border-radius: inherit; object-fit: cover;">\`;
                  });
                } else {
                  // Generate and cache initials
                  const initials = sessionData.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                  sessionStorage.setItem('userInitials', initials);
                  const avatarElements = document.querySelectorAll('.profile-avatar, #profile-avatar');
                  avatarElements.forEach(el => {
                    el.textContent = initials;
                  });
                }
                
                this.isChecking = false;
                return true;
              }
            }
            
            // Not authenticated
            this.isAuthenticated = false;
            this.user = null;
            this.clearAuthData();
            this.isChecking = false;
            return false;
            
          } catch (error) {
            console.error('Auth check failed:', error);
            this.isAuthenticated = false;
            this.user = null;
            this.clearAuthData();
            this.isChecking = false;
            return false;
          }
        },
        
        // Clear all authentication data
        clearAuthData() {
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
          sessionStorage.removeItem('profilePicture');
          sessionStorage.removeItem('userInitials');
          sessionStorage.removeItem('profileDataLoaded');
          sessionStorage.removeItem('profileDataTimestamp');
          
          if (window.OAUTH_HUB_STATE) {
            window.OAUTH_HUB_STATE.userEmail = null;
            window.OAUTH_HUB_STATE.userName = null;
            window.OAUTH_HUB_STATE.profilePicture = null;
            window.OAUTH_HUB_STATE.initialized = false;
          }
        },
        
        // Redirect to appropriate page based on auth status
        async redirectIfNeeded() {
          const currentPath = window.location.pathname;
          const isAuthPage = currentPath === '/auth' || currentPath === '/';
          const isAuthenticated = await this.checkAuth();
          
          if (isAuthenticated && isAuthPage) {
            // Authenticated user on auth page -> redirect to dashboard
            window.location.href = '/dashboard';
          } else if (!isAuthenticated && !isAuthPage) {
            // Unauthenticated user on protected page -> redirect to auth
            window.location.href = '/auth';
          }
          // Otherwise stay on current page
        },
        
        // Initialize authentication for current page
        async init() {
          const currentPath = window.location.pathname;
          const isAuthPage = currentPath === '/auth' || currentPath === '/';
          
          if (isAuthPage) {
            // On auth page - check if already authenticated
            await this.redirectIfNeeded();
          } else {
            // On protected page - ensure authenticated
            const isAuthenticated = await this.checkAuth();
            if (!isAuthenticated) {
              window.location.href = '/auth';
            }
          }
        },
        
        // Logout function
        async logout() {
          try {
            await fetch('/logout', { 
              method: 'POST',
              credentials: 'include'
            });
          } catch (error) {
            console.error('Logout request failed:', error);
          } finally {
            this.clearAuthData();
            this.isAuthenticated = false;
            this.user = null;
            window.location.href = '/auth';
          }
        }
      };
      
      // Initialize authentication when DOM is ready
      document.addEventListener('DOMContentLoaded', () => {
        window.AuthManager.init();
      });
    </script>
  `;
}
