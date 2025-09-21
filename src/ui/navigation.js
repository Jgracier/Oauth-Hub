// =============================================================================
// 🧭 MODERN NAVIGATION - Sidebar with collapsible menu
// =============================================================================

import { MODERN_ICONS } from './styles.js';

export function getModernSidebar(activePage = '', userEmail = '', userName = '') {
  const initials = userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  
  return `
    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <a href="/dashboard" class="sidebar-logo">
          <div class="sidebar-logo-icon">
            ${MODERN_ICONS.logo}
          </div>
          <span>OAuth Hub</span>
        </a>
        <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle sidebar">
          ${MODERN_ICONS.chevronLeft}
        </button>
      </div>
      
      <div class="sidebar-content">
        <nav class="sidebar-nav">
          <a href="/dashboard" class="nav-item ${activePage === 'dashboard' ? 'active' : ''}" data-tooltip="Dashboard">
            <span class="nav-item-icon">${MODERN_ICONS.dashboard}</span>
            <span class="nav-item-text">Dashboard</span>
          </a>
          
          <a href="/apps" class="nav-item ${activePage === 'apps' ? 'active' : ''}" data-tooltip="OAuth Apps">
            <span class="nav-item-icon">${MODERN_ICONS.apps}</span>
            <span class="nav-item-text">OAuth Apps</span>
          </a>
          
          <a href="/api-keys" class="nav-item ${activePage === 'api-keys' ? 'active' : ''}" data-tooltip="API Keys">
            <span class="nav-item-icon">${MODERN_ICONS.keys}</span>
            <span class="nav-item-text">API Keys</span>
          </a>
          
          <a href="/analytics" class="nav-item ${activePage === 'analytics' ? 'active' : ''}" data-tooltip="Analytics">
            <span class="nav-item-icon">${MODERN_ICONS.analytics}</span>
            <span class="nav-item-text">Analytics</span>
          </a>
          
          <a href="/subscription" class="nav-item ${activePage === 'subscription' ? 'active' : ''}" data-tooltip="Subscription">
            <span class="nav-item-icon">${MODERN_ICONS.creditCard}</span>
            <span class="nav-item-text">Subscription</span>
          </a>
          
          <a href="/docs" class="nav-item ${activePage === 'docs' ? 'active' : ''}" data-tooltip="Documentation">
            <span class="nav-item-icon">${MODERN_ICONS.docs}</span>
            <span class="nav-item-text">Documentation</span>
          </a>
          
          <a href="/settings" class="nav-item ${activePage === 'settings' ? 'active' : ''}" data-tooltip="Settings">
            <span class="nav-item-icon">${MODERN_ICONS.settings}</span>
            <span class="nav-item-text">Settings</span>
          </a>
        </nav>
      </div>
      
      <div class="sidebar-footer">
        <div class="profile-menu" id="profile-menu">
          <div class="profile-avatar" id="profile-avatar">${initials}</div>
          <div class="profile-info">
            <div class="profile-name">${userName || 'User'}</div>
            <div class="profile-email">${userEmail || 'Loading...'}</div>
          </div>
          <span class="nav-item-icon">${MODERN_ICONS.chevronDown}</span>
        </div>
        
        <div class="profile-dropdown hidden" id="profile-dropdown">
          <a href="/profile" class="nav-item" data-tooltip="Profile">
            <span class="nav-item-icon">${MODERN_ICONS.profile}</span>
            <span class="nav-item-text">Profile</span>
          </a>
          <button class="nav-item" onclick="toggleTheme()" data-tooltip="Toggle Theme">
            <span class="nav-item-icon" id="theme-icon">${MODERN_ICONS.moon}</span>
            <span class="nav-item-text">Dark Mode</span>
          </button>
          <button class="nav-item" onclick="logout()" data-tooltip="Logout">
            <span class="nav-item-icon">${MODERN_ICONS.logout}</span>
            <span class="nav-item-text">Logout</span>
          </button>
        </div>
      </div>
    </aside>
    
    <!-- Mobile Menu Button -->
    <button class="btn btn-icon mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Open menu">
      ${MODERN_ICONS.menu}
    </button>
  `;
}

export function getModernHeader(pageTitle = '') {
  return `
    <header class="main-header">
      <div class="flex items-center justify-between" style="width: 100%;">
        <h1 class="text-2xl font-semibold">${pageTitle}</h1>
        
        <div class="flex items-center gap-3">
          <!-- Search -->
          <div class="search-box hidden md:flex">
            <input type="search" placeholder="Search..." class="form-input" style="width: 300px;">
          </div>
          
          <!-- Theme Toggle -->
          <button class="btn btn-icon btn-ghost" onclick="toggleTheme()" aria-label="Toggle theme">
            <span id="header-theme-icon">${MODERN_ICONS.moon}</span>
          </button>
          
          <!-- Notifications -->
          <button class="btn btn-icon btn-ghost" aria-label="Notifications">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  `;
}

export function getModernLayout(activePage, pageTitle, content, userEmail = '', userName = '') {
  return `
    <div class="app">
      ${getModernSidebar(activePage, userEmail, userName)}
      
      <div class="main-wrapper">
        ${getModernHeader(pageTitle)}
        
        <main class="main-content">
          ${content}
        </main>
      </div>
    </div>
  `;
}

