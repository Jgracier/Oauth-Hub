// =============================================================================
// 🎨 MODERN DESIGN SYSTEM - Tesla/Apple Inspired
// =============================================================================

// Global initialization script - prevents flashing and jumping
export const GLOBAL_INIT_SCRIPT = `
<script>
  // GLOBAL STATE MANAGEMENT - Prevents flashing, jumping, and reloading
  (function() {
    // 1. PREVENT DARK MODE FLASH - Apply theme IMMEDIATELY
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // 2. PREVENT SIDEBAR JUMP - Apply sidebar state immediately
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) {
      document.documentElement.classList.add('sidebar-collapsed');
    }
    
    // 3. CACHE USER DATA - Store in sessionStorage for instant loading
    const cachedProfilePic = sessionStorage.getItem('profilePicture');
    const cachedUserName = localStorage.getItem('userName');
    const cachedUserEmail = localStorage.getItem('userEmail');
    const cachedInitials = sessionStorage.getItem('userInitials');
    
    // Store global user state for instant access
    window.OAUTH_HUB_STATE = {
      theme: savedTheme,
      sidebarCollapsed: isCollapsed,
      profilePicture: cachedProfilePic,
      userName: cachedUserName,
      userEmail: cachedUserEmail,
      userInitials: cachedInitials,
      initialized: false
    };
    
    // 4. APPLY PROFILE PICTURE IMMEDIATELY when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
      // Apply cached profile picture immediately
      if (cachedProfilePic) {
        const avatarElements = document.querySelectorAll('.profile-avatar');
        avatarElements.forEach(el => {
          el.innerHTML = \`<img src="\${cachedProfilePic}" alt="Profile" style="width: 100%; height: 100%; border-radius: inherit; object-fit: cover;">\`;
        });
      } else if (cachedInitials) {
        const avatarElements = document.querySelectorAll('.profile-avatar');
        avatarElements.forEach(el => {
          el.textContent = cachedInitials;
        });
      }
      
      // Apply cached user info immediately
      if (cachedUserName) {
        document.querySelectorAll('.profile-name').forEach(el => el.textContent = cachedUserName);
      }
      if (cachedUserEmail) {
        document.querySelectorAll('.profile-email').forEach(el => el.textContent = cachedUserEmail);
      }
    });
  })();
</script>`;

// Backward compatibility
export const THEME_PREVENTION_SCRIPT = GLOBAL_INIT_SCRIPT;

