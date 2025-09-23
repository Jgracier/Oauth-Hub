// =============================================================================
// 🔐 GOOGLE OAUTH HANDLER - Authentication with Google
// =============================================================================

import { BaseHandler } from './base.handler.js';
import { generateRandomString, generateApiKey, generateId, sanitizeInput } from '../../lib/utils/helpers.js';
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

      // Check if this is a demo credentials issue
      if (this.env.GOOGLE_CLIENT_ID === 'demo-google-client-id' ||
          (error.message && (
            error.message.includes('invalid_client') ||
            error.message.includes('OAuth2 error') ||
            error.message.includes('client was not found')
          ))
      ) {
        console.error('Demo mode detected, returning demo HTML');
        return this.htmlResponse(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>OAuth Demo Mode</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; }
                .error-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0; }
                .warning { color: #dc2626; font-weight: bold; }
                .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px; }
                .btn:hover { background: #1d4ed8; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Demo Mode</h1>
                <div class="error-box">
                  <p class="warning">⚠️ Google OAuth Demo Mode</p>
                  <p>This OAuth Hub is currently running in demo mode. To use Google OAuth authentication, you need to configure real OAuth credentials.</p>
                  <p><strong>Required Environment Variables:</strong></p>
                  <ul>
                    <li><code>GOOGLE_CLIENT_ID</code> - Your Google OAuth 2.0 Client ID</li>
                    <li><code>GOOGLE_CLIENT_SECRET</code> - Your Google OAuth 2.0 Client Secret</li>
                  </ul>
                  <p>Get these from the <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a>.</p>
                </div>
                <a href="/auth" class="btn">← Back to Login</a>
              </div>
            </body>
          </html>
        `);
      }

      return this.htmlResponse(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Authentication Error</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; }
              .error-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0; }
              .warning { color: #dc2626; font-weight: bold; }
              .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px; }
              .btn:hover { background: #1d4ed8; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Authentication Error</h1>
              <div class="error-box">
                <p class="warning">❌ Authentication Failed</p>
                <p>There was an unexpected error during Google authentication. This might be a temporary issue with the OAuth provider or our servers.</p>
                <p>Please try again in a few moments.</p>
              </div>
              <a href="/auth" class="btn">← Back to Login</a>
            </div>
          </body>
        </html>
      `, 500);
    }
  }
  
  async initiateGoogleAuth(request) {
    try {
      // Use the unified OAuth service for consistent OAuth flow
      const { generateConsentUrl } = await import('../../core/platforms/oauth/oauth-service.js');

      // Generate state parameter for security
      const state = generateRandomString(32);

      // Create virtual user app config for authentication (demo credentials for development)
      const userApp = {
        platform: 'google',
        clientId: this.env.GOOGLE_CLIENT_ID || 'demo-google-client-id',
        clientSecret: this.env.GOOGLE_CLIENT_SECRET || 'demo-google-client-secret',
        scopes: ['openid', 'email', 'profile'] // Standard Google auth scopes
      };

      // Generate consent URL using the same service as OAuth apps
      const consentUrl = await generateConsentUrl('google', userApp, 'auth-system', state, 'https://oauth-hub.com/auth/google');

      return Response.redirect(consentUrl, 302);

    } catch (error) {
      console.error('Error initiating Google auth:', error);
      console.error('Error stack:', error.stack);
      return this.jsonResponse({ error: 'Failed to initiate Google authentication', details: error.message }, 500);
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
      
      // Exchange code for tokens using unified OAuth service
      const { exchangeCodeForToken, getUserInfo } = await import('../../core/platforms/oauth/oauth-service.js');

      // Create virtual user app config for authentication
      const userApp = {
        platform: 'google',
        clientId: this.env.GOOGLE_CLIENT_ID || 'demo-google-client-id',
        clientSecret: this.env.GOOGLE_CLIENT_SECRET || 'demo-google-client-secret',
        scopes: ['openid', 'email', 'profile']
      };

      let tokens;
      try {
        tokens = await exchangeCodeForToken('google', code, userApp);
      } catch (error) {
        console.error('Token exchange error:', error);

        if (this.env.GOOGLE_CLIENT_ID === 'demo-google-client-id' ||
            (error.message && (
              error.message.includes('invalid_client') ||
              error.message.includes('OAuth2 error') ||
              error.message.includes('client was not found') ||
              error.message.includes('Demo mode:')
            ))
        ) {
          return this.htmlResponse(`
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OAuth Demo Mode</title>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; line-height: 1.6; }
                  .container { max-width: 600px; margin: 0 auto; }
                  .error-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0; }
                  .warning { color: #dc2626; font-weight: bold; }
                  .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px; }
                  .btn:hover { background: #1d4ed8; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>Demo Mode</h1>
                  <div class="error-box">
                    <p class="warning">⚠️ Google OAuth Demo Mode</p>
                    <p>This OAuth Hub is currently running in demo mode. To use Google OAuth authentication, you need to configure real OAuth credentials.</p>
                    <p><strong>Required Environment Variables:</strong></p>
                    <ul>
                      <li><code>GOOGLE_CLIENT_ID</code> - Your Google OAuth 2.0 Client ID</li>
                      <li><code>GOOGLE_CLIENT_SECRET</code> - Your Google OAuth 2.0 Client Secret</li>
                    </ul>
                    <p>Get these from the <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a>.</p>
                  </div>
                  <a href="/auth" class="btn">← Back to Login</a>
                </div>
              </body>
            </html>
          `);
        }
        throw error;
      }

      if (!tokens) {
        return this.htmlResponse(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Token Exchange Failed</title>
            </head>
            <body>
              <script>
                alert('Failed to exchange authorization code for tokens.');
                window.location.href = '/auth';
              </script>
              <p>If you are not redirected automatically, <a href="/auth">click here</a>.</p>
            </body>
          </html>
        `);
      }
      
      // Get user info from Google using unified OAuth service
      const userInfo = await getUserInfo('google', tokens.access_token, userApp);
      
      if (!userInfo) {
        return this.htmlResponse(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>User Info Error</title>
            </head>
            <body>
              <script>
                alert('Failed to get user information from Google.');
                window.location.href = '/auth';
              </script>
              <p>If you are not redirected automatically, <a href="/auth">click here</a>.</p>
            </body>
          </html>
        `);
      }
      
      // Create or login user using existing auth service
      const { user, apiKey } = await this.createOrLoginGoogleUser(userInfo);
      
      if (!user) {
        return this.htmlResponse(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Account Creation Error</title>
            </head>
            <body>
              <script>
                alert('Failed to create or login user.');
                window.location.href = '/auth';
              </script>
              <p>If you are not redirected automatically, <a href="/auth">click here</a>.</p>
            </body>
          </html>
        `);
      }
      
      // Create session using existing auth service
      const sessionToken = await this.authService.createSession(user);
      
      // Return success page that sets cookie and redirects (using auth service cookie format)
      const sessionCookie = await import('../../lib/auth/session.js').then(m => m.createSessionCookie(sessionToken));
      
      return new Response(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Successful</title>
          </head>
          <body>
            <script>
              // Store user info in localStorage
              localStorage.setItem('userEmail', '${user.email}');
              localStorage.setItem('userName', '${user.name}');
              ${apiKey ? `localStorage.setItem('defaultApiKey', '${apiKey}');` : ''}

              // Redirect to dashboard
              window.location.href = '/dashboard';
            </script>
            <p>Login successful! Redirecting to dashboard...</p>
            <p>If you are not redirected automatically, <a href="/dashboard">click here</a>.</p>
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
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Authentication Error</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; }
              .error-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0; }
              .warning { color: #dc2626; font-weight: bold; }
              .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px; }
              .btn:hover { background: #1d4ed8; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Authentication Error</h1>
              <div class="error-box">
                <p class="warning">❌ Authentication Failed</p>
                <p>There was an unexpected error during Google authentication. This might be a temporary issue with the OAuth provider or our servers.</p>
                <p>Please try again in a few moments.</p>
              </div>
              <a href="/auth" class="btn">← Back to Login</a>
            </div>
            <script>
              // Also show alert for immediate feedback
              setTimeout(() => {
                alert('Authentication failed. Please try again.');
              }, 500);
            </script>
          </body>
        </html>
      `, 500);
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
