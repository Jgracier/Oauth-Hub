// =============================================================================
// 🔐 AUTH HANDLER - Clean authentication with proper separation of concerns
// =============================================================================

import { jsonResponse, parseJsonBody, validateEmail } from '../../lib/utils/helpers.js';
import { createSessionCookie } from '../../lib/auth/session.js';
import { AuthService } from '../../lib/services/auth.service.js';

export class AuthHandler {
  constructor(env) {
    this.env = env;
    this.authService = new AuthService(env);
  }

  /**
   * Handle login/signup using AuthService
   */
  async handleAuth(request, corsHeaders) {
    try {
      const data = await parseJsonBody(request);
      const { mode, email, password, fullName } = data;
      
      if (!validateEmail(email) || !password) {
        return jsonResponse({ error: 'Invalid email or password' }, 400, corsHeaders);
      }
      
      if (mode === 'signup') {
        const { userData, apiKey } = await this.authService.createUser(email, password, fullName);
        const sessionToken = await this.authService.createSession(userData);
        
        const headers = {
          ...corsHeaders,
          'Set-Cookie': createSessionCookie(sessionToken)
        };
        
        return jsonResponse({
          success: true,
          apiKey,
          email: userData.email,
          name: userData.name,
          message: 'Account created successfully'
        }, 200, headers);
        
      } else if (mode === 'login') {
        const { user, apiKey } = await this.authService.authenticateUser(email, password);
        const sessionToken = await this.authService.createSession(user);
        
        const headers = {
          ...corsHeaders,
          'Set-Cookie': createSessionCookie(sessionToken)
        };
        
        return jsonResponse({
          success: true,
          apiKey,
          email: user.email,
          name: user.name,
          message: 'Login successful'
        }, 200, headers);
      }
      
      return jsonResponse({ error: 'Invalid mode' }, 400, corsHeaders);
      
    } catch (error) {
      console.error('Authentication failed:', error.message);
      return jsonResponse({ 
        error: 'Authentication failed',
        message: error.message
      }, 500, corsHeaders);
    }
  }

  /**
   * Handle logout using AuthService
   */
  async handleLogout(request, corsHeaders) {
    try {
      await this.authService.destroySession(request);
      
      return jsonResponse({ success: true, message: 'Logged out' }, 200, {
        ...corsHeaders,
        'Set-Cookie': 'session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
      });
    } catch (error) {
      console.error('Logout failed:', error.message);
      return jsonResponse({ success: false, message: 'Logout failed' }, 500, corsHeaders);
    }
  }

  /**
   * Check session status using AuthService
   */
  async checkSession(request, corsHeaders) {
    try {
      const session = await this.authService.validateSession(request);
      
      if (!session) {
        return jsonResponse({ authenticated: false }, 200, corsHeaders);
      }
      
      return jsonResponse({
        authenticated: true,
        user: {
          email: session.email,
          name: session.name
        }
      }, 200, corsHeaders);
      
    } catch (error) {
      console.error('Session check failed:', error.message);
      return jsonResponse({ authenticated: false }, 200, corsHeaders);
    }
  }
}