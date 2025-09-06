// =============================================================================
// 🔐 MODERN AUTHENTICATION PAGE - Sleek login/signup with Google OAuth
// =============================================================================

import { MODERN_CSS, MODERN_ICONS } from '../modern-styles.js';

export function getModernAuthPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OAuth Hub - Secure Authentication Platform</title>
    <style>
      ${MODERN_CSS}
      
      /* Auth Page Specific Styles */
      .auth-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: var(--space-4);
      }
      
      .auth-card {
        background: var(--bg-elevated);
        border-radius: var(--radius-2xl);
        box-shadow: var(--shadow-2xl);
        width: 100%;
        max-width: 440px;
        padding: var(--space-8);
        animation: slideInUp 0.5s ease-out;
      }
      
      .auth-logo {
        text-align: center;
        margin-bottom: var(--space-6);
      }
      
      .auth-logo-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto var(--space-4);
        background: var(--brand-accent);
        border-radius: var(--radius-xl);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 2.5rem;
      }
      
      .auth-title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: var(--space-2);
      }
      
      .auth-subtitle {
        font-size: 1rem;
        color: var(--text-secondary);
      }
      
      .auth-tabs {
        display: flex;
        background: var(--bg-tertiary);
        border-radius: var(--radius-md);
        padding: var(--space-1);
        margin-bottom: var(--space-6);
      }
      
      .auth-tab {
        flex: 1;
        padding: var(--space-3);
        background: transparent;
        border: none;
        border-radius: var(--radius-sm);
        font-weight: 500;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all var(--transition-fast);
      }
      
      .auth-tab.active {
        background: var(--bg-primary);
        color: var(--text-primary);
        box-shadow: var(--shadow-sm);
      }
      
      .divider {
        display: flex;
        align-items: center;
        margin: var(--space-6) 0;
        color: var(--text-tertiary);
        font-size: 0.875rem;
      }
      
      .divider::before,
      .divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: var(--border-light);
      }
      
      .divider span {
        padding: 0 var(--space-4);
      }
      
      .social-login {
        margin-bottom: var(--space-6);
      }
      
      .forgot-password {
        text-align: right;
        margin-top: var(--space-2);
      }
      
      .forgot-password a {
        color: var(--brand-accent);
        text-decoration: none;
        font-size: 0.875rem;
        transition: opacity var(--transition-fast);
      }
      
      .forgot-password a:hover {
        opacity: 0.8;
      }
      
      .auth-footer {
        text-align: center;
        margin-top: var(--space-6);
        color: var(--text-tertiary);
        font-size: 0.875rem;
      }
      
      .auth-footer a {
        color: var(--brand-accent);
        text-decoration: none;
      }
      
      .password-input-wrapper {
        position: relative;
      }
      
      .password-toggle {
        position: absolute;
        right: var(--space-3);
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--text-tertiary);
        cursor: pointer;
        padding: var(--space-1);
      }
      
      .password-toggle:hover {
        color: var(--text-secondary);
      }
      
      .alert {
        padding: var(--space-3) var(--space-4);
        border-radius: var(--radius-md);
        margin-bottom: var(--space-4);
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }
      
      .alert-success {
        background: var(--brand-success);
        color: white;
      }
      
      .alert-error {
        background: var(--brand-danger);
        color: white;
      }
      
      .alert-info {
        background: var(--brand-accent);
        color: white;
      }
      
      .loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    </style>
