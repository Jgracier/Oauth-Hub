// =============================================================================
// 🔐 CLIENT-SIDE AUTHENTICATION - Clean auth checks for UI pages
// =============================================================================

/**
 * Client-side authentication check for protected pages
 * Uses server session validation with global state management
 */
export function getClientAuthScript() {
  return `
    <script>
      (async function() {
        // Prevent multiple auth checks from running simultaneously
        if (window.OAUTH_HUB_AUTH_CHECKING) return;
        window.OAUTH_HUB_AUTH_CHECKING = true;
        
        try {
          // Check server session
          const response = await fetch('/check-session', {
            method: 'GET',
            credentials: 'include'
          });
          
          if (response.ok) {
            const sessionData = await response.json();
            
            if (sessionData.authenticated) {
              // User is authenticated, update localStorage and display info
              localStorage.setItem('userEmail', sessionData.user.email);
              localStorage.setItem('userName', sessionData.user.name);
              
              // Update global state
              if (window.OAUTH_HUB_STATE) {
                window.OAUTH_HUB_STATE.userEmail = sessionData.user.email;
                window.OAUTH_HUB_STATE.userName = sessionData.user.name;
              }
              
              // Display user info
              const userEmailElement = document.getElementById('user-email');
              if (userEmailElement) {
                userEmailElement.textContent = sessionData.user.email;
              }
              
              window.OAUTH_HUB_AUTH_CHECKING = false;
              return; // Stay on current page
            }
          }
          
          // Not authenticated - clear data and redirect if not on auth page
          localStorage.clear();
          sessionStorage.clear();
          
          if (window.location.pathname !== '/auth' && 
              window.location.pathname !== '/') {
            window.location.href = '/auth';
            return;
          }
          
        } catch (error) {
          console.error('Session check failed:', error);
          // On error, clear data and redirect to auth page if not already there
          localStorage.clear();
          sessionStorage.clear();
          
          if (window.location.pathname !== '/auth' && 
              window.location.pathname !== '/') {
            window.location.href = '/auth';
          }
        }
        
        window.OAUTH_HUB_AUTH_CHECKING = false;
      })();
    </script>
  `;
}

/**
 * Global logout function for client-side use
 */
export function getLogoutScript() {
  return `
    <script>
      window.logout = async function() {
        try {
          // Call server logout endpoint
          await fetch('/logout', { 
            method: 'POST',
            credentials: 'include'
          });
        } catch (error) {
          console.error('Logout request failed:', error);
        } finally {
          // Clear local storage regardless of server response
          localStorage.removeItem('apiKey');
          localStorage.removeItem('defaultApiKey');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
          
          // Redirect to auth page
          window.location.href = '/auth';
        }
      };
    </script>
  `;
}
