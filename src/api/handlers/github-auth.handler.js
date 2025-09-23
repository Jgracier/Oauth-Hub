// =============================================================================
// 🐙 GITHUB OAUTH HANDLER - Authentication with GitHub
// =============================================================================

import { BaseHandler } from './base.handler.js';
import { generateRandomString, generateApiKey, generateId, sanitizeInput } from '../../lib/utils/helpers.js';
import { AuthService } from '../../lib/services/auth.service.js';
import { createSessionCookie } from '../../lib/auth/session.js';

export class GitHubAuthHandler extends BaseHandler {
  
  constructor(env) {
    super(env);
    this.authService = new AuthService(env);
  }
  
  async handleGitHubAuth(request) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      
      if (path === '/auth/github') {
        return this.initiateGitHubAuth(request);
      } else if (path === '/auth/github/callback') {
        return this.handleGitHubCallback(request);
      }
      
      return this.jsonResponse({ error: 'Invalid GitHub auth endpoint' }, 404);
    } catch (error) {
      console.error('GitHub auth error:', error);
      return this.jsonResponse({ error: 'Authentication failed' }, 500);
    }
  }
  
  async initiateGitHubAuth(request) {
    try {
      // Use the unified OAuth service for consistent OAuth flow
      const { generateConsentUrl } = await import('../../core/platforms/oauth/oauth-service.js');

      // Generate state parameter for security
      const state = generateRandomString(32);

      // Create virtual user app config for authentication (demo credentials for development)
      const userApp = {
        platform: 'github',
        clientId: this.env.GITHUB_CLIENT_ID || 'demo-github-client-id',
        clientSecret: this.env.GITHUB_CLIENT_SECRET || 'demo-github-client-secret',
        scopes: ['user:email'] // Standard GitHub auth scopes
      };

      // Generate consent URL using the same service as OAuth apps
      const consentUrl = await generateConsentUrl('github', userApp, 'auth-system', state, 'https://oauth-hub.com/auth/github');

      return Response.redirect(consentUrl, 302);

    } catch (error) {
      console.error('Error initiating GitHub auth:', error);
      console.error('Error stack:', error.stack);
      return this.jsonResponse({ error: 'Failed to initiate GitHub authentication', details: error.message }, 500);
    }
  }
  
  async handleGitHubCallback(request) {
    try {
      const url = new URL(request.url);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      // Check for demo mode first - provide clear error message
      if (!this.env.GITHUB_CLIENT_ID || this.env.GITHUB_CLIENT_ID === 'demo-github-client-id') {
        return this.htmlResponse(`
          <html>
            <body>
              <script>
                alert('Demo Mode: GitHub OAuth requires real credentials.\\n\\nPlease configure these environment variables:\\n• GITHUB_CLIENT_ID\\n• GITHUB_CLIENT_SECRET\\n\\nThen restart the application.');
                window.location.href = '/auth';
              </script>
            </body>
          </html>
        `);
      }

      if (error) {
        return this.htmlResponse(`
          <html>
            <body>
              <script>
                alert('GitHub authentication was cancelled or failed.');
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
                alert('No authorization code received from GitHub.');
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
        platform: 'github',
        clientId: this.env.GITHUB_CLIENT_ID || 'demo-github-client-id',
        clientSecret: this.env.GITHUB_CLIENT_SECRET || 'demo-github-client-secret',
        scopes: ['user:email']
      };

      let tokens;
      try {
        tokens = await exchangeCodeForToken('github', code, userApp);
      } catch (error) {
        console.error('Token exchange error:', error);
        if (error.message.includes('Demo mode:') || this.env.GITHUB_CLIENT_ID === 'demo-github-client-id') {
          return this.htmlResponse(`
            <html>
              <body>
                <script>
                  alert('Demo Mode: GitHub OAuth requires real credentials. Please configure GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.');
                  window.location.href = '/auth';
                </script>
              </body>
            </html>
          `);
        }
        throw error;
      }

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
      
      // Get user info from GitHub using unified OAuth service
      const userInfo = await getUserInfo('github', tokens.access_token, userApp);
      
      if (!userInfo) {
        return this.htmlResponse(`
          <html>
            <body>
              <script>
                alert('Failed to get user information from GitHub.');
                window.location.href = '/auth';
              </script>
            </body>
          </html>
        `);
      }
      
      // Create or login user using existing auth service
      const { user, apiKey } = await this.createOrLoginGitHubUser(userInfo);
      
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
      
      // Return success page that sets cookie and redirects
      const sessionCookie = createSessionCookie(sessionToken);
      
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
      console.error('Error handling GitHub callback:', error);
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
  
  
  
  async createOrLoginGitHubUser(githubUserInfo) {
    try {
      const email = githubUserInfo.email;
      const name = githubUserInfo.name || githubUserInfo.login; // Use login if name not set
      const githubId = githubUserInfo.id;
      
      console.log(`GitHub OAuth: Processing user ${email} (${name})`);
      
      if (!email) {
        console.error('No email available from GitHub user info');
        return null;
      }
      
      // Debug: List all user keys to see what exists
      const { keys } = await this.env.USERS.list();
      console.log(`All user keys in KV:`, keys.map(k => k.name).filter(name => name.startsWith('user ')));
      
      // Check if user exists using the existing auth service
      const existingUser = await this.authService.findUserByEmail(email);
      console.log(`findUserByEmail result for ${email}:`, existingUser ? existingUser.userKey : 'NOT FOUND');
      
      if (existingUser) {
        console.log(`Found existing user: ${existingUser.userKey}`);
        
        // Update existing user with GitHub data
        const userData = existingUser.userData;
        let needsUpdate = false;
        
        if (!userData.githubId) {
          userData.githubId = githubId;
          needsUpdate = true;
          console.log(`Adding GitHub ID to existing user: ${userData.email}`);
        }
        
        // Store additional GitHub profile data
        if (!userData.githubProfile) {
          userData.githubProfile = {
            id: githubUserInfo.id,
            login: githubUserInfo.login,
            name: githubUserInfo.name,
            email: githubUserInfo.email,
            avatar_url: githubUserInfo.avatar_url,
            bio: githubUserInfo.bio,
            company: githubUserInfo.company,
            location: githubUserInfo.location,
            blog: githubUserInfo.blog,
            twitter_username: githubUserInfo.twitter_username,
            public_repos: githubUserInfo.public_repos,
            public_gists: githubUserInfo.public_gists,
            followers: githubUserInfo.followers,
            following: githubUserInfo.following,
            created_at: githubUserInfo.created_at,
            updated_at: githubUserInfo.updated_at,
            lastUpdated: new Date().toISOString()
          };
          needsUpdate = true;
          console.log(`Storing GitHub profile data for user: ${userData.email}`);
        }
        
        // Always update last login time and GitHub login time
        userData.lastLogin = Date.now();
        userData.lastGitHubLogin = new Date().toISOString();
        needsUpdate = true;
        
        if (needsUpdate) {
          await this.env.USERS.put(existingUser.userKey, JSON.stringify(userData));
          console.log(`Updated existing user record: ${existingUser.userKey}`);
        }
        
        // Get user's API key using the same method as regular auth
        const { keys: apiKeys } = await this.env.API_KEYS.list();
        let userApiKey = null;
        
        for (const keyInfo of apiKeys) {
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
          userData.githubId = githubId;
          userData.lastGitHubLogin = new Date().toISOString();
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
        
        console.log(`Truly creating new user for GitHub OAuth: ${email}`);
        
        // Create new user using AuthService to ensure same format
        const nameParts = name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Use a temporary password since this is GitHub OAuth
        const tempPassword = generateRandomString(32);
        
        // Create user through AuthService to ensure same storage format
        const { userData, apiKey } = await this.authService.createUser(email, tempPassword, name);
        
        // Update the created user with GitHub-specific info
        userData.githubId = githubId;
        userData.authMethod = 'github';
        userData.lastGitHubLogin = new Date().toISOString();
        userData.hasPassword = false; // Mark that this user doesn't have a password set
        userData.githubProfile = {
          id: githubUserInfo.id,
          login: githubUserInfo.login,
          name: githubUserInfo.name,
          email: githubUserInfo.email,
          avatar_url: githubUserInfo.avatar_url,
          bio: githubUserInfo.bio,
          company: githubUserInfo.company,
          location: githubUserInfo.location,
          blog: githubUserInfo.blog,
          twitter_username: githubUserInfo.twitter_username,
          public_repos: githubUserInfo.public_repos,
          public_gists: githubUserInfo.public_gists,
          followers: githubUserInfo.followers,
          following: githubUserInfo.following,
          created_at: githubUserInfo.created_at,
          updated_at: githubUserInfo.updated_at,
          lastUpdated: new Date().toISOString()
        };
        
        // Find the user key that was just created and update it
        const userResult = await this.authService.findUserByEmail(email);
        if (userResult) {
          await this.env.USERS.put(userResult.userKey, JSON.stringify(userData));
          console.log(`Created and updated GitHub user: ${userResult.userKey}`);
        }
        
        return { user: userData, apiKey };
      }
    } catch (error) {
      console.error('Error creating/logging in GitHub user:', error);
      return null;
    }
  }
}
