// =============================================================================
// 🔐 ULTRA-MODERN AUTHENTICATION PAGE - ClickUp/Deepgram inspired
// =============================================================================

import { MODERN_CSS, MODERN_ICONS, THEME_PREVENTION_SCRIPT } from '../styles.js';
import { getAuthManagerScript } from '../../lib/auth/auth-manager.js';

export function getModernAuthPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OAuth Hub - Secure Authentication Platform</title>
    <style>
      ${MODERN_CSS}
      
      /* Reset and Base Styles */
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', system-ui, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        color: #333;
      }
      
      [data-theme="dark"] body {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        color: #fff;
      }
      
      /* Main Container */
      .auth-container {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        padding: 32px;
        text-align: center;
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      [data-theme="dark"] .auth-container {
        background: rgba(28, 28, 30, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      }
      
      /* Logo */
      .auth-logo {
        margin-bottom: 24px;
      }
      
      .logo-container {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;
      }
      
      .logo-icon {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
      }
      
      .logo-icon svg {
        width: 18px;
        height: 18px;
        color: white;
      }
      
      .logo-text {
        font-size: 22px;
        font-weight: 700;
        color: #1d1d1f;
        letter-spacing: -0.3px;
      }
      
      [data-theme="dark"] .logo-text {
        color: #f5f5f7;
      }
      
      .logo-tagline {
        font-size: 13px;
        color: #86868b;
        font-weight: 400;
        margin-top: 2px;
      }
      
      /* Header */
      .auth-header {
        margin-bottom: 20px;
      }
      
      .auth-title {
        font-size: 24px;
        font-weight: 700;
        color: #1d1d1f;
        margin-bottom: 4px;
        letter-spacing: -0.3px;
      }
      
      [data-theme="dark"] .auth-title {
        color: #f5f5f7;
      }
      
      .auth-subtitle {
        font-size: 14px;
        color: #86868b;
        font-weight: 400;
      }
      
      /* Tab Navigation */
      .auth-tabs {
        display: flex;
        background: #f2f2f7;
        border-radius: 10px;
        padding: 3px;
        margin-bottom: 16px;
        position: relative;
      }
      
      [data-theme="dark"] .auth-tabs {
        background: #2c2c2e;
      }
      
      .auth-tab {
        flex: 1;
        padding: 8px 16px;
        background: none;
        border: none;
        border-radius: 7px;
        font-size: 14px;
        font-weight: 600;
        color: #86868b;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        z-index: 2;
      }
      
      .auth-tab.active {
        color: #1d1d1f;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      }
      
      [data-theme="dark"] .auth-tab.active {
        color: #f5f5f7;
        background: #3a3a3c;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      }
      
      /* Social Auth Buttons */
      .social-auth {
        margin-bottom: 16px;
      }
      
      .social-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 10px 16px;
        background: #fff;
        border: 1px solid #e5e5e7;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #1d1d1f;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 8px;
      }
      
      [data-theme="dark"] .social-btn {
        background: #2c2c2e;
        border-color: #48484a;
        color: #f5f5f7;
      }
      
      .social-btn:hover {
        background: #f8f9fa;
        border-color: #007AFF;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 122, 255, 0.15);
      }
      
      [data-theme="dark"] .social-btn:hover {
        background: #3a3a3c;
        border-color: #007AFF;
      }
      
      .social-btn:last-child {
        margin-bottom: 0;
      }
      
      .social-btn svg {
        width: 16px;
        height: 16px;
      }
      
      /* Divider */
      .divider {
        display: flex;
        align-items: center;
        margin: 16px 0;
        color: #86868b;
        font-size: 12px;
        font-weight: 500;
      }
      
      .divider::before,
      .divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #e5e5e7;
      }
      
      [data-theme="dark"] .divider::before,
      [data-theme="dark"] .divider::after {
        background: #48484a;
      }
      
      .divider span {
        padding: 0 12px;
      }
      
      /* Forms */
      .auth-form {
        display: none;
        text-align: left;
      }
      
      .auth-form.active {
        display: block;
      }
      
      .form-group {
        margin-bottom: 16px;
      }
      
      .form-label {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: #1d1d1f;
        margin-bottom: 6px;
      }
      
      [data-theme="dark"] .form-label {
        color: #f5f5f7;
      }
      
      .form-input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #e5e5e7;
        border-radius: 8px;
        font-size: 14px;
        background: #fff;
        color: #1d1d1f;
        transition: all 0.2s ease;
        outline: none;
      }
      
      [data-theme="dark"] .form-input {
        background: #2c2c2e;
        border-color: #48484a;
        color: #f5f5f7;
      }
      
      .form-input:focus {
        border-color: #007AFF;
        box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.1);
      }
      
      .form-input::placeholder {
        color: #86868b;
      }
      
      .password-wrapper {
        position: relative;
      }
      
      .password-toggle {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #86868b;
        cursor: pointer;
        padding: 2px;
        transition: color 0.2s ease;
      }
      
      .password-toggle:hover {
        color: #007AFF;
      }
      
      /* Form Footer */
      .form-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 8px;
        font-size: 12px;
      }
      
      .remember-me {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
      }
      
      .remember-me input {
        width: 14px;
        height: 14px;
        cursor: pointer;
      }
      
      .remember-me label {
        color: #86868b;
        cursor: pointer;
        margin: 0;
      }
      
      .forgot-link {
        color: #007AFF;
        text-decoration: none;
        font-weight: 500;
      }
      
      .forgot-link:hover {
        opacity: 0.8;
      }
      
      /* Submit Button */
      .submit-btn {
        width: 100%;
        padding: 10px 16px;
        background: #007AFF;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-top: 16px;
      }
      
      .submit-btn:hover {
        background: #0056CC;
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
      }
      
      .submit-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
      
      /* Messages */
      .message {
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        margin-bottom: 12px;
        display: none;
      }
      
      .message.error {
        background: rgba(255, 59, 48, 0.1);
        color: #FF3B30;
        border: 1px solid rgba(255, 59, 48, 0.2);
      }
      
      .message.success {
        background: rgba(52, 199, 89, 0.1);
        color: #34C759;
        border: 1px solid rgba(52, 199, 89, 0.2);
      }
      
      /* Footer */
      .auth-footer {
        text-align: center;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid #e5e5e7;
        color: #86868b;
        font-size: 11px;
        line-height: 1.4;
      }
      
      [data-theme="dark"] .auth-footer {
        border-color: #48484a;
      }
      
      .auth-footer a {
        color: #007AFF;
        text-decoration: none;
        font-weight: 500;
      }
      
      .auth-footer a:hover {
        opacity: 0.8;
      }
      
      /* Theme Toggle */
      .theme-toggle {
        position: fixed;
        top: 24px;
        right: 24px;
        width: 44px;
        height: 44px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: 100;
      }
      
      .theme-toggle:hover {
        transform: scale(1.05);
        background: rgba(255, 255, 255, 0.15);
      }
      
      .theme-toggle svg {
        width: 20px;
        height: 20px;
        color: #fff;
      }
      
      [data-theme="dark"] .theme-toggle svg {
        color: #f5f5f7;
      }
      
      /* Loading Animation */
      .loading {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      /* Sign Up Link */
      .signup-prompt {
        text-align: center;
        margin-top: 24px;
        font-size: 15px;
        color: #86868b;
      }
      
      .signup-prompt a {
        color: #007AFF;
        text-decoration: none;
        font-weight: 600;
        margin-left: 4px;
      }
      
      .signup-prompt a:hover {
        opacity: 0.8;
      }
      
      /* Responsive */
      @media (max-width: 480px) {
        .auth-container {
          padding: 32px 24px;
          margin: 16px;
        }
        
        .auth-title {
          font-size: 28px;
        }
        
        .logo-text {
          font-size: 24px;
        }
        
        .theme-toggle {
          top: 16px;
          right: 16px;
        }
      }
    </style>
</head>
<body>
    <!-- Theme Toggle -->
    <button class="theme-toggle" onclick="toggleTheme()" title="Toggle theme">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </button>

    <div class="auth-container">
      <!-- Logo -->
      <div class="auth-logo">
        <div class="logo-container">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7L3 19L12 22L21 19L22 7L12 2Z" stroke="currentColor" stroke-width="0.5" fill="none"/>
              <circle cx="12" cy="10" r="2.5" fill="currentColor"/>
              <path d="M8 14C8 16.2 9.8 18 12 18S16 16.2 16 14" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>
              <path d="M6 12L12 10L18 12" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round"/>
              <circle cx="6" cy="12" r="1" fill="currentColor"/>
              <circle cx="18" cy="12" r="1" fill="currentColor"/>
            </svg>
          </div>
          <span class="logo-text">OAuth Hub</span>
        </div>
        <p class="logo-tagline">Secure authentication platform</p>
      </div>
      
      <!-- Header -->
      <div class="auth-header">
        <h1 class="auth-title" id="auth-title">Welcome back!</h1>
        <p class="auth-subtitle" id="auth-subtitle">Sign in to your account</p>
      </div>
      
      <!-- Tab Navigation -->
      <div class="auth-tabs">
        <button class="auth-tab active" onclick="switchTab('signin')">Log in</button>
        <button class="auth-tab" onclick="switchTab('signup')">Sign up</button>
      </div>
      
      <!-- Messages -->
      <div id="error-message" class="message error"></div>
      <div id="success-message" class="message success"></div>
      
      <!-- Social Auth -->
      <div class="social-auth">
        <button class="social-btn" onclick="handleGoogleAuth()">
          ${MODERN_ICONS.google}
          <span>Continue with Google</span>
        </button>
        <button class="social-btn" onclick="handleGitHubAuth()">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>Continue with GitHub</span>
        </button>
      </div>
      
      <!-- Divider -->
      <div class="divider">
        <span>OR</span>
      </div>
      
      <!-- Sign In Form -->
      <form id="signin-form" class="auth-form active" onsubmit="handleSignIn(event)">
        <div class="form-group">
          <label class="form-label" for="signin-email">Work Email</label>
          <input 
            type="email" 
            id="signin-email" 
            class="form-input" 
            placeholder="Enter your work email"
            required
            autocomplete="email"
          />
            </div>
        
        <div class="form-group">
          <label class="form-label" for="signin-password">Password</label>
          <div class="password-wrapper">
            <input 
              type="password" 
              id="signin-password" 
              class="form-input" 
              placeholder="Enter password"
              required
              autocomplete="current-password"
            />
            <button type="button" class="password-toggle" onclick="togglePassword('signin-password')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
          <div class="form-footer">
            <div class="remember-me">
              <input type="checkbox" id="remember" />
              <label for="remember">Remember me</label>
                </div>
            <a href="#" class="forgot-link" onclick="handleForgotPassword()">Forgot Password?</a>
                        </div>
                    </div>
                    
        <button type="submit" class="submit-btn">
          Log in
        </button>
      </form>
      
      <!-- Sign Up Form -->
      <form id="signup-form" class="auth-form" onsubmit="handleSignUp(event)">
                        <div class="form-group">
          <label class="form-label" for="signup-name">Full name</label>
          <input 
            type="text" 
            id="signup-name" 
            class="form-input" 
            placeholder="Enter your full name"
            required
            autocomplete="name"
          />
                        </div>
                        
                        <div class="form-group">
          <label class="form-label" for="signup-email">Work Email</label>
          <input 
            type="email" 
            id="signup-email" 
            class="form-input" 
            placeholder="Enter your work email"
            required
            autocomplete="email"
          />
                        </div>
                        
                            <div class="form-group">
          <label class="form-label" for="signup-password">Password</label>
          <div class="password-wrapper">
            <input 
              type="password" 
              id="signup-password" 
              class="form-input" 
              placeholder="Must contain minimum 8 characters and 1 number"
              required
              minlength="8"
              autocomplete="new-password"
            />
            <button type="button" class="password-toggle" onclick="togglePassword('signup-password')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
                            </div>
                        </div>
                        
        <button type="submit" class="submit-btn">
          Sign up
                        </button>
                    </form>
                    
      <!-- Footer -->
      <div class="auth-footer">
        This site is protected by reCAPTCHA and the Google 
        <a href="/privacy">Privacy Policy</a> and 
        <a href="/terms">Terms of Service</a> apply.
            </div>
    </div>
    
    <script>
      // PREVENT DARK MODE FLASH - Apply theme IMMEDIATELY before any content renders
      (function() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
      })();
      
      // Theme toggle
      function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      }
      
      // Switch between sign in and sign up
      function switchTab(tab) {
        const tabs = document.querySelectorAll('.auth-tab');
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');
        const authTitle = document.getElementById('auth-title');
        const authSubtitle = document.getElementById('auth-subtitle');
        
        tabs.forEach(t => t.classList.remove('active'));
        
        if (tab === 'signin') {
          tabs[0].classList.add('active');
          signinForm.classList.add('active');
          signupForm.classList.remove('active');
          authTitle.textContent = 'Welcome back!';
          authSubtitle.textContent = 'Sign in to your account';
            } else {
          tabs[1].classList.add('active');
          signupForm.classList.add('active');
          signinForm.classList.remove('active');
          authTitle.textContent = 'Sign up';
          authSubtitle.textContent = 'Create your account';
        }
        
        hideMessages();
      }
      
      // Toggle password visibility
      function togglePassword(inputId) {
        const input = document.getElementById(inputId);
        input.type = input.type === 'password' ? 'text' : 'password';
      }
      
      // Show/hide messages
      function showError(message) {
        const errorEl = document.getElementById('error-message');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        document.getElementById('success-message').style.display = 'none';
      }
      
      function showSuccess(message) {
        const successEl = document.getElementById('success-message');
        successEl.textContent = message;
        successEl.style.display = 'block';
        document.getElementById('error-message').style.display = 'none';
      }
      
      function hideMessages() {
        document.getElementById('error-message').style.display = 'none';
        document.getElementById('success-message').style.display = 'none';
      }
      
      // Handle sign in
      async function handleSignIn(event) {
        event.preventDefault();
        hideMessages();
        
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        const button = event.target.querySelector('.submit-btn');
        
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> Logging in...';
        
        try {
          const response = await fetch('/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ mode: 'login', email, password })
          });
          
          const result = await response.json();
          
          if (response.ok) {
            localStorage.setItem('userEmail', result.email);
            localStorage.setItem('userName', result.name);
            if (result.apiKey) {
              localStorage.setItem('defaultApiKey', result.apiKey);
            }
            
            showSuccess('Welcome back! Redirecting...');
            setTimeout(() => window.location.href = '/dashboard', 1000);
          } else {
            showError(result.error || 'Invalid email or password');
          }
        } catch (error) {
          showError('Network error. Please try again.');
        } finally {
          button.disabled = false;
          button.innerHTML = 'Log in';
        }
      }
      
      // Handle sign up
      async function handleSignUp(event) {
        event.preventDefault();
        hideMessages();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const button = event.target.querySelector('.submit-btn');
        
        // Basic password validation
        if (password.length < 8 || !/\\d/.test(password)) {
          showError('Password must contain minimum 8 characters and 1 number');
          return;
        }
        
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> Creating account...';
            
            try {
                const response = await fetch('/auth', {
                    method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ mode: 'signup', email, password, fullName: name })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('userEmail', result.email);
                    localStorage.setItem('userName', result.name);
                    if (result.apiKey) {
                        localStorage.setItem('defaultApiKey', result.apiKey);
                    }
                    
            showSuccess('Account created! Redirecting...');
            setTimeout(() => window.location.href = '/dashboard', 1000);
                } else {
            showError(result.error || 'Failed to create account');
                }
            } catch (error) {
          showError('Network error. Please try again.');
        } finally {
          button.disabled = false;
          button.innerHTML = 'Sign up';
        }
      }
      
      // Handle Google auth
      function handleGoogleAuth() {
        hideMessages();
        
        try {
          // Redirect to Google OAuth
          window.location.href = '/auth/google';
        } catch (error) {
          showError('Failed to initialize Google authentication');
        }
      }
      
      // Handle GitHub auth
      function handleGitHubAuth() {
        hideMessages();
        
        try {
          // Redirect to GitHub OAuth
          window.location.href = '/auth/github';
        } catch (error) {
          showError('Failed to initialize GitHub authentication');
        }
      }
      
      // Handle forgot password
      function handleForgotPassword() {
        showError('Password reset coming soon!');
        return false;
      }
      
      // Authentication is now handled by AuthManager
      
    </script>
    
    ${getAuthManagerScript()}
</body>
</html>`;
}
