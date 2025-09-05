// =============================================================================
// 🎨 UNIFIED MODERN DESIGN SYSTEM
// =============================================================================

export const UNIFIED_CSS = `
  :root {
    /* Modern Color Palette */
    --primary-50: #eff6ff;
    --primary-100: #dbeafe;
    --primary-200: #bfdbfe;
    --primary-300: #93c5fd;
    --primary-400: #60a5fa;
    --primary-500: #3b82f6;
    --primary-600: #2563eb;
    --primary-700: #1d4ed8;
    --primary-800: #1e40af;
    --primary-900: #1e3a8a;
    
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;
    
    --success-50: #ecfdf5;
    --success-500: #10b981;
    --success-600: #065f46;
    --success-700: #064e3b;
    --warning-50: #fffbeb;
    --warning-200: #fed7aa;
    --warning-500: #f59e0b;
    --warning-800: #92400e;
    --danger-500: #ef4444;
    
    /* Typography */
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: 'JetBrains Mono', Consolas, 'Courier New', monospace;
    
    /* Spacing */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --space-6: 1.5rem;
    --space-7: 1.75rem;
    --space-8: 2rem;
    --space-10: 2.5rem;
    --space-12: 3rem;
    --space-16: 4rem;
    --space-20: 5rem;
    
    /* Border radius */
    --radius-sm: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-full: 9999px;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    
    /* Layout */
    --max-width: 1280px;
    --sidebar-width: 260px;
    --header-height: 64px;
    
    /* Transitions */
    --transition-fast: 150ms ease;
    --transition-base: 200ms ease;
    --transition-slow: 300ms ease;
    
    /* Z-index */
    --z-dropdown: 1000;
    --z-modal: 1050;
    --z-toast: 1100;
    
    /* Borders */
    --border-color: var(--gray-200);
  }

  /* Reset & Base */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-sans);
    color: var(--gray-900);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Layout Components */
  .container {
    width: 100%;
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 var(--space-6);
  }

  .app-layout {
    min-height: 100vh;
    background: white;
  }

  /* Header */
  .header {
    background: white;
    border-bottom: 1px solid var(--border-color);
    height: var(--header-height);
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: var(--shadow-sm);
  }

  .header-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-6);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--gray-900);
    text-decoration: none;
  }

  /* Navigation */
  .nav {
    display: flex;
    gap: var(--space-2);
  }

  .nav-link {
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-md);
    color: var(--gray-600);
    text-decoration: none;
    font-weight: 500;
    transition: all var(--transition-base);
  }

  .nav-link:hover {
    background: var(--gray-100);
    color: var(--gray-900);
  }

  .nav-link.active {
    background: var(--primary-100);
    color: var(--primary-700);
  }

  /* Main Content */
  .main {
    padding: var(--space-8) var(--space-6);
    min-height: calc(100vh - var(--header-height));
  }

  .page-header {
    margin-bottom: var(--space-8);
  }

  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: var(--space-2);
  }

  .page-description {
    font-size: 1.125rem;
    color: var(--gray-600);
  }

  /* Cards */
  .card {
    background: white;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    padding: var(--space-6);
    margin-bottom: var(--space-6);
    box-shadow: var(--shadow-sm);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--border-color);
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--gray-900);
  }

  /* Forms */
  .form-group {
    margin-bottom: var(--space-5);
  }

  .form-label {
    display: block;
    font-weight: 500;
    color: var(--gray-700);
    margin-bottom: var(--space-2);
    font-size: 0.875rem;
  }

  .form-input {
    width: 100%;
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--gray-300);
    border-radius: var(--radius-md);
    font-size: 1rem;
    transition: all var(--transition-fast);
    background: white;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-5);
    border-radius: var(--radius-md);
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    transition: all var(--transition-base);
    cursor: pointer;
    border: none;
    text-decoration: none;
  }

  .btn-lg {
    padding: var(--space-4) var(--space-6);
    font-size: 1rem;
  }

  .btn-primary {
    background: var(--primary-600);
    color: white;
  }

  .btn-primary:hover {
    background: var(--primary-700);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .btn-secondary {
    background: var(--gray-200);
    color: var(--gray-700);
  }

  .btn-secondary:hover {
    background: var(--gray-300);
  }

  .btn-success {
    background: var(--success-500);
    color: white;
  }

  .btn-success:hover {
    background: var(--success-600);
    transform: translateY(-1px);
  }

  /* Modals */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: var(--z-modal);
  }

  .modal-overlay.show {
    display: flex;
  }

  .modal {
    background: white;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    padding: var(--space-6);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-5);
  }

  .modal-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--gray-900);
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--gray-400);
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
  }

  .modal-close:hover {
    background: var(--gray-100);
    color: var(--gray-600);
  }

  /* Utilities */
  .text-center {
    text-align: center;
  }

  .flex {
    display: flex;
  }

  .gap-4 {
    gap: var(--space-4);
  }

  .hidden {
    display: none !important;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .nav {
      flex-direction: column;
      gap: var(--space-1);
    }
    
    .main {
      padding: var(--space-4);
    }
    
    .modal {
      width: 95%;
      padding: var(--space-4);
    }
  }
`;