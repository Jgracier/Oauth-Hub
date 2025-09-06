// =============================================================================
// 🔐 CLIENT-SIDE AUTHENTICATION - Clean auth checks for UI pages
// =============================================================================

/**
 * Client-side authentication check for protected pages
 * Uses server session validation instead of localStorage
 */
export function getClientAuthScript() {
  return `
    <script>
      (async function() {
        // Check server session instead of localStorage
        try {
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
              
              // Display user info
              const userEmailElement = document.getElementById('user-email');
              if (userEmailElement) {
                userEmailElement.textContent = sessionData.user.email;
              }
              return; // Stay on current page
            }
          }
          
          // Not authenticated - redirect to auth page if not already there
          if (window.location.pathname !== '/auth' && 
              window.location.pathname !== '/') {
            window.location.href = '/auth';
            return;
          }
          
        } catch (error) {
          console.error('Session check failed:', error);
          // On error, redirect to auth page if not already there
          if (window.location.pathname !== '/auth' && 
              window.location.pathname !== '/') {
            window.location.href = '/auth';
          }
        }
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