export function getModernScripts() {
  return `
    <!-- IMMEDIATE THEME INITIALIZATION - Prevents flash -->
    <script>
      // Apply theme IMMEDIATELY before page renders to prevent flash
      (function() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
      })();
    </script>
    
    <script>
      // Profile Picture Management - Enhanced with caching
      async function loadProfilePicture() {
        try {
          // Check if we already have cached data and it's fresh
          const globalState = window.OAUTH_HUB_STATE;
          if (globalState?.profilePicture && globalState.initialized) {
            return; // Already loaded and applied
          }
          
          const userEmail = localStorage.getItem('userEmail');
          if (!userEmail) return;
          
          // Get user profile data from server
          const response = await fetch('/check-session', {
            method: 'GET',
            credentials: 'include'
          });
          
          if (response.ok) {
            const sessionData = await response.json();
            if (sessionData.authenticated && sessionData.user) {
              const user = sessionData.user;
              
              // Check for OAuth profile pictures
              let profilePicture = null;
              
              // Priority: Google > GitHub > initials
              if (user.googleProfile?.picture) {
                profilePicture = user.googleProfile.picture;
              } else if (user.githubProfile?.avatar_url) {
                profilePicture = user.githubProfile.avatar_url;
              }
              
              // Cache the profile picture for instant loading on other pages
              if (profilePicture) {
                sessionStorage.setItem('profilePicture', profilePicture);
                const avatarElements = document.querySelectorAll('.profile-avatar');
                avatarElements.forEach(el => {
                  el.innerHTML = \`<img src="\${profilePicture}" alt="Profile" style="width: 100%; height: 100%; border-radius: inherit; object-fit: cover;">\`;
                });
              } else {
                // Cache initials if no profile picture
                const userName = localStorage.getItem('userName') || 'User';
                const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                sessionStorage.setItem('userInitials', initials);
              }
              
              // Update global state
              if (globalState) {
                globalState.profilePicture = profilePicture;
                globalState.initialized = true;
              }
            }
          }
        } catch (error) {
          console.log('Could not load profile picture:', error);
        }
      }
      
      // Theme Management
      function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcons(savedTheme);
      }
      
      function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
      }
      
      function updateThemeIcons(theme) {
        const moonIcon = '${MODERN_ICONS.moon}';
        const sunIcon = '${MODERN_ICONS.sun}';
        const icon = theme === 'dark' ? sunIcon : moonIcon;
        
        const themeIcon = document.getElementById('theme-icon');
        const headerThemeIcon = document.getElementById('header-theme-icon');
        
        if (themeIcon) themeIcon.innerHTML = icon;
        if (headerThemeIcon) headerThemeIcon.innerHTML = icon;
      }
      
      // Sidebar Management - Enhanced with global state
      function initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const profileMenu = document.getElementById('profile-menu');
        const profileDropdown = document.getElementById('profile-dropdown');
        
        // Use global state if available, otherwise load from localStorage
        const globalState = window.OAUTH_HUB_STATE;
        const isCollapsed = globalState?.sidebarCollapsed || localStorage.getItem('sidebarCollapsed') === 'true';
        
        if (isCollapsed && sidebar) {
          sidebar.classList.add('collapsed');
          updateToggleIcon(true);
        }
        
        // Toggle sidebar
        sidebarToggle?.addEventListener('click', () => {
          const isCurrentlyCollapsed = sidebar.classList.contains('collapsed');
          sidebar.classList.toggle('collapsed');
          
          // Update both localStorage and global state
          const newCollapsedState = !isCurrentlyCollapsed;
          localStorage.setItem('sidebarCollapsed', newCollapsedState);
          
          // Update global state for other pages
          if (window.OAUTH_HUB_STATE) {
            window.OAUTH_HUB_STATE.sidebarCollapsed = newCollapsedState;
          }
          
          // Update global CSS class for immediate effect on future pages
          if (newCollapsedState) {
            document.documentElement.classList.add('sidebar-collapsed');
          } else {
            document.documentElement.classList.remove('sidebar-collapsed');
          }
          
          updateToggleIcon(newCollapsedState);
        });
        
        // Mobile menu toggle
        mobileMenuToggle?.addEventListener('click', () => {
          sidebar.classList.toggle('mobile-open');
        });
        
        // Profile dropdown
        profileMenu?.addEventListener('click', (e) => {
          e.stopPropagation();
          profileDropdown.classList.toggle('hidden');
        });
        
        // Close profile dropdown on outside click
        document.addEventListener('click', () => {
          profileDropdown?.classList.add('hidden');
        });
        
        // Prevent dropdown close on dropdown click
        profileDropdown?.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
      
      function updateToggleIcon(isCollapsed) {
        const toggle = document.getElementById('sidebar-toggle');
        if (toggle) {
          toggle.innerHTML = isCollapsed ? '${MODERN_ICONS.chevronRight}' : '${MODERN_ICONS.chevronLeft}';
        }
      }
      
      // Initialize on load
      document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initSidebar();
        loadProfilePicture();
      });
      
      // Logout function
      async function logout() {
        try {
          await fetch('/logout', { 
            method: 'POST',
            credentials: 'include'
          });
        } catch (error) {
          console.error('Logout request failed:', error);
        } finally {
          localStorage.clear();
          window.location.href = '/auth';
        }
      }
    </script>
  `;
}