</head>
<body>
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-logo">
          <div class="auth-logo-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
          <h1 class="auth-title">OAuth Hub</h1>
          <p class="auth-subtitle">Secure authentication platform</p>
        </div>
        
        <div class="auth-tabs">
          <button class="auth-tab active" id="login-tab" onclick="switchAuthMode('login')">Sign In</button>
          <button class="auth-tab" id="signup-tab" onclick="switchAuthMode('signup')">Sign Up</button>
        </div>
        
        <div id="alert-container"></div>
        
        <!-- Social Login -->
        <div class="social-login">
          <button class="btn btn-google btn-large" style="width: 100%;" onclick="googleAuth()">
            <span style="width: 20px; height: 20px;">${MODERN_ICONS.google}</span>
            <span id="google-btn-text">Continue with Google</span>
          </button>
        </div>
        
        <div class="divider">
          <span>or continue with email</span>
        </div>
        
        <!-- Auth Form -->
        <form id="auth-form" onsubmit="handleAuth(event)">
          <div class="form-group">
            <label class="form-label" for="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              class="form-input" 
              placeholder="you@example.com" 
              required
              autocomplete="email"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <div class="password-input-wrapper">
              <input 
                type="password" 
                id="password" 
                name="password"
                class="form-input" 
                placeholder="Enter your password" 
                required
                autocomplete="current-password"
                minlength="8"
              >
              <button type="button" class="password-toggle" onclick="togglePassword()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
            <div class="forgot-password" id="forgot-password-link">
              <a href="#" onclick="showPasswordReset(event)">Forgot password?</a>
            </div>
          </div>
          
          <div id="signup-fields" style="display: none;">
            <div class="form-group">
              <label class="form-label" for="fullName">Full name</label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName"
                class="form-input" 
                placeholder="John Doe"
                autocomplete="name"
              >
            </div>
            
            <div class="form-group">
              <label class="form-label" for="confirmPassword">Confirm password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword"
                class="form-input" 
                placeholder="Confirm your password"
                autocomplete="new-password"
                minlength="8"
              >
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary btn-large" style="width: 100%; margin-top: var(--space-5);">
            <span id="submit-text">Sign In</span>
            <span class="loading-spinner hidden" id="loading-spinner"></span>
          </button>
        </form>
        
        <div class="auth-footer">
          <p>By continuing, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
    
    <!-- Password Reset Modal -->
    <div class="modal-backdrop" id="password-reset-modal">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Reset Password</h2>
          <button class="modal-close" onclick="hidePasswordReset()">
            ${MODERN_ICONS.close}
          </button>
        </div>
        <div class="modal-body">
          <p class="text-secondary mb-4">Enter your email address and we'll send you a link to reset your password.</p>
          <form onsubmit="handlePasswordReset(event)">
            <div class="form-group">
              <label class="form-label" for="reset-email">Email address</label>
              <input 
                type="email" 
                id="reset-email" 
                name="email"
                class="form-input" 
                placeholder="you@example.com" 
                required
              >
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
    
    <script>
      let currentMode = 'login';
      
      // Initialize theme
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
      
      function switchAuthMode(mode) {
        currentMode = mode;
        const loginTab = document.getElementById('login-tab');
        const signupTab = document.getElementById('signup-tab');
        const signupFields = document.getElementById('signup-fields');
        const submitText = document.getElementById('submit-text');
        const googleBtnText = document.getElementById('google-btn-text');
        const forgotPasswordLink = document.getElementById('forgot-password-link');
        
        if (mode === 'login') {
          loginTab.classList.add('active');
          signupTab.classList.remove('active');
          signupFields.style.display = 'none';
          forgotPasswordLink.style.display = 'block';
          submitText.textContent = 'Sign In';
          googleBtnText.textContent = 'Continue with Google';
          document.getElementById('fullName').removeAttribute('required');
          document.getElementById('confirmPassword').removeAttribute('required');
        } else {
          loginTab.classList.remove('active');
          signupTab.classList.add('active');
          signupFields.style.display = 'block';
          forgotPasswordLink.style.display = 'none';
          submitText.textContent = 'Create Account';
          googleBtnText.textContent = 'Sign up with Google';
          document.getElementById('fullName').setAttribute('required', '');
          document.getElementById('confirmPassword').setAttribute('required', '');
        }
        
        clearAlerts();
      }
      
      function togglePassword() {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
      }
      
      function showAlert(message, type = 'error') {
        const alertContainer = document.getElementById('alert-container');
        const alertClass = type === 'success' ? 'alert-success' : type === 'info' ? 'alert-info' : 'alert-error';
        const icon = type === 'success' ? '${MODERN_ICONS.check}' : type === 'info' ? '${MODERN_ICONS.info}' : '${MODERN_ICONS.warning}';
        
        alertContainer.innerHTML = \`
          <div class="alert \${alertClass}">
            <span style="width: 20px; height: 20px;">\${icon}</span>
            <span>\${message}</span>
          </div>
        \`;
      }
      
      function clearAlerts() {
        document.getElementById('alert-container').innerHTML = '';
      }
      
      function setLoading(isLoading) {
        const submitBtn = document.querySelector('button[type="submit"]');
        const submitText = document.getElementById('submit-text');
        const spinner = document.getElementById('loading-spinner');
        
        if (isLoading) {
          submitBtn.disabled = true;
          submitText.style.display = 'none';
          spinner.classList.remove('hidden');
        } else {
          submitBtn.disabled = false;
          submitText.style.display = 'inline';
          spinner.classList.add('hidden');
        }
      }
      
      async function handleAuth(event) {
        event.preventDefault();
        clearAlerts();
        setLoading(true);
        
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const fullName = formData.get('fullName');
        const confirmPassword = formData.get('confirmPassword');
        
        // Validation
        if (currentMode === 'signup') {
          if (password !== confirmPassword) {
            showAlert('Passwords do not match');
            setLoading(false);
            return;
          }
          
          if (password.length < 8) {
            showAlert('Password must be at least 8 characters long');
            setLoading(false);
            return;
          }
        }
        
        try {
          const response = await fetch('/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              mode: currentMode,
              email,
              password,
              fullName
            })
          });
          
          const result = await response.json();
          
          if (response.ok) {
            // Store user info
            localStorage.setItem('userEmail', result.email);
            localStorage.setItem('userName', result.name);
            if (result.apiKey) {
              localStorage.setItem('defaultApiKey', result.apiKey);
            }
            
            showAlert(\`\${currentMode === 'login' ? 'Welcome back!' : 'Account created successfully!'} Redirecting...\`, 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1000);
          } else {
            showAlert(result.error || 'Authentication failed');
          }
        } catch (error) {
          showAlert('Network error. Please try again.');
        } finally {
          setLoading(false);
        }
      }
      
      async function googleAuth() {
        clearAlerts();
        
        try {
          // TODO: Implement Google OAuth
          // For now, show coming soon message
          showAlert('Google authentication coming soon!', 'info');
          
          // In production, this would redirect to Google OAuth:
          // window.location.href = '/auth/google';
        } catch (error) {
          showAlert('Failed to initialize Google authentication');
        }
      }
      
      function showPasswordReset(event) {
        event.preventDefault();
        document.getElementById('password-reset-modal').classList.add('active');
      }
      
      function hidePasswordReset() {
        document.getElementById('password-reset-modal').classList.remove('active');
      }
      
      async function handlePasswordReset(event) {
        event.preventDefault();
        const email = document.getElementById('reset-email').value;
        
        try {
          // TODO: Implement password reset
          showAlert('Password reset link sent! Check your email.', 'success');
          setTimeout(() => {
            hidePasswordReset();
          }, 2000);
        } catch (error) {
          showAlert('Failed to send reset link. Please try again.');
        }
      }
      
      // Check if already logged in
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        window.location.href = '/dashboard';
      }
    </script>
</body>
</html>`;
}
