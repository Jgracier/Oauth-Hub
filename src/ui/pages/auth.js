// Reverted Auth Page for Passport + JWT
const AuthPage = () => `
  <div class="auth-page">
    <h1>OAuth Hub</h1>
    <div class="login-form">
      <h2>Login</h2>
      <form id="loginForm">
        <input type="email" id="email" placeholder="Email" required />
        <input type="password" id="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
                        </div>
    <div class="signup-form">
      <h2>Sign Up</h2>
      <form id="signupForm">
        <input type="email" id="signupEmail" placeholder="Email" required />
        <input type="password" id="signupPassword" placeholder="Password" minlength="8" required />
        <input type="text" id="fullName" placeholder="Full Name" />
        <button type="submit">Sign Up</button>
                    </form>
            </div>
    <div class="external-providers">
      <h3>Or continue with</h3>
      <a href="/auth/google">Google</a>
      <a href="/auth/github">GitHub</a>
      <!-- More -->
    </div>
  </div>
    <script>
    const handleLogin = async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        const res = await fetch('/auth/login', {
            method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('jwt_token', data.token);
          localStorage.setItem('userEmail', data.user.email);
          window.location.href = '/dashboard';
          } else {
          alert(data.error);
        }
      } catch (err) {
        alert('Login failed');
      }
    };

    const handleSignup = async (e) => {
      e.preventDefault();
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const fullName = document.getElementById('fullName').value;
      try {
        const res = await fetch('/auth/signup', {
            method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, fullName })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem('jwt_token', data.token);
          localStorage.setItem('userEmail', data.user.email);
          window.location.href = '/dashboard';
          } else {
          alert(data.error);
        }
      } catch (err) {
        alert('Signup failed');
      }
    };

    // External redirects already handled by links

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);

    // Handle token from query (for external OAuth redirects)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('jwt_token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.href = '/dashboard';
    }
    </script>
  <style> /* Existing */ </style>
`;
    
// getModernAuthPage returns AuthPage()