export const MODERN_CSS = `
  /* Import modern fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&display=swap');

  :root {
    /* Modern Neutral Palette - Auth Page Inspired */
    --neutral-0: #ffffff;
    --neutral-50: #fafafa;
    --neutral-100: #f5f5f5;
    --neutral-200: #e5e5e7;
    --neutral-300: #d2d2d7;
    --neutral-400: #86868b;
    --neutral-500: #86868b;
    --neutral-600: #48484a;
    --neutral-700: #3a3a3c;
    --neutral-800: #2c2c2e;
    --neutral-900: #1c1c1e;
    --neutral-950: #000000;
    
    /* Brand Colors - Matching Auth Page */
    --brand-primary: #1d1d1f;
    --brand-accent: #007AFF;
    --brand-success: #34C759;
    --brand-warning: #FF9500;
    --brand-danger: #FF3B30;
    
    /* Semantic Colors */
    --text-primary: var(--neutral-900);
    --text-secondary: var(--neutral-600);
    --text-tertiary: var(--neutral-500);
    --text-inverse: var(--neutral-0);
    
    --bg-primary: var(--neutral-0);
    --bg-secondary: var(--neutral-50);
    --bg-tertiary: var(--neutral-100);
    --bg-elevated: var(--neutral-0);
    --bg-overlay: rgba(0, 0, 0, 0.5);
    
    --border-light: var(--neutral-200);
    --border-medium: var(--neutral-300);
    --border-dark: var(--neutral-400);
    
    /* Typography */
    --font-primary: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
    --font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
    
    /* Spacing Scale */
    --space-0: 0;
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.5rem;
    --space-6: 2rem;
    --space-7: 3rem;
    --space-8: 4rem;
    --space-9: 6rem;
    --space-10: 8rem;
    
    /* Sizing */
    --sidebar-width-expanded: 280px;
    --sidebar-width-collapsed: 80px;
    --header-height: 60px;
    --container-max: 1440px;
    
    /* Border Radius */
    --radius-sm: 6px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-2xl: 24px;
    --radius-full: 9999px;
    
    /* Shadows */
    --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.12);
    --shadow-2xl: 0 24px 48px rgba(0, 0, 0, 0.15);
    
    /* Transitions */
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slower: 500ms cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Z-index */
    --z-base: 0;
    --z-dropdown: 1000;
    --z-sticky: 1100;
    --z-fixed: 1200;
    --z-modal-backdrop: 1300;
    --z-modal: 1400;
    --z-popover: 1500;
    --z-tooltip: 1600;
  }

  /* Dark mode variables - Auth Page Inspired */
  [data-theme="dark"] {
    --text-primary: #f5f5f7;
    --text-secondary: var(--neutral-400);
    --text-tertiary: var(--neutral-500);
    --text-inverse: var(--neutral-900);
    
    --bg-primary: #1c1c1e;
    --bg-secondary: #2c2c2e;
    --bg-tertiary: #3a3a3c;
    --bg-elevated: #2c2c2e;
    
    --border-light: #48484a;
    --border-medium: #3a3a3c;
    --border-dark: var(--neutral-600);
    
    --brand-primary: #f5f5f7;
  }

  /* Reset */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: var(--font-primary);
    font-weight: 400;
    line-height: 1.5;
    color: var(--text-primary);
    background: var(--bg-primary);
    overflow-x: hidden;
  }

  /* App Layout */
  .app {
    display: flex;
    min-height: 100vh;
    position: relative;
  }

  /* Sidebar */
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: var(--sidebar-width-expanded);
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-light);
    display: flex;
    flex-direction: column;
    transition: width var(--transition-base);
    z-index: var(--z-fixed);
  }
  
  /* Global sidebar collapsed state - prevents jumping on page load */
  .sidebar-collapsed .sidebar {
    width: var(--sidebar-width-collapsed);
  }
  
  .sidebar-collapsed .main-wrapper {
    margin-left: var(--sidebar-width-collapsed);
  }

  .sidebar.collapsed {
    width: var(--sidebar-width-collapsed);
  }

  .sidebar-header {
    padding: var(--space-5);
    border-bottom: 1px solid var(--border-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--header-height);
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    text-decoration: none;
    color: var(--text-primary);
    font-weight: 600;
    font-size: 1.25rem;
    transition: opacity var(--transition-fast);
  }

  .sidebar-logo-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--brand-accent);
    color: white;
    border-radius: var(--radius-md);
    flex-shrink: 0;
  }

  .sidebar-toggle {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }

  .sidebar-toggle:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-4);
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: var(--text-secondary);
    font-weight: 500;
    transition: all var(--transition-fast);
    position: relative;
    overflow: hidden;
  }

  .nav-item:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  .nav-item.active {
    background: var(--brand-accent);
    color: white;
  }

  .nav-item-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .nav-item-text {
    transition: opacity var(--transition-fast);
  }

  .sidebar.collapsed .nav-item-text,
  .sidebar.collapsed .sidebar-logo span {
    opacity: 0;
    width: 0;
    overflow: hidden;
  }

  .sidebar-footer {
    padding: var(--space-4);
    border-top: 1px solid var(--border-light);
  }

  .profile-menu {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .profile-menu:hover {
    background: var(--bg-tertiary);
  }

  .profile-avatar {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    background: var(--brand-accent);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
  }

  .profile-info {
    flex: 1;
    min-width: 0;
  }

  .profile-name {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .profile-email {
    font-size: 0.75rem;
    color: var(--text-tertiary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Main Content */
  .main-wrapper {
    flex: 1;
    margin-left: var(--sidebar-width-expanded);
    transition: margin-left var(--transition-base);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .sidebar.collapsed ~ .main-wrapper {
    margin-left: var(--sidebar-width-collapsed);
  }

  .main-header {
    height: var(--header-height);
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-light);
    display: flex;
    align-items: center;
    padding: 0 var(--space-6);
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
  }

  .main-content {
    flex: 1;
    padding: var(--space-6);
    max-width: var(--container-max);
    width: 100%;
    margin: 0 auto;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    color: var(--text-primary);
  }

  h1 { font-size: 2.5rem; margin-bottom: var(--space-4); }
  h2 { font-size: 2rem; margin-bottom: var(--space-3); }
  h3 { font-size: 1.5rem; margin-bottom: var(--space-3); }
  h4 { font-size: 1.25rem; margin-bottom: var(--space-2); }
  h5 { font-size: 1.125rem; margin-bottom: var(--space-2); }
  h6 { font-size: 1rem; margin-bottom: var(--space-2); }

  p {
    margin-bottom: var(--space-4);
    color: var(--text-secondary);
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-5);
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1;
    border-radius: var(--radius-md);
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: all var(--transition-fast);
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: var(--brand-accent);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #0077ed;
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .btn-secondary {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-light);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--bg-secondary);
    border-color: var(--border-medium);
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-secondary);
  }

  .btn-ghost:hover:not(:disabled) {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  .btn-danger {
    background: var(--brand-danger);
    color: white;
  }

  .btn-danger:hover:not(:disabled) {
    background: #ff453a;
    transform: translateY(-1px);
  }

  .btn-large {
    padding: var(--space-4) var(--space-6);
    font-size: 1rem;
  }

  .btn-small {
    padding: var(--space-2) var(--space-3);
    font-size: 0.75rem;
  }

  .btn-icon {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: var(--radius-full);
  }

  .btn-google {
    background: white;
    color: var(--text-primary);
    border: 1px solid var(--border-light);
    gap: var(--space-3);
  }

  .btn-google:hover:not(:disabled) {
    background: var(--bg-secondary);
    border-color: var(--border-medium);
  }

  /* Forms */
  .form-group {
    margin-bottom: var(--space-5);
  }

  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
    margin-bottom: var(--space-2);
  }

  .form-input {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    font-family: inherit;
    font-size: 1rem;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: all var(--transition-fast);
  }

  .form-input:focus {
    outline: none;
    border-color: var(--brand-accent);
    box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
  }

  .form-input:disabled {
    background: var(--bg-tertiary);
    cursor: not-allowed;
  }

  .form-error {
    font-size: 0.75rem;
    color: var(--brand-danger);
    margin-top: var(--space-1);
  }

  /* Cards */
  .card {
    background: var(--bg-elevated);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    box-shadow: var(--shadow-sm);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-5);
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  /* Stats Cards */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-5);
    margin-bottom: var(--space-7);
  }

  .stat-card {
    background: var(--bg-elevated);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    transition: all var(--transition-fast);
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .stat-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: var(--space-3);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
    font-size: 1.5rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--text-tertiary);
    margin-top: var(--space-1);
  }

  .stat-action {
    margin-top: var(--space-4);
  }

  /* Modals */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal-backdrop);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-base);
  }

  .modal-backdrop.active {
    opacity: 1;
    visibility: visible;
  }

  .modal {
    background: var(--bg-elevated);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-2xl);
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transform: scale(0.9);
    opacity: 0;
    transition: all var(--transition-base);
  }

  .modal-backdrop.active .modal {
    transform: scale(1);
    opacity: 1;
  }

  .modal-header {
    padding: var(--space-6);
    border-bottom: 1px solid var(--border-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .modal-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }

  .modal-close:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  .modal-body {
    padding: var(--space-6);
    flex: 1;
    overflow-y: auto;
  }

  .modal-footer {
    padding: var(--space-6);
    border-top: 1px solid var(--border-light);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-3);
  }

  /* Tables */
  .table-container {
    overflow-x: auto;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table thead {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-light);
  }

  .table th {
    text-align: left;
    padding: var(--space-3) var(--space-4);
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .table td {
    padding: var(--space-4);
    border-bottom: 1px solid var(--border-light);
    color: var(--text-secondary);
  }

  .table tbody tr:last-child td {
    border-bottom: none;
  }

  .table tbody tr:hover {
    background: var(--bg-secondary);
  }

  /* Badges */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: var(--space-1) var(--space-2);
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: var(--radius-sm);
    line-height: 1;
  }

  .badge-primary {
    background: var(--brand-accent);
    color: white;
  }

  .badge-success {
    background: var(--brand-success);
    color: white;
  }

  .badge-warning {
    background: var(--brand-warning);
    color: white;
  }

  .badge-danger {
    background: var(--brand-danger);
    color: white;
  }

  .badge-neutral {
    background: var(--bg-tertiary);
    color: var(--text-secondary);
  }

  /* Loading States */
  .skeleton {
    background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: var(--radius-sm);
  }

  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Utilities */
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .text-muted { color: var(--text-tertiary); }
  .text-small { font-size: 0.875rem; }
  .text-tiny { font-size: 0.75rem; }

  .mt-1 { margin-top: var(--space-1); }
  .mt-2 { margin-top: var(--space-2); }
  .mt-3 { margin-top: var(--space-3); }
  .mt-4 { margin-top: var(--space-4); }
  .mt-5 { margin-top: var(--space-5); }
  .mt-6 { margin-top: var(--space-6); }

  .mb-1 { margin-bottom: var(--space-1); }
  .mb-2 { margin-bottom: var(--space-2); }
  .mb-3 { margin-bottom: var(--space-3); }
  .mb-4 { margin-bottom: var(--space-4); }
  .mb-5 { margin-bottom: var(--space-5); }
  .mb-6 { margin-bottom: var(--space-6); }

  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .justify-between { justify-content: space-between; }
  .gap-1 { gap: var(--space-1); }
  .gap-2 { gap: var(--space-2); }
  .gap-3 { gap: var(--space-3); }
  .gap-4 { gap: var(--space-4); }
  .gap-5 { gap: var(--space-5); }

  .hidden { display: none !important; }
  .invisible { visibility: hidden; }

  /* Responsive */
  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-100%);
    }
    
    .sidebar.mobile-open {
      transform: translateX(0);
    }
    
    .main-wrapper {
      margin-left: 0;
    }
    
    .sidebar.collapsed ~ .main-wrapper {
      margin-left: 0;
    }
    
    .main-content {
      padding: var(--space-4);
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .modal {
      max-width: 100%;
      width: 100%;
      height: 100%;
      max-height: 100%;
      border-radius: 0;
    }
  }

  /* Dark mode specific */
  [data-theme="dark"] {
    color-scheme: dark;
  }

  [data-theme="dark"] .btn-google {
    background: var(--bg-tertiary);
    border-color: var(--border-medium);
  }

  [data-theme="dark"] .btn-google:hover {
    background: var(--bg-secondary);
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--border-dark);
    border-radius: var(--radius-sm);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--text-tertiary);
  }
`;

export const MODERN_ICONS = {
  // OAuth Hub Logo
  logo: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7L3 19L12 22L21 19L22 7L12 2Z" stroke="currentColor" stroke-width="0.5" fill="none"/>
    <circle cx="12" cy="10" r="2.5" fill="currentColor"/>
    <path d="M8 14C8 16.2 9.8 18 12 18S16 16.2 16 14" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M6 12L12 10L18 12" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round"/>
    <circle cx="6" cy="12" r="1" fill="currentColor"/>
    <circle cx="18" cy="12" r="1" fill="currentColor"/>
  </svg>`,

  // Navigation Icons
  dashboard: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
  
  apps: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>`,
  
  keys: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`,
  
  analytics: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
  
  creditCard: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`,
  
  docs: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  
  settings: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
  
  profile: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  
  // UI Icons
  menu: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
  
  close: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  
  chevronLeft: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
  
  chevronRight: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
  
  chevronDown: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  
  plus: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
  
  search: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>`,
  
  filter: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
  
  edit: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  
  trash: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  
  copy: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  
  check: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  
  info: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  
  warning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  
  logout: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`,
  
  moon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
  
  sun: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
  
  google: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`,
};
