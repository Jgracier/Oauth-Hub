// =============================================================================
// 🧭 NAVIGATION COMPONENT - Shared navigation across all pages
// =============================================================================

export function getNavigation(activePage = '') {
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
                <span id="user-email" style="color: var(--gray-600);"></span>
                <button onclick="logout()" class="btn btn-secondary">Logout</button>
            </div>
        </div>
    </header>
  `;
}

export function getSharedScript() {
  return `
    <script>
        // Check authentication for all pages
        const apiKey = localStorage.getItem('apiKey');
        const userEmail = localStorage.getItem('userEmail');
        
        if (!apiKey && window.location.pathname !== '/auth' && window.location.pathname !== '/') {
            window.location.href = '/auth';
        }
        
        // Display user info if available
        if (userEmail) {
            document.getElementById('user-email').textContent = userEmail;
        }
        
        // Global logout function
        function logout() {
            localStorage.removeItem('apiKey');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            window.location.href = '/auth';
        }
        
        // Make logout function globally accessible
        window.logout = logout;
    </script>
  `;
}