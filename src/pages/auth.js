// =============================================================================
// 🔐 AUTHENTICATION PAGE - Login & Signup
// =============================================================================

export function getAuthPage(UNIFIED_CSS) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - OAuth Hub</title>
    <style>${UNIFIED_CSS}</style>
</head>
<body>
    <div class="app-layout">
        <header class="header">
            <div class="header-content">
                <a href="/" class="logo">
                    <span style="font-size: 1.5rem;">🔐</span>
                    OAuth Hub
                </a>
            </div>
        </header>
        
        <main class="main">
            <div class="container" style="max-width: 500px;">
                <div class="text-center" style="margin-bottom: var(--space-8);">
                    <h1 class="page-title">Welcome to OAuth Hub</h1>
                    <p class="page-description">Sign in to manage your OAuth applications</p>
                </div>
                
                <div class="card">
                    <div style="text-align: center; margin-bottom: var(--space-6);">
                                            <div id="mode-switcher">
                        <button id="login-tab" class="btn btn-primary" onclick="switchMode('login')">Login</button>
                        <button id="signup-tab" class="btn btn-secondary" onclick="switchMode('signup')">Sign Up</button>
                        <button id="reset-tab" class="btn btn-secondary" onclick="switchMode('reset')" style="display: none;">Reset Password</button>
                    </div>
                    </div>
                    
                    <form id="auth-form">
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" id="email" class="form-input" placeholder="your@email.com" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" id="password-label">Password</label>
                            <input type="password" id="password" class="form-input" placeholder="Enter your password (min 8 chars)" required minlength="8">
                        </div>
                        
                        <div id="signup-fields" style="display: none;">
                            <div class="form-group">
                                <label class="form-label">Full Name</label>
                                <input type="text" id="fullName" class="form-input" placeholder="Your full name">
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: var(--space-4);">
                            <span id="submit-text">Login</span>
                        </button>
                    </form>
                    
                    <div id="message" style="margin-top: var(--space-4); text-align: center; display: none;"></div>
                </div>
            </div>
        </main>
    </div>
    
    <script>
        let currentMode = 'login';
        
        function switchMode(mode) {
            currentMode = mode;
            const loginTab = document.getElementById('login-tab');
            const signupTab = document.getElementById('signup-tab');
            const resetTab = document.getElementById('reset-tab');
            const signupFields = document.getElementById('signup-fields');
            const submitText = document.getElementById('submit-text');
            const passwordLabel = document.getElementById('password-label');
            const passwordInput = document.getElementById('password');
            
            // Reset all tabs
            loginTab.className = 'btn btn-secondary';
            signupTab.className = 'btn btn-secondary';
            resetTab.className = 'btn btn-secondary';
            
            if (mode === 'login') {
                loginTab.className = 'btn btn-primary';
                signupFields.style.display = 'none';
                submitText.textContent = 'Login';
                passwordLabel.textContent = 'Password';
                passwordInput.placeholder = 'Enter your password (min 8 chars)';
            } else if (mode === 'signup') {
                signupTab.className = 'btn btn-primary';
                signupFields.style.display = 'block';
                submitText.textContent = 'Sign Up';
                passwordLabel.textContent = 'Password';
                passwordInput.placeholder = 'Enter your password (min 8 chars)';
            } else if (mode === 'reset') {
                resetTab.className = 'btn btn-primary';
                signupFields.style.display = 'none';
                submitText.textContent = 'Reset Password';
                passwordLabel.textContent = 'New Password';
                passwordInput.placeholder = 'Enter your new password (min 8 chars)';
            }
        }
        
        function showPasswordReset(email) {
            document.getElementById('reset-tab').style.display = 'inline-block';
            document.getElementById('email').value = email;
            switchMode('reset');
            showMessage('Your account requires a password reset. Please set a new password.', false);
        }
        
        function showMessage(text, isError = false) {
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = text;
            messageDiv.style.display = 'block';
            messageDiv.style.color = isError ? 'var(--danger-500)' : 'var(--success-500)';
        }
        
        document.getElementById('auth-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const fullName = document.getElementById('fullName').value;
            
            if (password.length < 8) {
                showMessage('Password must be at least 8 characters long', true);
                return;
            }
            
            let endpoint = '/auth';
            const data = {
                mode: currentMode,
                email,
                password
            };
            
            if (currentMode === 'signup') {
                data.fullName = fullName;
            } else if (currentMode === 'reset') {
                endpoint = '/reset-password';
                data.newPassword = password;
                delete data.mode;
            }
            
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include', // Important for session cookies
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Session is set via secure cookie, no need for localStorage
                    const message = currentMode === 'reset' ? 'Password reset successfully! Redirecting to dashboard...' : 'Success! Redirecting to dashboard...';
                    showMessage(message, false);
                    
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1500);
                } else {
                    // Check if this is a password reset required error
                    if (result.requiresPasswordReset) {
                        showPasswordReset(result.email);
                    } else {
                        showMessage(result.error || 'Authentication failed', true);
                    }
                }
            } catch (error) {
                showMessage('Network error. Please try again.', true);
            }
        });
        
        // Check if already logged in via session cookie
        // This will be handled server-side, so we can remove this check
    </script>
</body>
</html>`;
}