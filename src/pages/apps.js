// =============================================================================
// 📱 APP CREDENTIALS PAGE - OAuth App Management
// =============================================================================

import { getNavigation, getSharedScript } from '../shared/navigation.js';
import { createScopeSelector } from '../components/scope-selector.js';

export function getAppsPage(UNIFIED_CSS) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App Credentials - OAuth Hub</title>
    <style>${UNIFIED_CSS}</style>
</head>
<body>
    <div class="app-layout">
        ${getNavigation('apps')}
        
        <main class="main">
            <div class="container">
                <div class="page-header">
                    <h1 class="page-title">App Credentials</h1>
                    <p class="page-description">
                        Manage OAuth application credentials for different platforms
                    </p>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">Add New OAuth App</h2>
                        <button onclick="showAddAppModal()" class="btn btn-primary">
                            <span>➕</span>
                            Add App
                        </button>
                    </div>
                    
                    <div id="apps-list">
                        <div class="text-center" style="padding: var(--space-8);">
                            <div style="font-size: 3rem; margin-bottom: var(--space-4); opacity: 0.3;">📱</div>
                            <h3 style="color: var(--gray-500);">No OAuth Apps Yet</h3>
                            <p style="color: var(--gray-400);">Add your first OAuth application to get started</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    <!-- Add App Modal -->
    <div id="addAppModal" class="modal-overlay">
        <div class="modal">
            <div class="modal-header">
                <h2 class="modal-title">Add OAuth Application</h2>
                <button onclick="hideAddAppModal()" class="modal-close">&times;</button>
            </div>
            
            <form id="app-form">
                <div class="form-group">
                    <label class="form-label">Platform</label>
                    <select id="platform" class="form-input" required>
                        <option value="">Select a platform</option>
                        <option value="google">Google (YouTube)</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="twitter">X (Twitter)</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="tiktok">TikTok</option>
                        <option value="discord">Discord</option>
                        <option value="pinterest">Pinterest</option>
                    </select>
                </div>
                
                <!-- Platform Help Section -->
                <div id="platform-help" style="display: none; margin-bottom: var(--space-4);">
                    <div style="background: var(--primary-50); border: 1px solid var(--primary-200); border-radius: var(--radius-md); padding: var(--space-4);">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-2);">
                            <h4 id="platform-help-title" style="margin: 0; color: var(--primary-700);">🔗 Create Your App</h4>
                            <a id="platform-help-url" href="#" target="_blank" style="
                                background: var(--primary-500); 
                                color: white; 
                                text-decoration: none; 
                                padding: var(--space-2) var(--space-3); 
                                border-radius: var(--radius-md); 
                                font-weight: 600;
                                transition: background-color 0.2s;
                            ">
                                Create App →
                            </a>
                        </div>
                        <p id="platform-help-description" style="margin: 0; color: var(--primary-600); font-size: 0.875rem;">
                            Create your OAuth app to get Client ID and Secret
                        </p>
                        <div style="background: var(--warning-50); border: 1px solid var(--warning-200); border-radius: var(--radius-sm); padding: var(--space-3); margin-top: var(--space-3);">
                            <strong style="color: var(--warning-700);">⚠️ Important:</strong>
                            <span style="color: var(--warning-600); font-size: 0.875rem;">
                                Set this redirect URI in your app:
                                <code style="background: var(--warning-100); padding: 2px 4px; border-radius: 3px;">
                                    https://oauth-handler.socialoauth.workers.dev/callback
                                </code>
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Client ID</label>
                    <input type="text" id="clientId" class="form-input" placeholder="Your app's client ID" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Client Secret</label>
                    <input type="password" id="clientSecret" class="form-input" placeholder="Your app's client secret" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">OAuth Scopes</label>
                    <div id="scopeSelector"></div>
                    <div style="font-size: 0.875rem; color: var(--gray-600); margin-top: var(--space-2);">
                        Select the OAuth permissions your app needs. The list updates based on your chosen platform.
                        <br><span style="color: var(--primary-600); font-weight: 500;">Note:</span> Required authentication scopes are automatically included.
                    </div>
                </div>
                
                
                <div class="flex gap-4" style="margin-top: var(--space-6);">
                    <button type="submit" class="btn btn-primary">
                        <span>💾</span>
                        Save App
                    </button>
                    <button type="button" onclick="hideAddAppModal()" class="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
    
    ${getSharedScript()}
    <script>
        
        let userApps = [];
        let scopeSelector = null;
        
        // Import OAuth scopes from the shared module
        // Note: In a real implementation, this would be imported at the top
        // For now, we'll fetch it from the shared module
        
        // Import required scopes and scope functions
        // These include basic profile/authentication + user identity scopes for all platforms
        const REQUIRED_SCOPES = {
          google: ['openid', 'profile', 'email'], // OpenID Connect + basic profile
          facebook: ['public_profile', 'email'], // Facebook basic profile + email
          instagram: ['public_profile', 'email'], // Uses Facebook OAuth + email
          twitter: ['users.read'], // Basic user info (includes profile data)
          linkedin: ['openid', 'profile', 'email'], // LinkedIn basic profile + email
          tiktok: ['user.info.basic', 'user.info.profile'], // TikTok user profile scopes
          discord: ['identify', 'email'], // Discord basic identity + email
          pinterest: ['user_accounts:read'] // Pinterest user account info
        };
        
        // OAuth Scopes Database - Comprehensive Platform Scopes (without required scopes)
        const PLATFORM_SCOPES = {
          google: {
            name: 'Google (YouTube)',
            categories: {
              'Google Drive': [
                { scope: 'https://www.googleapis.com/auth/drive', description: 'Full access to Google Drive files' },
                { scope: 'https://www.googleapis.com/auth/drive.readonly', description: 'View Google Drive files' },
                { scope: 'https://www.googleapis.com/auth/drive.file', description: 'Access files created by this app' },
                { scope: 'https://www.googleapis.com/auth/drive.metadata', description: 'View and manage metadata of files' }
              ],
              'YouTube': [
                { scope: 'https://www.googleapis.com/auth/youtube', description: 'Manage YouTube account' },
                { scope: 'https://www.googleapis.com/auth/youtube.readonly', description: 'View YouTube account' },
                { scope: 'https://www.googleapis.com/auth/youtube.upload', description: 'Upload videos to YouTube' }
              ],
              'Google Drive': [
                { scope: 'https://www.googleapis.com/auth/drive', description: 'Full access to Google Drive files' },
                { scope: 'https://www.googleapis.com/auth/drive.readonly', description: 'View Google Drive files' }
              ]
            }
          },
          facebook: {
            name: 'Facebook',
            categories: {
              'Page Management': [
                { scope: 'pages_show_list', description: 'Access the list of Pages a person manages' },
                { scope: 'pages_manage_posts', description: 'Create, edit and delete posts on Pages' },
                { scope: 'pages_read_engagement', description: 'Read engagement data on Pages posts' },
                { scope: 'pages_manage_metadata', description: 'Manage Pages metadata including profile photo' },
                { scope: 'pages_read_user_content', description: 'Read content posted by users on Pages' },
                { scope: 'pages_manage_ads', description: 'Manage ads on Pages' },
                { scope: 'pages_manage_instant_articles', description: 'Manage Instant Articles on Pages' },
                { scope: 'page_events', description: 'Create and manage events on Pages' }
              ],
              'Instagram Integration': [
                { scope: 'instagram_basic', description: 'Access Instagram account linked to Page' },
                { scope: 'instagram_content_publish', description: 'Publish photos and videos to Instagram' },
                { scope: 'instagram_manage_comments', description: 'Manage comments on Instagram posts' },
                { scope: 'instagram_manage_insights', description: 'Access Instagram insights' },
                { scope: 'instagram_manage_messages', description: 'Manage Instagram direct messages' }
              ],
              'User Data': [
                { scope: 'user_friends', description: 'Access user friends list' },
                { scope: 'user_posts', description: 'Access user posts' },
                { scope: 'user_photos', description: 'Access user photos' },
                { scope: 'user_videos', description: 'Access user videos' },
                { scope: 'user_likes', description: 'Access user likes' },
                { scope: 'user_events', description: 'Access user events' },
                { scope: 'user_hometown', description: 'Access user hometown' },
                { scope: 'user_location', description: 'Access user location' },
                { scope: 'user_birthday', description: 'Access user birthday' },
                { scope: 'user_age_range', description: 'Access user age range' },
                { scope: 'user_gender', description: 'Access user gender' }
              ],
              'Business & Marketing': [
                { scope: 'ads_management', description: 'Manage ads and ad campaigns' },
                { scope: 'ads_read', description: 'Read ads insights and performance data' },
                { scope: 'business_management', description: 'Manage business assets' },
                { scope: 'leads_retrieval', description: 'Retrieve leads from lead ads' },
                { scope: 'read_insights', description: 'Read insights for Pages and apps' },
                { scope: 'publish_to_groups', description: 'Publish posts to groups' },
                { scope: 'groups_access_member_info', description: 'Access member info in groups' },
                { scope: 'publish_pages', description: 'Publish content to Pages' }
              ],
              'Messaging & Communication': [
                { scope: 'pages_messaging', description: 'Send and receive messages on behalf of Pages' },
                { scope: 'pages_messaging_subscriptions', description: 'Subscribe to messaging webhooks' },
                { scope: 'pages_messaging_phone_number', description: 'Access messaging phone number' }
              ],
              'Live Streaming & Video': [
                { scope: 'publish_video', description: 'Upload and publish videos' },
                { scope: 'pages_manage_cta', description: 'Manage call-to-action buttons on Pages' },
                { scope: 'read_page_mailboxes', description: 'Read Page inbox messages' }
              ]
            }
          },
          instagram: {
            name: 'Instagram',
            categories: {
              'Graph API': [
                { scope: 'instagram_graph_user_profile', description: 'Read user profile information' },
                { scope: 'instagram_graph_user_media', description: 'Read user media' }
              ],
              'Content Management': [
                { scope: 'instagram_manage_comments', description: 'Manage comments on posts' },
                { scope: 'instagram_content_publish', description: 'Publish photos and videos' }
              ]
            }
          },
          twitter: {
            name: 'X (Twitter)',
            categories: {
              'Tweet Operations': [
                { scope: 'tweet.read', description: 'Read Tweets' },
                { scope: 'tweet.write', description: 'Create, delete, and edit Tweets' }
              ],
              'User Operations': [
                { scope: 'follows.read', description: 'Read following and followers lists' },
                { scope: 'follows.write', description: 'Follow and unfollow users' }
              ]
            }
          },
          linkedin: {
            name: 'LinkedIn',
            categories: {
              'Content Management': [
                { scope: 'w_member_social', description: 'Post on behalf of members' },
                { scope: 'w_organization_social', description: 'Post on behalf of organizations' }
              ]
            }
          },
          tiktok: {
            name: 'TikTok',
            categories: {
              'Video Management': [
                { scope: 'video.list', description: 'Access user video list' },
                { scope: 'video.upload', description: 'Upload videos to TikTok' }
              ]
            }
          },
          discord: {
            name: 'Discord',
            categories: {
              'Guild Management': [
                { scope: 'guilds', description: 'View user\\'s guild information' },
                { scope: 'guilds.join', description: 'Join users to guilds' }
              ]
            }
          },
          pinterest: {
            name: 'Pinterest',
            categories: {
              'Board Management': [
                { scope: 'boards:read', description: 'Read access to public boards' },
                { scope: 'boards:write', description: 'Create, update, or delete public boards' }
              ],
              'Pin Management': [
                { scope: 'pins:read', description: 'Read access to public pins' },
                { scope: 'pins:write', description: 'Create, update, or delete public pins' }
              ]
            }
          }
        };
        
        // Scope selector implementation
        function createScopeSelector(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return null;

            let currentPlatform = '';
            let selectedScopes = new Set();
            let isOpen = false;

            function render() {
                const platformData = PLATFORM_SCOPES[currentPlatform];
                const hasScopes = platformData && Object.keys(platformData.categories).length > 0;
                
                container.innerHTML = \`
                    <div class="scope-selector">
                        <div class="scope-display" id="scopeDisplay">
                            \${selectedScopes.size > 0 
                                ? \`<div class="selected-scopes-preview">
                                      \${Array.from(selectedScopes).slice(0, 3).map(scope => 
                                        \`<span class="scope-tag">\${scope}<button class="scope-remove" onclick="removeScopeTag('\${scope.replace(/'/g, "\\\\'")}')" title="Remove scope">×</button></span>\`
                                      ).join('')}
                                      \${selectedScopes.size > 3 ? \`<span class="scope-count">+\${selectedScopes.size - 3} more</span>\` : ''}
                                   </div>\`
                                : \`<span class="scope-placeholder">\${hasScopes ? 'Click to select scopes...' : 'Select a platform first'}</span>\`
                            }
                            <span class="dropdown-arrow \${isOpen ? 'open' : ''}">▼</span>
                        </div>
                        
                        <div class="scope-dropdown \${isOpen ? 'open' : ''}" id="scopeDropdown">
                            \${hasScopes ? renderScopeDropdown() : '<div class="no-scopes">Select a platform first to see available scopes</div>'}
                        </div>
                    </div>
                    
                    <style>
                        .scope-selector { position: relative; width: 100%; }
                        .scope-display { min-height: 45px; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--space-2) var(--space-3); background: white; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: border-color 0.2s ease; }
                        .scope-display:hover { border-color: var(--primary-300); }
                        .scope-display.open { border-color: var(--primary-500); border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
                        .selected-scopes-preview { display: flex; flex-wrap: wrap; gap: var(--space-1); flex: 1; }
                        .scope-tag { background: var(--primary-100); color: var(--primary-700); padding: 2px var(--space-2); border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 500; display: inline-flex; align-items: center; gap: 4px; }
                        .scope-remove { background: none; border: none; color: var(--primary-600); cursor: pointer; font-weight: bold; padding: 0; margin: 0; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 10px; line-height: 1; }
                        .scope-remove:hover { background: var(--primary-200); color: var(--primary-800); }
                        .scope-count { background: var(--gray-100); color: var(--gray-600); padding: 2px var(--space-2); border-radius: var(--radius-sm); font-size: 0.75rem; }
                        .scope-placeholder { color: var(--gray-500); font-style: italic; }
                        .dropdown-arrow { color: var(--gray-400); font-size: 0.8rem; transition: transform 0.2s ease; margin-left: var(--space-2); }
                        .dropdown-arrow.open { transform: rotate(180deg); }
                        .scope-dropdown { position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid var(--border-color); border-top: none; border-radius: 0 0 var(--radius-md) var(--radius-md); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); max-height: 400px; overflow-y: auto; z-index: 1000; display: none; }
                        .scope-dropdown.open { display: block; }
                        .scope-search { padding: var(--space-3); border-bottom: 1px solid var(--border-color); }
                        .scope-search input { width: 100%; padding: var(--space-2); border: 1px solid var(--border-color); border-radius: var(--radius-sm); font-size: 0.875rem; }
                        .scope-category { border-bottom: 1px solid var(--gray-100); }
                        .scope-category:last-child { border-bottom: none; }
                        .scope-category-header { padding: var(--space-3); background: var(--gray-50); font-weight: 600; font-size: 0.875rem; color: var(--gray-700); border-bottom: 1px solid var(--gray-200); }
                        .scope-option { padding: var(--space-2) var(--space-3); cursor: pointer; display: flex; align-items: flex-start; gap: var(--space-2); transition: background-color 0.15s ease; }
                        .scope-option:hover { background: var(--gray-50); }
                        .scope-checkbox { margin-top: 2px; cursor: pointer; }
                        .scope-info { flex: 1; }
                        .scope-name { font-weight: 500; font-size: 0.875rem; color: var(--gray-800); font-family: var(--font-mono); }
                        .scope-description { font-size: 0.75rem; color: var(--gray-600); margin-top: 2px; }
                        .no-scopes { padding: var(--space-8); text-align: center; color: var(--gray-500); }
                        .scope-summary { padding: var(--space-3); background: var(--primary-50); border-bottom: 1px solid var(--primary-200); font-size: 0.875rem; color: var(--primary-700); }
                    </style>
                \`;

                // Add event listeners after rendering
                const scopeDisplay = container.querySelector('.scope-display');
                console.log('Found scope display element:', !!scopeDisplay);
                if (scopeDisplay) {
                    // Remove any existing listeners first
                    scopeDisplay.replaceWith(scopeDisplay.cloneNode(true));
                    const newScopeDisplay = container.querySelector('.scope-display');
                    
                    newScopeDisplay.addEventListener('click', function(e) {
                        console.log('Scope display clicked!');
                        toggleScopeDropdownFn();
                    });
                    
                    console.log('Event listener attached to scope display');
                }

                // Add event listeners for scope options (with delay to ensure DOM is ready)
                setTimeout(() => {
                    container.querySelectorAll('.scope-option').forEach((option, index) => {
                        option.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            const scopeName = this.dataset.scope;
                            console.log('Scope option clicked:', scopeName);
                            if (scopeName) {
                                toggleScopeFn(scopeName);
                            }
                        });
                    });
                    console.log('Event listeners attached to', container.querySelectorAll('.scope-option').length, 'scope options');
                }, 10);

                // Add event listener for search
                const searchInput = container.querySelector('.scope-search input');
                if (searchInput) {
                    searchInput.addEventListener('keyup', searchScopesFn);
                }
            }

            function renderScopeDropdown() {
                const platformData = PLATFORM_SCOPES[currentPlatform];
                if (!platformData) return '<div class="no-scopes">No scopes available for this platform</div>';

                return \`
                    <div class="scope-summary">
                        \${selectedScopes.size} scope\${selectedScopes.size !== 1 ? 's' : ''} selected
                    </div>
                    
                    <div class="scope-search">
                        <input type="text" placeholder="Search scopes...">
                    </div>
                    
                    <div id="scopeCategories">
                        \${renderScopeCategories('')}
                    </div>
                \`;
            }

            function renderScopeCategories(searchQuery = '') {
                const platformData = PLATFORM_SCOPES[currentPlatform];
                if (!platformData) return '';

                return Object.entries(platformData.categories).map(([categoryName, scopes]) => \`
                    <div class="scope-category">
                        <div class="scope-category-header">\${categoryName} (\${scopes.length})</div>
                        \${scopes.map(scope => renderScopeOption(scope)).join('')}
                    </div>
                \`).join('');
            }

            function renderScopeOption(scope) {
                const isSelected = selectedScopes.has(scope.scope);
                return \`
                    <div class="scope-option" data-scope="\${scope.scope}">
                        <input type="checkbox" class="scope-checkbox" \${isSelected ? 'checked' : ''}>
                        <div class="scope-info">
                            <div class="scope-name">\${scope.scope}</div>
                            <div class="scope-description">\${scope.description}</div>
                        </div>
                    </div>
                \`;
            }

            // Create unique function names for this instance
            const toggleScopeDropdownFn = function() {
                console.log('toggleScopeDropdownFn called, currentPlatform:', currentPlatform);
                if (!PLATFORM_SCOPES[currentPlatform]) {
                    console.log('No platform scopes found for:', currentPlatform);
                    return;
                }
                isOpen = !isOpen;
                console.log('Dropdown isOpen set to:', isOpen);
                
                // Instead of full re-render, just toggle the dropdown class
                const dropdown = container.querySelector('.scope-dropdown');
                const arrow = container.querySelector('.dropdown-arrow');
                
                if (dropdown && arrow) {
                    if (isOpen) {
                        dropdown.classList.add('open');
                        arrow.classList.add('open');
                        console.log('Dropdown opened via class toggle');
                    } else {
                        dropdown.classList.remove('open');
                        arrow.classList.remove('open');
                        console.log('Dropdown closed via class toggle');
                    }
                } else {
                    console.log('Full re-render needed');
                    render();
                }
            };

            const toggleScopeFn = function(scopeName) {
                if (selectedScopes.has(scopeName)) {
                    selectedScopes.delete(scopeName);
                } else {
                    selectedScopes.add(scopeName);
                }
                render();
            };

            const searchScopesFn = function(event) {
                const query = event.target.value.toLowerCase();
                const categoriesContainer = document.getElementById('scopeCategories');
                if (!categoriesContainer) return;

                const platformData = PLATFORM_SCOPES[currentPlatform];
                if (!platformData) return;

                if (query) {
                    // Filter scopes based on search
                    const allScopes = [];
                    Object.entries(platformData.categories).forEach(([categoryName, scopes]) => {
                        scopes.forEach(scope => {
                            if (scope.scope.toLowerCase().includes(query) || scope.description.toLowerCase().includes(query)) {
                                allScopes.push(scope);
                            }
                        });
                    });

                    categoriesContainer.innerHTML = allScopes.length > 0 ? \`
                        <div class="scope-category">
                            <div class="scope-category-header">Search Results (\${allScopes.length})</div>
                            \${allScopes.map(scope => renderScopeOption(scope)).join('')}
                        </div>
                    \` : '<div class="no-scopes">No scopes match your search</div>';
                } else {
                    categoriesContainer.innerHTML = renderScopeCategories();
                }

                // Re-attach event listeners to new scope options
                container.querySelectorAll('.scope-option').forEach(option => {
                    option.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const scopeName = this.dataset.scope;
                        if (scopeName) {
                            toggleScopeFn(scopeName);
                        }
                    });
                });
            };

            const removeScopeTagFn = function(scopeName) {
                selectedScopes.delete(scopeName);
                render();
            };

            // Expose functions globally
            window.toggleScopeDropdown = toggleScopeDropdownFn;
            window.toggleScope = toggleScopeFn;
            window.searchScopes = searchScopesFn;
            window.removeScopeTag = removeScopeTagFn;

            return {
                setPlatform(platform) {
                    currentPlatform = platform;
                    selectedScopes.clear();
                    isOpen = false;
                    render();
                },
                getSelectedScopes() {
                    return Array.from(selectedScopes);
                },
                setScopes(scopes) {
                    selectedScopes = new Set(scopes);
                    render();
                },
                closeDropdown() {
                    if (isOpen) {
                        isOpen = false;
                        const dropdown = container.querySelector('.scope-dropdown');
                        const arrow = container.querySelector('.dropdown-arrow');
                        if (dropdown && arrow) {
                            dropdown.classList.remove('open');
                            arrow.classList.remove('open');
                        }
                    }
                }
            };
        }

        // Update scope selector based on selected platform
        function updateScopeSelector() {
            const platform = document.getElementById('platform').value;
            
            // Update platform help section
            updatePlatformHelp(platform);
            
            if (platform) {
                // Initialize or update scope selector for new platform
                setTimeout(() => {
                    if (!scopeSelector) {
                        scopeSelector = createScopeSelector('scopeSelector');
                        window.scopeSelector = scopeSelector; // Make it globally accessible
                        console.log('Scope selector created');
                    }
                    if (scopeSelector && typeof scopeSelector.setPlatform === 'function') {
                        scopeSelector.setPlatform(platform);
                        console.log('Platform set to:', platform);
                    }
                }, 150);
            } else {
                if (scopeSelector && typeof scopeSelector.setPlatform === 'function') {
                    scopeSelector.setPlatform('');
                }
            }
        }
        
        // Update platform help section
        function updatePlatformHelp(platform) {
            const helpSection = document.getElementById('platform-help');
            const helpTitle = document.getElementById('platform-help-title');
            const helpDescription = document.getElementById('platform-help-description');
            const helpUrl = document.getElementById('platform-help-url');
            
            const platformData = {
                facebook: {
                    title: '📘 Create Facebook App',
                    description: 'Create apps for Facebook Login & Instagram API access',
                    url: 'https://developers.facebook.com/'
                },
                google: {
                    title: '🎬 Create Google App',
                    description: 'Access Gmail, Drive, Calendar, YouTube & more APIs',
                    url: 'https://console.cloud.google.com/'
                },
                twitter: {
                    title: '🐦 Create X (Twitter) App',
                    description: 'Create apps for X API v2 access',
                    url: 'https://developer.x.com/'
                },
                linkedin: {
                    title: '💼 Create LinkedIn App',
                    description: 'Access professional profiles & company data',
                    url: 'https://developer.linkedin.com/'
                },
                instagram: {
                    title: '📸 Create Instagram App',
                    description: 'Use Facebook Developer Portal for Instagram API',
                    url: 'https://developers.facebook.com/'
                },
                tiktok: {
                    title: '🎵 Create TikTok App',
                    description: 'Create apps for TikTok Login Kit & API',
                    url: 'https://developers.tiktok.com/'
                },
                discord: {
                    title: '🎮 Create Discord App',
                    description: 'Create Discord applications and bots',
                    url: 'https://discord.com/developers/'
                },
                pinterest: {
                    title: '📌 Create Pinterest App',
                    description: 'Create apps for Pinterest API access',
                    url: 'https://developers.pinterest.com/'
                }
            };
            
            if (platform && platformData[platform]) {
                const data = platformData[platform];
                helpTitle.textContent = data.title;
                helpDescription.textContent = data.description;
                helpUrl.href = data.url;
                helpSection.style.display = 'block';
            } else {
                helpSection.style.display = 'none';
            }
        }
        
        
        // Modal functions
        function showAddAppModal() {
            document.getElementById('addAppModal').classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Initialize scope selector when modal opens with delay
            setTimeout(() => {
                const container = document.getElementById('scopeSelector');
                if (container && !scopeSelector) {
                    scopeSelector = createScopeSelector('scopeSelector');
                    window.scopeSelector = scopeSelector; // Make it globally accessible
                    console.log('Scope selector created on modal open');
                }
                
                updateScopeSelector(); // Initialize/update scope selector
                
                // Set initial platform if already selected
                const platform = document.getElementById('platform').value;
                if (platform && scopeSelector) {
                    scopeSelector.setPlatform(platform);
                    console.log('Platform set to:', platform);
                }
            }, 200); // Increased delay to ensure DOM is ready
        }
        
        function hideAddAppModal() {
            document.getElementById('addAppModal').classList.remove('show');
            document.body.style.overflow = '';
            document.getElementById('app-form').reset();
            
            // Reset scope selector
            if (scopeSelector) {
                scopeSelector.setScopes([]);
                scopeSelector.setPlatform('');
            }
            
            // Reset modal state
            document.querySelector('.modal-title').textContent = 'Add OAuth Application';
            document.querySelector('.btn-primary').innerHTML = '<span>💾</span> Save App';
            window.currentEditIndex = null;
        }
        
        // Load user's apps
        async function loadApps() {
            try {
                const response = await fetch('/user-apps', {
                    credentials: 'include' // Include session cookie
                });
                if (response.ok) {
                    const data = await response.json();
                    userApps = data.apps || [];
                    updateAppsList();
                }
            } catch (error) {
                console.error('Error loading apps:', error);
            }
        }
        
        // Update apps list display
        function updateAppsList() {
            const container = document.getElementById('apps-list');
            
            if (userApps.length === 0) {
                container.innerHTML = \`
                    <div class="text-center" style="padding: var(--space-8);">
                        <div style="font-size: 3rem; margin-bottom: var(--space-4); opacity: 0.3;">📱</div>
                        <h3 style="color: var(--gray-500);">No OAuth Apps Yet</h3>
                        <p style="color: var(--gray-400);">Add your first OAuth application to get started</p>
                    </div>
                \`;
                return;
            }
            
            container.innerHTML = userApps.map((app, index) => \`
                <div style="padding: var(--space-4); border: 1px solid var(--border-color); border-radius: var(--radius-md); margin-bottom: var(--space-4);">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-3);">
                                <div style="font-size: 1.5rem;">\${getPlatformEmoji(app.platform)}</div>
                                <div>
                                    <h4 style="margin: 0; color: var(--gray-800); text-transform: capitalize;">\${app.platform} App</h4>
                                    <div style="color: var(--gray-600); font-size: 0.875rem;">OAuth Application</div>
                                </div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-bottom: var(--space-3);">
                                <div>
                                    <div style="font-size: 0.75rem; color: var(--gray-500); margin-bottom: var(--space-1);">CLIENT ID</div>
                                    <code style="font-family: var(--font-mono); font-size: 0.875rem; color: var(--gray-700);">
                                        \${app.clientId.substring(0, 20)}...
                                    </code>
                                </div>
                                <div>
                                    <div style="font-size: 0.75rem; color: var(--gray-500); margin-bottom: var(--space-1);">SCOPES</div>
                                    <div style="font-size: 0.875rem; color: var(--gray-600);">\${app.scopes.join(', ')}</div>
                                </div>
                            </div>
                            
                            <div>
                                <div style="font-size: 0.75rem; color: var(--gray-500); margin-bottom: var(--space-1);">REDIRECT URI</div>
                                <div style="font-size: 0.875rem; color: var(--gray-600); word-break: break-all;">\${app.redirectUri}</div>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: var(--space-2); margin-left: var(--space-4);">
                            <button onclick="editApp(\${index})" class="btn btn-secondary">Edit</button>
                            <button onclick="deleteApp(\${index})" class="btn btn-secondary" style="color: var(--danger-500);">Delete</button>
                        </div>
                    </div>
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
        
        // Platform change handler
        document.getElementById('platform').addEventListener('change', updateScopeSelector);
        
        // Also initialize scope selector when modal is first opened
        window.showAddAppModal = showAddAppModal;
        
        
        // Form submission
        document.getElementById('app-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const platform = document.getElementById('platform').value;
            const redirectUri = 'https://oauth-handler.socialoauth.workers.dev/callback';
            
            // Get selected scopes from scope selector and add required scopes
            const selectedScopes = scopeSelector ? scopeSelector.getSelectedScopes() : [];
            const requiredScopes = REQUIRED_SCOPES[platform] || [];
            const finalScopes = [...requiredScopes, ...selectedScopes];
            
            // Remove duplicates
            const uniqueScopes = [...new Set(finalScopes)];
            
            if (uniqueScopes.length === 0) {
                alert('No scopes available for this platform.');
                return;
            }
            
            const appData = {
                platform: platform,
                name: platform.charAt(0).toUpperCase() + platform.slice(1), // Use platform as name
                clientId: document.getElementById('clientId').value,
                clientSecret: document.getElementById('clientSecret').value,
                scopes: uniqueScopes,
                redirectUri: redirectUri
            };
            
            try {
                const response = await fetch('/save-app', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...appData, email: localStorage.getItem('userEmail') })
                });
                
                if (response.ok) {
                    hideAddAppModal();
                    await loadApps();
                    // App successfully added - UI will update automatically
                } else {
                    const error = await response.json();
                    alert('Error: ' + (error.message || 'Failed to save app'));
                }
            } catch (error) {
                alert('Network error. Please try again.');
            }
        });
        
        function editApp(index) {
            const app = userApps[index];
            
            // Store the current edit index
            window.currentEditIndex = index;
            
            // Pre-populate the form with existing data
            document.getElementById('platform').value = app.platform;
            document.getElementById('clientId').value = app.clientId;
            document.getElementById('clientSecret').value = app.clientSecret;
            
            // Set the scopes if scope selector exists
            if (scopeSelector) {
                scopeSelector.setPlatform(app.platform);
                
                // Trigger platform change to update scope selector
                updateScopeSelector();
                
                // Filter out required scopes since they're automatically included
                const requiredScopes = REQUIRED_SCOPES[app.platform] || [];
                const optionalScopes = app.scopes.filter(scope => !requiredScopes.includes(scope));
                
                // Set scopes after a delay to ensure platform-specific scopes have loaded
                setTimeout(() => {
                    if (scopeSelector) {
                        scopeSelector.setScopes(optionalScopes);
                        console.log('Setting scopes for edit:', optionalScopes);
                    }
                }, 500);
            }
            
            // Change the modal title and button text
            document.querySelector('.modal-title').textContent = 'Edit OAuth Application';
            document.querySelector('.btn-primary span').textContent = '💾';
            document.querySelector('.btn-primary').innerHTML = '<span>💾</span> Update App';
            
            // Show the modal
            showAddAppModal();
        }
        
        async function deleteApp(index) {
            if (confirm('Are you sure you want to delete this OAuth app?')) {
                const app = userApps[index];
                try {
                    const response = await fetch(\`/delete-app/\${app.platform}?email=\${encodeURIComponent(localStorage.getItem('userEmail'))}\`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        await loadApps();
                        // App successfully deleted - UI will update automatically
                    } else {
                        alert('Error deleting app');
                    }
                } catch (error) {
                    alert('Network error. Please try again.');
                }
            }
        }
        
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const scopeSelector = document.querySelector('.scope-selector');
            if (scopeSelector && !scopeSelector.contains(event.target)) {
                const dropdown = document.querySelector('.scope-dropdown.open');
                if (dropdown) {
                    dropdown.classList.remove('open');
                    const arrow = document.querySelector('.dropdown-arrow.open');
                    if (arrow) arrow.classList.remove('open');
                    
                    // Also update the internal state if scope selector exists
                    if (window.scopeSelector && typeof window.scopeSelector.closeDropdown === 'function') {
                        window.scopeSelector.closeDropdown();
                    }
                }
            }
        });

        // Load apps on page load
        loadApps();
    </script>
</body>
</html>`;
}