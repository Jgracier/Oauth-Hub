// =============================================================================
// 🔐 AUTH HANDLER - Authentication API endpoints
// =============================================================================

import { jsonResponse, parseJsonBody, validateEmail } from '../../lib/utils/helpers.js';
import { verifyPassword, createSessionToken, createSessionCookie, getSessionFromRequest } from '../../lib/auth/session.js';
import { UserService } from '../../lib/services/user.service.js';
import { Logger } from '../../lib/utils/logger.js';
import { 
  AuthError, 
  InvalidCredentialsError, 
  ValidationError,
  AlreadyExistsError,
  AppError,
  serializeError
} from '../../lib/utils/errors.js';

export class AuthHandler {
  constructor(env) {
    this.env = env;
    this.userService = new UserService(env);
    this.logger = new Logger('AuthHandler', env);
  }

  /**
   * Handle login/signup
   */
  async handleAuth(request, corsHeaders) {
    const startTime = Date.now();
    let mode, email, password, fullName;
    
    try {
      const data = await parseJsonBody(request);
      ({ mode, email, password, fullName } = data);
      
      this.logger.info('Authentication request', { 
        mode, 
        email: email?.substring(0, 3) + '***',
        hasFullName: !!fullName
      });
      
      if (!validateEmail(email)) {
        throw new ValidationError('Invalid email format', 'email', email);
      }
      
      if (!password) {
        throw new ValidationError('Password is required', 'password');
      }
      
      if (mode === 'signup') {
        return await this.handleSignup(email, password, fullName, corsHeaders);
      } else {
        return await this.handleLogin(email, password, corsHeaders);
      }
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.logger.error('Authentication failed', {
        mode,
        email: email?.substring(0, 3) + '***',
        duration,
        errorType: error.constructor.name
      }, error);
      
      // Return appropriate error response based on error type
      if (error instanceof ValidationError) {
        return jsonResponse({ 
          error: error.message,
          field: error.details.field
        }, error.statusCode, corsHeaders);
      }
      
      if (error instanceof AlreadyExistsError) {
        return jsonResponse({ 
          error: error.message 
        }, error.statusCode, corsHeaders);
      }
      
      if (error instanceof AuthError) {
        return jsonResponse({ 
          error: error.message 
        }, error.statusCode, corsHeaders);
      }
      
      // Generic error for unexpected issues
      return jsonResponse({ 
        error: 'Authentication failed', 
        message: 'An unexpected error occurred'
      }, 500, corsHeaders);
    }
  }

  /**
   * Handle user signup
   */
  async handleSignup(email, password, fullName, corsHeaders) {
    try {
      const { userData } = await this.userService.create(email, password, fullName);
      
      // Create session
      const sessionToken = createSessionToken();
      const sessionData = {
        email: userData.email,
        name: userData.name,
        createdAt: new Date().toISOString()
      };
      
      await this.env.USERS.put(`session:${sessionToken}`, JSON.stringify(sessionData));
      
      return jsonResponse({
        success: true,
        message: 'Account created successfully',
        user: {
          email: userData.email,
          name: userData.name
        }
      }, 200, {
        ...corsHeaders,
        'Set-Cookie': createSessionCookie(sessionToken)
      });
    } catch (error) {
      if (error.message === 'User already exists') {
        return jsonResponse({ error: error.message }, 400, corsHeaders);
      }
      throw error;
    }
  }

  /**
   * Handle user login
   */
  async handleLogin(email, password, corsHeaders) {
    const startTime = Date.now();
    
    try {
      this.logger.info('User login attempt', { 
        email: email?.substring(0, 3) + '***' 
      });
      
      const userResult = await this.userService.findByEmail(email);
      if (!userResult) {
        this.logger.warn('Login failed - user not found', { 
          email: email?.substring(0, 3) + '***' 
        });
        throw new InvalidCredentialsError();
      }
      
      const { userData } = userResult;
      
      // Verify password
      const isValid = await verifyPassword(password, userData.passwordHash, userData.passwordSalt);
      if (!isValid) {
        this.logger.warn('Login failed - invalid password', { 
          userId: userData.id,
          email: email?.substring(0, 3) + '***' 
        });
        throw new InvalidCredentialsError();
      }
      
      // Create session
      const sessionToken = createSessionToken();
      const sessionData = {
        email: userData.email,
        name: userData.name,
        createdAt: new Date().toISOString()
      };
      
      await this.env.USERS.put(`session:${sessionToken}`, JSON.stringify(sessionData));
      
      this.logger.info('User login successful', {
        userId: userData.id,
        email: email?.substring(0, 3) + '***',
        duration: Date.now() - startTime
      });
      
      return jsonResponse({
        success: true,
        message: 'Login successful',
        user: {
          email: userData.email,
          name: userData.name
        }
      }, 200, {
        ...corsHeaders,
        'Set-Cookie': createSessionCookie(sessionToken)
      });
      
    } catch (error) {
      this.logger.error('Login failed', {
        email: email?.substring(0, 3) + '***',
        duration: Date.now() - startTime
      }, error);
      
      if (error instanceof InvalidCredentialsError) {
        throw error;
      }
      
      throw new AuthError('Login failed due to system error', 'LOGIN_SYSTEM_ERROR');
    }
  }

  /**
   * Handle logout
   */
  async handleLogout(request, corsHeaders) {
    const sessionToken = getSessionFromRequest(request);
    if (sessionToken) {
      await this.env.USERS.delete(`session:${sessionToken}`);
    }
    
    return jsonResponse({ success: true, message: 'Logged out' }, 200, {
      ...corsHeaders,
      'Set-Cookie': 'session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
    });
  }

  /**
   * Check session status
   */
  async checkSession(request, corsHeaders) {
    const sessionToken = getSessionFromRequest(request);
    if (!sessionToken) {
      return jsonResponse({ authenticated: false }, 200, corsHeaders);
    }
    
    const user = await this.userService.getBySessionToken(sessionToken);
    if (!user) {
      return jsonResponse({ authenticated: false }, 200, corsHeaders);
    }
    
    return jsonResponse({
      authenticated: true,
      user: {
        email: user.userData.email,
        name: user.userData.name
      }
    }, 200, corsHeaders);
  }
}
