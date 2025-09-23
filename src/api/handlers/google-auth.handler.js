// =============================================================================
// 🔐 GOOGLE OAUTH HANDLER - Authentication with Google
// =============================================================================

import { BaseHandler } from './base.handler.js';
import { generateRandomString, generateApiKey, generateId, sanitizeInput } from '../../lib/utils/helpers.js';
import { AuthService } from '../../lib/services/auth.service.js';
import { AuthorizationCode } from 'simple-oauth2';

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
      
      const googleClientId = this.env.GOOGLE_CLIENT_ID || 'demo-google-client-id';
      
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
      const clientConfig = {
        client: {
          id: this.env.GOOGLE_CLIENT_ID || 'demo-google-client-id',
          secret: this.env.GOOGLE_CLIENT_SECRET || 'demo-google-client-secret'
        },
        auth: {
          tokenHost: 'oauth2.googleapis.com',
          tokenPath: '/token',
          authorizeHost: 'accounts.google.com',
          authorizePath: '/o/oauth2/v2/auth'
        },
        options: { useBasicAuthorizationHeader: false }
      };

      const client = new AuthorizationCode(clientConfig);

      const result = await client.getToken({
        code,
        redirect_uri: 'https://oauth-hub.com/auth/google/callback'
      });

      return result;
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
      
      console.log(`Google OAuth: Processing user ${email} (${name})`);
      
      // Debug: List all user keys to see what exists
      const { keys } = await this.env.USERS.list();
      console.log(`All user keys in KV:`, keys.map(k => k.name).filter(name => name.startsWith('user ')));
      
      // Check if user exists using the existing auth service
      const existingUser = await this.authService.findUserByEmail(email);
      console.log(`findUserByEmail result for ${email}:`, existingUser ? existingUser.userKey : 'NOT FOUND');
      
      if (existingUser) {
        console.log(`Found existing user: ${existingUser.userKey}`);
        
        // Update existing user with Google data
        const userData = existingUser.userData;
        let needsUpdate = false;
        
        if (!userData.googleId) {
          userData.googleId = googleId;
          needsUpdate = true;
          console.log(`Adding Google ID to existing user: ${userData.email}`);
        }
        
        // Store additional Google profile data
        if (!userData.googleProfile) {
          userData.googleProfile = {
            id: googleUserInfo.id,
            email: googleUserInfo.email,
            verified_email: googleUserInfo.verified_email,
            name: googleUserInfo.name,
            given_name: googleUserInfo.given_name,
            family_name: googleUserInfo.family_name,
            picture: googleUserInfo.picture,
            locale: googleUserInfo.locale,
            lastUpdated: new Date().toISOString()
          };
          needsUpdate = true;
          console.log(`Storing Google profile data for user: ${userData.email}`);
        }
        
        // Always update last login time and Google login time
        userData.lastLogin = Date.now();
        userData.lastGoogleLogin = new Date().toISOString();
        needsUpdate = true;
        
        if (needsUpdate) {
          await this.env.USERS.put(existingUser.userKey, JSON.stringify(userData));
          console.log(`Updated existing user record: ${existingUser.userKey}`);
        }
        
        // Get user's API key using the same method as regular auth
        const { keys } = await this.env.API_KEYS.list();
        let userApiKey = null;
        
        for (const keyInfo of keys) {
          if (keyInfo.name.includes('Default Key') && keyInfo.name.endsWith(userData.email)) {
            const keyData = await this.env.API_KEYS.get(keyInfo.name);
            if (keyData) {
              const parsed = JSON.parse(keyData);
              if (parsed.email === userData.email) {
                userApiKey = parsed.apiKey;
                console.log(`Found existing API key for user: ${userData.email}`);
                break;
              }
            }
          }
        }
        
        return { user: userData, apiKey: userApiKey };
      } else {
        console.log(`No existing user found for ${email}. Checking if we should create new user...`);
        
        // Double-check by manually searching all user records to be absolutely sure
        let manualCheck = null;
        for (const keyInfo of keys) {
          if (keyInfo.name.startsWith('user ') && keyInfo.name.includes(email)) {
            console.log(`Manual check found potential match: ${keyInfo.name}`);
            const userData = await this.env.USERS.get(keyInfo.name);
            if (userData) {
              const parsedUser = JSON.parse(userData);
              if (parsedUser.email === email) {
                console.log(`Manual check confirmed match: ${keyInfo.name}`);
                manualCheck = { userData: parsedUser, userKey: keyInfo.name };
                break;
              }
            }
          }
        }
        
        if (manualCheck) {
          console.log(`Manual check found user that findUserByEmail missed: ${manualCheck.userKey}`);
          // Use the manually found user instead of creating new one
          const userData = manualCheck.userData;
          userData.googleId = googleId;
          userData.lastGoogleLogin = new Date().toISOString();
          userData.lastLogin = Date.now();
          
          await this.env.USERS.put(manualCheck.userKey, JSON.stringify(userData));
          
          // Get API key
          const apiKeyKeys = await this.env.API_KEYS.list();
          let userApiKey = null;
          for (const keyInfo of apiKeyKeys.keys) {
            if (keyInfo.name.includes('Default Key') && keyInfo.name.endsWith(userData.email)) {
              const keyData = await this.env.API_KEYS.get(keyInfo.name);
              if (keyData) {
                const parsed = JSON.parse(keyData);
                if (parsed.email === userData.email) {
                  userApiKey = parsed.apiKey;
                  break;
                }
              }
            }
          }
          
          return { user: userData, apiKey: userApiKey };
        }
        
        console.log(`Truly creating new user for Google OAuth: ${email}`);
        
        // Create new user using AuthService to ensure same format
        const nameParts = name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Use a temporary password since this is Google OAuth
        const tempPassword = generateRandomString(32);
        
        // Create user through AuthService to ensure same storage format
        const { userData, apiKey } = await this.authService.createUser(email, tempPassword, name);
        
        // Update the created user with Google-specific info
        userData.googleId = googleId;
        userData.authMethod = 'google';
        userData.lastGoogleLogin = new Date().toISOString();
        userData.hasPassword = false; // Mark that this user doesn't have a password set
        userData.googleProfile = {
          id: googleUserInfo.id,
          email: googleUserInfo.email,
          verified_email: googleUserInfo.verified_email,
          name: googleUserInfo.name,
          given_name: googleUserInfo.given_name,
          family_name: googleUserInfo.family_name,
          picture: googleUserInfo.picture,
          locale: googleUserInfo.locale,
          lastUpdated: new Date().toISOString()
        };
        
        // Find the user key that was just created and update it
        const userResult = await this.authService.findUserByEmail(email);
        if (userResult) {
          await this.env.USERS.put(userResult.userKey, JSON.stringify(userData));
          console.log(`Created and updated Google user: ${userResult.userKey}`);
        }
        
        return { user: userData, apiKey };
      }
    } catch (error) {
      console.error('Error creating/logging in Google user:', error);
      return null;
    }
  }
}
