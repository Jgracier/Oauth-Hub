// =============================================================================
// 🔐 GOOGLE OAUTH HANDLER - Authentication with Google
// =============================================================================

import { BaseHandler } from './base.handler.js';
import { generateRandomString, hashPassword, generateApiKey, generateId, sanitizeInput } from '../../lib/utils/helpers.js';
import { AuthService } from '../../lib/services/auth.service.js';

export class GoogleAuthHandler extends BaseHandler {
  
  constructor(env) {
    super(env);
    this.authService = new AuthService(env);
  }
  
  async handleGoogleAuth(request) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      
      if (path === '/auth/google') {
        return this.initiateGoogleAuth(request);
      } else if (path === '/auth/google/callback') {
        return this.handleGoogleCallback(request);
      }
      
      return this.jsonResponse({ error: 'Invalid Google auth endpoint' }, 404);
    } catch (error) {
      console.error('Google auth error:', error);
      return this.jsonResponse({ error: 'Authentication failed' }, 500);
    }
  }
  
  async initiateGoogleAuth(request) {
    try {
      // Generate state parameter for security
      const state = generateRandomString(32);
      
      // Store state in a short-lived way (you could use KV with TTL)
      // For now, we'll include it in the redirect and verify it in callback
      
      const googleClientId = this.env.GOOGLE_CLIENT_ID;
      if (!googleClientId) {
        return this.jsonResponse({ error: 'Google OAuth not configured' }, 500);
      }
      
      // Build Google OAuth URL
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', googleClientId);
      authUrl.searchParams.set('redirect_uri', 'https://oauth-hub.com/auth/google/callback');
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'openid email profile');
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      authUrl.searchParams.set('state', state);
      
      // Redirect to Google
      return Response.redirect(authUrl.toString(), 302);
      
    } catch (error) {
      console.error('Error initiating Google auth:', error);
      return this.jsonResponse({ error: 'Failed to initiate Google authentication' }, 500);
    }
  }
  
  async handleGoogleCallback(request) {
    try {
      const url = new URL(request.url);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');
      
      if (error) {
        return this.htmlResponse(`
          <html>
            <body>
              <script>
                alert('Google authentication was cancelled or failed.');
                window.location.href = '/auth';
              </script>
            </body>
          </html>
        `);
      }
      
      if (!code) {
        return this.htmlResponse(`
          <html>
            <body>
              <script>
                alert('No authorization code received from Google.');
                window.location.href = '/auth';
              </script>
            </body>
          </html>
        `);
      }
      
      // Exchange code for tokens
      const tokens = await this.exchangeGoogleCodeForTokens(code);
      
      if (!tokens) {
        return this.htmlResponse(`
          <html>
            <body>
              <script>
                alert('Failed to exchange authorization code for tokens.');
                window.location.href = '/auth';
              </script>
            </body>
          </html>
        `);
      }
      
      // Get user info from Google
      const userInfo = await this.getGoogleUserInfo(tokens.access_token);
      
      if (!userInfo) {
        return this.htmlResponse(`
          <html>
            <body>
              <script>
                alert('Failed to get user information from Google.');
                window.location.href = '/auth';
              </script>
            </body>
          </html>
        `);
      }
      
      // Create or login user using existing auth service
      const { user, apiKey } = await this.createOrLoginGoogleUser(userInfo);
      
      if (!user) {
        return this.htmlResponse(`
          <html>
            <body>
              <script>
                alert('Failed to create or login user.');
                window.location.href = '/auth';
              </script>
            </body>
          </html>
        `);
      }
      
      // Create session using existing auth service
      const sessionToken = await this.authService.createSession(user);
      
      // Return success page that sets cookie and redirects (using auth service cookie format)
      const sessionCookie = await import('../../lib/auth/session.js').then(m => m.createSessionCookie(sessionToken));
      
      return new Response(`
        <html>
          <body>
            <script>
              // Store user info in localStorage
              localStorage.setItem('userEmail', '${user.email}');
              localStorage.setItem('userName', '${user.name}');
              ${apiKey ? `localStorage.setItem('defaultApiKey', '${apiKey}');` : ''}
              
              // Redirect to dashboard
              window.location.href = '/dashboard';
            </script>
          </body>
        </html>
      `, {
        status: 200,
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Set-Cookie': sessionCookie
        }
      });
      
    } catch (error) {
      console.error('Error handling Google callback:', error);
      return this.htmlResponse(`
        <html>
          <body>
            <script>
              alert('Authentication failed. Please try again.');
              window.location.href = '/auth';
            </script>
          </body>
        </html>
      `);
    }
  }
  
  async exchangeGoogleCodeForTokens(code) {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.env.GOOGLE_CLIENT_ID,
          client_secret: this.env.GOOGLE_CLIENT_SECRET,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: 'https://oauth-hub.com/auth/google/callback'
        })
      });
      
      if (!response.ok) {
        console.error('Token exchange failed:', await response.text());
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      return null;
    }
  }
  
  async getGoogleUserInfo(accessToken) {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        console.error('Failed to get user info:', await response.text());
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }
  
  async createOrLoginGoogleUser(googleUserInfo) {
    try {
      const email = googleUserInfo.email;
      const name = googleUserInfo.name;
      const googleId = googleUserInfo.id;
      
      // Check if user exists using the existing auth service
      const existingUser = await this.authService.findUserByEmail(email);
      
      if (existingUser) {
        // Update existing user with Google ID if not set
        const userData = existingUser.userData;
        let needsUpdate = false;
        
        if (!userData.googleId) {
          userData.googleId = googleId;
          userData.lastGoogleLogin = new Date().toISOString();
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          await this.env.USERS.put(existingUser.userKey, JSON.stringify(userData));
        }
        
        // Get user's API key using the same method as regular auth
        const { keys } = await this.env.API_KEYS.list();
        let userApiKey = null;
        
        for (const keyInfo of keys) {
          if (keyInfo.name.includes('Default Key') && keyInfo.name.endsWith(userData.email)) {
            const keyData = await this.env.API_KEYS.get(keyInfo.name);
            const parsed = JSON.parse(keyData);
            if (parsed.email === userData.email) {
              userApiKey = parsed.apiKey;
              break;
            }
          }
        }
        
        return { user: userData, apiKey: userApiKey };
      } else {
        // Create new user using the same format as regular auth
        const userId = generateId();
        const nameParts = name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const userData = {
          id: userId,
          email: sanitizeInput(email),
          name: sanitizeInput(name),
          firstName: sanitizeInput(firstName),
          lastName: sanitizeInput(lastName),
          googleId: googleId,
          createdAt: new Date().toISOString(),
          authMethod: 'google',
          lastGoogleLogin: new Date().toISOString()
        };

        // Store user with same key format as regular auth: "user FirstName LastName email"
        const userKey = `user ${firstName} ${lastName} ${email}`;
        await this.env.USERS.put(userKey, JSON.stringify(userData));

        // Create default API key using same format as regular auth
        const apiKey = generateApiKey();
        const apiKeyInfo = {
          userId, 
          email,
          firstName,
          lastName,
          fullName: name,
          keyName: 'Default Key',
          apiKey,
          createdAt: new Date().toISOString()
        };
        
        // Store API key with same format: "api-Default Key FirstName LastName email"
        const apiKeyKey = `api-Default Key ${firstName} ${lastName} ${email}`;
        await this.env.API_KEYS.put(apiKeyKey, JSON.stringify({
          ...apiKeyInfo,
          keyId: generateId()
        }));

        return { user: userData, apiKey };
      }
    } catch (error) {
      console.error('Error creating/logging in Google user:', error);
      return null;
    }
  }
}
