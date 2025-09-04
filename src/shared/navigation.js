// =============================================================================
// 🧭 NAVIGATION COMPONENT - Shared navigation across all pages
// =============================================================================

export function getNavigation(activePage = '', userData = {}) {
  return `
    <header class="header">
        <div class="header-content">
            <a href="/dashboard" class="logo">
                <span style="font-size: 1.5rem;">🔐</span>
                OAuth Hub
            </a>
            
            <nav class="nav">
                <a href="/dashboard" class="nav-link ${activePage === 'dashboard' ? 'active' : ''}">Dashboard</a>
                <a href="/apps" class="nav-link ${activePage === 'apps' ? 'active' : ''}">App Credentials</a>
                <a href="/api-keys" class="nav-link ${activePage === 'api-keys' ? 'active' : ''}">API Keys</a>
                <a href="/docs" class="nav-link ${activePage === 'docs' ? 'active' : ''}">Documentation</a>
                <a href="/analytics" class="nav-link ${activePage === 'analytics' ? 'active' : ''}">Analytics</a>
            </nav>
            
            <div style="display: flex; align-items: center; gap: var(--space-4);">
                <span id="user-email" style="color: var(--gray-600);">${userData.email || ''}</span>
                <button onclick="logout()" class="btn btn-secondary">Logout</button>
            </div>
        </div>
    </header>
  `;
}

export function getSharedScript() {
  return `
    <script>
        // Session authentication is now handled server-side
        // No need to check localStorage
        
        // Global logout function
        async function logout() {
            try {
                await fetch('/auth/logout', { 
                    method: 'POST',
                    credentials: 'include' 
                });
            } catch (error) {
                console.error('Logout error:', error);
            }
            window.location.href = '/auth';
        }
        
        // Make logout function globally accessible
        window.logout = logout;
        
        // Helper function to make authenticated API calls
        async function apiCall(url, options = {}) {
            const response = await fetch(url, {
                ...options,
                credentials: 'include', // Always include cookies
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            
            if (response.status === 401) {
                // Session expired or invalid
                window.location.href = '/auth';
                return null;
            }
            
            return response;
        }
        
        // Make apiCall globally accessible
        window.apiCall = apiCall;
    </script>
  `;
}