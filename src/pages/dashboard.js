// =============================================================================
// 📊 DASHBOARD PAGE - Main user dashboard
// =============================================================================

import { getNavigation, getSharedScript } from '../shared/navigation.js';
import { getAuthCheckScript } from '../shared/auth-check.js';

export function getDashboardPage(UNIFIED_CSS) {
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
        ${getNavigation('dashboard')}
        
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
                            <span id="apps-count" style="font-size: 2rem; font-weight: 700; color: var(--success-500);">-</span>
                            <a href="/apps" class="btn btn-primary">Manage</a>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
                            <div style="font-size: 2rem;">👥</div>
                            <div>
                                <h3 style="margin: 0;">Active Tokens</h3>
                                <p style="color: var(--gray-600); margin: 0; font-size: 0.875rem;">User authorizations</p>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span id="tokens-count" style="font-size: 2rem; font-weight: 700; color: var(--warning-500);">-</span>
                            <a href="/analytics" class="btn btn-primary">View</a>
                        </div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6);">
                    <div class="card">
                        <h3 style="margin-bottom: var(--space-4);">Quick Start</h3>
                        <ol style="color: var(--gray-600); line-height: 1.6;">
                            <li>Create an API key in the <a href="/api-keys">API Keys</a> section</li>
                            <li>Add your OAuth app credentials in <a href="/apps">App Credentials</a></li>
                            <li>Use the consent endpoints to authorize users</li>
                            <li>Retrieve tokens using the token endpoints</li>
                        </ol>
                        <a href="/docs" class="btn btn-secondary" style="margin-top: var(--space-4);">View Documentation</a>
                    </div>
                    
                    <div class="card">
                        <h3 style="margin-bottom: var(--space-4);">Recent Activity</h3>
                        <div id="recent-activity">
                            <p style="color: var(--gray-500); text-align: center; padding: var(--space-4);">
                                No recent activity
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    ${getAuthCheckScript()}
    ${getSharedScript()}
    <script>
        // Load dashboard data
        async function loadDashboardData() {
            try {
                const email = localStorage.getItem('userEmail');
                if (!email) return;
                
                // Load API keys count
                const keysResponse = await fetch(\`/user-keys?email=\${email}\`);
                if (keysResponse.ok) {
                    const keysData = await keysResponse.json();
                    document.getElementById('api-keys-count').textContent = keysData.keys ? keysData.keys.length : 0;
                }
                
                // Load apps count  
                const appsResponse = await fetch(\`/user-apps?email=\${email}\`);
                if (appsResponse.ok) {
                    const appsData = await appsResponse.json();
                    document.getElementById('apps-count').textContent = appsData.apps ? appsData.apps.length : 0;
                }
                
                // Load tokens count (placeholder for now)
                document.getElementById('tokens-count').textContent = '0';
                
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            }
        }
        
        // Load data on page load after auth check
        setTimeout(loadDashboardData, 100);
    </script>
</body>
</html>`;
}