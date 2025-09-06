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
                        </div>
                    </div>
                    
                    <form id="auth-form">
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" id="email" class="form-input" placeholder="your@email.com" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" id="password" class="form-input" placeholder="Enter your password" required>
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
            const signupFields = document.getElementById('signup-fields');
            const submitText = document.getElementById('submit-text');
            
            if (mode === 'login') {
                loginTab.className = 'btn btn-primary';
                signupTab.className = 'btn btn-secondary';
                signupFields.style.display = 'none';
                submitText.textContent = 'Login';
            } else {
                loginTab.className = 'btn btn-secondary';
                signupTab.className = 'btn btn-primary';
                signupFields.style.display = 'block';
                submitText.textContent = 'Sign Up';
            }
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
            
            const data = {
                mode: currentMode,
                email,
                password
            };
            
            if (currentMode === 'signup') {
                data.fullName = fullName;
            }
            
            try {
                const response = await fetch('/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Store user info in localStorage for display only
                    // Session cookie handles actual authentication
                    localStorage.setItem('userEmail', result.email);
                    localStorage.setItem('userName', result.name);
                    if (result.apiKey) {
                        localStorage.setItem('defaultApiKey', result.apiKey);
                    }
                    
                    showMessage('Success! Redirecting to dashboard...', false);
                    
                    // Immediate redirect to avoid session cookie timing issues
                    window.location.href = '/dashboard';
                } else {
                    showMessage(result.error || 'Authentication failed', true);
                }
            } catch (error) {
                showMessage('Network error. Please try again.', true);
            }
        });
        
        // Authentication page ready
    </script>
</body>
</html>`;
}