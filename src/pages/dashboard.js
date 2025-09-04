// =============================================================================
// 📊 DASHBOARD PAGE - Main user dashboard
// =============================================================================

import { getNavigation, getSharedScript } from '../shared/navigation.js';

export function getDashboardPage(UNIFIED_CSS, userData = {}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - OAuth Hub</title>
    <style>${UNIFIED_CSS}</style>
</head>
<body>
    <div class="app-layout">
        ${getNavigation('dashboard', userData)}
        
        <main class="main">
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">Dashboard</h1>
                    <p class="page-description">Welcome to your OAuth management center</p>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-6); margin-bottom: var(--space-8);">
                    <div class="card">
                        <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
                            <div style="font-size: 2rem;">🔑</div>
                            <div>
                                <h3 style="margin: 0;">API Keys</h3>
                                <p style="color: var(--gray-600); margin: 0; font-size: 0.875rem;">Manage your API keys</p>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span id="api-keys-count" style="font-size: 2rem; font-weight: 700; color: var(--primary-600);">-</span>
                            <a href="/api-keys" class="btn btn-primary">Manage</a>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
                            <div style="font-size: 2rem;">📱</div>
                            <div>
                                <h3 style="margin: 0;">OAuth Apps</h3>
                                <p style="color: var(--gray-600); margin: 0; font-size: 0.875rem;">Connected applications</p>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span id="apps-count" style="font-size: 2rem; font-weight: 700; color: var(--primary-600);">-</span>
                            <a href="/apps" class="btn btn-primary">Manage</a>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
                            <div style="font-size: 2rem;">🌐</div>
                            <div>
                                <h3 style="margin: 0;">Active Tokens</h3>
                                <p style="color: var(--gray-600); margin: 0; font-size: 0.875rem;">OAuth connections</p>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span id="tokens-count" style="font-size: 2rem; font-weight: 700; color: var(--primary-600);">-</span>
                            <a href="/analytics" class="btn btn-primary">View</a>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <h2 style="margin: 0 0 var(--space-4) 0;">Quick Actions</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4);">
                        <a href="/apps" class="btn btn-secondary" style="text-decoration: none; text-align: center;">
                            🔗 Add OAuth App
                        </a>
                        <a href="/api-keys" class="btn btn-secondary" style="text-decoration: none; text-align: center;">
                            🔑 Generate API Key
                        </a>
                        <a href="/docs" class="btn btn-secondary" style="text-decoration: none; text-align: center;">
                            📚 View Documentation
                        </a>
                        <a href="/analytics" class="btn btn-secondary" style="text-decoration: none; text-align: center;">
                            📊 View Analytics
                        </a>
                    </div>
                </div>
                
                <div class="card">
                    <h2 style="margin: 0 0 var(--space-4) 0;">Recent Activity</h2>
                    <div id="recent-activity">
                        <p style="color: var(--gray-500); text-align: center; padding: var(--space-4);">
                            No recent activity
                        </p>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    ${getSharedScript()}
    <script>
        
        // Load dashboard data
        async function loadDashboardData() {
            try {
                // Load API keys count
                const keysResponse = await window.apiCall('/user-keys');
                if (keysResponse && keysResponse.ok) {
                    const keysData = await keysResponse.json();
                    document.getElementById('api-keys-count').textContent = keysData.keys ? keysData.keys.length : 0;
                }
                
                // Load apps count  
                const appsResponse = await window.apiCall('/user-apps');
                if (appsResponse && appsResponse.ok) {
                    const appsData = await appsResponse.json();
                    document.getElementById('apps-count').textContent = appsData.apps ? appsData.apps.length : 0;
                }
                
                // Load tokens count (placeholder for now)
                document.getElementById('tokens-count').textContent = '0';
                
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        }
        
        
        // Load data on page load
        loadDashboardData();
    </script>
</body>
</html>`;
}