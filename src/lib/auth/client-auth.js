// =============================================================================
// 🔐 CLIENT-SIDE AUTHENTICATION - Clean auth checks for UI pages
// =============================================================================

/**
 * Client-side authentication check for protected pages
 * Uses localStorage to verify user authentication state
 */
export function getClientAuthScript() {
  return `
    <script>
      (function() {
        // Check if user is authenticated
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        const apiKey = localStorage.getItem('defaultApiKey') || localStorage.getItem('apiKey');
        
        // Redirect to auth if not authenticated and not already on auth page
        if ((!userEmail || !userName || !apiKey) && 
            window.location.pathname !== '/auth' && 
            window.location.pathname !== '/') {
          window.location.href = '/auth';
          return;
        }
        
        // Display user info if available
        const userEmailElement = document.getElementById('user-email');
        if (userEmailElement && userEmail) {
          userEmailElement.textContent = userEmail;
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
