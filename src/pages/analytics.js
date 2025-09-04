// =============================================================================
// 📊 ANALYTICS PAGE - Usage Analytics and Token Management
// =============================================================================

import { getNavigation, getSharedScript } from '../shared/navigation.js';

export function getAnalyticsPage(UNIFIED_CSS) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics - OAuth Hub</title>
    <style>${UNIFIED_CSS}</style>
</head>
<body>
    <div class="app-layout">
        ${getNavigation('analytics')}
        
        <main class="main">
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">Analytics & Token Management</h1>
                    <p class="page-description">
                        Monitor your OAuth usage and manage user tokens
                    </p>
                </div>
                
                <!-- Statistics Cards -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-6); margin-bottom: var(--space-8);">
                    <div class="card text-center">
                        <div style="font-size: 2.5rem; margin-bottom: var(--space-2);">🔑</div>
                        <h3 style="margin: 0; font-size: 2rem; color: var(--primary-600);" id="total-tokens">0</h3>
                        <p style="color: var(--gray-600); margin: var(--space-2) 0 0 0;">Active Tokens</p>
                    </div>
                    
                    <div class="card text-center">
                        <div style="font-size: 2.5rem; margin-bottom: var(--space-2);">📊</div>
                        <h3 style="margin: 0; font-size: 2rem; color: var(--success-500);" id="api-calls">0</h3>
                        <p style="color: var(--gray-600); margin: var(--space-2) 0 0 0;">API Calls Today</p>
                    </div>
                    
                    <div class="card text-center">
                        <div style="font-size: 2.5rem; margin-bottom: var(--space-2);">👥</div>
                        <h3 style="margin: 0; font-size: 2rem; color: var(--warning-500);" id="unique-users">0</h3>
                        <p style="color: var(--gray-600); margin: var(--space-2) 0 0 0;">Unique Users</p>
                    </div>
                    
                    <div class="card text-center">
                        <div style="font-size: 2.5rem; margin-bottom: var(--space-2);">📱</div>
                        <h3 style="margin: 0; font-size: 2rem; color: var(--primary-500);" id="platforms-count">0</h3>
                        <p style="color: var(--gray-600); margin: var(--space-2) 0 0 0;">Platforms</p>
                    </div>
                </div>
                
                <!-- Active Tokens -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Active User Tokens</h2>
                        <div style="display: flex; gap: var(--space-2);">
                            <button onclick="refreshTokensList()" class="btn btn-secondary">
                                <span>🔄</span>
                                Refresh
                            </button>
                        </div>
                    </div>
                    
                    <div id="tokens-list">
                        <div class="text-center" style="padding: var(--space-8);">
                            <div style="font-size: 3rem; margin-bottom: var(--space-4); opacity: 0.3;">🔑</div>
                            <h3 style="color: var(--gray-500);">Loading tokens...</h3>
                        </div>
                    </div>
                </div>
                
                <!-- Platform Usage -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Platform Usage</h2>
                    </div>
                    
                    <div id="platform-usage">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--space-4);" id="platform-stats">
                            <!-- Will be populated by JavaScript -->
                        </div>
                    </div>
                </div>
                
                <!-- Recent Activity -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Recent Activity</h2>
                    </div>
                    
                    <div id="recent-activity">
                        <div style="color: var(--gray-500); text-align: center; padding: var(--space-6);">
                            <p>No recent activity data available</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    ${getSharedScript()}
    <script>
        
        let tokensData = [];
        let platformStats = {};
        
        // Load analytics data
        async function loadAnalytics() {
            try {
                // Load tokens data (this would come from your KV storage)
                const response = await fetch('/analytics', {
                    credentials: 'include' // Include session cookie
                });
                if (response.ok) {
                    const data = await response.json();
                    tokensData = data.tokens || [];
                    updateAnalytics();
                } else {
                    // Fallback with mock data for now
                    updateAnalytics();
                }
            } catch (error) {
                console.error('Error loading analytics:', error);
                updateAnalytics();
            }
        }
        
        function updateAnalytics() {
            // Update statistics
            document.getElementById('total-tokens').textContent = tokensData.length;
            
            // Count unique users and platforms
            const uniqueUsers = new Set(tokensData.map(t => t.platformUserId)).size;
            const platforms = new Set(tokensData.map(t => t.platform)).size;
            
            document.getElementById('unique-users').textContent = uniqueUsers;
            document.getElementById('platforms-count').textContent = platforms;
            
            // Update platform stats
            platformStats = {};
            tokensData.forEach(token => {
                if (!platformStats[token.platform]) {
                    platformStats[token.platform] = 0;
                }
                platformStats[token.platform]++;
            });
            
            updateTokensList();
            updatePlatformStats();
        }
        
        function updateTokensList() {
            const container = document.getElementById('tokens-list');
            
            if (tokensData.length === 0) {
                container.innerHTML = \`
                    <div class="text-center" style="padding: var(--space-8);">
                        <div style="font-size: 3rem; margin-bottom: var(--space-4); opacity: 0.3;">🔑</div>
                        <h3 style="color: var(--gray-500);">No Active Tokens</h3>
                        <p style="color: var(--gray-400);">Tokens will appear here when users authorize your apps</p>
                    </div>
                \`;
                return;
            }
            
            container.innerHTML = tokensData.map((token, index) => {
                const isExpired = token.expiresAt && token.expiresAt < Date.now();
                const expiresDate = token.expiresAt ? new Date(token.expiresAt).toLocaleString() : 'Never';
                
                return \`
                    <div style="padding: var(--space-4); border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: var(--space-3); \${isExpired ? 'border-color: var(--danger-500); background: #fef2f2;' : ''}\">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-2);">
                                    <div style="font-size: 1.25rem;">\${getPlatformEmoji(token.platform)}</div>
                                    <div>
                                        <h4 style="margin: 0; color: var(--gray-800); text-transform: capitalize;">\${token.platform}</h4>
                                        <div style="color: var(--gray-600); font-size: 0.875rem;">User ID: \${token.platformUserId}</div>
                                    </div>
                                </div>
                                
                                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-2);">
                                    <div>
                                        <div style="font-size: 0.75rem; color: var(--gray-500); margin-bottom: var(--space-1);">STATUS</div>
                                        <span style="padding: 2px 8px; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 600; \${isExpired ? 'background: var(--danger-100); color: var(--danger-700);' : 'background: var(--success-100); color: var(--success-700);'}\">
                                            \${isExpired ? 'EXPIRED' : 'ACTIVE'}
                                        </span>
                                    </div>
                                    <div>
                                        <div style="font-size: 0.75rem; color: var(--gray-500); margin-bottom: var(--space-1);">EXPIRES</div>
                                        <div style="font-size: 0.875rem; color: var(--gray-600);">\${expiresDate}</div>
                                    </div>
                                    <div>
                                        <div style="font-size: 0.75rem; color: var(--gray-500); margin-bottom: var(--space-1);">TOKEN TYPE</div>
                                        <div style="font-size: 0.875rem; color: var(--gray-600);">\${token.tokenType || 'bearer'}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: var(--space-2); margin-left: var(--space-4);">
                                <button onclick="refreshToken('\${token.platformUserId}', '\${token.platform}')" class="btn btn-secondary" \${isExpired ? '' : 'disabled'}>
                                    \${isExpired ? 'Refresh' : 'Valid'}
                                </button>
                                <button onclick="revokeToken('\${token.platformUserId}', '\${token.platform}')" class="btn btn-secondary" style="color: var(--danger-500);">
                                    Revoke
                                </button>
                            </div>
                        </div>
                    </div>
                \`;
            }).join('');
        }
        
        function updatePlatformStats() {
            const container = document.getElementById('platform-stats');
            
            const platformEntries = Object.entries(platformStats);
            if (platformEntries.length === 0) {
                container.innerHTML = '<p style="color: var(--gray-500); text-align: center; grid-column: 1 / -1;">No platform data available</p>';
                return;
            }
            
            container.innerHTML = platformEntries.map(([platform, count]) => \`
                <div style="text-align: center; padding: var(--space-3); border: 1px solid var(--border-color); border-radius: var(--radius-md);">
                    <div style="font-size: 1.5rem; margin-bottom: var(--space-1);">\${getPlatformEmoji(platform)}</div>
                    <h4 style="margin: 0; font-size: 1.5rem; color: var(--primary-600);">\${count}</h4>
                    <p style="margin: var(--space-1) 0 0 0; font-size: 0.875rem; color: var(--gray-600); text-transform: capitalize;">\${platform}</p>
                </div>
            \`).join('');
        }
        
        function getPlatformEmoji(platform) {
            const emojis = {
                google: '🎬',
                facebook: '📘',
                instagram: '📸',
                twitter: '🐦',
                linkedin: '💼',
                tiktok: '🎵',
                discord: '🎮',
                pinterest: '📌'
            };
            return emojis[platform] || '📱';
        }
        
        async function refreshToken(platformUserId, platform) {
            try {
                const response = await fetch(\`/refresh/\${platformUserId}/\${encodeURIComponent(localStorage.getItem('userEmail'))}\`, {
                    method: 'POST'
                });
                
                if (response.ok) {
                    alert('Token refreshed successfully!');
                    await loadAnalytics();
                } else {
                    const error = await response.json();
                    alert('Error refreshing token: ' + (error.message || 'Unknown error'));
                }
            } catch (error) {
                alert('Network error. Please try again.');
            }
        }
        
        async function revokeToken(platformUserId, platform) {
            if (confirm('Are you sure you want to revoke this token? The user will need to re-authorize.')) {
                try {
                    const response = await fetch(\`/revoke-token/\${platformUserId}/\${encodeURIComponent(localStorage.getItem('userEmail'))}\`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        alert('Token revoked successfully!');
                        await loadAnalytics();
                    } else {
                        alert('Error revoking token');
                    }
                } catch (error) {
                    alert('Network error. Please try again.');
                }
            }
        }
        
        function refreshTokensList() {
            loadAnalytics();
        }
        
        
        // Mock data for demonstration
        tokensData = [
            {
                platform: 'google',
                platformUserId: '123456789',
                tokenType: 'bearer',
                expiresAt: Date.now() + 3600000 // 1 hour from now
            },
            {
                platform: 'facebook',
                platformUserId: '987654321', 
                tokenType: 'bearer',
                expiresAt: Date.now() - 3600000 // 1 hour ago (expired)
            }
        ];
        
        // Load analytics on page load
        updateAnalytics();
    </script>
</body>
</html>`;
}