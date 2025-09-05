// =============================================================================
// 🔐 SHARED AUTH CHECK - Ensures user is logged in
// =============================================================================

export function getAuthCheckScript() {
  return `
    <script>
      // Check authentication on page load
      (async function checkAuth() {
        try {
          const response = await fetch('/check-session');
          const data = await response.json();
          
          if (!data.authenticated) {
            // Not logged in, redirect to login
            window.location.href = '/auth';
            return;
          }
          
          // Store user info for display
          if (data.user) {
            localStorage.setItem('userEmail', data.user.email);
            localStorage.setItem('userName', data.user.name);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          window.location.href = '/auth';
        }
      })();
      
      // Logout function
      async function logout() {
        try {
          await fetch('/logout', { method: 'POST' });
          localStorage.clear();
          window.location.href = '/auth';
        } catch (error) {
          console.error('Logout failed:', error);
        }
      }
    </script>
  `;
}
