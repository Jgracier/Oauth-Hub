// Stub for auth manager - simplified for Keycloak integration
export function getAuthManagerScript() {
  return `
    <script>
      // Simplified auth manager for Keycloak
      window.AuthManager = {
        login: async (email, password) => {
          // Redirect to Keycloak login
          window.location.href = '/auth';
        },
        signup: async (email, password, name) => {
          // Redirect to Keycloak signup
          window.location.href = '/auth';
        },
        logout: () => {
          window.location.href = '/logout';
        },
        getCurrentUser: () => {
          // Would normally get from Keycloak token
          return { email: 'user@example.com', name: 'User' };
        }
      };
    </script>
  `;
}
